import React, { useState, useEffect } from 'react';
import {
  Upload, ShieldCheck, CheckCircle2, XCircle,
  Search, RefreshCw, AlertCircle,
  Database, Plus, Lock, Clock,
  BarChart2, Activity, HelpCircle, ThumbsUp, ThumbsDown, MessageSquare, Bot
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { RagService } from '../../services/ragService';
import {
  RealKnowledgeDocument,
  DocumentChunk,
  DocumentCategoryDefinition,
  HCM_STANDARD_CATEGORIES,
  RagAnalyticsSummary
} from '../../rag/types/ragTypes';

export const RagKnowledgeManager: React.FC = () => {
  const { profile, roles } = useAuth();

  const [activeTab, setActiveTab] = useState<'documents' | 'analytics'>('documents');
  const [analyticsData, setAnalyticsData] = useState<RagAnalyticsSummary | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  const [documents, setDocuments] = useState<RealKnowledgeDocument[]>([]);
  const [categories, setCategories] = useState<DocumentCategoryDefinition[]>(HCM_STANDARD_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Selected document for inspection modal
  const [inspectDoc, setInspectDoc] = useState<RealKnowledgeDocument | null>(null);
  const [inspectChunks, setInspectChunks] = useState<DocumentChunk[]>([]);
  const [isLoadingChunks, setIsLoadingChunks] = useState(false);

  // Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadAuthor, setUploadAuthor] = useState('');
  const [uploadCategory, setUploadCategory] = useState(HCM_STANDARD_CATEGORIES[0]?.id || 'bio-career');
  const [uploadDocType, setUploadDocType] = useState('article');
  const [uploadSourceUrl, setUploadSourceUrl] = useState('');
  const [uploadTextContent, setUploadTextContent] = useState('');
  const [uploadTopics, setUploadTopics] = useState('Bác Hồ, Lịch sử, Đạo đức');
  const [isSubmittingUpload, setIsSubmittingUpload] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Four-Eyes Approval Modal
  const [approvalDoc, setApprovalDoc] = useState<RealKnowledgeDocument | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessingApproval, setIsProcessingApproval] = useState(false);

  // Determine user permissions
  const userRoleCode = roles[0]?.code || 'editor';
  const canApprove = userRoleCode === 'admin' || userRoleCode === 'super_admin';

  // Load documents
  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const res = await RagService.getDocuments(statusFilter === 'all' ? undefined : statusFilter);
      setDocuments(res.documents);
      if (res.categories && res.categories.length > 0) {
        setCategories(res.categories);
      }
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAnalytics = async () => {
    setIsLoadingAnalytics(true);
    try {
      const summary = await RagService.getAnalytics(userRoleCode);
      setAnalyticsData(summary);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [statusFilter]);

  useEffect(() => {
    if (activeTab === 'analytics') {
      loadAnalytics();
    }
  }, [activeTab]);

  // Handle Inspect Document
  const handleInspect = async (doc: RealKnowledgeDocument) => {
    setInspectDoc(doc);
    setIsLoadingChunks(true);
    try {
      const detail = await RagService.getDocumentById(doc.documentId);
      if (detail) {
        setInspectChunks(detail.chunks);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingChunks(false);
    }
  };

  // Handle File Input in Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFileName(file.name);
    if (!uploadTitle) {
      setUploadTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setUploadTextContent(text || '');
    };
    reader.readAsText(file, 'utf-8');
  };

  // Handle Submit Upload
  const handleSubmitUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName || !uploadTextContent.trim()) {
      setUploadFeedback({ type: 'error', text: 'Vui lòng chọn tệp hoặc nhập nội dung văn bản.' });
      return;
    }

    setIsSubmittingUpload(true);
    setUploadFeedback(null);

    const topicsArr = uploadTopics.split(',').map(t => t.trim()).filter(Boolean);

    try {
      const res = await RagService.uploadDocument({
        fileName: uploadFileName,
        title: uploadTitle,
        textRaw: uploadTextContent,
        mimeType: uploadFileName.endsWith('.md') ? 'text/markdown' : 'text/plain',
        category: uploadCategory,
        documentType: uploadDocType as any,
        author: uploadAuthor || (profile?.full_name || 'Cán bộ nhà trường'),
        sourceUrl: uploadSourceUrl,
        topics: topicsArr
      }, userRoleCode);

      if (res.success) {
        setUploadFeedback({
          type: 'success',
          text: `Tiếp nhận tài liệu thành công (${res.document?.documentId}). Tài liệu được gán trạng thái CHỜ DUYỆT (PENDING_REVIEW) theo quy tắc 4 Mắt.`
        });
        setTimeout(() => {
          setIsUploadOpen(false);
          setUploadFileName('');
          setUploadTitle('');
          setUploadTextContent('');
          setUploadFeedback(null);
          loadDocuments();
        }, 1800);
      } else {
        setUploadFeedback({ type: 'error', text: res.error || 'Lỗi tiếp nhận tài liệu' });
      }
    } catch (err: any) {
      setUploadFeedback({ type: 'error', text: err?.message || 'Lỗi không xác định' });
    } finally {
      setIsSubmittingUpload(false);
    }
  };

  // Handle Four-Eyes Approve or Reject
  const handleExecuteApproval = async (action: 'approve' | 'reject') => {
    if (!approvalDoc) return;
    setIsProcessingApproval(true);

    try {
      const res = await RagService.approveDocument(
        approvalDoc.documentId,
        action,
        action === 'reject' ? rejectionReason : undefined,
        userRoleCode
      );

      if (res.success) {
        setApprovalDoc(null);
        setRejectionReason('');
        loadDocuments();
      } else {
        alert(res.error || 'Lỗi xử lý');
      }
    } catch (err: any) {
      alert(err?.message || 'Lỗi xử lý');
    } finally {
      setIsProcessingApproval(false);
    }
  };

  // Filter documents by search and category
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = !searchQuery.trim() ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Calculate statistics
  const totalApproved = documents.filter(d => d.approvalStatus === 'APPROVED' && d.isAllowedForRag).length;
  const totalPending = documents.filter(d => d.approvalStatus === 'PENDING_REVIEW').length;
  const totalChunksCount = documents.reduce((acc, d) => acc + (d.chunksCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-heritage-ivory-300 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-heritage-red-700 text-heritage-gold-300 border border-heritage-gold-400 flex items-center justify-center shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-lg md:text-xl font-bold text-heritage-ink-900">
              Quản Trị Kho Tri Thức RAG (ADR-002 Phase 04 - Controlled Pilot)
            </h2>
          </div>
          <p className="text-xs text-heritage-ink-500 mt-1">
            Quản lý tài liệu thực tế, kiểm soát mã băm trùng lặp, chia đoạn tự động, quy trình duyệt 4 Mắt và giám sát vận hành thí điểm.
          </p>
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={() => {
              loadDocuments();
              if (activeTab === 'analytics') loadAnalytics();
            }}
            className="p-2.5 rounded-xl border border-heritage-ivory-400 text-heritage-ink-700 hover:bg-heritage-ivory-200 transition-colors"
            title="Làm mới danh sách"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading || isLoadingAnalytics ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-heritage-red-700 hover:bg-heritage-red-800 text-white font-medium text-xs sm:text-sm shadow-md transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4 text-heritage-gold-300" />
            <span>Tiếp Nhận Tài Liệu</span>
          </button>
        </div>
      </div>

      {/* Sub-tab Switcher */}
      <div className="flex border-b border-heritage-ivory-300 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2.5 font-medium text-xs sm:text-sm border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'documents'
              ? 'border-heritage-red-700 text-heritage-red-800 font-bold bg-white rounded-t-xl'
              : 'border-transparent text-heritage-ink-500 hover:text-heritage-ink-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Kho Tư Liệu & Duyệt 4 Mắt</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 font-medium text-xs sm:text-sm border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'analytics'
              ? 'border-heritage-red-700 text-heritage-red-800 font-bold bg-white rounded-t-xl'
              : 'border-transparent text-heritage-ink-500 hover:text-heritage-ink-800'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Bảng Điều Khiển Vận Hành Thí Điểm (Pilot Analytics)</span>
        </button>
      </div>

      {activeTab === 'documents' && (
        <>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-heritage-ivory-300 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-heritage-ink-500">Tổng tài liệu</div>
          <div className="text-xl sm:text-2xl font-bold text-heritage-ink-900 mt-1">{documents.length}</div>
          <div className="text-[10px] text-heritage-ink-400 mt-0.5">Trong cơ sở dữ liệu</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Đã duyệt (Phép dùng RAG)</div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-700 mt-1">{totalApproved}</div>
          <div className="text-[10px] text-emerald-600 mt-0.5">Sẵn sàng phục vụ truy xuất</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/30 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Chờ duyệt 4 Mắt</div>
          <div className="text-xl sm:text-2xl font-bold text-amber-700 mt-1">{totalPending}</div>
          <div className="text-[10px] text-amber-600 mt-0.5">Chưa đưa vào chỉ mục RAG</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-heritage-gold-200 bg-heritage-gold-50/30 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-heritage-gold-900">Đoạn dữ liệu (Chunks)</div>
          <div className="text-xl sm:text-2xl font-bold text-heritage-red-800 mt-1">{totalChunksCount}</div>
          <div className="text-[10px] text-heritage-ink-500 mt-0.5">Đã gắn nhãn provenance</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-heritage-ivory-300 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-heritage-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên, tác giả, mã..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-heritage-ivory-400 focus:border-heritage-gold-500 outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-heritage-ivory-400 bg-white text-heritage-ink-800 outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="APPROVED">Đã duyệt (APPROVED)</option>
            <option value="PENDING_REVIEW">Chờ duyệt (PENDING_REVIEW)</option>
            <option value="REJECTED">Bị từ chối (REJECTED)</option>
            <option value="ARCHIVED">Lưu trữ (ARCHIVED)</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-heritage-ivory-400 bg-white text-heritage-ink-800 outline-none"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-2xl border border-heritage-ivory-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-heritage-ink-800">
            <thead className="bg-heritage-ivory-100 text-heritage-ink-600 font-bold border-b border-heritage-ivory-300 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Mã & Tên tài liệu</th>
                <th className="p-3.5">Chủ đề & Tác giả</th>
                <th className="p-3.5">Đoạn Chunks</th>
                <th className="p-3.5">Mã băm SHA-256</th>
                <th className="p-3.5">Trạng thái duyệt</th>
                <th className="p-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-heritage-ivory-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-heritage-ink-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-heritage-red-700" />
                    Đang tải danh mục kho tri thức...
                  </td>
                </tr>
              ) : filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-heritage-ink-500">
                    Không tìm thấy tài liệu nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredDocs.map(doc => {
                  const isApproved = doc.approvalStatus === 'APPROVED' && doc.isAllowedForRag;
                  const isPending = doc.approvalStatus === 'PENDING_REVIEW';
                  const isRejected = doc.approvalStatus === 'REJECTED';

                  return (
                    <tr key={doc.documentId} className="hover:bg-heritage-ivory-50 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-heritage-red-900 text-xs sm:text-sm">{doc.title}</div>
                        <div className="text-[10px] font-mono text-heritage-ink-500 mt-0.5 flex items-center space-x-1">
                          <span>{doc.documentId}</span>
                          <span>•</span>
                          <span>v{doc.version}</span>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-medium text-heritage-ink-800">{doc.author}</div>
                        <div className="text-[10px] text-heritage-ink-500">{doc.category}</div>
                      </td>

                      <td className="p-3.5 font-mono">
                        <span className="px-2 py-0.5 rounded bg-heritage-ivory-200 text-heritage-ink-800 text-[11px]">
                          {doc.chunksCount || 0} chunks
                        </span>
                      </td>

                      <td className="p-3.5 font-mono text-[10px] text-heritage-ink-500" title={doc.checksum}>
                        {doc.checksum.substring(0, 10)}...
                      </td>

                      <td className="p-3.5">
                        {isApproved && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-800">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Đã duyệt RAG</span>
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Chờ duyệt 4 Mắt</span>
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-100 text-rose-800">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>Đã từ chối</span>
                          </span>
                        )}
                        {doc.approvalStatus === 'ARCHIVED' && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-800">
                            <Lock className="w-3 h-3 text-gray-600" />
                            <span>Lưu trữ</span>
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleInspect(doc)}
                          className="px-2.5 py-1 rounded bg-heritage-ivory-200 hover:bg-heritage-gold-100 text-heritage-ink-800 font-medium text-[11px] transition-colors"
                        >
                          Chi tiết
                        </button>

                        {isPending && canApprove && (
                          <button
                            type="button"
                            onClick={() => setApprovalDoc(doc)}
                            className="px-2.5 py-1 rounded bg-heritage-red-700 hover:bg-heritage-red-800 text-white font-medium text-[11px] transition-colors"
                          >
                            Duyệt 4 Mắt
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Analytics Header & Health Status */}
          <div className="bg-white p-4 rounded-xl border border-heritage-ivory-300 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-heritage-red-700" />
              <div>
                <h3 className="font-bold text-sm text-heritage-ink-900">Chỉ Số Vận Hành Trợ Lý AI RAG</h3>
                <p className="text-[11px] text-heritage-ink-500">Giám sát chất lượng câu trả lời, câu hỏi chưa có tài liệu và phản hồi người dùng</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center space-x-1.5 ${
                analyticsData?.databaseHealth.isSupabaseLive
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}>
                <span className={`w-2 h-2 rounded-full ${analyticsData?.databaseHealth.isSupabaseLive ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                <span>{analyticsData?.databaseHealth.isSupabaseLive ? 'Supabase PostgreSQL Online' : 'Local Persistent Storage Mode'}</span>
              </span>

              <button
                type="button"
                onClick={loadAnalytics}
                className="p-2 rounded-lg border border-heritage-ivory-400 hover:bg-heritage-ivory-200 transition-colors"
                title="Làm mới chỉ số"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAnalytics ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Metric KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-xl border border-heritage-ivory-300 shadow-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-heritage-ink-500">Tỷ lệ có dẫn chứng</div>
              <div className="text-xl sm:text-2xl font-bold text-emerald-700 mt-1">
                {analyticsData?.queries.evidenceRatePercent ?? 100}%
              </div>
              <div className="text-[10px] text-heritage-ink-400 mt-0.5">
                {analyticsData?.queries.evidenceFoundCount ?? 0} / {analyticsData?.queries.totalLogged ?? 0} câu hỏi có nguồn
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-heritage-ivory-300 shadow-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-heritage-ink-500">Tổng câu hỏi đã xử lý</div>
              <div className="text-xl sm:text-2xl font-bold text-heritage-red-800 mt-1">
                {analyticsData?.queries.totalLogged ?? 0}
              </div>
              <div className="text-[10px] text-heritage-ink-400 mt-0.5">Lưu vết truy xuất kiểm toán</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-heritage-ivory-300 shadow-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-heritage-ink-500">Tỷ lệ hài lòng (% Thích)</div>
              <div className="text-xl sm:text-2xl font-bold text-heritage-gold-700 mt-1">
                {analyticsData?.feedback.satisfactionRatePercent ?? 100}%
              </div>
              <div className="text-[10px] text-emerald-600 mt-0.5 flex items-center space-x-1">
                <ThumbsUp className="w-3 h-3" />
                <span>{analyticsData?.feedback.helpfulCount ?? 0} lượt thích</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-heritage-ivory-300 shadow-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-heritage-ink-500">Tổng phản hồi người dùng</div>
              <div className="text-xl sm:text-2xl font-bold text-heritage-ink-900 mt-1">
                {analyticsData?.feedback.total ?? 0}
              </div>
              <div className="text-[10px] text-amber-600 mt-0.5 flex items-center space-x-1">
                <ThumbsDown className="w-3 h-3" />
                <span>{analyticsData?.feedback.unhelpfulCount ?? 0} góp ý cần cải thiện</span>
              </div>
            </div>
          </div>

          {/* 2 Detailed Panels: Ungrounded Queries & User Feedback */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Ungrounded Queries */}
            <div className="bg-white p-5 rounded-2xl border border-heritage-ivory-300 shadow-sm flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-heritage-ivory-200 mb-3">
                <div className="flex items-center space-x-2">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <h4 className="font-bold text-xs sm:text-sm text-heritage-ink-900">
                    Câu hỏi chưa tìm thấy nguồn tư liệu
                  </h4>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                  {analyticsData?.ungroundedQueries.length ?? 0} câu hỏi
                </span>
              </div>

              <p className="text-[11px] text-heritage-ink-500 mb-3">
                Danh sách các câu hỏi người dùng đặt ra nhưng kho tư liệu hiện tại chưa có văn bản tương ứng. Thầy cô và quản trị viên có thể căn cứ vào đây để tiếp nhận và bổ sung tài liệu mới.
              </p>

              <div className="flex-1 overflow-y-auto max-h-[360px] space-y-2">
                {(!analyticsData?.ungroundedQueries || analyticsData.ungroundedQueries.length === 0) ? (
                  <div className="p-6 text-center text-heritage-ink-400 text-xs">
                    Tất cả các câu hỏi được đặt ra đều đã tìm thấy tư liệu kiểm chứng phù hợp!
                  </div>
                ) : (
                  analyticsData.ungroundedQueries.map((uq, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/80 text-xs text-heritage-ink-900 flex items-start justify-between gap-2">
                      <div className="flex-1 font-medium">{uq.query}</div>
                      <div className="text-[10px] text-heritage-ink-400 whitespace-nowrap">
                        {new Date(uq.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right: User Feedback Comments */}
            <div className="bg-white p-5 rounded-2xl border border-heritage-ivory-300 shadow-sm flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-heritage-ivory-200 mb-3">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-heritage-red-700" />
                  <h4 className="font-bold text-xs sm:text-sm text-heritage-ink-900">
                    Ý kiến đóng góp & Đánh giá của người dùng
                  </h4>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-heritage-ivory-200 text-heritage-ink-700 font-bold">
                  {analyticsData?.feedback.recentComments.length ?? 0} phản hồi
                </span>
              </div>

              <p className="text-[11px] text-heritage-ink-500 mb-3">
                Ghi nhận trực tiếp từ học sinh và giáo viên khi tương tác với Trợ lý AI để cải thiện thuật toán và nội dung câu trả lời.
              </p>

              <div className="flex-1 overflow-y-auto max-h-[360px] space-y-2.5">
                {(!analyticsData?.feedback.recentComments || analyticsData.feedback.recentComments.length === 0) ? (
                  <div className="p-6 text-center text-heritage-ink-400 text-xs">
                    Chưa có phản hồi bình luận nào.
                  </div>
                ) : (
                  analyticsData.feedback.recentComments.map((commentItem, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-heritage-ivory-50 border border-heritage-ivory-200 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center space-x-1 ${
                          commentItem.isHelpful ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {commentItem.isHelpful ? <ThumbsUp className="w-2.5 h-2.5" /> : <ThumbsDown className="w-2.5 h-2.5" />}
                          <span>{commentItem.isHelpful ? 'Hài lòng' : (commentItem.category || 'Cần cải thiện')}</span>
                        </span>
                        <span className="text-[10px] text-heritage-ink-400">
                          {new Date(commentItem.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <p className="text-heritage-ink-800 italic">"{commentItem.comment}"</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-heritage-gold-400 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-heritage-ivory-300">
              <h3 className="font-serif font-bold text-base sm:text-lg text-heritage-red-900 flex items-center space-x-2">
                <Upload className="w-5 h-5 text-heritage-gold-600" />
                <span>Tiếp Nhận Tài Liệu Tri Thức Mới</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="text-heritage-ink-400 hover:text-heritage-ink-800 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitUpload} className="mt-4 space-y-3.5 text-xs">
              {uploadFeedback && (
                <div className={`p-3 rounded-xl flex items-start space-x-2 ${
                  uploadFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-300' : 'bg-rose-50 text-rose-900 border border-rose-300'
                }`}>
                  {uploadFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5" />}
                  <span>{uploadFeedback.text}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-heritage-ink-800 mb-1">Tải lên tệp (TXT, Markdown, DOCX):</label>
                <input
                  type="file"
                  accept=".txt,.md,.markdown,.docx"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-heritage-ivory-400 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-heritage-ink-800 mb-1">Tiêu đề tài liệu:</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={e => setUploadTitle(e.target.value)}
                  placeholder="Ví dụ: Lời căn dặn của Bác Hồ..."
                  required
                  className="w-full p-2 border border-heritage-ivory-400 rounded-lg text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-heritage-ink-800 mb-1">Danh mục chủ đề:</label>
                  <select
                    value={uploadCategory}
                    onChange={e => setUploadCategory(e.target.value)}
                    className="w-full p-2 border border-heritage-ivory-400 rounded-lg text-xs"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-heritage-ink-800 mb-1">Tác giả / Nguồn:</label>
                  <input
                    type="text"
                    value={uploadAuthor}
                    onChange={e => setUploadAuthor(e.target.value)}
                    placeholder="Bác Hồ / Chi bộ trường..."
                    className="w-full p-2 border border-heritage-ivory-400 rounded-lg text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-heritage-ink-800 mb-1">Loại tài liệu:</label>
                  <select
                    value={uploadDocType}
                    onChange={e => setUploadDocType(e.target.value)}
                    className="w-full p-2 border border-heritage-ivory-400 rounded-lg text-xs"
                  >
                    <option value="article">Bài viết số hóa</option>
                    <option value="speech">Văn kiện / Diễn văn</option>
                    <option value="book">Sách / Tác phẩm</option>
                    <option value="letter">Thư từ lịch sử</option>
                    <option value="instruction">Lời dạy / Huấn thị</option>
                    <option value="official_dispatch">Công văn / Hướng dẫn</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-heritage-ink-800 mb-1">Đường dẫn nguồn (URL nếu có):</label>
                  <input
                    type="url"
                    value={uploadSourceUrl}
                    onChange={e => setUploadSourceUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2 border border-heritage-ivory-400 rounded-lg text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-heritage-ink-800 mb-1">Từ khóa / Nhãn chủ đề (cách nhau bằng dấu phẩy):</label>
                <input
                  type="text"
                  value={uploadTopics}
                  onChange={e => setUploadTopics(e.target.value)}
                  className="w-full p-2 border border-heritage-ivory-400 rounded-lg text-xs outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-heritage-ink-800 mb-1">Nội dung văn bản trích xuất:</label>
                <textarea
                  rows={6}
                  value={uploadTextContent}
                  onChange={e => setUploadTextContent(e.target.value)}
                  placeholder="Nội dung sẽ được tự động điền khi tải tệp lên hoặc có thể dán trực tiếp..."
                  required
                  className="w-full p-2 border border-heritage-ivory-400 rounded-lg text-xs font-sans outline-none leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-heritage-ivory-300 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 rounded-lg border border-heritage-ivory-400 text-heritage-ink-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingUpload}
                  className="px-5 py-2 rounded-lg bg-heritage-red-700 hover:bg-heritage-red-800 text-white font-bold disabled:opacity-50"
                >
                  {isSubmittingUpload ? 'Đang xử lý...' : 'Tiếp nhận & Chia đoạn'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect Detail Modal */}
      {inspectDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-heritage-gold-400 max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between pb-3 border-b border-heritage-ivory-300">
              <div>
                <div className="text-[11px] font-mono text-heritage-gold-700 font-bold">{inspectDoc.documentId}</div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-heritage-ink-900 mt-0.5">
                  {inspectDoc.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectDoc(null)}
                className="text-heritage-ink-400 hover:text-heritage-ink-800 p-1"
              >
                ✕
              </button>
            </div>

            <div className="my-3 space-y-2 overflow-y-auto flex-1 text-xs">
              <div className="p-3 rounded-lg bg-heritage-ivory-100 grid grid-cols-2 gap-2 text-[11px]">
                <div><strong>Tác giả:</strong> {inspectDoc.author}</div>
                <div><strong>Danh mục:</strong> {inspectDoc.category}</div>
                <div><strong>Mã băm SHA-256:</strong> <span className="font-mono">{inspectDoc.checksum.substring(0, 16)}...</span></div>
                <div><strong>Trạng thái:</strong> {inspectDoc.approvalStatus}</div>
              </div>

              <div className="font-bold text-heritage-red-800 pt-2">
                Các đoạn dữ liệu (Chunks) đã phân rã ({inspectChunks.length}):
              </div>

              {isLoadingChunks ? (
                <div className="p-4 text-center text-heritage-ink-500">Đang tải các đoạn chunk...</div>
              ) : inspectChunks.length === 0 ? (
                <div className="p-4 text-center text-heritage-ink-500">Chưa có đoạn chunk nào được lưu trữ.</div>
              ) : (
                <div className="space-y-2">
                  {inspectChunks.map(c => (
                    <div key={c.id} className="p-2.5 rounded-lg border border-heritage-ivory-300 bg-heritage-ivory-50 text-[11px]">
                      <div className="flex items-center justify-between text-heritage-red-800 font-bold">
                        <span>{c.id}</span>
                        <span className="font-mono text-heritage-ink-500 text-[10px]">{c.provenanceLocator}</span>
                      </div>
                      <div className="text-heritage-ink-700 italic mt-1 line-clamp-3">"{c.content}"</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-heritage-ivory-300 flex items-center justify-between">
              {inspectDoc.approvalStatus === 'APPROVED' && (
                <button
                  type="button"
                  onClick={() => {
                    const query = `Hãy giới thiệu tóm tắt và ý nghĩa lịch sử của tư liệu "${inspectDoc.title}"`;
                    setInspectDoc(null);
                    window.dispatchEvent(new CustomEvent('open-rag-chatbot', {
                      detail: { initialQuery: query, documentTitle: inspectDoc.title }
                    }));
                  }}
                  className="px-3 py-1.5 rounded-lg bg-heritage-gold-500 hover:bg-heritage-gold-600 text-heritage-red-950 font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-colors"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Hỏi AI về tư liệu này</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setInspectDoc(null)}
                className="px-4 py-2 rounded-lg bg-heritage-red-700 text-white font-medium text-xs ml-auto"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Four-Eyes Approval Modal */}
      {approvalDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-heritage-red-700">
            <h3 className="font-serif font-bold text-lg text-heritage-red-900 mb-2 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-heritage-red-700" />
              <span>Duyệt Bài 4 Mắt (Four-Eyes Approval)</span>
            </h3>
            <p className="text-xs text-heritage-ink-600 mb-3">
              Tài liệu: <strong>{approvalDoc.title}</strong> ({approvalDoc.documentId})
            </p>

            <div className="p-3 rounded-lg bg-amber-50 border border-amber-300 text-[11px] text-amber-900 mb-4 leading-relaxed">
              Theo quy chuẩn quản trị hồ sơ, khi bạn duyệt tài liệu này, nó sẽ chính thức được cấp phép <code>isAllowedForRag = true</code> và được đưa vào chỉ mục tìm kiếm RAG của nhà trường.
            </div>

            {Boolean(approvalDoc.uploadedBy && profile?.id && approvalDoc.uploadedBy === profile.id) && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-300 text-[11px] text-rose-900 mb-4 leading-relaxed flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  <strong>Cảnh báo Quy tắc 4 Mắt:</strong> Bạn là người đã tải tài liệu này lên ({approvalDoc.uploadedByName || approvalDoc.uploadedBy}). Theo quy chuẩn, bạn không được tự phê duyệt tài liệu của chính mình; cần một cán bộ quản trị khác duyệt độc lập.
                </span>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-xs font-bold text-heritage-ink-700 mb-1">
                Lý do (nếu từ chối):
              </label>
              <input
                type="text"
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder="Nhập lý do nếu quyết định từ chối..."
                className="w-full p-2 border border-heritage-ivory-400 rounded-lg text-xs outline-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 text-xs">
              <button
                type="button"
                onClick={() => setApprovalDoc(null)}
                className="px-3 py-2 rounded-lg border border-heritage-ivory-400 text-heritage-ink-700"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={isProcessingApproval}
                onClick={() => handleExecuteApproval('reject')}
                className="px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold"
              >
                Từ chối
              </button>
              <button
                type="button"
                disabled={isProcessingApproval || Boolean(approvalDoc.uploadedBy && profile?.id && approvalDoc.uploadedBy === profile.id)}
                onClick={() => handleExecuteApproval('approve')}
                className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold"
                title={Boolean(approvalDoc.uploadedBy && profile?.id && approvalDoc.uploadedBy === profile.id) ? 'Vi phạm quy tắc 4 mắt: Không được tự duyệt tài liệu của mình' : undefined}
              >
                Phê duyệt vào RAG
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
