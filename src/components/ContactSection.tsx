import React, { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { MessageSquare, Mail, CheckCircle2 } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { addInquiry, siteContent } = useProjects();
  const { contact, visibility: v } = siteContent;

  if (v?.showContactSection === false) {
    return null;
  }

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'YouTube Video Editing',
    budgetRange: '$1,000 - $3,000',
    details: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      addInquiry({
        name: formData.name,
        email: formData.email,
        projectType: formData.projectType,
        budgetRange: formData.budgetRange,
        details: formData.details
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 400);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      projectType: 'YouTube Video Editing',
      budgetRange: '$1,000 - $3,000',
      details: ''
    });
    setIsSubmitted(false);
  };

  const showHeader = v?.showContactKicker !== false || v?.showContactTitle !== false || v?.showContactSubtitle !== false;

  return (
    <section id="contact" className="px-6 lg:px-12 py-20 md:py-24 transition-colors">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        {/* Section Header */}
        {showHeader && (
          <div className="text-center">
            {v?.showContactKicker !== false && (
              <span className="text-xs font-semibold tracking-wider uppercase text-[#2d5342] dark:text-[#528c70] mb-2 block">
                {contact.kicker}
              </span>
            )}
            {v?.showContactTitle !== false && (
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1c19] dark:text-[#f1f1ec] mb-3 tracking-tight">
                {contact.title}
              </h2>
            )}
            {v?.showContactSubtitle !== false && (
              <p className="text-sm sm:text-base text-[#414844] dark:text-[#b9c1ba]">
                {contact.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Quick Communication Buttons */}
        {v?.showContactDirectLinks !== false && (
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={contact.whatsAppUrl || 'https://wa.me/15550192834'}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#456b59] text-white px-7 py-3 rounded-full text-xs sm:text-sm font-semibold hover:bg-[#2d5342] transition-all flex items-center gap-2.5 shadow-sm active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>

            <a
              href={`mailto:${contact.contactEmail || 'contact@growwithayush.com'}`}
              className="bg-[#feb692] text-[#794529] dark:bg-[#5a2e18] dark:text-[#ffdbcb] px-7 py-3 rounded-full text-xs sm:text-sm font-semibold hover:bg-[#875133] hover:text-white transition-all flex items-center gap-2.5 shadow-sm active:scale-95"
            >
              <Mail className="w-4 h-4" />
              <span>Send an Email</span>
            </a>
          </div>
        )}

        {/* Contact Form Card */}
        {v?.showContactForm !== false && (
          <div className="bg-[#f4f4ef] dark:bg-[#1c1f1c] p-6 sm:p-10 lg:p-12 rounded-3xl shadow-sm border border-[#eeeee9] dark:border-[#2a302a]">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Julian Drake"
                    className="bg-[#fafaf5] dark:bg-[#151715] px-4 py-3 rounded-xl text-sm text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a] focus:outline-none focus:ring-2 focus:ring-[#2d5342] transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="julian@example.com"
                    className="bg-[#fafaf5] dark:bg-[#151715] px-4 py-3 rounded-xl text-sm text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a] focus:outline-none focus:ring-2 focus:ring-[#2d5342] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                    Project Type
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                    className="bg-[#fafaf5] dark:bg-[#151715] px-4 py-3 rounded-xl text-sm text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a] focus:outline-none focus:ring-2 focus:ring-[#2d5342] transition-all"
                  >
                    <option>YouTube Video Editing</option>
                    <option>Shorts &amp; Instagram Reels</option>
                    <option>Cinematic Video Editing</option>
                    <option>Brand &amp; Promotional Video</option>
                    <option>Full Content Strategy</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                    Budget Range
                  </label>
                  <select
                    value={formData.budgetRange}
                    onChange={e => setFormData({ ...formData, budgetRange: e.target.value })}
                    className="bg-[#fafaf5] dark:bg-[#151715] px-4 py-3 rounded-xl text-sm text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a] focus:outline-none focus:ring-2 focus:ring-[#2d5342] transition-all"
                  >
                    <option>$1,000 - $3,000</option>
                    <option>$3,000 - $5,000</option>
                    <option>$5,000+</option>
                    <option>Ongoing Retainer</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                  Project Details
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.details}
                  onChange={e => setFormData({ ...formData, details: e.target.value })}
                  placeholder="Tell me about your channel, goals, timeline, and link to raw clips or references..."
                  className="bg-[#fafaf5] dark:bg-[#151715] px-4 py-3 rounded-xl text-sm text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a] focus:outline-none focus:ring-2 focus:ring-[#2d5342] transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#2d5342] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-[#456b59] transition-all shadow-md active:scale-95 disabled:opacity-50 mt-2"
              >
                {isSubmitting ? 'Sending Inquiry...' : 'Send Project Inquiry'}
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-10 gap-4">
              <div className="w-16 h-16 rounded-full bg-[#456b59]/20 text-[#2d5342] dark:text-[#528c70] flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-[#1a1c19] dark:text-[#f1f1ec]">
                Message Received!
              </h3>
              <p className="text-sm text-[#414844] dark:text-[#b9c1ba] max-w-md">
                Thank you for reaching out. Ayush will review your project details and get back to you within 24 hours.
              </p>
              <button
                onClick={handleReset}
                className="bg-[#e8e8e3] dark:bg-[#2a302a] px-6 py-2.5 rounded-full text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec] hover:bg-[#e2e3de] dark:hover:bg-[#333a33] transition-colors mt-2"
              >
                Send Another Message
              </button>
            </div>
          )}
        </div>
        )}
      </div>
    </section>
  );
};
