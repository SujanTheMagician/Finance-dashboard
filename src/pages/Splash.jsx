import { useEffect, useState } from "react";

const features = [
  { icon: "📊", label: "Live dashboard" },
  { icon: "💸", label: "Track spending" },
  { icon: "🎯", label: "Budget goals" },
  { icon: "📈", label: "Analytics" },
  { icon: "🔐", label: "Local & private" },
  { icon: "📱", label: "Mobile ready" },
];

const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  delay: `${Math.random() * 4}s`,
  duration: `${3 + Math.random() * 3}s`,
  size: `${2 + Math.random() * 4}px`,
  color: i % 3 === 0 ? "#3b82f6" : i % 3 === 1 ? "#8b5cf6" : "#06b6d4",
}));

export default function Splash({ onContinue }) {
  const [visible, setVisible] = useState(false);
  const [typed, setTyped] = useState("");
  const fullText = "Your money, your rules.";

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    let i = 0;
    const interval = setInterval(() => {
      setTyped(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 55);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="splash">
      <div className="splash-bg" />
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left, top: p.top,
            width: p.size, height: p.size,
            background: p.color,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}

      <div
        className="splash-card"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(32px)",
          transition: "all 0.7s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div className="splash-logo">💰</div>

        <h1 className="splash-title">
          <span className="gradient-text">FinanceOS</span>
        </h1>

        <p className="splash-subtitle" style={{ minHeight: "1.6em" }}>
          {typed}
          <span style={{ borderRight: "2px solid #3b82f6", marginLeft: 2, animation: "blink 1s infinite" }}>
            &nbsp;
          </span>
        </p>

        <p className="splash-author">
          Built by <span>Sujan Anandh</span> · Personal Finance Dashboard
        </p>

        <div className="splash-features">
          {features.map((f, i) => (
            <div
              key={i}
              className="splash-feature animate-fadeUp"
              style={{ animationDelay: `${0.3 + i * 0.08}s`, opacity: 0 }}
            >
              <span className="feat-icon">{f.icon}</span>
              <span>{f.label}</span>
            </div>
          ))}
        </div>

        <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px" }} onClick={onContinue}>
          Get started →
        </button>

        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 14 }}>
          All data stored locally on your device. No accounts, no cloud.
        </p>
      </div>
    </div>
  );
}
