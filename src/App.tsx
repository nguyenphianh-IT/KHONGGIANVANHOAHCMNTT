import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Timeline } from './components/Timeline';
import { Resources } from './components/Resources';
import { LearningCorner } from './components/LearningCorner';
import { Activities } from './components/Activities';
import { ChatbotPreview } from './components/ChatbotPreview';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';

export const App: React.FC = () => {
  const [isChatbotModalOpen, setIsChatbotModalOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-heritage-ivory-100 text-heritage-ink-900 selection:bg-heritage-red-100 selection:text-heritage-red-900">
      {/* Top Fixed Header */}
      <Header onOpenChatbotPreview={() => setIsChatbotModalOpen(true)} />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero
          onExplore={() => scrollToSection('about')}
          onViewResources={() => scrollToSection('resources')}
        />

        {/* Section: Giới thiệu không gian văn hóa số */}
        <About />

        {/* Section: Chủ tịch Hồ Chí Minh & Dòng thời gian lịch sử */}
        <Timeline />

        {/* Section: Kho tư liệu số hóa */}
        <Resources />

        {/* Section: Góc học tập & rèn luyện THCS */}
        <LearningCorner />

        {/* Section: Hoạt động phong trào nhà trường */}
        <Activities />
      </main>

      {/* Footer */}
      <Footer />

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

export default App;
