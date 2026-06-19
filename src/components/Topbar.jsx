import { PAGE_META } from "./Sidebar";

export default function Topbar({ activePage, profile, onMenuToggle, onReset }) {
  const { title, sub } = PAGE_META[activePage] || PAGE_META.dashboard;
  const sym = profile?.currency?.split(" ")[0] || "₹";

  return (
    <div className="topbar">
      <button
        onClick={onMenuToggle}
        style={{ background: "none", border: "none", color: "var(--text-secondary)", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", padding: 4 }}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      <div style={{ flex: 1 }}>
        <div className="topbar-title">{title}</div>
        <div className="topbar-sub">{sub}</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "var(--accent)", fontWeight: 600 }}>{sym}</span>
          <span>{profile?.currency?.split(" ")[1] || "INR"}</span>
        </div>
        <button className="btn btn-ghost" onClick={onReset} style={{ fontSize: 12, padding: "6px 12px" }}>
          ↺ Reset
        </button>
      </div>
    </div>
  );
}
