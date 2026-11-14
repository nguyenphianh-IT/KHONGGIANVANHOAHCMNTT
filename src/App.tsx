import React, { useState, useEffect } from 'react';
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
import { RagChatbotModal } from './components/rag/RagChatbotModal';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import { BottomNav } from './components/BottomNav';
import { AuthModal } from './components/cms/AuthModal';
import { CmsDashboard } from './components/cms/CmsDashboard';

const MainLayout: React.FC = () => {
  const [isChatbotModalOpen, setIsChatbotModalOpen] = useState(false);
  const [isRagChatbotOpen, setIsRagChatbotOpen] = useState(false);
  const [ragInitialQuery, setRagInitialQuery] = useState<string | undefined>();
  const [ragContextDocTitle, setRagContextDocTitle] = useState<string | undefined>();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCmsDashboardOpen, setIsCmsDashboardOpen] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      const detail = e.detail || {};
      setRagInitialQuery(detail.initialQuery);
      setRagContextDocTitle(detail.documentTitle);
      setIsRagChatbotOpen(true);
    };
    window.addEventListener('open-rag-chatbot', handler);
    return () => window.removeEventListener('open-rag-chatbot', handler);
  }, []);

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
        onOpenChatbotPreview={() => setIsRagChatbotOpen(true)}
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

      {/* Trợ lý AI RAG Floating Button & Thông tin vận hành chính thức */}
      <ChatbotPreview
        isOpen={isChatbotModalOpen}
        onOpen={() => setIsRagChatbotOpen(true)}
        onClose={() => setIsChatbotModalOpen(false)}
        onOpenRagMvp={() => setIsRagChatbotOpen(true)}
      />

      {/* RAG Runtime MVP Interactive Chatbot Modal (ADR-002 Implementation Phase 01 & Phase 04) */}
      <RagChatbotModal
        isOpen={isRagChatbotOpen}
        initialQuery={ragInitialQuery}
        contextDocumentTitle={ragContextDocTitle}
        onClose={() => {
          setIsRagChatbotOpen(false);
          setRagInitialQuery(undefined);
          setRagContextDocTitle(undefined);
        }}
        onSwitchToPreviewRoadmap={() => {
          setIsRagChatbotOpen(false);
          setIsChatbotModalOpen(true);
        }}
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
