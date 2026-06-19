import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { CAT_META, CHART_COLORS, MONTHLY_HISTORY, fmt } from "../data/mockData";
import AddTransactionModal from "../components/AddTransactionModal";

export default function Dashboard({ profile, transactions, addTransaction, deleteTransaction }) {
  const [showModal, setShowModal] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const sym = profile?.currency?.split(" ")[0] || "₹";

  useEffect(() => { setAnimKey(k => k + 1); }, [transactions]);

  const income  = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;
  const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;

  // Donut data
  const catSpend = {};
  transactions.filter(t => t.type === "expense").forEach(t => {
    catSpend[t.category] = (catSpend[t.category] || 0) + t.amount;
  });
  const pieData = Object.entries(catSpend).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);

  const kpis = [
    { label:"Total Income",   val:fmt(income,sym),  badge:"+12%", up:true,  icon:"💚", color:"#10b981", bg:"rgba(16,185,129,0.12)" },
    { label:"Total Expenses", val:fmt(expense,sym), badge:"-3%",  up:false, icon:"🔴", color:"#ef4444", bg:"rgba(239,68,68,0.12)" },
    { label:"Net Balance",    val:fmt(balance,sym), badge:balance>=0?"Surplus":"Deficit", up:balance>=0, icon:"💰", color:"#3b82f6", bg:"rgba(59,130,246,0.12)" },
    { label:"Savings Rate",   val:`${savingsRate}%`, badge:savingsRate>=20?"On track":"Low", up:savingsRate>=20, icon:"🎯", color:"#8b5cf6", bg:"rgba(139,92,246,0.12)" },
  ];

  const recent = [...transactions].sort((a,b) => new Date(b.date)-new Date(a.date)).slice(0,6);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background:"var(--bg-card2)", border:"1px solid var(--border)", borderRadius:10, padding:"10px 14px", fontSize:12 }}>
        <div style={{ color:"var(--text-muted)", marginBottom:6 }}>{label}</div>
        {payload.map((p,i) => (
          <div key={i} style={{ color:p.color, marginBottom:2 }}>{p.name}: {fmt(p.value, sym)}</div>
        ))}
      </div>
    );
  };

  return (
    <div key={animKey} style={{ display:"flex", flexDirection:"column", gap:20 }}>

      {/* KPI Row */}
      <div className="kpi-grid">
        {kpis.map((k, i) => (
          <div
            key={i}
            className="kpi-card animate-fadeUp"
            style={{ "--kpi-color": k.color, "--kpi-bg": k.bg, animationDelay:`${i*0.1}s`, opacity:0 }}
          >
            <div className="kpi-icon-wrap" style={{ background:k.bg }}>{k.icon}</div>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value">{k.val}</div>
            <div className="kpi-footer">
              <span className={`badge ${k.up ? "badge-green" : "badge-red"}`}>
                {k.up ? "▲" : "▼"} {k.badge}
              </span>
              <span style={{ fontSize:11, color:"var(--text-muted)" }}>vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:16 }}>
        {/* Area Chart */}
        <div className="glass animate-fadeUp delay-200" style={{ padding:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
            <div>
              <div style={{ fontSize:15, fontWeight:600 }}>Cash Flow</div>
              <div style={{ fontSize:12, color:"var(--text-muted)", marginTop:2 }}>6-month income vs expenses</div>
            </div>
          </div>
          <div style={{ height:220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_HISTORY} margin={{ top:5, right:5, bottom:0, left:0 }}>
                <defs>
                  <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill:"#475569", fontSize:11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `${sym}${(v/1000).toFixed(0)}k`} tick={{ fill:"#475569", fontSize:11 }} axisLine={false} tickLine={false} width={52} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2} fill="url(#incGrad)" dot={{ r:3, fill:"#10b981" }} />
                <Area type="monotone" dataKey="expense" name="Expenses" stroke="#ef4444" strokeWidth={2} fill="url(#expGrad)" dot={{ r:3, fill:"#ef4444" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="glass animate-fadeUp delay-300" style={{ padding:20 }}>
          <div style={{ fontSize:15, fontWeight:600, marginBottom:4 }}>Spending</div>
          <div style={{ fontSize:12, color:"var(--text-muted)", marginBottom:12 }}>By category</div>
          {pieData.length === 0 ? (
            <div style={{ textAlign:"center", color:"var(--text-muted)", padding:"40px 0", fontSize:13 }}>No expenses yet</div>
          ) : (
            <div style={{ height:200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} strokeWidth={0}>
                    {pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => [fmt(v,sym)]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          <div style={{ display:"flex", flexDirection:"column", gap:4, marginTop:4 }}>
            {pieData.slice(0,4).map((d,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12 }}>
                <div style={{ width:8, height:8, borderRadius:2, background:CHART_COLORS[i%CHART_COLORS.length], flexShrink:0 }} />
                <span style={{ flex:1, color:"var(--text-secondary)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{d.name}</span>
                <span style={{ color:"var(--text-primary)", fontWeight:500 }}>{fmt(d.value,sym)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        {/* Recent Transactions */}
        <div className="glass animate-fadeUp delay-400" style={{ padding:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div style={{ fontSize:15, fontWeight:600 }}>Recent transactions</div>
            <span className="badge badge-blue">{transactions.length} total</span>
          </div>
          {recent.length === 0 ? (
            <div style={{ textAlign:"center", color:"var(--text-muted)", padding:"32px 0", fontSize:13 }}>
              No transactions yet. Add one!
            </div>
          ) : (
            recent.map((t, i) => {
              const meta = CAT_META[t.category] || CAT_META.Misc;
              return (
                <div key={t.id} className="tx-item" style={{ animationDelay:`${i*0.07}s` }}>
                  <div className="tx-icon-wrap" style={{ background:meta.bg }}>{meta.icon}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div className="tx-desc">{t.desc}</div>
                    <div className="tx-meta">{t.date} · {t.category}</div>
                  </div>
                  <div className={`tx-amount ${t.type === "income" ? "amount-income" : "amount-expense"}`}>
                    {t.type === "income" ? "+" : "-"}{fmt(t.amount, sym)}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Insights */}
        <div className="glass animate-fadeUp delay-500" style={{ padding:20 }}>
          <div style={{ fontSize:15, fontWeight:600, marginBottom:14 }}>Smart insights</div>
          <div className="insight-item">
            <div className="insight-icon">💡</div>
            <div className="insight-text">
              Your savings rate is <strong>{savingsRate}%</strong>.
              {savingsRate >= 20 ? " Great job — above the 20% benchmark!" : " Try to reach at least 20% to build wealth."}
            </div>
          </div>
          {Object.entries(catSpend).sort((a,b)=>b[1]-a[1]).slice(0,1).map(([cat, amt]) => (
            <div key={cat} className="insight-item" style={{ animationDelay:"0.1s" }}>
              <div className="insight-icon">🔍</div>
              <div className="insight-text">
                Top spend: <strong>{cat}</strong> at {fmt(amt,sym)}. Review if this aligns with your budget.
              </div>
            </div>
          ))}
          {balance > 0 && (
            <div className="insight-item" style={{ animationDelay:"0.2s" }}>
              <div className="insight-icon">📈</div>
              <div className="insight-text">
                You have a surplus of <strong>{fmt(balance,sym)}</strong>. Consider moving it to your SIP or emergency fund.
              </div>
            </div>
          )}
          <div className="insight-item" style={{ animationDelay:"0.3s" }}>
            <div className="insight-icon">🎯</div>
            <div className="insight-text">
              Monthly savings goal: <strong>{profile?.savingsGoal || 20}%</strong> ≈ {fmt((profile?.monthlyIncome||0)*(profile?.savingsGoal||20)/100, sym)}
            </div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button className="fab" onClick={() => setShowModal(true)} aria-label="Add transaction" title="Add transaction">
        +
      </button>

      {showModal && (
        <AddTransactionModal
          onClose={() => setShowModal(false)}
          onAdd={(tx) => { addTransaction(tx); setShowModal(false); }}
          sym={sym}
        />
      )}
    </div>
  );
}
