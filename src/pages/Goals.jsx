import { useState } from "react";
import { fmt } from "../data/mockData";

const DEFAULT_GOALS = [
  { id:1, name:"Emergency Fund", target:150000, saved:45000, icon:"🛡️", color:"#3b82f6", deadline:"2026-12-31" },
  { id:2, name:"New Laptop",     target:80000,  saved:32000, icon:"💻", color:"#8b5cf6", deadline:"2026-09-01" },
  { id:3, name:"Vacation Fund",  target:60000,  saved:18000, icon:"✈️", color:"#10b981", deadline:"2026-11-01" },
  { id:4, name:"SIP Corpus",     target:500000, saved:95000, icon:"📈", color:"#f59e0b", deadline:"2028-01-01" },
];

export default function Goals({ profile }) {
  const sym = profile?.currency?.split(" ")[0] || "₹";
  const [goals, setGoals] = useState(DEFAULT_GOALS);
  const [showAdd, setShowAdd] = useState(false);
  const [newGoal, setNewGoal] = useState({ name:"", target:"", saved:"", icon:"🎯", deadline:"" });
  const set = (k,v) => setNewGoal(g => ({...g,[k]:v}));

  const addGoal = () => {
    if (!newGoal.name || !newGoal.target) return;
    setGoals(g => [...g, { ...newGoal, id:Date.now(), target:Number(newGoal.target), saved:Number(newGoal.saved||0), color:"#3b82f6" }]);
    setNewGoal({ name:"", target:"", saved:"", icon:"🎯", deadline:"" });
    setShowAdd(false);
  };

  const updateSaved = (id, delta) => {
    setGoals(g => g.map(goal => goal.id===id ? {...goal, saved: Math.max(0, Math.min(goal.target, goal.saved+delta))} : goal));
  };

  const income  = Number(profile?.monthlyIncome||0);
  const sGoal   = Number(profile?.savingsGoal||20);
  const efTarget = Number(profile?.emergencyFund||0) || income * 6;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
        {[
          { label:"Active goals", val: goals.length, icon:"🎯" },
          { label:"Goals completed", val: goals.filter(g=>g.saved>=g.target).length, icon:"✅" },
          { label:"Monthly savings target", val: fmt(income*sGoal/100,sym), icon:"💰" },
        ].map((s,i) => (
          <div key={i} className="glass animate-fadeUp" style={{ padding:18, animationDelay:`${i*0.1}s`, opacity:0 }}>
            <div style={{ fontSize:22, marginBottom:8 }}>{s.icon}</div>
            <div style={{ fontSize:24, fontWeight:700, fontFamily:"'Space Grotesk',sans-serif" }}>{s.val}</div>
            <div style={{ fontSize:12, color:"var(--text-muted)", marginTop:4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Goal cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
        {goals.map((g, i) => {
          const pct = Math.min(Math.round(g.saved/g.target*100), 100);
          const done = g.saved >= g.target;
          const daysLeft = g.deadline ? Math.max(0, Math.ceil((new Date(g.deadline)-Date.now())/(1000*60*60*24))) : null;
          return (
            <div key={g.id} className="glass animate-fadeUp" style={{ padding:20, animationDelay:`${i*0.08}s`, opacity:0, position:"relative", overflow:"hidden" }}>
              {done && (
                <div style={{ position:"absolute", top:12, right:12, background:"rgba(16,185,129,0.15)", color:"#34d399", fontSize:11, fontWeight:700, padding:"3px 8px", borderRadius:99 }}>
                  ✓ Complete
                </div>
              )}
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:`${g.color}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>
                  {g.icon}
                </div>
                <div>
                  <div style={{ fontSize:15, fontWeight:600 }}>{g.name}</div>
                  {daysLeft !== null && (
                    <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:2 }}>
                      {done ? "Achieved!" : `${daysLeft} days left`}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:6 }}>
                  <span style={{ color:"var(--text-muted)" }}>Saved</span>
                  <span style={{ fontWeight:600 }}>{fmt(g.saved,sym)} <span style={{ color:"var(--text-muted)", fontWeight:400 }}>/ {fmt(g.target,sym)}</span></span>
                </div>
                <div className="progress-track" style={{ height:8 }}>
                  <div className="progress-fill" style={{ width:`${pct}%`, background:`linear-gradient(90deg, ${g.color}, ${g.color}99)` }} />
                </div>
                <div style={{ fontSize:12, color:g.color, marginTop:4, fontWeight:600 }}>{pct}% reached</div>
              </div>

              {!done && (
                <div style={{ display:"flex", gap:8, marginTop:8 }}>
                  <button className="btn btn-ghost" style={{ flex:1, justifyContent:"center", fontSize:12, padding:"6px 10px" }}
                    onClick={() => updateSaved(g.id, -1000)}>− {sym}1k</button>
                  <button className="btn btn-primary" style={{ flex:1, justifyContent:"center", fontSize:12, padding:"6px 10px" }}
                    onClick={() => updateSaved(g.id, 1000)}>+ {sym}1k</button>
                </div>
              )}
            </div>
          );
        })}

        {/* Add new goal card */}
        {!showAdd && (
          <div
            onClick={() => setShowAdd(true)}
            className="glass"
            style={{ padding:20, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10, cursor:"pointer", border:"2px dashed var(--border)", minHeight:200 }}
          >
            <div style={{ fontSize:32, opacity:0.4 }}>+</div>
            <div style={{ fontSize:13, color:"var(--text-muted)" }}>Add new goal</div>
          </div>
        )}

        {/* Add form inline */}
        {showAdd && (
          <div className="glass animate-scaleIn" style={{ padding:20 }}>
            <div style={{ fontSize:15, fontWeight:600, marginBottom:16 }}>New goal</div>
            <div style={{ display:"grid", gap:10 }}>
              <div>
                <label className="field-label">Goal name</label>
                <input className="input" placeholder="e.g. Emergency Fund" value={newGoal.name} onChange={e=>set("name",e.target.value)} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div>
                  <label className="field-label">Target ({sym})</label>
                  <input className="input" type="number" placeholder="0" value={newGoal.target} onChange={e=>set("target",e.target.value)} />
                </div>
                <div>
                  <label className="field-label">Saved so far</label>
                  <input className="input" type="number" placeholder="0" value={newGoal.saved} onChange={e=>set("saved",e.target.value)} />
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div>
                  <label className="field-label">Icon (emoji)</label>
                  <input className="input" maxLength={2} value={newGoal.icon} onChange={e=>set("icon",e.target.value)} />
                </div>
                <div>
                  <label className="field-label">Deadline</label>
                  <input className="input" type="date" value={newGoal.deadline} onChange={e=>set("deadline",e.target.value)} />
                </div>
              </div>
              <div style={{ display:"flex", gap:8, marginTop:4 }}>
                <button className="btn btn-ghost" style={{ flex:1, justifyContent:"center" }} onClick={() => setShowAdd(false)}>Cancel</button>
                <button className="btn btn-primary" style={{ flex:2, justifyContent:"center" }} onClick={addGoal}>Create goal</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
