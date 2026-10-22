import React, { useEffect } from 'react';
import { useProjects } from '../context/ProjectContext';
import { X, Check, Clock, Users, ArrowRight } from 'lucide-react';

export const ServiceModal: React.FC = () => {
  const { activeServiceModal, closeServiceModal, setCurrentView } = useProjects();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeServiceModal();
    };
    if (activeServiceModal) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [activeServiceModal, closeServiceModal]);

  if (!activeServiceModal) return null;

  const service = activeServiceModal;

  const handleBook = () => {
    closeServiceModal();
    setCurrentView('portfolio');
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={closeServiceModal} />

      <div className="relative w-full max-w-xl bg-[#fafaf5] dark:bg-[#151715] rounded-3xl shadow-2xl border border-[#eeeee9] dark:border-[#2a302a] overflow-hidden flex flex-col z-10 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#eeeee9] dark:border-[#2a302a]">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#2d5342] dark:text-[#528c70] block mb-1">
              SERVICE SPECIFICATION
            </span>
            <h3 className="text-xl font-bold text-[#1a1c19] dark:text-[#f1f1ec]">
              {service.title}
            </h3>
          </div>
          <button
            onClick={closeServiceModal}
            className="w-9 h-9 rounded-full bg-[#eeeee9] dark:bg-[#2a302a] flex items-center justify-center text-[#1a1c19] dark:text-[#f1f1ec]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <p className="text-sm text-[#414844] dark:text-[#b9c1ba] leading-relaxed">
            {service.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#f4f4ef] dark:bg-[#1c1f1c] p-4 rounded-xl border border-[#eeeee9] dark:border-[#2a302a]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec] mb-1">
                <Clock className="w-4 h-4 text-[#2d5342] dark:text-[#528c70]" />
                Typical Turnaround
              </div>
              <p className="text-sm font-bold text-[#2d5342] dark:text-[#528c70]">{service.turnaround}</p>
            </div>

            <div className="bg-[#f4f4ef] dark:bg-[#1c1f1c] p-4 rounded-xl border border-[#eeeee9] dark:border-[#2a302a]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec] mb-1">
                <Users className="w-4 h-4 text-[#875133] dark:text-[#feb692]" />
                Ideal Partner
              </div>
              <p className="text-xs text-[#414844] dark:text-[#b9c1ba] line-clamp-2">{service.bestFor}</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1a1c19] dark:text-[#f1f1ec] mb-3">
              Included Deliverables &amp; Pipeline
            </h4>
            <div className="space-y-2.5">
              {service.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#414844] dark:text-[#b9c1ba]">
                  <div className="w-4 h-4 rounded-full bg-[#2d5342]/15 text-[#2d5342] dark:text-[#528c70] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-6 border-t border-[#eeeee9] dark:border-[#2a302a] bg-[#f4f4ef] dark:bg-[#1c1f1c] flex items-center justify-between gap-4">
          <button
            onClick={closeServiceModal}
            className="px-5 py-2.5 rounded-full text-xs font-medium text-[#414844] dark:text-[#b9c1ba] hover:text-[#1a1c19] dark:hover:text-white"
          >
            Close
          </button>
          <button
            onClick={handleBook}
            className="bg-[#2d5342] text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-[#456b59] transition-all flex items-center gap-2 shadow-sm"
          >
            <span>Inquire About This Service</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
