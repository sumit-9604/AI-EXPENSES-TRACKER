import { useEffect, useState } from "react";
import API from "../api";
import ExpenseChart from "../components/Expensescharts";
import PredictionCard from "../components/PredictionCard";
import ExpenseForm from "../components/Expenseform";
import Expenseslist from "../components/Expenseslist";
import dashboardBg from "../assets/dashboard.png";
import { 
  LogOut, 
  Wallet, 
  PlusCircle, 
  BarChart3,
  Landmark
} from "lucide-react";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [prediction, setPrediction] = useState(0);
  const [total, setTotal] = useState(0);
  const [salary, setSalary] = useState(() => {
    return Number(localStorage.getItem("salary")) || 0;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
      return;
    }

    const initData = async () => {
      setLoading(true);
      await Promise.all([fetchExpenses(), fetchPrediction()]);
      setLoading(false);
    };

    initData();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error("Fetch expenses error:", err);
    }
  };

  const handleAddExpense = (newExpense) => {
    setExpenses((prev) => [newExpense, ...prev]);
    fetchPrediction();
  };

  const deleteExpense = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);
      fetchExpenses();
      fetchPrediction();
    } catch (err) {
      console.error("Delete expense error:", err);
    }
  };

  const handleSalarySave = (value) => {
    const num = Number(value);
    setSalary(num);
    localStorage.setItem("salary", num);
  };

  const fetchPrediction = async () => {
    try {
      const res = await API.get("/analytics/summary");
      setPrediction(res.data.prediction || 0);
      setTotal(res.data.total || 0);

      if (!localStorage.getItem("salary")) {
        setSalary(res.data.salary || 0);
        localStorage.setItem("salary", res.data.salary || 0);
      }
    } catch (err) {
      console.error("Analytic error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("salary");
    window.location.reload();
  };

  return (
    <div 
      className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col relative overflow-x-hidden bg-cover bg-fixed bg-center selection:bg-amber-500/30 selection:text-amber-200"
      style={{ backgroundImage: `url("${dashboardBg}")` }}
    >
      {/* Editorial dark glass overlay for crisp readability */}
      <div className="absolute inset-0 bg-[#070b14]/85 backdrop-blur-[2px] pointer-events-none" />

      {/* Top Luxury Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#090f1b]/90 border-b border-amber-500/20 shadow-lg shadow-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Brand Emblem */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#d4af37] via-[#f3e5ab] to-[#d4af37] p-0.5 shadow-md shadow-amber-950/50">
              <div className="w-full h-full bg-[#080d16] rounded-[14px] flex items-center justify-center text-amber-400">
                <Landmark className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif-luxury text-xl font-bold tracking-wider text-amber-100 italic">
                  Expense Ledger
                </h1>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-semibold uppercase tracking-widest">
                  Executive
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-400 tracking-wide">Personal Capital Management & Spending Ledger</p>
            </div>
          </div>

          {/* Right Actions: Budget Badge & Logout */}
          <div className="flex items-center gap-3">
            {salary > 0 && (
              <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0e1626] border border-amber-500/20 text-xs shadow-sm">
                <Wallet className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-400">Monthly Budget:</span>
                <span className="font-bold text-amber-200">₹{salary.toLocaleString("en-IN")}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0e1626] hover:bg-rose-950/40 border border-slate-700/60 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm"
              title="Sign out of account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 z-10">
        {/* Quick Add Transaction Section */}
        <section className="backdrop-blur-xl bg-[#0e1626]/80 border border-amber-500/20 rounded-3xl p-5 sm:p-6 shadow-xl shadow-black/40">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <PlusCircle className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-bold text-amber-200 uppercase tracking-widest font-serif-luxury">Record New Outflow</h2>
          </div>

          <ExpenseForm
            onAdd={handleAddExpense}
            salary={salary}
            setSalary={setSalary}
            onSalarySave={handleSalarySave}
            showSalaryInput={salary === 0}
          />
        </section>

        {/* Visual Analytics & Portfolio Charts Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h2 className="font-serif-luxury text-lg font-bold text-amber-100 tracking-wide">
                Portfolio Analytics & Expense Breakdown
              </h2>
            </div>
            <span className="text-xs text-slate-400 tracking-wide">Category Distribution, Trajectory & Outflow Matrix</span>
          </div>

          <ExpenseChart expenses={expenses} />
        </section>

        {/* Capital Analysis & Transaction Ledger in Responsive Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Capital Analysis Card (5 cols) */}
          <div className="lg:col-span-5">
            <PredictionCard
              prediction={prediction}
              total={total}
              salary={salary}
              onUpdateSalary={handleSalarySave}
            />
          </div>

          {/* Transaction Ledger (7 cols) */}
          <div className="lg:col-span-7">
            <Expenseslist
              expenses={expenses}
              onDelete={deleteExpense}
            />
          </div>
        </section>
      </main>

      {/* Luxury Minimal Footer */}
      <footer className="mt-auto border-t border-amber-500/10 py-6 text-center text-xs text-slate-400 bg-[#070b14]/90">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-serif-luxury tracking-wide text-slate-300">Expense Ledger • Executive Wealth Management</span>
          <span className="text-amber-500/60 font-mono text-[11px]">Refined Wealth Edition</span>
        </div>
      </footer>
    </div>
  );
}
