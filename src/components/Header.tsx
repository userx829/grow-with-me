import React, { useState, useEffect } from 'react';
import { useProjects } from '../context/ProjectContext';
import { Sun, Moon, Menu, X } from 'lucide-react';

type SectionId = 'home' | 'portfolio' | 'services' | 'about' | 'contact';

export const Header: React.FC = () => {
  const {
    theme,
    toggleTheme,
    currentView,
    setCurrentView,
    siteContent
  } = useProjects();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>('home');

  const isNavigatingRef = React.useRef(false);

  const rawNavItems: { id: SectionId; label: string; visible: boolean }[] = [
    { id: 'home', label: 'Home', visible: siteContent?.visibility?.showHeroSection !== false },
    { id: 'portfolio', label: 'My Work', visible: siteContent?.visibility?.showPortfolioSection !== false },
    { id: 'about', label: 'About', visible: siteContent?.visibility?.showAboutSection !== false },
    { id: 'services', label: 'Services', visible: siteContent?.visibility?.showServicesSection !== false },
    { id: 'contact', label: 'Contact', visible: siteContent?.visibility?.showContactSection !== false }
  ];

  const navItems = rawNavItems.filter(item => item.visible);

  // Scroll listener to update active section based on viewport scroll position
  useEffect(() => {
    if (currentView !== 'portfolio') return;

    const handleScroll = () => {
      if (isNavigatingRef.current) return;

      if (window.scrollY < 200) {
        setActiveSection('home');
        return;
      }

      // Check sections from bottom of page upwards
      const sections: SectionId[] = ['contact', 'services', 'about', 'portfolio'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 220 && rect.bottom >= 140) {
            setActiveSection(id);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  const scrollToTarget = (id: SectionId) => {
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -85; // accounts for 80px fixed header
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleNavClick = (id: SectionId) => {
    isNavigatingRef.current = true;
    setActiveSection(id);

    if (currentView === 'admin') {
      setCurrentView('portfolio');
      setTimeout(() => {
        scrollToTarget(id);
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 800);
      }, 100);
    } else {
      scrollToTarget(id);
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 800);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#fafaf5]/85 dark:bg-[#151715]/85 backdrop-blur-xl border-b border-[#eeeee9] dark:border-[#2a302a] transition-colors">
      <div className="h-20 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-left font-bold text-xl md:text-2xl text-[#2d5342] dark:text-[#528c70] tracking-tight whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity cursor-pointer"
        >
          {siteContent.brandName}
        </button>

        {/* Zone 2: Navigation Links with Green Hover & Active Indicators */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navItems.map(item => {
            const isActive = currentView === 'portfolio' && activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm px-4 py-2 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#2d5342] text-white dark:bg-[#3e725a] dark:text-white font-semibold shadow-sm'
                    : 'font-medium text-[#414844] dark:text-[#b9c1ba] hover:bg-[#2d5342]/12 dark:hover:bg-[#3e725a]/30 hover:text-[#2d5342] dark:hover:text-[#88d6ad]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Theme Toggle, Let's Work Together CTA, Admin/Profile Switcher) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Theme Toggle Button */}
          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-[#e8e8e3] dark:bg-[#2a302a] flex items-center justify-center text-[#1a1c19] dark:text-[#f1f1ec] hover:bg-[#e2e3de] dark:hover:bg-[#333a33] transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Moon className="w-5 h-5 text-amber-300" /> : <Sun className="w-5 h-5 text-amber-600" />}
          </button>

          {/* Primary CTA Button */}
          {siteContent?.visibility?.showNavbarContactButton !== false && siteContent?.visibility?.showContactSection !== false && (
            <button
              onClick={() => handleNavClick('contact')}
              className="hidden sm:inline-flex items-center justify-center bg-[#2d5342] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#456b59] transition-all shadow-[0_1px_8px_rgba(0,0,0,0.06)] active:scale-95 whitespace-nowrap cursor-pointer"
            >
              Let&apos;s Work Together
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden w-9 h-9 rounded-xl bg-[#e8e8e3] dark:bg-[#2a302a] flex items-center justify-center text-[#1a1c19] dark:text-[#f1f1ec] cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-6 py-4 bg-[#fafaf5] dark:bg-[#151715] border-b border-[#eeeee9] dark:border-[#2a302a] flex flex-col gap-1.5">
          {navItems.map(item => {
            const isActive = currentView === 'portfolio' && activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left text-sm py-2 px-3 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#2d5342] text-white dark:bg-[#3e725a] dark:text-white font-semibold'
                    : 'text-[#414844] dark:text-[#b9c1ba] hover:bg-[#2d5342]/12 hover:text-[#2d5342] dark:hover:bg-[#3e725a]/40 dark:hover:text-[#c5edd9] font-medium'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          {siteContent?.visibility?.showNavbarContactButton !== false && siteContent?.visibility?.showContactSection !== false && (
            <div className="pt-2 border-t border-[#eeeee9] dark:border-[#2a302a] flex flex-col gap-2">
              <button
                onClick={() => handleNavClick('contact')}
                className="w-full bg-[#2d5342] text-white py-2.5 rounded-full text-sm font-semibold text-center cursor-pointer"
              >
                Let&apos;s Work Together
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
