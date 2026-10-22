import { SiteContent, SectionVisibility } from '../types';

export const DEFAULT_SECTION_VISIBILITY: SectionVisibility = {
  showHeroSection: true,
  showPortfolioSection: true,
  showAboutSection: true,
  showServicesSection: true,
  showWorkflowSection: true,
  showTestimonialsSection: true,
  showContactSection: true,

  showHeroBadge: true,
  showHeroHeadline: true,
  showHeroSubtitle: true,
  showHeroCtaButtons: true,
  showHeroStats: true,
  showHeroFeaturedCard: true,

  showPortfolioKicker: true,
  showPortfolioTitle: true,
  showPortfolioFilters: true,
  showPortfolioWatchButton: true,
  portfolioWatchButtonText: 'Watch Video',

  showAboutKicker: true,
  showAboutTitle: true,
  showAboutBio: true,
  showAboutQuote: true,
  showAboutImage: true,
  showAboutStats: true,

  showServicesKicker: true,
  showServicesTitle: true,
  showServicesSubtitle: true,
  showServicesCards: true,

  showWorkflowKicker: true,
  showWorkflowTitle: true,
  showWorkflowSubtitle: true,
  showWorkflowSteps: true,

  showTestimonialsKicker: true,
  showTestimonialsTitle: true,
  showTestimonialsSubtitle: true,

  showContactKicker: true,
  showContactTitle: true,
  showContactSubtitle: true,
  showContactDirectLinks: true,
  showContactForm: true,

  showNavbarContactButton: true,
  showFooterSocials: true,
  showFooterBrand: true,
};

export const INITIAL_SITE_CONTENT: SiteContent = {
  brandName: 'Grow With Ayush',
  visibility: DEFAULT_SECTION_VISIBILITY,
  hero: {
    badge: 'VIDEO EDITOR & CREATIVE PARTNER',
    headline: "Your Vision. My Edit. Let's Grow.",
    subtitle: "Transforming raw footage into compelling cinematic narratives that captivate audiences, boost retention, and accelerate your channel's growth.",
    ctaPrimaryText: 'Explore My Work',
    ctaSecondaryText: "Let's Work Together",
    stats: [
      { value: '50M+', label: 'Total Views Generated' },
      { value: '120+', label: 'Projects Delivered' },
      { value: '99%', label: 'Client Satisfaction' }
    ]
  },
  about: {
    kicker: 'ABOUT ME',
    title: 'The Person Behind the Edits',
    bioParagraph1: "Hey! I'm Ayush. For over 5 years, I've partnered with top-tier creators, entrepreneurs, and brands to turn raw footage into hypnotic visual experiences. I don't just cut clips together—I craft pacing, build emotional arcs, and engineer retention.",
    bioParagraph2: "Whether you are scaling a YouTube channel from scratch or launching a high-converting brand film, I handle the narrative weight so you can focus entirely on creation.",
    quoteText: "Editing is where the story is truly written.",
    quoteAuthor: "— Ayush, Lead Editor",
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1_NcPIGPO8T1_06MAHTLJXHpnsx4PWWMK_jmW6h5mRumbDrKEMgagFmW-ZUgFhs3A4LrC2B979N_9ex3DN8Wea16O6qHWTzBPYS9DlvioKDPrDOaR1IMxPcrQJ3bOa26uVL3SmvtafFeiQUUWWLFYze99gFp44euvzp54gm5XBkdDQYV7Ilbf7gmp3ruTIFajG5QrKhf9z-EK6U8YRaNRe2GxVd_Pt5ZHApHEbGAEyet1ohFnSFTs',
    stats: [
      { value: '5+', label: 'Years Experience' },
      { value: '120+', label: 'Projects Completed' },
      { value: '45+', label: 'Collaborations' }
    ]
  },
  workflow: {
    kicker: 'WORKFLOW',
    title: 'Simple, Streamlined Process',
    subtitle: 'How we take your project from an idea to a polished masterwork.',
    steps: [
      {
        num: '01',
        title: 'Share Your Vision',
        desc: 'Tell me about your project, goals, style references, audience profile, and deadlines.'
      },
      {
        num: '02',
        title: 'Send Your Footage',
        desc: 'Upload raw clips, audio tracks, and brand assets securely via Frame.io, Google Drive, or Dropbox.'
      },
      {
        num: '03',
        title: 'Editing & Feedback',
        desc: 'Receive the first draft, review directly on the frame-accurate timeline, and request revisions.'
      },
      {
        num: '04',
        title: 'Final Delivery',
        desc: 'Get your master exports in pristine 4K/1080p with platform-optimized presets ready to publish.'
      }
    ]
  },
  contact: {
    kicker: 'GET IN TOUCH',
    title: "Let's Create Something Great",
    subtitle: 'Ready to level up your content? Send a message or schedule a quick chat.',
    whatsAppNumber: '+1 (555) 019-2834',
    whatsAppUrl: 'https://wa.me/15550192834',
    contactEmail: 'contact@growwithayush.com'
  }
};
