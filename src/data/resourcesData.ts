import { ResourceItem } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const resourcesData: ResourceItem[] = [
  {
    id: 'res-1',
    title: 'Toàn văn Tuyên ngôn Độc lập ngày 2/9/1945',
    category: 'article',
    categoryLabel: 'Văn kiện & Bài viết',
    description: 'Văn kiện lịch sử bất hủ khẳng định quyền con người, quyền độc lập tự do thiêng liêng của dân tộc Việt Nam trước toàn thế giới.',
    fullContent: 'Bản Tuyên ngôn Độc lập do Chủ tịch Hồ Chí Minh soạn thảo và công bố trước quốc dân đồng bào tại Quảng trường Ba Đình ngày 2 tháng 9 năm 1945 là một kiệt tác chính trị, pháp lý và văn hóa. Bác đã trích dẫn Tuyên ngôn Độc lập năm 1776 của nước Mỹ và Tuyên ngôn Nhân quyền và Dân quyền năm 1791 của Cách mạng Pháp để đặt nền móng lý luận vững chắc, từ quyền con người nâng lên thành quyền của mọi dân tộc: Tất cả các dân tộc trên thế giới đều sinh ra bình đẳng, dân tộc nào cũng có quyền sống, quyền sung sướng và quyền tự do.',
    authorOrSource: 'Tư liệu lịch sử Đảng - Lưu trữ quốc gia',
    dateOrEra: '02/09/1945',
    thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    badgeText: 'Tư liệu lịch sử gốc',
    isMockData: false,
    tags: ['Tuyên ngôn độc lập', 'Ba Đình', '1945', 'Lịch sử dân tộc']
  },
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
    id: 'res-5',
    title: 'Thư gửi học sinh nhân ngày khai trường đầu tiên của nước Việt Nam Dân chủ Cộng hòa',
    category: 'article',
    categoryLabel: 'Văn kiện & Bài viết',
    description: 'Bức thư lịch sử tháng 9/1945 với lời căn dặn thiêng liêng về non sông Việt Nam có sánh vai các cường quốc năm châu được hay không.',
    fullContent: 'Trong bức thư gửi các em học sinh nhân ngày khai trường đầu tiên của nước Việt Nam độc lập vào tháng 9 năm 1945, Bác viết: "Non sông Việt Nam có trở nên tươi đẹp hay không, dân tộc Việt Nam có bước tới đài vinh quang để sánh vai với các cường quốc năm châu được hay không, chính là nhờ một phần lớn ở công học tập của các em". Lời dạy ấy đã và đang là kim chỉ nam cho sự nghiệp đổi mới căn bản, toàn diện giáo dục đào tạo hôm nay.',
    authorOrSource: 'Hồ Chí Minh Toàn tập - Tập 4',
    dateOrEra: 'Tháng 9/1945',
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
    badgeText: 'Thư gửi học sinh',
    isMockData: false,
    tags: ['Thư khai trường', 'Học sinh', 'Sánh vai cường quốc', '1945']
  },
  {
    id: 'res-7',
    title: 'Tư liệu chuyên đề: Bác Hồ với miền Nam - Trái tim miền Nam luôn hướng về Bác',
    category: 'article',
    categoryLabel: 'Văn kiện & Bài viết',
    description: 'Khái quát tình cảm thiêng liêng "Miền Nam trong trái tim tôi" và khát vọng thống nhất non sông của Chủ tịch Hồ Chí Minh.',
    fullContent: 'Bác Hồ luôn dành cho đồng bào và chiến sĩ miền Nam ruột thịt tình cảm thương nhớ khôn nguôi. Bác từng nói: "Miền Nam yêu quý luôn luôn ở trong trái tim tôi", "Bác nhớ miền Nam nỗi nhớ nhà / Miền Nam mong Bác nỗi mong cha". Không gian văn hóa Hồ Chí Minh tại Phường Thới An, Thành phố Hồ Chí Minh càng có ý nghĩa sâu sắc khi nằm trên mảnh đất thành đồng Tổ quốc mang tên Người.',
    authorOrSource: 'Chuyên đề học tập - Chi bộ & Nhà trường THCS Nguyễn Trung Trực',
    dateOrEra: 'Tài liệu giáo dục chuyên đề',
    thumbnail: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80',
    badgeText: 'Chuyên đề giáo dục',
    isMockData: true,
    tags: ['Miền Nam ruột thịt', 'TP Hồ Chí Minh', 'Thới An', 'Truyền thống']
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
      // Loại bỏ hoàn toàn các bài ghi âm mock và sách mock res-2, res-6 sinh ra trong lúc làm giao diện
      return items.filter((r) => !r.id.startsWith('audio-') && r.category !== 'audio' && r.id !== 'res-2' && r.id !== 'res-6');
    }
  } catch (err) {
    console.warn('[Supabase resources fetch warning]', err);
  }
  return resourcesData;
}
