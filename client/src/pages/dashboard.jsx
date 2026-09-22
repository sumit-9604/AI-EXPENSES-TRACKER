import { useEffect, useState } from "react";
import API from "../api";
import ExpenseChart from "../components/Expensescharts";
import PredictionCard from "../components/PredictionCard";
import ExpenseForm from "../components/Expenseform";
import Expenseslist from "../components/Expenseslist";
import { 
  Sparkles, 
  LogOut, 
  Wallet, 
  PlusCircle, 
  Layers, 
  BarChart2
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Ambient glowing backdrop lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-violet-500 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight text-white">
                  Expense<span className="text-cyan-400">AI</span>
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-semibold uppercase tracking-wider">
                  Pro
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-400">Intelligent Budget & Expense Forecast</p>
            </div>
          </div>

          {/* Right actions: Salary Badge & Logout */}
          <div className="flex items-center gap-3">
            {salary > 0 && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <Wallet className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-400">Budget:</span>
                <span className="font-bold text-white">₹{salary.toLocaleString("en-IN")}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm"
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
        {/* Quick Add Expense Card */}
        <section className="backdrop-blur-xl bg-slate-900/70 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <PlusCircle className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Quick Add Transaction</h2>
          </div>

          <ExpenseForm
            onAdd={handleAddExpense}
            salary={salary}
            setSalary={setSalary}
            onSalarySave={handleSalarySave}
            showSalaryInput={salary === 0}
          />
        </section>

        {/* Middle Section: AI Copilot & Recent Transactions in Responsive Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* AI Prediction & Budget Analysis Card (5 cols on large screens) */}
          <div className="lg:col-span-5">
            <PredictionCard
              prediction={prediction}
              total={total}
              salary={salary}
              onUpdateSalary={handleSalarySave}
            />
          </div>

          {/* Recent Transactions List (7 cols on large screens) */}
          <div className="lg:col-span-7">
            <Expenseslist
              expenses={expenses}
              onDelete={deleteExpense}
            />
          </div>
        </section>

        {/* Bottom Section: Visual Analytics & Charts */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <BarChart2 className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">Spending Trends & Visual Insights</h2>
            </div>
            <span className="text-xs text-slate-400">Automated multi-metric analytics</span>
          </div>

          <ExpenseChart expenses={expenses} />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AI Expense Tracker • Intelligent Financial Management</span>
          <span className="text-slate-600">Tailwind CSS v4 & React</span>
        </div>
      </footer>
    </div>
  );
}
