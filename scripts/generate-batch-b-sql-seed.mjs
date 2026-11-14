import fs from 'fs';
import path from 'path';

const manifestPath = path.resolve('knowledge_expansion_batch_b_selective_manifest.jsonl');
const chunksPath = path.resolve('knowledge_expansion_batch_b_selective_chunks.jsonl');
const outputSqlPath = path.resolve('supabase/seeds/001_rag_batch_b_selective_seed.sql');

const manifestLines = fs.readFileSync(manifestPath, 'utf8').trim().split('\n').filter(Boolean);
const chunksLines = fs.readFileSync(chunksPath, 'utf8').trim().split('\n').filter(Boolean);

const docs = manifestLines.map(line => JSON.parse(line));
const chunks = chunksLines.map(line => JSON.parse(line));

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

function escapeJson(obj) {
  if (!obj) return "'{}'::jsonb";
  return `'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`;
}

function escapeArray(arr) {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return "'{}'::text[]";
  const elements = arr.map(item => `"${String(item).replace(/"/g, '\\"')}"`).join(',');
  return `'${elements}'::text[]`;
}

let sql = `-- ==============================================================================
-- DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
-- SEED SCRIPT: 001_rag_batch_b_selective_seed.sql
-- KNOWLEDGE EXPANSION 01 - BATCH B - STAGING PERSISTENCE SEED
-- SCOPE: DOC-HCM-026, DOC-HCM-027, DOC-HCM-028 (3 HỒ SƠ & 37 CHUNKS)
-- GOVERNANCE: PENDING_REVIEW, is_allowed_for_rag = FALSE (ZERO SELF-APPROVAL)
-- ==============================================================================

BEGIN;

-- 1. BẢO ĐẢM CÁC DANH MỤC TIÊU CHUẨN ĐÃ TỒN TẠI (TRÁNH LỖI FOREIGN KEY)
INSERT INTO public.rag_categories (id, name, description, icon, badge_class)
VALUES 
  ('hcmc-history', 'Lịch sử Thành phố Hồ Chí Minh & Thới An', 'Địa giới hành chính, truyền thống lịch sử Sài Gòn - Gia Định và vùng đất Thới An', 'MapPin', 'bg-emerald-100 text-emerald-800'),
  ('school-education', 'Hoạt động giáo dục và học tập tại nhà trường', 'Lịch sử, truyền thống và kế hoạch giáo dục của Trường THCS Nguyễn Trung Trực', 'GraduationCap', 'bg-indigo-100 text-indigo-800')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = NOW();

-- 2. ĐỒNG BỘ 3 HỒ SƠ TRI THỨC BATCH B VÀO BẢNG public.rag_documents
`;

for (const doc of docs) {
  const metadata = {
    candidateCode: doc.candidateCode,
    historicalPeriod: doc.historicalPeriod,
    geographicalScope: doc.geographicalScope,
    administrativeUnitAtPublication: doc.administrativeUnitAtPublication,
    administrativeUnitCurrent: doc.administrativeUnitCurrent,
    copyrightStatus: doc.copyrightStatus,
    rightsEvidence: doc.rightsEvidence,
    batch: 'BATCH_B_SELECTIVE_01'
  };

  sql += `
INSERT INTO public.rag_documents (
  document_id, title, description, document_type, category,
  author, publisher, source_url, original_file_name, mime_type,
  checksum, file_size, approval_status, is_allowed_for_rag, version,
  uploaded_by, uploaded_by_name, topics, content, chunks_count, metadata, updated_at
) VALUES (
  ${escapeSql(doc.documentId)},
  ${escapeSql(doc.title)},
  ${escapeSql(doc.description)},
  ${escapeSql(doc.documentType || 'article')},
  ${escapeSql(doc.category)},
  ${escapeSql(doc.author)},
  ${escapeSql(doc.publisher)},
  ${escapeSql(doc.sourceUrl)},
  ${escapeSql(doc.originalFileName)},
  ${escapeSql(doc.mimeType)},
  ${escapeSql(doc.sha256Checksum)},
  ${doc.fileSize || 0},
  'PENDING_REVIEW',
  FALSE,
  1,
  ${escapeSql(doc.uploadedBy || 'OP-STAGING-INGEST')},
  ${escapeSql('Cán bộ phụ trách Ingestion STAGING')},
  ${escapeArray(doc.topics || [doc.categoryLabel])},
  ${escapeSql(doc.description)},
  ${doc.chunkCount},
  ${escapeJson(metadata)},
  NOW()
)
ON CONFLICT (document_id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  author = EXCLUDED.author,
  publisher = EXCLUDED.publisher,
  source_url = EXCLUDED.source_url,
  checksum = EXCLUDED.checksum,
  file_size = EXCLUDED.file_size,
  approval_status = 'PENDING_REVIEW',
  is_allowed_for_rag = FALSE,
  chunks_count = EXCLUDED.chunks_count,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();
`;
}

sql += `
-- 3. ĐỒNG BỘ 37 CHUNKS TRI THỨC VÀO BẢNG public.rag_document_chunks
`;

for (const c of chunks) {
  const metadata = {
    documentId: c.documentId,
    documentTitle: c.documentTitle,
    sectionTitle: c.sectionTitle,
    candidateCode: c.candidateCode,
    batch: 'BATCH_B_SELECTIVE_01'
  };

  sql += `
INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  ${escapeSql(c.chunkId)},
  ${escapeSql(c.documentId)},
  ${escapeSql(c.documentTitle)},
  ${escapeSql(c.text)},
  ${escapeSql(c.sectionTitle)},
  ${escapeSql(c.documentTitle)},
  'PENDING_REVIEW',
  ${escapeSql(c.provenanceLocator)},
  ${c.tokenEstimate || 0},
  ${escapeJson(metadata)},
  NOW()
)
ON CONFLICT (chunk_id) DO UPDATE SET
  content = EXCLUDED.content,
  section_or_page = EXCLUDED.section_or_page,
  source_status = 'PENDING_REVIEW',
  provenance_locator = EXCLUDED.provenance_locator,
  token_estimate = EXCLUDED.token_estimate,
  metadata = EXCLUDED.metadata,
  processed_at = NOW();
`;
}

sql += `
COMMIT;

-- KIỂM THỬ XÁC NHẬN SAU KHI THỰC THI:
SELECT document_id, title, approval_status, is_allowed_for_rag, chunks_count, checksum
FROM public.rag_documents
WHERE document_id IN ('DOC-HCM-026', 'DOC-HCM-027', 'DOC-HCM-028');

SELECT document_id, COUNT(*) AS actual_chunks_count
FROM public.rag_document_chunks
WHERE document_id IN ('DOC-HCM-026', 'DOC-HCM-027', 'DOC-HCM-028')
GROUP BY document_id;
`;

fs.mkdirSync(path.dirname(outputSqlPath), { recursive: true });
fs.writeFileSync(outputSqlPath, sql, 'utf8');
console.log(`[PASS] Generated SQL seed with ${docs.length} documents and ${chunks.length} chunks at: ${outputSqlPath}`);
