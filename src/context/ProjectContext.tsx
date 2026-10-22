import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProjectItem, InquiryItem, ServiceItem, SiteContent } from '../types';
import { INITIAL_PROJECTS } from '../data/initialProjects';
import { INITIAL_SITE_CONTENT } from '../data/initialContent';

interface ProjectContextType {
  projects: ProjectItem[];
  addProject: (project: Omit<ProjectItem, 'id' | 'publishedAt'>) => void;
  updateProject: (id: string, project: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;
  resetToDefaults: () => void;
  exportData: () => void;
  importData: (jsonString: string) => boolean;
  siteContent: SiteContent;
  updateSiteContent: (updated: Partial<SiteContent>) => void;
  resetSiteContent: () => void;
  inquiries: InquiryItem[];
  addInquiry: (inquiry: Omit<InquiryItem, 'id' | 'createdAt' | 'status'>) => void;
  currentView: 'portfolio' | 'admin';
  setCurrentView: (view: 'portfolio' | 'admin') => void;
  activeProjectModal: ProjectItem | null;
  openProjectModal: (project: ProjectItem) => void;
  closeProjectModal: () => void;
  activeServiceModal: ServiceItem | null;
  openServiceModal: (service: ServiceItem) => void;
  closeServiceModal: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (passcode: string) => boolean;
  logoutAdmin: () => void;
  changeAdminPassword: (newPassword: string) => void;
  isServerConnected: boolean;
  syncStatus: 'synced' | 'saving' | 'error';
  lastSavedAt: string | null;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const STORAGE_KEY_THEME = 'grow_with_ayush_theme';

const DEFAULT_VISIBILITY = {
  showTitle: true,
  showSubtitle: true,
  showSummary: true,
  showCategoryBadge: true,
  showMetrics: true,
  showClientInfo: true,
  showCaseStudy: true,
  showTechniques: true,
  isPublished: true
};

// Projects are read ONLY from src/data/initialProjects.ts.
const STATIC_PROJECTS: ProjectItem[] = INITIAL_PROJECTS.map(p => ({
  ...p,
  visibility: { ...DEFAULT_VISIBILITY, ...(p.visibility || {}) }
}));

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Static data: same for every visitor
  const [projects] = useState<ProjectItem[]>(STATIC_PROJECTS);
  const [siteContent] = useState<SiteContent>(INITIAL_SITE_CONTENT);

  // Contact form submissions (in memory only, not saved anywhere)
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);

  // Modals
  const [activeProjectModal, setActiveProjectModal] = useState<ProjectItem | null>(null);
  const [activeServiceModal, setActiveServiceModal] = useState<ServiceItem | null>(null);

  // Theme (per-visitor preference)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_THEME);
        if (saved === 'dark' || saved === 'light') return saved;
      } catch {
        // ignore
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const addInquiry = (inquiry: Omit<InquiryItem, 'id' | 'createdAt' | 'status'>) => {
    const newInquiry: InquiryItem = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    setInquiries(prev => [newInquiry, ...prev]);
  };

  // Admin features removed: harmless no-ops so existing imports still compile
  const noop = () => {};

  return (
    <ProjectContext.Provider
      value={{
        projects,
        addProject: noop,
        updateProject: noop,
        deleteProject: noop,
        resetToDefaults: noop,
        exportData: noop,
        importData: () => false,
        siteContent,
        updateSiteContent: noop,
        resetSiteContent: noop,
        inquiries,
        addInquiry,
        currentView: 'portfolio',
        setCurrentView: noop,
        activeProjectModal,
        openProjectModal: p => setActiveProjectModal(p),
        closeProjectModal: () => setActiveProjectModal(null),
        activeServiceModal,
        openServiceModal: s => setActiveServiceModal(s),
        closeServiceModal: () => setActiveServiceModal(null),
        theme,
        toggleTheme,
        isAdminAuthenticated: false,
        loginAdmin: () => false,
        logoutAdmin: noop,
        changeAdminPassword: noop,
        isServerConnected: false,
        syncStatus: 'synced',
        lastSavedAt: null
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};