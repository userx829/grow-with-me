import React, { useEffect } from 'react';
import { useProjects } from '../context/ProjectContext';
import { X, Play, Clock, Eye, TrendingUp, CheckCircle, Quote, Sparkles } from 'lucide-react';

export const VideoModal: React.FC = () => {
  const { activeProjectModal, closeProjectModal } = useProjects();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeProjectModal();
    };
    if (activeProjectModal) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [activeProjectModal, closeProjectModal]);

  if (!activeProjectModal) return null;

  const project = activeProjectModal;

  // Determine embed or direct video source
  const getEmbedInfo = (url?: string): { type: 'embed' | 'direct' | 'none'; src: string; isBlob?: boolean } => {
    if (!url) return { type: 'none', src: '' };

    // YouTube Shorts: https://www.youtube.com/shorts/XYZ
    if (url.includes('youtube.com/shorts/')) {
      const match = url.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return { type: 'embed', src: `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0` };
      }
    }

    // YouTube Watch: https://www.youtube.com/watch?v=XYZ
    if (url.includes('youtube.com/watch')) {
      const match = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return { type: 'embed', src: `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0` };
      }
    }

    // YouTube Short link: https://youtu.be/XYZ
    if (url.includes('youtu.be/')) {
      const match = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return { type: 'embed', src: `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0` };
      }
    }

    // YouTube Embed link
    if (url.includes('youtube.com/embed/')) {
      return { type: 'embed', src: url.includes('?') ? url : `${url}?autoplay=1&rel=0` };
    }

    // Vimeo: https://vimeo.com/123456789
    if (url.includes('vimeo.com/')) {
      const match = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/);
      const vimeoId = match?.[3] || url.split('vimeo.com/')[1]?.split('?')[0]?.split('/')[0];
      if (vimeoId) {
        return { type: 'embed', src: `https://player.vimeo.com/video/${vimeoId}?autoplay=1` };
      }
    }

    // Google Drive Preview: https://drive.google.com/file/d/XYZ/view
    if (url.includes('drive.google.com/file/d/')) {
      const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return { type: 'embed', src: `https://drive.google.com/file/d/${match[1]}/preview` };
      }
    }

    // Local PC blob URL check
    if (url.startsWith('blob:')) {
      return { type: 'direct', src: url, isBlob: true };
    }

    // Direct MP4 / WebM / CDN link
    return { type: 'direct', src: url };
  };

  const embedInfo = getEmbedInfo(project.videoUrl);

  const pv = project.visibility;
  const showCategory = pv?.showCategoryBadge !== false;
  const showTitle = pv?.showTitle !== false;
  const showMetrics = pv?.showMetrics !== false;
  const showCaseStudy = pv?.showCaseStudy !== false;
  const showTechniques = pv?.showTechniques !== false;
  const showClientInfo = pv?.showClientInfo !== false;

  const isVertical = project.aspectRatio === '9:16' || project.category === 'shorts';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Background click listener */}
      <div className="absolute inset-0" onClick={closeProjectModal} />

      {/* Modal Dialog Card: adapts width for vertical shorts (max-w-2xl) vs horizontal (max-w-4xl) */}
      <div className={`relative w-full ${isVertical ? 'max-w-2xl' : 'max-w-4xl'} max-h-[92vh] bg-[#fafaf5] dark:bg-[#151715] rounded-3xl shadow-2xl border border-[#eeeee9] dark:border-[#2a302a] overflow-hidden flex flex-col z-10`}>
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#eeeee9] dark:border-[#2a302a] bg-[#fafaf5]/90 dark:bg-[#151715]/90 shrink-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {showCategory && (
              <span className="bg-[#2d5342]/10 dark:bg-[#528c70]/20 text-[#2d5342] dark:text-[#528c70] px-3 py-1 rounded-full text-xs font-semibold">
                {project.categoryLabel || project.category}
              </span>
            )}
            {isVertical && (
              <span className="bg-black/75 dark:bg-white/10 text-white px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide">
                9:16 Vertical
              </span>
            )}
            {showTitle && (
              <h3 className="text-base sm:text-lg font-bold text-[#1a1c19] dark:text-[#f1f1ec] truncate max-w-xs sm:max-w-md">
                {project.title}
              </h3>
            )}
          </div>

          <button
            onClick={closeProjectModal}
            className="w-9 h-9 rounded-full bg-[#eeeee9] dark:bg-[#2a302a] hover:bg-[#e2e3de] dark:hover:bg-[#333a33] text-[#1a1c19] dark:text-[#f1f1ec] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {/* Local blob alert notice */}
          {embedInfo.isBlob && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2.5">
              <span className="text-base leading-none">⚠️</span>
              <div>
                <p className="font-semibold">Local Computer File Warning</p>
                <p className="mt-0.5 text-amber-700 dark:text-amber-300">
                  This video was selected from your local PC. It plays for you in this browser, but <strong>clients and visitors on other phones or computers cannot access your hard drive</strong>. To let all website visitors watch this video, upload it to YouTube (set as Unlisted) or Vimeo and paste the link in the Admin Dashboard.
                </p>
              </div>
            </div>
          )}

          {/* Video Player Display Container: 9:16 vertical smartphone format vs 16:9 cinematic widescreen */}
          <div className={`relative rounded-2xl overflow-hidden bg-black shadow-lg border border-black/10 flex items-center justify-center ${
            isVertical
              ? 'aspect-[9/16] max-h-[64vh] sm:max-h-[68vh] w-auto mx-auto'
              : 'aspect-video w-full'
          }`}>
            {embedInfo.type === 'embed' ? (
              <iframe
                src={embedInfo.src}
                title={project.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : embedInfo.type === 'direct' && embedInfo.src ? (
              <video
                src={embedInfo.src}
                controls
                autoPlay
                className="w-full h-full object-contain"
                poster={project.thumbnailUrl}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div
                className="w-full h-full bg-cover bg-center flex items-center justify-center relative"
                style={{ backgroundImage: `url('${project.thumbnailUrl}')` }}
              >
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative text-center p-6 text-white flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-[#2d5342] flex items-center justify-center text-white shadow-xl">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                  {showTitle && <p className="font-semibold text-lg">{project.title}</p>}
                  <p className="text-xs text-white/80">Paste a YouTube or Vimeo link in the Admin Dashboard to enable playback</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Metrics Strip */}
          {showMetrics && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#f4f4ef] dark:bg-[#1c1f1c] p-3.5 rounded-xl border border-[#eeeee9] dark:border-[#2a302a] flex items-center gap-3">
                <Eye className="w-5 h-5 text-[#2d5342] dark:text-[#528c70] shrink-0" />
                <div>
                  <p className="text-[11px] text-[#414844] dark:text-[#b9c1ba]">Total Views</p>
                  <p className="text-sm font-bold text-[#1a1c19] dark:text-[#f1f1ec] tabular-nums">{project.views}</p>
                </div>
              </div>

              <div className="bg-[#f4f4ef] dark:bg-[#1c1f1c] p-3.5 rounded-xl border border-[#eeeee9] dark:border-[#2a302a] flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#2d5342] dark:text-[#528c70] shrink-0" />
                <div>
                  <p className="text-[11px] text-[#414844] dark:text-[#b9c1ba]">Video Length</p>
                  <p className="text-sm font-bold text-[#1a1c19] dark:text-[#f1f1ec] tabular-nums">{project.duration}</p>
                </div>
              </div>

              <div className="bg-[#f4f4ef] dark:bg-[#1c1f1c] p-3.5 rounded-xl border border-[#eeeee9] dark:border-[#2a302a] flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-[#875133] dark:text-[#feb692] shrink-0" />
                <div>
                  <p className="text-[11px] text-[#414844] dark:text-[#b9c1ba]">Retention Rate</p>
                  <p className="text-sm font-bold text-[#875133] dark:text-[#feb692] tabular-nums">
                    {project.retentionRate || '75%+'}
                  </p>
                </div>
              </div>

              <div className="bg-[#f4f4ef] dark:bg-[#1c1f1c] p-3.5 rounded-xl border border-[#eeeee9] dark:border-[#2a302a] flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#2d5342] dark:text-[#528c70] shrink-0" />
                <div>
                  <p className="text-[11px] text-[#414844] dark:text-[#b9c1ba]">Production Date</p>
                  <p className="text-sm font-bold text-[#1a1c19] dark:text-[#f1f1ec] tabular-nums">{project.publishedAt}</p>
                </div>
              </div>
            </div>
          )}

          {/* Narrative & Case Study Breakdown */}
          {showCaseStudy && (
            <div className="bg-[#f4f4ef] dark:bg-[#1c1f1c] p-6 rounded-2xl border border-[#eeeee9] dark:border-[#2a302a] space-y-4">
              <h4 className="text-base font-bold text-[#1a1c19] dark:text-[#f1f1ec]">
                The Editing Story &amp; Strategy
              </h4>
              <p className="text-sm text-[#414844] dark:text-[#b9c1ba] leading-relaxed">
                {project.caseStudyStory || project.summary}
              </p>

              {/* Techniques Bullet List */}
              {showTechniques && project.techniques && project.techniques.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec] mb-2 uppercase tracking-wider">
                    Techniques Applied
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {project.techniques.map((tech, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[#414844] dark:text-[#b9c1ba]">
                        <CheckCircle className="w-3.5 h-3.5 text-[#2d5342] dark:text-[#528c70] shrink-0" />
                        <span>{tech}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Client Testimonial if available */}
          {showClientInfo && project.clientTestimonial && (
            <div className="bg-[#fafaf5] dark:bg-[#151715] p-5 rounded-2xl border border-[#eeeee9] dark:border-[#2a302a] flex items-start gap-4">
              <Quote className="w-8 h-8 text-[#875133] dark:text-[#feb692] shrink-0 opacity-40" />
              <div>
                <p className="text-sm text-[#1a1c19] dark:text-[#f1f1ec] italic leading-relaxed">
                  &ldquo;{project.clientTestimonial}&rdquo;
                </p>
                <p className="text-xs font-semibold text-[#2d5342] dark:text-[#528c70] mt-2">
                  — {project.clientName || 'Partner Creator'}{project.clientRole ? `, ${project.clientRole}` : ''}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
