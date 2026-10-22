export type ProjectCategory = 'youtube' | 'shorts' | 'cinematic' | 'ads';

export interface ProjectVisibility {
  showTitle?: boolean;
  showSubtitle?: boolean;
  showSummary?: boolean;
  showCategoryBadge?: boolean;
  showMetrics?: boolean;
  showClientInfo?: boolean;
  showCaseStudy?: boolean;
  showTechniques?: boolean;
  showWatchButton?: boolean;
  isPublished?: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  categoryLabel: string;
  thumbnailUrl: string;
  videoUrl?: string; // YouTube URL, Vimeo, direct MP4, or blob URL
  videoType?: 'youtube' | 'direct' | 'vimeo' | 'uploaded';
  views: string;
  duration: string;
  retentionRate?: string;
  summary: string;
  clientName?: string;
  clientRole?: string;
  clientTestimonial?: string;
  caseStudyStory?: string;
  techniques?: string[];
  featured?: boolean;
  publishedAt: string;
  aspectRatio?: '16:9' | '9:16';
  visibility?: ProjectVisibility;
}

export interface InquiryItem {
  id: string;
  name: string;
  email: string;
  projectType: string;
  budgetRange: string;
  details: string;
  createdAt: string;
  status: 'new' | 'reviewed' | 'contacted';
}

export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  turnaround: string;
  bestFor: string;
  colorScheme: 'primary' | 'secondary';
}

export interface StatItem {
  value: string;
  label: string;
}

export interface WorkflowStepItem {
  num: string;
  title: string;
  desc: string;
}

export interface SectionVisibility {
  // Main sections
  showHeroSection?: boolean;
  showPortfolioSection?: boolean;
  showAboutSection?: boolean;
  showServicesSection?: boolean;
  showWorkflowSection?: boolean;
  showTestimonialsSection?: boolean;
  showContactSection?: boolean;

  // Hero granular controls
  showHeroBadge?: boolean;
  showHeroHeadline?: boolean;
  showHeroSubtitle?: boolean;
  showHeroCtaButtons?: boolean;
  showHeroStats?: boolean;
  showHeroFeaturedCard?: boolean;

  // Portfolio granular controls
  showPortfolioKicker?: boolean;
  showPortfolioTitle?: boolean;
  showPortfolioFilters?: boolean;
  showPortfolioWatchButton?: boolean;
  portfolioWatchButtonText?: string;

  // About granular controls
  showAboutKicker?: boolean;
  showAboutTitle?: boolean;
  showAboutBio?: boolean;
  showAboutQuote?: boolean;
  showAboutImage?: boolean;
  showAboutStats?: boolean;

  // Services granular controls
  showServicesKicker?: boolean;
  showServicesTitle?: boolean;
  showServicesSubtitle?: boolean;
  showServicesCards?: boolean;

  // Workflow granular controls
  showWorkflowKicker?: boolean;
  showWorkflowTitle?: boolean;
  showWorkflowSubtitle?: boolean;
  showWorkflowSteps?: boolean;

  // Testimonials granular controls
  showTestimonialsKicker?: boolean;
  showTestimonialsTitle?: boolean;
  showTestimonialsSubtitle?: boolean;

  // Contact granular controls
  showContactKicker?: boolean;
  showContactTitle?: boolean;
  showContactSubtitle?: boolean;
  showContactDirectLinks?: boolean;
  showContactForm?: boolean;

  // Navigation & Footer granular controls
  showNavbarContactButton?: boolean;
  showFooterSocials?: boolean;
  showFooterBrand?: boolean;
}

export interface SiteContent {
  brandName: string;
  visibility?: SectionVisibility;
  hero: {
    badge: string;
    headline: string;
    subtitle: string;
    ctaPrimaryText: string;
    ctaSecondaryText: string;
    stats: [StatItem, StatItem, StatItem];
  };
  about: {
    kicker: string;
    title: string;
    bioParagraph1: string;
    bioParagraph2: string;
    quoteText: string;
    quoteAuthor: string;
    imageUrl: string;
    stats: [StatItem, StatItem, StatItem];
  };
  workflow: {
    kicker: string;
    title: string;
    subtitle: string;
    steps: WorkflowStepItem[];
  };
  contact: {
    kicker: string;
    title: string;
    subtitle: string;
    whatsAppNumber: string;
    whatsAppUrl: string;
    contactEmail: string;
  };
}
