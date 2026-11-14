-- ==============================================================================
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

INSERT INTO public.rag_documents (
  document_id, title, description, document_type, category,
  author, publisher, source_url, original_file_name, mime_type,
  checksum, file_size, approval_status, is_allowed_for_rag, version,
  uploaded_by, uploaded_by_name, topics, content, chunks_count, metadata, updated_at
) VALUES (
  'DOC-HCM-026',
  'Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)',
  'Hồ sơ pháp lý xác thực về lịch sử địa giới hành chính phường Thới An: từ khi thành lập Quận 12 năm 1997 (Quyết định số 1195/QĐ-UB-NC) đến đợt sắp xếp đơn vị hành chính năm 2025 theo Nghị quyết số 1685/NQ-UBTVQH15 của Quốc hội.',
  'article',
  'hcmc-history',
  'UBND Thành phố Hồ Chí Minh & Ủy ban Thường vụ Quốc hội',
  'Công báo Thành phố Hồ Chí Minh & Cổng Thông tin điện tử Chính phủ',
  'https://xaydungchinhsach.chinhphu.vn/toan-van-nghi-quyet-so-1685-nq-ubtvqh15-sap-xep-cac-dvhc-cap-xa-cua-thanh-pho-ho-chi-minh-nam-2025-119250616211341304.htm',
  'doc-hcm-026-dia-gioi-hanh-chinh-thoi-an-qua-cac-thoi-ky.md',
  'text/markdown',
  '51476B0AE4233DA1C129E91CF6FB1C9E392A7D097FB4B94BE8D42C156653C5E4',
  4894,
  'PENDING_REVIEW',
  FALSE,
  1,
  'OP-STAGING-INGEST-BATCH-B-SELECTIVE',
  'Cán bộ phụ trách Ingestion STAGING',
  '"Lịch sử Thành phố Hồ Chí Minh"'::text[],
  'Hồ sơ pháp lý xác thực về lịch sử địa giới hành chính phường Thới An: từ khi thành lập Quận 12 năm 1997 (Quyết định số 1195/QĐ-UB-NC) đến đợt sắp xếp đơn vị hành chính năm 2025 theo Nghị quyết số 1685/NQ-UBTVQH15 của Quốc hội.',
  15,
  '{"candidateCode":"B-07","historicalPeriod":"1997 - 2025 - Hiện hành","geographicalScope":"Phường Thới An, Thành phố Hồ Chí Minh (hợp nhất từ phường Thới An và phường Thạnh Xuân cũ)","administrativeUnitAtPublication":"Thành phố Hồ Chí Minh","administrativeUnitCurrent":"Phường Thới An, Thành phố Hồ Chí Minh","copyrightStatus":"PUBLIC_DOMAIN_CONFIRMED","rightsEvidence":"Văn bản quy phạm pháp luật nhà nước (Quyết định số 1195/QĐ-UB-NC và Nghị quyết số 1685/NQ-UBTVQH15) không thuộc đối tượng bảo hộ quyền tác giả theo quy định tại Điều 19 Luật Sở hữu trí tuệ Việt Nam. Được phép lưu trữ, trích dẫn nguyên văn và khai thác công khai.","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_documents (
  document_id, title, description, document_type, category,
  author, publisher, source_url, original_file_name, mime_type,
  checksum, file_size, approval_status, is_allowed_for_rag, version,
  uploaded_by, uploaded_by_name, topics, content, chunks_count, metadata, updated_at
) VALUES (
  'DOC-HCM-027',
  'Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)',
  'Tư liệu lịch sử học đường chính thức của Trường THCS Nguyễn Trung Trực: từ mốc thành lập năm 2014 theo Quyết định số 155/QĐ-UBND của UBND Quận 12, quá trình phát triển phong trào Dạy tốt - Học tốt, kiện toàn quản lý theo Quyết định số 76/QĐ-UBND của UBND Phường Thới An và Đề án Không gian Văn hóa Hồ Chí Minh.',
  'article',
  'school-education',
  'Trường THCS Nguyễn Trung Trực & UBND Phường Thới An',
  'Cổng thông tin Trường THCS Nguyễn Trung Trực',
  'https://thcsnguyentrungtruc.hcm.edu.vn/gioi-thieu/gioi-thieu-truong-thcs-nguyen-trung-truc/ct/12684/691487',
  'doc-hcm-027-lich-su-truong-thcs-nguyen-trung-truc.md',
  'text/markdown',
  'EAA1AC69161B610ACF99C308E13D7EFA1178B17730721C6D5004BAF87C2F16A9',
  3945,
  'PENDING_REVIEW',
  FALSE,
  1,
  'OP-STAGING-INGEST-BATCH-B-SELECTIVE',
  'Cán bộ phụ trách Ingestion STAGING',
  '"Hoạt động giáo dục và học tập tại nhà trường"'::text[],
  'Tư liệu lịch sử học đường chính thức của Trường THCS Nguyễn Trung Trực: từ mốc thành lập năm 2014 theo Quyết định số 155/QĐ-UBND của UBND Quận 12, quá trình phát triển phong trào Dạy tốt - Học tốt, kiện toàn quản lý theo Quyết định số 76/QĐ-UBND của UBND Phường Thới An và Đề án Không gian Văn hóa Hồ Chí Minh.',
  11,
  '{"candidateCode":"B-10","historicalPeriod":"2014 - Hiện nay","geographicalScope":"Trường THCS Nguyễn Trung Trực, Phường Thới An, Thành phố Hồ Chí Minh","administrativeUnitAtPublication":"Phường Thới An, Thành phố Hồ Chí Minh","administrativeUnitCurrent":"Phường Thới An, Thành phố Hồ Chí Minh","copyrightStatus":"OPEN_ACCESS_REUSE_PERMITTED","rightsEvidence":"Tư liệu và hồ sơ giáo dục chính thức công khai của nhà trường (Trang giới thiệu chính thức và Kế hoạch giáo dục số 01/KH-NTT). Tài liệu đã được rà soát và loại bỏ toàn bộ thông tin cá nhân, điểm số của học sinh và dữ liệu nội bộ riêng tư theo quy định bảo vệ dữ liệu cá nhân.","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_documents (
  document_id, title, description, document_type, category,
  author, publisher, source_url, original_file_name, mime_type,
  checksum, file_size, approval_status, is_allowed_for_rag, version,
  uploaded_by, uploaded_by_name, topics, content, chunks_count, metadata, updated_at
) VALUES (
  'DOC-HCM-028',
  'Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí',
  'Trích yếu tư liệu lịch sử công cộng về quá trình khai phá, xác lập tổ chức hành chính năm 1698 và đời sống thương cảng Bến Nghé - Gia Định từ tác phẩm kinh điển "Gia Định thành thông chí" của Trịnh Hoài Đức kết hợp thông tin thư mục khoa học của Hội Khoa học Lịch sử TP.HCM.',
  'article',
  'hcmc-history',
  'Hiệp biện Đại học sĩ Trịnh Hoài Đức & Hội đồng biên soạn Hội KHLS TP.HCM',
  'Quốc sử quán triều Nguyễn / Viện Sử học Việt Nam & NXB Tổng hợp TP.HCM',
  'https://tulieuvankien.dangcongsan.vn',
  'doc-hcm-028-trich-yeu-lich-su-sai-gon-gia-dinh-thoi-nguyen.md',
  'text/markdown',
  '29061599DA7EF89859AF8554C501EB0A0C44BD459A30F59DBAF4601B4DCDAD5D',
  3507,
  'PENDING_REVIEW',
  FALSE,
  1,
  'OP-STAGING-INGEST-BATCH-B-SELECTIVE',
  'Cán bộ phụ trách Ingestion STAGING',
  '"Lịch sử Thành phố Hồ Chí Minh"'::text[],
  'Trích yếu tư liệu lịch sử công cộng về quá trình khai phá, xác lập tổ chức hành chính năm 1698 và đời sống thương cảng Bến Nghé - Gia Định từ tác phẩm kinh điển "Gia Định thành thông chí" của Trịnh Hoài Đức kết hợp thông tin thư mục khoa học của Hội Khoa học Lịch sử TP.HCM.',
  11,
  '{"candidateCode":"B-02","historicalPeriod":"Thế kỷ XVII - Giữa thế kỷ XIX (1698 - 1858)","geographicalScope":"Phủ Gia Định, Trấn Phiên An, Gia Định Thành, huyện Tân Bình, tổng Bình Thạnh","administrativeUnitAtPublication":"Gia Định Thành (Triều Nguyễn)","administrativeUnitCurrent":"Thành phố Hồ Chí Minh","copyrightStatus":"PUBLIC_DOMAIN_EXCERPT_ONLY","rightsEvidence":"Tác phẩm \"Gia Định thành thông chí\" của Trịnh Hoài Đức (hoàn thành khoảng năm 1820 thời triều Nguyễn) là thư tịch cổ thuộc sở hữu công cộng (Public Domain). Phần trích yếu chỉ sử dụng văn bản lịch sử công cộng và thông tin thư mục đối soát, tuyệt đối không sao chép trái phép các chương sách chuyên khảo, bản dịch và chú giải có bản quyền độc quyền của các ấn bản hiện đại.","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

-- 3. ĐỒNG BỘ 37 CHUNKS TRI THỨC VÀO BẢNG public.rag_document_chunks

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-026-C001',
  'DOC-HCM-026',
  'Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)',
  '## I. CĂN CỨ LỊCH SỬ THÀNH LẬP QUẬN 12 VÀ PHƯỜNG THỚI AN NĂM 1997
1. **Bối cảnh pháp lý:**
Ngày 06 tháng 01 năm 1997, Chính phủ ban hành Nghị định số 03-CP về việc thành lập Quận 12 trên cơ sở tách toàn bộ diện tích và dân số của một số xã thuộc huyện Hóc Môn.
Ngày 18 tháng 03 năm 1997, Ủy ban nhân dân Thành phố Hồ Chí Minh ban hành Quyết định số 1195/QĐ-UB-NC cụ thể hóa việc thành lập Quận 12 và xác định địa giới các phường trực thuộc.',
  'Mục 2',
  'Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-026/sec/1#p2',
  0,
  '{"documentId":"DOC-HCM-026","documentTitle":"Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)","sectionTitle":"Mục 2","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-026-C002',
  'DOC-HCM-026',
  'Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)',
  '2. **Địa giới phường Thới An thời kỳ 1997 – 30/06/2025:**
Theo Điều 1 Quyết định số 1195/QĐ-UB-NC:
- Phường Thới An được thành lập trên cơ sở **451 ha diện tích tự nhiên** và **4.883 nhân khẩu** của xã Tân Thới Hiệp cũ (thuộc huyện Hóc Môn).
- Trụ sở UBND Quận 12 thời kỳ này được đặt trên địa bàn phường Thới An.',
  '2.',
  'Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-026/sec/2#p3',
  0,
  '{"documentId":"DOC-HCM-026","documentTitle":"Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)","sectionTitle":"2.","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-026-C003',
  'DOC-HCM-026',
  'Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)',
  '3. **Địa giới phường Thạnh Xuân thời kỳ 1997 – 30/06/2025:**
Theo Điều 1 Quyết định số 1195/QĐ-UB-NC:
- Phường Thạnh Xuân được thành lập trên cơ sở **toàn bộ 968 ha diện tích tự nhiên** và **9.489 nhân khẩu** của xã Thạnh Xuân cũ (thuộc huyện Hóc Môn). - Bối cảnh lịch sử tiếp giáp trước sắp xếp (1997 – 30/06/2025): Phường Thạnh Xuân cũ có ranh giới sông Sài Gòn tiếp giáp với tỉnh Bình Dương (thị xã Thuận An, nay là thành phố Thuận An).',
  '3.',
  'Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-026/sec/3#p4',
  0,
  '{"documentId":"DOC-HCM-026","documentTitle":"Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)","sectionTitle":"3.","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-026-C004',
  'DOC-HCM-026',
  'Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)',
  'Đây là ghi nhận lịch sử về địa giới tự nhiên thời kỳ 1997–2025; số liệu 451 ha và 968 ha là số liệu diện tích lịch sử xác định tại thời điểm ban hành Quyết định 1195 năm 1997.',
  '3.',
  'Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-026/sec/4#p4',
  0,
  '{"documentId":"DOC-HCM-026","documentTitle":"Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)","sectionTitle":"3.","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-026-C005',
  'DOC-HCM-026',
  'Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)',
  '---',
  '---',
  'Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-026/sec/5#p5',
  0,
  '{"documentId":"DOC-HCM-026","documentTitle":"Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)","sectionTitle":"---","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-026-C006',
  'DOC-HCM-026',
  'Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)',
  '## II. NỘI DUNG SẮP XẾP ĐƠN VỊ HÀNH CHÍNH NĂM 2025 THEO NGHỊ QUYẾT 1685/NQ-UBTVQH15
1. **Căn cứ pháp lý cao nhất hiện hành:**
Ngày 16 tháng 06 năm 2025, Ủy ban Thường vụ Quốc hội ban hành Nghị quyết số 1685/NQ-UBTVQH15 về việc sắp xếp các đơn vị hành chính cấp xã của Thành phố Hồ Chí Minh năm 2025.',
  'Mục 6',
  'Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-026/sec/6#p6',
  0,
  '{"documentId":"DOC-HCM-026","documentTitle":"Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)","sectionTitle":"Mục 6","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-026-C007',
  'DOC-HCM-026',
  'Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)',
  '2. **Nội dung quy định sáp nhập (Khoản 35 Điều 1):**
"Sắp xếp các đơn vị hành chính cấp xã thuộc Quận 12 như sau:
Nhập toàn bộ diện tích tự nhiên và quy mô dân số của phường Thạnh Xuân và phường Thới An để thành lập **phường Thới An**."',
  '2.',
  'Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-026/sec/7#p7',
  0,
  '{"documentId":"DOC-HCM-026","documentTitle":"Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)","sectionTitle":"2.","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-026-C008',
  'DOC-HCM-026',
  'Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)',
  '3. **Hiệu lực thi hành:**
Nghị quyết có hiệu lực thi hành từ ngày **01 tháng 07 năm 2025**.',
  '3.',
  'Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-026/sec/8#p8',
  0,
  '{"documentId":"DOC-HCM-026","documentTitle":"Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)","sectionTitle":"3.","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-026-C009',
  'DOC-HCM-026',
  'Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)',
  'Kể từ ngày 01/07/2025, đơn vị hành chính mới chính thức đi vào hoạt động với danh xưng:
👉 **Phường Thới An, Thành phố Hồ Chí Minh.**
- Về ranh giới tiếp giáp hiện hành: Hệ thống bảo lưu nguyên tắc chỉ trích dẫn văn bản pháp lý chính thức, không tự xác định hay suy diễn các phường hoặc đơn vị hành chính tiếp giáp hiện nay khi chưa có hồ sơ địa giới và bản đồ quy chuẩn do cơ quan nhà nước có thẩm quyền công bố.',
  '3.',
  'Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-026/sec/9#p8',
  0,
  '{"documentId":"DOC-HCM-026","documentTitle":"Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)","sectionTitle":"3.","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-026-C010',
  'DOC-HCM-026',
  'Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)',
  '---',
  '---',
  'Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-026/sec/10#p9',
  0,
  '{"documentId":"DOC-HCM-026","documentTitle":"Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)","sectionTitle":"---","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-026-C011',
  'DOC-HCM-026',
  'Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)',
  '## III. NGUYÊN TẮC ĐỊA DANH VÀ ĐỊA GIỚI BẮT BUỘC
1. **Địa danh hiện hành chuẩn:**
- Chỉ sử dụng tên gọi: **Phường Thới An, Thành phố Hồ Chí Minh** (mô hình chính quyền đô thị 2 cấp).
- Tuyệt đối không dùng cụm từ *"Phường Thới An, Quận 12"* như một đơn vị hành chính đương thời sau ngày 01/07/2025.',
  'Mục 10',
  'Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-026/sec/11#p10',
  0,
  '{"documentId":"DOC-HCM-026","documentTitle":"Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)","sectionTitle":"Mục 10","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-026-C012',
  'DOC-HCM-026',
  'Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)',
  '2. **Bảo tồn địa danh lịch sử trong văn bản ban hành trước 01/07/2025:**
Khi trích dẫn, tra cứu các văn bản hành chính, quyết định thành lập trước ngày 01/07/2025, phải giữ đúng tên gọi gốc lịch sử:
- *Phường Thới An, Quận 12, Thành phố Hồ Chí Minh* (Giai đoạn 01/04/1997 – 30/06/2025). - *Phường Thạnh Xuân, Quận 12, Thành phố Hồ Chí Minh* (Giai đoạn 01/04/1997 – 30/06/2025). - *Xã Tân Thới Hiệp, Huyện Hóc Môn* (Giai đoạn trước 01/04/1997).',
  '2.',
  'Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-026/sec/12#p11',
  0,
  '{"documentId":"DOC-HCM-026","documentTitle":"Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)","sectionTitle":"2.","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-026-C013',
  'DOC-HCM-026',
  'Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)',
  'Không tự động thay thế hồi tố các tên gọi lịch sử này trong văn bản cũ.',
  '2.',
  'Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-026/sec/13#p11',
  0,
  '{"documentId":"DOC-HCM-026","documentTitle":"Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)","sectionTitle":"2.","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-026-C014',
  'DOC-HCM-026',
  'Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)',
  '3. **Phạm vi kế thừa không gian địa giới:**
- Phường Thới An mới chỉ kế thừa trọn vẹn diện tích tự nhiên và dân số từ **hai phường cũ: Thới An và Thạnh Xuân** (tổng diện tích tự nhiên hợp nhất khoảng 14,19 km² = 1.419 ha).',
  '3.',
  'Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-026/sec/14#p12',
  0,
  '{"documentId":"DOC-HCM-026","documentTitle":"Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)","sectionTitle":"3.","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-026-C015',
  'DOC-HCM-026',
  'Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)',
  '- **Tuyệt đối không được diễn giải rằng toàn bộ địa bàn Quận 12 cũ nay thuộc về phường Thới An.** Các phường khác thuộc Quận 12 cũ (như An Phú Đông, Thạnh Lộc, Hiệp Thành, Tân Thới Hiệp...) có lộ trình sắp xếp riêng, độc lập với Phường Thới An.',
  '3.',
  'Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-026/sec/15#p12',
  0,
  '{"documentId":"DOC-HCM-026","documentTitle":"Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)","sectionTitle":"3.","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-027-C001',
  'DOC-HCM-027',
  'Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)',
  '## I. MỐC THÀNH LẬP VÀ CĂN CỨ PHÁP LÝ KHỞI ĐẦU (NĂM 2014)
1. **Quyết định thành lập ban đầu:**
Trường Trung học cơ sở Nguyễn Trung Trực được chính thức thành lập theo **Quyết định số 155/QĐ-UBND ngày 31 tháng 07 năm 2014** của Ủy ban nhân dân Quận 12, Thành phố Hồ Chí Minh.
Nhà trường chính thức khai giảng và đi vào hoạt động giảng dạy từ **năm học 2014 – 2015**.',
  'Mục 2',
  'Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-027/sec/1#p2',
  0,
  '{"documentId":"DOC-HCM-027","documentTitle":"Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)","sectionTitle":"Mục 2","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-027-C002',
  'DOC-HCM-027',
  'Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)',
  '2. **Ý nghĩa tên trường:**
Ngôi trường vinh dự và tự hào mang tên người anh hùng nghĩa quân Nam Bộ kiên trung bất khuất trong cuộc kháng chiến chống thực dân Pháp thế kỷ XIX: **Anh hùng Dân tộc Nguyễn Trung Trực (1838 – 1868)**, người gắn liền với câu nói bất hủ rạng danh non sông:
*"Bao giờ người Tây nhổ hết cỏ nước Nam thì mới hết người Nam đánh Tây"*.',
  '2.',
  'Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-027/sec/2#p3',
  0,
  '{"documentId":"DOC-HCM-027","documentTitle":"Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)","sectionTitle":"2.","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-027-C003',
  'DOC-HCM-027',
  'Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)',
  'Việc đặt tên trường là biểu tượng thiêng liêng nhắc nhở thầy và trò về tinh thần yêu nước, dũng cảm, kiên trì vượt khó và tận tụy phụng sự quê hương đất nước.',
  '2.',
  'Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-027/sec/3#p3',
  0,
  '{"documentId":"DOC-HCM-027","documentTitle":"Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)","sectionTitle":"2.","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-027-C004',
  'DOC-HCM-027',
  'Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)',
  '---',
  '---',
  'Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-027/sec/4#p4',
  0,
  '{"documentId":"DOC-HCM-027","documentTitle":"Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)","sectionTitle":"---","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-027-C005',
  'DOC-HCM-027',
  'Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)',
  '## II. QUÁ TRÌNH PHÁT TRIỂN VÀ SỰ KIỆN KIỆN TOÀN TỔ CHỨC NĂM 2025
1. **Mười năm nỗ lực xây dựng (2014 – 2024):**
Trải qua chặng đường phát triển, tập thể cán bộ quản lý, giáo viên, nhân viên và các thế hệ học sinh Trường THCS Nguyễn Trung Trực không ngừng thi đua *"Dạy tốt – Học tốt"*, xây dựng cơ sở vật chất khang trang, phòng học bộ môn chuẩn hóa, thư viện tiên tiến và môi trường sư phạm thân thiện, kỷ cương, tình thương, trách nhiệm.',
  'Mục 5',
  'Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-027/sec/5#p5',
  0,
  '{"documentId":"DOC-HCM-027","documentTitle":"Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)","sectionTitle":"Mục 5","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-027-C006',
  'DOC-HCM-027',
  'Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)',
  '2. **Kiện toàn quản lý hành chính năm 2025 theo Nghị quyết số 1685/NQ-UBTVQH15:**
Ngày 01 tháng 07 năm 2025, thực hiện Nghị quyết của Quốc hội về việc sắp xếp đơn vị hành chính cấp xã của TP.HCM, Ủy ban nhân dân Phường Thới An ban hành **Quyết định số 76/QĐ-UBND ngày 01/07/2025** về việc thành lập và quản lý Trường THCS Nguyễn Trung Trực trực thuộc chính quyền địa phương cấp phường.',
  '2.',
  'Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-027/sec/6#p6',
  0,
  '{"documentId":"DOC-HCM-027","documentTitle":"Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)","sectionTitle":"2.","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-027-C007',
  'DOC-HCM-027',
  'Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)',
  'Căn cứ này được ghi nhận chính thức trong *Kế hoạch giáo dục nhà trường năm học 2025 – 2026 (Số 01/KH-NTT ngày 29/08/2025)*.',
  '2.',
  'Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-027/sec/7#p6',
  0,
  '{"documentId":"DOC-HCM-027","documentTitle":"Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)","sectionTitle":"2.","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-027-C008',
  'DOC-HCM-027',
  'Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)',
  '3. **Nguyên tắc phân biệt hai mốc pháp lý:**
- Quyết định năm 2014 là mốc khai sinh thành lập ngôi trường và bắt đầu hoạt động giáo dục.
- Quyết định năm 2025 là bước kiện toàn tổ chức, điều chỉnh thẩm quyền quản lý nhà nước theo mô hình chính quyền đô thị mới.
- **Đây là sự kế thừa liên tục về lịch sử, đội ngũ và cơ sở vật chất; không phải giải thể trường cũ để thành lập một trường hoàn toàn mới.**',
  '3.',
  'Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-027/sec/8#p7',
  0,
  '{"documentId":"DOC-HCM-027","documentTitle":"Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)","sectionTitle":"3.","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-027-C009',
  'DOC-HCM-027',
  'Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)',
  '---',
  '---',
  'Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-027/sec/9#p8',
  0,
  '{"documentId":"DOC-HCM-027","documentTitle":"Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)","sectionTitle":"---","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-027-C010',
  'DOC-HCM-027',
  'Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)',
  '## III. CÔNG TÁC GIÁO DỤC TRUYỀN THỐNG VÀ KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH
1. **Mô hình Trường học Hạnh phúc:**
Nhà trường lấy học sinh làm trung tâm, chú trọng giáo dục toàn diện cả tri thức lẫn nhân cách, bồi đắp kỹ năng sống, lòng nhân ái và tinh thần trách nhiệm với gia đình và xã hội.',
  'Mục 9',
  'Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-027/sec/10#p9',
  0,
  '{"documentId":"DOC-HCM-027","documentTitle":"Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)","sectionTitle":"Mục 9","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-027-C011',
  'DOC-HCM-027',
  'Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)',
  '2. **Không gian Văn hóa Hồ Chí Minh học đường:**
Nhà trường triển khai hài hòa giữa hai trụ cột:
- **Không gian vật lý:** Tủ sách Bác Hồ, khu triển lãm ảnh tư liệu, góc rèn luyện *"5 Điều Bác Hồ dạy"* trong từng lớp học.
- **Không gian số (RAG Knowledge Assistant):** Nền tảng số hóa tư liệu lịch sử có trích dẫn nguồn gốc chuẩn xác, phục vụ công tác giảng dạy của thầy cô và việc học tập, nghiên cứu truyền thống của học sinh THCS.',
  '2.',
  'Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-027/sec/11#p10',
  0,
  '{"documentId":"DOC-HCM-027","documentTitle":"Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)","sectionTitle":"2.","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-028-C001',
  'DOC-HCM-028',
  'Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí',
  '[GHI CHÚ BẢN QUYỀN VÀ RANH GIỚI VĂN BẢN]
- Nguyên tác: Bộ sử địa chí chữ Hán "Gia Định thành thông chí" của Hiệp biện Đại học sĩ Trịnh Hoài Đức hoàn thành khoảng năm 1820 thời triều Nguyễn thuộc di sản văn hóa công cộng (Public Domain). - Bản dịch và chú giải hiện đại: Các ấn bản sách in hiện đại có bản quyền dịch thuật và chú thích độc quyền của các dịch giả/nhà xuất bản hiện đại; hệ thống RAG nhà trường tuyệt đối không sao chép trái phép.',
  'Mục 2',
  'Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-028/sec/1#p2',
  0,
  '{"documentId":"DOC-HCM-028","documentTitle":"Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí","sectionTitle":"Mục 2","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-028-C002',
  'DOC-HCM-028',
  'Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí',
  '- Nội dung trích yếu của dự án: Dưới đây là phần trích lược các sự kiện cương vực lịch sử khách quan đã trở thành tri thức công cộng, bảo toàn xuất xứ của 9 chunks phục vụ giáo dục truyền thống học đường.',
  'Mục 2',
  'Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-028/sec/2#p2',
  0,
  '{"documentId":"DOC-HCM-028","documentTitle":"Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí","sectionTitle":"Mục 2","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-028-C003',
  'DOC-HCM-028',
  'Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí',
  '## I. MỐC THIẾT LẬP TỔ CHỨC HÀNH CHÍNH NĂM 1698 CỦA NGUYỄN HỮU CẢNH
Theo ghi chép của Trịnh Hoài Đức trong *Gia Định thành thông chí (Quyển III: Cương vực chí)*:
- Mùa xuân năm Mậu Dần (1698), chúa Nguyễn Phúc Chu sai Thống suất Chưởng cơ Lễ Thành hầu Nguyễn Hữu Cảnh vào kinh lược đất phương Nam.',
  'Mục 3',
  'Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-028/sec/3#p3',
  0,
  '{"documentId":"DOC-HCM-028","documentTitle":"Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí","sectionTitle":"Mục 3","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-028-C004',
  'DOC-HCM-028',
  'Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí',
  '- Nguyễn Hữu Cảnh lấy đất Nông Nại đặt làm **Phủ Gia Định**, lập xứ Đồng Nai làm huyện Phước Long (dựng dinh Trấn Biên), lập xứ Sài Gòn làm **huyện Tân Bình** (dựng dinh Phiên Trấn). - Đặt quan chức cai trị: Lưu thủ, Cai bạ, Ký lục để coi sóc hình án, thuế khóa; chia cắt ranh giới bờ cõi, lập sổ đinh điền; chiêu mộ lưu dân miền Trung vào khai khẩn ruộng đất, lập thôn xóm, định quy chế thuế má.',
  'Mục 3',
  'Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-028/sec/4#p3',
  0,
  '{"documentId":"DOC-HCM-028","documentTitle":"Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí","sectionTitle":"Mục 3","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-028-C005',
  'DOC-HCM-028',
  'Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí',
  '- Mốc năm 1698 chính thức đánh dấu việc vùng đất Sài Gòn – Nam Bộ được đưa vào bản đồ cương vực hành chính Đại Việt.',
  'Mục 3',
  'Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-028/sec/5#p3',
  0,
  '{"documentId":"DOC-HCM-028","documentTitle":"Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí","sectionTitle":"Mục 3","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-028-C006',
  'DOC-HCM-028',
  'Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí',
  '---',
  '---',
  'Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-028/sec/6#p4',
  0,
  '{"documentId":"DOC-HCM-028","documentTitle":"Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí","sectionTitle":"---","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-028-C007',
  'DOC-HCM-028',
  'Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí',
  '## II. SỰ HÌNH THÀNH THƯƠNG CẢNG BẾN NGHÉ VÀ NỀN KINH TẾ TRÙ PHÚ
Theo *Sơn xuyên chí* của Trịnh Hoài Đức:
- Vùng sông Bến Nghé (sông Sài Gòn) được mô tả: *"Sông lớn nước ngọt quanh co chở phù sa, lòng sông sâu rộng, ghe buôn qua lại như thoi, tàu biển ngoại quốc ra vào thuận tiện"*. - Cảnh tượng buôn bán tấp nập *"Trên bến dưới thuyền"*, lúa gạo, tơ lụa, cá muối từ khắp các tỉnh Nam Bộ tụ hội về Bến Nghé để phân phối đi khắp trong và ngoài nước.',
  'Mục 5',
  'Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-028/sec/7#p5',
  0,
  '{"documentId":"DOC-HCM-028","documentTitle":"Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí","sectionTitle":"Mục 5","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-028-C008',
  'DOC-HCM-028',
  'Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí',
  '- Chợ Sài Gòn (vùng Chợ Cũ và Chợ Lớn) trở thành trung tâm thương mại sầm uất bậc nhất xứ Đàng Trong, là nơi giao thương văn hóa hòa hợp giữa người Việt, người Hoa, người Khmer và người Chăm.',
  'Mục 5',
  'Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-028/sec/8#p5',
  0,
  '{"documentId":"DOC-HCM-028","documentTitle":"Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí","sectionTitle":"Mục 5","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-028-C009',
  'DOC-HCM-028',
  'Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí',
  '---',
  '---',
  'Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-028/sec/9#p6',
  0,
  '{"documentId":"DOC-HCM-028","documentTitle":"Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí","sectionTitle":"---","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-028-C010',
  'DOC-HCM-028',
  'Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí',
  '## III. Ý NGHĨA KHOA HỌC VÀ BÀI HỌC GIÁO DỤC
1. Tác phẩm *Gia Định thành thông chí* của Trịnh Hoài Đức là bộ bách khoa toàn thư cổ đồ sộ, chân thực và có giá trị pháp lý, lịch sử cao nhất về cương vực, tự nhiên và con người Nam Bộ đầu thế kỷ XIX. 2.',
  'Mục 7',
  'Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-028/sec/10#p7',
  0,
  '{"documentId":"DOC-HCM-028","documentTitle":"Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí","sectionTitle":"Mục 7","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

INSERT INTO public.rag_document_chunks (
  chunk_id, document_id, document_title, content, section_or_page,
  topic, source_status, provenance_locator, token_estimate, metadata, processed_at
) VALUES (
  'DOC-HCM-028-C011',
  'DOC-HCM-028',
  'Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí',
  'Giúp thế hệ học sinh THCS Nguyễn Trung Trực hiểu rõ công lao khai hoang mở cõi kiên cường, bền bỉ của tiền nhân, hun đúc lòng biết ơn cha ông và niềm tự hào sâu sắc về truyền thống lịch sử hơn 300 năm của Thành phố mang tên Bác.',
  'Mục 7',
  'Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí',
  'PENDING_REVIEW',
  'corpus://DOC-HCM-028/sec/11#p7',
  0,
  '{"documentId":"DOC-HCM-028","documentTitle":"Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí","sectionTitle":"Mục 7","batch":"BATCH_B_SELECTIVE_01"}'::jsonb,
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

COMMIT;

-- KIỂM THỬ XÁC NHẬN SAU KHI THỰC THI:
SELECT document_id, title, approval_status, is_allowed_for_rag, chunks_count, checksum
FROM public.rag_documents
WHERE document_id IN ('DOC-HCM-026', 'DOC-HCM-027', 'DOC-HCM-028');

SELECT document_id, COUNT(*) AS actual_chunks_count
FROM public.rag_document_chunks
WHERE document_id IN ('DOC-HCM-026', 'DOC-HCM-027', 'DOC-HCM-028')
GROUP BY document_id;
