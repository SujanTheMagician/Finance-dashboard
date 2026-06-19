import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from "recharts";
import { CAT_META, CHART_COLORS, MONTHLY_HISTORY, fmt } from "../data/mockData";

export default function Analytics({ profile, transactions }) {
  const sym = profile?.currency?.split(" ")[0] || "₹";

  // Category breakdown
  const catSpend = {};
  transactions.filter(t => t.type === "expense").forEach(t => {
    catSpend[t.category] = (catSpend[t.category] || 0) + t.amount;
  });
  const barData = Object.entries(catSpend).map(([name, amount]) => ({ name, amount })).sort((a,b) => b.amount-a.amount);

  // Daily trend (last 14 days)
  const dailyMap = {};
  transactions.forEach(t => {
    if (!dailyMap[t.date]) dailyMap[t.date] = { date:t.date, income:0, expense:0 };
    dailyMap[t.date][t.type] += t.amount;
  });
  const dailyData = Object.values(dailyMap).sort((a,b) => new Date(a.date)-new Date(b.date)).slice(-14).map(d => ({...d, net: d.income - d.expense}));

  // Net worth progression using MONTHLY_HISTORY
  const netData = MONTHLY_HISTORY.map(m => ({ ...m, net: m.income - m.expense, savings: Math.round((m.income - m.expense)/m.income*100) }));

  const income  = transactions.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const expense = transactions.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background:"var(--bg-card2)", border:"1px solid var(--border)", borderRadius:10, padding:"10px 14px", fontSize:12 }}>
        <div style={{ color:"var(--text-muted)", marginBottom:6 }}>{label}</div>
        {payload.map((p,i) => <div key={i} style={{ color:p.color, marginBottom:2 }}>{p.name}: {fmt(p.value,sym)}</div>)}
      </div>
    );
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

      {/* Summary stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
        {[
          { label:"Avg daily expense", val:fmt(expense / Math.max(1, new Set(transactions.filter(t=>t.type==="expense").map(t=>t.date)).size), sym), icon:"📅" },
          { label:"Highest single spend", val:fmt(Math.max(0,...transactions.filter(t=>t.type==="expense").map(t=>t.amount)), sym), icon:"📍" },
          { label:"Income diversity", val:`${new Set(transactions.filter(t=>t.type==="income").map(t=>t.category)).size} source${new Set(transactions.filter(t=>t.type==="income").map(t=>t.category)).size!==1?"s":""}`, icon:"🌐" },
        ].map((s,i) => (
          <div key={i} className="glass animate-fadeUp" style={{ padding:18, animationDelay:`${i*0.1}s`, opacity:0 }}>
            <div style={{ fontSize:22, marginBottom:8 }}>{s.icon}</div>
            <div style={{ fontSize:22, fontWeight:700, fontFamily:"'Space Grotesk',sans-serif", marginBottom:4 }}>{s.val}</div>
            <div style={{ fontSize:12, color:"var(--text-muted)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Bar chart — spending by category */}
      <div className="glass animate-fadeUp delay-200" style={{ padding:20, opacity:0 }}>
        <div style={{ fontSize:15, fontWeight:600, marginBottom:4 }}>Spending by category</div>
        <div style={{ fontSize:12, color:"var(--text-muted)", marginBottom:16 }}>Where your money goes</div>
        <div style={{ height:220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top:5, right:5, left:0, bottom:5 }}>
              <XAxis dataKey="name" tick={{ fill:"#475569", fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `${sym}${(v/1000).toFixed(0)}k`} tick={{ fill:"#475569", fontSize:11 }} axisLine={false} tickLine={false} width={52} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" name="Amount" radius={[6,6,0,0]}
                fill="url(#barGrad)" />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        {/* Daily trend */}
        <div className="glass animate-fadeUp delay-300" style={{ padding:20, opacity:0 }}>
          <div style={{ fontSize:15, fontWeight:600, marginBottom:4 }}>Daily activity</div>
          <div style={{ fontSize:12, color:"var(--text-muted)", marginBottom:16 }}>Last 14 days</div>
          <div style={{ height:200 }}>
            {dailyData.length < 2 ? (
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", color:"var(--text-muted)", fontSize:13 }}>Not enough data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fill:"#475569", fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={d => d.slice(5)} />
                  <YAxis tickFormatter={v=>`${sym}${(v/1000).toFixed(0)}k`} tick={{ fill:"#475569", fontSize:10 }} axisLine={false} tickLine={false} width={48} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="expense" name="Expense" stroke="#ef4444" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Savings rate trend */}
        <div className="glass animate-fadeUp delay-400" style={{ padding:20, opacity:0 }}>
          <div style={{ fontSize:15, fontWeight:600, marginBottom:4 }}>Savings rate trend</div>
          <div style={{ fontSize:12, color:"var(--text-muted)", marginBottom:16 }}>Monthly % saved</div>
          <div style={{ height:200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={netData}>
                <XAxis dataKey="month" tick={{ fill:"#475569", fontSize:11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `${v}%`} tick={{ fill:"#475569", fontSize:11 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip formatter={(v) => [`${v}%`, "Savings rate"]} />
                <Bar dataKey="savings" name="Savings rate" fill="#10b981" radius={[4,4,0,0]} />
                <defs>
                  <linearGradient id="savGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
