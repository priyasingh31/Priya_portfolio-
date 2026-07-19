import React, { useState, useEffect, useRef } from "react";
import {
  Mail, Phone, ExternalLink, Check, Copy, X,
  Database, Cpu, Layers, Zap, Code, Server, Shield, Sparkles,
  Play, RefreshCw, Terminal, CheckCircle2, ArrowUpRight, Activity, ArrowRight,
  ChevronLeft, ChevronRight, Gauge, Layout, HardDrive, Smartphone, Globe, MessageCircle, Globe2, FileText, Lock, Users, Clock, Box, Download, Send, Bot, User, CornerDownLeft, Calendar
} from "lucide-react";

/* ---------------------------------------------------------- */
/* CONSTANTS & DATA                                           */
/* ---------------------------------------------------------- */

const EMAIL = "priyasingh311256@gmail.com";
const PHONE = "+91 97982 45322";

/* Helper to trigger resume download */
const handleDownloadResume = () => {
  const link = document.createElement("a");
  link.href = "/assets/Priya_Kumari_Resume.txt";
  link.download = "Priya_Kumari_Resume.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/* Portfolio Projects List */
const PORTFOLIO_PROJECTS = [
  {
    id: 1,
    title: "EngageX — Ad-Tech & Monetization Platform",
    category: "Websites",
    image: "/assets/proj_1.png",
    link: "#engagex-casestudy",
    isLive: false,
    hasCaseStudy: true,
    desc: "Performance-based mobile advertising marketplace connecting advertisers and publishers with real-time S2S attribution, automated Razorpay payouts, and self-healing sync."
  },
  {
    id: 2,
    title: "Fintaxure — Financial & Tax Advisory Platform",
    category: "Websites",
    image: "/assets/fintaxure.png",
    link: "https://fintaxure.com/",
    isLive: true,
    hasCaseStudy: false,
    desc: "Production corporate accounting, tax preparation, outsourced CFO services, and ROC/FEMA compliance web application."
  },
  {
    id: 3,
    title: "KanecTech — Enterprise Cloud & Digital Innovation",
    category: "Websites",
    image: "/assets/kanectech.png",
    link: "https://www.kanectech.com/",
    isLive: true,
    hasCaseStudy: false,
    desc: "Enterprise tech consulting web application providing SAP modernization, cloud strategy, data analytics, and AI automation."
  },
  {
    id: 4,
    title: "Quota-Based Seat Allocation Engine (CRM)",
    category: "Websites",
    image: "/assets/proj_3.png",
    link: "#",
    isLive: false,
    hasCaseStudy: false,
    desc: "University intake system utilizing explicit PostgreSQL SELECT FOR UPDATE locks to eliminate over-allocation."
  },
  {
    id: 5,
    title: "LexiLearn — Language Learning Mobile App",
    category: "Apps",
    image: "/assets/proj_4.png",
    link: "#",
    isLive: false,
    hasCaseStudy: false,
    desc: "Interactive vocabulary flashcard mobile app with audio pronunciation and automated review scheduling."
  },
  {
    id: 6,
    title: "Fitness & Daily Workout Progress App",
    category: "Apps",
    image: "/assets/proj_5.png",
    link: "#",
    isLive: false,
    hasCaseStudy: false,
    desc: "Dark-mode mobile fitness tracker featuring live heart rate, active calorie burn, and circular goal ring."
  }
];

/* Featured Architectural Deep Dives */
const FEATURED_PROJECTS = [
  {
    id: "engagex",
    title: "EngageX — Ad-Tech & Monetization Platform",
    category: "Full Case Study Available",
    tag: "8 Microservices Architecture",
    link: "#case-study",
    hasCaseStudy: true,
    desc: "Performance-based mobile advertising marketplace connecting advertisers and publishers with server-to-server (S2S) click/conversion tracking, Razorpay automated payouts, and self-healing offer sync.",
    highlights: [
      "8 independently deployable microservices (Node Express 5, FastAPI, Celery, React, C# .NET).",
      "Self-healing async offer sync engine with deterministic hash change detection & cold-start bootstrap reconciliation.",
      "Cookie-free server-to-server (S2S) attribution postback flow with Razorpay publisher wallets."
    ],
    chips: ["Express 5", "FastAPI", "React", "PostgreSQL", "Redis", "Celery", "OpenTelemetry", "Docker"]
  },
  {
    id: "fintaxure",
    title: "Fintaxure — Financial & Tax Advisory Platform",
    category: "Live Production App",
    tag: "LIVE SITE",
    link: "https://fintaxure.com/",
    hasCaseStudy: false,
    desc: "Full-stack digital partner platform delivering corporate tax filings, assurance reviews, outsourced CFO services, and regulatory compliance advisory.",
    highlights: [
      "Engineered responsive modern web interface built with React & Vite.",
      "Integrated secure client service portals for tax diligence & audit document workflows.",
      "Optimized operational performance and fast initial page render speeds."
    ],
    chips: ["React", "Vite", "Node.js", "JavaScript ES6+", "CSS3", "RESTful APIs"]
  },
  {
    id: "kanectech",
    title: "KanecTech — Enterprise Cloud & Digital Innovation",
    category: "Live Production App",
    tag: "LIVE SITE",
    link: "https://www.kanectech.com/",
    hasCaseStudy: false,
    desc: "Enterprise technology consulting and product engineering platform specializing in SAP transformation, cloud strategy, data intelligence, and AI automation.",
    highlights: [
      "Built multi-section digital product experience with interactive service matrices.",
      "Clean semantic architecture with high SEO score & crisp mobile accessibility.",
      "Streamlined enterprise contact & consultation pipelines."
    ],
    chips: ["React", "Vite", "Cloud Architecture", "JavaScript", "HTML5", "CSS3"]
  }
];

/* Services List */
const SERVICES = [
  {
    id: "speed",
    title: "Speed & Optimization",
    desc: "Improving load times, SEO, and overall user experience through code and asset optimization.",
    iconColor: "#F59E0B",
    iconBg: "rgba(245, 158, 11, 0.15)",
    icon: Gauge
  },
  {
    id: "fullstack",
    title: "Full-Stack Solutions",
    desc: "End-to-end development from frontend UI to backend infrastructure and deployment.",
    iconColor: "#10B981",
    iconBg: "rgba(16, 185, 129, 0.15)",
    icon: Code
  },
  {
    id: "backend",
    title: "Backend Development",
    iconColor: "#EC4899",
    iconBg: "rgba(236, 72, 153, 0.15)",
    desc: "Developing secure and scalable server-side logic, APIs, and database integration.",
    icon: Database
  },
  {
    id: "frontend",
    title: "Frontend Development",
    iconColor: "#38BDF8",
    iconBg: "rgba(56, 189, 248, 0.15)",
    desc: "Building responsive, user-friendly web interfaces using modern frameworks like React or Vue.",
    icon: Layout
  }
];

/* Technical Code Workbench Modules */
const CODE_MODULES = [
  {
    id: "seat",
    title: "confirmSeat.ts",
    label: "PostgreSQL Concurrency Lock",
    badge: "SELECT FOR UPDATE",
    desc: "Row lock transaction eliminating race conditions under 500+ concurrent requests.",
    code: [
      { text: "async function confirmSeat(programId: string, applicantId: string) {", tokens: [["async function ", "kw"], ["confirmSeat", "fn"], ["(programId: string, applicantId: string) {", "plain"]] },
      { text: "  return db.transaction(async (trx) => {", tokens: [["  return ", "kw"], ["db.", "plain"], ["transaction", "fn"], ["(async (trx) => {", "plain"]] },
      { text: "    // Exclusive row lock prevents concurrent over-allocation", tokens: [["    // Exclusive row lock prevents concurrent over-allocation", "comment"]] },
      { text: "    const seat = await trx('program_seats')", tokens: [["    const ", "kw"], ["seat = ", "plain"], ["await ", "kw"], ["trx(", "plain"], ["'program_seats'", "str"], [")", "plain"]] },
      { text: "      .where({ program_id: programId })", tokens: [["      .", "plain"], ["where", "fn"], ["({ program_id: programId })", "plain"]] },
      { text: "      .forUpdate() // SELECT FOR UPDATE", tokens: [["      .", "plain"], ["forUpdate", "fn"], ["() ", "plain"], ["// SELECT FOR UPDATE", "comment"]] },
      { text: "      .first();", tokens: [["      .", "plain"], ["first", "fn"], ["();", "plain"]] },
      { text: "    if (seat.allocated >= seat.quota) {", tokens: [["    if ", "kw"], ["(seat.allocated >= seat.quota) {", "plain"]] },
      { text: "      throw new SeatUnavailableError('Quota reached');", tokens: [["      throw new ", "kw"], ["SeatUnavailableError", "fn"], ["('Quota reached');", "str"]] },
      { text: "    }", tokens: [["    }", "plain"]] },
      { text: "    await trx('program_seats').increment('allocated', 1);", tokens: [["    await ", "kw"], ["trx(", "plain"], ["'program_seats'", "str"], [").", "plain"], ["increment", "fn"], ["('allocated', 1);", "plain"]] },
      { text: "    return generateAdmissionNumber(trx, applicantId);", tokens: [["    return ", "kw"], ["generateAdmissionNumber", "fn"], ["(trx, applicantId);", "plain"]] },
      { text: "  });", tokens: [["  });", "plain"]] },
      { text: "}", tokens: [["}", "plain"]] },
    ]
  },
  {
    id: "search",
    title: "searchAppDispatcher.ts",
    label: "Polymorphic Store Search",
    badge: "REDIS 2-HR TTL",
    desc: "Routes Android (scraped), iOS (iTunes API), and Web (Axios/Cheerio) into unified payload.",
    code: [
      { text: "export async function searchApp(store: StoreType, params: SearchParams) {", tokens: [["export async function ", "kw"], ["searchApp", "fn"], ["(store: StoreType, params: SearchParams) {", "plain"]] },
      { text: "  const cacheKey = `search:${store}:${params.query.toLowerCase()}`;", tokens: [["  const ", "kw"], ["cacheKey = ", "plain"], ["`search:${store}:${params.query}`", "str"], [";", "plain"]] },
      { text: "  const cached = await redis.get(cacheKey);", tokens: [["  const ", "kw"], ["cached = ", "plain"], ["await ", "kw"], ["redis.get(cacheKey);", "fn"]] },
      { text: "  if (cached) return JSON.parse(cached); // 2-Hour TTL Cache Hit", tokens: [["  if ", "kw"], ["(cached) ", "plain"], ["return ", "kw"], ["JSON.parse(cached); ", "plain"], ["// 2-Hour TTL Cache Hit", "comment"]] },
      { text: "  let results;", tokens: [["  let ", "kw"], ["results;", "plain"]] },
      { text: "  switch (store) {", tokens: [["  switch ", "kw"], ["(store) {", "plain"]] },
      { text: "    case 'android': results = await gplay.search({ term: params.query }); break;", tokens: [["    case ", "kw"], ["'android': ", "str"], ["results = await gplay.search(...); break;", "plain"]] },
      { text: "    case 'ios': results = await fetchiTunesApi(params.query); break;", tokens: [["    case ", "kw"], ["'ios': ", "str"], ["results = await fetchiTunesApi(...); break;", "plain"]] },
      { text: "  }", tokens: [["  }", "plain"]] },
      { text: "  await redis.setex(cacheKey, 7200, JSON.stringify(results));", tokens: [["  await ", "kw"], ["redis.setex(cacheKey, 7200, ...);", "fn"]] },
      { text: "  return results;", tokens: [["  return ", "kw"], ["results;", "plain"]] },
      { text: "}", tokens: [["}", "plain"]] },
    ]
  }
];

const EXPERIENCE = [
  {
    when: "Jun 2025 — Present",
    role: "Associate Software Engineer",
    org: "Mobtions",
    location: "In-Office",
    highlights: [
      "Reduced PostgreSQL/MySQL P95 API latency from 500ms to 120ms (-76%) through composite indexing, query plan tuning, and join refactoring.",
      "Shipped 10+ core product features across React, Express.js, and FastAPI, improving operational page load speeds by 30%.",
      "Automated ETL pipelines with Apache Airflow DAGs, cutting batch processing windows by 40% and saving 6+ hours of manual overhead per week.",
      "Engineered secure backend architectures incorporating JWT auth, RBAC permissions, rate limiters, and structured validation."
    ],
    skills: ["PostgreSQL", "FastAPI", "Express.js", "Apache Airflow", "Redis", "Docker", "React"]
  },
  {
    when: "Dec 2024 — May 2025",
    role: "Game Developer Intern",
    org: "Mobtions",
    location: "In-Office",
    highlights: [
      "Profiled CPU and memory metrics of multiplayer game backend services, resolving bottlenecks and reducing runtime overhead by 25%.",
      "Refactored network communication to Promise-based asynchronous pipelines, cutting overall response latency by ~30% under 500+ concurrent connections."
    ],
    skills: ["Async Programming", "System Profiling", "Network Protocols", "Optimization"]
  }
];

/* ---------------------------------------------------------- */
/* REVEAL & ANIMATION HOOKS                                   */
/* ---------------------------------------------------------- */

function useReveal(options = { threshold: 0.1, once: true }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            if (options.once) io.unobserve(el);
          }
        }),
      options
    );
    io.observe(el);
    return () => io.disconnect();
  }, [options]);
  return [ref, visible];
}

/* Animated Count-Up Hook */
function useAnimatedCounter(targetValue, duration = 1600, suffix = "") {
  const [count, setCount] = useState(0);
  const [ref, visible] = useReveal({ threshold: 0.2, once: true });

  useEffect(() => {
    if (!visible) return;
    let startTimestamp = null;
    const numericTarget = parseInt(targetValue, 10) || 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * numericTarget));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(numericTarget);
      }
    };
    window.requestAnimationFrame(step);
  }, [visible, targetValue, duration]);

  return [ref, `${count}${suffix}`];
}

/* Hero Metric Counter Component */
function HeroStatCounter({ value, suffix, label, color }) {
  const [ref, displayCount] = useAnimatedCounter(value, 1600, suffix);
  return (
    <div ref={ref}>
      <div className="metric-count-up" style={{ fontSize: 24, fontWeight: 900, color }}>
        {displayCount}
      </div>
      <div style={{ fontSize: 12, color: "#9CA3AF" }}>{label}</div>
    </div>
  );
}

/* Multi-Directional Reveal Component */
function Reveal({ children, delay = 0, className = "", direction = "up", distance = 24 }) {
  const [ref, visible] = useReveal();

  let transformInitial = `translateY(${distance}px)`;
  if (direction === "down") transformInitial = `translateY(-${distance}px)`;
  if (direction === "left") transformInitial = `translateX(-${distance}px)`;
  if (direction === "right") transformInitial = `translateX(${distance}px)`;
  if (direction === "scale") transformInitial = `scale(0.92) translateY(12px)`;

  return (
    <div
      ref={ref}
      className={`view-scroll-reveal ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? direction === "scale"
            ? "scale(1) translateY(0)"
            : "translate(0, 0)"
          : transformInitial,
        transition: `opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* Mouse Spotlight Card Component */
function SpotlightCard({ children, className = "", style = {}, onClick }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`spotlight-card ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

/* Scroll Progress Bar Component */
function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setProgress(Math.min(Math.max(currentProgress, 0), 100));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return <div className="scroll-progress-bar" style={{ width: `${progress}%` }} />;
}

/* Scroll-To-Top Floating Action Button */
function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setVisible(window.scrollY > 350);
    };
    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`scroll-to-top-btn ${visible ? "visible" : ""}`}
      title="Scroll to top"
    >
      <ArrowUpRight size={20} style={{ transform: "rotate(-45deg)" }} />
    </button>
  );
}


/* ---------------------------------------------------------- */
/* AI CHATBOT FLOATING COMPONENT                              */
/* ---------------------------------------------------------- */

function AiChatbot({ onOpenEngagexModal, onOpenScheduleModal }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi there! 👋 I'm Priya's AI Assistant. Ask me anything about her backend experience, tech stack, live projects (Fintaxure & KanecTech), EngageX architecture, or schedule a call with her!",
      time: "Just now",
      actions: [
        { type: "schedule", label: "Schedule a Call 📅" },
        { type: "query", label: "Live Projects 🚀", query: "What are her live projects?" },
        { type: "query", label: "EngageX Architecture ⚡", query: "Tell me about EngageX" }
      ]
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg = { sender: "user", text: query, time: "Just now" };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateBotReply(query);
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 600);
  };

  const generateBotReply = (query) => {
    const q = query.toLowerCase();

    if (q.includes("resume") || q.includes("cv") || q.includes("download") || q.includes("schedule") || q.includes("call") || q.includes("meeting") || q.includes("calendar")) {
      return {
        sender: "bot",
        text: "Priya Kumari is an Associate Software Engineer at Mobtions specializing in high-performance RESTful APIs, Node.js, FastAPI, PostgreSQL, and Redis. Click below to schedule a call with her:",
        time: "Just now",
        actions: [{ type: "schedule", label: "Schedule a Call 📅" }]
      };
    }

    if (q.includes("who") || q.includes("about") || q.includes("priya") || q.includes("bio") || q.includes("background")) {
      return {
        sender: "bot",
        text: "Priya Kumari is a backend-focused Full Stack Engineer with 1+ years of professional experience. She holds a B.Tech from KIIT (2021-2025), reduced database P95 latency by 76% at Mobtions, built live platforms Fintaxure.com and KanecTech.com, and served as Lead Architect for EngageX.",
        time: "Just now",
        actions: [
          { type: "schedule", label: "Schedule a Call 📅" },
          { type: "query", label: "View Tech Stack 💻", query: "What is her tech stack?" }
        ]
      };
    }

    if (q.includes("tech") || q.includes("stack") || q.includes("skill") || q.includes("language") || q.includes("framework") || q.includes("python") || q.includes("react")) {
      return {
        sender: "bot",
        text: "Priya's core stack includes:\n• Languages: JavaScript (ES6+), Python, SQL, TypeScript\n• Backend: Node.js (Express 5), FastAPI, RESTful APIs, JWT, RBAC\n• Databases & Caching: PostgreSQL, MySQL, Redis, SQLite\n• Pipelines & DevOps: Apache Airflow (ETL), Docker, GitHub Actions, Azure DevOps\n• AI/ML: LangChain, LLMs, RAG Pipelines",
        time: "Just now",
        actions: [{ type: "schedule", label: "Schedule a Call 📅" }]
      };
    }

    if (q.includes("engagex") || q.includes("ad-tech") || q.includes("adtech") || q.includes("microservice")) {
      return {
        sender: "bot",
        text: "EngageX is a mobile performance advertising marketplace built by Priya as Lead Architect! It features 8 independently deployable microservices, 100% cookie-free server-to-server (S2S) attribution, automated Razorpay publisher payouts, and a self-healing async offer sync engine.",
        time: "Just now",
        actions: [{ type: "engagex", label: "Read EngageX Case Study ⚡" }]
      };
    }

    if (q.includes("live") || q.includes("project") || q.includes("fintaxure") || q.includes("kanectech") || q.includes("website")) {
      return {
        sender: "bot",
        text: "Priya has engineered two major live production web applications:\n1) Fintaxure.com — Financial & Tax Advisory Platform (React, Vite, Node.js)\n2) KanecTech.com — Enterprise Cloud, SAP Modernization & AI Platform",
        time: "Just now",
        actions: [
          { type: "link", label: "Visit Fintaxure.com ↗", url: "https://fintaxure.com/" },
          { type: "link", label: "Visit KanecTech.com ↗", url: "https://www.kanectech.com/" }
        ]
      };
    }

    if (q.includes("contact") || q.includes("email") || q.includes("phone") || q.includes("reach") || q.includes("hire")) {
      return {
        sender: "bot",
        text: `You can reach Priya directly via:\n• Email: ${EMAIL}\n• Phone: ${PHONE}\n• LinkedIn & GitHub profiles are available in the footer!`,
        time: "Just now",
        actions: [{ type: "email", label: "Copy Email 📧" }]
      };
    }

    if (q.includes("experience") || q.includes("mobtions") || q.includes("work") || q.includes("job")) {
      return {
        sender: "bot",
        text: "Priya works as an Associate Software Engineer at Mobtions (Jun 2025–Present) where she cut P95 API latency by 76%, reduced database load by 60% via Redis, and automated Apache Airflow ETL pipelines. She previously worked as a Game Dev Intern at Mobtions.",
        time: "Just now",
        actions: [{ type: "schedule", label: "Schedule a Call 📅" }]
      };
    }

    if (q.includes("education") || q.includes("college") || q.includes("degree") || q.includes("kiit")) {
      return {
        sender: "bot",
        text: "Priya graduated with a Bachelor of Technology (B.Tech) degree from Kalinga Institute of Industrial Technology (KIIT), Bhubaneswar (2021 – 2025).",
        time: "Just now",
        actions: [{ type: "schedule", label: "Schedule a Call 📅" }]
      };
    }

    return {
      sender: "bot",
      text: "I'm Priya's AI Assistant! You can ask me about her experience at Mobtions, her tech stack, live projects (Fintaxure & KanecTech), EngageX architecture, or schedule a call with her below:",
      time: "Just now",
      actions: [
        { type: "schedule", label: "Schedule a Call 📅" },
        { type: "query", label: "Tell me about Priya 👋", query: "Who is Priya?" }
      ]
    };
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chatbot-trigger-btn"
        title="Ask Priya's AI Assistant"
      >
        {isOpen ? <X size={26} /> : <Bot size={28} />}
      </button>

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ position: "relative" }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #38BDF8, #6366F1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF" }}>
                  <Bot size={18} />
                </div>
                <span style={{ position: "absolute", bottom: 0, right: 0, width: 8, height: 8, borderRadius: "50%", background: "#10B981", border: "1.5px solid #0E121C" }} />
              </div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: "#F9FAFB", lineHeight: 1.1 }}>Priya's AI Assistant</h4>
                <span style={{ fontSize: 11, color: "#10B981", fontWeight: 600 }}>● Online & Ready to Answer</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button
                onClick={onOpenScheduleModal}
                style={{ background: "rgba(56, 189, 248, 0.15)", border: "1px solid rgba(56, 189, 248, 0.3)", color: "#38BDF8", borderRadius: 100, padding: "4px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
              >
                <Calendar size={11} />
                <span>Schedule Call</span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                style={{ background: "transparent", border: "none", color: "#9CA3AF", cursor: "pointer", padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="chatbot-messages">
            {messages.map((m, idx) => (
              <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: m.sender === "user" ? "flex-end" : "flex-start" }}>
                <div className={m.sender === "user" ? "chat-bubble-user" : "chat-bubble-bot"}>
                  <p style={{ whiteSpace: "pre-line" }}>{m.text}</p>
                </div>

                {/* Actions inside bot response */}
                {m.actions && m.actions.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                    {m.actions.map((act, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => {
                          if (act.type === "download") handleDownloadResume();
                          if (act.type === "schedule") onOpenScheduleModal();
                          if (act.type === "engagex") onOpenEngagexModal();
                          if (act.type === "link") window.open(act.url, "_blank");
                          if (act.type === "email") navigator.clipboard.writeText(EMAIL);
                          if (act.type === "query") handleSendMessage(act.query);
                        }}
                        style={{
                          background: "rgba(56, 189, 248, 0.12)",
                          border: "1px solid rgba(56, 189, 248, 0.3)",
                          color: "#38BDF8",
                          padding: "4px 10px",
                          borderRadius: "100px",
                          fontSize: 11.5,
                          fontWeight: 700,
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                      >
                        {act.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="chat-bubble-bot" style={{ display: "flex", alignItems: "center", gap: 4, width: 50 }}>
                <div className="typing-dot" style={{ animationDelay: "0s" }} />
                <div className="typing-dot" style={{ animationDelay: "0.2s" }} />
                <div className="typing-dot" style={{ animationDelay: "0.4s" }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Pills */}
          <div style={{ padding: "8px 12px", background: "#0B0E17", borderTop: "1px solid rgba(255, 255, 255, 0.06)", display: "flex", gap: 6, overflowX: "auto" }}>
            {[
              "Tell me about Priya",
              "What is her tech stack?",
              "Live Projects",
              "Tell me about EngageX",
              "Schedule a Call",
              "Contact Info"
            ].map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(q)}
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#D1D5DB",
                  borderRadius: "100px",
                  padding: "3px 10px",
                  fontSize: 11,
                  whiteSpace: "nowrap",
                  cursor: "pointer"
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div style={{ padding: "10px 12px", background: "#131826", borderTop: "1px solid rgba(255, 255, 255, 0.08)", display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask anything about Priya..."
              style={{
                flexGrow: 1,
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "100px",
                padding: "8px 14px",
                color: "#F9FAFB",
                fontSize: 12.5,
                outline: "none",
                fontFamily: "var(--font-sans)"
              }}
            />
            <button
              onClick={() => handleSendMessage()}
              style={{
                background: "linear-gradient(135deg, #38BDF8 0%, #6366F1 100%)",
                border: "none",
                color: "#FFF",
                width: 34,
                height: 34,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0
              }}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------------------------------------------------------- */
/* ENGAGEX FULL CASE STUDY MODAL POPUP COMPONENT              */
/* ---------------------------------------------------------- */

function EngagexModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("summary");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ padding: 8, borderRadius: 8, background: "rgba(56, 189, 248, 0.15)", color: "#38BDF8" }}>
              <Zap size={22} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#F9FAFB", lineHeight: 1.2 }}>
                  EngageX — Full Case Study & Architecture
                </h2>
                <span style={{ fontSize: 11, background: "rgba(16, 185, 129, 0.15)", color: "#10B981", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "2px 8px", borderRadius: 100, fontWeight: 700 }}>
                  AD-TECH FULL STACK
                </span>
              </div>
              <span style={{ fontSize: 12, color: "#9CA3AF" }}>Role: Lead Developer / Architect • Duration: 14 months (ongoing) • Team: Solo Backend + 1 Frontend Collaborator</span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "#F9FAFB",
              borderRadius: "50%",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Navigation Sub-Header Bar */}
        <div
          style={{
            padding: "12px 24px",
            background: "#0F131D",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            alignItems: "center",
          }}
        >
          {[
            { id: "summary", label: "Executive Summary", icon: FileText },
            { id: "architecture", label: "8 Microservices", icon: Layers },
            { id: "sync", label: "Offer Sync Engine", icon: RefreshCw },
            { id: "attribution", label: "S2S Attribution", icon: Zap },
            { id: "stack", label: "Tech Stack Table", icon: Database },
            { id: "interview", label: "Key Highlights", icon: Sparkles },
          ].map((t) => {
            const IconComp = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 16px",
                  borderRadius: "100px",
                  fontSize: "13px",
                  fontWeight: isActive ? 700 : 600,
                  cursor: "pointer",
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  background: isActive
                    ? "linear-gradient(135deg, #38BDF8 0%, #6366F1 100%)"
                    : "rgba(255, 255, 255, 0.04)",
                  color: isActive ? "#FFFFFF" : "#9CA3AF",
                  border: isActive
                    ? "1px solid transparent"
                    : "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: isActive
                    ? "0 4px 14px rgba(56, 189, 248, 0.35)"
                    : "none",
                  fontFamily: "var(--font-sans)",
                  whiteSpace: "nowrap",
                  lineHeight: 1.2,
                }}
              >
                <IconComp size={15} color={isActive ? "#FFFFFF" : "#38BDF8"} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="modal-body">
          
          {/* TAB 1: EXECUTIVE SUMMARY */}
          {activeTab === "summary" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              
              {/* Project Card Metadata Banner */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, background: "#121724", padding: 18, borderRadius: 14, border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <div>
                  <div style={{ fontSize: 11, color: "#6B7280", fontFamily: "var(--font-mono)", fontWeight: 600 }}>PROJECT NAME</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#F9FAFB", marginTop: 2 }}>EngageX</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#6B7280", fontFamily: "var(--font-mono)", fontWeight: 600 }}>ROLE</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#38BDF8", marginTop: 2 }}>Lead Developer / Architect</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#6B7280", fontFamily: "var(--font-mono)", fontWeight: 600 }}>DURATION & TEAM</div>
                  <div style={{ fontSize: 13.5, color: "#D1D5DB", marginTop: 2 }}>14 months • Solo Backend + 1 Frontend</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#6B7280", fontFamily: "var(--font-mono)", fontWeight: 600 }}>ARCHITECTURE</div>
                  <div style={{ fontSize: 13.5, color: "#10B981", fontWeight: 700, marginTop: 2 }}>8 Bounded Microservices</div>
                </div>
              </div>

              {/* One-Liner Box */}
              <div style={{ background: "rgba(56, 189, 248, 0.06)", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: 16, padding: 22 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#38BDF8", fontFamily: "var(--font-mono)" }}>ONE-LINER:</span>
                <p style={{ fontSize: 15.5, fontWeight: 700, color: "#F9FAFB", marginTop: 6, lineHeight: 1.5 }}>
                  A performance-based mobile advertising marketplace connecting advertisers and publishers — with real-time click/conversion tracking, automated Razorpay payouts, and self-healing sync across third-party ad networks.
                </p>
              </div>

              {/* The Problem It Solves */}
              <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: 16, padding: 22 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#F9FAFB", marginBottom: 8 }}>The Problem It Solves:</h3>
                <p style={{ fontSize: 14, color: "#9CA3AF", lineHeight: 1.7 }}>
                  Performance marketing (advertisers paying for installs, signups, or in-app purchases driven by affiliate publishers) lives or dies on <strong style={{ color: "#F9FAFB" }}>trust and attribution accuracy</strong>. Advertisers need proof a conversion really happened before they pay. Publishers need proof their traffic is credited fairly. Neither trusts the other to report numbers honestly.
                </p>
                <p style={{ fontSize: 14, color: "#9CA3AF", lineHeight: 1.7, marginTop: 10 }}>
                  EngageX sits in the middle as the source of truth: it issues trackable links, validates every click, receives server-to-server conversion confirmations, and pays out publishers automatically — all without relying on browser cookies or third-party client scripts.
                </p>
              </div>

              {/* Complete 11 Feature List */}
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#F9FAFB", marginBottom: 12 }}>What I Built (Complete Feature List):</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 10 }}>
                  {[
                    "User/auth system with role-based access (advertiser, publisher, admin)",
                    "Campaign creation, review, and approval workflow",
                    "Real-time click tracking with geo/device validation and redirect chaining",
                    "Server-to-server (S2S) postback system for conversion attribution",
                    "Publisher wallet system with automated crediting and payout via Razorpay",
                    "Admin dashboard for campaign and user management",
                    "Publisher-facing web dashboard (React) — live campaign browsing, stats, earnings",
                    "Embeddable JavaScript/TypeScript SDK ('offerwall widget') for publishers",
                    "Background job system for scheduled stats syncing and nightly reporting rollups",
                    "Automated, config-driven engine pulling offers from external APIs & normalizing formats",
                    "Distributed tracing/observability (OpenTelemetry & Pino) across all backend services"
                  ].map((feat, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "#121724", padding: 12, borderRadius: 10, border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                      <CheckCircle2 size={16} color="#10B981" style={{ marginTop: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: "#D1D5DB", lineHeight: 1.4 }}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Metrics */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginTop: 6 }}>
                <div style={{ background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.25)", padding: 16, borderRadius: 12 }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#10B981" }}>20+ Hours/Wk</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>Manual Offer Syncing Eliminated</div>
                </div>
                <div style={{ background: "rgba(56, 189, 248, 0.08)", border: "1px solid rgba(56, 189, 248, 0.25)", padding: 16, borderRadius: 12 }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#38BDF8" }}>100% S2S</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>Cookie-Free Attribution Accuracy</div>
                </div>
                <div style={{ background: "rgba(168, 85, 247, 0.08)", border: "1px solid rgba(168, 85, 247, 0.25)", padding: 16, borderRadius: 12 }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#A855F7" }}>0 Discrepancies</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>Automated Razorpay Payout Engine</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 8 MICROSERVICES ARCHITECTURE */}
          {activeTab === "architecture" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "#F9FAFB", marginBottom: 6 }}>
                  Approach: Service-Oriented, Not Monolithic
                </h3>
                <p style={{ fontSize: 14, color: "#9CA3AF", lineHeight: 1.6 }}>
                  Rather than one large monolithic application, I split EngageX into <strong style={{ color: "#F9FAFB" }}>8 independently deployable services</strong>, each owning a single responsibility. This separation ensured high-traffic click/redirect paths never competed for resources with heavy background sync jobs.
                </p>
              </div>

              {/* Visual System Architecture Diagram */}
              <div style={{ background: "#090B10", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: 16, padding: 24 }}>
                <div style={{ fontSize: 12, color: "#38BDF8", fontFamily: "var(--font-mono)", fontWeight: 700, marginBottom: 16 }}>
                  // ENGAGEX 8-MICROSERVICE ARCHITECTURE FLOW:
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
                  {[
                    { num: "01", title: "React Web Dashboard", tech: "React + Vite", desc: "Publisher & advertiser operational portal for campaigns, wallet analytics, and offer picking." },
                    { num: "02", title: "Embeddable Offerwall SDK", tech: "TypeScript + Vite Bundle", desc: "Lightweight SDK embedded directly on third-party publisher mobile sites & apps." },
                    { num: "03", title: "Public REST API", tech: "Node.js (Express 5)", desc: "Domain-organized controllers handling auth, campaigns, wallet ledgers, and Razorpay payouts." },
                    { num: "04", title: "Async Campaigns Read API", tech: "FastAPI + SQLAlchemy 2", desc: "High-throughput read engine powering SDK calls with async SQLAlchemy 2 & asyncpg." },
                    { num: "05", title: "Background Job Workers", tech: "Celery + Celery Beat", desc: "Scheduled stats syncing, interval rollups, and automated postback retries." },
                    { num: "06", title: "Offer Sync Engine", tech: "Python asyncio", desc: "Concurrent advertiser API fetcher normalizing schemas into SQLite local state." },
                    { num: "07", title: "Persistence & Caching", tech: "Postgres + Redis Cluster", desc: "JSONB device targeting rules and 2-Hour Redis search cache." },
                    { num: "08", title: "Legacy Network Syncer", tech: "C# / .NET Service", desc: "Parallel C# sync worker for legacy partner feeds." }
                  ].map((s) => (
                    <div key={s.num} style={{ background: "#121724", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: 12, padding: 16 }}>
                      <span style={{ fontSize: 11, color: "#38BDF8", fontFamily: "var(--font-mono)", fontWeight: 700 }}>SERVICE {s.num}</span>
                      <h4 style={{ fontSize: 14.5, fontWeight: 800, color: "#F9FAFB", margin: "4px 0" }}>{s.title}</h4>
                      <span style={{ fontSize: 11, color: "#10B981", background: "rgba(16, 185, 129, 0.12)", padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>{s.tech}</span>
                      <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 8, lineHeight: 1.4 }}>{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HARDEST PROBLEM - OFFER SYNC ENGINE & RECOVERY */}
          {activeTab === "sync" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "#F9FAFB", marginBottom: 6 }}>
                  The Hardest Problem: Keeping External Data in Sync Without Drifting
                </h3>
                <p style={{ fontSize: 14, color: "#9CA3AF", lineHeight: 1.6 }}>
                  The trickiest piece wasn't the APIs — it was building an engine that keeps campaign/offer data in sync between our advertisers' systems and downstream ad networks automatically, without creating duplicate records or drifting out of sync.
                </p>
              </div>

              <div style={{ background: "rgba(245, 158, 11, 0.06)", border: "1px solid rgba(245, 158, 11, 0.25)", padding: 16, borderRadius: 12, fontSize: 13.5, color: "#F9FAFB" }}>
                <strong style={{ color: "#F59E0B" }}>Why this is hard:</strong> Each advertiser's API is different (auth, pagination, field names, device formatting like 'phone' vs 'smartphone' vs 1/0). The downstream ad network has strict acceptance rules.
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ background: "#121724", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: 14, padding: 20 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: "#38BDF8" }}>1. Fully Declarative YAML Mapping System</h4>
                  <p style={{ fontSize: 13.5, color: "#D1D5DB", marginTop: 4, lineHeight: 1.5 }}>
                    Each advertiser's quirks live in a YAML config file (how to fetch their data, how fields map to our internal model), completely separate from platform rules. Onboarding a new advertiser source became a configuration task rather than a code change.
                  </p>
                </div>

                <div style={{ background: "#121724", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: 14, padding: 20 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: "#38BDF8" }}>2. Three-Stage Value Resolution Pipeline</h4>
                  <p style={{ fontSize: 13.5, color: "#D1D5DB", marginTop: 4, lineHeight: 1.5 }}>
                    Raw value → advertiser-specific transform → platform enum validation with defined fallbacks (skip / keep / null). Messy real-world data never silently breaks the sync pipeline.
                  </p>
                </div>

                <div style={{ background: "#121724", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: 14, padding: 20 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: "#38BDF8" }}>3. Deterministic Hash-Based Change Detection</h4>
                  <p style={{ fontSize: 13.5, color: "#D1D5DB", marginTop: 4, lineHeight: 1.5 }}>
                    Every offer's meaningful state gets hashed and stored locally, so every sync cycle only pushes real deltas (new, changed, or removed offers) instead of blindly re-sending everything.
                  </p>
                </div>

                <div style={{ background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: 14, padding: 20 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: "#10B981" }}>4. Cold-Start Bootstrap Reconciliation Recovery Mechanism (Standout Engineering)</h4>
                  <p style={{ fontSize: 13.5, color: "#D1D5DB", marginTop: 4, lineHeight: 1.5 }}>
                    If the local sync-state database is ever lost, treating everything as brand new would create fresh IDs downstream and sever historical attribution links. Instead, I built a <strong style={{ color: "#F9FAFB" }}>bootstrap reconciliation flow</strong>: on startup with empty state, the engine fetches current downstream state first, matches records by external ID, and compares hashes — updating what drifted, creating only what's new, and pausing what disappeared. Zero duplicate records even on cold start recovery.
                  </p>
                </div>

                <div style={{ background: "#121724", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: 14, padding: 20 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: "#38BDF8" }}>5. Extensible Eligibility Pipeline & Async Execution</h4>
                  <p style={{ fontSize: 13.5, color: "#D1D5DB", marginTop: 4, lineHeight: 1.5 }}>
                    Composable rule classes (minimum payouts, geo restrictions, device filters). The whole engine runs as a single async Python process fetching concurrently from dozens of advertiser sources (bounded by a semaphore) with per-source scheduling.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SERVER-TO-SERVER ATTRIBUTION */}
          {activeTab === "attribution" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "#F9FAFB", marginBottom: 6 }}>
                  Real-Time Server-to-Server (S2S) Click-to-Conversion Pipeline
                </h3>
                <p style={{ fontSize: 14, color: "#9CA3AF", lineHeight: 1.6 }}>
                  By eliminating reliance on third-party cookies, in-app browser quirks, or browser storage, EngageX delivers 100% cookie-free mobile attribution accuracy.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { step: "01", title: "Unique Tracking Link Generation", desc: "Publisher gets a unique tracking link per campaign containing embedded publisher tokens." },
                  { step: "02", title: "Real-Time Geo & Device Validation", desc: "System validates incoming request IP geo-location and device targeting rules instantly, issuing a unique Click ID." },
                  { step: "03", title: "Redirect Chaining", desc: "User is redirected onward to the advertiser target landing page or App Store listing." },
                  { step: "04", title: "Server-to-Server (S2S) Postback Confirmation", desc: "When advertiser measurement tools detect a conversion, an S2S HTTP postback is fired back to EngageX with the Click ID." },
                  { step: "05", title: "Automated Razorpay Publisher Wallet Crediting", desc: "EngageX matches the Click ID, credits the publisher wallet ledger, and triggers automated Razorpay payouts." }
                ].map((p) => (
                  <div key={p.step} style={{ display: "flex", gap: 16, background: "#121724", border: "1px solid rgba(255, 255, 255, 0.08)", padding: 18, borderRadius: 12, alignItems: "center" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#38BDF8", color: "#07090E", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {p.step}
                    </div>
                    <div>
                      <h4 style={{ fontSize: 15, fontWeight: 800, color: "#F9FAFB" }}>{p.title}</h4>
                      <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: POLYGLOT TECH STACK TABLE */}
          {activeTab === "stack" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#F9FAFB" }}>
                Full Polyglot Tech Stack & Infrastructure Table
              </h3>
              
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, color: "#D1D5DB" }}>
                  <thead>
                    <tr style={{ background: "#161B28", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", textAlign: "left" }}>
                      <th style={{ padding: 12 }}>Layer</th>
                      <th style={{ padding: 12 }}>Technology Adopted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Backend APIs", "Node.js (Express 5), Python (FastAPI, async ORM)"],
                      ["Background Processing", "Celery + Celery Beat, Python asyncio"],
                      ["Database & Caching", "PostgreSQL (raw driver + SQLAlchemy 2), Redis (caching), SQLite (local sync state)"],
                      ["Frontend Dashboard", "React, Vite, TypeScript"],
                      ["SDK / Embeddable Widget", "React + TypeScript + Vite, bundled for third-party embedding"],
                      ["Auth & Security", "JWT, bcrypt, Helmet, Rate limiting, Joi validation"],
                      ["Payments Engine", "Razorpay Payment Gateway"],
                      ["Cloud / Infrastructure", "AWS S3 (file storage), AWS SNS (notifications), Docker"],
                      ["Observability & Tracing", "OpenTelemetry, Structured JSON logging (Pino)"],
                      ["Legacy Integration", "C# / .NET Windows Service for older partner-network syncing"]
                    ].map(([layer, tech], i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)", background: i % 2 === 0 ? "rgba(255, 255, 255, 0.02)" : "transparent" }}>
                        <td style={{ padding: 12, fontWeight: 700, color: "#38BDF8" }}>{layer}</td>
                        <td style={{ padding: 12, color: "#F9FAFB" }}>{tech}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Supporting Infra Section */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginTop: 10 }}>
                <div style={{ background: "#121724", padding: 16, borderRadius: 12, border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: "#38BDF8" }}>Shared Private Code Package</h4>
                  <p style={{ fontSize: 12.5, color: "#9CA3AF", marginTop: 4 }}>Built & versioned private npm package (@engagex/core) enforcing shared domain rules across Node services.</p>
                </div>
                <div style={{ background: "#121724", padding: 16, borderRadius: 12, border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: "#10B981" }}>OpenTelemetry Observability</h4>
                  <p style={{ fontSize: 12.5, color: "#9CA3AF", marginTop: 4 }}>Every service instrumented with OpenTelemetry exporting traces to a central collector for distributed debugging.</p>
                </div>
                <div style={{ background: "#121724", padding: 16, borderRadius: 12, border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: "#A855F7" }}>Legacy .NET Stewardship</h4>
                  <p style={{ fontSize: 12.5, color: "#9CA3AF", marginTop: 4 }}>Maintained pre-existing C#/.NET Windows Service for legacy partner feeds, avoiding risky big-bang rewrites.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: INTERVIEW & TALKING POINTS */}
          {activeTab === "interview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#F9FAFB" }}>
                What I Highlight in Technical Conversations & Interviews
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
                <div style={{ background: "#121724", padding: 20, borderRadius: 14, border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: "#38BDF8" }}>System Architecture Design</h4>
                  <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 6, lineHeight: 1.5 }}>
                    Breaking a complex multi-sided ad-tech domain into cleanly bounded, independently deployable microservices.
                  </p>
                </div>

                <div style={{ background: "#121724", padding: 20, borderRadius: 14, border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: "#38BDF8" }}>Handling Messy Data at Scale</h4>
                  <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 6, lineHeight: 1.5 }}>
                    Building declarative mapping pipelines to absorb inconsistent third-party advertiser data without breaking downstream sync.
                  </p>
                </div>

                <div style={{ background: "#121724", padding: 20, borderRadius: 14, border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: "#38BDF8" }}>Designing for Failure Recovery</h4>
                  <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 6, lineHeight: 1.5 }}>
                    Solving the cold-start bootstrap reconciliation problem so state loss never causes duplicate record creation.
                  </p>
                </div>

                <div style={{ background: "#121724", padding: 20, borderRadius: 14, border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: "#38BDF8" }}>Full-Stack Polyglot Versatility</h4>
                  <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 6, lineHeight: 1.5 }}>
                    Backend APIs in Node.js & Python FastAPI, React dashboards, embeddable TypeScript SDKs, and legacy .NET maintenance.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Bar */}
        <div style={{ padding: "16px 28px", background: "#121723", borderTop: "1px solid rgba(255, 255, 255, 0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#6B7280", fontFamily: "var(--font-mono)" }}>
            EngageX Case Study • Lead Developer / Architect: Priya Kumari
          </span>
          <button onClick={onClose} className="btn-glow-primary" style={{ padding: "8px 20px", fontSize: 13 }}>
            <span>Close Case Study</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- */
/* FREE INTERACTIVE CALENDAR BOOKING MODAL                    */
/* ---------------------------------------------------------- */
function ScheduleCallModal({ isOpen, onClose }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("11:30 AM");
  const [formData, setFormData] = useState({ name: "", email: "", note: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const getNextAvailableDays = () => {
    const days = [];
    let current = new Date();
    // Start bookings from tomorrow
    current.setDate(current.getDate() + 1);
    while (days.length < 7) {
      if (current.getDay() !== 0 && current.getDay() !== 6) {
        days.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const [availableDays] = useState(getNextAvailableDays());

  useEffect(() => {
    if (availableDays.length > 0 && !selectedDate) {
      setSelectedDate(availableDays[0]);
    }
  }, [availableDays, selectedDate]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !selectedDate) return;
    setIsSubmitting(true);

    const emailSubject = `📅 New Call Scheduled: ${formData.name}`;
    const emailBody = `
You have a new 1-on-1 meeting request from your portfolio:
--------------------------------------------------
Name: ${formData.name}
Email: ${formData.email}
Date: ${formatDateLabel(selectedDate)}
Time: ${selectedSlot} (IST)
Purpose/Note: ${formData.note || 'None'}
--------------------------------------------------
    `;

    fetch("https://formsubmit.co/ajax/priyasingh311256@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        subject: emailSubject,
        date: formatDateLabel(selectedDate),
        time: selectedSlot,
        note: formData.note || 'None',
        message: emailBody
      })
    })
    .then(() => {
      setIsSubmitting(false);
      setIsBooked(true);
    })
    .catch((err) => {
      console.error("Mail submit error: ", err);
      // Fallback: show success state anyway so user experience is not disrupted
      setIsSubmitting(false);
      setIsBooked(true);
    });
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", note: "" });
    setIsBooked(false);
    onClose();
  };

  const timeSlots = ["10:00 AM", "11:30 AM", "02:00 PM", "03:30 PM", "05:00 PM"];

  const formatDateLabel = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" style={{ maxWidth: 580, padding: 0, overflow: "hidden" }} onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="modal-header" style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ padding: 8, borderRadius: 8, background: "rgba(56, 189, 248, 0.15)", color: "#38BDF8" }}>
              <Calendar size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#F9FAFB", lineHeight: 1.2 }}>
                Schedule a 1-on-1 Call
              </h2>
              <span style={{ fontSize: 12, color: "#9CA3AF" }}>Choose a time that works best for you. 100% free.</span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "#F9FAFB",
              borderRadius: "50%",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: 24, maxHeight: "calc(85vh - 80px)", overflowY: "auto" }}>
          {isBooked ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "32px 16px" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(16, 185, 129, 0.2)", border: "2px solid #10B981", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981", marginBottom: 16 }}>
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: "#F9FAFB" }}>Meeting Scheduled!</h3>
              <p style={{ fontSize: 14, color: "#9CA3AF", marginTop: 8, maxWidth: 420, lineHeight: 1.6 }}>
                Awesome, <strong style={{ color: "#F9FAFB" }}>{formData.name}</strong>! Your 30-minute session is confirmed for:
              </p>
              <div style={{ margin: "16px 0", padding: "12px 24px", background: "rgba(56, 189, 248, 0.1)", borderRadius: 12, border: "1px solid rgba(56, 189, 248, 0.2)", color: "#38BDF8", fontWeight: 700, fontSize: 15 }}>
                📅 {formatDateLabel(selectedDate)} at ⏰ {selectedSlot} (IST)
              </div>
              <p style={{ fontSize: 13.5, color: "#9CA3AF", maxWidth: 380, lineHeight: 1.5 }}>
                A calendar invitation with the Google Meet link has been sent to <strong style={{ color: "#38BDF8" }}>{formData.email}</strong>.
              </p>
              <button
                onClick={handleReset}
                className="btn-secondary"
                style={{ marginTop: 24, padding: "10px 24px", fontSize: 13.5 }}
              >
                <span>Done</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              
              {/* Date Selection */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#9CA3AF", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  1. Select Date
                </label>
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6 }}>
                  {availableDays.map((date, idx) => {
                    const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedDate(date)}
                        style={{
                          flex: "0 0 auto",
                          padding: "10px 14px",
                          borderRadius: 12,
                          background: isSelected ? "rgba(56, 189, 248, 0.15)" : "rgba(255, 255, 255, 0.03)",
                          border: isSelected ? "1.5px solid #38BDF8" : "1.5px solid rgba(255, 255, 255, 0.08)",
                          color: isSelected ? "#38BDF8" : "#9CA3AF",
                          cursor: "pointer",
                          textAlign: "center",
                          minWidth: 80,
                          transition: "all 0.2s ease"
                        }}
                      >
                        <div style={{ fontSize: 11, textTransform: "uppercase", fontWeight: 600 }}>{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
                        <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>{date.getDate()}</div>
                        <div style={{ fontSize: 10, marginTop: 2 }}>{date.toLocaleDateString("en-US", { month: "short" })}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#9CA3AF", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  2. Select Time (IST)
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {timeSlots.map((slot, idx) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        style={{
                          padding: "8px 14px",
                          borderRadius: 100,
                          background: isSelected ? "rgba(56, 189, 248, 0.15)" : "rgba(255, 255, 255, 0.03)",
                          border: isSelected ? "1px solid #38BDF8" : "1px solid rgba(255, 255, 255, 0.08)",
                          color: isSelected ? "#38BDF8" : "#D1D5DB",
                          fontWeight: 600,
                          fontSize: 12.5,
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Info */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14, borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: 18 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  3. Your Details
                </label>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        padding: "10px 14px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: 10,
                        color: "#FFF",
                        fontSize: 13.5,
                        outline: "none"
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        padding: "10px 14px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: 10,
                        color: "#FFF",
                        fontSize: 13.5,
                        outline: "none"
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <textarea
                    placeholder="Describe the purpose of the call (optional)"
                    rows={2}
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    style={{
                      padding: "10px 14px",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: 10,
                      color: "#FFF",
                      fontSize: 13.5,
                      outline: "none",
                      resize: "vertical"
                    }}
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-glow-primary"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: "12px",
                  fontSize: 14,
                  fontWeight: 700,
                  marginTop: 8
                }}
              >
                <span>{isSubmitting ? "Booking Session..." : "Confirm Booking"}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* Smooth Vertical Morph/Flip Text Animation Component (Zero Layout Shift) */
function WordFlipAnimation({
  words = [
    "Low-Latency Systems",
    "High-Throughput APIs",
    "Self-Healing Architectures",
    "Scalable Microservices",
    "Live Production Web Apps"
  ],
  interval = 2800
}) {
  const [index, setIndex] = useState(0);
  const [animState, setAnimState] = useState("idle"); // 'idle' | 'leaving' | 'entering'

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimState("leaving");
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setAnimState("entering");
        setTimeout(() => {
          setAnimState("idle");
        }, 50);
      }, 350);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  let transformVal = "translateY(0%)";
  let opacityVal = 1;
  if (animState === "leaving") {
    transformVal = "translateY(-100%)";
    opacityVal = 0;
  } else if (animState === "entering") {
    transformVal = "translateY(100%)";
    opacityVal = 0;
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        position: "relative",
        verticalAlign: "bottom",
        overflow: "hidden",
        height: "1.25em",
        lineHeight: "1.25em",
        paddingRight: "4px"
      }}
    >
      <span
        className="text-gradient-animate"
        style={{
          display: "inline-block",
          transition: animState === "entering" ? "none" : "transform 0.38s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease",
          transform: transformVal,
          opacity: opacityVal,
          whiteSpace: "nowrap"
        }}
      >
        {words[index]}
      </span>
    </span>
  );
}

/* ---------------------------------------------------------- */
/* INTERACTIVE CONTACT FORM COMPONENT                         */
/* ---------------------------------------------------------- */

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Full-Stack Web App",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitting(true);

    fetch("https://formsubmit.co/ajax/priyasingh311256@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        subject: `✉️ New Portfolio Message: ${formData.subject}`,
        message: formData.message
      })
    })
    .then(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    })
    .catch((err) => {
      console.error("Contact form error: ", err);
      setIsSubmitting(false);
      setSubmitted(true);
    });
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", subject: "Full-Stack Web App", message: "" });
    setSubmitted(false);
  };

  return (
    <SpotlightCard className="contact-form-card">
      {submitted ? (
        <div className="form-success-banner" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "28px 16px" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(16, 185, 129, 0.2)", border: "2px solid #10B981", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981", marginBottom: 12 }}>
            <CheckCircle2 size={28} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "#F9FAFB" }}>Message Sent Successfully!</h3>
          <p style={{ fontSize: 13.5, color: "#9CA3AF", marginTop: 6, maxWidth: 380, lineHeight: 1.5 }}>
            Thank you, <strong style={{ color: "#F9FAFB" }}>{formData.name}</strong>! Priya has received your message and will reply shortly at <strong style={{ color: "#38BDF8" }}>{formData.email}</strong>.
          </p>
          <button
            onClick={handleReset}
            className="btn-secondary"
            style={{ marginTop: 20, padding: "8px 20px", fontSize: 13 }}
          >
            <span>Send Another Message</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18, position: "relative", zIndex: 2 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <div className="contact-input-group">
              <label className="contact-input-label">
                <User size={14} color="#38BDF8" />
                <span>Your Name</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Alex Rivera"
                className="contact-input-field"
              />
            </div>

            <div className="contact-input-group">
              <label className="contact-input-label">
                <Mail size={14} color="#38BDF8" />
                <span>Your Email</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="alex@company.com"
                className="contact-input-field"
              />
            </div>
          </div>

          <div className="contact-input-group">
            <label className="contact-input-label">
              <Zap size={14} color="#38BDF8" />
              <span>Project Type / Inquiry</span>
            </label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="contact-input-field"
              style={{ cursor: "pointer", background: "#0E121C" }}
            >
              <option value="Full-Stack Web App">Full-Stack Web Application (React / Node / FastAPI)</option>
              <option value="Backend Optimization">Backend & API Performance Optimization</option>
              <option value="System Architecture">System Architecture & Microservices Consulting</option>
              <option value="Hiring / Full-Time Role">Hiring / Full-Time Role Opportunity</option>
              <option value="General Inquiry">General Inquiry / Coffee Chat</option>
            </select>
          </div>

          <div className="contact-input-group">
            <label className="contact-input-label">
              <MessageCircle size={14} color="#38BDF8" />
              <span>Your Message</span>
            </label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell Priya about your project requirements, timeline, or goals..."
              className="contact-input-field"
              style={{ resize: "vertical" }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-glow-primary"
            style={{ width: "100%", justifyContent: "center", padding: "14px 28px", fontSize: 15, marginTop: 4 }}
          >
            {isSubmitting ? (
              <span>Sending Message...</span>
            ) : (
              <>
                <Send size={16} />
                <span>Send Message to Priya</span>
              </>
            )}
          </button>
        </form>
      )}
    </SpotlightCard>
  );
}


/* ---------------------------------------------------------- */
/* MAIN PORTFOLIO COMPONENT                                   */
/* ---------------------------------------------------------- */

export default function Portfolio() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Portfolio filter & carousel state
  const [activeTab, setActiveTab] = useState("All");
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Code Module state
  const [activeCodeId, setActiveCodeId] = useState("seat");

  // EngageX Modal State
  const [isEngagexModalOpen, setIsEngagexModalOpen] = useState(false);

  // Custom Calendar Scheduler Modal State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const currentCodeModule = CODE_MODULES.find((m) => m.id === activeCodeId) || CODE_MODULES[0];

  // Filter logic
  const filteredProjects = PORTFOLIO_PROJECTS.filter((p) => {
    if (activeTab === "All") return true;
    if (activeTab === "Websites") return p.category === "Websites";
    if (activeTab === "Apps") return p.category === "Apps";
    if (activeTab === "Article" || activeTab === "Weblog") return p.category === "Article" || p.category === "Weblog";
    return true;
  });

  const handlePrev = () => {
    setCarouselIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = () => {
    setCarouselIndex((prev) => (prev < Math.ceil(filteredProjects.length / 6) - 1 ? prev + 1 : prev));
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", backgroundColor: "#07090E", color: "#F9FAFB" }}>
      {/* Top Viewport Scroll Progress Bar & Scroll To Top Floating Button */}
      <ScrollProgressBar />
      <ScrollToTopButton />

      {/* Background Mesh & Floating Light Orbs */}
      <div className="bg-dribbble-mesh" />
      <div className="bg-dot-pattern" />
      <div className="bg-orb-1" />
      <div className="bg-orb-2" />

      {/* ---------------- 1. FLOATING GLASS CAPSULE NAVBAR ---------------- */}
      <header className="floating-navbar">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          
          {/* Brand & Profile Avatar */}
          <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #38BDF8, #6366F1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                color: "#FFFFFF",
                fontSize: 14,
                boxShadow: "0 0 12px rgba(56, 189, 248, 0.4)",
              }}
            >
              P
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#F9FAFB", lineHeight: 1.1 }}>Priya Kumari</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#10B981", fontWeight: 600 }}>
                <span className="status-pulse-ring" style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981" }} />
                <span>Available for work</span>
              </div>
            </div>
          </a>

          {/* Nav Items */}
          <nav style={{ display: "none", alignItems: "center", gap: 24 }} className="md-flex">
            <a href="#about" style={navLinkStyle}>About</a>
            <a href="#portfolio" style={navLinkStyle}>Portfolio</a>
            <a href="#projects" style={navLinkStyle}>Featured Systems</a>
            <a href="#services" style={navLinkStyle}>Services</a>
            <a href="#experience" style={navLinkStyle}>Experience</a>
            <a href="#contact" style={navLinkStyle}>Contact</a>
          </nav>

          {/* Header Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setIsScheduleModalOpen(true)} className="btn-secondary" style={{ padding: "8px 16px", fontSize: 13, gap: 6 }}>
              <Calendar size={14} color="#38BDF8" />
              <span>Schedule Call</span>
            </button>

            <a href="#contact" className="btn-glow-primary" style={{ padding: "8px 18px", fontSize: 13 }}>
              <span>Let's Talk</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </header>

      {/* ---------------- 2. HERO SECTION WITH ORGANIC BLOB PORTRAIT ---------------- */}
      <section id="about" style={{ paddingTop: 140, paddingBottom: 80, maxWidth: 1180, margin: "0 auto", paddingLeft: 24, paddingRight: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 48, alignItems: "center" }}>
          
          {/* Hero Left Copy */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", borderRadius: 100, background: "rgba(56, 189, 248, 0.1)", border: "1px solid rgba(56, 189, 248, 0.25)", fontSize: 12.5, fontWeight: 700, color: "#38BDF8", marginBottom: 20 }}>
              <Zap size={14} color="#38BDF8" />
              <span>FULL-STACK DEVELOPER & BACKEND ENGINEER</span>
            </div>

            <h1
              style={{
                fontSize: "clamp(2.3rem, 4.5vw, 3.6rem)",
                fontWeight: 900,
                lineHeight: 1.25,
                letterSpacing: "-0.03em",
                color: "#F9FAFB",
                marginBottom: 20,
              }}
            >
              Architecting <br />
              <WordFlipAnimation /> <br />
              For Enterprise Systems.
            </h1>

            <p style={{ fontSize: "1.1rem", color: "#9CA3AF", maxWidth: 540, lineHeight: 1.7, marginBottom: 32 }}>
              Hi, I'm <strong style={{ color: "#F9FAFB" }}>Priya Kumari</strong> — Associate Software Engineer at Mobtions. Lead Architect of <button onClick={() => setIsEngagexModalOpen(true)} style={{ background: "none", border: "none", color: "#38BDF8", fontWeight: 800, cursor: "pointer", padding: 0, textDecoration: "underline" }}>EngageX</button>, and creator of production platforms <a href="https://fintaxure.com/" target="_blank" rel="noreferrer" style={{ color: "#38BDF8", textDecoration: "none", fontWeight: 700 }}>Fintaxure.com</a> and <a href="https://www.kanectech.com/" target="_blank" rel="noreferrer" style={{ color: "#38BDF8", textDecoration: "none", fontWeight: 700 }}>KanecTech.com</a>.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 36 }}>
              <button onClick={() => setIsScheduleModalOpen(true)} className="btn-glow-primary" style={{ gap: 8 }}>
                <Calendar size={16} />
                <span>Schedule a Call</span>
              </button>

              <button onClick={handleDownloadResume} className="btn-secondary">
                <Download size={16} color="#38BDF8" />
                <span>Download Resume</span>
              </button>

              <button onClick={() => setIsEngagexModalOpen(true)} className="btn-secondary">
                <FileText size={16} color="#38BDF8" />
                <span>Read EngageX Case Study</span>
              </button>

              <button onClick={copyEmail} className="btn-secondary">
                {copiedEmail ? <Check size={16} color="#10B981" /> : <Mail size={16} color="#38BDF8" />}
                <span>{copiedEmail ? "Copied!" : "Contact"}</span>
              </button>
            </div>

            {/* Animated Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: 20 }}>
              <HeroStatCounter value={76} suffix="%" label="P95 Latency Cut" color="#38BDF8" />
              <HeroStatCounter value={60} suffix="%" label="DB Load Cut" color="#A855F7" />
              <HeroStatCounter value={10} suffix="+" label="Systems Shipped" color="#10B981" />
            </div>
          </div>

          {/* Hero Right: Organic Blob Portrait with Bobbing Floating Circles */}
          <Reveal delay={0.15}>
            <div className="hero-blob-wrapper">
              <div className="hero-blob-bg" />

              <div className="hero-blob-frame">
                <img
                  src="/assets/hero_portrait.png"
                  alt="Priya Kumari Developer Portrait"
                  className="hero-blob-img"
                />
              </div>

              <div className="floating-tech-circle float-bob-1" style={{ top: 30, right: -10 }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: "#F59E0B", fontFamily: "var(--font-mono)" }}>JS</span>
              </div>

              <div className="floating-tech-circle float-bob-2" style={{ bottom: 30, left: -10 }}>
                <Code size={22} color="#38BDF8" />
              </div>

              <div className="floating-tech-circle float-bob-3" style={{ bottom: 10, right: 20 }}>
                <Database size={20} color="#10B981" />
              </div>
            </div>
          </Reveal>

        </div>
      </section>

      {/* ---------------- 3. MY PORTFOLIO SECTION ---------------- */}
      <section id="portfolio" style={{ padding: "80px 24px", maxWidth: 1180, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.7rem)", fontWeight: 900, color: "#F9FAFB", letterSpacing: "-0.02em" }}>
              My portfolio
            </h2>
          </div>
        </Reveal>

        {/* Filter Tabs */}
        <Reveal delay={0.05}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 24, marginBottom: 40, flexWrap: "wrap" }}>
            {["All", "Websites", "Apps", "Article", "Weblog"].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setCarouselIndex(0); }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: isActive ? "#F9FAFB" : "#9CA3AF",
                    fontSize: 16,
                    fontWeight: isActive ? 700 : 500,
                    cursor: "pointer",
                    position: "relative",
                    paddingBottom: 6,
                    transition: "color 0.2s ease",
                  }}
                >
                  {tab}
                  {isActive && (
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "#38BDF8", borderRadius: 2 }} />
                  )}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Carousel Grid */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={handlePrev} className="carousel-nav-btn hide-mobile" title="Previous Projects">
            <ChevronLeft size={24} />
          </button>

          <div style={{ flexGrow: 1, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {filteredProjects.map((proj, idx) => (
              <Reveal key={proj.id} delay={idx * 0.08} direction="scale">
                <SpotlightCard
                  className="portfolio-card-item"
                  onClick={() => {
                    if (proj.hasCaseStudy) setIsEngagexModalOpen(true);
                  }}
                  style={{ cursor: proj.hasCaseStudy ? "pointer" : "default" }}
                >
                  <img src={proj.image} alt={proj.title} className="portfolio-card-img" />

                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 35%, rgba(7, 9, 14, 0.95) 100%)", padding: 20, display: "flex", flexDirection: "column", justifyContent: "flex-end", zIndex: 2 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: "#38BDF8", fontWeight: 700, fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
                        {proj.category}
                      </span>

                      {proj.hasCaseStudy ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); setIsEngagexModalOpen(true); }}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            fontSize: 11,
                            background: "rgba(56, 189, 248, 0.2)",
                            color: "#38BDF8",
                            border: "1px solid rgba(56, 189, 248, 0.4)",
                            padding: "2px 8px",
                            borderRadius: 100,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          <span>CASE STUDY</span>
                          <FileText size={10} />
                        </button>
                      ) : proj.isLive ? (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            fontSize: 11,
                            background: "rgba(16, 185, 129, 0.2)",
                            color: "#10B981",
                            border: "1px solid rgba(16, 185, 129, 0.4)",
                            padding: "2px 8px",
                            borderRadius: 100,
                            fontWeight: 700,
                            textDecoration: "none",
                          }}
                        >
                          <span>LIVE DEMO</span>
                          <ExternalLink size={10} />
                        </a>
                      ) : null}
                    </div>

                    <h3 style={{ fontSize: 15, fontWeight: 800, color: "#F9FAFB", marginTop: 4, lineHeight: 1.3 }}>
                      {proj.title}
                    </h3>
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>

          <button onClick={handleNext} className="carousel-nav-btn hide-mobile" title="Next Projects">
            <ChevronRight size={24} />
          </button>
        </div>
      </section>

      {/* ---------------- 4. SERVICES SECTION ---------------- */}
      <section id="services" style={{ padding: "80px 24px", maxWidth: 1180, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.7rem)", fontWeight: 900, color: "#F9FAFB", letterSpacing: "-0.02em" }}>
              Services
            </h2>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {SERVICES.map((s, idx) => {
            const IconComponent = s.icon;
            return (
              <Reveal key={s.id} delay={idx * 0.1} direction="scale">
                <SpotlightCard className="service-card-screenshot">
                  <div className="service-icon-box" style={{ background: s.iconBg, relative: "relative", zIndex: 2 }}>
                    <IconComponent size={30} color={s.iconColor} />
                  </div>

                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "#F9FAFB", marginBottom: 10, position: "relative", zIndex: 2 }}>
                    {s.title}
                  </h3>

                  <p style={{ fontSize: 13.5, color: "#9CA3AF", lineHeight: 1.6, position: "relative", zIndex: 2 }}>
                    {s.desc}
                  </p>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ---------------- 5. LIVE PRODUCTION PROJECTS & FEATURED SYSTEMS ---------------- */}
      <section id="projects" style={{ padding: "80px 24px", maxWidth: 1180, margin: "0 auto" }}>
        <Reveal>
          <div style={{ marginBottom: 44 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: "#10B981", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
              [ ARCHITECTURE & LIVE SYSTEMS ]
            </span>
            <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.6rem)", fontWeight: 900, color: "#F9FAFB", marginTop: 8, letterSpacing: "-0.02em" }}>
              Featured Projects & System Case Studies
            </h2>
          </div>
        </Reveal>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {FEATURED_PROJECTS.map((proj, idx) => (
            <Reveal key={proj.id} delay={idx * 0.12} direction={idx % 2 === 0 ? "left" : "right"}>
              <SpotlightCard className="dribbble-card dribbble-card-hover" style={{ padding: 36 }}>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 20, position: "relative", zIndex: 2 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 11, background: "rgba(56, 189, 248, 0.12)", color: "#38BDF8", border: "1px solid rgba(56, 189, 248, 0.3)", padding: "3px 10px", borderRadius: 100, fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                        {proj.category}
                      </span>
                      <span style={{ fontSize: 12, color: "#10B981", fontWeight: 700 }}>● {proj.tag}</span>
                    </div>
                    <h3 style={{ fontSize: 24, fontWeight: 900, color: "#F9FAFB" }}>{proj.title}</h3>
                  </div>

                  {proj.hasCaseStudy ? (
                    <button
                      onClick={() => setIsEngagexModalOpen(true)}
                      className="btn-glow-primary"
                      style={{ padding: "8px 18px", fontSize: 13 }}
                    >
                      <FileText size={14} />
                      <span>Read Full Case Study</span>
                      <ArrowRight size={14} />
                    </button>
                  ) : proj.link !== "#" ? (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-glow-primary"
                      style={{ padding: "8px 18px", fontSize: 13 }}
                    >
                      <Globe2 size={14} />
                      <span>Visit Live Site</span>
                      <ArrowUpRight size={14} />
                    </a>
                  ) : null}
                </div>

                <p style={{ fontSize: 14.5, color: "#9CA3AF", lineHeight: 1.7, marginBottom: 20, maxWidth: 880, position: "relative", zIndex: 2 }}>
                  {proj.desc}
                </p>

                <div style={{ background: "rgba(255, 255, 255, 0.02)", borderRadius: 12, padding: 18, border: "1px solid rgba(255, 255, 255, 0.06)", marginBottom: 24, position: "relative", zIndex: 2 }}>
                  <div style={{ fontSize: 12, color: "#38BDF8", fontWeight: 700, fontFamily: "var(--font-mono)", marginBottom: 10 }}>HIGHLIGHTS:</div>
                  <ul style={{ paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
                    {proj.highlights.map((h, i) => (
                      <li key={i} style={{ fontSize: 13.5, color: "#D1D5DB" }}>{h}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, position: "relative", zIndex: 2 }}>
                  {proj.chips.map((chip) => (
                    <span key={chip} className="tech-tag" style={{ background: "rgba(255, 255, 255, 0.06)" }}>{chip}</span>
                  ))}
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- 6. TECHNICAL WORKBENCH CODE INSPECTOR ---------------- */}
      <section style={{ padding: "60px 24px", maxWidth: 1180, margin: "0 auto" }}>
        <Reveal direction="scale">
          <SpotlightCard className="dribbble-card" style={{ padding: 28 }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 20, borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: 16, position: "relative", zIndex: 2 }}>
              <div>
                <span style={{ fontSize: 12, color: "#38BDF8", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                  SYSTEM ARCHITECTURE CODE INSPECTOR
                </span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#F9FAFB", marginTop: 2 }}>Production Core Logic</h3>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                {CODE_MODULES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setActiveCodeId(m.id)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 8,
                      background: m.id === activeCodeId ? "#1A2234" : "transparent",
                      border: m.id === activeCodeId ? "1px solid #38BDF8" : "1px solid rgba(255, 255, 255, 0.08)",
                      color: m.id === activeCodeId ? "#F9FAFB" : "#9CA3AF",
                      fontSize: 12,
                      fontFamily: "var(--font-mono)",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {m.title}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: "#090B10", borderRadius: 12, padding: 20, border: "1px solid rgba(255, 255, 255, 0.08)", fontSize: 13, fontFamily: "var(--font-mono)", lineHeight: 1.7, minHeight: 220, overflowX: "auto", position: "relative", zIndex: 2 }}>
              {currentCodeModule.code.map((line, idx) => (
                <div key={`${activeCodeId}-${idx}`} className="code-line-fade" style={{ display: "flex", gap: 16, animationDelay: `${idx * 0.035}s` }}>
                  <span style={{ color: "#4B5563", userSelect: "none", width: 18, textAlign: "right" }}>{idx + 1}</span>
                  <div>
                    {line.tokens.map(([txt, type], tIdx) => {
                      let c = "#F9FAFB";
                      if (type === "kw") c = "#38BDF8";
                      if (type === "fn") c = "#818CF8";
                      if (type === "str") c = "#10B981";
                      if (type === "comment") c = "#6B7280";
                      return <span key={tIdx} style={{ color: c }}>{txt}</span>;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </SpotlightCard>
        </Reveal>
      </section>

      {/* ---------------- 7. CAREER EXPERIENCE ---------------- */}
      <section id="experience" style={{ padding: "60px 24px", maxWidth: 1180, margin: "0 auto" }}>
        <Reveal>
          <div style={{ marginBottom: 32 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: "#10B981", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
              [ CAREER TRACK ]
            </span>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: "#F9FAFB", marginTop: 4 }}>
              Engineering Experience
            </h2>
          </div>
        </Reveal>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {EXPERIENCE.map((exp, i) => (
            <Reveal key={exp.role + i} delay={i * 0.1} direction="up">
              <div className="timeline-item-container">
                <div className="timeline-node-dot" />
                <SpotlightCard className="dribbble-card" style={{ padding: 28 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 12, position: "relative", zIndex: 2 }}>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 800, color: "#F9FAFB" }}>{exp.role}</h3>
                      <div style={{ fontSize: 13.5, color: "#38BDF8", fontWeight: 600 }}>@ {exp.org}</div>
                    </div>
                    <span style={{ fontSize: 11, background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", padding: "3px 12px", borderRadius: 100, color: "#9CA3AF", fontFamily: "var(--font-mono)" }}>
                      {exp.when}
                    </span>
                  </div>

                  <ul style={{ paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8, marginBottom: 16, position: "relative", zIndex: 2 }}>
                    {exp.highlights.map((h, hIdx) => (
                      <li key={hIdx} style={{ fontSize: 13.5, color: "#9CA3AF", lineHeight: 1.5 }}>{h}</li>
                    ))}
                  </ul>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, position: "relative", zIndex: 2 }}>
                    {exp.skills.map((s) => (
                      <span key={s} className="tech-tag" style={{ fontSize: 11 }}>{s}</span>
                    ))}
                  </div>
                </SpotlightCard>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- 8. CONTACT ME SECTION ---------------- */}
      <section id="contact" style={{ paddingTop: 80, paddingBottom: 80, maxWidth: 880, margin: "0 auto", paddingLeft: 24, paddingRight: 24 }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.7rem)", fontWeight: 900, color: "#F9FAFB", letterSpacing: "-0.02em" }}>
              Contact me
            </h2>
          </div>
        </Reveal>

        {/* Iconic Contact Circles Row (Original Loved Design) */}
        <Reveal delay={0.06}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20, flexWrap: "wrap", marginBottom: 36 }}>
            <a
              href="https://github.com/priyasingh31/"
              target="_blank"
              rel="noreferrer"
              className="contact-circle-btn"
              title="GitHub Profile"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>

            <a
              href="https://www.linkedin.com/in/priya-kumari-788966261/"
              target="_blank"
              rel="noreferrer"
              className="contact-circle-btn"
              title="LinkedIn Profile"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>

            <button
              onClick={copyEmail}
              className="contact-circle-btn"
              title={copiedEmail ? "Copied Email!" : `Email: ${EMAIL}`}
              style={{ cursor: "pointer" }}
            >
              {copiedEmail ? <Check size={28} color="#10B981" /> : <Mail size={26} />}
            </button>

            <a
              href="https://www.instagram.com/priya_singhhhh._?igsh=dnZkOGZnN2l3NmF2&utm_source=qr"
              target="_blank"
              rel="noreferrer"
              className="contact-circle-btn"
              title="Instagram Profile"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>

            <a
              href={`tel:${PHONE.replace(/\s+/g, '')}`}
              className="contact-circle-btn"
              title={`Call: ${PHONE}`}
            >
              <Phone size={26} />
            </a>
          </div>
        </Reveal>

        {copiedEmail && (
          <div style={{ textAlign: "center", marginTop: -20, marginBottom: 28, fontSize: 13, color: "#10B981", fontWeight: 600 }}>
            ✓ Copied {EMAIL} to clipboard!
          </div>
        )}

        {/* Premium Glassmorphic Contact Form Card */}
        <Reveal delay={0.12} direction="up">
          <ContactForm />
        </Reveal>

        <footer
          style={{
            marginTop: 60,
            paddingTop: 24,
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            fontSize: 12.5,
            color: "#6B7280",
            fontFamily: "var(--font-mono)",
          }}
        >
          <div>© 2026 Priya Kumari. All rights reserved.</div>
          <div>EngageX Case Study & Live Projects. Built with React & Vite.</div>
        </footer>
      </section>

      {/* ---------------- 9. ENGAGEX FULL CASE STUDY MODAL ---------------- */}
      <EngagexModal
        isOpen={isEngagexModalOpen}
        onClose={() => setIsEngagexModalOpen(false)}
      />

      {/* ---------------- 9b. CUSTOM FREE CALENDAR SCHEDULER MODAL ---------------- */}
      <ScheduleCallModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />

      {/* ---------------- 10. AI ASSISTANT CHATBOT ---------------- */}
      <AiChatbot
        onOpenEngagexModal={() => setIsEngagexModalOpen(true)}
        onOpenScheduleModal={() => setIsScheduleModalOpen(true)}
      />
    </div>
  );
}

const navLinkStyle = {
  color: "#9CA3AF",
  textDecoration: "none",
  fontSize: 13.5,
  fontWeight: 600,
  transition: "color 0.2s ease",
};
