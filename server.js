// server.ts
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// src/data/initialProjects.ts
var INITIAL_PROJECTS = [
  {
    id: "showreel-2026",
    title: "The Art of Visual Storytelling",
    subtitle: "Reel & Showreel Highlights",
    category: "cinematic",
    categoryLabel: "Selected Work / 2026",
    thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwVJjH9g1rAOEQ45Hq8BSnC1X0iyuhhR8sgcJUil0bOX0sJxH63zDwB7k3bWY95-WC1eQf4zdWwFevPb_982NjNeh3SmRryjui8vKuM2NlPzRjm57HrHq_NYmZNvP_yRJGylDzHhEYlO7KWV34OeUBG0uE5shXuUZUqSCSwYax4LIZ3rrvPOizv2ZiFhRi6o1wqFyihDgbOq1CNLzo3950gTJ-ClbdHuNqbiHMdivWMNoDUCj0OHO0",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1",
    videoType: "youtube",
    views: "2.5M+",
    duration: "2:15",
    retentionRate: "88%",
    summary: "A curated master reel featuring fast-paced transitions, custom soundscapes, color grading breakdowns, and commercial work produced for creators across 4 continents.",
    clientName: "Ayush Studio Showcase",
    clientRole: "Director & Lead Editor",
    clientTestimonial: "A cinematic tour de force highlighting the breadth of emotion and rhythm achievable through surgical cutting.",
    caseStudyStory: "This showreel highlights the core editing philosophy: rhythm before speed. Every transition is motivated by on-screen motion, musical downbeats, or eye-tracking continuity. Using custom sound design with over 150 layered Foley elements, the reel holds viewer attention seamlessly from the first frame to the final brand punch.",
    techniques: ["Dynamic Sound Design & Multi-layer Foley", "Film Emulation & Dual-Pass Color Grading", "Motion Vector Speed Ramping", "Visual Pacing Synchronization"],
    featured: true,
    publishedAt: "2026-01-10"
  },
  {
    id: "kyoto-travel-vlog",
    title: "Chasing Horizons: Solo in Kyoto",
    subtitle: "Atmospheric Travel Documentary",
    category: "youtube",
    categoryLabel: "YouTube Long-form",
    thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuByfGHprj-Axvdb7SyUAd1IPTA19UqlwpcS67Td6steWIRod16YXX8ddr0Gt1yojn5f6qo4oalJHzsatYNlsOpyA4rH7Ayge2KuE4-5LQ4wVyuJMuroYsoTy7rwTBauBxJOpSCaBKGXBFXohozQ_J-TFVsxh8KUV4QFqV-omaGCIVQDIo2gRHPN5XLeXtOD1BdOeGx3arx4GUvCY4EePV_O8NUnxZyJlN9vpWugGOdlhzc34i4rhh-p",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    videoType: "direct",
    views: "1.2M",
    duration: "14 min",
    retentionRate: "68%",
    summary: "A moody, atmospheric travel documentary highlighting traditional craftsmanship, hidden alleys, and modern street life in Kyoto.",
    clientName: "Julian Drake",
    clientRole: "Tech & Travel Creator (450K Subs)",
    clientTestimonial: "Ayush turned raw handheld b-roll into a poetic cinema piece that blew my audience away and boosted watch time by 42%.",
    caseStudyStory: "The goal was to transform a standard solo travel vlog into an immersive sensory journey. We removed conventional speaking cliches and let natural ambient environmental audio\u2014bamboo rustling, rain on stone lantern paths, temple bells\u2014drive the narrative spine. Retention peaked at 74% during the midnight Gion sequence.",
    techniques: ["Non-linear Chapter Structuring", "Ambient Foley Reconstruction", "Kodak 2383 Film Grain Emulation", "Split Screen Match Cuts"],
    featured: false,
    publishedAt: "2026-02-14"
  },
  {
    id: "desk-setup-2026",
    title: "The Ultimate Desk Setup for 2026",
    subtitle: "High-Retention Tech Showcase",
    category: "youtube",
    categoryLabel: "Tech & Review",
    thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoxlgMa1yjBJAPcWb8oQgRw8BTtz_o2-2kC82-7Cfu4aDkmMQmr9C3WrdQh6qJSFHU0brS_GYeh_v77y3YpFU6DRKJsCdCJrqWKD-f89A5cuxJQslO5u-hlEBZ0ikVMLZEZpRT9Ao0u4LQ-q15tYT88hxc-e8Nf58OZDg33zKb7aUd9DF5ciUP4q8kR5STUcOX_r33zZ21oPXcSrGHww1upMtJbj49PVcP6SCbFkBSMNJz1R_jLFRE",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    videoType: "direct",
    views: "850K",
    duration: "10 min",
    retentionRate: "76%",
    summary: "Fast-paced editing with sound design precision, 3D motion callouts, and clean lighting cuts keeping retention above 75% throughout.",
    clientName: "Marcus Chen",
    clientRole: "Hardware & Tech Reviewer",
    clientTestimonial: "Retention on this desk tour is the highest on my channel history. The pacing makes a 10-minute video feel like 3 minutes.",
    caseStudyStory: "Desk videos often suffer steep retention drop-offs at the 3-minute mark. To combat this, we deployed micro-hooks every 45 seconds\u2014using 3D floating technical callouts, rapid macro speed ramps, and seamless invisible transitions between cable management segments.",
    techniques: ["3D Tracking UI Callouts", "Bass-Boosted Click & Switch Foley", "Macro Lighting Transitions", "Pacing Calibration Curves"],
    featured: false,
    publishedAt: "2026-03-01"
  },
  {
    id: "morning-rituals-coffee",
    title: "Morning Rituals: Artisan Coffee",
    subtitle: "Viral Macro Sensory Experience",
    category: "shorts",
    categoryLabel: "Shorts & Reels",
    thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6yowBepdpJKULI0c0K-3thY5bw0IbT-YSRgAqZ8t1PNOy4FFm5_8IDVqXyLLR_XBSLYP-TwY-eD-Ajt34mXMMAPT-HJl07dfdlxs9AMqhBLEPlJIwvFVcOnESRni-TQJFwZzMd8exTugdYVjdQbfUGX-yjYE3MbAV_0OxFIDaOQWuRpn2zMFAFCcfhwWG5AyaHu2EX5FZG1VQdh9SsqCNKHQm7Q3ZYqm-c5eZtqzgHqAmBI0op1_X",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    videoType: "direct",
    views: "3.4M",
    duration: "30s",
    retentionRate: "124%",
    summary: "Viral Instagram Reel focusing on ASMR audio pacing, satisfying macro visual cuts, and rhythmic bean grinding.",
    clientName: "Brew Craft Coffee Co.",
    clientRole: "Lifestyle Brand Partner",
    clientTestimonial: "3.4 million views and over 80,000 shares in 5 days. It put our specialty roast on the map nationally.",
    caseStudyStory: "Designed explicitly for infinite loop playback on Instagram and YouTube Shorts. The opening 0.8 seconds delivers an explosive sensory hook (grinder click, beans tumbling in macro slow motion). The final audio cut connects seamlessly back into the opening frame, driving a 124% average view duration.",
    techniques: ["Infinite Audio Loop Splicing", "Macro Crisp ASMR Mastering", "Zero-Dead-Air Speed Cutting", "Dynamic Kinetic Typography"],
    featured: false,
    aspectRatio: "9:16",
    publishedAt: "2026-03-12"
  },
  {
    id: "iceland-cinematic-doc",
    title: "Glacial Shadows: Nordic Winter",
    subtitle: "Expedition Short Documentary",
    category: "cinematic",
    categoryLabel: "Cinematic Film",
    thumbnailUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    videoType: "direct",
    views: "620K",
    duration: "8 min",
    retentionRate: "71%",
    summary: "High-contrast drone cinematography, anamorphic letterboxing, and orchestral scoring capturing the stark serenity of Iceland glaciers.",
    clientName: "Nordic Explorer Studio",
    clientRole: "Production House",
    clientTestimonial: "Ayush balanced subtle narrative pacing with intense visual scale. The emotional climax brought our team to tears.",
    caseStudyStory: "Balancing extreme contrast between black volcanic sands and blinding snow drifts required meticulous scene-by-scene color grading. Sound design was assembled using custom recordings of crushing ice sheets and sub-bass wind gusts.",
    techniques: ["Anamorphic Lens Distortion Correction", "Dual-LUT Color Chemistry", "Symphonic Beat Matching", "Spatial Audio Panning"],
    featured: false,
    publishedAt: "2026-03-22"
  },
  {
    id: "lumina-brand-launch",
    title: "Aura Sound: Studio Headphones",
    subtitle: "Commercial Brand Launch Film",
    category: "ads",
    categoryLabel: "Ads & Brand Films",
    thumbnailUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4",
    videoType: "direct",
    views: "1.9M",
    duration: "45s",
    retentionRate: "92%",
    summary: "Fast-paced commercial spot with slick match cuts, rhythmic audio stems, and sleek metallic text animation designed to convert.",
    clientName: "Sophia Martinez",
    clientRole: "Creative Director, Lumina Audio",
    clientTestimonial: "Our conversion rate jumped 28% compared to previous launch campaigns. The edit felt like high-end Apple quality.",
    caseStudyStory: "The brief was to make industrial acoustic engineering feel visceral and energetic. Every beat of the electronic track controls a visual cut, from aluminum CNC machining to leather headband stitching.",
    techniques: ["Rhythmic Match-Cutting", "Sub-bass Risers & Drops", "Typography Kinetic Transitions", "Color Pop Grade"],
    featured: false,
    publishedAt: "2026-04-02"
  }
];

// src/data/initialContent.ts
var DEFAULT_SECTION_VISIBILITY = {
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
  portfolioWatchButtonText: "Watch Video",
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
  showFooterBrand: true
};
var INITIAL_SITE_CONTENT = {
  brandName: "Grow With Ayush",
  visibility: DEFAULT_SECTION_VISIBILITY,
  hero: {
    badge: "VIDEO EDITOR & CREATIVE PARTNER",
    headline: "Your Vision. My Edit. Let's Grow.",
    subtitle: "Transforming raw footage into compelling cinematic narratives that captivate audiences, boost retention, and accelerate your channel's growth.",
    ctaPrimaryText: "Explore My Work",
    ctaSecondaryText: "Let's Work Together",
    stats: [
      { value: "50M+", label: "Total Views Generated" },
      { value: "120+", label: "Projects Delivered" },
      { value: "99%", label: "Client Satisfaction" }
    ]
  },
  about: {
    kicker: "ABOUT ME",
    title: "The Person Behind the Edits",
    bioParagraph1: "Hey! I'm Ayush. For over 5 years, I've partnered with top-tier creators, entrepreneurs, and brands to turn raw footage into hypnotic visual experiences. I don't just cut clips together\u2014I craft pacing, build emotional arcs, and engineer retention.",
    bioParagraph2: "Whether you are scaling a YouTube channel from scratch or launching a high-converting brand film, I handle the narrative weight so you can focus entirely on creation.",
    quoteText: "Editing is where the story is truly written.",
    quoteAuthor: "\u2014 Ayush, Lead Editor",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1_NcPIGPO8T1_06MAHTLJXHpnsx4PWWMK_jmW6h5mRumbDrKEMgagFmW-ZUgFhs3A4LrC2B979N_9ex3DN8Wea16O6qHWTzBPYS9DlvioKDPrDOaR1IMxPcrQJ3bOa26uVL3SmvtafFeiQUUWWLFYze99gFp44euvzp54gm5XBkdDQYV7Ilbf7gmp3ruTIFajG5QrKhf9z-EK6U8YRaNRe2GxVd_Pt5ZHApHEbGAEyet1ohFnSFTs",
    stats: [
      { value: "5+", label: "Years Experience" },
      { value: "120+", label: "Projects Completed" },
      { value: "45+", label: "Collaborations" }
    ]
  },
  workflow: {
    kicker: "WORKFLOW",
    title: "Simple, Streamlined Process",
    subtitle: "How we take your project from an idea to a polished masterwork.",
    steps: [
      {
        num: "01",
        title: "Share Your Vision",
        desc: "Tell me about your project, goals, style references, audience profile, and deadlines."
      },
      {
        num: "02",
        title: "Send Your Footage",
        desc: "Upload raw clips, audio tracks, and brand assets securely via Frame.io, Google Drive, or Dropbox."
      },
      {
        num: "03",
        title: "Editing & Feedback",
        desc: "Receive the first draft, review directly on the frame-accurate timeline, and request revisions."
      },
      {
        num: "04",
        title: "Final Delivery",
        desc: "Get your master exports in pristine 4K/1080p with platform-optimized presets ready to publish."
      }
    ]
  },
  contact: {
    kicker: "GET IN TOUCH",
    title: "Let's Create Something Great",
    subtitle: "Ready to level up your content? Send a message or schedule a quick chat.",
    whatsAppNumber: "+1 (555) 019-2834",
    whatsAppUrl: "https://wa.me/15550192834",
    contactEmail: "contact@growwithayush.com"
  }
};

// server.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = Number(process.env.PORT) || 3e3;
app.use(express.json({ limit: "25mb" }));
var DATA_DIR = path.join(__dirname, "data");
var PROJECTS_FILE = path.join(DATA_DIR, "projects.json");
var CONTENT_FILE = path.join(DATA_DIR, "content.json");
var INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json");
function initStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(PROJECTS_FILE)) {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(INITIAL_PROJECTS, null, 2), "utf-8");
  }
  if (!fs.existsSync(CONTENT_FILE)) {
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(INITIAL_SITE_CONTENT, null, 2), "utf-8");
  }
  if (!fs.existsSync(INQUIRIES_FILE)) {
    const initialInquiries = [
      {
        id: "sample-inq-1",
        name: "Julian Drake",
        email: "julian@example.com",
        projectType: "YouTube Video Editing",
        budgetRange: "$1,000 - $3,000",
        details: "Looking for a regular video editor for my 450K tech YouTube channel with 4K footage and b-roll color grading.",
        createdAt: "2026-04-10T14:30:00Z",
        status: "reviewed"
      }
    ];
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(initialInquiries, null, 2), "utf-8");
  }
}
initStorage();
function readProjects() {
  try {
    if (fs.existsSync(PROJECTS_FILE)) {
      const data = fs.readFileSync(PROJECTS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error("Error reading projects.json:", err);
  }
  return INITIAL_PROJECTS;
}
function writeProjects(projects) {
  try {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing projects.json:", err);
  }
}
function readContent() {
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      const data = fs.readFileSync(CONTENT_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (parsed && parsed.hero) return parsed;
    }
  } catch (err) {
    console.error("Error reading content.json:", err);
  }
  return INITIAL_SITE_CONTENT;
}
function writeContent(content) {
  try {
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing content.json:", err);
  }
}
function readInquiries() {
  try {
    if (fs.existsSync(INQUIRIES_FILE)) {
      const data = fs.readFileSync(INQUIRIES_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error("Error reading inquiries.json:", err);
  }
  return [];
}
function writeInquiries(inquiries) {
  try {
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing inquiries.json:", err);
  }
}
app.get("/api/projects", (_req, res) => {
  const projects = readProjects();
  res.json(projects);
});
app.post("/api/projects", (req, res) => {
  const newProjectPayload = req.body;
  const currentProjects = readProjects();
  const newProject = {
    ...newProjectPayload,
    id: newProjectPayload.id || `proj-${Date.now()}`,
    publishedAt: newProjectPayload.publishedAt || (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  };
  const updatedProjects = [newProject, ...currentProjects];
  writeProjects(updatedProjects);
  res.status(201).json(newProject);
});
app.put("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const currentProjects = readProjects();
  let found = false;
  const updatedProjects = currentProjects.map((p) => {
    if (p.id === id) {
      found = true;
      return { ...p, ...updates };
    }
    return p;
  });
  if (found) {
    writeProjects(updatedProjects);
    res.json({ success: true, project: updatedProjects.find((p) => p.id === id) });
  } else {
    res.status(404).json({ error: "Project not found" });
  }
});
app.delete("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  const currentProjects = readProjects();
  const updatedProjects = currentProjects.filter((p) => p.id !== id);
  writeProjects(updatedProjects);
  res.json({ success: true });
});
app.post("/api/projects/reset", (_req, res) => {
  writeProjects(INITIAL_PROJECTS);
  res.json(INITIAL_PROJECTS);
});
app.get("/api/content", (_req, res) => {
  const content = readContent();
  res.json(content);
});
app.put("/api/content", (req, res) => {
  const updates = req.body;
  const current = readContent();
  const merged = {
    ...current,
    ...updates,
    visibility: { ...current.visibility || {}, ...updates.visibility || {} },
    about: updates.about ? { ...current.about, ...updates.about } : current.about,
    hero: updates.hero ? { ...current.hero, ...updates.hero } : current.hero,
    workflow: updates.workflow ? { ...current.workflow, ...updates.workflow } : current.workflow,
    contact: updates.contact ? { ...current.contact, ...updates.contact } : current.contact
  };
  writeContent(merged);
  res.json(merged);
});
app.post("/api/content/reset", (_req, res) => {
  writeContent(INITIAL_SITE_CONTENT);
  res.json(INITIAL_SITE_CONTENT);
});
app.get("/api/inquiries", (_req, res) => {
  const inquiries = readInquiries();
  res.json(inquiries);
});
app.post("/api/inquiries", (req, res) => {
  const inquiryData = req.body;
  const inquiries = readInquiries();
  const newInquiry = {
    ...inquiryData,
    id: `inq-${Date.now()}`,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    status: "new"
  };
  const updated = [newInquiry, ...inquiries];
  writeInquiries(updated);
  res.status(201).json(newInquiry);
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}
startServer();
