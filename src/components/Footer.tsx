import React from 'react';
import { useProjects } from '../context/ProjectContext';
import { Share2, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, siteContent } = useProjects();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${siteContent.brandName} - Video Editor Portfolio`,
          text: `Check out the video editing portfolio of ${siteContent.brandName}, creative partner for high-retention video narratives.`,
          url: window.location.href
        });
      } catch {
        // user cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Portfolio link copied to clipboard!');
    }
  };

  return (
    <footer className="w-full bg-[#f4f4ef] dark:bg-[#151715] py-10 border-t border-[#eeeee9] dark:border-[#2a302a] transition-colors">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        {siteContent?.visibility?.showFooterBrand !== false && (
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setCurrentView('portfolio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-lg font-bold text-[#2d5342] dark:text-[#528c70] tracking-tight hover:opacity-90 transition-opacity"
            >
              {siteContent.brandName}
            </button>
          </div>
        )}

        {/* Copyright */}
        <p className="text-xs text-[#414844] dark:text-[#b9c1ba]">
          &copy; {new Date().getFullYear()} {siteContent.brandName || 'Grow With Ayush'}. All rights reserved.
        </p>

        {/* Social / Direct Channels */}
        {siteContent?.visibility?.showFooterSocials !== false && (
          <div className="flex items-center gap-4 text-[#414844] dark:text-[#b9c1ba]">
            <button
              onClick={handleShare}
              aria-label="Share Portfolio"
              className="hover:text-[#1a1c19] dark:hover:text-white transition-colors p-1 cursor-pointer"
              title="Share Portfolio"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <a
              href={`mailto:${siteContent.contact?.contactEmail || 'contact@growwithayush.com'}`}
              aria-label="Email Ayush"
              className="hover:text-[#1a1c19] dark:hover:text-white transition-colors p-1"
              title="Email Ayush"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </footer>
  );
};
