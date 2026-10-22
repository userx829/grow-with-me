import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { ProjectItem, SiteContent, InquiryItem } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// AI Studio dev server runs on port 3000; Cloud Run production environment uses process.env.PORT
const PORT = process.env.NODE_ENV === 'production' && process.env.PORT
  ? Number(process.env.PORT)
  : 3000;

app.use(express.json({ limit: '25mb' }));

// Data Directory and File Paths
const DATA_DIR = path.join(__dirname, 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const PROJECTS_DEFAULT_FILE = path.join(DATA_DIR, 'projects_default.json');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
const CONTENT_DEFAULT_FILE = path.join(DATA_DIR, 'content_default.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');

// Initialize data directory and default backup files if needed
function initStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // If defaults file doesn't exist but projects file exists, create backup
  if (fs.existsSync(PROJECTS_FILE) && !fs.existsSync(PROJECTS_DEFAULT_FILE)) {
    try {
      fs.copyFileSync(PROJECTS_FILE, PROJECTS_DEFAULT_FILE);
    } catch {
      // ignore
    }
  }

  if (fs.existsSync(CONTENT_FILE) && !fs.existsSync(CONTENT_DEFAULT_FILE)) {
    try {
      fs.copyFileSync(CONTENT_FILE, CONTENT_DEFAULT_FILE);
    } catch {
      // ignore
    }
  }

  if (!fs.existsSync(INQUIRIES_FILE)) {
    const initialInquiries: InquiryItem[] = [
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
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(initialInquiries, null, 2), 'utf-8');
  }
}

initStorage();

function readDefaultProjects(): ProjectItem[] {
  try {
    const file = fs.existsSync(PROJECTS_DEFAULT_FILE) ? PROJECTS_DEFAULT_FILE : PROJECTS_FILE;
    if (fs.existsSync(file)) {
      const data = fs.readFileSync(file, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading default projects:', err);
  }
  return [];
}

function readProjects(): ProjectItem[] {
  try {
    if (fs.existsSync(PROJECTS_FILE)) {
      const data = fs.readFileSync(PROJECTS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Error reading projects.json:', err);
  }
  return readDefaultProjects();
}

function writeProjects(projects: ProjectItem[]) {
  try {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing projects.json:', err);
  }
}

function readDefaultContent(): SiteContent {
  try {
    const file = fs.existsSync(CONTENT_DEFAULT_FILE) ? CONTENT_DEFAULT_FILE : CONTENT_FILE;
    if (fs.existsSync(file)) {
      const data = fs.readFileSync(file, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading default content:', err);
  }
  return {} as SiteContent;
}

function readContent(): SiteContent {
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      const data = fs.readFileSync(CONTENT_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (parsed && (parsed.hero || parsed.about)) return parsed;
    }
  } catch (err) {
    console.error('Error reading content.json:', err);
  }
  return readDefaultContent();
}

function writeContent(content: SiteContent) {
  try {
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing content.json:', err);
  }
}

function readInquiries(): InquiryItem[] {
  try {
    if (fs.existsSync(INQUIRIES_FILE)) {
      const data = fs.readFileSync(INQUIRIES_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Error reading inquiries.json:', err);
  }
  return [];
}

function writeInquiries(inquiries: InquiryItem[]) {
  try {
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing inquiries.json:', err);
  }
}

// REST API Endpoints

// 1. Projects API
app.get('/api/projects', (_req: Request, res: Response) => {
  const projects = readProjects();
  res.json(projects);
});

app.post('/api/projects', (req: Request, res: Response) => {
  const newProjectPayload = req.body;
  const currentProjects = readProjects();
  const newProject: ProjectItem = {
    ...newProjectPayload,
    id: newProjectPayload.id || `proj-${Date.now()}`,
    publishedAt: newProjectPayload.publishedAt || new Date().toISOString().split('T')[0]
  };
  const updatedProjects = [newProject, ...currentProjects];
  writeProjects(updatedProjects);
  res.status(201).json(newProject);
});

app.put('/api/projects/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const currentProjects = readProjects();
  let found = false;
  const updatedProjects = currentProjects.map(p => {
    if (p.id === id) {
      found = true;
      return { ...p, ...updates };
    }
    return p;
  });

  if (found) {
    writeProjects(updatedProjects);
    res.json({ success: true, project: updatedProjects.find(p => p.id === id) });
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});

app.delete('/api/projects/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const currentProjects = readProjects();
  const updatedProjects = currentProjects.filter(p => p.id !== id);
  writeProjects(updatedProjects);
  res.json({ success: true });
});

app.post('/api/projects/reset', (_req: Request, res: Response) => {
  const defaults = readDefaultProjects();
  writeProjects(defaults);
  res.json(defaults);
});

// 2. Site Content API
app.get('/api/content', (_req: Request, res: Response) => {
  const content = readContent();
  res.json(content);
});

app.put('/api/content', (req: Request, res: Response) => {
  const updates = req.body;
  const current = readContent();
  const merged: SiteContent = {
    ...current,
    ...updates,
    visibility: { ...(current.visibility || {}), ...(updates.visibility || {}) },
    about: updates.about ? { ...current.about, ...updates.about } : current.about,
    hero: updates.hero ? { ...current.hero, ...updates.hero } : current.hero,
    workflow: updates.workflow ? { ...current.workflow, ...updates.workflow } : current.workflow,
    contact: updates.contact ? { ...current.contact, ...updates.contact } : current.contact
  };
  writeContent(merged);
  res.json(merged);
});

app.post('/api/content/reset', (_req: Request, res: Response) => {
  const defaults = readDefaultContent();
  writeContent(defaults);
  res.json(defaults);
});

// 3. Inquiries API
app.get('/api/inquiries', (_req: Request, res: Response) => {
  const inquiries = readInquiries();
  res.json(inquiries);
});

app.post('/api/inquiries', (req: Request, res: Response) => {
  const inquiryData = req.body;
  const inquiries = readInquiries();
  const newInquiry: InquiryItem = {
    ...inquiryData,
    id: `inq-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'new'
  };
  const updated = [newInquiry, ...inquiries];
  writeInquiries(updated);
  res.status(201).json(newInquiry);
});

// Mount Vite or serve production bundle
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
