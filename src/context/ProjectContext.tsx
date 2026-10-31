import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProjectItem, InquiryItem, ServiceItem, SiteContent } from '../types';
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
  storageMode: string;
  isSupabaseConnected: boolean;
  syncStatus: 'synced' | 'saving' | 'error';
  lastSavedAt: string | null;
  isLoading: boolean;
  checkServerStatus: () => Promise<void>;
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

  // Projects and Site Content state loaded directly from server API
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent>(INITIAL_SITE_CONTENT);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Server sync state
  const [isServerConnected, setIsServerConnected] = useState<boolean>(false);
  const [storageMode, setStorageMode] = useState<string>('Persistent Storage (data/projects.json)');
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);
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

  const checkServerStatus = async () => {
    try {
      const statusRes = await fetch('/api/status').catch(() => null);
      if (statusRes && statusRes.ok) {
        const data = await statusRes.json();
        if (data.storageMode) setStorageMode(data.storageMode);
        setIsSupabaseConnected(Boolean(data.supabaseConnected));
        setIsServerConnected(true);
      }
    } catch {
      // ignore
    }
  };

  // Fetch data directly from backend Supabase API on mount
  useEffect(() => {
    let mounted = true;

    const loadServerData = async () => {
      setIsLoading(true);
      try {
        const [projRes, contentRes, inqRes, statusRes] = await Promise.all([
          fetch('/api/projects').catch(() => null),
          fetch('/api/content').catch(() => null),
          fetch('/api/inquiries').catch(() => null),
          fetch('/api/status').catch(() => null)
        ]);

        if (statusRes && statusRes.ok) {
          const statusData = await statusRes.json();
          if (mounted) {
            if (statusData.storageMode) setStorageMode(statusData.storageMode);
            setIsSupabaseConnected(Boolean(statusData.supabaseConnected));
          }
        }

        if (projRes && projRes.ok) {
          const projData = await projRes.json();
          if (mounted && Array.isArray(projData)) {
            setProjects(projData.map(p => ({
              ...p,
              visibility: { ...DEFAULT_VISIBILITY, ...(p.visibility || {}) }
            })));
            setIsServerConnected(true);
          }
        }

        if (contentRes && contentRes.ok) {
          const contentData = await contentRes.json();
          if (mounted && contentData && (contentData.brandName || contentData.hero)) {
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
        console.error('Error fetching data from server:', err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
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

  // Project CRUD Actions via Supabase API
  const addProject = (projectData: Omit<ProjectItem, 'id' | 'publishedAt'>) => {
    setSyncStatus('saving');
    fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData)
    })
      .then(res => (res.ok ? res.json() : null))
      .then(savedProject => {
        if (savedProject) {
          setProjects(prev => [
            {
              ...savedProject,
              visibility: { ...DEFAULT_VISIBILITY, ...(savedProject.visibility || {}) }
            },
            ...prev
          ]);
          setSyncStatus('synced');
          setLastSavedAt(new Date().toLocaleTimeString());
        } else {
          setSyncStatus('error');
        }
      })
      .catch(err => {
        console.error('Error adding project:', err);
        setSyncStatus('error');
      });
  };

  const updateProject = (id: string, updates: Partial<ProjectItem>) => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    setSyncStatus('saving');

    fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
      .then(res => {
        if (res.ok) {
          setSyncStatus('synced');
          setLastSavedAt(new Date().toLocaleTimeString());
        } else {
          setSyncStatus('error');
        }
      })
      .catch(err => {
        console.error('Error updating project:', err);
        setSyncStatus('error');
      });
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setSyncStatus('saving');

    fetch(`/api/projects/${id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (res.ok) {
          setSyncStatus('synced');
          setLastSavedAt(new Date().toLocaleTimeString());
        } else {
          setSyncStatus('error');
        }
      })
      .catch(err => {
        console.error('Error deleting project:', err);
        setSyncStatus('error');
      });
  };

  const resetToDefaults = () => {
    setSyncStatus('saving');
    fetch('/api/projects/reset', { method: 'POST' })
      .then(res => (res.ok ? res.json() : null))
      .then(defaults => {
        if (defaults) {
          setProjects(defaults);
          setSyncStatus('synced');
          setLastSavedAt(new Date().toLocaleTimeString());
        } else {
          setSyncStatus('error');
        }
      })
      .catch(() => setSyncStatus('error'));
  };

  // Site Content CRUD via Supabase API
  const updateSiteContent = (updated: Partial<SiteContent>) => {
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

    fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
      .then(res => (res.ok ? res.json() : null))
      .then(saved => {
        if (saved) {
          setSiteContent(saved);
          setSyncStatus('synced');
          setLastSavedAt(new Date().toLocaleTimeString());
        } else {
          setSyncStatus('error');
        }
      })
      .catch(err => {
        console.error('Error updating content:', err);
        setSyncStatus('error');
      });
  };

  const resetSiteContent = () => {
    setSyncStatus('saving');
    fetch('/api/content/reset', { method: 'POST' })
      .then(res => (res.ok ? res.json() : null))
      .then(defaults => {
        if (defaults) {
          setSiteContent(defaults);
          setSyncStatus('synced');
          setLastSavedAt(new Date().toLocaleTimeString());
        } else {
          setSyncStatus('error');
        }
      })
      .catch(() => setSyncStatus('error'));
  };

  // Inquiry submission
  const addInquiry = (inquiry: Omit<InquiryItem, 'id' | 'createdAt' | 'status'>) => {
    fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiry)
    })
      .then(res => (res.ok ? res.json() : null))
      .then(savedInquiry => {
        if (savedInquiry) {
          setInquiries(prev => [savedInquiry, ...prev]);
        }
      })
      .catch(err => {
        console.error('Error submitting inquiry:', err);
      });
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
      fetch('/api/projects/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      })
        .then(res => {
          if (res.ok) {
            Promise.all([
              fetch('/api/projects').then(r => r.json()),
              fetch('/api/content').then(r => r.json())
            ]).then(([freshProjects, freshContent]) => {
              if (Array.isArray(freshProjects)) setProjects(freshProjects);
              if (freshContent && typeof freshContent === 'object') setSiteContent(freshContent);
            });
          }
        })
        .catch(err => console.error('Error importing:', err));
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
        storageMode,
        isSupabaseConnected,
        syncStatus,
        lastSavedAt,
        isLoading,
        checkServerStatus
      }}
    >
      {isLoading ? (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-400 font-medium tracking-wide">Loading portfolio...</p>
        </div>
      ) : (
        children
      )}
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