import React from 'react';
import { useProjects } from '../context/ProjectContext';

export const AboutSection: React.FC = () => {
  const { siteContent } = useProjects();
  const { about, visibility: v } = siteContent;

  if (v?.showAboutSection === false) {
    return null;
  }

  const showImageColumn = v?.showAboutImage !== false || v?.showAboutQuote !== false;

  return (
    <section id="about" className="px-6 lg:px-12 py-20 md:py-24 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Studio Portrait & Quote Badge */}
        {showImageColumn && (
          <div className="lg:col-span-5 relative">
            {v?.showAboutImage !== false && (
              <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/5] bg-[#e8e8e3] dark:bg-[#2a302a] border border-[#eeeee9] dark:border-[#2a302a]">
                <img
                  src={about.imageUrl}
                  alt="Professional portrait of Ayush in a modern creative editing studio"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            {/* Floating Quote Card */}
            {v?.showAboutQuote !== false && (
              <div className="absolute -bottom-6 -right-2 sm:-right-6 bg-[#2d5342] text-white p-6 rounded-2xl shadow-xl max-w-xs border border-white/10">
                <div className="text-base sm:text-lg font-semibold leading-snug mb-1.5">
                  &ldquo;{about.quoteText}&rdquo;
                </div>
                <div className="text-xs text-white/80 font-medium">
                  {about.quoteAuthor}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Right Column: Bio Prose & Milestones */}
        <div className={`${showImageColumn ? 'lg:col-span-7' : 'lg:col-span-12 max-w-3xl mx-auto'} flex flex-col gap-6 pt-6 lg:pt-0`}>
          {(v?.showAboutKicker !== false || v?.showAboutTitle !== false) && (
            <div>
              {v?.showAboutKicker !== false && (
                <span className="text-xs font-semibold tracking-wider uppercase text-[#2d5342] dark:text-[#528c70] mb-2 block">
                  {about.kicker}
                </span>
              )}
              {v?.showAboutTitle !== false && (
                <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1c19] dark:text-[#f1f1ec] tracking-tight">
                  {about.title}
                </h2>
              )}
            </div>
          )}

          {v?.showAboutBio !== false && (
            <>
              <p className="text-base sm:text-lg text-[#414844] dark:text-[#b9c1ba] leading-relaxed">
                {about.bioParagraph1}
              </p>

              <p className="text-sm sm:text-base text-[#414844] dark:text-[#b9c1ba] leading-relaxed">
                {about.bioParagraph2}
              </p>
            </>
          )}

          {/* Experience Grid */}
          {v?.showAboutStats !== false && (
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-4">
              {about.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-[#f4f4ef] dark:bg-[#1c1f1c] p-5 sm:p-6 rounded-2xl border border-[#eeeee9] dark:border-[#2a302a]"
                >
                  <div className="text-2xl sm:text-3xl font-bold text-[#2d5342] dark:text-[#528c70] mb-1 tabular-nums">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-[#414844] dark:text-[#b9c1ba]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
