import React, { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { ProjectCategory, ProjectItem } from '../types';
import { ArrowRight, Play, Eye } from 'lucide-react';

export const PortfolioSection: React.FC = () => {
  const { projects, openProjectModal, siteContent } = useProjects();
  const v = siteContent.visibility;
  const [activeFilter, setActiveFilter] = useState<'all' | ProjectCategory>('all');

  if (v?.showPortfolioSection === false) {
    return null;
  }

  const filterTabs: { id: 'all' | ProjectCategory; label: string }[] = [
    { id: 'all', label: 'All Work' },
    { id: 'youtube', label: 'YouTube' },
    { id: 'shorts', label: 'Shorts & Reels' },
    { id: 'cinematic', label: 'Cinematic' },
    { id: 'ads', label: 'Ads & Brand Films' }
  ];

  const publishedProjects = projects.filter(p => p.visibility?.isPublished !== false);

  const filteredProjects = publishedProjects.filter(project => {
    if (activeFilter === 'all') return true;
    return project.category === activeFilter;
  });

  const showHeader = v?.showPortfolioKicker !== false || v?.showPortfolioTitle !== false || v?.showPortfolioFilters !== false;

  return (
    <section id="portfolio" className="px-6 lg:px-12 py-20 md:py-24 bg-[#f4f4ef] dark:bg-[#1c1f1c] transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col gap-10 md:gap-12">
        {/* Section Header & Filter Tabs */}
        {showHeader && (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            {(v?.showPortfolioKicker !== false || v?.showPortfolioTitle !== false) && (
              <div>
                {v?.showPortfolioKicker !== false && (
                  <span className="text-xs font-semibold tracking-wider uppercase text-[#2d5342] dark:text-[#528c70] mb-2 block">
                    PORTFOLIO
                  </span>
                )}
                {v?.showPortfolioTitle !== false && (
                  <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1c19] dark:text-[#f1f1ec] tracking-tight">
                    A Few Things I&apos;ve Created
                  </h2>
                )}
              </div>
            )}

            {/* Interactive Filter Tabs */}
            {v?.showPortfolioFilters !== false && (
              <div className="flex flex-wrap items-center gap-1.5 bg-[#fafaf5] dark:bg-[#151715] p-1.5 rounded-none shadow-sm border border-[#eeeee9] dark:border-[#2a302a] max-w-full overflow-x-auto">
                {filterTabs.map(tab => {
                  const isActive = activeFilter === tab.id;
                  const count = tab.id === 'all'
                    ? publishedProjects.length
                    : publishedProjects.filter(p => p.category === tab.id).length;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveFilter(tab.id)}
                      className={`px-4 py-2 rounded-none text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? 'bg-[#2d5342] text-white shadow-sm'
                          : 'text-[#414844] dark:text-[#b9c1ba] hover:text-[#1a1c19] dark:hover:text-white hover:bg-[#eeeee9] dark:hover:bg-[#232723]'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-none tabular-nums ${
                        isActive ? 'bg-white/20 text-white' : 'bg-[#e8e8e3] dark:bg-[#2a302a] text-[#414844] dark:text-[#b9c1ba]'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Project Grid */}
        {filteredProjects.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-[#151715] rounded-3xl p-8 border border-[#eeeee9] dark:border-[#2a302a]">
            <p className="text-base font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">No projects found in this category</p>
            <p className="text-sm text-[#414844] dark:text-[#b9c1ba] mt-1">Try switching categories or add new videos in the Admin Dashboard.</p>
            <button
              onClick={() => setActiveFilter('all')}
              className="mt-4 px-5 py-2 bg-[#2d5342] text-white text-xs font-semibold rounded-full cursor-pointer"
            >
              View All Work
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            {filteredProjects.map((project: ProjectItem) => {
              const pv = project.visibility;
              const isVertical = project.aspectRatio === '9:16' || project.category === 'shorts';
              const showTitle = pv?.showTitle !== false;
              const showSummary = pv?.showSummary !== false;
              const showCategory = pv?.showCategoryBadge !== false;
              const showMetrics = pv?.showMetrics !== false;
              const showWatchButton = v?.showPortfolioWatchButton !== false && pv?.showWatchButton !== false;
              const watchButtonText = v?.portfolioWatchButtonText || 'Watch Video';
              const hasHeaderContent = showTitle || showSummary;
              const hasFooterContent = showMetrics || showWatchButton;

              return (
                <div
                  key={project.id}
                  onClick={() => openProjectModal(project)}
                  className="bg-[#fafaf5] dark:bg-[#151715] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col border border-[#eeeee9] dark:border-[#2a302a] cursor-pointer hover:-translate-y-1"
                >
                  {/* Thumbnail Container: dynamically 16:9 for long-form horizontal, 9:16 for vertical shorts */}
                  <div className={`relative overflow-hidden w-full ${isVertical ? 'aspect-[9/16] max-h-[520px]' : 'aspect-video'} bg-[#2d5342]/10 dark:bg-[#2a302a]`}>
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{
                        backgroundImage: `url('${project.thumbnailUrl}')`,
                        backgroundColor: '#2d5342'
                      }}
                    />

                    {/* Dark hover overlay with play icon */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 dark:bg-[#151715]/90 text-[#1a1c19] dark:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Category Pill & 9:16 Vertical indicator */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                      {showCategory && (
                        <span className="bg-[#fafaf5]/90 dark:bg-[#151715]/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold text-[#2d5342] dark:text-[#528c70] shadow-sm">
                          {project.categoryLabel || project.category}
                        </span>
                      )}
                      {isVertical && (
                        <span className="bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-semibold text-white/90 shadow-sm">
                          9:16 Vertical
                        </span>
                      )}
                    </div>

                    {/* Retention Badge if present and metrics enabled */}
                    {showMetrics && project.retentionRate && (
                      <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-medium text-white/90">
                        {project.retentionRate} Retention
                      </span>
                    )}
                  </div>

                  {/* Card Content Body - cleanly omitted if everything hidden */}
                  {(hasHeaderContent || hasFooterContent) && (
                    <div className="p-6 flex flex-col flex-grow justify-between gap-4">
                      {hasHeaderContent && (
                        <div>
                          {showTitle && (
                            <h3 className="text-lg sm:text-xl font-bold text-[#1a1c19] dark:text-[#f1f1ec] mb-1.5 group-hover:text-[#2d5342] dark:group-hover:text-[#528c70] transition-colors leading-snug">
                              {project.title}
                            </h3>
                          )}
                          {showSummary && (
                            <p className="text-xs sm:text-sm text-[#414844] dark:text-[#b9c1ba] line-clamp-2 leading-relaxed">
                              {project.summary}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Card Footer */}
                      {hasFooterContent && (
                        <div className="flex items-center justify-between pt-3.5 border-t border-[#eeeee9] dark:border-[#2a302a] text-xs">
                          {showMetrics ? (
                            <span className="text-[#414844] dark:text-[#b9c1ba] font-medium tabular-nums flex items-center gap-1.5">
                              <Eye className="w-3.5 h-3.5 text-[#2d5342] dark:text-[#528c70]" />
                              {project.views} Views • {project.duration}
                            </span>
                          ) : (
                            <span />
                          )}

                          {showWatchButton && (
                            <span className="font-semibold text-[#2d5342] dark:text-[#528c70] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                              {watchButtonText}
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
