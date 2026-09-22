import { useEffect, useState } from "react";
import API from "../api";
import ExpenseChart from "../components/Expensescharts";
import PredictionCard from "../components/PredictionCard";
import ExpenseForm from "../components/Expenseform";
import Expenseslist from "../components/Expenseslist";
import { 
  LogOut, 
  Wallet, 
  Plus, 
  BarChart3,
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

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col selection:bg-white/20 selection:text-white">
      {/* Apple Minimalist Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-[#09090b]/80 border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/[0.1] flex items-center justify-center text-white shadow-sm">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight text-white">
                Expenses
              </h1>
              <p className="hidden sm:block text-[11px] text-zinc-400">Financial Summary & Outflows</p>
            </div>
          </div>

          {/* Actions: Budget Chip & Logout */}
          <div className="flex items-center gap-2.5">
            {salary > 0 && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-xs">
                <Wallet className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-zinc-400">Monthly Budget:</span>
                <span className="font-semibold text-white">₹{salary.toLocaleString("en-IN")}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/[0.08] text-zinc-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-zinc-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Quick Add Expense Card */}
        <section className="backdrop-blur-2xl bg-zinc-900/50 border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-xl shadow-black/20">
          <div className="flex items-center gap-2 mb-3.5">
            <Plus className="w-4 h-4 text-zinc-400" />
            <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">New Transaction</h2>
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
        <section className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-zinc-400" />
              <h2 className="text-sm font-semibold text-white tracking-tight">Spending Trends & Analytics</h2>
            </div>
            <span className="text-xs text-zinc-500">Category breakdown and trajectory</span>
          </div>

          <ExpenseChart expenses={expenses} />
        </section>

        {/* Summary Card & Recent Transactions Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Monthly Budget & Prediction Card */}
          <div className="lg:col-span-5">
            <PredictionCard
              prediction={prediction}
              total={total}
              salary={salary}
              onUpdateSalary={handleSalarySave}
            />
          </div>

          {/* Recent Outflows Ledger */}
          <div className="lg:col-span-7">
            <Expenseslist
              expenses={expenses}
              onDelete={deleteExpense}
            />
          </div>
        </section>
      </main>

      {/* Minimalist Footer */}
      <footer className="mt-auto border-t border-white/[0.06] py-5 text-center text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Expenses • Minimalist Financial Tracker</span>
          <span className="text-zinc-600">Clean & Private</span>
        </div>
      </footer>
    </div>
  );
}
