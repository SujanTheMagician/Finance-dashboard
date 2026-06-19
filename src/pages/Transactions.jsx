import { useState } from "react";
import { CAT_META, fmt } from "../data/mockData";
import AddTransactionModal from "../components/AddTransactionModal";

export default function Transactions({ profile, transactions, addTransaction, deleteTransaction }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const sym = profile?.currency?.split(" ")[0] || "₹";

  const cats = [...new Set(transactions.map(t => t.category))].sort();
  const filtered = transactions
    .filter(t => filter === "all" || t.type === filter)
    .filter(t => catFilter === "all" || t.category === catFilter)
    .filter(t => !search || t.desc.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => new Date(b.date) - new Date(a.date));

  const totalIncome  = filtered.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const totalExpense = filtered.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {/* Header row */}
      <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
        <input className="input" style={{ flex:1, minWidth:180 }} placeholder="🔍 Search transactions…" value={search} onChange={e => setSearch(e.target.value)} />
        <div className="tab-group" style={{ flexShrink:0 }}>
          {["all","income","expense"].map(f => (
            <div key={f} className={`tab-item ${filter===f?"active":""}`} onClick={() => setFilter(f)} style={{ textTransform:"capitalize" }}>{f}</div>
          ))}
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add</button>
      </div>

      {/* Category filter chips */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {["all", ...cats].map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
            className="btn"
            style={{ padding:"5px 12px", fontSize:12, background: catFilter===c ? "rgba(59,130,246,0.15)" : "var(--bg-card2)", color: catFilter===c ? "var(--accent)" : "var(--text-muted)", border: catFilter===c ? "1px solid rgba(59,130,246,0.4)" : "1px solid var(--border)", borderRadius:99 }}>
            {c === "all" ? "All categories" : c}
          </button>
        ))}
      </div>

      {/* Summary strip */}
      <div style={{ display:"flex", gap:12 }}>
        <div className="glass" style={{ padding:"12px 18px", flex:1, textAlign:"center" }}>
          <div style={{ fontSize:11, color:"var(--text-muted)", marginBottom:4 }}>SHOWING</div>
          <div style={{ fontSize:20, fontWeight:700 }}>{filtered.length}</div>
        </div>
        <div className="glass" style={{ padding:"12px 18px", flex:1, textAlign:"center" }}>
          <div style={{ fontSize:11, color:"var(--text-muted)", marginBottom:4 }}>INCOME</div>
          <div style={{ fontSize:20, fontWeight:700, color:"var(--green)" }}>{fmt(totalIncome, sym)}</div>
        </div>
        <div className="glass" style={{ padding:"12px 18px", flex:1, textAlign:"center" }}>
          <div style={{ fontSize:11, color:"var(--text-muted)", marginBottom:4 }}>EXPENSES</div>
          <div style={{ fontSize:20, fontWeight:700, color:"var(--red)" }}>{fmt(totalExpense, sym)}</div>
        </div>
      </div>

      {/* Table */}
      <div className="glass" style={{ padding:0, overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ borderBottom:"1px solid var(--border)" }}>
                {["Date","Description","Category","Type","Amount",""].map(h => (
                  <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11, fontWeight:600, color:"var(--text-muted)", letterSpacing:"0.06em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign:"center", padding:40, color:"var(--text-muted)", fontSize:13 }}>No transactions match your filters</td></tr>
              ) : filtered.map((t, i) => {
                const meta = CAT_META[t.category] || CAT_META.Misc;
                return (
                  <tr key={t.id}
                    style={{ borderBottom:"1px solid var(--border)", transition:"background 0.15s", cursor:"default" }}
                    onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.02)"}
                    onMouseLeave={e => e.currentTarget.style.background="transparent"}
                  >
                    <td style={{ padding:"11px 16px", fontSize:13, color:"var(--text-muted)" }}>{t.date}</td>
                    <td style={{ padding:"11px 16px", fontSize:13, fontWeight:500, color:"var(--text-primary)", maxWidth:200 }}>
                      <div style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.desc}</div>
                    </td>
                    <td style={{ padding:"11px 16px" }}>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:12, background:meta.bg, color:meta.color, padding:"3px 10px", borderRadius:99 }}>
                        {meta.icon} {t.category}
                      </span>
                    </td>
                    <td style={{ padding:"11px 16px" }}>
                      <span className={`badge ${t.type==="income"?"badge-green":"badge-red"}`}>{t.type}</span>
                    </td>
                    <td style={{ padding:"11px 16px", fontSize:14, fontWeight:600, color:t.type==="income"?"var(--green)":"var(--red)" }}>
                      {t.type==="income"?"+":"-"}{fmt(t.amount,sym)}
                    </td>
                    <td style={{ padding:"11px 16px" }}>
                      <button onClick={() => deleteTransaction(t.id)}
                        style={{ background:"none", border:"none", color:"var(--text-muted)", cursor:"pointer", fontSize:16, padding:4, borderRadius:6, transition:"color 0.15s" }}
                        onMouseEnter={e => e.target.style.color="var(--red)"}
                        onMouseLeave={e => e.target.style.color="var(--text-muted)"}>
                        🗑
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <AddTransactionModal onClose={() => setShowModal(false)} onAdd={(tx) => { addTransaction(tx); setShowModal(false); }} sym={sym} />
      )}
    </div>
  );
}
