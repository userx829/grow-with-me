import React, { useState, useRef } from 'react';
import { useProjects } from '../context/ProjectContext';
import { ArrowRight, Play, Volume2, VolumeX, Maximize2, Sparkles, Radio } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { projects, openProjectModal, siteContent } = useProjects();
  const { hero, visibility: v } = siteContent;

  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

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
  const isAutoplayEnabled = v?.heroVideoAutoplay !== false;

  // Determine embed or direct video source for automatic playback
  const getAutoplayInfo = (url?: string) => {
    if (!url) return null;

    // YouTube Shorts: https://www.youtube.com/shorts/XYZ
    if (url.includes('youtube.com/shorts/')) {
      const match = url.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        const id = match[1];
        return {
          type: 'youtube' as const,
          id,
          src: `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=1&playsinline=1&rel=0&modestbranding=1`
        };
      }
    }

    // YouTube Watch: https://www.youtube.com/watch?v=XYZ
    if (url.includes('youtube.com/watch')) {
      const match = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        const id = match[1];
        return {
          type: 'youtube' as const,
          id,
          src: `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=1&playsinline=1&rel=0&modestbranding=1`
        };
      }
    }

    // YouTube Short link: https://youtu.be/XYZ
    if (url.includes('youtu.be/')) {
      const match = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        const id = match[1];
        return {
          type: 'youtube' as const,
          id,
          src: `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=1&playsinline=1&rel=0&modestbranding=1`
        };
      }
    }

    // YouTube Embed link
    if (url.includes('youtube.com/embed/')) {
      const match = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
      const id = match ? match[1].split('?')[0] : '';
      const playlistParam = id ? `&playlist=${id}` : '';
      return {
        type: 'youtube' as const,
        id,
        src: `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1${playlistParam}&controls=1&playsinline=1&rel=0&modestbranding=1`
      };
    }

    // Vimeo: https://vimeo.com/123456789
    if (url.includes('vimeo.com/')) {
      const match = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/);
      const vimeoId = match?.[3] || url.split('vimeo.com/')[1]?.split('?')[0]?.split('/')[0];
      if (vimeoId) {
        return {
          type: 'vimeo' as const,
          id: vimeoId,
          src: `https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1&playsinline=1&autopause=0`
        };
      }
    }

    // Direct MP4 / WebM / Blob
    return {
      type: 'direct' as const,
      src: url
    };
  };

  const autoplayInfo = isAutoplayEnabled ? getAutoplayInfo(featuredProject?.videoUrl) : null;

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (autoplayInfo?.type === 'direct' && videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    } else if (featuredProject) {
      openProjectModal(featuredProject);
    }
  };

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

        {/* Right Column: Featured Showreel Automatic Video Player */}
        {showFeaturedCard && (
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-[0_16px_50px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.45)] bg-black border border-[#eeeee9] dark:border-[#2a302a] group">
              {/* Autoplay Video or Interactive Fallback */}
              <div className="relative w-full h-[360px] sm:h-[440px] bg-black overflow-hidden flex items-center justify-center">
                {autoplayInfo ? (
                  autoplayInfo.type === 'youtube' || autoplayInfo.type === 'vimeo' ? (
                    <iframe
                      src={autoplayInfo.src}
                      title={featuredProject?.title || 'Featured Showreel'}
                      className="w-full h-full border-0 scale-[1.01]"
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      ref={videoRef}
                      src={autoplayInfo.src}
                      autoPlay
                      muted={isMuted}
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                      poster={featuredProject?.thumbnailUrl}
                    />
                  )
                ) : (
                  <img
                    src={featuredProject?.thumbnailUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwVJjH9g1rAOEQ45Hq8BSnC1X0iyuhhR8sgcJUil0bOX0sJxH63zDwB7k3bWY95-WC1eQf4zdWwFevPb_982NjNeh3SmRryjui8vKuM2NlPzRjm57HrHq_NYmZNvP_yRJGylDzHhEYlO7KWV34OeUBG0uE5shXuUZUqSCSwYax4LIZ3rrvPOizv2ZiFhRi6o1wqFyihDgbOq1CNLzo3950gTJ-ClbdHuNqbiHMdivWMNoDUCj0OHO0'}
                    alt={featuredProject?.title || 'Showreel Preview'}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}

                {/* Floating Top Header Badges (Live Indicator & Sound/Expand Control) */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
                  <div className="flex items-center gap-2 pointer-events-auto">
                    <span className="inline-flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-semibold text-white shadow-lg border border-white/10">
                      <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      <span>{isAutoplayEnabled ? 'Auto-Playing' : 'Showreel'}</span>
                    </span>
                    <span className="hidden sm:inline-block bg-[#fafaf5]/90 dark:bg-[#151715]/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                      {featuredProject?.categoryLabel || 'SELECTED WORK'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pointer-events-auto">
                    {autoplayInfo?.type === 'direct' ? (
                      <button
                        onClick={toggleSound}
                        className="bg-black/75 hover:bg-black/90 text-white p-2 rounded-full backdrop-blur-md shadow-lg transition-transform active:scale-95 cursor-pointer border border-white/10"
                        title={isMuted ? 'Click to Unmute' : 'Mute Video'}
                        aria-label="Toggle sound"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-amber-300" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                      </button>
                    ) : (
                      <button
                        onClick={() => featuredProject && openProjectModal(featuredProject)}
                        className="bg-black/75 hover:bg-[#2d5342] text-white px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg transition-all text-xs font-medium flex items-center gap-1.5 cursor-pointer border border-white/10"
                        title="Watch full video with sound and narrative"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="hidden sm:inline">Audio &amp; Story</span>
                      </button>
                    )}

                    <button
                      onClick={() => featuredProject && openProjectModal(featuredProject)}
                      className="bg-black/75 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md shadow-lg transition-transform active:scale-95 cursor-pointer border border-white/10"
                      title="Expand to Fullscreen Case Study"
                      aria-label="Expand video modal"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Floating Bottom Card Banner */}
                <div
                  onClick={() => featuredProject && openProjectModal(featuredProject)}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-5 sm:p-6 flex items-end justify-between gap-4 cursor-pointer z-20 group-hover:from-black/100 transition-colors"
                >
                  <div className="text-white">
                    {featuredProject?.visibility?.showTitle !== false && (
                      <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug flex items-center gap-2">
                        <span>{featuredProject?.title || 'The Art of Visual Storytelling'}</span>
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                      </h3>
                    )}
                    {featuredProject?.visibility?.showSubtitle !== false && (
                      <p className="text-xs text-white/80 mt-1 line-clamp-1">
                        {featuredProject?.subtitle || 'Reel & Showreel Highlights'} • {featuredProject?.views || '2.5M+'} Views
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:inline-block text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-full">
                      View Story
                    </span>
                    <div className="w-10 h-10 rounded-full bg-[#2d5342] hover:bg-[#3e725a] text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 ring-2 ring-white/20">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>
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
