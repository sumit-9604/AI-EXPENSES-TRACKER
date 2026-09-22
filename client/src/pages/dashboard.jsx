import { useEffect, useState } from "react";
import API from "../api";
import ExpenseChart from "../components/Expensescharts";
import PredictionCard from "../components/PredictionCard";
import ExpenseForm from "../components/Expenseform";
import Expenseslist from "../components/Expenseslist";
import { 
  LogOut, 
  Wallet, 
  PlusCircle, 
  BarChart2,
  TrendingDown,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CreditCard
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

  const remaining = salary > 0 ? salary - total : 0;
  const budgetRatio = salary > 0 ? Math.min(Math.round((total / salary) * 100), 100) : 0;

  return (
    <div className="min-h-screen text-[#2B382A] flex flex-col bg-[#FDF6ED]">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/85 border-b border-[#DCCFC0] shadow-[0_4px_20px_-4px_rgba(119,136,115,0.12)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Titles */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#778873] to-[#586854] flex items-center justify-center text-white shadow-md shadow-[#778873]/30">
              <CreditCard className="w-5 h-5 text-[#FDF6ED]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-[#2B382A] uppercase">
                  AI Expense Tracker
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#A1BC98]/25 text-[#586854] border border-[#A1BC98]/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Live Sync
                </span>
              </div>
              <p className="text-xs font-semibold text-[#778873]">
                Smart Financial Ledger & Predictive Budgeting
              </p>
            </div>
          </div>

          {/* Right actions: Salary Badge & Logout */}
          <div className="flex items-center gap-3">
            {salary > 0 && (
              <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#FDF6ED] border border-[#DCCFC0] text-xs shadow-inner">
                <Wallet className="w-4 h-4 text-[#778873]" />
                <span className="font-semibold text-[#778873]">Budget:</span>
                <span className="font-black text-[#2B382A] text-sm">₹{salary.toLocaleString("en-IN")}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#778873] to-[#60715C] hover:from-[#657561] hover:to-[#505F4D] text-white text-xs font-bold shadow-md shadow-[#778873]/25 active:scale-95 transition-all cursor-pointer"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* KPI Stat Cards Ribbon */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Total Outflow */}
          <div className="p-5 rounded-2xl bg-white border border-[#DCCFC0] shadow-[0_4px_20px_-4px_rgba(119,136,115,0.08)] hover:shadow-[0_8px_25px_-4px_rgba(119,136,115,0.15)] transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#778873]">Total Spent</span>
              <div className="p-2 rounded-xl bg-[#A1BC98]/20 text-[#586854] border border-[#A1BC98]/40">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#2B382A] tracking-tight">
              ₹{total.toLocaleString("en-IN")}
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-[#778873] mt-2 pt-2 border-t border-[#DCCFC0]/40">
              <span>{expenses.length} transactions</span>
              <span className="text-[#586854] flex items-center font-extrabold">Active</span>
            </div>
          </div>

          {/* 2. Monthly Budget */}
          <div className="p-5 rounded-2xl bg-white border border-[#DCCFC0] shadow-[0_4px_20px_-4px_rgba(119,136,115,0.08)] hover:shadow-[0_8px_25px_-4px_rgba(119,136,115,0.15)] transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#778873]">Monthly Budget</span>
              <div className="p-2 rounded-xl bg-[#DCCFC0]/40 text-[#778873] border border-[#DCCFC0]">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#2B382A] tracking-tight">
              {salary > 0 ? `₹${salary.toLocaleString("en-IN")}` : "Not Set"}
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-[#778873] mt-2 pt-2 border-t border-[#DCCFC0]/40">
              <span>Limit Cap</span>
              <span className="text-[#586854] font-extrabold">{salary > 0 ? "Target set" : "Prompt below"}</span>
            </div>
          </div>

          {/* 3. AI Month-End Forecast */}
          <div className="p-5 rounded-2xl bg-white border border-[#DCCFC0] shadow-[0_4px_20px_-4px_rgba(119,136,115,0.08)] hover:shadow-[0_8px_25px_-4px_rgba(119,136,115,0.15)] transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#778873]">AI Forecast</span>
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#A1BC98]/30 to-[#778873]/20 text-[#586854] border border-[#A1BC98]">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#586854] tracking-tight">
              ₹{prediction.toLocaleString("en-IN")}
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-[#778873] mt-2 pt-2 border-t border-[#DCCFC0]/40">
              <span>Projected EOM</span>
              <span className="text-emerald-700 font-extrabold flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" /> Predictive
              </span>
            </div>
          </div>

          {/* 4. Budget Balance */}
          <div className="p-5 rounded-2xl bg-white border border-[#DCCFC0] shadow-[0_4px_20px_-4px_rgba(119,136,115,0.08)] hover:shadow-[0_8px_25px_-4px_rgba(119,136,115,0.15)] transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#778873]">Remaining Balance</span>
              <div className="p-2 rounded-xl bg-[#A1BC98]/20 text-[#586854] border border-[#A1BC98]/40">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#2B382A] tracking-tight">
              {salary > 0 ? (
                <span className={remaining < 0 ? "text-rose-600" : "text-[#2B382A]"}>
                  {remaining < 0 ? "-" : ""}₹{Math.abs(remaining).toLocaleString("en-IN")}
                </span>
              ) : "—"}
            </div>
            <div className="mt-2 pt-2 border-t border-[#DCCFC0]/40">
              <div className="w-full h-1.5 bg-[#DCCFC0]/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${remaining < 0 ? 'bg-rose-500' : 'bg-[#778873]'}`}
                  style={{ width: `${budgetRatio}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Add Expense Card */}
        <section className="bg-white rounded-3xl p-6 sm:p-7 border border-[#DCCFC0] shadow-[0_10px_30px_-5px_rgba(119,136,115,0.1),0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#A1BC98]/25 text-[#586854] border border-[#A1BC98]">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-[#2B382A] uppercase tracking-wide">
                  Record New Transaction
                </h2>
                <p className="text-xs font-semibold text-[#778873]">
                  Instantly log expenses to update your budget trajectory
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#FDF6ED] text-[#778873] border border-[#DCCFC0]">
              Quick Entry
            </span>
          </div>

          <ExpenseForm
            onAdd={handleAddExpense}
            salary={salary}
            setSalary={setSalary}
            onSalarySave={handleSalarySave}
            showSalaryInput={salary === 0}
          />
        </section>

        {/* Visual Analytics & Charts Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#A1BC98]/25 text-[#586854] border border-[#A1BC98]">
                <BarChart2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-[#2B382A] tracking-tight">
                  Visual Analytics & Outflow Breakdown
                </h2>
                <p className="text-xs font-semibold text-[#778873]">
                  Interactive charts across categories, chronological trends, and distributions
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block text-xs font-extrabold text-[#778873] bg-white px-3 py-1.5 rounded-xl border border-[#DCCFC0] shadow-sm">
              4 Visualizers Active
            </span>
          </div>

          <ExpenseChart expenses={expenses} />
        </section>

        {/* Prediction Card & Recent Transactions Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Prediction & Budget Status (5 cols) */}
          <div className="lg:col-span-5">
            <PredictionCard
              prediction={prediction}
              total={total}
              salary={salary}
              onUpdateSalary={handleSalarySave}
            />
          </div>

          {/* Transactions List (7 cols) */}
          <div className="lg:col-span-7">
            <Expenseslist
              expenses={expenses}
              onDelete={deleteExpense}
            />
          </div>
        </section>
      </main>

      {/* Light Warm Footer */}
      <footer className="mt-auto bg-white/80 backdrop-blur-md border-t border-[#DCCFC0] py-6 text-center text-xs text-[#778873] font-bold">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#778873]" />
            <span>AI Expense Tracker • Built for clarity, speed, and precision</span>
          </div>
          <span className="text-[#586854] font-medium bg-[#FDF6ED] px-3 py-1 rounded-full border border-[#DCCFC0]">
            Warm Sage Edition • High Contrast Design
          </span>
        </div>
      </footer>
    </div>
  );
}
