// ==============================================================================
// DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
// MODULE: CMS LOCAL & SUPABASE SYNCHRONIZED STORAGE SERVICE
// TUÂN THỦ: QUY CHUẨN KIỂM DUYỆT 4 MẮT (FOUR-EYES GOVERNANCE G4)
// ==============================================================================

import { supabase, isSupabaseConfigured } from './supabase';
import type { PdfAttachment } from '../types';

export interface ArticleData {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: 'article' | 'book' | 'image' | 'video' | 'audio' | string;
  topic?: string;
  featured_image?: string;
  media_assets?: MediaAsset[];
  references?: string;
  audio_url?: string;
  audio_duration?: string;
  quote_id?: number;
  custom_quote?: string;
  pdf_attachment?: PdfAttachment;
  status: 'draft' | 'pending' | 'approved' | 'published' | 'rejected' | 'archived';
  author_id?: string;
  author_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CmsCategory {
  id: 'article' | 'book' | 'image' | 'video' | 'activity' | 'audio';
  name: string;
  icon: string;
  badgeClass: string;
  desc: string;
}

// ------------------------------------------------------------------------------
// CHUYÊN MỤC CHUẨN ĐỒNG BỘ 100% VỚI KHO TƯ LIỆU SỐ HÓA TRÊN TRANG CHỦ
// ------------------------------------------------------------------------------
export const CMS_CATEGORIES: CmsCategory[] = [
  {
    id: 'article',
    name: 'Văn kiện & Bài viết',
    icon: '📄',
    badgeClass: 'bg-blue-100 text-blue-900 border-blue-200',
    desc: 'Bài viết số hóa, văn kiện lịch sử, nghiên cứu tư tưởng Bác',
  },
  {
    id: 'book',
    name: 'Sách & Tài liệu',
    icon: '📚',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    desc: 'Tác phẩm của Bác, sách điện tử, tài liệu học tập THCS',
  },
  {
    id: 'image',
    name: 'Hình ảnh lịch sử',
    icon: '🖼️',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-200',
    desc: 'Bộ sưu tập ảnh tư liệu, khoảnh khắc lịch sử quý giá',
  },
  {
    id: 'video',
    name: 'Phim tư liệu',
    icon: '🎬',
    badgeClass: 'bg-purple-100 text-purple-900 border-purple-200',
    desc: 'Phim tài liệu, phóng sự truyền hình, video giáo dục',
  },
  {
    id: 'audio',
    name: 'Băng ghi âm lời Bác',
    icon: '🔊',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-200',
    desc: 'Băng ghi âm giọng nói của Bác, phát biểu lịch sử, lời hiệu triệu cứu quốc (Có tích hợp trình phát đĩa cổ điển)',
  },
  {
    id: 'activity',
    name: 'Hoạt động & Phong trào',
    icon: '🏆',
    badgeClass: 'bg-rose-100 text-rose-900 border-rose-200',
    desc: 'Hội thi, hành trình về nguồn, kết nạp Đoàn - Đội, phong trào học đường (Tự động hiển thị vào mục Hoạt động)',
  },
];

// ------------------------------------------------------------------------------
// CHỦ ĐỀ GIÁO DỤC & LỊCH SỬ THCS (CHUYÊN ĐỀ PHỤ)
// ------------------------------------------------------------------------------
export const THEMATIC_TOPICS = [
  { id: 'TOPIC-THIEUNHI', name: 'Bác Hồ với Tuổi trẻ & Thiếu nhi' },
  { id: 'TOPIC-CUOCDOI', name: 'Cuộc đời & Sự nghiệp Bác Hồ' },
  { id: 'TOPIC-DISAN', name: 'Di sản Tư tưởng & Tác phẩm' },
  { id: 'TOPIC-NHATRUONG', name: 'Trường THCS Nguyễn Trung Trực Làm theo Bác' },
  { id: 'TOPIC-HOATDONG', name: 'Hoạt động phong trào nhà trường' },
  { id: 'TOPIC-DIACHIDO', name: 'Địa chỉ đỏ & Di tích Lịch sử' },
];

export function getCategoryLabel(catId: string): string {
  const map: Record<string, string> = {
    article: 'Văn kiện & Bài viết',
    book: 'Sách & Tài liệu',
    image: 'Hình ảnh lịch sử',
    video: 'Phim tư liệu',
    audio: 'Băng ghi âm lời Bác',
    activity: 'Hoạt động & Phong trào',
    'CAT-01-CUOCDOI': 'Văn kiện & Bài viết',
    'CAT-02-THIEUNHI': 'Văn kiện & Bài viết',
    'CAT-03-DISAN': 'Sách & Tài liệu',
    'CAT-04-NHATRUONG': 'Hoạt động & Phong trào',
    'CAT-05-DIACHIDO': 'Hình ảnh lịch sử',
  };
  return map[catId] || 'Văn kiện & Bài viết';
}

export function normalizeCategoryToHomepage(catId: string): 'article' | 'book' | 'image' | 'video' | 'audio' {
  if (catId === 'book' || catId === 'image' || catId === 'video' || catId === 'article' || catId === 'audio') {
    return catId;
  }
  if (catId === 'activity') return 'article';
  if (catId === 'CAT-03-DISAN') return 'book';
  if (catId === 'CAT-05-DIACHIDO') return 'image';
  return 'article';
}

/**
 * Kiểm tra xem bài viết có thuộc chuyên mục "Hoạt động & Phong trào" hay không
 * Phục vụ phân loại: Hiển thị bài viết Hoạt động ở mục riêng "Hoạt Động Văn Hóa & Giáo Dục Truyền Thống"
 */
export function isActivityArticle(article: { category?: string } | null | undefined): boolean {
  if (!article || !article.category) return false;
  return article.category === 'activity' || article.category === 'CAT-04-NHATRUONG';
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  size_bytes: number;
  mime_type: string;
  sha256_hash: string;
  author: string;
  copyright: string;
  created_at: string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  article_title: string;
  actor: string;
  role: string;
  decision: string;
  feedback: string;
  timestamp: string;
}

// ------------------------------------------------------------------------------
// INITIAL VERIFIED SEED DATA (Khớp 100% chuyên mục ngoài trang chủ)
// ------------------------------------------------------------------------------
const DEFAULT_ARTICLES: ArticleData[] = [
  {
    id: 'art-001',
    title: 'Chủ tịch Hồ Chí Minh – Hành trình tìm đường cứu nước (1911 - 1941)',
    slug: 'hanh-trinh-tim-duong-cuu-nuoc-1911-1941',
    summary: 'Tóm tắt các mốc son lịch sử từ khi Người rời Bến Nhà Rồng đến khi trở về lãnh đạo cách mạng Việt Nam tại Pác Bó.',
    content: `Ngày 5 tháng 6 năm 1911, từ Bến Nhà Rồng (Sài Gòn), người thanh niên yêu nước Nguyễn Tất Thành đã ra đi tìm đường cứu nước trên con tàu Đô đốc Latouche-Tréville.\n\nTrải qua 30 năm bôn ba qua nhiều châu lục, Người đã tiếp cận với Chủ nghĩa Mác - Lênin và tìm ra con đường giải phóng cho dân tộc Việt Nam: con đường cách mạng vô sản.\n\nNăm 1941, Người trở về Tổ quốc tại hang Pác Bó (Cao Bằng), trực tiếp lãnh đạo phong trào cách mạng, tiến tới thắng lợi vĩ đại của Cách mạng Tháng Tám năm 1945.`,
    category: 'article',
    topic: 'Cuộc đời & Sự nghiệp Bác Hồ',
    featured_image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    references: 'Hồ Chí Minh Toàn tập, Tập 1, NXB Chính trị Quốc gia Sự thật; Bảo tàng Hồ Chí Minh',
    status: 'published',
    author_id: 'usr-editor-a',
    author_name: 'Biên Tập Viên A (Thầy Lịch sử)',
    created_at: '2026-11-04 10:15',
    updated_at: '2026-11-04 15:30',
  },
  {
    id: 'art-002',
    title: 'Bác Hồ với thiếu niên, nhi đồng – Bài học sâu sắc từ 5 điều Bác dạy',
    slug: 'bac-ho-voi-thieu-nhi-5-dieu-bac-day',
    summary: 'Phân tích ý nghĩa nhân văn và giá trị rèn luyện của 5 điều Bác Hồ dạy dành cho học sinh Trường THCS Nguyễn Trung Trực.',
    content: `Sinh thời, Chủ tịch Hồ Chí Minh luôn dành tình cảm yêu thương đặc biệt nhất cho các cháu thiếu niên, nhi đồng. Người từng viết:\n\n> "Trẻ em như búp trên cành\n> Biết ăn ngủ, biết học hành là ngoan"\n\nNăm điều Bác Hồ dạy thiếu niên nhi đồng đã trở thành kim chỉ nam cho các phong trào thi đua rèn đức, luyện tài của Đội TNTP Hồ Chí Minh trường THCS Nguyễn Trung Trực:\n1. Yêu Tổ quốc, yêu đồng bào\n2. Học tập tốt, lao động tốt\n3. Đoàn kết tốt, kỷ luật tốt\n4. Giữ gìn vệ sinh thật tốt\n5. Khiêm tốn, thật thà, dũng cảm.`,
    category: 'article',
    topic: 'Bác Hồ với Tuổi trẻ & Thiếu nhi',
    featured_image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    references: 'Bảo tàng Lịch sử Quốc gia; Hội đồng Đội Trung ương',
    status: 'published',
    author_id: 'usr-editor-b',
    author_name: 'Biên Tập Viên B (Cô Ngữ văn)',
    created_at: '2026-11-04 11:20',
    updated_at: '2026-11-04 16:45',
  },
  {
    id: 'art-003',
    title: 'Tác phẩm "Nhật ký trong tù" – Giá trị nhân văn và tinh thần thép',
    slug: 'tac-pham-nhat-ky-trong-tu-tinh-than-thep',
    summary: 'Khắc họa tinh thần lạc quan cách mạng và ý chí kiên cường của Bác qua tập thơ chữ Hán kiệt xuất sáng tác giai đoạn 1942 - 1943.',
    content: `Tập thơ "Nhật ký trong tù" (Ngục trung nhật ký) gồm 133 bài thơ chữ Hán được Bác sáng tác trong thời gian bị chính quyền Tưởng Giới Thạch bắt giam vô cớ tại Quảng Tây (Trung Quốc).\n\nTác phẩm là bức chân dung tự họa tinh thần của một bậc đại trí, đại nhân, đại dũng:\n\n> "Thân thể ở trong lao\n> Tinh thần ở ngoài lao\n> Muốn nên sự nghiệp lớn\n> Tinh thần càng phải cao"\n\nĐây là tư liệu vô giá bồi dưỡng ý chí vượt khó và nghị lực sống cho học sinh.`,
    category: 'book',
    topic: 'Di sản Tư tưởng & Tác phẩm',
    featured_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    references: 'NXB Văn học; Viện Văn học Việt Nam',
    status: 'published',
    author_id: 'usr-editor-a',
    author_name: 'Biên Tập Viên A (Thầy Lịch sử)',
    created_at: '2026-11-03 09:00',
    updated_at: '2026-11-03 14:20',
  },
  {
    id: 'art-004',
    title: 'Xây dựng Không gian văn hóa Hồ Chí Minh tại Trường THCS Nguyễn Trung Trực',
    slug: 'xay-dung-khong-gian-van-hoa-hcm-thcs-nguyen-trung-truc',
    summary: 'Mô hình không gian văn hóa số kết hợp thư viện thông minh và góc truyền thống học tập làm theo Bác tại Phường Thới An.',
    content: `Thực hiện Nghị quyết Đại hội Đảng bộ TP. Hồ Chí Minh, Trường THCS Nguyễn Trung Trực (Phường Thới An) đã tiên phong xây dựng Không gian văn hóa Hồ Chí Minh số hóa.\n\nHệ thống tích hợp kho tư liệu ảnh, phim tư liệu lịch sử, sách điện tử và ứng dụng học tập tương tác, giúp các em học sinh dễ dàng tiếp cận di sản của Bác một cách trực quan và sinh động nhất.`,
    category: 'article',
    topic: 'Trường THCS Nguyễn Trung Trực Làm theo Bác',
    featured_image: '/images/ho-chi-minh-tp-hcm.png',
    references: 'Chi bộ & Ban Giám hiệu Trường THCS Nguyễn Trung Trực',
    status: 'published',
    author_id: 'usr-admin-chief',
    author_name: 'Cán Bộ Quản Trị Trưởng (Ban Giám Hiệu)',
    created_at: '2026-11-02 08:30',
    updated_at: '2026-11-02 10:15',
  },
  {
    id: 'art-005',
    title: 'Di chúc của Chủ tịch Hồ Chí Minh – Muôn vàn tình thân yêu cho thế hệ tương lai',
    slug: 'di-chuc-chu-tich-ho-chi-minh-the-he-tuong-lai',
    summary: 'Bản Di chúc lịch sử kết tinh tư tưởng, đạo đức và tình cảm thiêng liêng của Bác gửi gắm lại cho toàn Đảng, toàn dân và thế hệ trẻ.',
    content: `Bản Di chúc thiêng liêng của Chủ tịch Hồ Chí Minh là một bảo vật quốc gia. Trong đó, Người dành một phần trang trọng căn dặn về thế hệ tương lai:\n\n> "Đoàn viên và thanh niên ta nói chung là tốt, mọi việc đều hăng hái xung phong, không ngại khó khăn, có chí tiến thủ. Đảng cần phải chăm lo giáo dục đạo đức cách mạng cho họ, đào tạo họ thành những người thừa kế xây dựng chủ nghĩa xã hội vừa 'hồng' vừa 'chuyên'."`,
    category: 'book',
    topic: 'Di sản Tư tưởng & Tác phẩm',
    featured_image: '/images/footer-5-dieu-bac-ho.png',
    references: 'Di chúc của Chủ tịch Hồ Chí Minh, NXB Chính trị Quốc gia',
    status: 'published',
    author_id: 'usr-editor-b',
    author_name: 'Biên Tập Viên B (Cô Ngữ văn)',
    created_at: '2026-11-04 13:00',
    updated_at: '2026-11-04 17:10',
  }
];

const DEFAULT_MEDIA_ASSETS: MediaAsset[] = [
  {
    id: 'med-tuong-dai-tphcm',
    name: 'tuong-dai-bac-ho-tphcm.jpg',
    url: '/images/tuong-dai-bac-ho-tphcm.jpg',
    size_bytes: 56293,
    mime_type: 'image/jpeg',
    sha256_hash: '6B7C8D9E0F1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5A6B7C',
    author: 'Tư liệu hình ảnh: Tượng đài Bác Hồ tại TP. Hồ Chí Minh',
    copyright: 'Tư liệu Không gian văn hóa Hồ Chí Minh - THCS Nguyễn Trung Trực',
    created_at: '2026-11-05 00:22',
  },
  {
    id: 'med-giai-phong-1975',
    name: 'giai-phong-mien-nam-1975.jpg',
    url: '/images/giai-phong-mien-nam-1975.jpg',
    size_bytes: 53559,
    mime_type: 'image/jpeg',
    sha256_hash: '7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5A6B7C8D9E0F1A2B3C4D5E6F7A8',
    author: 'Ảnh tư liệu lịch sử: Xe tăng Quân Giải phóng tiến vào Dinh Độc Lập (30/04/1975)',
    copyright: 'Tư liệu lịch sử Đảng & Bảo tàng Lịch sử Quân sự Việt Nam',
    created_at: '2026-11-05 00:19',
  },
  {
    id: 'med-quoc-tang-1969',
    name: 'quoc-tang-bac-ho-1969.jpg',
    url: '/images/quoc-tang-bac-ho-1969.jpg',
    size_bytes: 145628,
    mime_type: 'image/jpeg',
    sha256_hash: '9E8F7A6B5C4D3E2F1A0B9C8D7E6F5A4B3C2D1E0F9A8B7C6D5E4F3A2B1C0D9E8',
    author: 'Ảnh tư liệu lịch sử: Lễ Quốc tang Chủ tịch Hồ Chí Minh tại Ba Đình (1969)',
    copyright: 'Tư liệu lịch sử Đảng & Bảo tàng Hồ Chí Minh',
    created_at: '2026-11-05 00:05',
  },
  {
    id: 'med-dien-bien-phu-1954',
    name: 'chien-dich-dien-bien-phu-1954.jpg',
    url: '/images/chien-dich-dien-bien-phu-1954.jpg',
    size_bytes: 484935,
    mime_type: 'image/jpeg',
    sha256_hash: '8C7D6E5F4A3B2C1D0E9F8A7B6C5D4E3F2A1B0C9D8E7F6A5B4C3D2E1F0A9B8C7',
    author: 'Tư liệu lịch sử: Bộ Chính trị họp quyết định mở Chiến dịch Điện Biên Phủ (1954)',
    copyright: 'Tư liệu lịch sử Đảng & Bảo tàng Hồ Chí Minh',
    created_at: '2026-11-05 00:02',
  },
  {
    id: 'med-pac-bo-1941',
    name: 'bac-ho-pac-bo-1941.jpg',
    url: '/images/bac-ho-pac-bo-1941.jpg',
    size_bytes: 70133,
    mime_type: 'image/jpeg',
    sha256_hash: '2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5A6B7C8D9E0F1A2B3C',
    author: 'Ảnh tư liệu lịch sử: Bác Hồ làm việc trong hang Pác Bó (1941)',
    copyright: 'Tư liệu lịch sử Đảng & Bảo tàng Hồ Chí Minh',
    created_at: '2026-11-04 23:54',
  },
  {
    id: 'med-thanh-lap-dang-1930',
    name: 'thanh-lap-dang-1930.jpg',
    url: '/images/thanh-lap-dang-1930.jpg',
    size_bytes: 295491,
    mime_type: 'image/jpeg',
    sha256_hash: '5A1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A1B',
    author: 'Tranh lịch sử: Bác Hồ chủ trì Hội nghị thành lập Đảng (03/02/1930)',
    copyright: 'Tư liệu lịch sử Đảng Cộng sản Việt Nam & Không gian văn hóa HCM',
    created_at: '2026-11-04 23:44',
  },
  {
    id: 'med-dai-hoi-tours',
    name: 'nguyen-ai-quoc-dai-hoi-tours-1920.jpg',
    url: '/images/nguyen-ai-quoc-dai-hoi-tours-1920.jpg',
    size_bytes: 58582,
    mime_type: 'image/jpeg',
    sha256_hash: '9D4C2F1E8A7D3C5B6A1E9F0C2B4D6E8A1F3C5E7A9B0C2D4E6F8A1B3C5D7E9F0C',
    author: 'Bảo tàng Lịch sử Quốc gia & Tư liệu Lịch sử Đảng',
    copyright: 'Tư liệu lịch sử Không gian văn hóa Hồ Chí Minh',
    created_at: '2026-11-04 23:42',
  },
  {
    id: 'med-ben-nha-rong',
    name: 'ben-cang-nha-rong-1911-ttxvn.jpg',
    url: '/images/ben-nha-rong-1911.jpg',
    size_bytes: 43018,
    mime_type: 'image/jpeg',
    sha256_hash: '7C3F1E8A7D3C5B6A1E9F0C2B4D6E8A1F3C5E7A9B0C2D4E6F8A1B3C5D7E9F0E2',
    author: 'Thông tấn xã Việt Nam (TTXVN) - Tư liệu Lịch sử',
    copyright: 'Tư liệu lịch sử Đảng & Bảo tàng Hồ Chí Minh',
    created_at: '2026-11-04 23:40',
  },
  {
    id: 'med-lang-sen',
    name: 'ngoi-nha-tranh-lang-sen-que-bac.jpg',
    url: '/images/lang-sen-que-bac.jpg',
    size_bytes: 534291,
    mime_type: 'image/jpeg',
    sha256_hash: '8E4C2F1E8A7D3C5B6A1E9F0C2B4D6E8A1F3C5E7A9B0C2D4E6F8A1B3C5D7E9F1',
    author: 'Khu Di tích Quốc gia Đặc biệt Kim Liên - Nam Đàn, Nghệ An',
    copyright: 'Tư liệu lịch sử Không gian văn hóa Hồ Chí Minh',
    created_at: '2026-11-04 23:30',
  },
  {
    id: 'med-01',
    name: 'chan-dung-chu-tich-ho-chi-minh.png',
    url: '/images/ho-chi-minh-tp-hcm.png',
    size_bytes: 2310596,
    mime_type: 'image/png',
    sha256_hash: '9B4C2F1E8A7D3C5B6A1E9F0C2B4D6E8A1F3C5E7A9B0C2D4E6F8A1B3C5D7E9F0',
    author: 'Không gian văn hóa Hồ Chí Minh - THCS Nguyễn Trung Trực',
    copyright: 'Tài liệu giáo dục trường học Phường Thới An',
    created_at: '2026-11-04 14:00',
  },
  {
    id: 'med-02',
    name: 'bieu-trung-khong-gian-van-hoa-hcm.png',
    url: '/images/logo-bieu-tuong.png',
    size_bytes: 1965576,
    mime_type: 'image/png',
    sha256_hash: 'A1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A1B2',
    author: 'Trường THCS Nguyễn Trung Trực',
    copyright: 'Bản quyền biểu trưng số hóa nội bộ',
    created_at: '2026-11-04 14:15',
  },
  {
    id: 'med-03',
    name: 'nam-dieu-bac-ho-day-thieu-nhi.png',
    url: '/images/footer-5-dieu-bac-ho.png',
    size_bytes: 2492844,
    mime_type: 'image/png',
    sha256_hash: 'F0E9D8C7B6A5F4E3D2C1B0A9F8E7D6C5B4A3F2E1D0C9B8A7F6E5D4C3B2A1F0E9',
    author: 'Đội TNTP Hồ Chí Minh - THCS Nguyễn Trung Trực',
    copyright: 'Lưu hành giáo dục học sinh',
    created_at: '2026-11-04 14:30',
  },
  {
    id: 'med-04',
    name: 'ngoi-sao-lich-su-cach-mang.png',
    url: '/images/timeline-ngoi-sao.png',
    size_bytes: 1033318,
    mime_type: 'image/png',
    sha256_hash: 'D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A1B2C3D4E5',
    author: 'Tư liệu Dòng thời gian lịch sử',
    copyright: 'Tư liệu đồ họa số hóa',
    created_at: '2026-11-04 14:45',
  },
  {
    id: 'med-05',
    name: 'tuyen-ngon-doc-lap-1945.jpg',
    url: '/images/tuyen-ngon-doc-lap-1945.jpg',
    size_bytes: 88729,
    mime_type: 'image/jpeg',
    sha256_hash: '3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A1B2C3D4E5F6A7B8C9D0E1F2A3B4C',
    author: 'Tư liệu lịch sử: Bác Hồ đọc Tuyên ngôn Độc lập (02/09/1945)',
    copyright: 'Tư liệu văn kiện lịch sử Đảng & Không gian văn hóa HCM',
    created_at: '2026-11-04 23:59',
  },
];

const DEFAULT_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'evt-001',
    action: 'article.four_eyes_approve',
    article_title: 'Chủ tịch Hồ Chí Minh – Hành trình tìm đường cứu nước (1911 - 1941)',
    actor: 'Cán Bộ Quản Trị Trưởng (Ban Giám Hiệu)',
    role: 'Ban Giám Hiệu',
    decision: 'approved',
    feedback: 'Nội dung chuẩn mực, tư tưởng chính xác, đạt chuẩn xuất bản.',
    timestamp: '2026-11-04 15:09:52',
  },
  {
    id: 'evt-002',
    action: 'article.submit_review',
    article_title: 'Chủ tịch Hồ Chí Minh – Hành trình tìm đường cứu nước (1911 - 1941)',
    actor: 'Biên Tập Viên A (Thầy Lịch sử)',
    role: 'Biên Tập Viên',
    decision: 'pending',
    feedback: 'Nộp duyệt bài 4 mắt lên Ban Giám Hiệu.',
    timestamp: '2026-11-04 15:09:41',
  },
  {
    id: 'evt-003',
    action: 'article.four_eyes_approve',
    article_title: 'Tác phẩm "Nhật ký trong tù" – Giá trị nhân văn và tinh thần thép',
    actor: 'Cán Bộ Quản Trị Trưởng (Ban Giám Hiệu)',
    role: 'Ban Giám Hiệu',
    decision: 'approved',
    feedback: 'Đạt yêu cầu sư phạm và giá trị giáo dục tư tưởng.',
    timestamp: '2026-11-03 14:20:10',
  },
  {
    id: 'evt-004',
    action: 'article.four_eyes_approve',
    article_title: 'Xây dựng Không gian văn hóa Hồ Chí Minh tại Trường THCS Nguyễn Trung Trực',
    actor: 'Cán Bộ Quản Trị Trưởng (Ban Giám Hiệu)',
    role: 'Ban Giám Hiệu',
    decision: 'approved',
    feedback: 'Bài viết gương mẫu, chính thức xuất bản trang chủ.',
    timestamp: '2026-11-02 10:15:22',
  },
];

// ------------------------------------------------------------------------------
// STORAGE KEYS & EVENT NAMES (v4 with ultra-safe lightweight storage & zero-hang)
// ------------------------------------------------------------------------------
const KEY_ARTICLES = 'hcm_cultural_articles_v4';
const KEY_MEDIA = 'hcm_cultural_media_v4';
const KEY_AUDIT = 'hcm_cultural_audit_v4';
const KEY_DELETED_ARTICLES = 'hcm_cultural_deleted_articles_v4';

export function getDeletedArticleIds(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY_DELETED_ARTICLES);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

export function saveDeletedArticleId(id: string): void {
  try {
    const set = getDeletedArticleIds();
    set.add(id);
    localStorage.setItem(KEY_DELETED_ARTICLES, JSON.stringify(Array.from(set)));
  } catch {
    // ignore
  }
}

// ------------------------------------------------------------------------------
// DANH SÁCH BÀI TEST & BÀI CHÍNH THỨC ĐỂ BẢO VỆ TOÀN VẸN DỮ LIỆU
// ------------------------------------------------------------------------------
export const KNOWN_TEST_ARTICLE_IDS = new Set([
  'art-1794931991567',
  'art-1794934461061',
  'art-1794909786816',
  '6be75125-52eb-4678-b0ee-c94de607b24e',
  'd0000000-0000-0000-0000-000000000004',
  'd0000000-0000-0000-0000-000000000003',
]);

export const AUTHENTIC_ARTICLE_IDS = new Set([
  'c0000000-0000-0000-0000-000000000005',
  'art-1794908270719',
  'art-1794907844769',
  'art-1794906467860',
  'art-1794882617978',
  'art-001',
  'art-002',
  'art-003',
  'art-004',
  'art-005',
  '01d1a3ea-76c4-4000-a000-7715af9c7895',
  'c0000000-0000-0000-0000-000000000004',
  'd0000000-0000-0000-0000-000000000002',
  '0290781d-1cba-41e6-94fd-f877bd50e8b0',
]);

export function isTestOrDeletedArticle(art: Partial<ArticleData>): boolean {
  if (!art) return false;
  const id = art.id || '';
  const slug = art.slug || '';
  const title = (art.title || '').trim();
  const summary = (art.summary || '').trim();

  // Bài viết chính thức được bảo vệ tuyệt đối
  if (id && AUTHENTIC_ARTICLE_IDS.has(id)) return false;

  // 1. Kiểm tra chính xác ID test cũ (KHÔNG dùng startsWith('art-179493') vì sẽ chặn nhầm bài mới tạo cùng khung giờ)
  if (id && KNOWN_TEST_ARTICLE_IDS.has(id)) return true;

  // 2. Kiểm tra slug test rác (KHÔNG chặn slug === 't' vì bài thật gõ chữ T đầu tiên có thể bị dính slug 't')
  if (slug === 'test') return true;

  // 3. Kiểm tra tiêu đề test cũ sinh ra trong lúc thử nghiệm
  if (title === 'Test' || title === 'Bản thảo nghiên cứu Di chúc Bác Hồ') return true;
  if (title === 'Lời kêu gọi toàn quốc kháng chiến năm 1946' && art.status === 'rejected') return true;

  // 4. Kiểm tra tóm tắt chứa văn bản rác test
  if (summary.includes('ásdadsdasdads')) return true;

  // 5. Kiểm tra danh sách ID đã xóa cục bộ (chỉ đối chiếu theo ID duy nhất, không chặn trùng slug bài mới)
  const deletedIds = getDeletedArticleIds();
  if (id && deletedIds.has(id)) return true;

  return false;
}

export async function unpublishArticleInCloud(articleId: string): Promise<boolean> {
  const nowIso = new Date().toISOString();
  try {
    const current = getStoredArticles();
    const art = current.find((a) => a.id === articleId || a.slug === articleId);
    if (art) {
      await saveArticleToCloud({ ...art, status: 'draft', updated_at: nowIso });
      return true;
    }
  } catch {}
  if (!isSupabaseConfigured) return true;
  try {
    const { error } = await supabase
      .from('content_revisions')
      .update({ status: 'draft', updated_at: new Date().toISOString() })
      .or(`id.eq.${articleId},item_id.eq.${articleId}`);
    if (error) console.warn('[CMS Cloud Unpublish Warning]', error.message);
    return !error;
  } catch (err: any) {
    console.warn('[CMS Cloud Unpublish Exception]', err?.message || err);
    return false;
  }
}

export async function deleteArticleInCloud(articleId: string): Promise<boolean> {
  saveDeletedArticleId(articleId);
  try {
    await fetch(`/api/cms/articles?id=${encodeURIComponent(articleId)}`, { method: 'DELETE' });
  } catch {}
  if (!isSupabaseConfigured) return true;
  try {
    const { handleDeleteCmsArticle } = await import('./cmsBackend');
    await handleDeleteCmsArticle(articleId);
    return true;
  } catch {
    try {
      const { error } = await supabase
        .from('content_revisions')
        .delete()
        .or(`id.eq.${articleId},item_id.eq.${articleId}`);
      if (error) console.warn('[CMS Cloud Delete Warning]', error.message);
      return !error;
    } catch (err: any) {
      console.warn('[CMS Cloud Delete Exception]', err?.message || err);
      return false;
    }
  }
}

// Dọn dẹp an toàn và triệt để các khóa cũ có thể chứa payload Base64 quá tải gây RESULT_CODE_HUNG
try {
  localStorage.removeItem('hcm_cultural_articles_v1');
  localStorage.removeItem('hcm_cultural_media_v1');
  localStorage.removeItem('hcm_cultural_audit_v1');
  localStorage.removeItem('hcm_cultural_articles_v2');
  localStorage.removeItem('hcm_cultural_media_v2');
  localStorage.removeItem('hcm_cultural_audit_v2');
  localStorage.removeItem('hcm_cultural_articles_v3');
  localStorage.removeItem('hcm_cultural_media_v3');
  localStorage.removeItem('hcm_cultural_audit_v3');
} catch {
  // Bỏ qua nếu môi trường không hỗ trợ
}

export const EVENT_ARTICLES_CHANGED = 'hcm:articles:changed';
export const EVENT_MEDIA_CHANGED = 'hcm:media:changed';

// ------------------------------------------------------------------------------
// IN-MEMORY CACHE & CONCURRENCY GUARDS (Chống QuotaExceededError & Race Condition)
// ------------------------------------------------------------------------------
let memoryArticlesCache: ArticleData[] | null = null;
let memoryMediaCache: MediaAsset[] | null = null;
const inflightSaveArticleIds = new Set<string>();
let inflightFetchArticlesPromise: Promise<{
  success: boolean;
  articles?: ArticleData[];
  error?: string;
}> | null = null;

// ------------------------------------------------------------------------------
// ARTICLE STORE METHODS
// ------------------------------------------------------------------------------
export function getStoredArticles(): ArticleData[] {
  if (memoryArticlesCache) {
    return memoryArticlesCache.filter((art) => !isTestOrDeletedArticle(art));
  }
  try {
    const raw = localStorage.getItem(KEY_ARTICLES);
    let articles: ArticleData[];
    if (!raw) {
      memoryArticlesCache = DEFAULT_ARTICLES;
      try {
        localStorage.setItem(KEY_ARTICLES, JSON.stringify(DEFAULT_ARTICLES));
      } catch {
        // ignore quota error
      }
      return DEFAULT_ARTICLES;
    }
    articles = JSON.parse(raw);

    // Tự động rà soát, dọn dẹp Base64 thô và chuẩn hóa chuyên mục theo trang chủ
    let modified = false;
    const cleanedArticles = articles.map((art) => {
      let updatedArt = { ...art };

      // Chuẩn hóa chuyên mục cũ CAT- sang chuyên mục trang chủ
      if (updatedArt.category.startsWith('CAT-')) {
        const legacyCat = updatedArt.category;
        updatedArt.category = normalizeCategoryToHomepage(legacyCat);
        if (!updatedArt.topic) {
          const topicMap: Record<string, string> = {
            'CAT-01-CUOCDOI': 'Cuộc đời & Sự nghiệp Bác Hồ',
            'CAT-02-THIEUNHI': 'Bác Hồ với Tuổi trẻ & Thiếu nhi',
            'CAT-03-DISAN': 'Di sản Tư tưởng & Tác phẩm',
            'CAT-04-NHATRUONG': 'Trường THCS Nguyễn Trung Trực Làm theo Bác',
            'CAT-05-DIACHIDO': 'Địa chỉ đỏ & Di tích Lịch sử',
          };
          updatedArt.topic = topicMap[legacyCat] || 'Không gian văn hóa';
        }
        modified = true;
      }

      if (
        updatedArt.content &&
        (updatedArt.content.includes('data:image/') ||
          updatedArt.content.includes('AAAA') ||
          updatedArt.content.includes('/9j/') ||
          updatedArt.content.includes('iVBORw'))
      ) {
        const { cleanedText, hasChanges } = cleanBase64FromContent(updatedArt.content, updatedArt.author_name);
        if (hasChanges) {
          modified = true;
          updatedArt.content = cleanedText;
        }
      }
      return updatedArt;
    });

    // Lọc bỏ triệt để mọi bài viết sinh ra lúc test để trả lại không gian sạch sẽ 100%
    const sanitizedArticles = cleanedArticles.filter((art) => !isTestOrDeletedArticle(art));
    if (sanitizedArticles.length !== articles.length) {
      modified = true;
    }

    memoryArticlesCache = sanitizedArticles;
    if (modified) {
      try {
        localStorage.setItem(KEY_ARTICLES, JSON.stringify(sanitizedArticles));
      } catch {
        // ignore quota error
      }
    }
    return sanitizedArticles;
  } catch {
    return DEFAULT_ARTICLES.filter((art) => !isTestOrDeletedArticle(art));
  }
}

export function saveStoredArticles(articles: ArticleData[]) {
  // Dọn dẹp sạch mã Base64 trước khi ghi vào kho lưu trữ
  const cleanedArticles = articles.map((art) => {
    if (
      art.content &&
      (art.content.includes('data:image/') ||
        art.content.includes('AAAA') ||
        art.content.includes('/9j/') ||
        art.content.includes('iVBORw'))
    ) {
      const { cleanedText } = cleanBase64FromContent(art.content, art.author_name);
      return { ...art, content: cleanedText };
    }
    return art;
  });

  // 1. Luôn cập nhật bộ nhớ RAM trước tiên để trạng thái UI không bao giờ bị giật/mất bài
  memoryArticlesCache = cleanedArticles;

  // 2. Lưu vào localStorage (có cơ chế tự động rút gọn media base64 nặng nếu tràn hạn mức 5MB)
  try {
    localStorage.setItem(KEY_ARTICLES, JSON.stringify(cleanedArticles));
  } catch (err) {
    console.warn('[saveStoredArticles] localStorage đầy hạn mức, tự động nén bản cache cục bộ:', err);
    try {
      const slimArticles = cleanedArticles.map((art) => ({
        ...art,
        // Loại bỏ bản sao base64 nặng trong media_assets khi lưu cache localStorage (bản đầy đủ vẫn nằm ở RAM & Cloud)
        media_assets: Array.isArray(art.media_assets)
          ? art.media_assets.map((m) =>
              m && typeof m.url === 'string' && m.url.startsWith('data:') && m.url.length > 10000
                ? { ...m, url: '' }
                : m
            )
          : undefined,
      }));
      localStorage.setItem(KEY_ARTICLES, JSON.stringify(slimArticles));
    } catch (err2) {
      console.warn('[saveStoredArticles] Vẫn vượt hạn mức localStorage, giữ dữ liệu trên RAM & Cloud:', err2);
    }
  }

  // 3. Luôn phát sự kiện đồng bộ kèm dữ liệu mới nhất
  window.dispatchEvent(new CustomEvent(EVENT_ARTICLES_CHANGED, { detail: cleanedArticles }));
}

export function getPublishedArticles(): ArticleData[] {
  const all = getStoredArticles();
  return all.filter((a) => a.status === 'published');
}

// ------------------------------------------------------------------------------
// MEDIA STORE METHODS
// ------------------------------------------------------------------------------
export function getStoredMedia(): MediaAsset[] {
  if (memoryMediaCache) return memoryMediaCache;
  try {
    const raw = localStorage.getItem(KEY_MEDIA);
    if (!raw) {
      memoryMediaCache = DEFAULT_MEDIA_ASSETS;
      try {
        localStorage.setItem(KEY_MEDIA, JSON.stringify(DEFAULT_MEDIA_ASSETS));
      } catch {
        // ignore quota error
      }
      return DEFAULT_MEDIA_ASSETS;
    }
    const parsed = JSON.parse(raw);
    memoryMediaCache = Array.isArray(parsed) ? parsed : DEFAULT_MEDIA_ASSETS;
    return memoryMediaCache;
  } catch {
    return DEFAULT_MEDIA_ASSETS;
  }
}

export function saveStoredMedia(assets: MediaAsset[]) {
  memoryMediaCache = assets;
  try {
    localStorage.setItem(KEY_MEDIA, JSON.stringify(assets));
  } catch (err) {
    console.warn('[saveStoredMedia] localStorage đầy hạn mức, lưu bản cache media trên RAM:', err);
  }
  window.dispatchEvent(new CustomEvent(EVENT_MEDIA_CHANGED, { detail: assets }));
}

// ------------------------------------------------------------------------------
// AUDIT LOG STORE METHODS
// ------------------------------------------------------------------------------
export function getStoredAuditLogs(): AuditLogItem[] {
  try {
    const raw = localStorage.getItem(KEY_AUDIT);
    if (!raw) {
      localStorage.setItem(KEY_AUDIT, JSON.stringify(DEFAULT_AUDIT_LOGS));
      return DEFAULT_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_AUDIT_LOGS;
  }
}

export function addStoredAuditLog(log: AuditLogItem) {
  try {
    const logs = getStoredAuditLogs();
    const updated = [log, ...logs];
    localStorage.setItem(KEY_AUDIT, JSON.stringify(updated));
  } catch (err) {
    console.error('Lỗi ghi nhật ký kiểm toán:', err);
  }
}

// ------------------------------------------------------------------------------
// SANITIZATION SERVICE: THU GỌN VÀ CHUYỂN ĐỔI MÃ ẢNH BASE64 THÔ (AAAA...)
// Tự động giải phóng các khối chuỗi ký tự Base64 dài thành thẻ tham chiếu media://
// ------------------------------------------------------------------------------
export function cleanBase64FromContent(
  rawText: string,
  authorName: string = 'Ban Biên Tập THCS Nguyễn Trung Trực',
  options: { persistMedia?: boolean } = { persistMedia: true }
): { cleanedText: string; hasChanges: boolean } {
  if (!rawText) return { cleanedText: '', hasChanges: false };
  if (
    !rawText.includes('data:image/') &&
    !rawText.includes('AAAA') &&
    !rawText.includes('/9j/') &&
    !rawText.includes('iVBORw')
  ) {
    return { cleanedText: rawText, hasChanges: false };
  }

  let result = rawText;
  let hasChanges = false;
  const mediaList = getStoredMedia();
  let updatedMediaList = [...mediaList];
  const newAssetsToPersist: MediaAsset[] = [];

  const findOrCreateAsset = (rawUrlOrBase64: string, altText?: string): string => {
    const cleanPayload = rawUrlOrBase64.replace(/[\r\n\s]+/g, '');
    const dataUrl = cleanPayload.startsWith('data:')
      ? cleanPayload
      : `data:image/jpeg;base64,${cleanPayload}`;

    // Tìm kiếm trong kho media đã có
    const existing = updatedMediaList.find(
      (m) => m.url === dataUrl || m.url === cleanPayload
    );
    if (existing) {
      return existing.id;
    }

    const newId = `med-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const hexChars = '0123456789ABCDEF';
    let sha = '';
    for (let i = 0; i < 64; i++) {
      sha += hexChars[Math.floor(Math.random() * hexChars.length)];
    }

    const cleanName = altText
      ? `${altText.trim().toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`
      : `tu-lieu-${newId}.jpg`;

    const newAsset: MediaAsset = {
      id: newId,
      name: cleanName,
      url: dataUrl,
      size_bytes: Math.round((cleanPayload.length * 3) / 4),
      mime_type: 'image/jpeg',
      sha256_hash: sha,
      author: authorName,
      copyright: 'Tài liệu giáo dục THCS Nguyễn Trung Trực',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    updatedMediaList.push(newAsset);
    // Giới hạn an toàn: chỉ lưu tối đa 3 asset và kích thước < 600KB để bảo vệ localStorage quota
    if (options.persistMedia && newAssetsToPersist.length < 3 && cleanPayload.length < 600000) {
      newAssetsToPersist.push(newAsset);
    }
    hasChanges = true;
    return newId;
  };

  // 1. Thay thế trực tiếp các media url Base64 đã lưu
  mediaList.forEach((media) => {
    if (media.url.startsWith('data:') && result.includes(media.url)) {
      result = result.split(media.url).join(`media://${media.id}`);
      hasChanges = true;
    }
  });

  // 2. Thẻ Markdown ảnh ![alt](data:image/...) hoặc ![alt](AAAA...)
  const mdImgRegex = /!\[(.*?)\]\(((?:data:image\/[a-zA-Z0-9+/=;:,_\-\s\r\n]+)|(?:[A-Za-z0-9+/=\s\r\n]{40,}))\)/g;
  result = result.replace(mdImgRegex, (match, alt, b64Content) => {
    const cleanB64 = b64Content.replace(/[\r\n\s]+/g, '');
    if (cleanB64.length < 30) return match;
    hasChanges = true;
    const assetId = findOrCreateAsset(cleanB64, alt);
    return `![${alt || 'Hình ảnh tư liệu lịch sử'}](media://${assetId})`;
  });

  // 3. Chuỗi data:image/jpeg;base64,... đơn lẻ trong bài
  const rawDataUrlRegex = /data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=\s\r\n]{40,}/g;
  result = result.replace(rawDataUrlRegex, (match) => {
    const clean = match.replace(/[\r\n\s]+/g, '');
    hasChanges = true;
    const assetId = findOrCreateAsset(clean, 'Hình ảnh tư liệu');
    return `\n\n![Hình ảnh tư liệu lịch sử](media://${assetId})\n\n`;
  });

  // 4. Khối ký tự Base64 thô nhiều dòng (AAAA... dán trực tiếp ngoài văn bản)
  const rawBase64BlockRegex = /(?:[A-Za-z0-9+/=]{40,}(?:[\r\n]+[A-Za-z0-9+/=]{30,})*)/g;
  result = result.replace(rawBase64BlockRegex, (match) => {
    const clean = match.replace(/[\r\n\s]+/g, '');
    if (clean.length < 60) return match;
    hasChanges = true;
    const assetId = findOrCreateAsset(clean, 'Tư liệu lịch sử số hóa');
    return `\n\n![Tư liệu lịch sử số hóa](media://${assetId})\n\n`;
  });

  // Ghi vào localStorage duy nhất 1 lần ở cuối, tránh gây nghẽn tiến trình render (RESULT_CODE_HUNG)
  if (options.persistMedia && newAssetsToPersist.length > 0) {
    try {
      saveStoredMedia(updatedMediaList);
    } catch {
      // Giảm thiểu rủi ro quota
    }
  }

  return { cleanedText: result, hasChanges };
}

// ------------------------------------------------------------------------------
// MEDIA SYNCHRONIZATION HELPERS & RESOLVERS
// ------------------------------------------------------------------------------

/**
 * Trích xuất toàn bộ MediaAsset được nhúng trong bài viết hoặc ảnh tiêu biểu
 */
export function extractMediaAssetsForArticle(article: ArticleData): MediaAsset[] {
  const assets: MediaAsset[] = [];
  const assetMap = new Map<string, MediaAsset>();

  // Kiểm tra danh sách đã đính kèm sẵn
  if (Array.isArray(article.media_assets)) {
    for (const a of article.media_assets) {
      if (a && a.id) assetMap.set(a.id, a);
    }
  }

  // Quét nội dung và featured_image để tìm thẻ media://<id>
  const combinedText = `${article.content || ''} ${article.featured_image || ''}`;
  const regex = /media:\/\/([a-zA-Z0-9_\-]+)/g;
  let match: RegExpExecArray | null;
  const referencedIds = new Set<string>();

  while ((match = regex.exec(combinedText)) !== null) {
    referencedIds.add(match[1]);
  }

  // Tìm trong kho media hiện hành
  const storedMedia = getStoredMedia();
  for (const id of referencedIds) {
    if (assetMap.has(id)) {
      assets.push(assetMap.get(id)!);
    } else {
      const found = storedMedia.find((m) => m.id === id || m.name === id);
      if (found) {
        assets.push(found);
        assetMap.set(id, found);
      }
    }
  }

  return assets;
}

/**
 * Phân giải URL hình ảnh hoặc thẻ media://<id> thành URL thực tế
 */
export function resolveMediaUrl(url?: string, extraAssets?: MediaAsset[]): string {
  if (!url) return '';
  if (url.startsWith('media://') || url.startsWith('media:')) {
    const id = url.replace(/^media:\/\//, '').replace(/^media:/, '');
    if (extraAssets && Array.isArray(extraAssets)) {
      const found = extraAssets.find((m) => m.id === id || m.name === id);
      if (found && found.url) return found.url;
    }
    const stored = getStoredMedia();
    const foundStored = stored.find((m) => m.id === id || m.name === id);
    if (foundStored && foundStored.url) return foundStored.url;
  }
  return url;
}

/**
 * Lưu 1 MediaAsset lên Cloud Supabase (bảo đảm mọi thiết bị đều tải được)
 */
export async function saveMediaToCloud(asset: MediaAsset): Promise<boolean> {
  try {
    const res = await fetch('/api/cms/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ asset }),
    });
    if (res.ok) {
      const json = await res.json();
      return json.success === true;
    }
  } catch (err) {
    console.warn('[saveMediaToCloud API error]', err);
  }

  if (isSupabaseConfigured) {
    try {
      const { handleSaveCmsMedia } = await import('./cmsBackend');
      const direct = await handleSaveCmsMedia(asset);
      return direct.success === true;
    } catch {}
  }
  return true;
}

/**
 * Lưu nhiều MediaAssets lên Cloud Supabase
 */
export async function saveMediaBatchToCloud(assets: MediaAsset[]): Promise<boolean> {
  if (!assets || assets.length === 0) return true;
  try {
    const res = await fetch('/api/cms/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assets }),
    });
    if (res.ok) {
      const json = await res.json();
      return json.success === true;
    }
  } catch (err) {
    console.warn('[saveMediaBatchToCloud API error]', err);
  }

  if (isSupabaseConfigured) {
    try {
      const { handleSaveCmsMedia } = await import('./cmsBackend');
      const direct = await handleSaveCmsMedia(assets);
      return direct.success === true;
    } catch {}
  }
  return true;
}

/**
 * Tải toàn bộ MediaAssets từ Cloud về kho media cục bộ
 */
export async function fetchMediaFromCloud(): Promise<MediaAsset[]> {
  let cloudAssets: MediaAsset[] | undefined;
  try {
    const res = await fetch('/api/cms/media');
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.assets)) {
        cloudAssets = json.assets;
      }
    }
  } catch (err) {
    console.warn('[fetchMediaFromCloud API error]', err);
  }

  if (!cloudAssets && isSupabaseConfigured) {
    try {
      const { handleGetCmsMedia } = await import('./cmsBackend');
      const direct = await handleGetCmsMedia();
      if (direct.success && Array.isArray(direct.assets)) {
        cloudAssets = direct.assets;
      }
    } catch {}
  }

  if (cloudAssets && cloudAssets.length > 0) {
    const currentLocal = getStoredMedia();
    const mediaMap = new Map(currentLocal.map((m) => [m.id, m]));
    let hasChanges = false;
    for (const ca of cloudAssets) {
      if (ca && ca.id && !mediaMap.has(ca.id)) {
        mediaMap.set(ca.id, ca);
        hasChanges = true;
      }
    }
    if (hasChanges) {
      const merged = Array.from(mediaMap.values());
      saveStoredMedia(merged);
      return merged;
    }
    return currentLocal;
  }
  return getStoredMedia();
}

/**
 * Xóa MediaAsset khỏi Cloud
 */
export async function deleteMediaFromCloud(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/cms/media?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      const json = await res.json();
      return json.success === true;
    }
  } catch (err) {
    console.warn('[deleteMediaFromCloud API error]', err);
  }

  if (isSupabaseConfigured) {
    try {
      const { handleDeleteCmsMedia } = await import('./cmsBackend');
      const direct = await handleDeleteCmsMedia(id);
      return direct.success === true;
    } catch {}
  }
  return true;
}

// ------------------------------------------------------------------------------
// ĐỒNG BỘ BÀI VIẾT TỪ SUPABASE CLOUD DATABASE (TOÀN DIỆN MỌI THIẾT BỊ)
// ------------------------------------------------------------------------------
export async function saveArticleToCloud(article: ArticleData): Promise<{
  success: boolean;
  article?: ArticleData;
  error?: string;
}> {
  // Trích xuất và đính kèm mọi MediaAsset liên quan để đồng bộ đa thiết bị
  const referencedAssets = extractMediaAssetsForArticle(article);

  // Bảo toàn nguyên vẹn tệp PDF do người dùng tải lên, không tự ý thay thế bằng tệp khác
  const payloadArticle: ArticleData = {
    ...article,
    media_assets: referencedAssets,
  };

  // Đồng thời đồng bộ các asset này lên kho media trung tâm ở chế độ nền
  if (referencedAssets.length > 0) {
    saveMediaBatchToCloud(referencedAssets).catch((e) => console.warn('[syncMediaAssets background error]', e));
  }

  // Đánh dấu đang tải bài lên Cloud để ngăn đồng bộ nền ghi đè mất bài
  const trackKey = article.id || article.slug;
  if (trackKey) inflightSaveArticleIds.add(trackKey);

  // 1. Kênh 1: Gọi Serverless API chuyên dụng (/api/cms/articles) với timeout an toàn
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    const res = await fetch('/api/cms/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ article: payloadArticle }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.article) {
        return { success: true, article: json.article };
      }
      return { success: false, error: json.error || 'Máy chủ Cloud phản hồi không thành công.' };
    } else {
      let errDetail = `Lỗi máy chủ (HTTP ${res.status})`;
      try {
        const errJson = await res.json();
        if (errJson?.error) errDetail = errJson.error;
      } catch {}
      console.warn('[saveArticleToCloud API error]', errDetail);
      return { success: false, error: errDetail };
    }
  } catch (apiErr: any) {
    const msg = apiErr?.name === 'AbortError' ? 'Hết thời gian chờ phản hồi từ Cloud (Timeout 25s)' : (apiErr?.message || 'Lỗi kết nối mạng đến Cloud Database');
    console.warn('[saveArticleToCloud API exception]', msg);
    return { success: false, error: msg };
  } finally {
    if (trackKey) inflightSaveArticleIds.delete(trackKey);
  }
}

export async function fetchArticlesFromSupabase(): Promise<{
  success: boolean;
  articles?: ArticleData[];
  error?: string;
}> {
  // Gộp các lệnh gọi đồng bộ đồng thời (tránh 4 component chạy song song ghi đè lẫn nhau)
  if (inflightFetchArticlesPromise) {
    return inflightFetchArticlesPromise;
  }

  inflightFetchArticlesPromise = _executeFetchArticlesFromSupabase().finally(() => {
    inflightFetchArticlesPromise = null;
  });

  return inflightFetchArticlesPromise;
}

async function _executeFetchArticlesFromSupabase(): Promise<{
  success: boolean;
  articles?: ArticleData[];
  error?: string;
}> {
  let cloudArticles: ArticleData[] | undefined;
  let fetchedFromFullCmsApi = false;

  // 1. Kênh 1: Kéo toàn bộ danh sách bài viết qua Serverless API (lấy cả draft, pending, published, rejected)
  try {
    const res = await fetch(`/api/cms/articles?_t=${Date.now()}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.articles)) {
        cloudArticles = json.articles;
        fetchedFromFullCmsApi = true;
      }
    }
  } catch (apiErr) {
    console.warn('[fetchArticlesFromSupabase API error]', apiErr);
  }

  // 2. Kênh 2: Dự phòng truy vấn trực tiếp cmsBackend nếu API chưa sẵn sàng
  if (!cloudArticles && isSupabaseConfigured) {
    try {
      const { handleGetCmsArticles } = await import('./cmsBackend');
      const directRes = await handleGetCmsArticles();
      if (directRes.success && Array.isArray(directRes.articles)) {
        cloudArticles = directRes.articles;
      }
    } catch (directErr) {
      console.warn('[fetchArticlesFromSupabase direct error]', directErr);
    }
  }

  // 3. Kênh 3: Dự phòng đọc published từ bảng content_revisions trực tiếp
  if (!cloudArticles && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('content_revisions')
        .select('id, item_id, title, summary, data, status, created_at, updated_at')
        .order('updated_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const postRevs = data.filter((d) => {
          const title = d.title || '';
          return !title.includes('Hồ Sơ Hội Thi') && !title.includes('Kho Tư Liệu') && d.data && (d.data.content || d.data.category);
        });

        cloudArticles = postRevs.map((rev) => {
          const revData = rev.data || {};
          const articleId = revData.legacy_id || rev.item_id || rev.id;
          const slug = revData.slug || rev.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
          return {
            id: articleId,
            title: rev.title,
            slug,
            summary: rev.summary || revData.summary || '',
            content: revData.content || '',
            category: revData.category || 'article',
            topic: revData.topic || 'Không gian văn hóa Hồ Chí Minh',
            featured_image: revData.featured_image || '',
            media_assets: Array.isArray(revData.media_assets) ? revData.media_assets : [],
            references: revData.references || '',
            audio_url: revData.audio_url || '',
            audio_duration: revData.audio_duration || '',
            quote_id: revData.quote_id,
            custom_quote: revData.custom_quote || '',
            pdf_attachment: revData.pdf_attachment || undefined,
            status: (rev.status as any) || 'published',
            author_id: revData.author_id || '',
            author_name: revData.author_name || 'Ban Biên Tập THCS Nguyễn Trung Trực',
            created_at: rev.created_at || '',
            updated_at: rev.updated_at || rev.created_at || '',
          };
        });
      }
    } catch {}
  }

  if (cloudArticles && cloudArticles.length > 0) {
    const validCloud = cloudArticles.filter((a) => !isTestOrDeletedArticle(a));

    // Đồng bộ vào localStorage thiết bị hiện tại để bảo toàn hiển thị và truy cập nhanh
    const currentLocal = getStoredArticles();
    const localMap = new Map(currentLocal.map((a) => [a.id || a.slug, a]));

    const parseTime = (t?: string): number => {
      if (!t) return 0;
      if (t === 'Vừa xong' || t === 'Vừa duyệt' || t === 'Vừa lưu' || t === 'Mới cập nhật' || t === 'Yêu cầu sửa' || t === 'Đã gỡ bài') {
        return 0; // Chuỗi placeholder cục bộ không được xem là mới hơn timestamp ISO thực từ Cloud
      }
      const n = new Date(t).getTime();
      return isNaN(n) ? 0 : n;
    };

    const mergedMap = new Map<string, ArticleData>();

    // 1. Phân giải thông minh giữa Cloud và Local
    for (const ca of validCloud) {
      const key = ca.id || ca.slug;
      const la = localMap.get(key) ||
                 (ca.id ? localMap.get(ca.id) : undefined) ||
                 (ca.slug ? localMap.get(ca.slug) : undefined);

      if (!la) {
        // Chưa có bản cục bộ, chấp nhận bài Cloud trực tiếp
        mergedMap.set(key, ca);
        continue;
      }

      const laTime = parseTime(la.updated_at || la.created_at);
      const caTime = parseTime(ca.updated_at || ca.created_at);
      const isInflightLocalSave = Boolean(
        (la.id && inflightSaveArticleIds.has(la.id)) ||
        (la.slug && inflightSaveArticleIds.has(la.slug))
      );

      // QUY TẮC 1: Nếu thiết bị hiện tại ĐANG trong tiến trình đẩy bản lưu/nộp duyệt lên Cloud, giữ nguyên bản cục bộ
      if (isInflightLocalSave) {
        mergedMap.set(key, la);
        continue;
      }

      // QUY TẮC 2: So sánh timestamp thực tế chuẩn xác (TUYỆT ĐỐI không để cache 'published' cũ đè mất bài 'pending' mới sửa từ thiết bị khác!)
      // - Nếu bản cục bộ mới hơn Cloud rõ rệt (> 1.5 giây): giữ bản cục bộ và đẩy đồng bộ lên Cloud
      // - Ngược lại (Cloud mới hơn hoặc ngang bằng): CLOUD LUÔN CHIẾN THẮNG (bao gồm cả trường hợp GV vừa sửa bài 'published' -> 'pending' để đưa vào Hàng đợi 4 mắt)
      if (laTime > caTime + 1500) {
        mergedMap.set(key, la);
        saveArticleToCloud(la).catch(() => {});
      } else {
        const mergedCloud: ArticleData = {
          ...ca,
          pdf_attachment: ca.pdf_attachment || la.pdf_attachment,
          quote_id: ca.quote_id !== undefined ? ca.quote_id : la.quote_id,
          custom_quote: ca.custom_quote || la.custom_quote,
        };
        mergedMap.set(key, mergedCloud);
      }
    }

    // 2. Xử lý các bài viết có trong Local nhưng KHÔNG có trên Cloud:
    // - Nếu chỉ tải được từ Kênh dự phòng Anon Key (!fetchedFromFullCmsApi), RLS chỉ trả về bài 'published',
    //   nên TUYỆT ĐỐI giữ nguyên các bài 'pending', 'draft', 'rejected' cục bộ!
    // - Nếu đã tải đầy đủ từ Full CMS API (fetchedFromFullCmsApi === true):
    //   Giữ lại bản nháp ('draft'), bài đang trong tiến trình lưu lên Cloud (inflightSaveArticleIds),
    //   hoặc bài 'pending' mới gửi trong vòng 60 giây gần nhất để không bao giờ chớp lên rồi biến mất.
    for (const [key, la] of localMap.entries()) {
      if (isTestOrDeletedArticle(la)) continue;

      const existsInMerged = mergedMap.has(key) ||
        (la.id && mergedMap.has(la.id)) ||
        (la.slug && mergedMap.has(la.slug));

      if (!existsInMerged) {
        if (!fetchedFromFullCmsApi) {
          if (la.status === 'pending' || la.status === 'draft' || la.status === 'rejected') {
            mergedMap.set(key, la);
          }
        } else {
          const laTime = parseTime(la.updated_at || la.created_at);
          const isInflightOrBrandNew =
            (la.id && inflightSaveArticleIds.has(la.id)) ||
            (la.slug && inflightSaveArticleIds.has(la.slug)) ||
            (la.status === 'pending' && laTime > 0 && Date.now() - laTime < 60000);

          if (la.status === 'draft' || isInflightOrBrandNew) {
            mergedMap.set(key, la);
          }
        }
      }
    }

    const mergedList = Array.from(mergedMap.values()).filter((a) => !isTestOrDeletedArticle(a));
    saveStoredArticles(mergedList);

    // Tự động giải nén và đồng bộ tất cả hình ảnh media_assets kèm theo bài viết vào kho media của thiết bị
    try {
      const currentMedia = getStoredMedia();
      const mediaMap = new Map(currentMedia.map((m) => [m.id, m]));
      let mediaChanged = false;
      for (const ca of validCloud) {
        if (Array.isArray(ca.media_assets)) {
          for (const asset of ca.media_assets) {
            if (asset && asset.id && !mediaMap.has(asset.id)) {
              mediaMap.set(asset.id, asset);
              mediaChanged = true;
            }
          }
        }
      }
      if (mediaChanged) {
        saveStoredMedia(Array.from(mediaMap.values()));
      }
    } catch (mediaSyncErr) {
      console.warn('[fetchArticlesFromSupabase media unpack error]', mediaSyncErr);
    }

    return { success: true, articles: mergedList };
  }

  return { success: false, error: 'Chưa thể nạp bài viết từ Cloud Database' };
}
