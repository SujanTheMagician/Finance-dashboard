import { useState, useEffect } from "react";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";
import Portfolio from "./pages/Portfolio";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import "./index.css";

export default function App() {
  const [screen, setScreen] = useState("splash");
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("fo_profile");
    const savedTx = localStorage.getItem("fo_transactions");
    if (saved) {
      setProfile(JSON.parse(saved));
      setTransactions(savedTx ? JSON.parse(savedTx) : defaultTransactions());
      setScreen("app");
    }
  }, []);

  const handleOnboardingComplete = (data) => {
    const tx = defaultTransactions();
    setProfile(data);
    setTransactions(tx);
    localStorage.setItem("fo_profile", JSON.stringify(data));
    localStorage.setItem("fo_transactions", JSON.stringify(tx));
    setScreen("app");
  };

  const addTransaction = (tx) => {
    const updated = [tx, ...transactions];
    setTransactions(updated);
    localStorage.setItem("fo_transactions", JSON.stringify(updated));
  };

  const deleteTransaction = (id) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    localStorage.setItem("fo_transactions", JSON.stringify(updated));
  };

  const resetApp = () => {
    localStorage.clear();
    setProfile(null);
    setTransactions([]);
    setScreen("splash");
    setActivePage("dashboard");
  };

  if (screen === "splash") return <Splash onContinue={() => setScreen("onboarding")} />;
  if (screen === "onboarding") return <Onboarding onComplete={handleOnboardingComplete} />;

  const pages = {
    dashboard: Dashboard,
    transactions: Transactions,
    analytics: Analytics,
    budgets: Budgets,
    goals: Goals,
    portfolio: Portfolio,
  };
  const PageComponent = pages[activePage] || Dashboard;

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        profile={profile}
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="main-content">
        <Topbar
          activePage={activePage}
          profile={profile}
          onMenuToggle={() => setSidebarOpen(o => !o)}
          onReset={resetApp}
        />
        <div className="page-content">
          <PageComponent
            profile={profile}
            transactions={transactions}
            addTransaction={addTransaction}
            deleteTransaction={deleteTransaction}
          />
        </div>
      </div>
    </div>
  );
}

function defaultTransactions() {
  return [
    { id: 1,  date: "2026-04-01", amount: 52000, category: "Salary",        type: "income",  desc: "Monthly salary credit" },
    { id: 2,  date: "2026-04-02", amount: 3400,  category: "Food",          type: "expense", desc: "Grocery shopping" },
    { id: 3,  date: "2026-04-03", amount: 1200,  category: "Transport",     type: "expense", desc: "Ola & Metro rides" },
    { id: 4,  date: "2026-04-05", amount: 14000, category: "Freelance",     type: "income",  desc: "UI design project" },
    { id: 5,  date: "2026-04-06", amount: 6200,  category: "Shopping",      type: "expense", desc: "Amazon & Myntra" },
    { id: 6,  date: "2026-04-08", amount: 850,   category: "Entertainment", type: "expense", desc: "Netflix & Spotify" },
    { id: 7,  date: "2026-04-10", amount: 2400,  category: "Health",        type: "expense", desc: "Apollo pharmacy" },
    { id: 8,  date: "2026-04-11", amount: 1100,  category: "Utilities",     type: "expense", desc: "Electricity & internet" },
    { id: 9,  date: "2026-04-13", amount: 9500,  category: "Investment",    type: "income",  desc: "SIP & dividend returns" },
    { id: 10, date: "2026-04-14", amount: 2800,  category: "Food",          type: "expense", desc: "Zomato & Swiggy" },
    { id: 11, date: "2026-04-15", amount: 4200,  category: "Shopping",      type: "expense", desc: "Electronics accessories" },
    { id: 12, date: "2026-04-17", amount: 700,   category: "Transport",     type: "expense", desc: "Fuel & parking" },
    { id: 13, date: "2026-04-18", amount: 3000,  category: "Freelance",     type: "income",  desc: "Content writing gig" },
    { id: 14, date: "2026-04-19", amount: 1500,  category: "Entertainment", type: "expense", desc: "Movie & dining out" },
    { id: 15, date: "2026-04-20", amount: 900,   category: "Health",        type: "expense", desc: "Gym membership" },
  ];
}
