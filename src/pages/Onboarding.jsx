import { useState } from "react";

const STEPS = ["Profile", "Income", "Expenses", "Goals"];
const CURRENCIES = ["₹ INR", "$ USD", "€ EUR", "£ GBP", "¥ JPY"];
const INCOME_SOURCES = ["Salary", "Freelance", "Business", "Investment", "Rental", "Other"];
const EXPENSE_CATS = ["Food & Dining", "Transport", "Shopping", "Entertainment", "Health", "Utilities", "Education", "Savings"];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: "", occupation: "", currency: "₹ INR",
    monthlyIncome: "", incomeSource: "Salary",
    otherIncome: "",
    budgets: { Food: 7000, Transport: 3000, Shopping: 5000, Entertainment: 2000, Health: 3000, Utilities: 2000 },
    savingsGoal: 20,
    emergencyFund: "",
  });

  const set = (key, val) => setData(d => ({ ...d, [key]: val }));
  const setBudget = (key, val) => setData(d => ({ ...d, budgets: { ...d.budgets, [key]: Number(val) } }));

  const next = () => { if (step < STEPS.length - 1) setStep(s => s + 1); else onComplete(data); };
  const back = () => setStep(s => s - 1);

  const canNext = () => {
    if (step === 0) return data.name.trim().length > 0;
    if (step === 1) return data.monthlyIncome > 0;
    return true;
  };

  return (
    <div className="onboarding">
      <div className="onboarding-bg" />
      <div className="onboarding-card">
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:28 }}>
          <div className="logo-mark" style={{ width:32, height:32, borderRadius:8, fontSize:16 }}>💰</div>
          <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:16, color:"var(--text-primary)" }}>FinanceOS</span>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator">
          {STEPS.map((s, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", flex: i < STEPS.length - 1 ? "1" : "0" }}>
              <div className={`step-dot ${i < step ? "done" : i === step ? "active" : ""}`}>
                {i < step ? "✓" : i + 1}
              </div>
              {i < STEPS.length - 1 && <div className={`step-line ${i < step ? "done" : ""}`} />}
            </div>
          ))}
        </div>

        {/* Step 0: Profile */}
        {step === 0 && (
          <div className="wizard-step">
            <div className="onboarding-title">Welcome! Let's set up your profile</div>
            <div className="onboarding-sub">Tell us a little about yourself</div>
            <div className="form-grid">
              <div>
                <label className="field-label">Your name</label>
                <input className="input" placeholder="e.g. Sujan Anandh" value={data.name} onChange={e => set("name", e.target.value)} />
              </div>
              <div>
                <label className="field-label">Occupation</label>
                <input className="input" placeholder="e.g. Software Engineer" value={data.occupation} onChange={e => set("occupation", e.target.value)} />
              </div>
              <div>
                <label className="field-label">Currency</label>
                <select className="select" value={data.currency} onChange={e => set("currency", e.target.value)}>
                  {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Income */}
        {step === 1 && (
          <div className="wizard-step">
            <div className="onboarding-title">What's your monthly income?</div>
            <div className="onboarding-sub">We'll use this to calculate your savings rate</div>
            <div className="form-grid">
              <div>
                <label className="field-label">Primary income ({data.currency.split(" ")[0]})</label>
                <input className="input" type="number" placeholder="e.g. 50000" value={data.monthlyIncome}
                  onChange={e => set("monthlyIncome", e.target.value)} />
              </div>
              <div>
                <label className="field-label">Income source</label>
                <select className="select" value={data.incomeSource} onChange={e => set("incomeSource", e.target.value)}>
                  {INCOME_SOURCES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Other monthly income (optional)</label>
                <input className="input" type="number" placeholder="Freelance, rental, dividends…" value={data.otherIncome}
                  onChange={e => set("otherIncome", e.target.value)} />
              </div>
            </div>
            {data.monthlyIncome > 0 && (
              <div style={{ marginTop:16, padding:"12px 16px", background:"rgba(59,130,246,0.08)", borderRadius:"var(--radius-md)", border:"1px solid rgba(59,130,246,0.2)", fontSize:13 }}>
                💡 Total monthly income: <strong style={{ color:"var(--accent)" }}>{data.currency.split(" ")[0]}{(Number(data.monthlyIncome) + Number(data.otherIncome || 0)).toLocaleString("en-IN")}</strong>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Expense Budgets */}
        {step === 2 && (
          <div className="wizard-step">
            <div className="onboarding-title">Set your monthly budgets</div>
            <div className="onboarding-sub">How much do you want to spend per category?</div>
            <div className="form-grid" style={{ maxHeight:320, overflowY:"auto", paddingRight:4 }}>
              {Object.entries(data.budgets).map(([cat, val]) => (
                <div key={cat}>
                  <label className="field-label">{cat} ({data.currency.split(" ")[0]})</label>
                  <input className="input" type="number" value={val} onChange={e => setBudget(cat, e.target.value)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Goals */}
        {step === 3 && (
          <div className="wizard-step">
            <div className="onboarding-title">Set your financial goals</div>
            <div className="onboarding-sub">What do you want to achieve?</div>
            <div className="form-grid">
              <div>
                <label className="field-label">Monthly savings goal (%)</label>
                <input className="input" type="range" min={5} max={80} value={data.savingsGoal}
                  onChange={e => set("savingsGoal", e.target.value)} />
                <div style={{ textAlign:"center", fontSize:22, fontWeight:700, color:"var(--accent)", marginTop:4 }}>
                  {data.savingsGoal}%
                </div>
                <div style={{ textAlign:"center", fontSize:12, color:"var(--text-muted)" }}>
                  ≈ {data.currency.split(" ")[0]}{Math.round((data.monthlyIncome || 0) * data.savingsGoal / 100).toLocaleString("en-IN")} / month
                </div>
              </div>
              <div>
                <label className="field-label">Emergency fund target ({data.currency.split(" ")[0]})</label>
                <input className="input" type="number" placeholder="e.g. 150000" value={data.emergencyFund}
                  onChange={e => set("emergencyFund", e.target.value)} />
                <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:4 }}>Recommended: 3–6× monthly income</div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display:"flex", gap:10, marginTop:28 }}>
          {step > 0 && <button className="btn btn-ghost" onClick={back} style={{ flex:1 }}>← Back</button>}
          <button className="btn btn-primary" onClick={next} disabled={!canNext()}
            style={{ flex:2, justifyContent:"center", opacity: canNext() ? 1 : 0.5 }}>
            {step === STEPS.length - 1 ? "Launch dashboard 🚀" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}
