import React from 'react';
import { Target, Laptop, HeartHandshake, BookMarked, Landmark } from 'lucide-react';
import { UncleHoQuotes } from './UncleHoQuotes';

export const About: React.FC = () => {
  const pillars = [
    {
      icon: Target,
      title: 'Mục Đích Xây Dựng',
      desc: 'Hiện thực hóa chủ trương xây dựng Không gian văn hóa Hồ Chí Minh của Đảng bộ TP.HCM, đưa tư tưởng, đạo đức, phong cách của Bác thấm sâu vào nếp sống của mỗi cán bộ, giáo viên và học sinh trường THCS Nguyễn Trung Trực.',
    },
    {
      icon: Laptop,
      title: 'Chuyển Đổi Số Giáo Dục',
      desc: 'Ứng dụng nền tảng số hóa để lưu trữ, truyền tải tư liệu lịch sử một cách trực quan, sinh động; giúp các em học sinh THCS dễ dàng tiếp cận mọi lúc, mọi nơi trên máy tính hay điện thoại thông minh.',
    },
    {
      icon: BookMarked,
      title: 'Đổi Mới Dạy Và Học',
      desc: 'Cung cấp nguồn học liệu tin cậy cho các tiết học Lịch sử, Ngữ văn, Giáo dục công dân và hoạt động ngoài giờ lên lớp; nâng cao chất lượng giáo dục toàn diện của nhà trường.',
    },
    {
      icon: HeartHandshake,
      title: 'Gắn Kết Cộng Đồng',
      desc: 'Tạo cầu nối văn hóa giữa nhà trường, cha mẹ học sinh và nhân dân phường Thới An; cùng chung tay nuôi dưỡng thế hệ tương lai giàu lý tưởng, trung thực và trách nhiệm.',
    },
  ];

  return (
    <section id="about" className="py-8 sm:py-10 md:py-12 bg-heritage-ivory-100 border-b border-heritage-ivory-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-4xl lg:max-w-5xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-wider text-heritage-red-700 font-bold bg-heritage-red-50 px-3 py-1 rounded-full border border-heritage-red-200 mb-3">
            <Landmark className="w-3.5 h-3.5 text-heritage-red-700" />
            <span>Về Không Gian Văn Hóa Số</span>
          </div>
          <h2 className="font-serif text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-heritage-ink-900 tracking-tight leading-snug">
            Nền Tảng Giáo Dục Truyền Thống Trong Kỷ Nguyên Số
          </h2>
          <div className="w-16 h-1 bg-heritage-gold-400 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-base sm:text-lg text-heritage-ink-700 leading-relaxed">
            Dự án “KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH – TRƯỜNG THCS NGUYỄN TRUNG TRỰC” (phường Thới An)
            được xây dựng với tâm nguyện kiến tạo một môi trường giáo dục truyền thống lành mạnh, hiện đại và sâu sắc.
          </p>
        </div>

        {/* 4 Feature Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-heritage-ivory-300 shadow-heritage hover:shadow-heritage-hover hover:border-heritage-gold-400/60 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-heritage-red-50 text-heritage-red-700 border border-heritage-red-200 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-heritage-ink-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-heritage-ink-700 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-heritage-ivory-200 text-xs font-semibold text-heritage-red-700 flex items-center justify-between">
                  <span>Trụ cột 0{index + 1}</span>
                  <span className="text-heritage-gold-500 font-serif">THCS Nguyễn Trung Trực</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Uncle Ho's Teachings & Quotes Box */}
        <div className="mt-14">
          <UncleHoQuotes />
        </div>
      </div>
    </section>
  );
};
