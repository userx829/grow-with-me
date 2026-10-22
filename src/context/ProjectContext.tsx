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

const STORAGE_KEY_PROJECTS = 'grow_with_ayush_projects_v1';
const STORAGE_KEY_CONTENT = 'grow_with_ayush_site_content_v1';
const STORAGE_KEY_INQUIRIES = 'grow_with_ayush_inquiries_v1';
const STORAGE_KEY_THEME = 'grow_with_ayush_theme';
const STORAGE_KEY_AUTH = 'grow_with_ayush_admin_auth_v1';
const STORAGE_KEY_PASSWORD = 'grow_with_ayush_admin_pwd_v1';
const DEFAULT_PASSWORD = 'ayush2026';

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Projects State
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    const defaultVisibility = {
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

    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p: ProjectItem) => ({
            ...p,
            visibility: { ...defaultVisibility, ...(p.visibility || {}) }
          }));
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_PROJECTS.map(p => ({
      ...p,
      visibility: { ...defaultVisibility, ...(p.visibility || {}) }
    }));
  });

  // Site Content State (About, Hero, Workflow, Contact, Brand, Visibility)
  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONTENT);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.about && parsed.hero) {
          return {
            ...INITIAL_SITE_CONTENT,
            ...parsed,
            visibility: { ...INITIAL_SITE_CONTENT.visibility, ...(parsed.visibility || {}) },
            about: { ...INITIAL_SITE_CONTENT.about, ...parsed.about },
            hero: { ...INITIAL_SITE_CONTENT.hero, ...parsed.hero },
            workflow: { ...INITIAL_SITE_CONTENT.workflow, ...parsed.workflow },
            contact: { ...INITIAL_SITE_CONTENT.contact, ...parsed.contact }
          };
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_SITE_CONTENT;
  });

  // Inquiries State
  const [inquiries, setInquiries] = useState<InquiryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INQUIRIES);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'sample-inq-1',
        name: 'Julian Drake',
        email: 'julian@example.com',
        projectType: 'YouTube Video Editing',
        budgetRange: '$1,000 - $3,000',
        details: 'Looking for a regular video editor for my 450K tech YouTube channel with 4K footage and b-roll color grading.',
        createdAt: '2026-04-10T14:30:00Z',
        status: 'reviewed'
      }
    ];
  });

  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // Admin Passcode
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_PASSWORD) || DEFAULT_PASSWORD;
    } catch {
      return DEFAULT_PASSWORD;
    }
  });

  // Current view based on window hash, path, or default
  const [currentView, setCurrentView] = useState<'portfolio' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (hash === '#admin' || path === '/admin' || path.endsWith('/admin')) {
        return 'admin';
      }
    }
    return 'portfolio';
  });

  // Active Modals
  const [activeProjectModal, setActiveProjectModal] = useState<ProjectItem | null>(null);
  const [activeServiceModal, setActiveServiceModal] = useState<ServiceItem | null>(null);

  // Server persistence & synchronization state
  const [isServerConnected, setIsServerConnected] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'error'>('synced');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  // Load persistent data from Express backend on mount
  useEffect(() => {
    let isMounted = true;
    async function loadServerData() {
      try {
        const [projRes, contentRes, inqRes] = await Promise.all([
          fetch('/api/projects').catch(() => null),
          fetch('/api/content').catch(() => null),
          fetch('/api/inquiries').catch(() => null)
        ]);

        if (projRes && projRes.ok) {
          const serverProjects = await projRes.json();
          if (Array.isArray(serverProjects) && serverProjects.length > 0 && isMounted) {
            const defaultVisibility = {
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
            setProjects(serverProjects.map((p: ProjectItem) => ({
              ...p,
              visibility: { ...defaultVisibility, ...(p.visibility || {}) }
            })));
            setIsServerConnected(true);
            setSyncStatus('synced');
          }
        }

        if (contentRes && contentRes.ok) {
          const serverContent = await contentRes.json();
          if (serverContent && (serverContent.hero || serverContent.about) && isMounted) {
            setSiteContent(prev => ({
              ...prev,
              ...serverContent,
              visibility: { ...(prev.visibility || {}), ...(serverContent.visibility || {}) },
              about: { ...prev.about, ...(serverContent.about || {}) },
              hero: { ...prev.hero, ...(serverContent.hero || {}) },
              workflow: { ...prev.workflow, ...(serverContent.workflow || {}) },
              contact: { ...prev.contact, ...(serverContent.contact || {}) }
            }));
          }
        }

        if (inqRes && inqRes.ok) {
          const serverInquiries = await inqRes.json();
          if (Array.isArray(serverInquiries) && isMounted) {
            setInquiries(serverInquiries);
          }
        }
      } catch (err) {
        console.warn('Initial server sync notice:', err);
      }
    }

    loadServerData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  // Apply theme class to document element and body
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

  // Sync projects to localStorage as immediate offline cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    } catch {
      // ignore
    }
  }, [projects]);

  // Sync siteContent to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONTENT, JSON.stringify(siteContent));
    } catch {
      // ignore
    }
  }, [siteContent]);

  // Sync inquiries to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(inquiries));
    } catch {
      // ignore
    }
  }, [inquiries]);

  // Route listener for router sync (#admin or /admin)
  useEffect(() => {
    const handleRouteSync = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (hash === '#admin' || path === '/admin' || path.endsWith('/admin')) {
        setCurrentView('admin');
      } else {
        setCurrentView('portfolio');
      }
    };
    window.addEventListener('hashchange', handleRouteSync);
    window.addEventListener('popstate', handleRouteSync);
    return () => {
      window.removeEventListener('hashchange', handleRouteSync);
      window.removeEventListener('popstate', handleRouteSync);
    };
  }, []);

  const setViewWithHash = (view: 'portfolio' | 'admin') => {
    setCurrentView(view);
    if (view === 'admin') {
      window.location.hash = '#admin';
    } else {
      if (window.location.hash === '#admin') {
        history.replaceState(null, '', window.location.pathname);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Auth Methods
  const loginAdmin = (passcode: string): boolean => {
    if (passcode === adminPassword) {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem(STORAGE_KEY_AUTH, 'true');
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem(STORAGE_KEY_AUTH);
    } catch {
      // ignore
    }
    setViewWithHash('portfolio');
  };

  const changeAdminPassword = (newPassword: string) => {
    setAdminPassword(newPassword);
    try {
      localStorage.setItem(STORAGE_KEY_PASSWORD, newPassword);
    } catch {
      // ignore
    }
  };

  const addProject = async (project: Omit<ProjectItem, 'id' | 'publishedAt'>) => {
    const newProject: ProjectItem = {
      ...project,
      id: `proj-${Date.now()}`,
      publishedAt: new Date().toISOString().split('T')[0]
    };
    setProjects(prev => [newProject, ...prev]);
    setSyncStatus('saving');
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject)
      });
      if (res.ok) {
        setIsServerConnected(true);
        setSyncStatus('synced');
        setLastSavedAt(new Date().toLocaleTimeString());
      }
    } catch {
      setSyncStatus('error');
    }
  };

  const updateProject = async (id: string, updated: Partial<ProjectItem>) => {
    setProjects(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updated } : p))
    );
    if (activeProjectModal && activeProjectModal.id === id) {
      setActiveProjectModal(prev => (prev ? { ...prev, ...updated } : null));
    }
    setSyncStatus('saving');
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setIsServerConnected(true);
        setSyncStatus('synced');
        setLastSavedAt(new Date().toLocaleTimeString());
      }
    } catch {
      setSyncStatus('error');
    }
  };

  const deleteProject = async (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (activeProjectModal && activeProjectModal.id === id) {
      setActiveProjectModal(null);
    }
    setSyncStatus('saving');
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setIsServerConnected(true);
        setSyncStatus('synced');
        setLastSavedAt(new Date().toLocaleTimeString());
      }
    } catch {
      setSyncStatus('error');
    }
  };

  const updateSiteContent = async (updated: Partial<SiteContent>) => {
    setSiteContent(prev => {
      const merged: SiteContent = {
        ...prev,
        ...updated,
        visibility: { ...(prev.visibility || {}), ...(updated.visibility || {}) },
        about: updated.about ? { ...prev.about, ...updated.about } : prev.about,
        hero: updated.hero ? { ...prev.hero, ...updated.hero } : prev.hero,
        workflow: updated.workflow ? { ...prev.workflow, ...updated.workflow } : prev.workflow,
        contact: updated.contact ? { ...prev.contact, ...updated.contact } : prev.contact
      };
      return merged;
    });
    setSyncStatus('saving');
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setIsServerConnected(true);
        setSyncStatus('synced');
        setLastSavedAt(new Date().toLocaleTimeString());
      }
    } catch {
      setSyncStatus('error');
    }
  };

  const resetSiteContent = async () => {
    setSiteContent(INITIAL_SITE_CONTENT);
    try {
      localStorage.setItem(STORAGE_KEY_CONTENT, JSON.stringify(INITIAL_SITE_CONTENT));
      await fetch('/api/content/reset', { method: 'POST' });
    } catch {
      // ignore
    }
  };

  const resetToDefaults = async () => {
    setProjects(INITIAL_PROJECTS);
    setSiteContent(INITIAL_SITE_CONTENT);
    try {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(INITIAL_PROJECTS));
      localStorage.setItem(STORAGE_KEY_CONTENT, JSON.stringify(INITIAL_SITE_CONTENT));
      await Promise.all([
        fetch('/api/projects/reset', { method: 'POST' }).catch(() => null),
        fetch('/api/content/reset', { method: 'POST' }).catch(() => null)
      ]);
    } catch {
      // ignore
    }
  };

  const exportData = () => {
    const exportBundle = {
      projects,
      siteContent,
      version: '1.0',
      exportedAt: new Date().toISOString()
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportBundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `grow_with_ayush_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importData = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.projects && Array.isArray(parsed.projects)) {
        setProjects(parsed.projects);
        if (parsed.siteContent) {
          setSiteContent({
            ...INITIAL_SITE_CONTENT,
            ...parsed.siteContent
          });
          fetch('/api/content', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parsed.siteContent)
          }).catch(() => null);
        }
        return true;
      }
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].title) {
        setProjects(parsed);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const addInquiry = async (inquiry: Omit<InquiryItem, 'id' | 'createdAt' | 'status'>) => {
    const newInquiry: InquiryItem = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    setInquiries(prev => [newInquiry, ...prev]);
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiry)
      });
    } catch {
      // ignore
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        addProject,
        updateProject,
        deleteProject,
        resetToDefaults,
        exportData,
        importData,
        siteContent,
        updateSiteContent,
        resetSiteContent,
        inquiries,
        addInquiry,
        currentView,
        setCurrentView: setViewWithHash,
        activeProjectModal,
        openProjectModal: (p) => setActiveProjectModal(p),
        closeProjectModal: () => setActiveProjectModal(null),
        activeServiceModal,
        openServiceModal: (s) => setActiveServiceModal(s),
        closeServiceModal: () => setActiveServiceModal(null),
        theme,
        toggleTheme,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        isServerConnected,
        syncStatus,
        lastSavedAt
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
