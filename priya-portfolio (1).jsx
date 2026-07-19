import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Mail, Phone, ExternalLink, ArrowDown, Check,
  Database, Network, Terminal, Cpu, Lock, Layers, Boxes
} from "lucide-react";

/* ---------------------------------------------------------- */
/* COLOR TOKENS — literal values only, no CSS variables        */
/* ---------------------------------------------------------- */

const C = {
  bg: "#1C2C46",         // deep navy — main page background
  bgDeep: "#16233A",     // slightly deeper navy for banding/depth
  text: "#F3FAEF",       // mint white
  muted: "#A9C0CC",      // light steel-grey (body text on dark)
  dim: "#728696",        // darker steel (least-emphasis text)
  accent: "#527A9A",     // steel blue
  accentLight: "#B2D9DB",// powder teal
  editorBg: "#16233A",
  editorPlain: "#F3FAEF",
  editorKw: "#B2D9DB",
  editorFn: "#9FCFE0",
  editorStr: "#7C93A9",
  border: "rgba(255,255,255,0.12)",
  borderStrong: "rgba(255,255,255,0.26)",
  surface: "rgba(255,255,255,0.045)",
  ctaBg: "#F3FAEF",      // light CTA background
  ctaText: "#1C2C46",    // dark text on light CTA
};

const GRAIN_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/* ---------------------------------------------------------- */
/* DATA                                                         */
/* ---------------------------------------------------------- */

const STATS = [
  { value: 76, suffix: "%", label: "P95 API latency reduced (500ms → 120ms)" },
  { value: 60, suffix: "%", label: "Database load cut via Redis caching" },
  { value: 40, suffix: "%", label: "ETL batch processing time reduced" },
  { value: 10, suffix: "+", label: "End-to-end product features shipped" },
];

const CODE_LINES = [
  { text: "async function confirmSeat(programId, applicantId) {", tokens: [["async ", "kw"], ["function ", "kw"], ["confirmSeat", "fn"], ["(programId, applicantId) {", "pl"]] },
  { text: "  return db.transaction(async (trx) => {", tokens: [["  return ", "kw"], ["db.", "pl"], ["transaction", "fn"], ["(async (trx) => {", "pl"]] },
  { text: "    const seat = await trx('program_seats')", tokens: [["    const ", "kw"], ["seat = ", "pl"], ["await ", "kw"], ["trx(", "pl"], ["'program_seats'", "str"], [")", "pl"]] },
  { text: "      .where({ program_id: programId })", tokens: [["      .", "pl"], ["where", "fn"], ["({ program_id: programId })", "pl"]] },
  { text: "      .forUpdate()", tokens: [["      .", "pl"], ["forUpdate", "fn"], ["()", "pl"]] },
  { text: "      .first();", tokens: [["      .", "pl"], ["first", "fn"], ["();", "pl"]] },
  { text: "    if (seat.allocated >= seat.quota) {", tokens: [["    if ", "kw"], ["(seat.allocated >= seat.quota) {", "pl"]] },
  { text: "      throw new SeatUnavailableError();", tokens: [["      throw new ", "kw"], ["SeatUnavailableError", "fn"], ["();", "pl"]] },
  { text: "    }", tokens: [["    }", "pl"]] },
  { text: "    await trx('program_seats').increment('allocated', 1);", tokens: [["    await ", "kw"], ["trx(", "pl"], ["'program_seats'", "str"], [").", "pl"], ["increment", "fn"], ["(", "pl"], ["'allocated'", "str"], [", 1);", "pl"]] },
  { text: "    return generateAdmissionNumber(trx, applicantId);", tokens: [["    return ", "kw"], ["generateAdmissionNumber", "fn"], ["(trx, applicantId);", "pl"]] },
  { text: "  });", tokens: [["  });", "pl"]] },
  { text: "}", tokens: [["}", "pl"]] },
];

const CRM_TABS = [
  { key: "problem", label: "Problem", body: "Quota-based seat allocation across programs, with concurrent requests from multiple admission officers, needed to prevent over-allocation while keeping admission numbers immutable and auditable." },
  { key: "approach", label: "Approach", list: [
    "Controller/service/repository architecture for clean separation of concerns",
    "SELECT FOR UPDATE row locking during seat confirmation",
    "Migration-driven schema design for safe, versioned changes",
    "JWT auth, bcrypt hashing, and Joi request validation throughout",
  ]},
  { key: "result", label: "Result", body: "Zero seat over-allocation under concurrent load, with immutable admission number generation that gives colleges a clean audit trail from application to confirmation." },
];

const ENGAGEX_TABS = [
  { key: "overview", label: "Overview", body: "EngageX sits between two sides of a marketplace: advertisers who create CPI/CPA/CPR/CPC campaigns with a budget and payout, and publishers who grab a tracking link and drive traffic to it. Every click and conversion is tracked server-to-server — no cookies — and publishers get paid automatically once a conversion is confirmed.",
    chips: ["engagex-user-api", "engagex-campaigns-api", "engagex-frontend-user", "engagex-web-offerwall-sdk", "engagex-background-workers", "offer-syncer-beta", "CampaignSyncer (.NET)"] },
  { key: "discovery", label: "App Discovery", body: "When an advertiser adds an app to run campaigns for, EngageX fetches its details automatically — but the fetch strategy is different per platform, because each store exposes data differently.", list: [
    "Android — the backend proxies the search through google-play-scraper, since the Play Store has no public search API. Results are cached in Redis for 2 hours per keyword/country/limit combination.",
    "iOS — no backend hop at all: the frontend calls Apple's public iTunes Search API directly from the browser, since Apple exposes this endpoint publicly.",
    "Website (web apps) — the backend fetches the target page with axios, parses it with Cheerio for the <title> and favicon, with SSRF protection and an HTTPS→HTTP fallback.",
  ], footer: "One searchApp(store, params) function branches per platform tab in the \"Add App\" modal — debounced search-as-you-type, results as clickable cards, one click autofills the form." },
  { key: "api", label: "API & Backend", list: [
    "engagex-user-api (Express) — domain-organized router/controller/service/repository layers for auth, apps, campaigns, wallets, billing, payouts, and offerwalls. JWT bearer auth, Joi validation on every mutating route, uploads streamed to object storage.",
    "engagex-campaigns-api (FastAPI, fully async) — the read-only service the offerwall SDK calls: paginated /campaigns and /campaigns/{id}, async SQLAlchemy 2 + asyncpg, selectinload to avoid N+1 queries.",
    "@engagex/core — a private shared npm package (published to GitHub Packages) holding business logic reused across Node services instead of duplicated.",
  ]},
  { key: "db", label: "Database", body: "PostgreSQL, schema-qualified under public.*. The campaigns table models the ad-network domain directly.", list: [
    "campaign_type (CPI/CPA/CPR/CPC/APK_INSTALL/APK_ACTION), kpi, and tracking_url per campaign",
    "targeting stored as JSONB for flexible, evolving geo/device rules",
    "daily capping columns — capping_daily_conversion, capping_daily_budget, capping_daily_clicks",
    "affise_offer_id linking a campaign to the external Affise network",
    "a status workflow and soft deletes via is_deleted instead of hard deletes",
  ], footer: "The Node service and the FastAPI service each define their own ORM models over the same schema — a deliberate polyglot-persistence choice." },
  { key: "frontend", label: "Frontend", body: "React + Vite, structured as feature slices mirroring both sides of the marketplace: features/Acquisition/* (advertiser side) and features/monetization/* (publisher side).",
    chips: ["Redux Toolkit", "React Hook Form", "Framer Motion", "Recharts", "Google OAuth"],
    footer: "The multi-platform app search UI lives here — platform tabs with a country selector for store localization, backed by Redux slices and thunks per feature." },
  { key: "jobs", label: "Background Jobs", list: [
    "engagex-background-workers — Celery + Redis, interval-based Affise stats sync and a nightly campaign-stats rollup via Celery Beat, plus an SQS consumer for event-driven work.",
    "offer-syncer-beta — a single-process async engine (aiohttp + APScheduler) polling multiple advertiser APIs on independent schedules, normalizing schemas into one CommonOffer model, diffing against SQLite-persisted state, and pushing changes to Affise.",
    "CampaignSyncer — an earlier .NET service handling Affise campaign sync, still running alongside the newer Python engine.",
  ]},
];

const EXPERIENCE = [
  { when: "Jun 2025 — Present", role: "Associate Software Engineer", org: "Mobtions", items: [
    "Reduced PostgreSQL/MySQL P95 API latency from ~500ms to ~120ms via composite indexing, join refactoring, and query plan analysis",
    "Built and shipped 10+ end-to-end features across React, Node/Express, and FastAPI, cutting page load time 30% for 20+ operations users",
    "Automated ETL pipelines with Apache Airflow, reducing batch processing time 40% and eliminating ~6 hrs/week of manual work",
    "Designed secure backend services: JWT auth, bcrypt, RBAC, request validation, rate limiting, structured error handling",
  ]},
  { when: "Dec 2024 — May 2025", role: "Game Developer Intern", org: "Mobtions", items: [
    "Profiled CPU/memory performance of game services, resolving 3 bottlenecks and cutting runtime overhead by 25%",
    "Refactored backend communication with Promise-based async handling, reducing latency ~30% under 500+ concurrent connections",
  ]},
  { when: "Internal Initiative", role: "AI Blog Automation", org: "Mobtions", items: [
    "Built a modular Node.js + Python backend integrating 3 third-party APIs for 15+ weekly posts, cutting ~4 hrs of manual effort per article",
  ]},
];

const SKILLS = [
  { title: "Core", wide: true, items: ["JavaScript (ES6+)", "Python", "SQL", "React.js", "Node.js", "Express.js", "FastAPI", "JWT", "RBAC", "Rate Limiting"] },
  { title: "Databases", items: ["PostgreSQL", "MySQL", "Schema Design", "Query Optimization"] },
  { title: "Caching & Data", items: ["Redis", "Apache Airflow"] },
  { title: "DevOps & Cloud", items: ["Docker", "GitHub Actions", "Azure DevOps", "DigitalOcean", "Nginx"] },
  { title: "AI / ML", wide: true, items: ["LangChain", "LLMs", "TensorFlow", "PyTorch", "NLP"] },
];

/* ---------------------------------------------------------- */
/* SMALL HOOKS                                                  */
/* ---------------------------------------------------------- */

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setVisible(true); io.unobserve(el); } }),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity .7s cubic-bezier(.2,.7,.3,1) ${delay}s, transform .7s cubic-bezier(.2,.7,.3,1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function useCounter(target, active) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf, start;
    const duration = 1100;
    function step(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);
  return val;
}

function useBlink(interval = 500) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setOn((o) => !o), interval);
    return () => clearInterval(t);
  }, [interval]);
  return on;
}

/* ---------------------------------------------------------- */
/* PRIMITIVES (all styling inline — no external stylesheet)     */
/* ---------------------------------------------------------- */

function Card({ children, dark = false, style = {}, padding = 0 }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: dark ? C.editorBg : "#FFFFFF",
        border: `1px solid ${hover ? C.borderStrong : C.border}`,
        borderRadius: 16,
        padding,
        position: "relative",
        overflow: "hidden",
        transition: "transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s ease, border-color .35s ease",
        transform: hover ? "translateY(-5px)" : "translateY(0)",
        boxShadow: hover ? "0 24px 50px -20px rgba(82,122,154,0.28)" : "0 2px 10px -4px rgba(35,53,85,0.06)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Chip({ children }) {
  return (
    <span style={{ fontSize: 12, color: C.muted, background: C.surface, border: `1px solid ${C.border}`, padding: "5px 12px", borderRadius: 100, display: "inline-block" }}>
      {children}
    </span>
  );
}

function Tag({ children, tone = "accent" }) {
  return (
    <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: tone === "accent" ? "#0D1420" : "#0D1420", background: tone === "accent" ? C.accent : C.accentLight, padding: "5px 12px", borderRadius: 100, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

function Btn({ children, href, tone = "solid", onClick, style = {} }) {
  const [hover, setHover] = useState(false);
  const base = {
    display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14.5, fontWeight: 700,
    padding: "14px 24px", borderRadius: 100, textDecoration: "none", cursor: "pointer",
    transition: "transform .2s ease, box-shadow .2s ease",
    transform: hover ? "translateY(-2px)" : "translateY(0)",
  };
  const toneStyle =
    tone === "solid" || tone === "light"
      ? { background: C.ctaBg, color: C.ctaText, boxShadow: hover ? "0 14px 30px -10px rgba(0,0,0,0.35)" : "none" }
      : tone === "ghost-light"
      ? { background: hover ? "rgba(255,255,255,0.12)" : "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.45)" }
      : { background: "transparent", color: C.text, border: `1px solid ${C.borderStrong}` };
  const El = href ? "a" : "button";
  return (
    <El
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, ...toneStyle, ...style, border: toneStyle.border || "none" }}
    >
      {children}
    </El>
  );
}

function Grain() {
  return (
    <div
      style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.06, mixBlendMode: "overlay",
        backgroundImage: GRAIN_URL,
      }}
    />
  );
}

function SectionLabel({ children, icon }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "monospace", fontSize: 12.5, color: C.accent, marginBottom: 16 }}>
      <span style={{ width: 9, height: 9, background: C.accent, display: "inline-block", flexShrink: 0 }} />
      {icon}// {children}
    </div>
  );
}

/* ---------------------------------------------------------- */
/* SUBCOMPONENTS                                                */
/* ---------------------------------------------------------- */

function TabbedPanel({ tabs }) {
  const [active, setActive] = useState(tabs[0].key);
  const current = tabs.find((t) => t.key === active);
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "18px 24px 0" }}>
        {tabs.map((t) => {
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              style={{
                fontFamily: "monospace", fontSize: 12, borderRadius: 100, padding: "9px 16px", cursor: "pointer",
                background: isActive ? C.accent : "transparent",
                color: isActive ? "#0D1420" : C.dim,
                border: isActive ? "1px solid transparent" : `1px solid ${C.border}`,
                fontWeight: isActive ? 700 : 400,
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div style={{ padding: 28 }}>
        {current.body && <p style={{ fontSize: 14.5, color: C.muted, maxWidth: 640, marginBottom: 14 }}>{current.body}</p>}
        {current.list && (
          <ul style={{ fontSize: 14.5, color: C.muted, paddingLeft: 20, maxWidth: 700, margin: 0 }}>
            {current.list.map((li, idx) => (
              <li key={idx} style={{ marginBottom: 10 }}>
                <span style={{ color: C.accent }}>▸ </span>{li}
              </li>
            ))}
          </ul>
        )}
        {current.chips && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
            {current.chips.map((c) => <Chip key={c}>{c}</Chip>)}
          </div>
        )}
        {current.footer && <p style={{ fontSize: 14, color: C.muted, marginTop: 16 }}>{current.footer}</p>}
      </div>
    </div>
  );
}

function TiltCard({ children }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({});
  const onMove = useCallback((e) => {
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ transform: `perspective(900px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) translateY(-4px)` });
  }, []);
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={() => setTilt({})} style={{ transition: "transform .2s ease" }}>
      <Card style={tilt}>{children}</Card>
    </div>
  );
}

function CodeEditor() {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [done, setDone] = useState(false);
  const blink = useBlink(500);

  useEffect(() => {
    if (lineIdx >= CODE_LINES.length) { setDone(true); return; }
    const line = CODE_LINES[lineIdx].text;
    if (charIdx < line.length) {
      const t = setTimeout(() => setCharIdx((c) => c + 1), 16);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => { setLineIdx((l) => l + 1); setCharIdx(0); }, 90);
      return () => clearTimeout(t);
    }
  }, [lineIdx, charIdx]);

  const tokColor = { kw: C.editorKw, fn: C.editorFn, str: C.editorStr, pl: C.editorPlain };

  return (
    <div style={{ display: "flex", fontFamily: "monospace", fontSize: 13, lineHeight: 1.85, height: 300, overflow: "hidden" }}>
      <div style={{ padding: "18px 14px 18px 18px", textAlign: "right", borderRight: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
        {CODE_LINES.slice(0, Math.min(lineIdx + 1, CODE_LINES.length)).map((_, i) => (
          <div key={i} style={{ color: "rgba(255,255,255,0.35)" }}>{i + 1}</div>
        ))}
      </div>
      <div style={{ padding: "18px 20px", flex: 1, color: C.editorPlain }}>
        {CODE_LINES.slice(0, lineIdx).map((l, i) => (
          <div key={i} style={{ whiteSpace: "pre" }}>
            {l.tokens.map(([t, cls], j) => <span key={j} style={{ color: tokColor[cls] }}>{t}</span>)}
          </div>
        ))}
        {!done && lineIdx < CODE_LINES.length && (
          <div style={{ whiteSpace: "pre" }}>
            {CODE_LINES[lineIdx].text.slice(0, charIdx)}
            <span style={{ display: "inline-block", width: 7, height: 14, background: C.editorKw, marginLeft: 2, opacity: blink ? 1 : 0, verticalAlign: "middle" }} />
          </div>
        )}
      </div>
    </div>
  );
}

function StatCell({ stat, i }) {
  const [ref, visible] = useReveal();
  const val = useCounter(stat.value, visible);
  return (
    <div ref={ref} style={{ background: "#243954", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
      <div style={{ fontSize: "2.1rem", fontWeight: 800, color: i % 2 ? "#9FCFE0" : C.accentLight, lineHeight: 1 }}>
        {val}{stat.suffix}
      </div>
      <div style={{ fontSize: 14, marginTop: 8, color: "rgba(255,255,255,0.62)" }}>{stat.label}</div>
    </div>
  );
}

/* ---------------------------------------------------------- */
/* MAIN                                                         */
/* ---------------------------------------------------------- */

export default function Portfolio() {
  const [copied, setCopied] = useState(false);
  const email = "priyasingh311256@gmail.com";

  const copyEmail = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      });
    }
  };

  const sectionWrap = { maxWidth: 1152, margin: "0 auto", padding: "0 32px" };

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", fontFamily: "sans-serif" }}>
      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(243,250,239,0.85)", borderBottom: `1px solid ${C.border}`, backdropFilter: "blur(10px)" }}>
        <div style={{ ...sectionWrap, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px" }}>
          <div style={{ fontFamily: "monospace", fontSize: 14, color: C.accent }}>priya<span style={{ color: C.dim }}>.</span>kumari<span style={{ color: C.dim }}>()</span></div>
          <div style={{ display: "flex", gap: 4, fontSize: 14 }}>
            {["Work", "EngageX", "Experience", "Skills", "Contact"].map((n) => (
              <NavLink key={n} label={n} />
            ))}
          </div>
          <a href={`mailto:${email}`} style={{ textDecoration: "none" }}><Tag>Hire me →</Tag></a>
        </div>
      </nav>

      {/* HERO */}
      <header style={{ position: "relative", overflow: "hidden", borderBottom: `1px solid ${C.border}`, padding: "90px 0" }}>
        <Grain />
        <div style={{ position: "absolute", width: 420, height: 420, right: -100, bottom: -110, opacity: 0.14, pointerEvents: "none" }}>
          <svg viewBox="0 0 400 400" fill="none">
            <g stroke={C.accent} strokeWidth="1.4" opacity="0.9">
              <ellipse cx="140" cy="90" rx="70" ry="22" />
              <path d="M70 90 v60 a70 22 0 0 0 140 0 v-60" />
              <path d="M70 150 v60 a70 22 0 0 0 140 0 v-60" />
              <ellipse cx="140" cy="270" rx="70" ry="22" />
            </g>
            <g stroke={C.accentLight} strokeWidth="1.2" opacity="0.8">
              <path d="M210 160 h100 v-40 h40" />
              <path d="M210 220 h60 v50 h70" />
              <circle cx="350" cy="120" r="4" />
              <circle cx="330" cy="270" r="4" />
            </g>
          </svg>
        </div>
        <div style={{ ...sectionWrap, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center", position: "relative", zIndex: 1 }}>
          <div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "monospace", fontSize: 12.5, borderRadius: 100, padding: "7px 14px", marginBottom: 24, color: C.accent, background: "rgba(82,122,154,0.12)", border: "1px solid rgba(82,122,154,0.35)" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent }} />
              Available for freelance work
            </span>
            <h1 style={{ fontSize: "clamp(2.3rem,4vw,3.6rem)", fontWeight: 800, lineHeight: 1.06, marginBottom: 22, letterSpacing: "-0.02em" }}>
              I build full-stack systems that <span style={{ color: C.accentLight }}>hold up under real load</span>, not just demos.
            </h1>
            <p style={{ color: C.muted, fontSize: 17.5, maxWidth: 520, marginBottom: 34 }}>
              Backend-first full-stack engineer specializing in admin dashboards, CRMs, and internal tools — built with production rigor: query optimization, caching, and concurrency-safe data integrity.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 40 }}>
              <Btn href="#work" tone="solid">View case study <ArrowDown size={15} /></Btn>
              <Btn href="#contact" tone="outline">Get in touch</Btn>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20, fontFamily: "monospace", fontSize: 12.5, color: C.dim }}>
              <button onClick={copyEmail} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, padding: 0, font: "inherit" }}>
                <Mail size={13} /> {email} {copied && <span style={{ color: C.accent }}>· copied <Check size={12} style={{ display: "inline" }} /></span>}
              </button>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><ExternalLink size={13} /> GitHub</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><ExternalLink size={13} /> LinkedIn</span>
            </div>
          </div>
          <Card style={{ overflow: "hidden" }} dark={false}>
            <div style={{ background: C.editorBg }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FEBC2E" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840" }} />
                <span style={{ fontFamily: "monospace", fontSize: 12, marginLeft: 8, color: "rgba(255,255,255,0.55)" }}>seatAllocation.js</span>
                <span style={{ marginLeft: "auto" }}><Tag>JS</Tag></span>
              </div>
              <CodeEditor />
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 16px", fontFamily: "monospace", fontSize: 10.5, color: "rgba(255,255,255,0.5)", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
                <span><span style={{ color: C.editorKw }}>concurrency-safe</span> seat allocation</span>
                <span>production snippet</span>
              </div>
            </div>
          </Card>
        </div>
      </header>

      {/* STATS — soft tinted block, dark cards */}
      <section style={{ position: "relative", background: C.bgDeep, padding: "70px 0" }}>
        <Grain />
        <div style={{ ...sectionWrap, position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {STATS.map((s, i) => <StatCell key={i} stat={s} i={i} />)}
          </div>
        </div>
      </section>

      {/* BOLD STATEMENT — navy full-bleed block */}
      <section style={{ position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${C.accent} 0%, #16233A 100%)`, padding: "90px 0" }}>
        <Grain />
        <div style={{ position: "absolute", width: 320, height: 320, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.16)", top: -130, right: "8%" }} />
        <Reveal>
          <div style={{ ...sectionWrap, position: "relative", zIndex: 1 }}>
            <span style={{ fontFamily: "monospace", fontSize: 12.5, fontWeight: 700, color: "#F3FAEF", background: "rgba(255,255,255,0.14)", padding: "6px 14px", borderRadius: 100 }}>// why it matters</span>
            <p style={{ fontWeight: 800, color: "#F3FAEF", fontSize: "clamp(1.8rem,4.2vw,3rem)", lineHeight: 1.18, maxWidth: 880, marginTop: 26 }}>
              Most portfolios show pretty screens.<br />
              Mine shows what happens <span style={{ opacity: 0.6 }}>when 500 concurrent requests hit the same row at once</span> — and nothing breaks.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ABOUT */}
      <section style={{ borderBottom: `1px solid ${C.border}`, padding: "96px 0" }}>
        <div style={{ ...sectionWrap, display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 40 }}>
          <Reveal>
            <SectionLabel icon={<Cpu size={13} />}>about</SectionLabel>
            <h2 style={{ fontSize: "clamp(1.7rem,2.8vw,2.3rem)", fontWeight: 800, marginBottom: 20 }}>
              Full-stack, but backend is where I earn my keep.
            </h2>
            <p style={{ color: C.muted, marginBottom: 18 }}>I'm <strong style={{ color: C.text }}>Priya Kumari</strong>, an Associate Software Engineer with 1+ year of production experience building app monetization platforms and internal dashboards — and, outside of work, full-stack systems for real operational problems like college admissions management.</p>
            <p style={{ color: C.muted, marginBottom: 18 }}>Most of my work sits at the intersection of <strong style={{ color: C.text }}>correctness under concurrency</strong> and <strong style={{ color: C.text }}>speed under load</strong>: composite indexing and query plan analysis, Redis caching, and row-level locking so two people never grab the same seat, slot, or record at once.</p>
            <p style={{ color: C.muted }}>On the frontend, I ship with React and TypeScript — clean enough that non-technical stakeholders can use what I build without a manual.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <Card dark padding={24} style={{ fontFamily: "monospace", fontSize: 14, lineHeight: 2, color: C.editorPlain }}>
              <div><span style={{ color: C.editorKw }}>$</span> whoami</div>
              <div style={{ color: "rgba(255,255,255,0.6)" }}>priya_kumari — backend-first full-stack engineer</div>
              <div><span style={{ color: C.editorKw }}>$</span> cat focus.txt</div>
              <div style={{ color: "rgba(255,255,255,0.6)" }}>query optimization · caching · concurrency-safe systems</div>
              <div><span style={{ color: C.editorKw }}>$</span> status --freelance</div>
              <div style={{ color: "rgba(255,255,255,0.6)" }}>✓ available for new projects</div>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* CRM CASE STUDY */}
      <section id="work" style={{ borderBottom: `1px solid ${C.border}`, padding: "96px 0" }}>
        <div style={sectionWrap}>
          <Reveal><SectionLabel icon={<Lock size={13} />}>flagship project</SectionLabel></Reveal>
          <Reveal><h2 style={{ fontSize: "clamp(1.7rem,2.8vw,2.3rem)", fontWeight: 800, marginBottom: 16 }}>Admission Management &amp; CRM System</h2></Reveal>
          <Reveal><p style={{ color: C.muted, maxWidth: 640, marginBottom: 44 }}>A full-stack admission workflow platform for colleges — managing program setup, applicants, document verification, fee tracking, seat allocation, and confirmation across admin, officer, and management roles.</p></Reveal>
          <Reveal delay={0.1}>
            <Card>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 16, padding: 32, borderBottom: `1px solid ${C.border}` }}>
                <div>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 8 }}>The hard part wasn't the CRUD. It was the seat.</h3>
                  <p style={{ color: C.muted, fontSize: 14.5, maxWidth: 520 }}>Multiple officers can try to confirm the same admission seat at the same moment — the system had to guarantee no seat is ever allocated twice.</p>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["React + TS", "Node/Express", "PostgreSQL", "JWT"].map((t) => <Tag key={t} tone="accent2">{t}</Tag>)}
                </div>
              </div>
              <TabbedPanel tabs={CRM_TABS} />
            </Card>
          </Reveal>
        </div>
      </section>

      {/* ENGAGEX */}
      <section id="engagex" style={{ position: "relative", overflow: "hidden", borderBottom: `1px solid ${C.border}`, padding: "96px 0" }}>
        <div style={{ position: "absolute", width: 380, height: 300, top: 20, right: -70, opacity: 0.13, pointerEvents: "none" }}>
          <svg viewBox="0 0 400 320" fill="none">
            <g stroke={C.accentLight} strokeWidth="1.3" opacity="0.85">
              <path d="M60 60 L180 100 L60 160 L180 220 L60 260" />
              <path d="M180 100 L320 60 M180 100 L320 140 M180 220 L320 180 M180 220 L320 260" />
            </g>
            <g fill={C.accent}><circle cx="60" cy="60" r="6" /><circle cx="60" cy="160" r="6" /><circle cx="60" cy="260" r="6" /></g>
            <g fill={C.accentLight}><circle cx="180" cy="100" r="7" /><circle cx="180" cy="220" r="7" /></g>
          </svg>
        </div>
        <div style={{ ...sectionWrap, position: "relative", zIndex: 1 }}>
          <Reveal><SectionLabel icon={<Network size={13} />}>major product</SectionLabel></Reveal>
          <Reveal><h2 style={{ fontSize: "clamp(1.7rem,2.8vw,2.3rem)", fontWeight: 800, marginBottom: 16 }}>EngageX — Performance Marketing Platform</h2></Reveal>
          <Reveal><p style={{ color: C.muted, maxWidth: 700, marginBottom: 44 }}>A performance-based mobile ad network built at Mobtions — connects advertisers and publishers through trackable campaign links, tracked end-to-end via server-to-server postbacks. Private, internal platform — this is a technical walkthrough rather than a live link.</p></Reveal>
          <Reveal delay={0.1}>
            <Card>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 16, padding: 32, borderBottom: `1px solid ${C.border}` }}>
                <div>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 8 }}>One marketplace, six services.</h3>
                  <p style={{ color: C.muted, fontSize: 14.5, maxWidth: 520 }}>A polyglot microservice system — two Node services, a FastAPI service, a Celery worker fleet, a standalone async Python sync engine, and a legacy .NET integration, all speaking to one PostgreSQL database.</p>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["Node/Express", "FastAPI", "React+Redux", "Celery"].map((t) => <Tag key={t}>{t}</Tag>)}
                </div>
              </div>
              <TabbedPanel tabs={ENGAGEX_TABS} />
            </Card>
          </Reveal>
        </div>
      </section>

      {/* PROJECTS */}
      <section style={{ borderBottom: `1px solid ${C.border}`, padding: "96px 0" }}>
        <div style={sectionWrap}>
          <Reveal><SectionLabel icon={<Boxes size={13} />}>more work</SectionLabel></Reveal>
          <Reveal><h2 style={{ fontSize: "clamp(1.7rem,2.8vw,2.3rem)", fontWeight: 800, marginBottom: 44 }}>Other things I've built</h2></Reveal>
          <Reveal delay={0.1}>
            <TiltCard>
              <div style={{ height: 6, background: `linear-gradient(90deg, ${C.accent}, ${C.accentLight})` }} />
              <div style={{ padding: 28 }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: 6 }}>LLM-Powered Document Interaction Platform</h3>
                <div style={{ fontFamily: "monospace", fontSize: 12, marginBottom: 12, color: C.dim }}>FastAPI · LangChain · Vector Store · RAG</div>
                <p style={{ color: C.muted, fontSize: 14, marginBottom: 14 }}>A production-grade RAG pipeline for document ingestion, chunking, embedding, retrieval, and LLM-based response generation.</p>
                <ul style={{ color: C.muted, fontSize: 13.5, paddingLeft: 18, margin: 0 }}>
                  <li style={{ marginBottom: 8 }}>85%+ answer relevance on test queries</li>
                  <li style={{ marginBottom: 8 }}>Optimized chunking strategy cut irrelevant retrieval matches by ~40%</li>
                  <li>Source-attributed multi-document querying via async FastAPI endpoints</li>
                </ul>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" style={{ borderBottom: `1px solid ${C.border}`, padding: "96px 0" }}>
        <div style={sectionWrap}>
          <Reveal><SectionLabel icon={<Terminal size={13} />}>experience</SectionLabel></Reveal>
          <Reveal><h2 style={{ fontSize: "clamp(1.7rem,2.8vw,2.3rem)", fontWeight: 800, marginBottom: 44 }}>Where this was built</h2></Reveal>
          <div style={{ position: "relative", paddingLeft: 28 }}>
            <div style={{ position: "absolute", left: 5, top: 8, bottom: 8, width: 1, background: `linear-gradient(180deg, ${C.accent}, ${C.accentLight}, transparent)` }} />
            {EXPERIENCE.map((e, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div style={{ position: "relative", paddingBottom: 40 }}>
                  <div style={{ position: "absolute", left: -28, top: 4, width: 11, height: 11, borderRadius: "50%", background: C.bg, border: `2px solid ${C.accent}` }} />
                  <Card padding={24}>
                    <div style={{ fontFamily: "monospace", fontSize: 12, marginBottom: 8, color: C.dim }}>{e.when}</div>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 800, marginBottom: 4 }}>{e.role}</h3>
                    <div style={{ fontFamily: "monospace", fontSize: 12, marginBottom: 12, color: C.accentLight }}>{e.org}</div>
                    <ul style={{ color: C.muted, fontSize: 14, paddingLeft: 18, margin: 0 }}>
                      {e.items.map((it, j) => <li key={j} style={{ marginBottom: 8 }}>{it}</li>)}
                    </ul>
                  </Card>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" style={{ borderBottom: `1px solid ${C.border}`, padding: "96px 0" }}>
        <div style={sectionWrap}>
          <Reveal><SectionLabel icon={<Layers size={13} />}>stack</SectionLabel></Reveal>
          <Reveal><h2 style={{ fontSize: "clamp(1.7rem,2.8vw,2.3rem)", fontWeight: 800, marginBottom: 44 }}>Toolkit</h2></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {SKILLS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06} style={{ gridColumn: s.wide ? "span 2" : "span 1" }}>
                <Card padding={22} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <h4 style={{ fontFamily: "monospace", fontSize: 11.5, marginBottom: 16, color: C.dim, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.title}</h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: "auto" }}>
                    {s.items.map((it) => <Chip key={it}>{it}</Chip>)}
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT — steel-blue to navy gradient block */}
      <section id="contact" style={{ position: "relative", overflow: "hidden", background: `linear-gradient(160deg, ${C.accent} 0%, ${C.bgDeep} 100%)`, padding: "110px 0", textAlign: "center" }}>
        <Grain />
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.18)", top: -110, left: "6%" }} />
        <Reveal>
          <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 32px", position: "relative", zIndex: 1 }}>
            <span style={{ fontFamily: "monospace", fontSize: 12.5, color: "#fff" }}>// get in touch</span>
            <h2 style={{ color: "#fff", fontWeight: 800, fontSize: "clamp(1.9rem,3.6vw,2.7rem)", margin: "18px 0" }}>Have a full-stack project that needs to actually work at scale?</h2>
            <p style={{ color: "rgba(255,255,255,0.85)", marginBottom: 34 }}>I'm currently open to freelance and contract work — dashboards, CRMs, admin tools, and backend-heavy web apps.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
              <Btn href={`mailto:${email}`} tone="light"><Mail size={15} /> {email}</Btn>
              <Btn href="tel:+919798245322" tone="ghost-light"><Phone size={15} /> +91 97982 45322</Btn>
            </div>
          </div>
        </Reveal>
      </section>

      <footer style={{ ...sectionWrap, display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, fontFamily: "monospace", fontSize: 12, color: C.dim, padding: "28px 32px" }}>
        <span>© 2026 Priya Kumari</span>
        <span>Built with React · Node.js · PostgreSQL — and this page, with intent.</span>
      </footer>
    </div>
  );
}

function NavLink({ label }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={`#${label.toLowerCase()}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ padding: "8px 14px", borderRadius: 100, textDecoration: "none", color: hover ? C.text : C.muted, background: hover ? "rgba(35,53,85,0.06)" : "transparent", transition: "all .2s ease" }}
    >
      {label}
    </a>
  );
}
