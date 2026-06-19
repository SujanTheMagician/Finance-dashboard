export const CAT_META = {
  Food:          { icon: "🛒", bg: "rgba(16,185,129,0.12)",  color: "#10b981" },
  Transport:     { icon: "🚗", bg: "rgba(59,130,246,0.12)",  color: "#3b82f6" },
  Salary:        { icon: "💼", bg: "rgba(16,185,129,0.12)",  color: "#10b981" },
  Freelance:     { icon: "💻", bg: "rgba(139,92,246,0.12)",  color: "#8b5cf6" },
  Shopping:      { icon: "🛍️", bg: "rgba(245,158,11,0.12)",  color: "#f59e0b" },
  Entertainment: { icon: "🎬", bg: "rgba(236,72,153,0.12)",  color: "#ec4899" },
  Health:        { icon: "❤️", bg: "rgba(239,68,68,0.12)",   color: "#ef4444" },
  Utilities:     { icon: "⚡", bg: "rgba(6,182,212,0.12)",   color: "#06b6d4" },
  Investment:    { icon: "📈", bg: "rgba(16,185,129,0.12)",  color: "#10b981" },
  Misc:          { icon: "📦", bg: "rgba(148,163,184,0.12)", color: "#94a3b8" },
};

export const CHART_COLORS = [
  "#3b82f6","#8b5cf6","#10b981","#f59e0b",
  "#ef4444","#ec4899","#06b6d4","#a3e635"
];

export const MONTHLY_HISTORY = [
  { month:"Nov", income:48000, expense:29000 },
  { month:"Dec", income:52000, expense:36000 },
  { month:"Jan", income:46000, expense:28000 },
  { month:"Feb", income:51000, expense:27500 },
  { month:"Mar", income:54000, expense:31000 },
  { month:"Apr", income:75500, expense:26150 },
];

export const ALL_CATEGORIES = Object.keys(CAT_META);
export const EXPENSE_CATS = ["Food","Transport","Shopping","Entertainment","Health","Utilities","Misc"];
export const INCOME_CATS  = ["Salary","Freelance","Investment","Misc"];

export function fmt(amount, sym="₹") {
  return sym + Math.abs(Math.round(amount)).toLocaleString("en-IN");
}
