import { ResourceItem } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const MOCK_EXCLUDED_RESOURCE_IDS = new Set([
  'res-1',
  'res-2',
  'res-5',
  'res-6',
  'res-7',
  'audio-1',
  'audio-2',
  'audio-3',
  'audio-4'
]);

export const resourcesData: ResourceItem[] = [
  {
    id: 'res-3',
    title: 'Bộ sưu tập ảnh tư liệu: Bác Hồ với thiếu niên, nhi đồng',
    category: 'image',
    categoryLabel: 'Hình ảnh tư liệu',
    description: 'Chùm ảnh tư liệu quý ghi lại những khoảnh khắc ấm áp, giản dị và tình thương bao la của Bác Hồ dành cho các cháu học sinh.',
    fullContent: 'Sinh thời, Bác Hồ luôn dành cho thiếu niên, nhi đồng tình cảm yêu thương đặc biệt sâu sắc. Những bức ảnh tư liệu lịch sử lưu giữ hình ảnh Bác quàng khăn đỏ cho học sinh giỏi, Bác cùng múa hát với các cháu trong đêm Trung thu, hay hình ảnh Bác ân cần hỏi thăm việc ăn ở, học hành của các cháu nhỏ vùng chiến khu. Mỗi bức ảnh là một bài học sinh động về tình yêu thương con người và sự quan tâm của Người đối với thế hệ măng non đất nước.',
    authorOrSource: 'Bảo tàng Lịch sử Quốc gia & Bảo tàng Hồ Chí Minh',
    dateOrEra: 'Thời kỳ 1945 - 1969',
    thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    badgeText: 'Tư liệu ảnh quý',
    isMockData: false,
    tags: ['Thiếu nhi', 'Bác Hồ kính yêu', 'Khăn quàng đỏ', 'Tình thương']
  },
  {
    id: 'res-4',
    title: 'Phim tư liệu: "Hồ Chí Minh - Chân dung một con người" (Tài liệu học tập)',
    category: 'video',
    categoryLabel: 'Phim & Video tư liệu',
    description: 'Thước phim tư liệu nghệ thuật khái quát cuộc đời thanh bạch, đạo đức mẫu mực và tư tưởng văn hóa kiệt xuất của Chủ tịch Hồ Chí Minh.',
    fullContent: 'Bộ phim tư liệu khắc họa chân thực lối sống giản dị của Bác: bộ quần áo ka ki sờn vai, đôi dép cao su vạn dặm, ngôi nhà sàn đơn sơ giữa vườn cây ao cá Phủ Chủ tịch. Phim giúp các em học sinh THCS hiểu sâu sắc hơn vì sao bạn bè quốc tế ngợi ca Người là biểu tượng của tinh thần hòa bình, tự do và đức tính khiêm nhường tột bậc.',
    authorOrSource: 'Hãng phim Tài liệu và Khoa học Trung ương (Tư liệu học tập tham khảo)',
    dateOrEra: 'Thời lượng: 45 phút',
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80',
    badgeText: 'Nội dung minh họa số hóa',
    isMockData: true,
    tags: ['Phim tư liệu', 'Đạo đức Hồ Chí Minh', 'Lối sống giản dị', 'Nhà sàn Bác Hồ']
  },
  {
    id: 'res-8',
    title: 'Thước phim lịch sử: Ngày Bác Hồ rời Bến cảng Nhà Rồng năm 1911',
    category: 'video',
    categoryLabel: 'Phim & Video tư liệu',
    description: 'Tư liệu số hóa tái hiện bối cảnh lịch sử Sài Gòn đầu thế kỷ XX và quyết định mở đầu cuộc hành trình cứu nước cứu dân.',
    fullContent: 'Đoạn phim minh họa khoa học kết hợp hình ảnh tư liệu gốc tái hiện khung cảnh thương cảng Sài Gòn xưa, con tàu Amiral Latouche-Tréville và hình ảnh người thanh niên Văn Ba giàu nhiệt huyết yêu nước, dám nghĩ dám làm vì vận mệnh non sông.',
    authorOrSource: 'Bảo tàng Hồ Chí Minh - Chi nhánh TP. Hồ Chí Minh (Số hóa học đường)',
    dateOrEra: 'Thời lượng: 20 phút',
    thumbnail: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
    badgeText: 'Nội dung minh họa số hóa',
    isMockData: true,
    tags: ['Bến Nhà Rồng', '1911', 'Nguyễn Tất Thành', 'Sài Gòn - TP.HCM']
  }
];

// ------------------------------------------------------------------------------
// ĐỒNG BỘ KHO TƯ LIỆU SỐ HÓA TỪ SUPABASE CLOUD
// ------------------------------------------------------------------------------
export async function fetchResourcesFromSupabase(): Promise<ResourceItem[]> {
  try {
    if (!isSupabaseConfigured) return resourcesData;

    const { data } = await supabase
      .from('content_revisions')
      .select('id, title, data')
      .eq('item_id', 'a0000000-0000-0000-0000-000000000002')
      .eq('status', 'published')
      .maybeSingle();

    if (data?.data && Array.isArray((data.data as any).resources)) {
      const items = (data.data as any).resources as ResourceItem[];
      // Loại bỏ hoàn toàn các bài ghi âm mock và bài viết/sách mock sinh ra trong lúc làm giao diện
      return items.filter(
        (r) =>
          !r.id.startsWith('audio-') &&
          r.category !== 'audio' &&
          !MOCK_EXCLUDED_RESOURCE_IDS.has(r.id)
      );
    }
  } catch (err) {
    console.warn('[Supabase resources fetch warning]', err);
  }
  return resourcesData;
}
