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
const STORAGE_KEY_AUTH = 'grow_with_ayush_admin_auth';
const STORAGE_KEY_PASS = 'grow_with_ayush_admin_passcode';
const DEFAULT_PASSCODE = 'ayush2026';

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

const STATIC_PROJECTS: ProjectItem[] = INITIAL_PROJECTS.map(p => ({
  ...p,
  visibility: { ...DEFAULT_VISIBILITY, ...(p.visibility || {}) }
}));

const getInitialView = (): 'portfolio' | 'admin' => {
  if (typeof window === 'undefined') return 'portfolio';
  const hash = window.location.hash.toLowerCase();
  const path = window.location.pathname.toLowerCase();
  if (hash === '#admin' || hash === '#/admin' || path === '/admin') {
    return 'admin';
  }
  return 'portfolio';
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation / Routing State
  const [currentView, setCurrentViewState] = useState<'portfolio' | 'admin'>(getInitialView);

  // Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem(STORAGE_KEY_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // Projects & Content State
  const [projects, setProjects] = useState<ProjectItem[]>(STATIC_PROJECTS);
  const [siteContent, setSiteContent] = useState<SiteContent>(INITIAL_SITE_CONTENT);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);

  // Server sync state
  const [isServerConnected, setIsServerConnected] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'error'>('synced');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

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

  // Keep URL hash and currentView in sync
  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (hash === '#admin' || hash === '#/admin' || path === '/admin') {
        setCurrentViewState('admin');
      } else if (hash === '' || hash === '#' || hash === '#home' || hash === '#portfolio' || hash === '#about' || hash === '#services' || hash === '#contact') {
        setCurrentViewState('portfolio');
      }
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const setCurrentView = (view: 'portfolio' | 'admin') => {
    setCurrentViewState(view);
    if (view === 'admin') {
      if (window.location.hash !== '#admin') {
        window.location.hash = 'admin';
      }
    } else {
      if (window.location.hash === '#admin' || window.location.hash === '#/admin') {
        try {
          history.pushState(null, '', window.location.pathname);
        } catch {
          window.location.hash = '';
        }
      }
    }
  };

  // Sync theme with HTML DOM & localStorage
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

  // Load persistent data from Express backend on mount
  useEffect(() => {
    let mounted = true;
    const loadServerData = async () => {
      try {
        const [projRes, contentRes, inqRes] = await Promise.all([
          fetch('/api/projects').catch(() => null),
          fetch('/api/content').catch(() => null),
          fetch('/api/inquiries').catch(() => null)
        ]);

        if (projRes && projRes.ok) {
          const projData = await projRes.json();
          if (mounted && Array.isArray(projData) && projData.length > 0) {
            setProjects(projData.map(p => ({
              ...p,
              visibility: { ...DEFAULT_VISIBILITY, ...(p.visibility || {}) }
            })));
            setIsServerConnected(true);
          }
        }

        if (contentRes && contentRes.ok) {
          const contentData = await contentRes.json();
          if (mounted && contentData && contentData.brandName) {
            setSiteContent(prev => ({
              ...prev,
              ...contentData,
              visibility: { ...(prev.visibility || {}), ...(contentData.visibility || {}) }
            }));
          }
        }

        if (inqRes && inqRes.ok) {
          const inqData = await inqRes.json();
          if (mounted && Array.isArray(inqData)) {
            setInquiries(inqData);
          }
        }
      } catch (err) {
        console.warn('Backend load notice:', err);
      }
    };

    loadServerData();
    return () => {
      mounted = false;
    };
  }, []);

  // Admin Authentication handlers
  const loginAdmin = (passcode: string): boolean => {
    let storedPass = DEFAULT_PASSCODE;
    try {
      const customPass = localStorage.getItem(STORAGE_KEY_PASS);
      if (customPass) storedPass = customPass;
    } catch {
      // ignore
    }

    if (passcode.trim() === storedPass.trim()) {
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
    setCurrentView('portfolio');
  };

  const changeAdminPassword = (newPassword: string) => {
    if (!newPassword || newPassword.trim().length < 4) return;
    try {
      localStorage.setItem(STORAGE_KEY_PASS, newPassword.trim());
    } catch {
      // ignore
    }
  };

  // Project CRUD Actions with Server Persistence
  const addProject = async (projectData: Omit<ProjectItem, 'id' | 'publishedAt'>) => {
    const newProject: ProjectItem = {
      ...projectData,
      id: `proj-${Date.now()}`,
      publishedAt: new Date().toISOString().split('T')[0],
      visibility: { ...DEFAULT_VISIBILITY, ...(projectData.visibility || {}) }
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
        const savedProject = await res.json();
        setProjects(prev => prev.map(p => (p.id === newProject.id ? savedProject : p)));
        setSyncStatus('synced');
        setLastSavedAt(new Date().toLocaleTimeString());
      } else {
        setSyncStatus('error');
      }
    } catch (err) {
      console.error('Error saving new project:', err);
      setSyncStatus('error');
    }
  };

  const updateProject = async (id: string, updates: Partial<ProjectItem>) => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    setSyncStatus('saving');

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        setSyncStatus('synced');
        setLastSavedAt(new Date().toLocaleTimeString());
      } else {
        setSyncStatus('error');
      }
    } catch (err) {
      console.error('Error updating project:', err);
      setSyncStatus('error');
    }
  };

  const deleteProject = async (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setSyncStatus('saving');

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setSyncStatus('synced');
        setLastSavedAt(new Date().toLocaleTimeString());
      } else {
        setSyncStatus('error');
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      setSyncStatus('error');
    }
  };

  const resetToDefaults = async () => {
    setSyncStatus('saving');
    try {
      const res = await fetch('/api/projects/reset', { method: 'POST' });
      if (res.ok) {
        const defaults = await res.json();
        setProjects(defaults);
        setSyncStatus('synced');
        setLastSavedAt(new Date().toLocaleTimeString());
      } else {
        setProjects(STATIC_PROJECTS);
        setSyncStatus('synced');
      }
    } catch {
      setProjects(STATIC_PROJECTS);
      setSyncStatus('synced');
    }
  };

  // Site Content CRUD with Server Persistence
  const updateSiteContent = async (updated: Partial<SiteContent>) => {
    setSiteContent(prev => ({
      ...prev,
      ...updated,
      visibility: { ...(prev.visibility || {}), ...(updated.visibility || {}) },
      about: updated.about ? { ...prev.about, ...updated.about } : prev.about,
      hero: updated.hero ? { ...prev.hero, ...updated.hero } : prev.hero,
      workflow: updated.workflow ? { ...prev.workflow, ...updated.workflow } : prev.workflow,
      contact: updated.contact ? { ...prev.contact, ...updated.contact } : prev.contact
    }));
    setSyncStatus('saving');

    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        const saved = await res.json();
        setSiteContent(saved);
        setSyncStatus('synced');
        setLastSavedAt(new Date().toLocaleTimeString());
      } else {
        setSyncStatus('error');
      }
    } catch (err) {
      console.error('Error saving content:', err);
      setSyncStatus('error');
    }
  };

  const resetSiteContent = async () => {
    setSyncStatus('saving');
    try {
      const res = await fetch('/api/content/reset', { method: 'POST' });
      if (res.ok) {
        const defaults = await res.json();
        setSiteContent(defaults);
        setSyncStatus('synced');
        setLastSavedAt(new Date().toLocaleTimeString());
      } else {
        setSiteContent(INITIAL_SITE_CONTENT);
        setSyncStatus('synced');
      }
    } catch {
      setSiteContent(INITIAL_SITE_CONTENT);
      setSyncStatus('synced');
    }
  };

  // Inquiry submission
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
        body: JSON.stringify(newInquiry)
      });
    } catch (err) {
      console.error('Error recording inquiry:', err);
    }
  };

  // Import / Export
  const exportData = () => {
    const bundle = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      projects,
      siteContent
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grow-with-ayush-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.projects && Array.isArray(parsed.projects)) {
        setProjects(parsed.projects);
        fetch('/api/projects/reset', { method: 'POST' }).then(() => {
          parsed.projects.forEach((p: ProjectItem) => {
            fetch('/api/projects', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(p)
            });
          });
        });
      }
      if (parsed.siteContent && typeof parsed.siteContent === 'object') {
        updateSiteContent(parsed.siteContent);
      }
      return true;
    } catch (err) {
      console.error('Import failed:', err);
      return false;
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
        setCurrentView,
        activeProjectModal,
        openProjectModal: p => setActiveProjectModal(p),
        closeProjectModal: () => setActiveProjectModal(null),
        activeServiceModal,
        openServiceModal: s => setActiveServiceModal(s),
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