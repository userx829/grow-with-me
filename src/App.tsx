import React from 'react';
import { ProjectProvider, useProjects } from './context/ProjectContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PortfolioSection } from './components/PortfolioSection';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { ProcessSection } from './components/ProcessSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { VideoModal } from './components/VideoModal';
import { ServiceModal } from './components/ServiceModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLogin } from './components/admin/AdminLogin';

const MainContent: React.FC = () => {
  const { currentView, isAdminAuthenticated, siteContent } = useProjects();
  const visibility = siteContent.visibility;

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf5] dark:bg-[#151715] text-[#1a1c19] dark:text-[#f1f1ec] transition-colors">
      <Header />

      <main className="flex-1 w-full">
        {currentView === 'portfolio' ? (
          <>
            <div className="pt-20">
              {visibility?.showHeroSection !== false && (
                <div id="home">
                  <HeroSection />
                </div>
              )}
              {visibility?.showPortfolioSection !== false && <PortfolioSection />}
              {visibility?.showAboutSection !== false && <AboutSection />}
              {visibility?.showServicesSection !== false && <ServicesSection />}
              {visibility?.showWorkflowSection !== false && <ProcessSection />}
              {visibility?.showTestimonialsSection !== false && <TestimonialsSection />}
              {visibility?.showContactSection !== false && <ContactSection />}
            </div>
          </>
        ) : !isAdminAuthenticated ? (
          <AdminLogin />
        ) : (
          <AdminDashboard />
        )}
      </main>

      <Footer />
      <VideoModal />
      <ServiceModal />
    </div>
  );
};

export default function App() {
  return (
    <ProjectProvider>
      <MainContent />
    </ProjectProvider>
  );
}
