import { fmt } from "../data/mockData";

const BUDGET_ICONS = { Food:"🛒", Transport:"🚗", Shopping:"🛍️", Entertainment:"🎬", Health:"❤️", Utilities:"⚡", Education:"📚" };
const BUDGET_COLORS = {
  Food:"#10b981", Transport:"#3b82f6", Shopping:"#f59e0b",
  Entertainment:"#ec4899", Health:"#ef4444", Utilities:"#06b6d4", Education:"#8b5cf6"
};

export default function Budgets({ profile, transactions }) {
  const sym = profile?.currency?.split(" ")[0] || "₹";
  const budgets = profile?.budgets || { Food:7000, Transport:3000, Shopping:5000, Entertainment:2000, Health:3000, Utilities:2000 };

  const spent = {};
  transactions.filter(t => t.type === "expense").forEach(t => {
    const key = Object.keys(budgets).find(k => k === t.category || t.category.startsWith(k));
    if (key) spent[key] = (spent[key] || 0) + t.amount;
  });

  const totalBudget = Object.values(budgets).reduce((s,v)=>s+v,0);
  const totalSpent  = Object.values(spent).reduce((s,v)=>s+v,0);
  const totalPct    = totalBudget > 0 ? Math.round(totalSpent/totalBudget*100) : 0;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

      {/* Overview card */}
      <div className="glass animate-fadeUp" style={{ padding:24, opacity:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:12 }}>
          <div>
            <div style={{ fontSize:15, fontWeight:600 }}>Monthly budget overview</div>
            <div style={{ fontSize:12, color:"var(--text-muted)", marginTop:2 }}>April 2026</div>
          </div>
          <div style={{ display:"flex", gap:24 }}>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:11, color:"var(--text-muted)" }}>Total budgeted</div>
              <div style={{ fontSize:20, fontWeight:700 }}>{fmt(totalBudget,sym)}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:11, color:"var(--text-muted)" }}>Total spent</div>
              <div style={{ fontSize:20, fontWeight:700, color: totalPct>100?"var(--red)":"var(--text-primary)" }}>{fmt(totalSpent,sym)}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:11, color:"var(--text-muted)" }}>Remaining</div>
              <div style={{ fontSize:20, fontWeight:700, color:"var(--green)" }}>{fmt(totalBudget-totalSpent,sym)}</div>
            </div>
          </div>
        </div>
        <div className="progress-track" style={{ height:10 }}>
          <div className="progress-fill" style={{ width:`${Math.min(totalPct,100)}%`, background: totalPct>100?"var(--red)":"linear-gradient(90deg,#3b82f6,#8b5cf6)" }} />
        </div>
        <div style={{ fontSize:12, color:"var(--text-muted)", marginTop:6 }}>{totalPct}% of total budget used</div>
      </div>

      {/* Category cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
        {Object.entries(budgets).map(([cat, limit], i) => {
          const s = spent[cat] || 0;
          const pct = limit > 0 ? Math.min(Math.round(s/limit*100), 100) : 0;
          const over = s > limit;
          const color = BUDGET_COLORS[cat] || "#94a3b8";
          const icon  = BUDGET_ICONS[cat] || "📦";

          return (
            <div key={cat} className="glass animate-fadeUp" style={{ padding:18, animationDelay:`${i*0.07}s`, opacity:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:`${color}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>
                  {icon}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:600 }}>{cat}</div>
                  <div style={{ fontSize:11, color:"var(--text-muted)" }}>{fmt(s,sym)} of {fmt(limit,sym)}</div>
                </div>
                <span className={`badge ${over?"badge-red":pct>80?"badge-amber":"badge-green"}`}>
                  {pct}%
                </span>
              </div>

              <div className="progress-track">
                <div className="progress-fill"
                  style={{ width:`${pct}%`, background: over ? "var(--red)" : `linear-gradient(90deg, ${color}, ${color}cc)` }} />
              </div>

              <div style={{ display:"flex", justifyContent:"space-between", marginTop:8, fontSize:12 }}>
                <span style={{ color: over ? "var(--red)" : "var(--text-muted)" }}>
                  {over ? `⚠ Over by ${fmt(s-limit,sym)}` : `${fmt(limit-s,sym)} remaining`}
                </span>
                <span style={{ color:"var(--text-muted)" }}>{pct}% used</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips */}
      <div className="glass animate-fadeUp delay-500" style={{ padding:20, opacity:0 }}>
        <div style={{ fontSize:15, fontWeight:600, marginBottom:14 }}>Budget tips</div>
        {Object.entries(budgets).filter(([cat, limit]) => (spent[cat]||0) > limit).map(([cat]) => (
          <div key={cat} className="insight-item">
            <div className="insight-icon">⚠️</div>
            <div className="insight-text"><strong>{cat}</strong> budget exceeded. Consider cutting back next month.</div>
          </div>
        ))}
        {Object.entries(budgets).filter(([cat, limit]) => (spent[cat]||0) < limit * 0.5).slice(0,2).map(([cat, limit]) => (
          <div key={cat} className="insight-item">
            <div className="insight-icon">✅</div>
            <div className="insight-text">Great control on <strong>{cat}</strong>! Only {Math.round((spent[cat]||0)/limit*100)}% used.</div>
          </div>
        ))}
        <div className="insight-item">
          <div className="insight-icon">💡</div>
          <div className="insight-text">The 50/30/20 rule: 50% needs, 30% wants, 20% savings. You can update budgets by restarting onboarding.</div>
        </div>
      </div>
    </div>
  );
}
