import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Spotlight } from './components/Spotlight';
import { About } from './components/About';
import { Timeline } from './components/Timeline';
import { Resources } from './components/Resources';
import { LearningCorner } from './components/LearningCorner';
import { Activities } from './components/Activities';
import { ChatbotPreview } from './components/ChatbotPreview';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import { BottomNav } from './components/BottomNav';
import { AuthModal } from './components/cms/AuthModal';
import { CmsDashboard } from './components/cms/CmsDashboard';

const MainLayout: React.FC = () => {
  const [isChatbotModalOpen, setIsChatbotModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCmsDashboardOpen, setIsCmsDashboardOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-heritage-ivory-100 text-heritage-ink-900 selection:bg-heritage-red-100 selection:text-heritage-red-900">
      {/* Top Fixed Header */}
      <Header
        onOpenChatbotPreview={() => setIsChatbotModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenCmsDashboard={() => setIsCmsDashboardOpen(true)}
      />

      {/* Main Content Sections - pb-20 sm:pb-24 để không bị thanh BottomNav che khuất trên di động */}
      <main className="flex-grow pb-20 sm:pb-24 xl:pb-0">
        {/* 1. Hero Section */}
        <Hero
          onExplore={() => scrollToSection('spotlight')}
          onViewResources={() => scrollToSection('resources')}
        />

        {/* 2. Section Tiêu điểm: Tư liệu tiêu điểm, Tư liệu mới, Tư liệu đọc nhiều */}
        <Spotlight />

        {/* 3. Section: Chủ tịch Hồ Chí Minh & Dòng thời gian lịch sử */}
        <Timeline />

        {/* 4. Section: Kho tư liệu số hóa */}
        <Resources />

        {/* 5. Section: Góc học tập & rèn luyện THCS */}
        <LearningCorner />

        {/* 6. Section: Hoạt động phong trào nhà trường */}
        <Activities />

        {/* 7. Section: Giới thiệu không gian văn hóa số (Về cuối trang) */}
        <About />
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Quick Bottom Navigation Bar */}
      <BottomNav onNavClick={scrollToSection} />

      {/* Modal Đăng nhập / Chuyển đổi vai trò Sandbox */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={() => setIsCmsDashboardOpen(true)}
      />

      {/* Bảng điều khiển Quản trị CMS & Duyệt bài 4 mắt */}
      <CmsDashboard
        isOpen={isCmsDashboardOpen}
        onClose={() => setIsCmsDashboardOpen(false)}
      />

      {/* Future Chatbot Roadmap Float & Modal */}
      <ChatbotPreview
        isOpen={isChatbotModalOpen}
        onOpen={() => setIsChatbotModalOpen(true)}
        onClose={() => setIsChatbotModalOpen(false)}
      />

      {/* Back to top button */}
      <BackToTop />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

export default App;
