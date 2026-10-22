import React from 'react';
import { useProjects } from '../context/ProjectContext';

export const ProcessSection: React.FC = () => {
  const { siteContent } = useProjects();
  const { workflow, visibility: v } = siteContent;

  if (v?.showWorkflowSection === false) {
    return null;
  }

  const showHeader = v?.showWorkflowKicker !== false || v?.showWorkflowTitle !== false || v?.showWorkflowSubtitle !== false;

  return (
    <section className="px-6 lg:px-12 py-20 md:py-24 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Section Header */}
        {showHeader && (
          <div className="text-center max-w-2xl mx-auto">
            {v?.showWorkflowKicker !== false && (
              <span className="text-xs font-semibold tracking-wider uppercase text-[#2d5342] dark:text-[#528c70] mb-2 block">
                {workflow.kicker}
              </span>
            )}
            {v?.showWorkflowTitle !== false && (
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1c19] dark:text-[#f1f1ec] mb-3 tracking-tight">
                {workflow.title}
              </h2>
            )}
            {v?.showWorkflowSubtitle !== false && (
              <p className="text-sm sm:text-base text-[#414844] dark:text-[#b9c1ba]">
                {workflow.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Steps Grid */}
        {v?.showWorkflowSteps !== false && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {workflow.steps.map(step => (
              <div
                key={step.num}
                className="bg-[#f4f4ef] dark:bg-[#1c1f1c] p-7 rounded-2xl flex flex-col gap-3.5 border border-[#eeeee9] dark:border-[#2a302a] relative hover:border-[#2d5342]/30 transition-colors"
              >
                <span className="text-4xl font-extrabold text-[#2d5342]/25 dark:text-[#528c70]/30 tabular-nums">
                  {step.num}
                </span>
                <h3 className="text-lg font-bold text-[#1a1c19] dark:text-[#f1f1ec] tracking-tight">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#414844] dark:text-[#b9c1ba] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
