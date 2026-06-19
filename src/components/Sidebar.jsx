const navItems = [
  { id: "dashboard",    icon: "🏠", label: "Dashboard" },
  { id: "transactions", icon: "💳", label: "Transactions" },
  { id: "analytics",    icon: "📈", label: "Analytics" },
  { id: "budgets",      icon: "🎯", label: "Budgets" },
  { id: "goals",        icon: "⭐", label: "Goals" },
  { id: "portfolio",    icon: "🧑‍💻", label: "About Me" },
];

// Update PAGE_TITLES in Topbar too
export const PAGE_META = {
  dashboard:    { title: "Dashboard",    sub: "Your financial overview" },
  transactions: { title: "Transactions", sub: "All income & expense records" },
  analytics:    { title: "Analytics",    sub: "Trends & spending insights" },
  budgets:      { title: "Budgets",      sub: "Monthly budget tracker" },
  goals:        { title: "Goals",        sub: "Financial milestones" },
  portfolio:    { title: "About Me",     sub: "Sujan Anandh S I — Portfolio" },
};

export default function Sidebar({ activePage, setActivePage, profile, mobileOpen, onClose }) {
  const initials = profile?.name
    ? profile.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "SA";

  return (
    <>
      {mobileOpen && (
        <div onClick={onClose} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 49,
          animation: "fadeIn 0.2s ease",
        }} />
      )}
      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-logo">
          <div className="logo-mark">💰</div>
          <div>
            <div className="logo-text">FinanceOS</div>
            <div className="logo-sub">Personal Finance</div>
          </div>
        </div>

        <nav style={{ marginTop: 16, flex: 1 }}>
          <div className="nav-section">Menu</div>
          {navItems.map((item, i) => (
            <div
              key={item.id}
              className={`nav-item ${activePage === item.id ? "active" : ""}`}
              onClick={() => { setActivePage(item.id); onClose(); }}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              {item.id === "transactions" && <span className="nav-badge">New</span>}
              {item.id === "portfolio" && (
                <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 99, background: "rgba(139,92,246,0.2)", color: "#a78bfa" }}>
                  YOU
                </span>
              )}
            </div>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">{initials}</div>
          <div style={{ minWidth: 0 }}>
            <div className="user-name" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {profile?.name || "Sujan Anandh"}
            </div>
            <div className="user-role">{profile?.occupation || "Developer"}</div>
          </div>
        </div>
      </aside>
    </>
  );
}
