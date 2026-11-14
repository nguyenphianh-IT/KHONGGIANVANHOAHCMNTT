-- ==============================================================================
-- DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
-- MIGRATION: 014_rag_standard_categories_seed.sql
-- KNOWLEDGE EXPANSION 01 - BATCH B - SEED 8 STANDARD RAG CATEGORIES
-- ==============================================================================

-- Bổ sung 8 danh mục tri thức chuẩn mực vào rag_categories để phục vụ khóa ngoại (Foreign Key)
INSERT INTO public.rag_categories (id, name, description, icon, badge_class)
VALUES 
  ('bio-career', 'Tiểu sử và sự nghiệp Bác Hồ', 'Các mốc thời gian, sự kiện trọng đại trong cuộc đời Chủ tịch Hồ Chí Minh', 'Calendar', 'bg-blue-100 text-blue-800'),
  ('ideology-ethics', 'Tư tưởng, đạo đức, phong cách Hồ Chí Minh', 'Các tác phẩm kinh điển, lời dạy về đạo đức cách mạng và phong cách làm việc', 'Award', 'bg-amber-100 text-amber-800'),
  ('teachings-children', 'Lời dạy đối với thiếu nhi', 'Thư gửi học sinh, 5 điều Bác Hồ dạy và tình cảm thiêng liêng với thế hệ măng non', 'Heart', 'bg-rose-100 text-rose-800'),
  ('cultural-heritage', 'Di sản văn hóa Hồ Chí Minh', 'Giá trị văn hóa, tư tưởng và nhân văn tỏa sáng trong các trước tác của Người', 'Sparkles', 'bg-purple-100 text-purple-800'),
  ('hcm-cultural-space', 'Không gian văn hóa Hồ Chí Minh', 'Đề án và mô hình không gian văn hóa học đường tại TP.HCM và trường THCS', 'BookOpen', 'bg-red-100 text-red-800'),
  ('hcmc-history', 'Lịch sử Thành phố Hồ Chí Minh & Thới An', 'Địa giới hành chính, truyền thống lịch sử Sài Gòn - Gia Định và vùng đất Thới An', 'MapPin', 'bg-emerald-100 text-emerald-800'),
  ('school-education', 'Hoạt động giáo dục và học tập tại nhà trường', 'Lịch sử, truyền thống và kế hoạch giáo dục của Trường THCS Nguyễn Trung Trực', 'GraduationCap', 'bg-indigo-100 text-indigo-800'),
  ('official-dispatches', 'Văn bản và tư liệu quản lý học đường', 'Quyết định, công văn chỉ đạo và văn bản pháp lý về không gian văn hóa', 'FileText', 'bg-slate-100 text-slate-800')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  badge_class = EXCLUDED.badge_class,
  updated_at = NOW();
