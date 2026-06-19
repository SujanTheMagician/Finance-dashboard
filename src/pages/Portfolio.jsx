import { useEffect, useRef, useState } from "react";

// ─── Data ─────────────────────────────────────────────────────────
const SKILLS = [
  { name: "JavaScript (ES6+)", level: 88, color: "#F7DF1E", icon: "⚡" },
  { name: "React.js",          level: 85, color: "#61DAFB", icon: "⚛️" },
  { name: "HTML5 & CSS3",      level: 90, color: "#E44D26", icon: "🎨" },
  { name: "Java",              level: 72, color: "#ED8B00", icon: "☕" },
  { name: "Git & GitHub",      level: 80, color: "#F05032", icon: "🌿" },
  { name: "Figma / UI Design", level: 70, color: "#A259FF", icon: "✏️" },
];

const TOOLS = ["Vite", "React Router", "Recharts", "VS Code", "npm", "Browser DevTools"];

const PROJECTS = [
  {
    title: "FinanceOS",
    subtitle: "Personal Finance Dashboard",
    desc: "Full-stack personal finance app with animated dark UI, splash screen, 4-step onboarding, live KPI cards, area & donut charts, budget tracker, goals, and smart insights.",
    tags: ["React 19", "Recharts", "Vite", "CSS Animations"],
    link: "https://github.com/SujanTheMagician/Finance-dashboard",
    icon: "💰", color: "#3b82f6", highlight: true,
  },
  {
    title: "Expense Tracker",
    subtitle: "Income & Expense Manager",
    desc: "A clean expense tracking app to log daily income and expenses, categorise spending, and visualise financial health with charts and summaries.",
    tags: ["JavaScript", "HTML5", "CSS3"],
    link: "https://github.com/SujanTheMagician/Expense-Tracker",
    icon: "📊", color: "#10b981", highlight: false,
  },
  {
    title: "Resume Builder",
    subtitle: "Dynamic Resume Generator",
    desc: "Interactive tool for generating professional resumes with real-time preview, form validation, and print-ready PDF export styles.",
    tags: ["JavaScript", "HTML5", "CSS3"],
    link: "https://github.com/SujanTheMagician/Resume-Builder-",
    icon: "📄", color: "#8b5cf6", highlight: false,
  },
  {
    title: "Tourism Website",
    subtitle: "Multi-page Landing Site",
    desc: "Responsive multi-page tourism site with animated hero sections, destination cards, booking inquiry forms, and mobile-first layout.",
    tags: ["HTML5", "CSS3", "JavaScript"],
    link: "https://github.com/SujanTheMagician/Tourism-Website",
    icon: "✈️", color: "#f59e0b", highlight: false,
  },
  {
    title: "MPA Cuisine Wonders",
    subtitle: "Food Culture Showcase",
    desc: "Multi-page application showcasing global cuisines with structured navigation, image galleries, and semantic HTML for accessibility.",
    tags: ["HTML5", "CSS3"],
    link: "https://github.com/SujanTheMagician/MPA-Cuisine-Wonders-Project",
    icon: "🍽️", color: "#ec4899", highlight: false,
  },
];

const EXPERIENCE = [
  {
    role: "Software Developer Intern",
    org: "ATIUM Sports",
    period: "May 2026 – Present",
    type: "Internship",
    color: "#10b981",
    icon: "🏃",
    points: [
      "Building responsive React.js features for the athlete management platform",
      "Integrating RESTful APIs to deliver real-time sports data to end users",
      "Translating Figma designs into pixel-perfect production interfaces",
      "Participating in agile sprints, daily standups, and code reviews",
    ],
  },
  {
    role: "Teaching Assistant Intern",
    org: "Kalvium",
    period: "2025 – 2026",
    type: "Internship",
    color: "#8b5cf6",
    icon: "🎓",
    points: [
      "Assisted in delivering programming and web development curriculum to students",
      "Mentored peers on JavaScript, React, and frontend concepts",
      "Supported doubt-clearing sessions and project evaluations",
      "Helped bridge the gap between theory and hands-on coding practice",
    ],
  },
];

const TIMELINE = [
  { year: "2024",     title: "Started B.Tech CSE",         org: "AMET University, Chennai",                       icon: "🎓", color: "#3b82f6" },
  { year: "2024",     title: "First GitHub Projects",       org: "Tourism Website · Resume Builder · Expense Tracker", icon: "🚀", color: "#8b5cf6" },
  { year: "2025",     title: "Teaching Assistant Intern",   org: "Kalvium",                                        icon: "📚", color: "#a855f7" },
  { year: "May 2026", title: "Software Developer Intern",   org: "ATIUM Sports",                                   icon: "💼", color: "#10b981" },
  { year: "2026",     title: "FinanceOS Dashboard",         org: "Full-stack React App — flagship project",        icon: "📊", color: "#f59e0b" },
  { year: "2028",     title: "Expected Graduation",         org: "B.Tech CSE — AMET University",                   icon: "🏆", color: "#ec4899" },
];

const STATS = [
  { label: "Projects built",         val: 5, suffix: "+" },
  { label: "Languages & frameworks", val: 6, suffix: ""  },
  { label: "Internship roles",       val: 2, suffix: ""  },
  { label: "GitHub repos",           val: 5, suffix: "+" },
];

// ─── Particles (stable, no state) ─────────────────────────────────
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: `${4 + (i * 3.7) % 92}%`,
  y: `${2 + (i * 6.9) % 92}%`,
  size: 1.5 + (i % 3),
  delay: `${(i * 0.35) % 5}s`,
  dur: `${3 + (i % 4)}s`,
  color: ["#3b82f6","#8b5cf6","#06b6d4","#10b981","#f59e0b"][i % 5],
}));

// ─── Animated counter ─────────────────────────────────────────────
function Counter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const fired = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !fired.current) {
        fired.current = true;
        let n = 0;
        const step = Math.ceil(target / 55);
        const t = setInterval(() => {
          n = Math.min(n + step, target);
          setVal(n);
          if (n >= target) clearInterval(t);
        }, 22);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── Skill bar ────────────────────────────────────────────────────
function SkillBar({ skill, idx }) {
  const [w, setW] = useState(0);
  const ref = useRef(null);
  const fired = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !fired.current) {
        fired.current = true;
        setTimeout(() => setW(skill.level), idx * 90);
      }
    }, { threshold: 0.25 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [skill.level, idx]);
  return (
    <div ref={ref} style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 500, color: "var(--text-primary)" }}>
          <span style={{ fontSize: 16 }}>{skill.icon}</span>
          {skill.name}
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: `${skill.color}18`, color: skill.color, border: `1px solid ${skill.color}40` }}>
          {skill.level}%
        </span>
      </div>
      <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${w}%`, borderRadius: 99,
          background: `linear-gradient(90deg, ${skill.color}80, ${skill.color})`,
          transition: "width 1.1s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: `0 0 10px ${skill.color}50`,
        }} />
      </div>
    </div>
  );
}

// ─── Scroll reveal ────────────────────────────────────────────────
function Reveal({ children, delay = 0, direction = "up" }) {
  const [vis, setVis] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.07 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const from = direction === "left" ? "translateX(-28px)" : direction === "right" ? "translateX(28px)" : "translateY(28px)";
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translate(0)" : from,
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

// ─── Section heading ──────────────────────────────────────────────
function SectionHead({ label, sub }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <div style={{ width: 3, height: 22, background: "linear-gradient(to bottom,#3b82f6,#8b5cf6)", borderRadius: 99 }} />
        <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
          {label}
        </h2>
      </div>
      {sub && <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 0 15px" }}>{sub}</p>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════
export default function Portfolio() {
  const [typed, setTyped] = useState("");
  const [activeNav, setActiveNav] = useState("hero");
  const [activeTab, setActiveTab] = useState("all");

  // ── Stutter-free typewriter ────────────────────────────────────
  // Uses a single persistent loop stored in a ref.
  // Empty deps [] means it runs once and NEVER re-triggers on render.
  useEffect(() => {
    const ROLES = [
      "Frontend Developer",
      "React Engineer",
      "UI/UX Enthusiast",
      "Problem Solver",
      "ATIUM Sports Intern",
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timer = null;

    const tick = () => {
      const word = ROLES[roleIndex];

      if (!isDeleting) {
        charIndex++;
        setTyped(word.slice(0, charIndex));
        if (charIndex === word.length) {
          // Fully typed → pause, then start deleting
          isDeleting = true;
          timer = setTimeout(tick, 2200);
          return;
        }
        timer = setTimeout(tick, 72);
      } else {
        charIndex--;
        setTyped(word.slice(0, charIndex));
        if (charIndex === 0) {
          // Fully deleted → next word
          isDeleting = false;
          roleIndex = (roleIndex + 1) % ROLES.length;
          timer = setTimeout(tick, 380);
          return;
        }
        timer = setTimeout(tick, 42);
      }
    };

    timer = setTimeout(tick, 900);
    return () => { if (timer) clearTimeout(timer); };
  }, []); // ← intentionally empty: start once, run forever

  const scrollTo = (id) => {
    document.getElementById(`pf-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveNav(id);
  };

  const navLinks = [
    { id: "hero",       label: "About"      },
    { id: "skills",     label: "Skills"     },
    { id: "experience", label: "Experience" },
    { id: "projects",   label: "Projects"   },
    { id: "journey",    label: "Journey"    },
    { id: "contact",    label: "Contact"    },
  ];

  const filteredProjects = activeTab === "all"
    ? PROJECTS
    : PROJECTS.filter(p => p.tags.some(t => t.toLowerCase().includes(activeTab)));

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", paddingBottom: 40 }}>

      {/* ── Floating nav pill ─────────────────────────────────────── */}
      <div style={{ position:"sticky", top:70, zIndex:30, display:"flex", justifyContent:"center", padding:"10px 0", marginBottom:4 }}>
        <nav style={{
          display:"flex", gap:2,
          background:"rgba(10,15,30,0.90)",
          backdropFilter:"blur(20px)",
          border:"1px solid rgba(255,255,255,0.09)",
          borderRadius:99, padding:"4px 6px",
          boxShadow:"0 8px 32px rgba(0,0,0,0.45)",
        }}>
          {navLinks.map(n => (
            <button key={n.id} onClick={() => scrollTo(n.id)} style={{
              padding:"6px 14px", borderRadius:99, border:"none", cursor:"pointer",
              fontSize:12.5, fontWeight: activeNav === n.id ? 600 : 400,
              background: activeNav === n.id ? "linear-gradient(135deg,#3b82f6,#8b5cf6)" : "transparent",
              color: activeNav === n.id ? "#fff" : "var(--text-secondary)",
              transition:"all 0.2s", fontFamily:"'Inter',sans-serif", whiteSpace:"nowrap",
            }}>{n.label}</button>
          ))}
        </nav>
      </div>

      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <div id="pf-hero" style={{ position:"relative", overflow:"visible", marginBottom:40 }}>

        {/* bg blobs */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"-20%", left:"20%", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,rgba(59,130,246,0.10) 0%,transparent 70%)" }} />
          <div style={{ position:"absolute", bottom:0, right:"5%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(139,92,246,0.08) 0%,transparent 70%)" }} />
        </div>
        {PARTICLES.map(p => (
          <div key={p.id} style={{
            position:"absolute", left:p.x, top:p.y, width:p.size, height:p.size,
            borderRadius:"50%", background:p.color, opacity:0.35, zIndex:0,
            animation:`particleDrift ${p.dur} ease-in-out ${p.delay} infinite`,
            pointerEvents:"none",
          }} />
        ))}

        {/* Hero grid */}
        <div style={{
          position:"relative", zIndex:1,
          display:"grid", gridTemplateColumns:"auto 1fr",
          gap:40, alignItems:"center",
          padding:"36px 4px 24px",
        }}>

          {/* ── Photo column ── */}
          <Reveal direction="left" delay={0.05}>
            {/*
              Outer wrapper has extra bottom padding so the
              "Open to work" badge — which sits below the circle —
              is never clipped by overflow:hidden on a parent.
            */}
            <div style={{ position:"relative", display:"flex", flexDirection:"column", alignItems:"center", gap:0 }}>

              {/* Ring + photo container */}
              <div style={{ position:"relative", width:176, height:176 }}>

                {/* Outer slow-spin ring (decorative halo) */}
                <div style={{
                  position:"absolute", inset:-14, borderRadius:"50%",
                  background:"conic-gradient(from 180deg,#8b5cf6 0%,transparent 40%,#3b82f6 80%,transparent 100%)",
                  animation:"spin 16s linear infinite reverse", opacity:0.2,
                  pointerEvents:"none",
                }} />

                {/* Inner fast-spin gradient ring */}
                <div style={{
                  position:"absolute", inset:-7, borderRadius:"50%",
                  background:"conic-gradient(from 0deg,#3b82f6,#8b5cf6,#06b6d4,#10b981,#3b82f6)",
                  animation:"spin 7s linear infinite", opacity:0.65,
                  pointerEvents:"none",
                }} />

                {/* Dark gap between ring and photo */}
                <div style={{ position:"absolute", inset:-2, borderRadius:"50%", background:"var(--bg-base)", pointerEvents:"none" }} />

                {/* Photo */}
                <img
                  src="/sujan.jpg"
                  alt="Sujan Anandh S I"
                  onError={e => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextSibling.style.display = "flex";
                  }}
                  style={{
                    position:"absolute", inset:0,
                    width:"100%", height:"100%",
                    borderRadius:"50%",
                    objectFit:"cover", objectPosition:"center top",
                    zIndex:2,
                    border:"2px solid var(--bg-base)",
                  }}
                />
                {/* Fallback initials */}
                <div style={{
                  position:"absolute", inset:0, borderRadius:"50%", display:"none",
                  background:"linear-gradient(135deg,#3b82f6,#8b5cf6)",
                  alignItems:"center", justifyContent:"center",
                  fontSize:44, fontWeight:800, color:"#fff", zIndex:2,
                  fontFamily:"'Space Grotesk',sans-serif",
                }}>SA</div>
              </div>

              {/* "Open to work" badge — OUTSIDE the photo div, below it */}
              <div style={{
                marginTop: 10,
                display:"flex", alignItems:"center", gap:5,
                background:"rgba(16,185,129,0.18)",
                border:"1px solid rgba(16,185,129,0.45)",
                borderRadius:99,
                padding:"5px 13px",
                fontSize:11, fontWeight:700, color:"#34d399",
                whiteSpace:"nowrap",
                boxShadow:"0 0 12px rgba(16,185,129,0.2)",
              }}>
                <span style={{
                  width:6, height:6, borderRadius:"50%",
                  background:"#10b981", display:"inline-block",
                  animation:"pulse-glow 2s ease-in-out infinite",
                }} />
                Open to work
              </div>
            </div>
          </Reveal>

          {/* ── Text column ── */}
          <Reveal direction="right" delay={0.12}>
            <div>
              {/* Name */}
              <h1 style={{
                fontFamily:"'Space Grotesk',sans-serif",
                fontSize:"clamp(28px,4.5vw,46px)",
                fontWeight:700, lineHeight:1.1,
                color:"var(--text-primary)", marginBottom:10,
              }}>
                Sujan Anandh{" "}
                <span style={{
                  background:"linear-gradient(135deg,#3b82f6,#8b5cf6,#06b6d4)",
                  backgroundSize:"200% auto",
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                  backgroundClip:"text", animation:"gradientShift 4s ease infinite",
                }}>S I</span>
              </h1>

              {/* ── Typewriter line ──
                  Fixed height prevents layout shift.
                  The cursor is a styled <span>, not a border-right hack,
                  so it never inherits weird spacing from the parent font. */}
              <div style={{ fontSize:"clamp(15px,2.2vw,19px)", marginBottom:16, height:"1.6em", display:"flex", alignItems:"center" }}>
                <span style={{ color:"#60a5fa", fontWeight:600 }}>{typed}</span>
                <span style={{
                  display:"inline-block",
                  width:2, height:"1.1em",
                  background:"#3b82f6",
                  borderRadius:1,
                  marginLeft:3,
                  verticalAlign:"middle",
                  animation:"blink 1s step-end infinite",
                }} />
              </div>

              {/* Badges */}
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:18 }}>
                {[
                  { label:"B.Tech CSE",          color:"#3b82f6", bg:"rgba(59,130,246,0.12)"  },
                  { label:"AMET University '28",  color:"#8b5cf6", bg:"rgba(139,92,246,0.12)" },
                  { label:"ATIUM Sports Intern",  color:"#10b981", bg:"rgba(16,185,129,0.12)" },
                  { label:"Kalvium TA Intern",    color:"#a855f7", bg:"rgba(168,85,247,0.12)" },
                ].map(b => (
                  <span key={b.label} style={{
                    fontSize:11, fontWeight:600, padding:"5px 12px", borderRadius:99,
                    background:b.bg, color:b.color, border:`1px solid ${b.color}40`,
                    letterSpacing:"0.01em",
                  }}>{b.label}</span>
                ))}
              </div>

              {/* Bio */}
              <p style={{ fontSize:14, color:"var(--text-secondary)", lineHeight:1.8, maxWidth:560, marginBottom:22 }}>
                Passionate frontend developer and B.Tech CSE student at{" "}
                <strong style={{ color:"var(--text-primary)" }}>AMET University</strong> (2024–2028).
                Currently interning as a Software Developer at{" "}
                <strong style={{ color:"#10b981" }}>ATIUM Sports</strong>, building athlete management tools with React.
                Previously a Teaching Assistant at{" "}
                <strong style={{ color:"#a855f7" }}>Kalvium</strong>, mentoring students in web development.
                I love building fast, animated, and accessible digital experiences.
              </p>

              {/* CTAs */}
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <a href="https://github.com/SujanTheMagician" target="_blank" rel="noreferrer"
                  className="btn btn-primary" style={{ textDecoration:"none", fontSize:13 }}>
                  💻 GitHub
                </a>
                <a href="https://www.linkedin.com/in/sujan-anandh-227253212" target="_blank" rel="noreferrer"
                  className="btn btn-ghost" style={{ textDecoration:"none", fontSize:13 }}>
                  🔗 LinkedIn
                </a>
                <button className="btn btn-ghost" onClick={() => scrollTo("contact")} style={{ fontSize:13 }}>
                  📬 Contact me
                </button>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Teal accent strip (mirrors resume) */}
        <div style={{
          height:3, marginTop:16,
          background:"linear-gradient(90deg,#3b82f6,#8b5cf6,#06b6d4)",
          borderRadius:99, opacity:0.7,
        }} />
      </div>

      {/* ── Stats row ── */}
      <Reveal delay={0}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:48 }}>
          {STATS.map((s,i) => (
            <div key={i} className="glass" style={{ padding:"18px 12px", textAlign:"center" }}>
              <div style={{
                fontFamily:"'Space Grotesk',sans-serif", fontSize:30, fontWeight:700,
                background:"linear-gradient(135deg,#3b82f6,#8b5cf6)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
              }}>
                <Counter target={s.val} suffix={s.suffix} />
              </div>
              <div style={{ fontSize:11.5, color:"var(--text-muted)", marginTop:5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ══════════════════════════════════════════════
          SKILLS
      ══════════════════════════════════════════════ */}
      <div id="pf-skills" style={{ marginBottom:52 }}>
        <Reveal delay={0.05}><SectionHead label="Technical Skills" sub="What I build with" /></Reveal>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 48px" }}>
          {SKILLS.map((s,i) => <SkillBar key={s.name} skill={s} idx={i} />)}
        </div>
        <Reveal delay={0.15}>
          <div style={{ marginTop:24 }}>
            <div style={{ fontSize:12, fontWeight:600, color:"var(--text-muted)", marginBottom:10, letterSpacing:"0.06em", textTransform:"uppercase" }}>Tools & ecosystem</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {TOOLS.map(t => (
                <span key={t} style={{ fontSize:12, padding:"5px 12px", borderRadius:99, background:"rgba(255,255,255,0.04)", border:"1px solid var(--border)", color:"var(--text-secondary)" }}>{t}</span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* ══════════════════════════════════════════════
          EXPERIENCE
      ══════════════════════════════════════════════ */}
      <div id="pf-experience" style={{ marginBottom:52 }}>
        <Reveal delay={0.05}><SectionHead label="Experience" sub="Where I've worked" /></Reveal>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {EXPERIENCE.map((exp,i) => (
            <Reveal key={i} delay={i * 0.12}>
              <div className="glass" style={{ padding:"20px 24px", borderLeft:`3px solid ${exp.color}`, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", background:`radial-gradient(ellipse 60% 60% at 5% 50%,${exp.color}08 0%,transparent 60%)`, pointerEvents:"none" }} />
                <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:12, alignItems:"flex-start", marginBottom:12 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:34, height:34, borderRadius:9, background:`${exp.color}18`, border:`1px solid ${exp.color}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>{exp.icon}</div>
                    <div>
                      <div style={{ fontSize:15, fontWeight:700, color:"var(--text-primary)" }}>{exp.role}</div>
                      <div style={{ fontSize:13, fontWeight:600, color:exp.color, marginTop:2 }}>{exp.org}</div>
                    </div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <span className="badge" style={{ background:`${exp.color}15`, color:exp.color, border:`1px solid ${exp.color}35`, fontSize:11 }}>{exp.type}</span>
                    <div style={{ fontSize:12, color:"var(--text-muted)", marginTop:6 }}>{exp.period}</div>
                  </div>
                </div>
                <ul style={{ listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:6 }}>
                  {exp.points.map((pt,j) => (
                    <li key={j} style={{ display:"flex", gap:10, fontSize:13, color:"var(--text-secondary)", lineHeight:1.55 }}>
                      <span style={{ color:exp.color, fontSize:16, flexShrink:0, marginTop:-1 }}>›</span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          PROJECTS
      ══════════════════════════════════════════════ */}
      <div id="pf-projects" style={{ marginBottom:52 }}>
        <Reveal delay={0.05}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:12, marginBottom:28 }}>
            <SectionHead label="Projects" sub="Things I've shipped" />
            <div className="tab-group" style={{ marginBottom:28, flexShrink:0 }}>
              {[["all","All"],["react","React"],["javascript","JS"],["html5","HTML/CSS"]].map(([val,label]) => (
                <div key={val} className={`tab-item ${activeTab===val?"active":""}`} onClick={() => setActiveTab(val)} style={{ fontSize:12 }}>{label}</div>
              ))}
            </div>
          </div>
        </Reveal>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))", gap:14 }}>
          {filteredProjects.map((p,i) => (
            <Reveal key={p.title} delay={i * 0.07}>
              <a href={p.link} target="_blank" rel="noreferrer" style={{ textDecoration:"none", display:"block", height:"100%" }}>
                <div style={{
                  background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:"var(--radius-lg)",
                  padding:20, height:"100%", cursor:"pointer", transition:"all 0.25s",
                  borderTop:`2px solid ${p.color}`, position:"relative", overflow:"hidden",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=`0 12px 32px rgba(0,0,0,0.3),0 0 0 1px ${p.color}40`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}
                >
                  <div style={{ position:"absolute", top:0, right:0, width:120, height:120, background:`radial-gradient(circle,${p.color}10 0%,transparent 70%)`, pointerEvents:"none" }} />
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                    <span style={{ fontSize:26 }}>{p.icon}</span>
                    {p.highlight && (
                      <span style={{ fontSize:9, fontWeight:700, padding:"3px 8px", borderRadius:99, background:"rgba(59,130,246,0.15)", color:"#60a5fa", border:"1px solid rgba(59,130,246,0.3)", letterSpacing:"0.05em" }}>FLAGSHIP</span>
                    )}
                  </div>
                  <div style={{ fontSize:15, fontWeight:700, color:"var(--text-primary)", marginBottom:2, fontFamily:"'Space Grotesk',sans-serif" }}>{p.title}</div>
                  <div style={{ fontSize:11, color:p.color, fontWeight:600, marginBottom:10 }}>{p.subtitle}</div>
                  <p style={{ fontSize:12.5, color:"var(--text-secondary)", lineHeight:1.65, marginBottom:14 }}>{p.desc}</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:12 }}>
                    {p.tags.map(t => (
                      <span key={t} style={{ fontSize:10, fontWeight:600, padding:"3px 8px", borderRadius:99, background:`${p.color}14`, color:p.color, border:`1px solid ${p.color}35` }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"var(--text-muted)" }}>💻 View on GitHub →</div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          JOURNEY
      ══════════════════════════════════════════════ */}
      <div id="pf-journey" style={{ marginBottom:52 }}>
        <Reveal delay={0.05}><SectionHead label="My Journey" sub="From campus to career" /></Reveal>
        <div style={{ position:"relative", paddingLeft:16 }}>
          <div style={{ position:"absolute", left:15, top:8, bottom:8, width:2, background:`linear-gradient(to bottom,${TIMELINE.map(t=>t.color).join(",")})`, borderRadius:99 }} />
          {TIMELINE.map((t,i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div style={{ display:"flex", gap:20, marginBottom:20, alignItems:"flex-start" }}>
                <div style={{ width:32, height:32, borderRadius:"50%", background:`${t.color}18`, border:`2px solid ${t.color}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0, zIndex:1, position:"relative", boxShadow:`0 0 14px ${t.color}40` }}>{t.icon}</div>
                <div className="glass" style={{ padding:"12px 18px", flex:1, borderLeft:`2px solid ${t.color}50` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, flexWrap:"wrap" }}>
                    <div>
                      <div style={{ fontSize:14, fontWeight:600, color:"var(--text-primary)" }}>{t.title}</div>
                      <div style={{ fontSize:12, color:"var(--text-muted)", marginTop:3 }}>{t.org}</div>
                    </div>
                    <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:99, background:`${t.color}15`, color:t.color, border:`1px solid ${t.color}35`, flexShrink:0 }}>{t.year}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          CONTACT
      ══════════════════════════════════════════════ */}
      <div id="pf-contact">
        <Reveal delay={0.05}>
          <div style={{ borderRadius:"var(--radius-xl)", overflow:"hidden", border:"1px solid var(--border)", marginBottom:24 }}>
            <div style={{ background:"linear-gradient(135deg,#0F172A 0%,#1E293B 100%)", padding:"28px 28px 24px", borderBottom:"2px solid #0EA5E9" }}>
              <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:700, color:"#fff", marginBottom:6 }}>Let's build something together</h2>
              <p style={{ fontSize:13.5, color:"#94A3B8", lineHeight:1.65, maxWidth:480 }}>Open to internships, freelance projects, and collaborations. Whether it's a startup idea or a university project — let's talk.</p>
            </div>
            <div style={{ background:"var(--bg-card)", padding:"24px 28px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[
                { icon:"✉",  label:"Email",    val:"sujananandhsi@gmail.com",       href:"mailto:sujananandhsi@gmail.com",                              color:"#3b82f6" },
                { icon:"📞", label:"Phone",    val:"+91 8438339737",                href:"tel:8438339737",                                              color:"#10b981" },
                { icon:"💻", label:"GitHub",   val:"SujanTheMagician",              href:"https://github.com/SujanTheMagician",                         color:"#8b5cf6" },
                { icon:"🔗", label:"LinkedIn", val:"sujan-anandh-227253212",        href:"https://www.linkedin.com/in/sujan-anandh-227253212",          color:"#0EA5E9" },
              ].map(c => (
                <a key={c.label} href={c.href} target="_blank" rel="noreferrer" style={{ textDecoration:"none" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", background:"var(--bg-card2)", border:"1px solid var(--border)", borderRadius:"var(--radius-md)", transition:"all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor=c.color; e.currentTarget.style.background=`${c.color}08`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.background="var(--bg-card2)"; }}
                  >
                    <div style={{ width:36, height:36, borderRadius:9, background:`${c.color}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>{c.icon}</div>
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontSize:10, color:"var(--text-muted)", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:2 }}>{c.label}</div>
                      <div style={{ fontSize:12.5, color:c.color, fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.val}</div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div style={{
            background:"linear-gradient(135deg,#0F172A,#1E293B)",
            border:"1px solid rgba(255,255,255,0.06)",
            borderRadius:"var(--radius-lg)", padding:"14px 20px",
            display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8,
          }}>
            <div style={{ fontSize:12, color:"#64748B" }}>
              <span style={{ color:"#0EA5E9", fontWeight:600 }}>Sujan Anandh S I</span> · Chennai, India · AMET University '28
            </div>
            <div style={{ display:"flex", gap:16, fontSize:12 }}>
              {[
                { label:"GitHub",   href:"https://github.com/SujanTheMagician" },
                { label:"LinkedIn", href:"https://www.linkedin.com/in/sujan-anandh-227253212" },
                { label:"Email",    href:"mailto:sujananandhsi@gmail.com" },
              ].map(l => (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
                  style={{ color:"#0EA5E9", textDecoration:"none", fontWeight:500 }}
                  onMouseEnter={e => e.target.style.color="#38BDF8"}
                  onMouseLeave={e => e.target.style.color="#0EA5E9"}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

    </div>
  );
}