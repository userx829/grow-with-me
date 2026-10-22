import React from 'react';
import { useProjects } from '../context/ProjectContext';
import { ArrowRight, Play, Bookmark } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { projects, openProjectModal, siteContent } = useProjects();
  const { hero, visibility: v } = siteContent;

  // Find the featured project (showreel) or default to the first one
  const featuredProject = projects.find(p => p.featured) || projects[0];

  const scrollToPortfolio = () => {
    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (v?.showHeroSection === false) {
    return null;
  }

  const showFeaturedCard = v?.showHeroFeaturedCard !== false;

  return (
    <section className="relative px-6 lg:px-12 pt-8 md:pt-14 pb-20 md:pb-24 overflow-hidden">
      {/* Soft ambient background glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#c2ecd5]/25 dark:bg-[#2a4b3b]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        {/* Left Column: Typography & CTAs */}
        <div className={`${showFeaturedCard ? 'lg:col-span-7' : 'lg:col-span-12 max-w-3xl'} flex flex-col items-start gap-6 z-10`}>
          {/* Badge */}
          {v?.showHeroBadge !== false && (
            <div className="inline-flex items-center gap-2.5 bg-[#e8e8e3] dark:bg-[#2a302a] px-3.5 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#2d5342] dark:bg-[#528c70] animate-pulse" />
              <span className="text-xs font-semibold tracking-wider uppercase text-[#414844] dark:text-[#b9c1ba]">
                {hero.badge}
              </span>
            </div>
          )}

          {/* Main Headline */}
          {v?.showHeroHeadline !== false && (
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-[#1a1c19] dark:text-[#f1f1ec] tracking-tight leading-[1.12]">
              {hero.headline}
            </h1>
          )}

          {/* Subtitle */}
          {v?.showHeroSubtitle !== false && (
            <p className="text-base sm:text-lg text-[#414844] dark:text-[#b9c1ba] max-w-xl leading-relaxed">
              {hero.subtitle}
            </p>
          )}

          {/* Action Buttons */}
          {v?.showHeroCtaButtons !== false && (
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={scrollToPortfolio}
                className="bg-[#2d5342] text-white px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-[#456b59] transition-all shadow-[0_4px_20px_rgba(45,83,66,0.18)] flex items-center gap-2 group active:scale-95 cursor-pointer"
              >
                <span>{hero.ctaPrimaryText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={scrollToContact}
                className="bg-[#e8e8e3] dark:bg-[#2a302a] text-[#1a1c19] dark:text-[#f1f1ec] px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-[#e2e3de] dark:hover:bg-[#333a33] transition-all active:scale-95 cursor-pointer"
              >
                {hero.ctaSecondaryText}
              </button>
            </div>
          )}

          {/* Key Metrics */}
          {v?.showHeroStats !== false && (
            <div className="grid grid-cols-3 gap-6 sm:gap-10 pt-6 w-full max-w-lg border-t border-[#eeeee9] dark:border-[#2a302a]">
              {hero.stats.map((stat, idx) => (
                <div key={idx}>
                  <div className="text-3xl sm:text-4xl font-bold text-[#2d5342] dark:text-[#528c70] tracking-tight tabular-nums">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-[#414844] dark:text-[#b9c1ba] mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Featured Showreel Interactive Card */}
        {showFeaturedCard && (
          <div className="lg:col-span-5 relative">
            <div
              onClick={() => featuredProject && openProjectModal(featuredProject)}
              className="relative rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.3)] bg-[#f4f4ef] dark:bg-[#1c1f1c] group cursor-pointer border border-[#eeeee9] dark:border-[#2a302a]"
            >
              {/* Thumbnail Image with zoom on hover */}
              <div
                className="w-full h-[360px] sm:h-[420px] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url('${featuredProject?.thumbnailUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwVJjH9g1rAOEQ45Hq8BSnC1X0iyuhhR8sgcJUil0bOX0sJxH63zDwB7k3bWY95-WC1eQf4zdWwFevPb_982NjNeh3SmRryjui8vKuM2NlPzRjm57HrHq_NYmZNvP_yRJGylDzHhEYlO7KWV34OeUBG0uE5shXuUZUqSCSwYax4LIZ3rrvPOizv2ZiFhRi6o1wqFyihDgbOq1CNLzo3950gTJ-ClbdHuNqbiHMdivWMNoDUCj0OHO0'}')`,
                  backgroundColor: '#2d5342'
                }}
              />

              {/* Gradient Scrim & Overlay Elements */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 flex flex-col justify-between p-6 sm:p-7">
                {/* Card Header Pill & Bookmark */}
                <div className="flex justify-between items-center">
                  <span className="bg-[#fafaf5]/90 dark:bg-[#151715]/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec] shadow-sm">
                    {featuredProject?.categoryLabel || 'SELECTED WORK / 2026'}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/90">
                    <Bookmark className="w-4 h-4 fill-white/80" />
                  </div>
                </div>

                {/* Card Footer with Title and Play Button */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    {featuredProject?.visibility?.showTitle !== false && (
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                        {featuredProject?.title || 'The Art of Visual Storytelling'}
                      </h3>
                    )}
                    {featuredProject?.visibility?.showSubtitle !== false && (
                      <p className="text-xs sm:text-sm text-white/80 mt-1">
                        {featuredProject?.subtitle || 'Reel & Showreel Highlights'}
                      </p>
                    )}
                  </div>

                  {/* Pulsing Play Button */}
                  <div className="w-14 h-14 rounded-full bg-[#2d5342] text-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 shrink-0 ring-4 ring-white/20">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
