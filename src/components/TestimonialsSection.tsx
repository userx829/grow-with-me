import React from 'react';
import { useProjects } from '../context/ProjectContext';
import { Star } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { siteContent } = useProjects();
  const v = siteContent.visibility;

  if (v?.showTestimonialsSection === false) {
    return null;
  }

  const testimonials = [
    {
      id: 'julian',
      quote: "Ayush completely transformed my channel's retention. His edits are crisp, creative, and delivered on time every single week.",
      name: 'Julian Drake',
      role: 'Tech YouTuber (450K Subs)',
      initials: 'JD',
      badgeColor: 'bg-[#456b59] text-white dark:bg-[#2a4b3b] dark:text-[#c5edd9]'
    },
    {
      id: 'sophia',
      quote: "Working with Ayush on our brand film was effortless. He understood our aesthetic immediately and elevated our commercial storytelling.",
      name: 'Sophia Martinez',
      role: 'Creative Director, Lumina',
      initials: 'SM',
      badgeColor: 'bg-[#feb692] text-[#794529] dark:bg-[#5a2e18] dark:text-[#ffdbcb]'
    },
    {
      id: 'alex',
      quote: "The shorts Ayush edited went viral within 48 hours. Our follower count doubled in a month. Absolute game-changer!",
      name: 'Alex Rivers',
      role: 'Fitness Creator',
      initials: 'AR',
      badgeColor: 'bg-[#456b59] text-white dark:bg-[#2a4b3b] dark:text-[#c5edd9]'
    }
  ];

  const showHeader = v?.showTestimonialsKicker !== false || v?.showTestimonialsTitle !== false || v?.showTestimonialsSubtitle !== false;

  return (
    <section className="px-6 lg:px-12 py-20 md:py-24 bg-[#f4f4ef] dark:bg-[#1c1f1c] transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Section Header */}
        {showHeader && (
          <div className="text-center max-w-2xl mx-auto">
            {v?.showTestimonialsKicker !== false && (
              <span className="text-xs font-semibold tracking-wider uppercase text-[#2d5342] dark:text-[#528c70] mb-2 block">
                TESTIMONIALS
              </span>
            )}
            {v?.showTestimonialsTitle !== false && (
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1c19] dark:text-[#f1f1ec] mb-3 tracking-tight">
                Trusted by Top Creators
              </h2>
            )}
            {v?.showTestimonialsSubtitle !== false && (
              <p className="text-sm sm:text-base text-[#414844] dark:text-[#b9c1ba]">
                Here is what creators and brand partners say about working with me.
              </p>
            )}
          </div>
        )}

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map(item => (
            <div
              key={item.id}
              className="bg-[#fafaf5] dark:bg-[#151715] p-8 rounded-2xl shadow-sm flex flex-col justify-between gap-6 border border-[#eeeee9] dark:border-[#2a302a]"
            >
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-[#875133] dark:text-[#feb692]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm sm:text-base text-[#1a1c19] dark:text-[#f1f1ec] leading-relaxed italic">
                &ldquo;{item.quote}&rdquo;
              </p>

              {/* Author Bio */}
              <div className="flex items-center gap-3.5 pt-4 border-t border-[#eeeee9] dark:border-[#2a302a]">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${item.badgeColor}`}>
                  {item.initials}
                </div>
                <div>
                  <div className="font-bold text-sm text-[#1a1c19] dark:text-[#f1f1ec]">
                    {item.name}
                  </div>
                  <div className="text-xs text-[#414844] dark:text-[#b9c1ba]">
                    {item.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
