import { useState } from "react";
import { ALL_CATEGORIES, EXPENSE_CATS, INCOME_CATS } from "../data/mockData";

export default function AddTransactionModal({ onClose, onAdd, sym }) {
  const [type, setType] = useState("expense");
  const [form, setForm] = useState({ desc:"", amount:"", category:"Food", date: new Date().toISOString().slice(0,10) });
  const set = (k,v) => setForm(f => ({...f, [k]:v}));
  const cats = type === "income" ? INCOME_CATS : EXPENSE_CATS;

  const submit = () => {
    if (!form.desc.trim() || !form.amount || Number(form.amount) <= 0) return;
    onAdd({ id:Date.now(), ...form, amount:Number(form.amount), type });
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-title">
          Add transaction
          <button onClick={onClose} style={{ background:"none", border:"none", color:"var(--text-muted)", fontSize:20, cursor:"pointer" }}>✕</button>
        </div>

        <div className="tab-group" style={{ marginBottom:20 }}>
          <div className={`tab-item ${type==="expense"?"active":""}`} onClick={() => { setType("expense"); set("category","Food"); }}>💸 Expense</div>
          <div className={`tab-item ${type==="income"?"active":""}`}  onClick={() => { setType("income");  set("category","Salary"); }}>💚 Income</div>
        </div>

        <div style={{ display:"grid", gap:14 }}>
          <div>
            <label className="field-label">Description</label>
            <input className="input" placeholder="e.g. Grocery shopping" value={form.desc} onChange={e => set("desc",e.target.value)} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <label className="field-label">Amount ({sym})</label>
              <input className="input" type="number" placeholder="0" min="1" value={form.amount} onChange={e => set("amount",e.target.value)} />
            </div>
            <div>
              <label className="field-label">Date</label>
              <input className="input" type="date" value={form.date} onChange={e => set("date",e.target.value)} />
            </div>
          </div>
          <div>
            <label className="field-label">Category</label>
            <select className="select" value={form.category} onChange={e => set("category",e.target.value)}>
              {cats.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display:"flex", gap:10, marginTop:20 }}>
          <button className="btn btn-ghost" onClick={onClose} style={{ flex:1, justifyContent:"center" }}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} style={{ flex:2, justifyContent:"center" }}>Add transaction</button>
        </div>
      </div>
    </div>
  );
}
