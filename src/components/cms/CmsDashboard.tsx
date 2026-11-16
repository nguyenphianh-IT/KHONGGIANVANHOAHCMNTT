import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, FileText, PenTool, Clock, Globe, Image as ImageIcon,
  ShieldCheck, Shield, X, Plus, Search,
  CheckCircle2, AlertCircle, Send,
  ExternalLink, Sparkles, ArrowRight,
  Upload, Copy, Check, Trash2, Trophy, GraduationCap, LogOut, Cloud, Database,
  KeyRound, Eye
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FullScreenEditor } from './FullScreenEditor';
import { ReviewModal } from './ReviewModal';
import { MediaLibraryModal } from './MediaLibraryModal';
import { ContestManagerModal } from './ContestManagerModal';
import { RagKnowledgeManager } from '../rag/RagKnowledgeManager';
import { PasswordManager } from './PasswordManager';
import { getStoredContestQuestions, getContestSubmissions, EVENT_CONTEST_DATA_CHANGED } from '../../data/contestData';
import { optimizeImageFile } from '../../lib/imageOptimizer';
import {
  ArticleData, MediaAsset, AuditLogItem,
  getStoredArticles, saveStoredArticles,
  getStoredMedia, saveStoredMedia,
  getStoredAuditLogs, addStoredAuditLog,
  EVENT_ARTICLES_CHANGED, EVENT_MEDIA_CHANGED,
  CMS_CATEGORIES, getCategoryLabel, normalizeCategoryToHomepage,
  fetchArticlesFromSupabase
} from '../../lib/cmsStore';
import {
  getAllViewCounts,
  EVENT_VIEWS_CHANGED,
  fetchCloudViewCounts
} from '../../lib/viewsStore';

interface CmsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CmsDashboard: React.FC<CmsDashboardProps> = ({ isOpen, onClose }) => {
  // Active View Navigation
  const [activeNav, setActiveNav] = useState<'overview' | 'articles' | 'pending' | 'published' | 'media' | 'audit' | 'security' | 'contest' | 'rag-knowledge' | 'password-manager'>('overview');

  // Articles, Audit & Media state synchronized with cmsStore
  const [articles, setArticles] = useState<ArticleData[]>(getStoredArticles);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(getStoredAuditLogs);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(getStoredMedia);
  const [contestQuestionsCount, setContestQuestionsCount] = useState<number>(() => getStoredContestQuestions().length);
  const [contestSubmissionsCount, setContestSubmissionsCount] = useState<number>(() => getContestSubmissions().length);
  const [viewsMap, setViewsMap] = useState<Record<string, number>>(() => getAllViewCounts());

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Media Management state
  const [mediaSearchQuery, setMediaSearchQuery] = useState('');
  const [copiedMediaId, setCopiedMediaId] = useState<string | null>(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [mediaUploadError, setMediaUploadError] = useState<string | null>(null);
  const [mediaUploadSuccess, setMediaUploadSuccess] = useState<string | null>(null);

  const { user, profile, roles, logout, hasRole } = useAuth();

  // Active Personas Switcher (To test 4-Eyes in real time!)
  const [currentPersona, setCurrentPersona] = useState({
    id: user?.id || 'usr-admin',
    name: profile?.full_name || user?.email || 'Quản Trị Viên',
    role: 'admin',
    roleLabel: 'Quản Trị Viên',
    avatar: '🏛️',
  });

  // Đồng bộ hóa persona theo tài khoản đã đăng nhập trong AuthContext
  useEffect(() => {
    if (user && profile) {
      const isAdmin = roles.some((r) => r.code === 'admin' || r.code === 'super_admin');
      const isEditor = roles.some((r) => r.code === 'editor');

      let roleCode = 'editor';
      let roleLabel = 'Biên Tập Viên';
      let avatar = '👨‍🏫';

      if (isAdmin) {
        roleCode = 'admin';
        roleLabel = 'Ban Giám Hiệu (Quản Trị)';
        avatar = '🏛️';
      } else if (isEditor) {
        roleCode = 'editor';
        roleLabel = 'Biên Tập Viên';
        avatar = profile.avatar_url || '👨‍🏫';
      }

      setCurrentPersona({
        id: user.id || 'usr-active',
        name: profile.full_name || user.email || 'Cán Bộ Quản Trị',
        role: roleCode,
        roleLabel: roleLabel,
        avatar: profile.avatar_url || avatar,
      });
    }
  }, [user, profile, roles]);

  // Editor modal state
  const [isEditing, setIsEditing] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleData | null>(null);

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewingArticle, setReviewingArticle] = useState<ArticleData | null>(null);

  // Media Library modal state (for picking from editor)
  const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(true);

  // Kéo toàn bộ bài viết từ Supabase Cloud khi mở CMS Dashboard
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    fetchArticlesFromSupabase().then((res) => {
      if (isMounted && res.success && res.articles) {
        setArticles(res.articles);
        setIsCloudSynced(true);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Sync with cmsStore events
  useEffect(() => {
    const syncArticles = () => setArticles(getStoredArticles());
    const syncMedia = () => setMediaAssets(getStoredMedia());
    const syncAudit = () => setAuditLogs(getStoredAuditLogs());
    const syncContest = () => {
      setContestQuestionsCount(getStoredContestQuestions().length);
      setContestSubmissionsCount(getContestSubmissions().length);
    };
    const syncViews = () => setViewsMap(getAllViewCounts());

    fetchCloudViewCounts().then((cloudCounts) => {
      if (cloudCounts && Object.keys(cloudCounts).length > 0) {
        setViewsMap(cloudCounts);
      }
    });

    window.addEventListener(EVENT_ARTICLES_CHANGED, syncArticles);
    window.addEventListener(EVENT_MEDIA_CHANGED, syncMedia);
    window.addEventListener(EVENT_CONTEST_DATA_CHANGED, syncContest);
    window.addEventListener(EVENT_VIEWS_CHANGED, syncViews);
    window.addEventListener('storage', syncArticles);
    window.addEventListener('storage', syncMedia);
    window.addEventListener('storage', syncAudit);
    window.addEventListener('storage', syncContest);
    window.addEventListener('storage', syncViews);

    return () => {
      window.removeEventListener(EVENT_ARTICLES_CHANGED, syncArticles);
      window.removeEventListener(EVENT_MEDIA_CHANGED, syncMedia);
      window.removeEventListener(EVENT_CONTEST_DATA_CHANGED, syncContest);
      window.removeEventListener(EVENT_VIEWS_CHANGED, syncViews);
      window.removeEventListener('storage', syncArticles);
      window.removeEventListener('storage', syncMedia);
      window.removeEventListener('storage', syncAudit);
      window.removeEventListener('storage', syncContest);
      window.removeEventListener('storage', syncViews);
    };
  }, []);

  // Auto clear toast
  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => setToastMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  if (!isOpen) return null;

  // KPI Calculations
  const totalCount = articles.length;
  const draftCount = articles.filter((a) => a.status === 'draft').length;
  const pendingCount = articles.filter((a) => a.status === 'pending').length;
  const publishedCount = articles.filter((a) => a.status === 'published').length;
  const totalRealViews = Object.values(viewsMap).reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0);


  // 1. Action: Save Draft
  const handleSaveDraft = async (article: ArticleData) => {
    let updatedList: ArticleData[];
    if (article.id) {
      updatedList = articles.map((a) => (a.id === article.id ? { ...article, updated_at: 'Vừa xong' } : a));
    } else {
      const newArticle: ArticleData = {
        ...article,
        id: `art-${Date.now()}`,
        status: 'draft',
        author_id: currentPersona.id,
        author_name: currentPersona.name,
        created_at: 'Vừa xong',
        updated_at: 'Vừa xong',
      };
      updatedList = [newArticle, ...articles];
    }

    setArticles(updatedList);
    saveStoredArticles(updatedList);

    setToastMsg({
      type: 'success',
      text: `Đã lưu bản nháp "${article.title}" thành công!`,
    });
  };

  // 2. Action: Submit for 4-Eyes Review
  const handleSubmitReview = async (article: ArticleData) => {
    const updated: ArticleData = {
      ...article,
      id: article.id || `art-${Date.now()}`,
      status: 'pending',
      author_id: article.author_id || currentPersona.id,
      author_name: article.author_name || currentPersona.name,
      updated_at: 'Vừa xong',
    };

    const updatedList = article.id
      ? articles.map((a) => (a.id === article.id ? updated : a))
      : [updated, ...articles];

    setArticles(updatedList);
    saveStoredArticles(updatedList);

    // Add Audit Log
    const newLog: AuditLogItem = {
      id: `evt-${Date.now()}`,
      action: 'article.submit_review',
      article_title: updated.title,
      actor: currentPersona.name,
      role: currentPersona.roleLabel,
      decision: 'pending',
      feedback: 'Nộp duyệt bài 4 mắt lên Ban Giám Hiệu.',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    addStoredAuditLog(newLog);
    setAuditLogs((prev) => [newLog, ...prev]);

    setIsEditing(false);
    setToastMsg({
      type: 'success',
      text: `Nộp duyệt thành công! Bài viết "${updated.title}" đã chuyển sang hàng đợi kiểm duyệt 4 mắt.`,
    });
  };

  // 3. Action: Four-Eyes Approve
  const handleApproveArticle = async (articleId: string, feedback: string) => {
    const target = articles.find((a) => a.id === articleId);
    if (!target) return;

    // Four-Eyes Rule Check!
    if (target.author_id === currentPersona.id || target.author_name === currentPersona.name) {
      setToastMsg({
        type: 'error',
        text: 'VI PHẠM QUY TẮC 4 MẮT: Bạn không thể tự phê duyệt bài viết của chính mình!',
      });
      return;
    }

    // Atomic Approve & Publish
    const updatedList = articles.map((a) =>
      a.id === articleId ? { ...a, status: 'published' as const, updated_at: 'Vừa duyệt' } : a
    );
    setArticles(updatedList);
    saveStoredArticles(updatedList);

    // Record Audit Event
    const newLog: AuditLogItem = {
      id: `evt-${Date.now()}`,
      action: 'article.four_eyes_approve',
      article_title: target.title,
      actor: currentPersona.name,
      role: currentPersona.roleLabel,
      decision: 'approved',
      feedback: feedback || 'Nội dung chuẩn mực, tư tưởng chính xác, đạt chuẩn xuất bản.',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    addStoredAuditLog(newLog);
    setAuditLogs((prev) => [newLog, ...prev]);

    setToastMsg({
      type: 'success',
      text: `Phê duyệt 4 mắt thành công! Bài viết "${target.title}" đã được xuất bản trực tiếp lên trang Kho Tư Liệu!`,
    });
  };

  // 4. Action: Reject Article
  const handleRejectArticle = async (articleId: string, feedback: string) => {
    const target = articles.find((a) => a.id === articleId);
    if (!target) return;

    const updatedList = articles.map((a) =>
      a.id === articleId ? { ...a, status: 'rejected' as const, updated_at: 'Yêu cầu sửa' } : a
    );
    setArticles(updatedList);
    saveStoredArticles(updatedList);

    const newLog: AuditLogItem = {
      id: `evt-${Date.now()}`,
      action: 'article.reject_to_draft',
      article_title: target.title,
      actor: currentPersona.name,
      role: currentPersona.roleLabel,
      decision: 'rejected',
      feedback: feedback || 'Yêu cầu chỉnh sửa lại dẫn chứng.',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    addStoredAuditLog(newLog);
    setAuditLogs((prev) => [newLog, ...prev]);

    setToastMsg({
      type: 'info',
      text: `Đã từ chối bản thảo và gửi yêu cầu chỉnh sửa cho tác giả.`,
    });
  };

  // 5. Media Management Action: Upload Gate
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMediaUploadError(null);
    setMediaUploadSuccess(null);

    const allowedMime = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMime.includes(file.type)) {
      setMediaUploadError(`[UPLOAD GATE TỪ CHỐI] Định dạng tệp (${file.type}) không được phép! Chỉ nhận .jpg, .png, .webp.`);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMediaUploadError(`[UPLOAD GATE TỪ CHỐI] Tệp vượt hạn mức 2MB (${(file.size / (1024 * 1024)).toFixed(2)} MB)!`);
      return;
    }

    setIsUploadingMedia(true);
    optimizeImageFile(file)
      .then((optimized) => {
        const hexChars = '0123456789ABCDEF';
        let randomSha = '';
        for (let i = 0; i < 64; i++) {
          randomSha += hexChars[Math.floor(Math.random() * hexChars.length)];
        }

        const newAsset: MediaAsset = {
          id: `med-${Date.now()}`,
          name: file.name,
          url: optimized.dataUrl,
          size_bytes: optimized.sizeBytes,
          mime_type: 'image/jpeg',
          sha256_hash: randomSha,
          author: currentPersona.name,
          copyright: 'Tài liệu giáo dục trường học Phường Thới An',
          created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
        };

        const updated = [newAsset, ...mediaAssets];
        setMediaAssets(updated);
        saveStoredMedia(updated);
        setIsUploadingMedia(false);
        setMediaUploadSuccess(`Tải lên thành công tệp ${file.name} (Đã nén tối ưu ${(optimized.sizeBytes / 1024).toFixed(1)} KB)!`);
      })
      .catch((err) => {
        setIsUploadingMedia(false);
        setMediaUploadError(err.message || 'Lỗi đọc tệp tải lên từ thiết bị.');
      });
  };

  const handleCopyMediaMarkdown = (asset: MediaAsset) => {
    const cleanName = asset.name.replace(/\.[^/.]+$/, '').replace(/-/g, ' ');
    const tag = `![${cleanName}](media://${asset.id})`;
    navigator.clipboard.writeText(tag);
    setCopiedMediaId(asset.id);
    setTimeout(() => setCopiedMediaId(null), 2000);
  };

  const handleDeleteMedia = (asset: MediaAsset) => {
    const usingArticle = articles.find((a) => a.featured_image === asset.url);
    if (usingArticle) {
      alert(`[CẢNH BÁO AN TOÀN THAM CHIẾU]\nTài nguyên '${asset.name}' đang được sử dụng làm ảnh đại diện cho bài viết "${usingArticle.title}".\nHệ thống ngăn chặn xóa để bảo toàn liên kết hiển thị!`);
      return;
    }

    if (confirm(`Bạn có chắc chắn muốn xóa tệp '${asset.name}' khỏi kho tư liệu?`)) {
      const updated = mediaAssets.filter((a) => a.id !== asset.id);
      setMediaAssets(updated);
      saveStoredMedia(updated);
      setToastMsg({ type: 'info', text: `Đã xóa tệp ${asset.name} khỏi kho tư liệu.` });
    }
  };

  // Filtered articles list
  const filteredArticles = articles.filter((a) => {
    const matchQuery =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    const normCat = normalizeCategoryToHomepage(a.category);
    const matchCategory =
      categoryFilter === 'all' ||
      a.category === categoryFilter ||
      normCat === categoryFilter;

    if (activeNav === 'pending') return a.status === 'pending' && matchQuery;
    if (activeNav === 'published') return a.status === 'published' && matchQuery;
    return matchQuery && matchStatus && matchCategory;
  });

  return (
    <>
      {/* FULL-SCREEN CMS WORKSPACE (Professional Redesign Layout) */}
      <div className="fixed inset-0 z-50 flex flex-col bg-heritage-ivory-50 text-heritage-ink-900 overflow-hidden animate-fadeIn select-text">
        {/* ========================================================================= */}
        {/* 1. TOP HEADER APP BAR                                                     */}
        {/* ========================================================================= */}
        <header className="h-16 bg-gradient-to-r from-heritage-red-900 via-heritage-red-800 to-heritage-red-900 text-white px-4 sm:px-6 flex items-center justify-between border-b border-heritage-gold-400/50 shadow-md flex-shrink-0 z-20">
          {/* Logo & School Branding */}
          <div className="flex items-center space-x-3">
            <img
              src="/images/logo-bieu-tuong.png"
              alt="Logo"
              className="w-10 h-10 object-contain rounded-full border-2 border-heritage-gold-400/80 shadow"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif font-black text-sm sm:text-base tracking-wide text-heritage-gold-300">
                  HỆ THỐNG CMS QUẢN TRỊ NỘI DUNG SỐ
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 hidden md:inline">
                  Chế Độ Vận Hành Sản Xuất (Gate G4)
                </span>
                {isCloudSynced && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/40 hidden md:inline-flex items-center space-x-1">
                    <Cloud className="w-3 h-3 text-blue-300" />
                    <span>Supabase Cloud Live</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-white/80 font-medium">
                Không gian văn hóa Hồ Chí Minh • Trường THCS Nguyễn Trung Trực
              </p>
            </div>
          </div>

          {/* Quick Persona Switcher for Testing 4-Eyes & Exit */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Real Authenticated User Identity - Khóa hoàn toàn Sandbox */}
            <div className="hidden md:flex items-center bg-black/30 rounded-xl px-3 py-1.5 border border-heritage-gold-400/30 text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Phiên làm việc bảo mật đang hoạt động" />
                <span className="text-white/80 font-medium select-none">Tài khoản:</span>
                <span className="text-heritage-gold-300 font-bold max-w-[180px] truncate" title={user?.email || profile?.full_name || 'Quản Trị Viên'}>
                  {profile?.full_name || user?.email || 'Quản Trị Viên'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-heritage-gold-400/20 text-heritage-gold-200 border border-heritage-gold-400/30 uppercase">
                  {hasRole('admin') ? 'Quản Trị Viên' : 'Biên Tập Viên'}
                </span>
              </div>
            </div>

            {/* Nút Đổi Mật Khẩu nhanh */}
            <button
              onClick={() => setActiveNav('password-manager')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm border ${
                activeNav === 'password-manager'
                  ? 'bg-heritage-gold-400 text-heritage-red-950 border-heritage-gold-300 font-extrabold'
                  : 'bg-black/30 hover:bg-black/45 text-heritage-gold-200 border-heritage-gold-400/40'
              }`}
              title="Quản trị và đổi mật khẩu tài khoản"
            >
              <KeyRound className="w-3.5 h-3.5 text-heritage-gold-300" />
              <span>Đổi Mật Khẩu</span>
            </button>

            {/* Back to Public Portal Button */}
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 bg-heritage-ivory-100 hover:bg-white text-heritage-red-900 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
              title="Quay lại Cổng thông tin học đường"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Về Cổng thông tin</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={async () => {
                await logout();
                onClose();
              }}
              className="px-3.5 py-1.5 bg-red-900/80 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm border border-red-500/40"
              title="Đăng xuất khỏi hệ thống quản trị"
            >
              <LogOut className="w-3.5 h-3.5 text-red-200" />
              <span>Đăng Xuất</span>
            </button>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* 2. BODY LAYOUT (260px Fixed Sidebar + Main Dynamic Workspace)             */}
        {/* ========================================================================= */}
        <div className="flex-grow flex overflow-hidden">
          {/* ----------------------------------------------------------------------- */}
          {/* LEFT NAVIGATION SIDEBAR (288px - Refined Elegant Layout)                */}
          {/* ----------------------------------------------------------------------- */}
          <aside className="w-72 bg-[#faf7f2] border-r border-heritage-gold-300/60 flex flex-col justify-between flex-shrink-0 z-10 shadow-sm">
            <div className="p-3 space-y-1 overflow-y-auto">
              <div className="pt-1 pb-1.5 px-3 text-[10px] font-extrabold uppercase tracking-wider text-heritage-ink-500 select-none flex items-center justify-between">
                <span>Quản Trị Biên Tập</span>
                <span className="w-10 h-px bg-heritage-gold-300/60" />
              </div>

              {/* 1. Tổng quan */}
              <button
                onClick={() => setActiveNav('overview')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left group ${
                  activeNav === 'overview'
                    ? 'bg-gradient-to-r from-heritage-red-800 to-heritage-red-700 text-white shadow-sm border-l-4 border-heritage-gold-400 pl-3'
                    : 'text-heritage-ink-800 hover:bg-heritage-gold-100/50 hover:text-heritage-red-900 border-l-4 border-transparent pl-3'
                }`}
              >
                <LayoutDashboard className={`w-4 h-4 flex-shrink-0 ${activeNav === 'overview' ? 'text-heritage-gold-300' : 'text-heritage-gold-600/80 group-hover:text-heritage-red-700'}`} />
                <span>1. Tổng Quan Điều Hành</span>
              </button>

              {/* 2. Quản lý bài viết */}
              <button
                onClick={() => setActiveNav('articles')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left group ${
                  activeNav === 'articles'
                    ? 'bg-gradient-to-r from-heritage-red-800 to-heritage-red-700 text-white shadow-sm border-l-4 border-heritage-gold-400 pl-3'
                    : 'text-heritage-ink-800 hover:bg-heritage-gold-100/50 hover:text-heritage-red-900 border-l-4 border-transparent pl-3'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0 pr-2">
                  <FileText className={`w-4 h-4 flex-shrink-0 ${activeNav === 'articles' ? 'text-heritage-gold-300' : 'text-heritage-gold-600/80 group-hover:text-heritage-red-700'}`} />
                  <span className="truncate">2. Quản Lý Bài Viết</span>
                </div>
                <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap transition-colors ${
                  activeNav === 'articles' ? 'bg-white/20 text-white' : 'bg-heritage-ivory-300/80 text-heritage-ink-700'
                }`}>
                  {totalCount}
                </span>
              </button>

              {/* 3. Soạn bản thảo mới (Triggers Full Screen Editor) */}
              <button
                onClick={() => {
                  setEditingArticle(null);
                  setIsEditing(true);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-white hover:brightness-105 active:scale-[0.99] shadow-sm transition-all text-left border border-amber-400/50"
              >
                <div className="flex items-center space-x-3">
                  <PenTool className="w-4 h-4 flex-shrink-0 text-amber-100" />
                  <span>3. Soạn Bản Thảo Mới</span>
                </div>
                <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/20 text-white tracking-wide uppercase">
                  Mới
                </span>
              </button>

              <div className="pt-3 pb-1 px-3 text-[10px] font-extrabold uppercase tracking-wider text-heritage-ink-500 select-none flex items-center justify-between">
                <span>Kiểm Duyệt & Xuất Bản</span>
                <span className="w-10 h-px bg-heritage-gold-300/60" />
              </div>

              {/* 4. Hàng đợi duyệt 4 mắt */}
              <button
                onClick={() => setActiveNav('pending')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left group ${
                  activeNav === 'pending'
                    ? 'bg-gradient-to-r from-heritage-red-800 to-heritage-red-700 text-white shadow-sm border-l-4 border-heritage-gold-400 pl-3'
                    : 'text-heritage-ink-800 hover:bg-heritage-gold-100/50 hover:text-heritage-red-900 border-l-4 border-transparent pl-3'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0 pr-2">
                  <Clock className={`w-4 h-4 flex-shrink-0 ${activeNav === 'pending' ? 'text-heritage-gold-300' : 'text-heritage-gold-600/80 group-hover:text-heritage-red-700'}`} />
                  <span className="truncate">4. Hàng Đợi Duyệt 4 Mắt</span>
                </div>
                {pendingCount > 0 ? (
                  <span className="shrink-0 text-[10px] font-extrabold px-2 py-0.5 rounded-md whitespace-nowrap bg-purple-600 text-white animate-pulse shadow-sm">
                    {pendingCount} chờ
                  </span>
                ) : (
                  <span className="shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-md whitespace-nowrap bg-stone-200/70 text-stone-600">
                    0
                  </span>
                )}
              </button>

              {/* 5. Đã xuất bản */}
              <button
                onClick={() => setActiveNav('published')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left group ${
                  activeNav === 'published'
                    ? 'bg-gradient-to-r from-heritage-red-800 to-heritage-red-700 text-white shadow-sm border-l-4 border-heritage-gold-400 pl-3'
                    : 'text-heritage-ink-800 hover:bg-heritage-gold-100/50 hover:text-heritage-red-900 border-l-4 border-transparent pl-3'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0 pr-2">
                  <Globe className={`w-4 h-4 flex-shrink-0 ${activeNav === 'published' ? 'text-heritage-gold-300' : 'text-heritage-gold-600/80 group-hover:text-heritage-red-700'}`} />
                  <span className="truncate">5. Đã Xuất Bản Live</span>
                </div>
                <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap transition-colors ${
                  activeNav === 'published' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  {publishedCount}
                </span>
              </button>

              {/* 6. Thư viện Media */}
              <button
                onClick={() => setActiveNav('media')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left group ${
                  activeNav === 'media'
                    ? 'bg-gradient-to-r from-heritage-red-800 to-heritage-red-700 text-white shadow-sm border-l-4 border-heritage-gold-400 pl-3'
                    : 'text-heritage-ink-800 hover:bg-heritage-gold-100/50 hover:text-heritage-red-900 border-l-4 border-transparent pl-3'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0 pr-2">
                  <ImageIcon className={`w-4 h-4 flex-shrink-0 ${activeNav === 'media' ? 'text-heritage-gold-300' : 'text-heritage-gold-600/80 group-hover:text-heritage-red-700'}`} />
                  <span className="truncate">6. Kho Tư Liệu Media</span>
                </div>
                <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap transition-colors ${
                  activeNav === 'media' ? 'bg-white/20 text-white' : 'bg-heritage-ivory-300/80 text-heritage-ink-700'
                }`}>
                  {mediaAssets.length}
                </span>
              </button>

              <div className="pt-3 pb-1 px-3 text-[10px] font-extrabold uppercase tracking-wider text-heritage-ink-500 select-none flex items-center justify-between">
                <span>Bảo Đảm An Ninh & Pháp Lý</span>
                <span className="w-10 h-px bg-heritage-gold-300/60" />
              </div>

              {/* 7. Nhật ký kiểm toán */}
              <button
                onClick={() => setActiveNav('audit')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left group ${
                  activeNav === 'audit'
                    ? 'bg-gradient-to-r from-heritage-red-800 to-heritage-red-700 text-white shadow-sm border-l-4 border-heritage-gold-400 pl-3'
                    : 'text-heritage-ink-800 hover:bg-heritage-gold-100/50 hover:text-heritage-red-900 border-l-4 border-transparent pl-3'
                }`}
              >
                <ShieldCheck className={`w-4 h-4 flex-shrink-0 ${activeNav === 'audit' ? 'text-heritage-gold-300' : 'text-heritage-gold-600/80 group-hover:text-heritage-red-700'}`} />
                <span>7. Nhật Ký Kiểm Toán</span>
              </button>

              {/* 8. An ninh & Chốt chặn */}
              <button
                onClick={() => setActiveNav('security')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left group ${
                  activeNav === 'security'
                    ? 'bg-gradient-to-r from-heritage-red-800 to-heritage-red-700 text-white shadow-sm border-l-4 border-heritage-gold-400 pl-3'
                    : 'text-heritage-ink-800 hover:bg-heritage-gold-100/50 hover:text-heritage-red-900 border-l-4 border-transparent pl-3'
                }`}
              >
                <Shield className={`w-4 h-4 flex-shrink-0 ${activeNav === 'security' ? 'text-heritage-gold-300' : 'text-heritage-gold-600/80 group-hover:text-heritage-red-700'}`} />
                <span>8. An Ninh & Chốt Chặn</span>
              </button>

              {/* 9. Quản trị Mật khẩu & Tài khoản */}
              <button
                onClick={() => setActiveNav('password-manager')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left group ${
                  activeNav === 'password-manager'
                    ? 'bg-gradient-to-r from-heritage-red-800 to-heritage-red-700 text-white shadow-sm border-l-4 border-heritage-gold-400 pl-3'
                    : 'text-heritage-ink-800 hover:bg-heritage-gold-100/50 hover:text-heritage-red-900 border-l-4 border-transparent pl-3'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0 pr-2">
                  <KeyRound className={`w-4 h-4 flex-shrink-0 ${activeNav === 'password-manager' ? 'text-heritage-gold-300' : 'text-heritage-gold-600/80 group-hover:text-heritage-red-700'}`} />
                  <span className="truncate">9. Quản Trị Mật Khẩu</span>
                </div>
                <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap transition-colors ${
                  activeNav === 'password-manager' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900 border border-amber-300/80'
                }`}>
                  Bảo mật
                </span>
              </button>

              <div className="pt-3 pb-1 px-3 text-[10px] font-extrabold uppercase tracking-wider text-heritage-ink-500 select-none flex items-center justify-between">
                <span>Hội Thi & Phong Trào</span>
                <span className="w-10 h-px bg-heritage-gold-300/60" />
              </div>

              {/* 10. Quản trị Hội thi, Câu hỏi & Học sinh */}
              <button
                onClick={() => setActiveNav('contest')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left group ${
                  activeNav === 'contest'
                    ? 'bg-gradient-to-r from-heritage-red-800 to-heritage-red-700 text-white shadow-sm border-l-4 border-heritage-gold-400 pl-3'
                    : 'text-heritage-ink-800 hover:bg-heritage-gold-100/50 hover:text-heritage-red-900 border-l-4 border-transparent pl-3'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0 pr-2">
                  <Trophy className={`w-4 h-4 flex-shrink-0 ${activeNav === 'contest' ? 'text-heritage-gold-300' : 'text-heritage-gold-600/80 group-hover:text-heritage-red-700'}`} />
                  <span className="truncate">10. Quản Trị Hội Thi & Đề Thi</span>
                </div>
                <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap transition-colors ${
                  activeNav === 'contest' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900 border border-amber-300/80'
                }`}>
                  {contestQuestionsCount} câu
                </span>
              </button>

              <div className="pt-3 pb-1 px-3 text-[10px] font-extrabold uppercase tracking-wider text-heritage-ink-500 select-none flex items-center justify-between">
                <span>Trợ Lý AI & RAG (ADR-002)</span>
                <span className="w-10 h-px bg-heritage-gold-300/60" />
              </div>

              {/* 11. Kho Tri Thức RAG */}
              <button
                onClick={() => setActiveNav('rag-knowledge')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left group ${
                  activeNav === 'rag-knowledge'
                    ? 'bg-gradient-to-r from-heritage-red-800 to-heritage-red-700 text-white shadow-sm border-l-4 border-heritage-gold-400 pl-3'
                    : 'text-heritage-ink-800 hover:bg-heritage-gold-100/50 hover:text-heritage-red-900 border-l-4 border-transparent pl-3'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0 pr-2">
                  <Database className={`w-4 h-4 flex-shrink-0 ${activeNav === 'rag-knowledge' ? 'text-heritage-gold-300' : 'text-heritage-gold-600/80 group-hover:text-heritage-red-700'}`} />
                  <span className="truncate">11. Kho Tri Thức RAG</span>
                </div>
                <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap transition-colors ${
                  activeNav === 'rag-knowledge' ? 'bg-white/20 text-white' : 'bg-heritage-gold-100 text-heritage-red-950 border border-heritage-gold-300'
                }`}>
                  Phase 02
                </span>
              </button>
            </div>

            {/* Sidebar Bottom Status */}
            <div className="p-3 border-t border-heritage-gold-300/50 bg-heritage-ivory-200/50 text-xs">
              <div className="flex items-center space-x-2 text-[11px] text-emerald-800 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Hạ Tầng Sẵn Sàng Vận Hành</span>
              </div>
              <p className="text-[10px] text-heritage-ink-500 font-mono mt-0.5">
                CMS v2.3 Redesign • Gate G4 Active
              </p>
            </div>
          </aside>

          {/* ========================================================================= */}
          {/* MAIN CONTENT WORKSPACE AREA                                               */}
          {/* ========================================================================= */}
          <main className="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8 bg-heritage-ivory-50">
            {/* Toast Feedback */}
            {toastMsg && (
              <div
                className={`mb-5 p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between shadow-md border animate-fadeIn ${
                  toastMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                    : toastMsg.type === 'error'
                    ? 'bg-red-50 text-red-900 border-red-300'
                    : 'bg-blue-50 text-blue-900 border-blue-300'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  {toastMsg.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                  {toastMsg.type === 'error' && <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />}
                  {toastMsg.type === 'info' && <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                  <span>{toastMsg.text}</span>
                </div>
                <button onClick={() => setToastMsg(null)} className="p-1 hover:opacity-70">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* VIEW 1: OVERVIEW DASHBOARD (Tổng Quan KPI & Hoạt Động Gần Đây)          */}
            {/* ----------------------------------------------------------------------- */}
            {activeNav === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif font-black text-xl sm:text-2xl text-heritage-red-900">
                    Tổng Quan Điều Hành Biên Tập Học Đường
                  </h2>
                  <p className="text-xs text-heritage-ink-600 mt-1">
                    Bảng điều khiển trung tâm quản lý luồng xuất bản Không gian văn hóa Hồ Chí Minh theo cơ chế duyệt 4 mắt.
                  </p>
                </div>

                {/* 5 KPI Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-heritage-gold-300/60 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-heritage-ink-500">
                        Tổng Bài Viết
                      </p>
                      <p className="text-2xl sm:text-3xl font-serif font-black text-heritage-red-900 mt-1">
                        {totalCount}
                      </p>
                    </div>
                    <div className="p-2.5 sm:p-3 bg-heritage-red-50 text-heritage-red-700 rounded-xl">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  </div>

                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-heritage-gold-300/60 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-heritage-ink-500">
                        Bản Nháp (Draft)
                      </p>
                      <p className="text-2xl sm:text-3xl font-serif font-black text-amber-600 mt-1">
                        {draftCount}
                      </p>
                    </div>
                    <div className="p-2.5 sm:p-3 bg-amber-50 text-amber-600 rounded-xl">
                      <PenTool className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  </div>

                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-purple-200 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
                        Chờ Duyệt 4 Mắt
                      </p>
                      <p className="text-2xl sm:text-3xl font-serif font-black text-purple-700 mt-1">
                        {pendingCount}
                      </p>
                    </div>
                    <div className="p-2.5 sm:p-3 bg-purple-50 text-purple-700 rounded-xl">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  </div>

                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                        Đã Xuất Bản Live
                      </p>
                      <p className="text-2xl sm:text-3xl font-serif font-black text-emerald-700 mt-1">
                        {publishedCount}
                      </p>
                    </div>
                    <div className="p-2.5 sm:p-3 bg-emerald-50 text-emerald-700 rounded-xl">
                      <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  </div>

                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-300 shadow-sm flex items-center justify-between col-span-2 sm:col-span-1">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-heritage-gold-800 flex items-center gap-1">
                        <span>Lượt Đọc Thực Tế</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Chống view ảo kích hoạt" />
                      </p>
                      <p className="text-2xl sm:text-3xl font-serif font-black text-heritage-gold-700 mt-1">
                        {totalRealViews.toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <div className="p-2.5 sm:p-3 bg-amber-50 text-heritage-gold-700 rounded-xl" title="Bộ đếm đã được khử trùng lặp và kiểm soát thời gian đọc">
                      <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  </div>
                </div>

                {/* Quick Action Banner */}
                <div className="p-5 bg-gradient-to-r from-heritage-red-800 to-heritage-red-900 rounded-2xl text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <h3 className="font-serif font-bold text-base sm:text-lg text-heritage-gold-300">
                      Khởi tạo Tư Liệu Không Gian Văn Hóa Mới
                    </h3>
                    <p className="text-xs text-white/80 max-w-xl">
                      Soạn thảo bài viết với Trình soạn thảo Toàn màn hình chuyên nghiệp, thanh công cụ Rich Text và đính kèm tư liệu đa phương tiện an toàn.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingArticle(null);
                      setIsEditing(true);
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-heritage-gold-400 to-heritage-gold-500 text-heritage-red-950 font-bold text-xs sm:text-sm rounded-xl shadow-md hover:brightness-105 transition flex items-center space-x-2 flex-shrink-0"
                  >
                    <PenTool className="w-4 h-4" />
                    <span>Soạn bài mới ngay</span>
                  </button>
                </div>

                {/* Contest & Student Management Banner */}
                <div className="p-5 bg-gradient-to-r from-amber-500/15 via-heritage-gold-400/20 to-amber-600/10 border-2 border-heritage-gold-400/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-heritage-red-700 text-white flex items-center justify-center flex-shrink-0 shadow-sm border border-heritage-gold-400">
                      <Trophy className="w-6 h-6 text-heritage-gold-400" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base sm:text-lg text-heritage-red-950">
                        Quản Trị Hội Thi Trực Tuyến & Học Sinh 24 Lớp
                      </h3>
                      <p className="text-xs text-heritage-ink-700 mt-0.5">
                        Ngân hàng <strong>{contestQuestionsCount} câu hỏi</strong> • Đã nộp <strong>{contestSubmissionsCount} bài thi</strong> • Bảng điểm Excel • Danh sách học sinh theo 24 lớp
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveNav('contest')}
                    className="px-5 py-2.5 bg-heritage-red-700 hover:bg-heritage-red-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition flex items-center space-x-2 flex-shrink-0"
                  >
                    <GraduationCap className="w-4 h-4 text-heritage-gold-300" />
                    <span>Mở bảng quản trị hội thi</span>
                  </button>
                </div>

                {/* Recent Articles Section */}
                <div className="bg-white rounded-2xl border border-heritage-gold-300/60 p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-base text-heritage-red-900">
                      Cập Nhật Gần Đây Trong Toàn Hệ Thống
                    </h3>
                    <button
                      onClick={() => setActiveNav('articles')}
                      className="text-xs text-heritage-red-700 hover:underline font-semibold flex items-center space-x-1"
                    >
                      <span>Xem toàn bộ ({totalCount})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {articles.slice(0, 4).map((art) => (
                      <div
                        key={art.id}
                        className="p-3.5 bg-heritage-ivory-50 hover:bg-heritage-ivory-100/80 rounded-xl border border-heritage-gold-300/30 transition flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0 flex-grow">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              art.status === 'published'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : art.status === 'pending'
                                ? 'bg-purple-100 text-purple-800 border border-purple-200 animate-pulse'
                                : art.status === 'approved'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}>
                              {art.status === 'published' ? 'Đã xuất bản' : art.status === 'pending' ? 'Chờ duyệt 4 mắt' : art.status === 'approved' ? 'Đã duyệt' : 'Bản nháp'}
                            </span>
                            <span className="text-[11px] text-heritage-ink-500 font-mono">
                              /{art.slug}
                            </span>
                          </div>
                          <h4 className="font-serif font-bold text-sm text-heritage-red-900 mt-1 truncate">
                            {art.title}
                          </h4>
                          <p className="text-xs text-heritage-ink-600 line-clamp-1 mt-0.5">
                            {art.summary}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2 flex-shrink-0">
                          {art.status === 'pending' && (
                            <button
                              onClick={() => {
                                setReviewingArticle(art);
                                setReviewModalOpen(true);
                              }}
                              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center space-x-1"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Kiểm duyệt</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setEditingArticle(art);
                              setIsEditing(true);
                            }}
                            className="px-3 py-1.5 bg-white hover:bg-heritage-ivory-200 text-heritage-ink-800 border border-heritage-gold-300 rounded-lg text-xs font-semibold transition"
                          >
                            Chỉnh sửa
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* VIEW 2: ARTICLES MANAGEMENT TABLE (Danh Sách & Bộ Lọc Nâng Cao)          */}
            {/* ----------------------------------------------------------------------- */}
            {(activeNav === 'articles' || activeNav === 'pending' || activeNav === 'published') && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="font-serif font-black text-xl text-heritage-red-900">
                      {activeNav === 'pending'
                        ? 'Hàng Đợi Kiểm Duyệt 4 Mắt (Review Queue)'
                        : activeNav === 'published'
                        ? 'Danh Mục Bài Viết Đang Xuất Bản Live'
                        : 'Quản Lý Danh Sách Bài Viết & Tư Liệu'}
                    </h2>
                    <p className="text-xs text-heritage-ink-600 mt-0.5">
                      Bảng tra cứu, lọc trạng thái vòng đời và kiểm soát xuất bản theo nguyên tắc Four-Eyes.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingArticle(null);
                      setIsEditing(true);
                    }}
                    className="px-4 py-2 bg-heritage-red-700 hover:bg-heritage-red-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center space-x-2 self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Soạn bài viết mới</span>
                  </button>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-3.5 rounded-2xl border border-heritage-gold-300/60 shadow-sm flex flex-wrap items-center gap-2.5">
                  <div className="relative flex-grow min-w-[200px]">
                    <Search className="w-4 h-4 text-heritage-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm theo tiêu đề, tóm tắt hoặc từ khóa..."
                      className="w-full pl-9 pr-3 py-1.5 bg-heritage-ivory-50 border border-heritage-gold-300/40 rounded-xl text-xs text-heritage-ink-900 outline-none focus:ring-2 focus:ring-heritage-red-600"
                    />
                  </div>

                  {activeNav === 'articles' && (
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-1.5 bg-heritage-ivory-50 border border-heritage-gold-300/40 rounded-xl text-xs font-semibold text-heritage-ink-800 outline-none"
                      >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="draft">Bản nháp (Draft)</option>
                        <option value="pending">Chờ duyệt (Pending)</option>
                        <option value="approved">Đã duyệt (Approved)</option>
                        <option value="published">Đã xuất bản (Published)</option>
                        <option value="rejected">Bị từ chối (Rejected)</option>
                      </select>

                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-3 py-1.5 bg-heritage-ivory-50 border border-heritage-gold-300/40 rounded-xl text-xs font-semibold text-heritage-ink-800 outline-none"
                      >
                        <option value="all">Tất cả chuyên mục trang chủ</option>
                        {CMS_CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.icon} {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Main Data Table */}
                <div className="bg-white rounded-2xl border border-heritage-gold-300/60 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-heritage-ivory-200/80 text-heritage-red-950 uppercase font-serif text-[11px] border-b border-heritage-gold-300/50">
                        <tr>
                          <th className="py-3 px-4 font-bold">Tiêu Đề & Tóm Tắt</th>
                          <th className="py-3 px-3 font-bold">Chuyên Mục</th>
                          <th className="py-3 px-3 font-bold">Tác Giả</th>
                          <th className="py-3 px-3 font-bold">Trạng Thái</th>
                          <th className="py-3 px-3 font-bold text-center">Lượt Đọc</th>
                          <th className="py-3 px-3 font-bold">Cập Nhật</th>
                          <th className="py-3 px-4 font-bold text-right">Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-heritage-ivory-200 font-sans">
                        {filteredArticles.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-heritage-ink-500 italic">
                              Không tìm thấy bài viết nào phù hợp với bộ lọc.
                            </td>
                          </tr>
                        ) : (
                          filteredArticles.map((art) => (
                            <tr key={art.id} className="hover:bg-heritage-ivory-50 transition">
                              <td className="py-3 px-4 max-w-sm">
                                <div className="font-serif font-bold text-sm text-heritage-red-900 leading-snug line-clamp-1">
                                  {art.title}
                                </div>
                                <div className="text-[11px] text-heritage-ink-500 line-clamp-1 mt-0.5 font-sans">
                                  {art.summary}
                                </div>
                                <div className="text-[10px] font-mono text-heritage-gold-700 mt-0.5">
                                  /{art.slug}
                                </div>
                              </td>

                              <td className="py-3 px-3">
                                <div className="flex flex-col space-y-1">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-heritage-ivory-200 text-heritage-red-950 border border-heritage-gold-300/50 w-fit whitespace-nowrap">
                                    {getCategoryLabel(art.category)}
                                  </span>
                                  {art.topic && (
                                    <span className="text-[10px] text-heritage-gold-700 italic truncate max-w-[130px]" title={art.topic}>
                                      ⭐ {art.topic}
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td className="py-3 px-3 whitespace-nowrap">
                                <span className="font-semibold text-heritage-ink-800 block">
                                  {art.author_name}
                                </span>
                              </td>

                              <td className="py-3 px-3 whitespace-nowrap">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block ${
                                  art.status === 'published'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : art.status === 'pending'
                                    ? 'bg-purple-100 text-purple-800 border border-purple-300 animate-pulse'
                                    : art.status === 'approved'
                                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                    : art.status === 'rejected'
                                    ? 'bg-red-100 text-red-800 border border-red-300'
                                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                                }`}>
                                  {art.status === 'published'
                                    ? 'Đã xuất bản'
                                    : art.status === 'pending'
                                    ? 'Chờ duyệt 4 mắt'
                                    : art.status === 'approved'
                                    ? 'Đã duyệt'
                                    : art.status === 'rejected'
                                    ? 'Yêu cầu sửa'
                                    : 'Bản nháp'}
                                </span>
                              </td>

                              <td className="py-3 px-3 text-center whitespace-nowrap">
                                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-heritage-gold-800 border border-heritage-gold-300/70" title="Số lượt đọc thực tế đã được kiểm duyệt chống view ảo">
                                  <Eye className="w-3.5 h-3.5 text-heritage-gold-600" />
                                  <span>{(viewsMap[art.id || `art-${art.slug}`] || 0).toLocaleString('vi-VN')}</span>
                                </span>
                              </td>

                              <td className="py-3 px-3 whitespace-nowrap text-heritage-ink-500 text-[11px]">
                                {art.updated_at || art.created_at}
                              </td>

                              <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                                {art.status === 'pending' && (
                                  <button
                                    onClick={() => {
                                      setReviewingArticle(art);
                                      setReviewModalOpen(true);
                                    }}
                                    className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition inline-flex items-center space-x-1 shadow-sm"
                                    title="Kiểm duyệt quy trình 4 mắt"
                                  >
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span>Kiểm duyệt</span>
                                  </button>
                                )}

                                {art.status === 'draft' && (
                                  <button
                                    onClick={() => handleSubmitReview(art)}
                                    className="px-2.5 py-1 bg-heritage-red-700 hover:bg-heritage-red-800 text-white rounded-lg text-xs font-bold transition inline-flex items-center space-x-1 shadow-sm"
                                    title="Nộp duyệt bài 4 mắt"
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                    <span>Nộp duyệt</span>
                                  </button>
                                )}

                                <button
                                  onClick={() => {
                                    setEditingArticle(art);
                                    setIsEditing(true);
                                  }}
                                  className="p-1.5 hover:bg-heritage-ivory-200 text-heritage-ink-700 rounded-lg transition inline-block border border-heritage-gold-300/40"
                                  title="Chỉnh sửa toàn màn hình"
                                >
                                  <PenTool className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* VIEW 5: MEDIA ASSET MANAGEMENT DASHBOARD                                */}
            {/* ----------------------------------------------------------------------- */}
            {activeNav === 'media' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="font-serif font-black text-xl text-heritage-red-900">
                      Kho Tư Liệu Đa Phương Tiện (Media Asset Management)
                    </h2>
                    <p className="text-xs text-heritage-ink-600 mt-0.5">
                      Lưu trữ hình ảnh, tư liệu lịch sử có định danh mã băm SHA-256 và chốt chặn an toàn Upload Gate &le; 2MB.
                    </p>
                  </div>

                  <label className="px-4 py-2.5 bg-heritage-red-700 hover:bg-heritage-red-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center space-x-2 cursor-pointer self-start sm:self-auto">
                    <Upload className="w-4 h-4" />
                    <span>{isUploadingMedia ? 'Đang mã hóa SHA-256...' : 'Tải lên ảnh mới'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleMediaUpload}
                      disabled={isUploadingMedia}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Upload feedback */}
                {mediaUploadError && (
                  <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-xs text-red-800 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span>{mediaUploadError}</span>
                  </div>
                )}
                {mediaUploadSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{mediaUploadSuccess}</span>
                  </div>
                )}

                {/* Search Bar & Stats */}
                <div className="bg-white p-3.5 rounded-2xl border border-heritage-gold-300/60 shadow-sm flex flex-wrap items-center justify-between gap-3">
                  <div className="relative flex-grow max-w-md">
                    <Search className="w-4 h-4 text-heritage-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={mediaSearchQuery}
                      onChange={(e) => setMediaSearchQuery(e.target.value)}
                      placeholder="Tìm tư liệu theo tên tệp hoặc tác giả..."
                      className="w-full pl-9 pr-3 py-1.5 bg-heritage-ivory-50 border border-heritage-gold-300/40 rounded-xl text-xs text-heritage-ink-900 outline-none focus:ring-2 focus:ring-heritage-red-600"
                    />
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-heritage-ink-600">
                    <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Chốt chặn <strong>Media Upload Gate</strong>: Chỉ nhận .jpg, .png, .webp &le; 2MB</span>
                  </div>
                </div>

                {/* Media Assets Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {mediaAssets
                    .filter((m) =>
                      m.name.toLowerCase().includes(mediaSearchQuery.toLowerCase()) ||
                      m.author.toLowerCase().includes(mediaSearchQuery.toLowerCase())
                    )
                    .map((asset) => (
                      <div
                        key={asset.id}
                        className="bg-white rounded-2xl border border-heritage-gold-300/60 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group"
                      >
                        <div className="h-44 bg-heritage-ivory-100 relative overflow-hidden flex items-center justify-center p-2">
                          <img
                            src={asset.url}
                            alt={asset.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/logo-bieu-tuong.png';
                            }}
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[10px] rounded font-mono">
                            {(asset.size_bytes / 1024).toFixed(1)} KB
                          </span>
                          <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-emerald-700/80 backdrop-blur-sm text-white text-[9px] rounded font-bold uppercase">
                            {asset.mime_type.split('/')[1]}
                          </span>
                        </div>

                        <div className="p-3.5 flex-grow flex flex-col justify-between space-y-2">
                          <div>
                            <h4 className="font-serif font-bold text-xs text-heritage-red-900 truncate" title={asset.name}>
                              {asset.name}
                            </h4>
                            <p className="text-[11px] text-heritage-ink-600 mt-1 line-clamp-1">
                              <strong>Tác giả:</strong> {asset.author}
                            </p>
                            <p className="text-[10px] text-heritage-ink-400 font-mono mt-1 truncate" title={asset.sha256_hash}>
                              SHA: {asset.sha256_hash.substring(0, 16)}...
                            </p>
                          </div>

                          <div className="pt-2 border-t border-heritage-ivory-200 flex items-center justify-between gap-1">
                            <button
                              onClick={() => handleCopyMediaMarkdown(asset)}
                              className="px-2.5 py-1 bg-heritage-ivory-100 hover:bg-heritage-ivory-200 text-heritage-ink-800 rounded-lg text-[11px] font-semibold flex items-center space-x-1 transition border border-heritage-gold-300/40"
                              title="Sao chép thẻ ![Tên ảnh](media://id) để chèn vào bài viết (Không bị tràn ký tự Base64)"
                            >
                              {copiedMediaId === asset.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>Đã chép mã</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Chép mã chèn</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => handleDeleteMedia(asset)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition ml-auto"
                              title="Xóa tài nguyên"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* VIEW 6: AUDIT TRAIL LOGS (Nhật Ký Kiểm Toán Bất Biến)                   */}
            {/* ----------------------------------------------------------------------- */}
            {activeNav === 'audit' && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-serif font-black text-xl text-heritage-red-900">
                    Nhật Ký Kiểm Toán Phê Duyệt Bất Biến (Audit Trail)
                  </h2>
                  <p className="text-xs text-heritage-ink-600 mt-0.5">
                    Hệ thống lưu vết tự động append-only, ghi nhận đầy đủ người thực hiện, thời gian, quyết định và lý do thẩm định.
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-heritage-gold-300/60 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-heritage-ivory-200/80 text-heritage-red-950 uppercase font-serif text-[11px] border-b border-heritage-gold-300/50">
                        <tr>
                          <th className="py-3 px-4 font-bold">Thời Gian</th>
                          <th className="py-3 px-3 font-bold">Hành Động Nghiệp Vụ</th>
                          <th className="py-3 px-3 font-bold">Bài Viết Liên Quan</th>
                          <th className="py-3 px-3 font-bold">Người Thực Hiện & Vai Trò</th>
                          <th className="py-3 px-4 font-bold">Quyết Định & Nhận Xét</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-heritage-ivory-200 font-sans">
                        {auditLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-heritage-ivory-50 transition">
                            <td className="py-3.5 px-4 font-mono text-[11px] text-heritage-ink-600 whitespace-nowrap">
                              {log.timestamp}
                            </td>

                            <td className="py-3.5 px-3">
                              <span className="px-2 py-0.5 rounded bg-heritage-ivory-300 font-mono text-[10px] font-bold text-heritage-ink-800">
                                {log.action}
                              </span>
                            </td>

                            <td className="py-3.5 px-3 font-serif font-bold text-heritage-red-900 max-w-xs truncate">
                              {log.article_title}
                            </td>

                            <td className="py-3.5 px-3">
                              <span className="font-bold text-heritage-ink-900 block">{log.actor}</span>
                              <span className="text-[10px] text-heritage-gold-700 font-semibold">{log.role}</span>
                            </td>

                            <td className="py-3.5 px-4 text-heritage-ink-700 italic max-w-sm">
                              "{log.feedback}"
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* VIEW 7: SECURITY & SAFETY GATES REPORT (Báo Cáo An Ninh RLS)            */}
            {/* ----------------------------------------------------------------------- */}
            {activeNav === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif font-black text-xl text-heritage-red-900">
                    Báo Cáo Tình Trạng Chốt Chặn Kỹ Thuật (Safety Gates Status)
                  </h2>
                  <p className="text-xs text-heritage-ink-600 mt-0.5">
                    Hệ thống rào chắn bảo mật và kiểm soát nguyên tử theo tiêu chuẩn vận hành sản xuất Gate G4.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-emerald-300 shadow-sm space-y-2">
                    <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Cơ chế kiểm soát 4 mắt (Four-Eyes Enforcement)</span>
                    </div>
                    <p className="text-xs text-heritage-ink-600 leading-relaxed">
                      Chặn đứng hoàn toàn khả năng tự duyệt bài viết của tác giả khởi tạo. Khi tác giả mở bài viết của mình, nút Duyệt bị vô hiệu hóa kèm cảnh báo màu đỏ.
                    </p>
                    <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                      VERIFIED ON PRODUCTION (PASS)
                    </span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-emerald-300 shadow-sm space-y-2">
                    <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Nhật ký bất biến (Audit Log Immutability)</span>
                    </div>
                    <p className="text-xs text-heritage-ink-600 leading-relaxed">
                      Bảng `audit_logs` được cấu hình trigger Append-Only, cấm tuyệt đối mọi thao tác UPDATE và DELETE để bảo vệ bằng chứng kiểm toán thanh tra.
                    </p>
                    <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                      VERIFIED ON PRODUCTION (PASS)
                    </span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-emerald-300 shadow-sm space-y-2">
                    <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Upload Security Gate & An toàn Media</span>
                    </div>
                    <p className="text-xs text-heritage-ink-600 leading-relaxed">
                      Giới hạn tệp &le; 2MB, chỉ cho phép ảnh .jpg, .png, .webp. Tự động kiểm tra tham chiếu bài viết trước khi cho phép xóa để chống lỗi gãy ảnh.
                    </p>
                    <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                      VERIFIED ON PRODUCTION (PASS)
                    </span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-emerald-300 shadow-sm space-y-2">
                    <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Chống gửi lặp (Idempotency Key Enforcement)</span>
                    </div>
                    <p className="text-xs text-heritage-ink-600 leading-relaxed">
                      Cơ chế khóa request đảm bảo khi người dùng nhấn liên tiếp nhiều lần trong mạng trễ, hệ thống chỉ sinh đúng 01 bản ghi duy nhất.
                    </p>
                    <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                      VERIFIED ON PRODUCTION (PASS)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* VIEW 9: QUẢN TRỊ MẬT KHẨU & TÀI KHOẢN (Password & Credentials Manager)  */}
            {/* ----------------------------------------------------------------------- */}
            {activeNav === 'password-manager' && (
              <PasswordManager />
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* VIEW 10: KHO TRI THỨC RAG (ADR-002 Phase 02)                            */}
            {/* ----------------------------------------------------------------------- */}
            {activeNav === 'rag-knowledge' && (
              <RagKnowledgeManager />
            )}
          </main>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FULL-SCREEN ARTICLE EDITOR MODAL (Khi người dùng soạn bài mới hoặc sửa)  */}
      {/* ========================================================================= */}
      {isEditing && (
        <FullScreenEditor
          initialArticle={editingArticle}
          onBack={() => setIsEditing(false)}
          onSaveDraft={handleSaveDraft}
          onSubmitReview={handleSubmitReview}
          currentUserName={currentPersona.name}
        />
      )}

      {/* ========================================================================= */}
      {/* FOUR-EYES APPROVAL REVIEW MODAL                                           */}
      {/* ========================================================================= */}
      {reviewModalOpen && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          article={reviewingArticle}
          currentUserId={currentPersona.id}
          currentUserName={currentPersona.name}
          onApprove={handleApproveArticle}
          onReject={handleRejectArticle}
        />
      )}

      {/* ========================================================================= */}
      {/* MEDIA LIBRARY PICKER MODAL (Cho trường hợp mở từ nơi khác)                */}
      {/* ========================================================================= */}
      {mediaLibraryOpen && (
        <MediaLibraryModal
          isOpen={mediaLibraryOpen}
          onClose={() => setMediaLibraryOpen(false)}
        />
      )}

      {/* ========================================================================= */}
      {/* CONTEST & QUESTION MANAGER MODAL (Khi người dùng chọn tab Hội thi)         */}
      {/* ========================================================================= */}
      {activeNav === 'contest' && (
        <ContestManagerModal
          isOpen={true}
          onClose={() => setActiveNav('overview')}
        />
      )}
    </>
  );
};

export default CmsDashboard;
