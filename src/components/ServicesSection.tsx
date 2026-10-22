import React from 'react';
import { useProjects } from '../context/ProjectContext';
import { INITIAL_SERVICES } from '../data/initialProjects';
import { ServiceItem } from '../types';
import { ArrowRight, Video, Smartphone, Film, Sparkles, Share2 } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const { openServiceModal, siteContent } = useProjects();
  const v = siteContent.visibility;

  if (v?.showServicesSection === false) {
    return null;
  }

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'movie':
        return <Video className="w-7 h-7" />;
      case 'smartphone':
        return <Smartphone className="w-7 h-7" />;
      case 'hd':
        return <Film className="w-7 h-7" />;
      case 'campaign':
        return <Sparkles className="w-7 h-7" />;
      case 'share':
      default:
        return <Share2 className="w-7 h-7" />;
    }
  };

  return (
    <section id="services" className="px-6 lg:px-12 py-20 md:py-24 bg-[#f4f4ef] dark:bg-[#1c1f1c] transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Section Header */}
        {(v?.showServicesKicker !== false || v?.showServicesTitle !== false || v?.showServicesSubtitle !== false) && (
          <div className="text-center max-w-2xl mx-auto">
            {v?.showServicesKicker !== false && (
              <span className="text-xs font-semibold tracking-wider uppercase text-[#2d5342] dark:text-[#528c70] mb-2 block">
                WHAT I OFFER
              </span>
            )}
            {v?.showServicesTitle !== false && (
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1c19] dark:text-[#f1f1ec] mb-3 tracking-tight">
                Expertise Tailored For Your Growth
              </h2>
            )}
            {v?.showServicesSubtitle !== false && (
              <p className="text-sm sm:text-base text-[#414844] dark:text-[#b9c1ba]">
                Comprehensive video production and editing services designed to elevate your brand presence.
              </p>
            )}
          </div>
        )}

        {/* Services Cards Grid */}
        {v?.showServicesCards !== false && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {INITIAL_SERVICES.map((service: ServiceItem, idx: number) => {
            const isWide = idx === 4; // Social Media Strategy takes 2 columns on lg
            const isSecondary = service.colorScheme === 'secondary';

            return (
              <div
                key={service.id}
                onClick={() => openServiceModal(service)}
                className={`bg-[#fafaf5] dark:bg-[#151715] p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-6 border border-[#eeeee9] dark:border-[#2a302a] cursor-pointer group hover:-translate-y-1 ${
                  isWide ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                {/* Icon Container */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                    isSecondary
                      ? 'bg-[#feb692]/30 text-[#875133] dark:bg-[#5a2e18]/40 dark:text-[#ffdbcb]'
                      : 'bg-[#456b59]/15 text-[#2d5342] dark:bg-[#2a4b3b]/50 dark:text-[#c5edd9]'
                  }`}
                >
                  {getServiceIcon(service.icon)}
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl font-bold text-[#1a1c19] dark:text-[#f1f1ec] mb-2.5 group-hover:text-[#2d5342] dark:group-hover:text-[#528c70] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#414844] dark:text-[#b9c1ba] leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Action Link */}
                <div className="flex items-center gap-1.5 text-[#2d5342] dark:text-[#528c70] text-xs font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
};
