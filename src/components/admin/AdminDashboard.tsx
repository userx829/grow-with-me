import React, { useState, useRef, useEffect } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { ProjectItem, ProjectCategory, SiteContent } from '../../types';
import { DEFAULT_SECTION_VISIBILITY } from '../../data/initialContent';
import {
  Plus,
  ArrowLeft,
  Download,
  Upload,
  RotateCcw,
  Pencil,
  Trash2,
  Play,
  Sparkles,
  Search,
  Check,
  Video,
  ExternalLink,
  MessageSquare,
  FileText,
  User,
  Layout,
  Layers,
  PhoneCall,
  Lock,
  ShieldCheck,
  Key,
  AlertTriangle,
  HelpCircle,
  Info,
  Youtube,
  Eye,
  EyeOff,
  Sliders,
  ArrowRight
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
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
    setCurrentView,
    openProjectModal,
    logoutAdmin,
    changeAdminPassword,
    isServerConnected,
    syncStatus,
    lastSavedAt
  } = useProjects();

  const [activeTab, setActiveTab] = useState<'catalog' | 'editor' | 'site-content' | 'inquiries' | 'security'>('catalog');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [previewMode, setPreviewMode] = useState<'card' | 'modal'>('card');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Site Content Editor Form State
  const [contentForm, setContentForm] = useState<SiteContent>(siteContent);
  const [activeContentSection, setActiveContentSection] = useState<'visibility' | 'hero' | 'about' | 'workflow' | 'contact' | 'brand'>('visibility');

  useEffect(() => {
    setContentForm(siteContent);
  }, [siteContent]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonImportRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const aboutImageInputRef = useRef<HTMLInputElement>(null);

  // Form State for editing or creating a project
  const initialFormState: Omit<ProjectItem, 'id' | 'publishedAt'> = {
    title: '',
    subtitle: '',
    category: 'youtube',
    categoryLabel: 'YouTube Long-form',
    aspectRatio: '16:9',
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByfGHprj-Axvdb7SyUAd1IPTA19UqlwpcS67Td6steWIRod16YXX8ddr0Gt1yojn5f6qo4oalJHzsatYNlsOpyA4rH7Ayge2KuE4-5LQ4wVyuJMuroYsoTy7rwTBauBxJOpSCaBKGXBFXohozQ_J-TFVsxh8KUV4QFqV-omaGCIVQDIo2gRHPN5XLeXtOD1BdOeGx3arx4GUvCY4EePV_O8NUnxZyJlN9vpWugGOdlhzc34i4rhh-p',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoType: 'direct',
    views: '500K',
    duration: '10 min',
    retentionRate: '72%',
    summary: 'Engaging narrative video edit with hook pacing and dynamic sound design.',
    clientName: 'Creator Channel',
    clientRole: 'Host & Producer',
    clientTestimonial: 'Ayush leveled up our production quality effortlessly.',
    caseStudyStory: 'Deep dive into the pacing structure and retention engineering deployed for this release.',
    techniques: ['Dynamic Sound Design', 'Pacing Calibration', 'Color Grading'],
    featured: false,
    visibility: {
      showTitle: true,
      showSubtitle: true,
      showSummary: true,
      showCategoryBadge: true,
      showMetrics: true,
      showClientInfo: true,
      showCaseStudy: true,
      showTechniques: true,
      showWatchButton: true,
      isPublished: true
    }
  };

  const [formData, setFormData] = useState<Omit<ProjectItem, 'id' | 'publishedAt'>>(initialFormState);
  const [techniquesInput, setTechniquesInput] = useState(initialFormState.techniques?.join(', ') || '');

  // Handle open editor for new
  const handleAddNew = () => {
    setEditingProjectId(null);
    setFormData(initialFormState);
    setTechniquesInput(initialFormState.techniques?.join(', ') || '');
    setActiveTab('editor');
  };

  // Handle open editor for existing
  const handleEdit = (project: ProjectItem) => {
    setEditingProjectId(project.id);
    setFormData({
      title: project.title,
      subtitle: project.subtitle,
      category: project.category,
      categoryLabel: project.categoryLabel,
      aspectRatio: project.aspectRatio || (project.category === 'shorts' ? '9:16' : '16:9'),
      thumbnailUrl: project.thumbnailUrl,
      videoUrl: project.videoUrl,
      videoType: project.videoType || 'direct',
      views: project.views,
      duration: project.duration,
      retentionRate: project.retentionRate || '',
      summary: project.summary,
      clientName: project.clientName || '',
      clientRole: project.clientRole || '',
      clientTestimonial: project.clientTestimonial || '',
      caseStudyStory: project.caseStudyStory || '',
      techniques: project.techniques || [],
      featured: project.featured || false,
      visibility: {
        showTitle: true,
        showSubtitle: true,
        showSummary: true,
        showCategoryBadge: true,
        showMetrics: true,
        showClientInfo: true,
        showCaseStudy: true,
        showTechniques: true,
        showWatchButton: true,
        isPublished: true,
        ...(project.visibility || {})
      }
    });
    setTechniquesInput(project.techniques?.join(', ') || '');
    setActiveTab('editor');
  };

  // Handle project form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const techniquesArray = techniquesInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const projectPayload = {
      ...formData,
      techniques: techniquesArray
    };

    if (editingProjectId) {
      updateProject(editingProjectId, projectPayload);
      showToast('Project updated & saved permanently to database!');
    } else {
      addProject(projectPayload);
      showToast('New video project saved permanently! Persists across refreshes & cloud deploys.');
    }

    setActiveTab('catalog');
  };

  // Handle saving website copy & sections
  const handleSaveContent = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteContent(contentForm);
    showToast('Website content saved permanently to persistent database!');
  };

  // Show temporary toast notification
  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Image compressor helper: shrinks high-res photos to high-performance web JPEGs (~100KB)
  const compressImage = (file: File, maxWidth = 1280, maxHeight = 720, quality = 0.85): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  // Helper to extract YouTube video ID from various link formats
  const extractYouTubeId = (url: string): string | null => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  };

  // Auto-fetch YouTube HD thumbnail
  const handleFetchYouTubeThumbnail = () => {
    const ytId = extractYouTubeId(formData.videoUrl || '');
    if (ytId) {
      const ytThumb = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
      setFormData(prev => ({ ...prev, thumbnailUrl: ytThumb }));
      showToast('Grabbed YouTube HD thumbnail! Visible to clients worldwide.');
    } else {
      showToast('Please enter a valid YouTube video link first');
    }
  };

  // Handle image upload from file system for project thumbnail
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      showToast('Optimizing and loading image...');
      const optimizedUrl = await compressImage(file, 1280, 720, 0.85);
      if (optimizedUrl) {
        setFormData(prev => ({ ...prev, thumbnailUrl: optimizedUrl }));
        showToast('Custom thumbnail ready and saved!');
      }
    }
  };

  // Handle about image upload
  const handleAboutImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      showToast('Optimizing portrait photo...');
      const optimizedUrl = await compressImage(file, 1000, 1250, 0.88);
      if (optimizedUrl) {
        setContentForm(prev => ({
          ...prev,
          about: { ...prev.about, imageUrl: optimizedUrl }
        }));
        showToast('Studio portrait photo updated!');
      }
    }
  };

  // Handle video upload from file system
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        videoUrl: objectUrl,
        videoType: 'uploaded'
      }));
      showToast('Local video attached! Ready to preview.');
    }
  };

  // Handle JSON Import
  const handleJsonImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (importData(text)) {
          showToast('Catalog and content imported successfully!');
        } else {
          alert('Invalid JSON structure. Please use a valid exported JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Filter projects in catalog
  const filteredCatalog = projects.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.clientName && p.clientName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#fafaf5] dark:bg-[#151715] text-[#1a1c19] dark:text-[#f1f1ec] pt-24 pb-20 px-6 lg:px-12 transition-colors">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2d5342] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-2">
          <Check className="w-4 h-4" />
          <span>{saveToast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Top Header & Navigation Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#eeeee9] dark:border-[#2a302a]">
          <div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('portfolio')}
                className="w-8 h-8 rounded-full bg-[#eeeee9] dark:bg-[#2a302a] flex items-center justify-center text-[#414844] dark:text-[#b9c1ba] hover:text-[#1a1c19] dark:hover:text-white transition-colors"
                title="Back to Public Portfolio"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Creator Studio Dashboard
              </h1>
              <span className="text-[11px] font-bold bg-[#2d5342] text-white px-2 py-0.5 rounded-full">
                ADMIN
              </span>
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border transition-all ${
                  syncStatus === 'saving'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                    : syncStatus === 'error'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                }`}
                title={lastSavedAt ? `Last saved at ${lastSavedAt}` : 'Live server database connected'}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    syncStatus === 'saving'
                      ? 'bg-amber-500 animate-pulse'
                      : syncStatus === 'error'
                      ? 'bg-rose-500'
                      : 'bg-emerald-500'
                  }`}
                />
                {syncStatus === 'saving'
                  ? 'Saving to Database...'
                  : isServerConnected
                  ? 'Cloud Database: Synced & Persistent'
                  : 'Database: Persistent'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#414844] dark:text-[#b9c1ba] mt-1">
              Upload videos, edit portfolio items, and customize website text with real-time preview.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleAddNew}
              className="bg-[#2d5342] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#456b59] transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Video</span>
            </button>

            <button
              onClick={() => setActiveTab('site-content')}
              className="bg-[#456b59] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#2d5342] transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>Edit Website Copy</span>
            </button>

            <button
              onClick={exportData}
              className="bg-[#eeeee9] dark:bg-[#2a302a] text-[#1a1c19] dark:text-[#f1f1ec] px-3.5 py-2 rounded-xl text-xs font-medium hover:bg-[#e2e3de] dark:hover:bg-[#333a33] transition-colors flex items-center gap-1.5"
              title="Download backup JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            <button
              onClick={() => jsonImportRef.current?.click()}
              className="bg-[#eeeee9] dark:bg-[#2a302a] text-[#1a1c19] dark:text-[#f1f1ec] px-3.5 py-2 rounded-xl text-xs font-medium hover:bg-[#e2e3de] dark:hover:bg-[#333a33] transition-colors flex items-center gap-1.5"
              title="Restore from JSON"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
            </button>
            <input
              type="file"
              ref={jsonImportRef}
              onChange={handleJsonImport}
              accept=".json"
              className="hidden"
            />

            <button
              onClick={() => {
                if (confirm('Reset entire portfolio and website copy back to defaults?')) {
                  resetToDefaults();
                  setContentForm(siteContent);
                  showToast('Reset to original sample data!');
                }
              }}
              className="bg-[#eeeee9] dark:bg-[#2a302a] text-[#875133] dark:text-[#feb692] px-3.5 py-2 rounded-xl text-xs font-medium hover:bg-[#e2e3de] dark:hover:bg-[#333a33] transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Reset to defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Lock admin dashboard and require passcode to enter?')) {
                  logoutAdmin();
                }
              }}
              className="bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer ml-auto sm:ml-0"
              title="Lock admin studio"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Studio</span>
            </button>
          </div>
        </div>

        {/* Studio Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#eeeee9] dark:border-[#2a302a] pb-3">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-[#2d5342] text-white shadow-sm'
                : 'text-[#414844] dark:text-[#b9c1ba] hover:bg-[#eeeee9] dark:hover:bg-[#2a302a]'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Content Catalog ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'editor'
                ? 'bg-[#2d5342] text-white shadow-sm'
                : 'text-[#414844] dark:text-[#b9c1ba] hover:bg-[#eeeee9] dark:hover:bg-[#2a302a]'
            }`}
          >
            <Pencil className="w-4 h-4" />
            <span>
              {editingProjectId ? 'Editing: ' + (formData.title || 'Untitled') : 'Video Piece Form Editor'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('site-content')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'site-content'
                ? 'bg-[#2d5342] text-white shadow-sm'
                : 'text-[#414844] dark:text-[#b9c1ba] hover:bg-[#eeeee9] dark:hover:bg-[#2a302a]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Website Copy &amp; Sections</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'security'
                ? 'bg-[#2d5342] text-white shadow-sm'
                : 'text-[#414844] dark:text-[#b9c1ba] hover:bg-[#eeeee9] dark:hover:bg-[#2a302a]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Security &amp; Passcode</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ml-auto cursor-pointer ${
              activeTab === 'inquiries'
                ? 'bg-[#2d5342] text-white shadow-sm'
                : 'text-[#414844] dark:text-[#b9c1ba] hover:bg-[#eeeee9] dark:hover:bg-[#2a302a]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Inquiries ({inquiries.length})</span>
          </button>
        </div>

        {/* TAB 1: CONTENT CATALOG */}
        {activeTab === 'catalog' && (
          <div className="flex flex-col gap-6">
            {/* Search and Filters Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#414844] dark:text-[#b9c1ba] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search by title, client, or details..."
                  className="w-full bg-[#f4f4ef] dark:bg-[#1c1f1c] pl-10 pr-4 py-2 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a] focus:outline-none focus:ring-2 focus:ring-[#2d5342]"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                {['all', 'youtube', 'shorts', 'cinematic', 'ads'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                      filterCategory === cat
                        ? 'bg-[#2d5342] text-white'
                        : 'bg-[#f4f4ef] dark:bg-[#1c1f1c] text-[#414844] dark:text-[#b9c1ba] hover:bg-[#eeeee9] dark:hover:bg-[#2a302a]'
                    }`}
                  >
                    {cat === 'all' ? 'All Formats' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {filteredCatalog.map(project => {
                const isVertical = project.aspectRatio === '9:16' || project.category === 'shorts';
                return (
                  <div
                    key={project.id}
                    className="bg-[#f4f4ef] dark:bg-[#1c1f1c] rounded-2xl overflow-hidden border border-[#eeeee9] dark:border-[#2a302a] flex flex-col justify-between shadow-sm group hover:border-[#2d5342]/40 transition-colors"
                  >
                    {/* Thumbnail & Media Info */}
                    <div className={`relative ${isVertical ? 'aspect-[9/16] max-h-[380px]' : 'aspect-video'} bg-black overflow-hidden`}>
                      <img
                        src={project.thumbnailUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between p-2.5">
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const current = project.visibility?.isPublished !== false;
                              updateProject(project.id, {
                                visibility: { ...(project.visibility || {}), isPublished: !current }
                              });
                              showToast(current ? `"${project.title}" hidden from portfolio` : `"${project.title}" published!`);
                            }}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 transition-all cursor-pointer shadow-sm ${
                              project.visibility?.isPublished !== false
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                : 'bg-amber-500 text-white hover:bg-amber-600'
                            }`}
                            title="Click to toggle Public / Hidden (Draft)"
                          >
                            {project.visibility?.isPublished !== false ? (
                              <>
                                <Eye className="w-3 h-3" />
                                <span>Live</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3" />
                                <span>Draft</span>
                              </>
                            )}
                          </button>

                          <div className="flex items-center gap-1">
                            {project.featured && (
                              <span className="text-[10px] font-bold bg-[#feb692] text-[#794529] px-2 py-0.5 rounded-full shadow-sm">
                                HERO
                              </span>
                            )}
                            <span className="text-[10px] font-semibold bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
                              {isVertical ? '9:16 Short' : '16:9 Video'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-white bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                            {project.categoryLabel}
                          </span>
                        </div>
                      </div>
                    </div>

                  {/* Body Info */}
                  <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                    <div>
                      {/* Hidden Flags Pills */}
                      {(project.visibility?.showTitle === false || project.visibility?.showSummary === false || project.visibility?.showMetrics === false) && (
                        <div className="flex flex-wrap gap-1 mb-1.5">
                          {project.visibility?.showTitle === false && (
                            <span className="text-[9px] bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                              <EyeOff className="w-2.5 h-2.5" /> Title Hidden
                            </span>
                          )}
                          {project.visibility?.showSummary === false && (
                            <span className="text-[9px] bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                              <EyeOff className="w-2.5 h-2.5" /> Desc Hidden
                            </span>
                          )}
                          {project.visibility?.showMetrics === false && (
                            <span className="text-[9px] bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                              <EyeOff className="w-2.5 h-2.5" /> Metrics Hidden
                            </span>
                          )}
                        </div>
                      )}

                      <h4 className="font-bold text-sm text-[#1a1c19] dark:text-[#f1f1ec] line-clamp-1">
                        {project.title}
                      </h4>
                      <p className="text-xs text-[#414844] dark:text-[#b9c1ba] line-clamp-2 mt-1">
                        {project.summary}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#414844] dark:text-[#b9c1ba] border-t border-[#eeeee9] dark:border-[#2a302a] pt-2.5">
                      <span>{project.views} views · {project.duration}</span>
                      <span className="font-semibold text-[#2d5342] dark:text-[#528c70]">{project.retentionRate || 'High'} ret.</span>
                    </div>

                    {/* Actions Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#eeeee9] dark:border-[#2a302a] gap-2">
                      <button
                        onClick={() => openProjectModal(project)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#eeeee9] dark:bg-[#2a302a] text-[#1a1c19] dark:text-[#f1f1ec] text-xs font-medium hover:bg-[#e2e3de] dark:hover:bg-[#333a33] flex items-center gap-1"
                        title="Preview Playback"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Play</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEdit(project)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#2d5342]/10 dark:bg-[#528c70]/20 text-[#2d5342] dark:text-[#528c70] text-xs font-semibold hover:bg-[#2d5342] hover:text-white transition-colors flex items-center gap-1"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Delete "${project.title}" from portfolio?`)) {
                              deleteProject(project.id);
                              showToast('Deleted project.');
                            }
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        )}

        {/* TAB 2: DEDICATED VIDEO PIECE FORM EDITOR WITH REAL-TIME PREVIEW */}
        {activeTab === 'editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: FORM-BASED INTERFACE */}
            <div className="lg:col-span-7 bg-[#f4f4ef] dark:bg-[#1c1f1c] p-6 sm:p-8 rounded-3xl border border-[#eeeee9] dark:border-[#2a302a] shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[#eeeee9] dark:border-[#2a302a] mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#1a1c19] dark:text-[#f1f1ec]">
                    {editingProjectId ? 'Edit Content Piece' : 'Upload New Content Piece'}
                  </h3>
                  <p className="text-xs text-[#414844] dark:text-[#b9c1ba]">
                    Changes reflect immediately in the live preview on the right.
                  </p>
                </div>
                {editingProjectId && (
                  <button
                    type="button"
                    onClick={handleAddNew}
                    className="text-xs font-semibold text-[#2d5342] dark:text-[#528c70] underline"
                  >
                    Switch to Create New
                  </button>
                )}
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-5">
                {/* Title & Subtitle */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Chasing Horizons: Solo in Kyoto"
                    className="w-full bg-[#fafaf5] dark:bg-[#151715] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a] focus:outline-none focus:ring-2 focus:ring-[#2d5342]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                      Subtitle / Hook
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                      placeholder="e.g. Atmospheric Travel Documentary"
                      className="w-full bg-[#fafaf5] dark:bg-[#151715] px-3.5 py-2.5 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a] focus:outline-none focus:ring-2 focus:ring-[#2d5342]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={e => {
                        const cat = e.target.value as ProjectCategory;
                        const labelMap: Record<ProjectCategory, string> = {
                          youtube: 'YouTube Long-form',
                          shorts: 'Shorts & Reels',
                          cinematic: 'Cinematic Film',
                          ads: 'Ads & Brand Films'
                        };
                        const autoRatio = cat === 'shorts' ? '9:16' : '16:9';
                        setFormData({
                          ...formData,
                          category: cat,
                          categoryLabel: labelMap[cat],
                          aspectRatio: autoRatio
                        });
                      }}
                      className="w-full bg-[#fafaf5] dark:bg-[#151715] px-3.5 py-2.5 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a] focus:outline-none focus:ring-2 focus:ring-[#2d5342]"
                    >
                      <option value="youtube">YouTube Long-form</option>
                      <option value="shorts">Shorts &amp; Reels</option>
                      <option value="cinematic">Cinematic Film</option>
                      <option value="ads">Ads &amp; Brand Films</option>
                    </select>
                  </div>
                </div>

                {/* Aspect Ratio Selector: 16:9 Horizontal vs 9:16 Vertical */}
                <div className="space-y-1.5 bg-[#fafaf5] dark:bg-[#151715] p-3.5 rounded-2xl border border-[#eeeee9] dark:border-[#2a302a]">
                  <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec] flex items-center justify-between">
                    <span>Display Aspect Ratio</span>
                    <span className="text-[10px] text-[#414844] dark:text-[#b9c1ba]">
                      {formData.aspectRatio === '9:16' || formData.category === 'shorts' ? '📱 9:16 Vertical (Shorts / Reels)' : '🖥️ 16:9 Horizontal (YouTube)'}
                    </span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, aspectRatio: '16:9' })}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                        formData.aspectRatio !== '9:16' && formData.category !== 'shorts'
                          ? 'bg-[#2d5342] text-white border-[#2d5342] shadow-sm'
                          : 'bg-[#fafaf5] dark:bg-[#151715] text-[#414844] dark:text-[#b9c1ba] border-[#eeeee9] dark:border-[#2a302a] hover:border-[#2d5342]/40'
                      }`}
                    >
                      <span className="w-4 h-2.5 border-2 border-current rounded-xs inline-block" />
                      <span>16:9 Horizontal (YouTube)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, aspectRatio: '9:16' })}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                        formData.aspectRatio === '9:16' || (formData.category === 'shorts' && formData.aspectRatio !== '16:9')
                          ? 'bg-[#2d5342] text-white border-[#2d5342] shadow-sm'
                          : 'bg-[#fafaf5] dark:bg-[#151715] text-[#414844] dark:text-[#b9c1ba] border-[#eeeee9] dark:border-[#2a302a] hover:border-[#2d5342]/40'
                      }`}
                    >
                      <span className="w-2.5 h-4 border-2 border-current rounded-xs inline-block" />
                      <span>9:16 Vertical (Shorts / Reels)</span>
                    </button>
                  </div>
                </div>

                {/* Thumbnail Source Picker */}
                <div className="space-y-2 bg-[#eeeee9]/40 dark:bg-[#202420]/40 p-3.5 rounded-2xl border border-[#eeeee9] dark:border-[#2a302a]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-xs font-bold text-[#1a1c19] dark:text-[#f1f1ec] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#2d5342] dark:text-[#528c70]" />
                      <span>Thumbnail Image (What Clients See in the Grid)</span>
                    </label>

                    <div className="flex items-center gap-2">
                      {extractYouTubeId(formData.videoUrl || '') && (
                        <button
                          type="button"
                          onClick={handleFetchYouTubeThumbnail}
                          className="text-[11px] font-bold bg-[#2d5342] text-white hover:bg-[#456b59] px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-sm active:scale-95"
                          title="Instantly retrieve YouTube's official HD thumbnail"
                        >
                          <Youtube className="w-3.5 h-3.5" />
                          <span>Auto-Grab YouTube Thumbnail</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[11px] font-semibold text-[#2d5342] dark:text-[#528c70] bg-[#fafaf5] dark:bg-[#151715] hover:bg-[#e2e3de] dark:hover:bg-[#2a302a] px-2.5 py-1 rounded-lg border border-[#eeeee9] dark:border-[#2a302a] flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Upload Custom Image</span>
                      </button>
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>

                  <input
                    type="url"
                    required
                    value={formData.thumbnailUrl}
                    onChange={e => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    placeholder="https://img.youtube.com/... or paste image web link"
                    className="w-full bg-[#fafaf5] dark:bg-[#151715] px-3.5 py-2.5 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a] focus:outline-none focus:ring-2 focus:ring-[#2d5342]"
                  />

                  {/* Thumbnail Hosting & Client Visibility Explanation */}
                  <div className="text-[10px] text-[#414844] dark:text-[#b9c1ba] space-y-1 bg-[#fafaf5] dark:bg-[#151715] p-2.5 rounded-xl border border-[#eeeee9] dark:border-[#2a302a]">
                    <p className="font-semibold text-[#1a1c19] dark:text-[#f1f1ec] flex items-center gap-1">
                      <Info className="w-3 h-3 text-[#2d5342] dark:text-[#528c70]" />
                      <span>Where thumbnails live &amp; how your clients see them:</span>
                    </p>
                    <ul className="pl-3.5 list-disc space-y-0.5">
                      <li>
                        <strong>YouTube Thumbnail (Recommended):</strong> Clicking <em>Auto-Grab</em> uses YouTube&apos;s global CDN (<code className="font-mono text-[9px] bg-gray-100 dark:bg-gray-800 px-1 py-0.2 rounded">img.youtube.com</code>). 100% visible to all clients worldwide with zero load time.
                      </li>
                      <li>
                        <strong>Custom Upload:</strong> Uploading from your PC automatically compresses and embeds the photo directly into your site data so visitors can see it.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Video Media Source Picker with Client Guidance */}
                <div className="space-y-3 bg-[#eeeee9]/50 dark:bg-[#232723]/50 p-4 rounded-2xl border border-[#eeeee9] dark:border-[#2a302a]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-xs font-bold text-[#1a1c19] dark:text-[#f1f1ec] flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-[#2d5342] dark:text-[#528c70]" />
                      <span>Video Source for Clients</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => videoFileInputRef.current?.click()}
                      className="text-[11px] font-semibold text-[#875133] dark:text-[#feb692] flex items-center gap-1 hover:underline cursor-pointer bg-[#fafaf5] dark:bg-[#1c1f1c] px-2.5 py-1 rounded-lg border border-[#eeeee9] dark:border-[#2a302a]"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Attach local test file (PC)</span>
                    </button>
                    <input
                      type="file"
                      ref={videoFileInputRef}
                      onChange={handleVideoUpload}
                      accept="video/mp4,video/webm,video/quicktime"
                      className="hidden"
                    />
                  </div>

                  {/* Input Field */}
                  <input
                    type="text"
                    value={formData.videoUrl || ''}
                    onChange={e => {
                      const val = e.target.value;
                      const ytId = extractYouTubeId(val);
                      setFormData(prev => ({
                        ...prev,
                        videoUrl: val,
                        videoType: 'direct',
                        ...(ytId && (!prev.thumbnailUrl || prev.thumbnailUrl.includes('googleusercontent.com') || prev.thumbnailUrl.includes('img.youtube.com'))
                          ? { thumbnailUrl: `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` }
                          : {})
                      }));
                    }}
                    placeholder="https://youtube.com/watch?v=... or https://vimeo.com/... or MP4 link"
                    className="w-full bg-[#fafaf5] dark:bg-[#151715] px-3.5 py-2.5 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a] focus:outline-none focus:ring-2 focus:ring-[#2d5342]"
                  />

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-medium text-[#414844] dark:text-[#b9c1ba]">
                      Quick formats:
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })}
                      className="text-[10px] bg-[#fafaf5] dark:bg-[#151715] hover:bg-[#eeeee9] dark:hover:bg-[#2a302a] text-[#1a1c19] dark:text-[#f1f1ec] px-2 py-0.5 rounded-md border border-[#eeeee9] dark:border-[#2a302a] transition-colors cursor-pointer"
                    >
                      YouTube Example
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, videoUrl: 'https://vimeo.com/76979871' })}
                      className="text-[10px] bg-[#fafaf5] dark:bg-[#151715] hover:bg-[#eeeee9] dark:hover:bg-[#2a302a] text-[#1a1c19] dark:text-[#f1f1ec] px-2 py-0.5 rounded-md border border-[#eeeee9] dark:border-[#2a302a] transition-colors cursor-pointer"
                    >
                      Vimeo Example
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' })}
                      className="text-[10px] bg-[#fafaf5] dark:bg-[#151715] hover:bg-[#eeeee9] dark:hover:bg-[#2a302a] text-[#1a1c19] dark:text-[#f1f1ec] px-2 py-0.5 rounded-md border border-[#eeeee9] dark:border-[#2a302a] transition-colors cursor-pointer"
                    >
                      Direct MP4 Example
                    </button>
                  </div>

                  {/* Local Blob Warning Alert */}
                  {formData.videoUrl?.startsWith('blob:') && (
                    <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl p-3 text-xs text-amber-900 dark:text-amber-200 space-y-1 animate-in fade-in">
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span>Why Clients Cannot See Local PC Uploads:</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                        You selected a file from your computer's hard drive (<code className="font-mono text-[10px] bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded">blob:...</code>). This file only exists in the temporary RAM of this browser tab. <strong>Clients and mobile visitors on the internet cannot access files on your computer.</strong>
                      </p>
                      <p className="text-[11px] font-semibold text-amber-900 dark:text-amber-100 pt-0.5">
                        👉 To make this video playable by clients worldwide: Upload the video to YouTube (set Visibility to "Unlisted") or Vimeo, and paste that link in the box above!
                      </p>
                    </div>
                  )}

                  {/* How Clients View Videos Educational Explainer */}
                  <div className="bg-[#fafaf5] dark:bg-[#151715] rounded-xl p-3 border border-[#eeeee9] dark:border-[#2a302a] text-[11px] space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-[#1a1c19] dark:text-[#f1f1ec]">
                      <Info className="w-3.5 h-3.5 text-[#2d5342] dark:text-[#528c70] shrink-0" />
                      <span>How Video Hosting Works for Your Portfolio:</span>
                    </div>
                    <ul className="text-[#414844] dark:text-[#b9c1ba] space-y-1 pl-4 list-disc">
                      <li>
                        <strong className="text-[#1a1c19] dark:text-[#f1f1ec]">YouTube (Unlisted) — Recommended:</strong> Free, unlimited 4K video, zero buffering, and works on all phones and laptops. Setting it to <em>Unlisted</em> keeps it hidden from YouTube public searches—only clients clicking on your website can watch it.
                      </li>
                      <li>
                        <strong className="text-[#1a1c19] dark:text-[#f1f1ec]">Vimeo:</strong> Clean, ad-free player preferred by commercial video editors.
                      </li>
                      <li>
                        <strong className="text-[#1a1c19] dark:text-[#f1f1ec]">Direct MP4 or Google Drive:</strong> Any publicly accessible CDN or shared file link.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Key Metrics: Views, Duration, Retention */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                      Views
                    </label>
                    <input
                      type="text"
                      value={formData.views}
                      onChange={e => setFormData({ ...formData, views: e.target.value })}
                      placeholder="1.2M"
                      className="w-full bg-[#fafaf5] dark:bg-[#151715] px-3 py-2 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={e => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="14 min"
                      className="w-full bg-[#fafaf5] dark:bg-[#151715] px-3 py-2 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                      Retention Rate
                    </label>
                    <input
                      type="text"
                      value={formData.retentionRate || ''}
                      onChange={e => setFormData({ ...formData, retentionRate: e.target.value })}
                      placeholder="72%"
                      className="w-full bg-[#fafaf5] dark:bg-[#151715] px-3 py-2 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a]"
                    />
                  </div>
                </div>

                {/* Short Summary */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                    Card Summary (shown on portfolio grid)
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.summary}
                    onChange={e => setFormData({ ...formData, summary: e.target.value })}
                    placeholder="Short description of the edit..."
                    className="w-full bg-[#fafaf5] dark:bg-[#151715] px-3.5 py-2 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a] resize-none"
                  />
                </div>

                {/* Case Study Detailed Story */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                    Case Study Story &amp; Strategy
                  </label>
                  <textarea
                    rows={3}
                    value={formData.caseStudyStory || ''}
                    onChange={e => setFormData({ ...formData, caseStudyStory: e.target.value })}
                    placeholder="Explain the narrative flow, hook pacing, retention strategies used..."
                    className="w-full bg-[#fafaf5] dark:bg-[#151715] px-3.5 py-2 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a] resize-none"
                  />
                </div>

                {/* Techniques */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                    Applied Editing Techniques (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={techniquesInput}
                    onChange={e => setTechniquesInput(e.target.value)}
                    placeholder="e.g. Foley Sound Design, Macro Speed Ramps, Kinetic Typography"
                    className="w-full bg-[#fafaf5] dark:bg-[#151715] px-3.5 py-2 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a]"
                  />
                </div>

                {/* Client Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                      Client / Creator Name
                    </label>
                    <input
                      type="text"
                      value={formData.clientName || ''}
                      onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                      placeholder="e.g. Julian Drake"
                      className="w-full bg-[#fafaf5] dark:bg-[#151715] px-3 py-2 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                      Client Role / Channel
                    </label>
                    <input
                      type="text"
                      value={formData.clientRole || ''}
                      onChange={e => setFormData({ ...formData, clientRole: e.target.value })}
                      placeholder="e.g. Tech YouTuber (450K Subs)"
                      className="w-full bg-[#fafaf5] dark:bg-[#151715] px-3 py-2 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                    Client Testimonial Quote
                  </label>
                  <input
                    type="text"
                    value={formData.clientTestimonial || ''}
                    onChange={e => setFormData({ ...formData, clientTestimonial: e.target.value })}
                    placeholder="e.g. Ayush completely transformed our channel retention..."
                    className="w-full bg-[#fafaf5] dark:bg-[#151715] px-3.5 py-2 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a]"
                  />
                </div>

                {/* Featured on Hero Toggle */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#2d5342] focus:ring-[#2d5342]"
                  />
                  <label htmlFor="featured" className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec] cursor-pointer">
                    Feature on Homepage Hero (Highlights Card)
                  </label>
                </div>

                {/* CREATIVE VISIBILITY & DISPLAY CONTROLS */}
                <div className="bg-[#fafaf5] dark:bg-[#151715] p-5 rounded-2xl border border-[#eeeee9] dark:border-[#2a302a] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#eeeee9] dark:border-[#2a302a] pb-3">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#2d5342] dark:text-[#528c70]" />
                      <h4 className="text-xs font-bold text-[#1a1c19] dark:text-[#f1f1ec]">
                        Creative Visibility &amp; Display Controls
                      </h4>
                    </div>
                    <span className="text-[10px] text-[#414844] dark:text-[#b9c1ba]">
                      Show/hide elements on this video piece
                    </span>
                  </div>

                  {/* Master Publish Status */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#eeeee9]/60 dark:bg-[#2a302a]/60 border border-[#eeeee9] dark:border-[#2a302a]">
                    <div>
                      <p className="text-xs font-bold text-[#1a1c19] dark:text-[#f1f1ec] flex items-center gap-1.5">
                        <span>Public Status:</span>
                        {formData.visibility?.isPublished !== false ? (
                          <span className="text-[10px] bg-[#2d5342] text-white px-2 py-0.5 rounded-full font-semibold">
                            Visible to Clients (Published)
                          </span>
                        ) : (
                          <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-semibold">
                            Hidden / Draft Mode
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-[#414844] dark:text-[#b9c1ba] mt-0.5">
                        Turn off to hide this entire video card from the website portfolio.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.visibility?.isPublished !== false}
                        onChange={e =>
                          setFormData(prev => ({
                            ...prev,
                            visibility: { ...prev.visibility, isPublished: e.target.checked }
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2d5342]"></div>
                    </label>
                  </div>

                  {/* Granular Field Show/Hide Switches */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {[
                      { key: 'showTitle', label: 'Show Title', desc: 'Display headline in card & modal' },
                      { key: 'showSubtitle', label: 'Show Subtitle', desc: 'Display hook text in hero/modal' },
                      { key: 'showSummary', label: 'Show Description', desc: 'Display summary description' },
                      { key: 'showCategoryBadge', label: 'Show Category Badge', desc: 'Display YouTube/Reels tag pill' },
                      { key: 'showMetrics', label: 'Show Metrics (Views, Ret.)', desc: 'Display view count & duration' },
                      { key: 'showWatchButton', label: 'Show "Watch Video" Button', desc: 'Display action button on card' },
                      { key: 'showCaseStudy', label: 'Show Strategy Story', desc: 'Display case study in modal' },
                      { key: 'showTechniques', label: 'Show Technique Badges', desc: 'Display editing technique tags' },
                      { key: 'showClientInfo', label: 'Show Client Quote', desc: 'Display testimonial & client name' }
                    ].map(item => {
                      const isVisible = (formData.visibility as any)?.[item.key] !== false;
                      return (
                        <div
                          key={item.key}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-[#fafaf5] dark:bg-[#151715] border border-[#eeeee9] dark:border-[#2a302a]"
                        >
                          <div className="pr-2">
                            <p className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec] flex items-center gap-1.5">
                              {isVisible ? (
                                <Eye className="w-3.5 h-3.5 text-[#2d5342] dark:text-[#528c70] shrink-0" />
                              ) : (
                                <EyeOff className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              )}
                              <span>{item.label}</span>
                            </p>
                            <p className="text-[10px] text-[#414844] dark:text-[#b9c1ba] truncate">{item.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer shrink-0">
                            <input
                              type="checkbox"
                              checked={isVisible}
                              onChange={e =>
                                setFormData(prev => ({
                                  ...prev,
                                  visibility: { ...prev.visibility, [item.key]: e.target.checked }
                                }))
                              }
                              className="sr-only peer"
                            />
                            <div className="w-8 h-4 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#2d5342]"></div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-[#eeeee9] dark:border-[#2a302a]">
                  <button
                    type="submit"
                    className="bg-[#2d5342] text-white px-6 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#456b59] transition-all flex items-center gap-2 shadow-sm active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingProjectId ? 'Save Changes' : 'Publish Content Piece'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('catalog')}
                    className="bg-[#eeeee9] dark:bg-[#2a302a] text-[#414844] dark:text-[#b9c1ba] px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#e2e3de] dark:hover:bg-[#333a33] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            {/* RIGHT COLUMN: REAL-TIME PREVIEW PANE */}
            <div className="lg:col-span-5 flex flex-col gap-4 sticky top-28">
              <div className="flex items-center justify-between bg-[#f4f4ef] dark:bg-[#1c1f1c] p-2.5 rounded-2xl border border-[#eeeee9] dark:border-[#2a302a]">
                <div className="pl-1">
                  <span className="text-xs font-bold text-[#1a1c19] dark:text-[#f1f1ec] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#2d5342] dark:text-[#528c70]" />
                    <span>Live Client View Preview</span>
                  </span>
                  <p className="text-[10px] text-[#414844] dark:text-[#b9c1ba]">
                    Exact client view — hidden items are 100% invisible
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-[#fafaf5] dark:bg-[#151715] p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setPreviewMode('card')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      previewMode === 'card'
                        ? 'bg-[#2d5342] text-white'
                        : 'text-[#414844] dark:text-[#b9c1ba]'
                    }`}
                  >
                    Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode('modal')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      previewMode === 'modal'
                        ? 'bg-[#2d5342] text-white'
                        : 'text-[#414844] dark:text-[#b9c1ba]'
                    }`}
                  >
                    Player Modal
                  </button>
                </div>
              </div>

              {/* CARD PREVIEW */}
              {previewMode === 'card' && (
                <div className="bg-[#fafaf5] dark:bg-[#151715] rounded-2xl overflow-hidden shadow-md border border-[#eeeee9] dark:border-[#2a302a] flex flex-col">
                  {formData.visibility?.isPublished === false && (
                    <div className="bg-amber-500 text-white text-[10px] font-bold py-1 px-3 text-center uppercase tracking-wider flex items-center justify-center gap-1">
                      <EyeOff className="w-3 h-3" />
                      <span>Draft Mode — Hidden from Public Website</span>
                    </div>
                  )}

                  {(() => {
                    const isFormVertical = formData.aspectRatio === '9:16' || formData.category === 'shorts';
                    return (
                      <div className={`relative overflow-hidden w-full ${isFormVertical ? 'aspect-[9/16] max-h-[480px]' : 'aspect-video'} bg-[#2d5342]/10 dark:bg-[#2a302a]`}>
                        <img
                          src={formData.thumbnailUrl}
                          alt={formData.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-white/90 text-[#1a1c19] flex items-center justify-center shadow-lg">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </div>
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          {formData.visibility?.showCategoryBadge !== false && (
                            <span className="bg-[#fafaf5]/90 dark:bg-[#151715]/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold text-[#2d5342] dark:text-[#528c70]">
                              {formData.categoryLabel || formData.category}
                            </span>
                          )}
                          {isFormVertical && (
                            <span className="bg-black/70 text-white px-2 py-0.5 rounded text-[10px] font-semibold">
                              9:16 Vertical
                            </span>
                          )}
                        </div>
                        {formData.visibility?.showMetrics !== false && formData.retentionRate && (
                          <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-medium text-white/90">
                            {formData.retentionRate} Retention
                          </span>
                        )}
                      </div>
                    );
                  })()}

                  {/* Card Content Body */}
                  {(formData.visibility?.showTitle !== false || formData.visibility?.showSummary !== false || formData.visibility?.showMetrics !== false || (contentForm.visibility?.showPortfolioWatchButton !== false && formData.visibility?.showWatchButton !== false)) && (
                    <div className="p-5 flex flex-col gap-3">
                      {(formData.visibility?.showTitle !== false || formData.visibility?.showSummary !== false) && (
                        <div>
                          {formData.visibility?.showTitle !== false && (
                            <h4 className="text-base font-bold text-[#1a1c19] dark:text-[#f1f1ec]">
                              {formData.title || 'Untitled Video Title'}
                            </h4>
                          )}
                          {formData.visibility?.showSummary !== false && (
                            <p className="text-xs text-[#414844] dark:text-[#b9c1ba] line-clamp-2 mt-1">
                              {formData.summary || 'Summary description will appear here as you type...'}
                            </p>
                          )}
                        </div>
                      )}

                      {(formData.visibility?.showMetrics !== false || (contentForm.visibility?.showPortfolioWatchButton !== false && formData.visibility?.showWatchButton !== false)) && (
                        <div className="flex items-center justify-between pt-3 border-t border-[#eeeee9] dark:border-[#2a302a] text-xs">
                          {formData.visibility?.showMetrics !== false ? (
                            <span className="text-[#414844] dark:text-[#b9c1ba]">
                              {formData.views || '0'} Views • {formData.duration || '0 min'}
                            </span>
                          ) : (
                            <span />
                          )}
                          {contentForm.visibility?.showPortfolioWatchButton !== false && formData.visibility?.showWatchButton !== false && (
                            <span className="font-semibold text-[#2d5342] dark:text-[#528c70] flex items-center gap-1">
                              {contentForm.visibility?.portfolioWatchButtonText || 'Watch Video'}
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* MODAL PREVIEW */}
              {previewMode === 'modal' && (
                <div className="bg-[#fafaf5] dark:bg-[#151715] rounded-2xl overflow-hidden shadow-md border border-[#eeeee9] dark:border-[#2a302a] p-4 flex flex-col gap-4">
                  {formData.visibility?.isPublished === false && (
                    <div className="bg-amber-500 text-white text-[10px] font-bold py-1 px-3 text-center uppercase tracking-wider flex items-center justify-center gap-1 rounded-lg">
                      <EyeOff className="w-3 h-3" />
                      <span>Draft Mode (Hidden from public)</span>
                    </div>
                  )}

                  {(() => {
                    const isFormVertical = formData.aspectRatio === '9:16' || formData.category === 'shorts';
                    return (
                      <div className={`${isFormVertical ? 'aspect-[9/16] max-h-[380px] w-auto mx-auto ring-1 ring-white/10' : 'aspect-video w-full'} rounded-xl overflow-hidden bg-black relative flex items-center justify-center`}>
                        {formData.videoUrl?.includes('youtube') ? (
                          <div className="text-white text-xs text-center p-4">
                            <Play className="w-8 h-8 mx-auto mb-2 text-[#2d5342]" />
                            <p className="font-semibold">{isFormVertical ? 'YouTube Short Embed Ready' : 'YouTube Embed Ready'}</p>
                            <p className="text-[10px] text-white/70 truncate">{formData.videoUrl}</p>
                          </div>
                        ) : formData.videoUrl ? (
                          <video
                            src={formData.videoUrl}
                            controls
                            className="w-full h-full object-contain"
                            poster={formData.thumbnailUrl}
                          />
                        ) : (
                          <div className="text-white text-xs text-center">
                            <Play className="w-8 h-8 mx-auto mb-2 text-white/40" />
                            <p>No video attached</p>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  <div className="space-y-2">
                    {formData.visibility?.showCategoryBadge !== false && (
                      <span className="text-[10px] font-bold uppercase text-[#2d5342] dark:text-[#528c70]">
                        {formData.categoryLabel}
                      </span>
                    )}
                    {formData.visibility?.showTitle !== false && (
                      <h4 className="text-sm font-bold text-[#1a1c19] dark:text-[#f1f1ec]">
                        {formData.title || 'Untitled Project'}
                      </h4>
                    )}
                    {formData.visibility?.showCaseStudy !== false && (
                      <p className="text-xs text-[#414844] dark:text-[#b9c1ba] line-clamp-3">
                        {formData.caseStudyStory || formData.summary}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: DEDICATED WEBSITE SECTIONS & COPY EDITOR (About, Hero, Workflow, Contact) */}
        {activeTab === 'site-content' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: SECTIONS FORM */}
            <div className="lg:col-span-7 bg-[#f4f4ef] dark:bg-[#1c1f1c] p-6 sm:p-8 rounded-3xl border border-[#eeeee9] dark:border-[#2a302a] shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[#eeeee9] dark:border-[#2a302a] mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#1a1c19] dark:text-[#f1f1ec]">
                    Website Sections &amp; Copy Editor
                  </h3>
                  <p className="text-xs text-[#414844] dark:text-[#b9c1ba]">
                    Customize the &ldquo;About Me&rdquo;, &ldquo;Hero&rdquo;, and other website details in real time.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Reset website copy back to defaults?')) {
                      resetSiteContent();
                      showToast('Website copy reset to defaults!');
                    }
                  }}
                  className="text-xs font-semibold text-[#875133] dark:text-[#feb692] hover:underline"
                >
                  Reset Copy
                </button>
              </div>

              {/* Sub-Tabs for Section Selection */}
              <div className="flex items-center gap-1.5 p-1 bg-[#fafaf5] dark:bg-[#151715] rounded-xl border border-[#eeeee9] dark:border-[#2a302a] mb-6 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveContentSection('visibility')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeContentSection === 'visibility'
                      ? 'bg-[#2d5342] text-white shadow-sm'
                      : 'text-[#414844] dark:text-[#b9c1ba] hover:text-[#1a1c19] dark:hover:text-white'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Sections &amp; Layout Visibility</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveContentSection('about')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeContentSection === 'about'
                      ? 'bg-[#2d5342] text-white shadow-sm'
                      : 'text-[#414844] dark:text-[#b9c1ba] hover:text-[#1a1c19] dark:hover:text-white'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>About Me</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveContentSection('hero')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeContentSection === 'hero'
                      ? 'bg-[#2d5342] text-white shadow-sm'
                      : 'text-[#414844] dark:text-[#b9c1ba] hover:text-[#1a1c19] dark:hover:text-white'
                  }`}
                >
                  <Layout className="w-3.5 h-3.5" />
                  <span>Hero Section</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveContentSection('workflow')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeContentSection === 'workflow'
                      ? 'bg-[#2d5342] text-white shadow-sm'
                      : 'text-[#414844] dark:text-[#b9c1ba] hover:text-[#1a1c19] dark:hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Workflow</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveContentSection('contact')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeContentSection === 'contact'
                      ? 'bg-[#2d5342] text-white shadow-sm'
                      : 'text-[#414844] dark:text-[#b9c1ba] hover:text-[#1a1c19] dark:hover:text-white'
                  }`}
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Contact &amp; Brand</span>
                </button>
              </div>

              <form onSubmit={handleSaveContent} className="space-y-6">
                {/* 0. MASTER SECTIONS & GRANULAR ELEMENT VISIBILITY CONTROLS */}
                {activeContentSection === 'visibility' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="bg-[#eeeee9]/60 dark:bg-[#2a302a]/60 p-4 rounded-2xl border border-[#eeeee9] dark:border-[#2a302a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-[#1a1c19] dark:text-[#f1f1ec] flex items-center gap-1.5">
                          <Sliders className="w-4 h-4 text-[#2d5342] dark:text-[#528c70]" />
                          <span>Creative Control Center</span>
                        </h4>
                        <p className="text-[11px] text-[#414844] dark:text-[#b9c1ba] mt-0.5">
                          Turn entire sections or individual titles, descriptions, buttons, photos, and badges ON or OFF.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setContentForm(prev => ({
                            ...prev,
                            visibility: { ...DEFAULT_SECTION_VISIBILITY }
                          }));
                          showToast('All sections and elements enabled!');
                        }}
                        className="text-[11px] font-semibold text-[#2d5342] dark:text-[#528c70] underline cursor-pointer hover:opacity-80 shrink-0"
                      >
                        Reset / Show All Elements
                      </button>
                    </div>

                    {/* MASTER SECTIONS SWITCHES */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-[#1a1c19] dark:text-[#f1f1ec] uppercase tracking-wider flex items-center justify-between">
                        <span>1. Major Website Sections</span>
                        <span className="text-[10px] text-[#414844] dark:text-[#b9c1ba] font-normal lowercase">
                          (navigation auto-adapts)
                        </span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { key: 'showHeroSection', label: 'Hero Section', desc: 'Main headline, CTAs, and showreel card' },
                          { key: 'showPortfolioSection', label: 'Portfolio (My Work)', desc: 'Interactive video catalog & categories' },
                          { key: 'showAboutSection', label: 'About Me Section', desc: 'Story, portrait photo, and milestones' },
                          { key: 'showServicesSection', label: 'Services Section', desc: 'Video editing offerings & packages' },
                          { key: 'showWorkflowSection', label: 'Workflow Process', desc: '4-step collaborative process' },
                          { key: 'showTestimonialsSection', label: 'Client Testimonials', desc: 'Creator & partner reviews' },
                          { key: 'showContactSection', label: 'Contact Section', desc: 'Inquiry form, WhatsApp & email' }
                        ].map(sec => {
                          const isSecVisible = (contentForm.visibility as any)?.[sec.key] !== false;
                          return (
                            <div
                              key={sec.key}
                              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                                isSecVisible
                                  ? 'bg-[#fafaf5] dark:bg-[#151715] border-[#2d5342]/30 dark:border-[#528c70]/30 shadow-sm'
                                  : 'bg-[#eeeee9]/40 dark:bg-[#202420]/40 border-dashed border-[#eeeee9] dark:border-[#2a302a] opacity-75'
                              }`}
                            >
                              <div className="pr-2">
                                <p className="text-xs font-bold text-[#1a1c19] dark:text-[#f1f1ec] flex items-center gap-1.5">
                                  {isSecVisible ? (
                                    <span className="w-2 h-2 rounded-full bg-[#2d5342] dark:bg-[#528c70]" />
                                  ) : (
                                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                                  )}
                                  <span>{sec.label}</span>
                                </p>
                                <p className="text-[10px] text-[#414844] dark:text-[#b9c1ba] mt-0.5">{sec.desc}</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                <input
                                  type="checkbox"
                                  checked={isSecVisible}
                                  onChange={e =>
                                    setContentForm(prev => ({
                                      ...prev,
                                      visibility: { ...prev.visibility, [sec.key]: e.target.checked } as any
                                    }))
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2d5342]"></div>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* HERO GRANULAR CONTROLS */}
                    <div className="space-y-3 bg-[#fafaf5] dark:bg-[#151715] p-4 sm:p-5 rounded-2xl border border-[#eeeee9] dark:border-[#2a302a]">
                      <h4 className="text-xs font-bold text-[#1a1c19] dark:text-[#f1f1ec] flex items-center gap-1.5">
                        <Layout className="w-3.5 h-3.5 text-[#2d5342] dark:text-[#528c70]" />
                        <span>Hero Section Element Visibility</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {[
                          { key: 'showHeroBadge', label: 'Badge Tag ("Video Editor")', desc: 'Pulsing pill at top of hero' },
                          { key: 'showHeroHeadline', label: 'Hero Headline', desc: '"Your Vision. My Edit."' },
                          { key: 'showHeroSubtitle', label: 'Hero Subtitle Paragraph', desc: 'Narrative description text' },
                          { key: 'showHeroCtaButtons', label: 'CTA Action Buttons', desc: '"Explore Work" & "Contact"' },
                          { key: 'showHeroStats', label: 'Stats Counters (50M+ Views)', desc: '3 performance metric boxes' },
                          { key: 'showHeroFeaturedCard', label: 'Featured Showreel Card', desc: 'Right column interactive card' }
                        ].map(elem => {
                          const isElemVisible = (contentForm.visibility as any)?.[elem.key] !== false;
                          return (
                            <div key={elem.key} className="flex items-center justify-between p-2.5 rounded-xl bg-[#eeeee9]/40 dark:bg-[#202420]/50 border border-[#eeeee9] dark:border-[#2a302a]">
                              <div>
                                <p className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec] flex items-center gap-1">
                                  {isElemVisible ? <Eye className="w-3 h-3 text-[#2d5342] dark:text-[#528c70]" /> : <EyeOff className="w-3 h-3 text-rose-500" />}
                                  <span>{elem.label}</span>
                                </p>
                                <p className="text-[10px] text-[#414844] dark:text-[#b9c1ba]">{elem.desc}</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-2">
                                <input
                                  type="checkbox"
                                  checked={isElemVisible}
                                  onChange={e =>
                                    setContentForm(prev => ({
                                      ...prev,
                                      visibility: { ...prev.visibility, [elem.key]: e.target.checked } as any
                                    }))
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-8 h-4 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#2d5342]"></div>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* PORTFOLIO GRANULAR CONTROLS */}
                    <div className="space-y-3 bg-[#fafaf5] dark:bg-[#151715] p-4 sm:p-5 rounded-2xl border border-[#eeeee9] dark:border-[#2a302a]">
                      <h4 className="text-xs font-bold text-[#1a1c19] dark:text-[#f1f1ec] flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-[#2d5342] dark:text-[#528c70]" />
                        <span>Portfolio (Selected Work) Element Visibility</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {[
                          { key: 'showPortfolioKicker', label: 'Section Kicker ("PORTFOLIO")', desc: 'Small uppercase tag above title' },
                          { key: 'showPortfolioTitle', label: 'Section Title ("A Few Things...")', desc: 'Main portfolio headline' },
                          { key: 'showPortfolioFilters', label: 'Category Filter Tabs', desc: 'All, YouTube, Shorts, Cinematic, Ads pills' },
                          { key: 'showPortfolioWatchButton', label: '"Watch Video / Case Study" Button', desc: 'CTA button on bottom of project cards' }
                        ].map(elem => {
                          const isElemVisible = (contentForm.visibility as any)?.[elem.key] !== false;
                          return (
                            <div key={elem.key} className="flex items-center justify-between p-2.5 rounded-xl bg-[#eeeee9]/40 dark:bg-[#202420]/50 border border-[#eeeee9] dark:border-[#2a302a]">
                              <div>
                                <p className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec] flex items-center gap-1">
                                  {isElemVisible ? <Eye className="w-3 h-3 text-[#2d5342] dark:text-[#528c70]" /> : <EyeOff className="w-3 h-3 text-rose-500" />}
                                  <span>{elem.label}</span>
                                </p>
                                <p className="text-[10px] text-[#414844] dark:text-[#b9c1ba]">{elem.desc}</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-2">
                                <input
                                  type="checkbox"
                                  checked={isElemVisible}
                                  onChange={e =>
                                    setContentForm(prev => ({
                                      ...prev,
                                      visibility: { ...prev.visibility, [elem.key]: e.target.checked } as any
                                    }))
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-8 h-4 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#2d5342]"></div>
                              </label>
                            </div>
                          );
                        })}
                      </div>

                      {/* Custom Button Label Input */}
                      <div className="pt-3 border-t border-[#eeeee9] dark:border-[#2a302a] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#fafaf5]/60 dark:bg-[#151715]/60 p-3 rounded-xl">
                        <div>
                          <p className="text-xs font-bold text-[#1a1c19] dark:text-[#f1f1ec]">
                            Card Button Label Text
                          </p>
                          <p className="text-[10px] text-[#414844] dark:text-[#b9c1ba]">
                            Customize the button wording (e.g. &quot;Watch Video&quot;, &quot;Play Reel&quot;, &quot;View Project&quot;)
                          </p>
                        </div>
                        <input
                          type="text"
                          value={contentForm.visibility?.portfolioWatchButtonText || 'Watch Video'}
                          onChange={e =>
                            setContentForm(prev => ({
                              ...prev,
                              visibility: { ...prev.visibility, portfolioWatchButtonText: e.target.value } as any
                            }))
                          }
                          placeholder="e.g. Watch Video"
                          className="w-full sm:w-48 bg-white dark:bg-[#1c1f1c] px-3 py-1.5 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a]"
                        />
                      </div>
                    </div>

                    {/* ABOUT GRANULAR CONTROLS */}
                    <div className="space-y-3 bg-[#fafaf5] dark:bg-[#151715] p-4 sm:p-5 rounded-2xl border border-[#eeeee9] dark:border-[#2a302a]">
                      <h4 className="text-xs font-bold text-[#1a1c19] dark:text-[#f1f1ec] flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#2d5342] dark:text-[#528c70]" />
                        <span>About Section Element Visibility</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {[
                          { key: 'showAboutKicker', label: 'Kicker Tag ("ABOUT ME")', desc: 'Small uppercase tag' },
                          { key: 'showAboutTitle', label: 'Section Title ("The Person Behind...")', desc: 'Main section title' },
                          { key: 'showAboutBio', label: 'Bio Paragraphs 1 & 2', desc: 'Main storytelling body copy' },
                          { key: 'showAboutQuote', label: 'Floating Quote Badge', desc: '"Editing is where story is written"' },
                          { key: 'showAboutImage', label: 'Studio Portrait Photo', desc: 'Left column photography' },
                          { key: 'showAboutStats', label: 'Experience Counters (5+ Yrs)', desc: '3 stats boxes at bottom' }
                        ].map(elem => {
                          const isElemVisible = (contentForm.visibility as any)?.[elem.key] !== false;
                          return (
                            <div key={elem.key} className="flex items-center justify-between p-2.5 rounded-xl bg-[#eeeee9]/40 dark:bg-[#202420]/50 border border-[#eeeee9] dark:border-[#2a302a]">
                              <div>
                                <p className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec] flex items-center gap-1">
                                  {isElemVisible ? <Eye className="w-3 h-3 text-[#2d5342] dark:text-[#528c70]" /> : <EyeOff className="w-3 h-3 text-rose-500" />}
                                  <span>{elem.label}</span>
                                </p>
                                <p className="text-[10px] text-[#414844] dark:text-[#b9c1ba]">{elem.desc}</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-2">
                                <input
                                  type="checkbox"
                                  checked={isElemVisible}
                                  onChange={e =>
                                    setContentForm(prev => ({
                                      ...prev,
                                      visibility: { ...prev.visibility, [elem.key]: e.target.checked } as any
                                    }))
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-8 h-4 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#2d5342]"></div>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* SERVICES GRANULAR CONTROLS */}
                    <div className="space-y-3 bg-[#fafaf5] dark:bg-[#151715] p-4 sm:p-5 rounded-2xl border border-[#eeeee9] dark:border-[#2a302a]">
                      <h4 className="text-xs font-bold text-[#1a1c19] dark:text-[#f1f1ec] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#2d5342] dark:text-[#528c70]" />
                        <span>Services &amp; Packages Element Visibility</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {[
                          { key: 'showServicesKicker', label: 'Kicker Tag ("WHAT I OFFER")', desc: 'Small uppercase badge' },
                          { key: 'showServicesTitle', label: 'Section Title ("Expertise Tailored...")', desc: 'Main service headline' },
                          { key: 'showServicesSubtitle', label: 'Section Subtitle Description', desc: 'Overview paragraph' },
                          { key: 'showServicesCards', label: 'Services Packages Cards Grid', desc: 'Show/hide all 5 service package cards' }
                        ].map(elem => {
                          const isElemVisible = (contentForm.visibility as any)?.[elem.key] !== false;
                          return (
                            <div key={elem.key} className="flex items-center justify-between p-2.5 rounded-xl bg-[#eeeee9]/40 dark:bg-[#202420]/50 border border-[#eeeee9] dark:border-[#2a302a]">
                              <div>
                                <p className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec] flex items-center gap-1">
                                  {isElemVisible ? <Eye className="w-3 h-3 text-[#2d5342] dark:text-[#528c70]" /> : <EyeOff className="w-3 h-3 text-rose-500" />}
                                  <span>{elem.label}</span>
                                </p>
                                <p className="text-[10px] text-[#414844] dark:text-[#b9c1ba]">{elem.desc}</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-2">
                                <input
                                  type="checkbox"
                                  checked={isElemVisible}
                                  onChange={e =>
                                    setContentForm(prev => ({
                                      ...prev,
                                      visibility: { ...prev.visibility, [elem.key]: e.target.checked } as any
                                    }))
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-8 h-4 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#2d5342]"></div>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* WORKFLOW PROCESS GRANULAR CONTROLS */}
                    <div className="space-y-3 bg-[#fafaf5] dark:bg-[#151715] p-4 sm:p-5 rounded-2xl border border-[#eeeee9] dark:border-[#2a302a]">
                      <h4 className="text-xs font-bold text-[#1a1c19] dark:text-[#f1f1ec] flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#2d5342] dark:text-[#528c70]" />
                        <span>Workflow Process Element Visibility</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {[
                          { key: 'showWorkflowKicker', label: 'Kicker Tag ("PROCESS")', desc: 'Small uppercase process tag' },
                          { key: 'showWorkflowTitle', label: 'Section Title ("How We Collaborate")', desc: 'Main workflow heading' },
                          { key: 'showWorkflowSubtitle', label: 'Workflow Subtitle Description', desc: 'Brief methodology summary' },
                          { key: 'showWorkflowSteps', label: 'Workflow 4 Steps (01-04)', desc: 'Step-by-step collaborative cards' }
                        ].map(elem => {
                          const isElemVisible = (contentForm.visibility as any)?.[elem.key] !== false;
                          return (
                            <div key={elem.key} className="flex items-center justify-between p-2.5 rounded-xl bg-[#eeeee9]/40 dark:bg-[#202420]/50 border border-[#eeeee9] dark:border-[#2a302a]">
                              <div>
                                <p className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec] flex items-center gap-1">
                                  {isElemVisible ? <Eye className="w-3 h-3 text-[#2d5342] dark:text-[#528c70]" /> : <EyeOff className="w-3 h-3 text-rose-500" />}
                                  <span>{elem.label}</span>
                                </p>
                                <p className="text-[10px] text-[#414844] dark:text-[#b9c1ba]">{elem.desc}</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-2">
                                <input
                                  type="checkbox"
                                  checked={isElemVisible}
                                  onChange={e =>
                                    setContentForm(prev => ({
                                      ...prev,
                                      visibility: { ...prev.visibility, [elem.key]: e.target.checked } as any
                                    }))
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-8 h-4 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#2d5342]"></div>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* TESTIMONIALS GRANULAR CONTROLS */}
                    <div className="space-y-3 bg-[#fafaf5] dark:bg-[#151715] p-4 sm:p-5 rounded-2xl border border-[#eeeee9] dark:border-[#2a302a]">
                      <h4 className="text-xs font-bold text-[#1a1c19] dark:text-[#f1f1ec] flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-[#2d5342] dark:text-[#528c70]" />
                        <span>Testimonials Element Visibility</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {[
                          { key: 'showTestimonialsKicker', label: 'Kicker Tag ("TESTIMONIALS")', desc: 'Small uppercase reviews tag' },
                          { key: 'showTestimonialsTitle', label: 'Section Title ("Trusted by Top...")', desc: 'Main testimonials headline' },
                          { key: 'showTestimonialsSubtitle', label: 'Testimonials Subtitle Description', desc: 'Reviews introductory text' }
                        ].map(elem => {
                          const isElemVisible = (contentForm.visibility as any)?.[elem.key] !== false;
                          return (
                            <div key={elem.key} className="flex items-center justify-between p-2.5 rounded-xl bg-[#eeeee9]/40 dark:bg-[#202420]/50 border border-[#eeeee9] dark:border-[#2a302a]">
                              <div>
                                <p className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec] flex items-center gap-1">
                                  {isElemVisible ? <Eye className="w-3 h-3 text-[#2d5342] dark:text-[#528c70]" /> : <EyeOff className="w-3 h-3 text-rose-500" />}
                                  <span>{elem.label}</span>
                                </p>
                                <p className="text-[10px] text-[#414844] dark:text-[#b9c1ba]">{elem.desc}</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-2">
                                <input
                                  type="checkbox"
                                  checked={isElemVisible}
                                  onChange={e =>
                                    setContentForm(prev => ({
                                      ...prev,
                                      visibility: { ...prev.visibility, [elem.key]: e.target.checked } as any
                                    }))
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-8 h-4 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#2d5342]"></div>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* CONTACT & NAVIGATION / FOOTER CONTROLS */}
                    <div className="space-y-3 bg-[#fafaf5] dark:bg-[#151715] p-4 sm:p-5 rounded-2xl border border-[#eeeee9] dark:border-[#2a302a]">
                      <h4 className="text-xs font-bold text-[#1a1c19] dark:text-[#f1f1ec] flex items-center gap-1.5">
                        <PhoneCall className="w-3.5 h-3.5 text-[#2d5342] dark:text-[#528c70]" />
                        <span>Contact, Navbar &amp; Footer Controls</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {[
                          { key: 'showContactKicker', label: 'Contact Kicker ("GET IN TOUCH")', desc: 'Small tag above title' },
                          { key: 'showContactTitle', label: 'Contact Title ("Let\'s Build Something...")', desc: 'Main contact section title' },
                          { key: 'showContactSubtitle', label: 'Contact Subtitle Description', desc: 'Lead generation description' },
                          { key: 'showContactDirectLinks', label: 'WhatsApp & Email Buttons', desc: 'Direct 1-click reach-out chips' },
                          { key: 'showContactForm', label: 'Client Inquiry Proposal Form', desc: 'Full custom inquiry form' },
                          { key: 'showNavbarContactButton', label: 'Navbar "Let\'s Work Together" Button', desc: 'Header primary CTA button' },
                          { key: 'showFooterSocials', label: 'Footer Share & Email Icons', desc: 'Bottom social channels' },
                          { key: 'showFooterBrand', label: 'Footer Brand Name Logo', desc: 'Bottom logo wordmark' }
                        ].map(elem => {
                          const isElemVisible = (contentForm.visibility as any)?.[elem.key] !== false;
                          return (
                            <div key={elem.key} className="flex items-center justify-between p-2.5 rounded-xl bg-[#eeeee9]/40 dark:bg-[#202420]/50 border border-[#eeeee9] dark:border-[#2a302a]">
                              <div>
                                <p className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec] flex items-center gap-1">
                                  {isElemVisible ? <Eye className="w-3 h-3 text-[#2d5342] dark:text-[#528c70]" /> : <EyeOff className="w-3 h-3 text-rose-500" />}
                                  <span>{elem.label}</span>
                                </p>
                                <p className="text-[10px] text-[#414844] dark:text-[#b9c1ba]">{elem.desc}</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-2">
                                <input
                                  type="checkbox"
                                  checked={isElemVisible}
                                  onChange={e =>
                                    setContentForm(prev => ({
                                      ...prev,
                                      visibility: { ...prev.visibility, [elem.key]: e.target.checked } as any
                                    }))
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-8 h-4 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#2d5342]"></div>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 1. ABOUT SECTION FORM */}
                {activeContentSection === 'about' && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                          Section Kicker / Tag
                        </label>
                        <input
                          type="text"
                          value={contentForm.about.kicker}
                          onChange={e =>
                            setContentForm({
                              ...contentForm,
                              about: { ...contentForm.about, kicker: e.target.value }
                            })
                          }
                          className="w-full bg-[#fafaf5] dark:bg-[#151715] px-3.5 py-2 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={contentForm.about.title}
                          onChange={e =>
                            setContentForm({
                              ...contentForm,
                              about: { ...contentForm.about, title: e.target.value }
                            })
                          }
                          className="w-full bg-[#fafaf5] dark:bg-[#151715] px-3.5 py-2 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a]"
                        />
                      </div>
                    </div>

                    {/* Bio Paragraphs */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                        Bio Paragraph 1
                      </label>
                      <textarea
                        rows={3}
                        value={contentForm.about.bioParagraph1}
                        onChange={e =>
                          setContentForm({
                            ...contentForm,
                            about: { ...contentForm.about, bioParagraph1: e.target.value }
                          })
                        }
                        className="w-full bg-[#fafaf5] dark:bg-[#151715] px-3.5 py-2.5 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a] resize-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                        Bio Paragraph 2
                      </label>
                      <textarea
                        rows={3}
                        value={contentForm.about.bioParagraph2}
                        onChange={e =>
                          setContentForm({
                            ...contentForm,
                            about: { ...contentForm.about, bioParagraph2: e.target.value }
                          })
                        }
                        className="w-full bg-[#fafaf5] dark:bg-[#151715] px-3.5 py-2.5 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a] resize-none"
                      />
                    </div>

                    {/* Quote & Author */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                          Quote Box Text
                        </label>
                        <input
                          type="text"
                          value={contentForm.about.quoteText}
                          onChange={e =>
                            setContentForm({
                              ...contentForm,
                              about: { ...contentForm.about, quoteText: e.target.value }
                            })
                          }
                          className="w-full bg-[#fafaf5] dark:bg-[#151715] px-3.5 py-2 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                          Quote Author Attribution
                        </label>
                        <input
                          type="text"
                          value={contentForm.about.quoteAuthor}
                          onChange={e =>
                            setContentForm({
                              ...contentForm,
                              about: { ...contentForm.about, quoteAuthor: e.target.value }
                            })
                          }
                          className="w-full bg-[#fafaf5] dark:bg-[#151715] px-3.5 py-2 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a]"
                        />
                      </div>
                    </div>

                    {/* Studio Portrait Image */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                          Studio Portrait Image URL
                        </label>
                        <button
                          type="button"
                          onClick={() => aboutImageInputRef.current?.click()}
                          className="text-xs font-semibold text-[#2d5342] dark:text-[#528c70] flex items-center gap-1 hover:underline"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Upload portrait photo</span>
                        </button>
                        <input
                          type="file"
                          ref={aboutImageInputRef}
                          onChange={handleAboutImageUpload}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                      <input
                        type="url"
                        value={contentForm.about.imageUrl}
                        onChange={e =>
                          setContentForm({
                            ...contentForm,
                            about: { ...contentForm.about, imageUrl: e.target.value }
                          })
                        }
                        className="w-full bg-[#fafaf5] dark:bg-[#151715] px-3.5 py-2 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a]"
                      />
                    </div>

                    {/* 3 Experience Stats */}
                    <div className="pt-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#1a1c19] dark:text-[#f1f1ec] mb-3 block">
                        Experience Milestones &amp; Stats
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {contentForm.about.stats.map((stat, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-[#fafaf5] dark:bg-[#151715] rounded-xl border border-[#eeeee9] dark:border-[#2a302a] space-y-2"
                          >
                            <div>
                              <span className="text-[10px] text-[#414844] dark:text-[#b9c1ba]">
                                Stat {idx + 1} Value
                              </span>
                              <input
                                type="text"
                                value={stat.value}
                                onChange={e => {
                                  const newStats = [...contentForm.about.stats] as [
                                    { value: string; label: string },
                                    { value: string; label: string },
                                    { value: string; label: string }
                                  ];
                                  newStats[idx].value = e.target.value;
                                  setContentForm({
                                    ...contentForm,
                                    about: { ...contentForm.about, stats: newStats }
                                  });
                                }}
                                className="w-full font-bold text-sm bg-transparent border-b border-[#eeeee9] dark:border-[#2a302a] focus:outline-none"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-[#414844] dark:text-[#b9c1ba]">
                                Label
                              </span>
                              <input
                                type="text"
                                value={stat.label}
                                onChange={e => {
                                  const newStats = [...contentForm.about.stats] as [
                                    { value: string; label: string },
                                    { value: string; label: string },
                                    { value: string; label: string }
                                  ];
                                  newStats[idx].label = e.target.value;
                                  setContentForm({
                                    ...contentForm,
                                    about: { ...contentForm.about, stats: newStats }
                                  });
                                }}
                                className="w-full text-xs bg-transparent border-b border-[#eeeee9] dark:border-[#2a302a] focus:outline-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. HERO SECTION FORM */}
                {activeContentSection === 'hero' && (
                  <div className="space-y-5">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                        Hero Badge Text
                      </label>
                      <input
                        type="text"
                        value={contentForm.hero.badge}
                        onChange={e =>
                          setContentForm({
                            ...contentForm,
                            hero: { ...contentForm.hero, badge: e.target.value }
                          })
                        }
                        className="w-full bg-[#fafaf5] dark:bg-[#151715] px-3.5 py-2 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                        Main Headline
                      </label>
                      <input
                        type="text"
                        value={contentForm.hero.headline}
                        onChange={e =>
                          setContentForm({
                            ...contentForm,
                            hero: { ...contentForm.hero, headline: e.target.value }
                          })
                        }
                        className="w-full bg-[#fafaf5] dark:bg-[#151715] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                        Subtitle Paragraph
                      </label>
                      <textarea
                        rows={3}
                        value={contentForm.hero.subtitle}
                        onChange={e =>
                          setContentForm({
                            ...contentForm,
                            hero: { ...contentForm.hero, subtitle: e.target.value }
                          })
                        }
                        className="w-full bg-[#fafaf5] dark:bg-[#151715] px-3.5 py-2.5 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a] resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                          Primary CTA Button Text
                        </label>
                        <input
                          type="text"
                          value={contentForm.hero.ctaPrimaryText}
                          onChange={e =>
                            setContentForm({
                              ...contentForm,
                              hero: { ...contentForm.hero, ctaPrimaryText: e.target.value }
                            })
                          }
                          className="w-full bg-[#fafaf5] dark:bg-[#151715] px-3.5 py-2 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                          Secondary CTA Button Text
                        </label>
                        <input
                          type="text"
                          value={contentForm.hero.ctaSecondaryText}
                          onChange={e =>
                            setContentForm({
                              ...contentForm,
                              hero: { ...contentForm.hero, ctaSecondaryText: e.target.value }
                            })
                          }
                          className="w-full bg-[#fafaf5] dark:bg-[#151715] px-3.5 py-2 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a]"
                        />
                      </div>
                    </div>

                    {/* 3 Hero Stats */}
                    <div className="pt-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#1a1c19] dark:text-[#f1f1ec] mb-3 block">
                        Hero Metrics &amp; Stats
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {contentForm.hero.stats.map((stat, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-[#fafaf5] dark:bg-[#151715] rounded-xl border border-[#eeeee9] dark:border-[#2a302a] space-y-2"
                          >
                            <div>
                              <span className="text-[10px] text-[#414844] dark:text-[#b9c1ba]">
                                Stat {idx + 1}
                              </span>
                              <input
                                type="text"
                                value={stat.value}
                                onChange={e => {
                                  const newStats = [...contentForm.hero.stats] as [
                                    { value: string; label: string },
                                    { value: string; label: string },
                                    { value: string; label: string }
                                  ];
                                  newStats[idx].value = e.target.value;
                                  setContentForm({
                                    ...contentForm,
                                    hero: { ...contentForm.hero, stats: newStats }
                                  });
                                }}
                                className="w-full font-bold text-sm bg-transparent border-b border-[#eeeee9] dark:border-[#2a302a] focus:outline-none"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-[#414844] dark:text-[#b9c1ba]">
                                Label
                              </span>
                              <input
                                type="text"
                                value={stat.label}
                                onChange={e => {
                                  const newStats = [...contentForm.hero.stats] as [
                                    { value: string; label: string },
                                    { value: string; label: string },
                                    { value: string; label: string }
                                  ];
                                  newStats[idx].label = e.target.value;
                                  setContentForm({
                                    ...contentForm,
                                    hero: { ...contentForm.hero, stats: newStats }
                                  });
                                }}
                                className="w-full text-xs bg-transparent border-b border-[#eeeee9] dark:border-[#2a302a] focus:outline-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. WORKFLOW FORM */}
                {activeContentSection === 'workflow' && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={contentForm.workflow.title}
                          onChange={e =>
                            setContentForm({
                              ...contentForm,
                              workflow: { ...contentForm.workflow, title: e.target.value }
                            })
                          }
                          className="w-full bg-[#fafaf5] dark:bg-[#151715] px-3.5 py-2 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          value={contentForm.workflow.subtitle}
                          onChange={e =>
                            setContentForm({
                              ...contentForm,
                              workflow: { ...contentForm.workflow, subtitle: e.target.value }
                            })
                          }
                          className="w-full bg-[#fafaf5] dark:bg-[#151715] px-3.5 py-2 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a]"
                        />
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#1a1c19] dark:text-[#f1f1ec] block">
                        4 Workflow Steps
                      </label>
                      {contentForm.workflow.steps.map((step, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-[#fafaf5] dark:bg-[#151715] rounded-xl border border-[#eeeee9] dark:border-[#2a302a] space-y-2"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#2d5342] dark:text-[#528c70]">
                              Step {step.num}:
                            </span>
                            <input
                              type="text"
                              value={step.title}
                              onChange={e => {
                                const newSteps = [...contentForm.workflow.steps];
                                newSteps[idx].title = e.target.value;
                                setContentForm({
                                  ...contentForm,
                                  workflow: { ...contentForm.workflow, steps: newSteps }
                                });
                              }}
                              className="font-bold text-xs flex-1 bg-transparent border-b border-[#eeeee9] dark:border-[#2a302a] focus:outline-none"
                              placeholder="Step Title"
                            />
                          </div>
                          <input
                            type="text"
                            value={step.desc}
                            onChange={e => {
                              const newSteps = [...contentForm.workflow.steps];
                              newSteps[idx].desc = e.target.value;
                              setContentForm({
                                ...contentForm,
                                workflow: { ...contentForm.workflow, steps: newSteps }
                              });
                            }}
                            className="w-full text-xs bg-transparent border-b border-[#eeeee9] dark:border-[#2a302a] focus:outline-none"
                            placeholder="Step Description"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. CONTACT & BRAND FORM */}
                {activeContentSection === 'contact' && (
                  <div className="space-y-5">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                        Brand Name
                      </label>
                      <input
                        type="text"
                        value={contentForm.brandName}
                        onChange={e => setContentForm({ ...contentForm, brandName: e.target.value })}
                        className="w-full bg-[#fafaf5] dark:bg-[#151715] px-3.5 py-2 rounded-xl text-xs font-bold text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                          Contact Section Title
                        </label>
                        <input
                          type="text"
                          value={contentForm.contact.title}
                          onChange={e =>
                            setContentForm({
                              ...contentForm,
                              contact: { ...contentForm.contact, title: e.target.value }
                            })
                          }
                          className="w-full bg-[#fafaf5] dark:bg-[#151715] px-3.5 py-2 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          value={contentForm.contact.subtitle}
                          onChange={e =>
                            setContentForm({
                              ...contentForm,
                              contact: { ...contentForm.contact, subtitle: e.target.value }
                            })
                          }
                          className="w-full bg-[#fafaf5] dark:bg-[#151715] px-3.5 py-2 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                          WhatsApp Link
                        </label>
                        <input
                          type="url"
                          value={contentForm.contact.whatsAppUrl}
                          onChange={e =>
                            setContentForm({
                              ...contentForm,
                              contact: { ...contentForm.contact, whatsAppUrl: e.target.value }
                            })
                          }
                          placeholder="https://wa.me/..."
                          className="w-full bg-[#fafaf5] dark:bg-[#151715] px-3.5 py-2 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                          Contact Email
                        </label>
                        <input
                          type="email"
                          value={contentForm.contact.contactEmail}
                          onChange={e =>
                            setContentForm({
                              ...contentForm,
                              contact: { ...contentForm.contact, contactEmail: e.target.value }
                            })
                          }
                          placeholder="contact@..."
                          className="w-full bg-[#fafaf5] dark:bg-[#151715] px-3.5 py-2 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Website Content Action Button */}
                <div className="flex items-center gap-3 pt-4 border-t border-[#eeeee9] dark:border-[#2a302a]">
                  <button
                    type="submit"
                    className="bg-[#2d5342] text-white px-7 py-3 rounded-xl text-xs font-semibold hover:bg-[#456b59] transition-all flex items-center gap-2 shadow-md active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Website Changes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentView('portfolio')}
                    className="bg-[#eeeee9] dark:bg-[#2a302a] text-[#1a1c19] dark:text-[#f1f1ec] px-5 py-3 rounded-xl text-xs font-semibold hover:bg-[#e2e3de] dark:hover:bg-[#333a33] transition-colors flex items-center gap-1.5"
                  >
                    <span>View on Live Site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>

            {/* RIGHT COLUMN: REAL-TIME ABOUT & HERO PREVIEW PANE */}
            <div className="lg:col-span-5 flex flex-col gap-4 sticky top-28">
              <div className="flex items-center justify-between bg-[#f4f4ef] dark:bg-[#1c1f1c] p-3 rounded-2xl border border-[#eeeee9] dark:border-[#2a302a]">
                <span className="text-xs font-bold text-[#1a1c19] dark:text-[#f1f1ec] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#2d5342] dark:text-[#528c70]" />
                  <span>Real-Time Section Preview</span>
                </span>
                <span className="text-[10px] uppercase font-semibold text-[#2d5342] dark:text-[#528c70] bg-[#2d5342]/10 dark:bg-[#528c70]/20 px-2 py-0.5 rounded-md">
                  {activeContentSection}
                </span>
              </div>

              {/* LIVE LAYOUT & VISIBILITY PREVIEW OVERVIEW */}
              {activeContentSection === 'visibility' && (
                <div className="bg-[#fafaf5] dark:bg-[#151715] p-5 rounded-2xl shadow-md border border-[#eeeee9] dark:border-[#2a302a] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#eeeee9] dark:border-[#2a302a] pb-3">
                    <span className="text-xs font-bold text-[#1a1c19] dark:text-[#f1f1ec]">
                      Live Page Structure
                    </span>
                    <span className="text-[10px] text-[#2d5342] dark:text-[#528c70] font-semibold bg-[#2d5342]/10 dark:bg-[#528c70]/20 px-2 py-0.5 rounded-full">
                      {[
                        contentForm.visibility?.showHeroSection,
                        contentForm.visibility?.showPortfolioSection,
                        contentForm.visibility?.showAboutSection,
                        contentForm.visibility?.showServicesSection,
                        contentForm.visibility?.showWorkflowSection,
                        contentForm.visibility?.showTestimonialsSection,
                        contentForm.visibility?.showContactSection
                      ].filter(v => v !== false).length} / 7 Active
                    </span>
                  </div>

                  <div className="space-y-2">
                    {[
                      { key: 'showHeroSection', name: '1. Hero Section', icon: Layout },
                      { key: 'showPortfolioSection', name: '2. Portfolio & Videos', icon: Play },
                      { key: 'showAboutSection', name: '3. About Me & Bio', icon: User },
                      { key: 'showServicesSection', name: '4. Offerings & Services', icon: Layers },
                      { key: 'showWorkflowSection', name: '5. Workflow Process', icon: Check },
                      { key: 'showTestimonialsSection', name: '6. Client Testimonials', icon: MessageSquare },
                      { key: 'showContactSection', name: '7. Contact & Inquiries', icon: PhoneCall }
                    ].map(item => {
                      const isActive = (contentForm.visibility as any)?.[item.key] !== false;
                      const IconComp = item.icon;
                      return (
                        <div
                          key={item.key}
                          className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-colors ${
                            isActive
                              ? 'bg-[#f4f4ef] dark:bg-[#1c1f1c] border-[#eeeee9] dark:border-[#2a302a] text-[#1a1c19] dark:text-[#f1f1ec]'
                              : 'bg-rose-50/50 dark:bg-rose-950/20 border-dashed border-rose-200 dark:border-rose-900/40 text-rose-500 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <IconComp className="w-3.5 h-3.5" />
                            <span className="font-semibold">{item.name}</span>
                          </div>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              isActive
                                ? 'bg-[#2d5342] text-white'
                                : 'bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200'
                            }`}
                          >
                            {isActive ? 'SHOWN' : 'HIDDEN'}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-[10px] text-[#414844] dark:text-[#b9c1ba] leading-relaxed pt-1">
                    When you click <strong>Save Website Changes</strong> below, all changes will take effect instantly on your public website.
                  </p>
                </div>
              )}

              {/* LIVE ABOUT ME PREVIEW CARD */}
              {activeContentSection === 'about' && (
                <div className="bg-[#fafaf5] dark:bg-[#151715] p-5 rounded-2xl shadow-md border border-[#eeeee9] dark:border-[#2a302a] space-y-4">
                  {/* Photo & Quote Preview */}
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-[#e8e8e3] dark:bg-[#2a302a]">
                    <img
                      src={contentForm.about.imageUrl}
                      alt="Portrait Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-[#2d5342] text-white p-3 rounded-xl max-w-[220px] text-[11px] shadow-lg">
                      <p className="italic font-semibold">&ldquo;{contentForm.about.quoteText}&rdquo;</p>
                      <p className="text-[10px] text-white/80 mt-0.5">{contentForm.about.quoteAuthor}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#2d5342] dark:text-[#528c70] block">
                      {contentForm.about.kicker}
                    </span>
                    <h4 className="text-base font-bold text-[#1a1c19] dark:text-[#f1f1ec] mt-0.5">
                      {contentForm.about.title}
                    </h4>
                    <p className="text-xs text-[#414844] dark:text-[#b9c1ba] mt-2 leading-relaxed line-clamp-3">
                      {contentForm.about.bioParagraph1}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#eeeee9] dark:border-[#2a302a]">
                    {contentForm.about.stats.map((s, idx) => (
                      <div key={idx} className="bg-[#f4f4ef] dark:bg-[#1c1f1c] p-2 rounded-lg text-center">
                        <div className="font-bold text-sm text-[#2d5342] dark:text-[#528c70]">{s.value}</div>
                        <div className="text-[9px] text-[#414844] dark:text-[#b9c1ba] truncate">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LIVE HERO PREVIEW CARD */}
              {activeContentSection === 'hero' && (
                <div className="bg-[#fafaf5] dark:bg-[#151715] p-5 rounded-2xl shadow-md border border-[#eeeee9] dark:border-[#2a302a] space-y-4">
                  <div className="inline-block bg-[#e8e8e3] dark:bg-[#2a302a] px-3 py-1 rounded-full text-[10px] font-bold uppercase text-[#414844] dark:text-[#b9c1ba]">
                    {contentForm.hero.badge}
                  </div>
                  <h4 className="text-lg font-bold text-[#1a1c19] dark:text-[#f1f1ec] leading-snug">
                    {contentForm.hero.headline}
                  </h4>
                  <p className="text-xs text-[#414844] dark:text-[#b9c1ba] leading-relaxed">
                    {contentForm.hero.subtitle}
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <span className="bg-[#2d5342] text-white px-3.5 py-1.5 rounded-full text-[11px] font-semibold">
                      {contentForm.hero.ctaPrimaryText}
                    </span>
                    <span className="bg-[#e8e8e3] dark:bg-[#2a302a] text-[#1a1c19] dark:text-[#f1f1ec] px-3.5 py-1.5 rounded-full text-[11px] font-semibold">
                      {contentForm.hero.ctaSecondaryText}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#eeeee9] dark:border-[#2a302a]">
                    {contentForm.hero.stats.map((s, idx) => (
                      <div key={idx} className="bg-[#f4f4ef] dark:bg-[#1c1f1c] p-2 rounded-lg text-center">
                        <div className="font-bold text-sm text-[#2d5342] dark:text-[#528c70]">{s.value}</div>
                        <div className="text-[9px] text-[#414844] dark:text-[#b9c1ba] truncate">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LIVE WORKFLOW PREVIEW */}
              {activeContentSection === 'workflow' && (
                <div className="bg-[#fafaf5] dark:bg-[#151715] p-5 rounded-2xl shadow-md border border-[#eeeee9] dark:border-[#2a302a] space-y-3">
                  <h4 className="font-bold text-sm text-[#1a1c19] dark:text-[#f1f1ec]">
                    {contentForm.workflow.title}
                  </h4>
                  <div className="space-y-2">
                    {contentForm.workflow.steps.map((st, idx) => (
                      <div key={idx} className="p-2.5 bg-[#f4f4ef] dark:bg-[#1c1f1c] rounded-xl flex items-start gap-2.5">
                        <span className="font-bold text-xs text-[#2d5342] dark:text-[#528c70]">{st.num}</span>
                        <div>
                          <p className="text-xs font-bold text-[#1a1c19] dark:text-[#f1f1ec]">{st.title}</p>
                          <p className="text-[10px] text-[#414844] dark:text-[#b9c1ba] line-clamp-1">{st.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LIVE CONTACT PREVIEW */}
              {activeContentSection === 'contact' && (
                <div className="bg-[#fafaf5] dark:bg-[#151715] p-5 rounded-2xl shadow-md border border-[#eeeee9] dark:border-[#2a302a] space-y-3">
                  <p className="text-xs text-[#414844] dark:text-[#b9c1ba]">Brand Name</p>
                  <p className="text-base font-bold text-[#2d5342] dark:text-[#528c70]">{contentForm.brandName}</p>
                  <div className="pt-2 border-t border-[#eeeee9] dark:border-[#2a302a] space-y-2">
                    <p className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">{contentForm.contact.title}</p>
                    <p className="text-[11px] text-[#414844] dark:text-[#b9c1ba]">{contentForm.contact.subtitle}</p>
                    <p className="text-xs text-[#414844] dark:text-[#b9c1ba]">
                      Email: <span className="font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">{contentForm.contact.contactEmail}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: CLIENT INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="bg-[#f4f4ef] dark:bg-[#1c1f1c] rounded-3xl p-6 sm:p-8 border border-[#eeeee9] dark:border-[#2a302a] shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#eeeee9] dark:border-[#2a302a] mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#1a1c19] dark:text-[#f1f1ec]">
                  Received Inquiries &amp; Leads
                </h3>
                <p className="text-xs text-[#414844] dark:text-[#b9c1ba]">
                  Form submissions from prospective creators and brands.
                </p>
              </div>
            </div>

            {inquiries.length === 0 ? (
              <div className="py-12 text-center text-[#414844] dark:text-[#b9c1ba]">
                No inquiries submitted yet.
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map(inq => (
                  <div
                    key={inq.id}
                    className="bg-[#fafaf5] dark:bg-[#151715] p-5 rounded-2xl border border-[#eeeee9] dark:border-[#2a302a] flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1a1c19] dark:text-[#f1f1ec]">
                          {inq.name}
                        </span>
                        <span className="text-xs text-[#414844] dark:text-[#b9c1ba]">
                          · {inq.email}
                        </span>
                        <span className="text-[10px] font-bold bg-[#456b59]/20 text-[#2d5342] dark:text-[#528c70] px-2 py-0.5 rounded-full">
                          {inq.projectType}
                        </span>
                      </div>
                      <p className="text-xs text-[#414844] dark:text-[#b9c1ba] line-clamp-2">
                        {inq.details}
                      </p>
                      <p className="text-[11px] text-[#414844] dark:text-[#b9c1ba]">
                        Budget: <span className="font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">{inq.budgetRange}</span> · Received {new Date(inq.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <a
                      href={`mailto:${inq.email}?subject=Regarding your project inquiry on ${siteContent.brandName}`}
                      className="bg-[#2d5342] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#456b59] transition-colors shrink-0 flex items-center gap-1.5 self-start md:self-center"
                    >
                      <span>Reply via Email</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: STUDIO SECURITY & PASSCODE */}
        {activeTab === 'security' && (
          <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full animate-in fade-in duration-200">
            {/* Status Header Card */}
            <div className="bg-[#f4f4ef] dark:bg-[#1c1f1c] p-6 sm:p-8 rounded-3xl border border-[#eeeee9] dark:border-[#2a302a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#2d5342]/10 dark:bg-[#528c70]/20 text-[#2d5342] dark:text-[#528c70] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-[#1a1c19] dark:text-[#f1f1ec]">
                      Studio Security &amp; Access Control
                    </h2>
                    <span className="text-[10px] font-bold bg-[#2d5342] text-white px-2 py-0.5 rounded-full">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-[#414844] dark:text-[#b9c1ba] mt-0.5">
                    Your Creator Studio is locked with your private passcode. Visitors cannot edit your portfolio without it.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (confirm('Lock admin dashboard and require passcode to enter?')) {
                    logoutAdmin();
                  }
                }}
                className="bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors flex items-center gap-2 shadow-sm shrink-0 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Lock Studio Now</span>
              </button>
            </div>

            {/* Passcode Configuration Card */}
            <div className="bg-[#f4f4ef] dark:bg-[#1c1f1c] p-6 sm:p-8 rounded-3xl border border-[#eeeee9] dark:border-[#2a302a] flex flex-col gap-6 shadow-sm">
              <div className="flex items-center gap-3 pb-4 border-b border-[#eeeee9] dark:border-[#2a302a]">
                <Key className="w-5 h-5 text-[#2d5342] dark:text-[#528c70]" />
                <div>
                  <h3 className="text-base font-bold text-[#1a1c19] dark:text-[#f1f1ec]">
                    Change Studio Passcode
                  </h3>
                  <p className="text-xs text-[#414844] dark:text-[#b9c1ba]">
                    Set a secure, private passcode to protect your dashboard access.
                  </p>
                </div>
              </div>

              {passwordFeedback && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    passwordFeedback.type === 'success'
                      ? 'bg-[#2d5342]/10 text-[#2d5342] dark:bg-[#528c70]/20 dark:text-[#88d6ad]'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{passwordFeedback.message}</span>
                </div>
              )}

              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (!newPasswordInput || newPasswordInput.trim().length < 4) {
                    setPasswordFeedback({
                      type: 'error',
                      message: 'Passcode must be at least 4 characters.'
                    });
                    return;
                  }
                  if (newPasswordInput !== confirmPasswordInput) {
                    setPasswordFeedback({
                      type: 'error',
                      message: 'New passcode and confirm passcode do not match.'
                    });
                    return;
                  }
                  changeAdminPassword(newPasswordInput.trim());
                  setNewPasswordInput('');
                  setConfirmPasswordInput('');
                  setPasswordFeedback({
                    type: 'success',
                    message: 'Studio passcode updated successfully! Remember to note it down.'
                  });
                  showToast('Passcode updated!');
                }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                    New Studio Passcode
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new passcode..."
                    value={newPasswordInput}
                    onChange={e => {
                      setNewPasswordInput(e.target.value);
                      if (passwordFeedback) setPasswordFeedback(null);
                    }}
                    className="w-full bg-[#fafaf5] dark:bg-[#151715] px-4 py-2.5 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a] focus:outline-none focus:ring-2 focus:ring-[#2d5342]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
                    Confirm New Passcode
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm new passcode..."
                    value={confirmPasswordInput}
                    onChange={e => {
                      setConfirmPasswordInput(e.target.value);
                      if (passwordFeedback) setPasswordFeedback(null);
                    }}
                    className="w-full bg-[#fafaf5] dark:bg-[#151715] px-4 py-2.5 rounded-xl text-xs text-[#1a1c19] dark:text-[#f1f1ec] border border-[#eeeee9] dark:border-[#2a302a] focus:outline-none focus:ring-2 focus:ring-[#2d5342]"
                  />
                </div>

                <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="bg-[#2d5342] text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#456b59] transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save New Passcode</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      changeAdminPassword('ayush2026');
                      setNewPasswordInput('');
                      setConfirmPasswordInput('');
                      setPasswordFeedback({
                        type: 'success',
                        message: 'Passcode reset back to default.'
                      });
                      showToast('Passcode reset to default');
                    }}
                    className="bg-[#eeeee9] dark:bg-[#2a302a] text-[#414844] dark:text-[#b9c1ba] px-4 py-2.5 rounded-xl text-xs font-medium hover:bg-[#e2e3de] dark:hover:bg-[#333a33] transition-colors cursor-pointer"
                  >
                    Reset to Default Passcode
                  </button>
                </div>
              </form>
            </div>

            {/* Hosting & Free Deployment Guide */}
            <div className="bg-[#f4f4ef] dark:bg-[#1c1f1c] p-6 sm:p-8 rounded-3xl border border-[#eeeee9] dark:border-[#2a302a] flex flex-col gap-4 shadow-sm">
              <h3 className="text-base font-bold text-[#1a1c19] dark:text-[#f1f1ec]">
                Free Hosting &amp; Deployment Guide
              </h3>
              <p className="text-xs text-[#414844] dark:text-[#b9c1ba] leading-relaxed">
                This website is built with React + Vite and has zero server dependencies. You can host it for free forever on multiple platforms:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#fafaf5] dark:bg-[#151715] border border-[#eeeee9] dark:border-[#2a302a] space-y-1.5">
                  <p className="text-xs font-bold text-[#2d5342] dark:text-[#528c70]">1. Vercel (Recommended)</p>
                  <p className="text-[11px] text-[#414844] dark:text-[#b9c1ba]">
                    Connect your GitHub repo to Vercel. Free custom domains, automatic SSL, and instant global CDN.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#fafaf5] dark:bg-[#151715] border border-[#eeeee9] dark:border-[#2a302a] space-y-1.5">
                  <p className="text-xs font-bold text-[#2d5342] dark:text-[#528c70]">2. Netlify</p>
                  <p className="text-[11px] text-[#414844] dark:text-[#b9c1ba]">
                    Drag and drop your <code className="font-mono">dist</code> folder or connect GitHub. Free form handling and global edge network.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#fafaf5] dark:bg-[#151715] border border-[#eeeee9] dark:border-[#2a302a] space-y-1.5">
                  <p className="text-xs font-bold text-[#2d5342] dark:text-[#528c70]">3. GitHub Pages</p>
                  <p className="text-[11px] text-[#414844] dark:text-[#b9c1ba]">
                    Completely free with your GitHub account under yourname.github.io with custom domain support.
                  </p>
                </div>
              </div>
            </div>

            {/* Video Storage & Client Visibility Architecture Guide */}
            <div className="bg-[#f4f4ef] dark:bg-[#1c1f1c] p-6 sm:p-8 rounded-3xl border border-[#eeeee9] dark:border-[#2a302a] flex flex-col gap-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2d5342]/10 dark:bg-[#528c70]/20 text-[#2d5342] dark:text-[#528c70] flex items-center justify-center shrink-0">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1a1c19] dark:text-[#f1f1ec]">
                    Why Uploaded PC Videos Aren't Visible to Clients (And How to Fix It)
                  </h3>
                  <p className="text-xs text-[#414844] dark:text-[#b9c1ba]">
                    Understanding how web browsers stream videos across the internet.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#fafaf5] dark:bg-[#151715] border border-amber-200 dark:border-amber-900/50 space-y-2">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-bold">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>The Problem: Local PC Storage</span>
                  </div>
                  <p className="text-[11px] text-[#414844] dark:text-[#b9c1ba] leading-relaxed">
                    When you select a video file from your computer using a file picker, the browser generates a temporary local URL (<code className="font-mono text-[10px] bg-amber-100 dark:bg-amber-950 px-1 py-0.5 rounded">blob:http://...</code>). This file remains locked in your computer's RAM. Because your PC is not an open 24/7 web host, <strong>visitors on other laptops or phones cannot load files from your hard drive</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#fafaf5] dark:bg-[#151715] border border-[#2d5342]/30 dark:border-[#528c70]/30 space-y-2">
                  <div className="flex items-center gap-2 text-[#2d5342] dark:text-[#528c70] text-xs font-bold">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>The Solution: YouTube Unlisted Mode</span>
                  </div>
                  <p className="text-[11px] text-[#414844] dark:text-[#b9c1ba] leading-relaxed">
                    Professional video editors host their portfolio reels on <strong>YouTube as "Unlisted"</strong> or <strong>Vimeo</strong>:
                  </p>
                  <ul className="text-[11px] text-[#414844] dark:text-[#b9c1ba] space-y-1 pl-3 list-disc">
                    <li><strong>100% Free &amp; Unlimited:</strong> Stream in 4K, 1080p60 with zero lag and zero hosting bills.</li>
                    <li><strong>Invisible on YouTube:</strong> Setting to <em>Unlisted</em> hides it from your channel and YouTube search.</li>
                    <li><strong>Works Everywhere:</strong> Plays instantly on all mobile phones, tablets, and desktop browsers.</li>
                  </ul>
                </div>
              </div>

              {/* 3 Steps to Publish Videos */}
              <div className="p-4 rounded-2xl bg-[#fafaf5] dark:bg-[#151715] border border-[#eeeee9] dark:border-[#2a302a] space-y-3">
                <h4 className="text-xs font-bold text-[#1a1c19] dark:text-[#f1f1ec]">
                  3 Easy Steps to Add Videos for Clients:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#414844] dark:text-[#b9c1ba]">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#2d5342] text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                    <p className="text-[11px]">Upload video to YouTube Studio (<a href="https://studio.youtube.com" target="_blank" rel="noreferrer" className="text-[#2d5342] dark:text-[#528c70] underline">studio.youtube.com</a>).</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#2d5342] text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                    <p className="text-[11px]">In the <strong>Visibility</strong> step, choose <strong>Unlisted</strong> and save.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#2d5342] text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                    <p className="text-[11px]">Copy the link (e.g. <code className="font-mono text-[10px]">youtu.be/...</code>) and paste it into the Video Source field.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
