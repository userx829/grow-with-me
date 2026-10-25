import React, { Suspense, lazy } from 'react';
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

// Code-split heavy admin modules so regular visitors don't download admin dashboard code
const AdminDashboard = lazy(() =>
  import('./components/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard }))
);
const AdminLogin = lazy(() =>
  import('./components/admin/AdminLogin').then(m => ({ default: m.AdminLogin }))
);

const AdminLoadingFallback: React.FC = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
    <div className="w-10 h-10 border-3 border-[#2d5342]/20 border-t-[#2d5342] dark:border-[#528c70]/20 dark:border-t-[#528c70] rounded-full animate-spin mb-4" />
    <p className="text-xs font-semibold text-[#414844] dark:text-[#b9c1ba]">Loading Creator Studio...</p>
  </div>
);

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
        ) : (
          <Suspense fallback={<AdminLoadingFallback />}>
            {!isAdminAuthenticated ? <AdminLogin /> : <AdminDashboard />}
          </Suspense>
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
