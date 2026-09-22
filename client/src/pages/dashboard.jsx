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
    <div 
      className="min-h-screen text-white flex flex-col relative overflow-x-hidden bg-cover bg-fixed bg-center"
      style={{ backgroundImage: `url("${dashboardBg}")` }}
    >
      {/* Translucent overlay maintaining dashboard background visibility */}
      <div className="absolute inset-0 bg-[#092328]/35 backdrop-blur-[1px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#092328]/95 border-b-2 border-[#2A835F] shadow-xl shadow-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Titles */}
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-wide text-[#8BBB92] uppercase">
              Dashboard • My Expenses
            </h1>
            <p className="text-xs sm:text-sm font-bold text-[#E2F1E4]">
              Intelligent Capital Forecasting & Expense Tracking
            </p>
          </div>

          {/* Right actions: Salary Badge & Logout */}
          <div className="flex items-center gap-3">
            {salary > 0 && (
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#051518] border-2 border-[#12544F] text-xs shadow-md">
                <Wallet className="w-4 h-4 text-[#8BBB92]" />
                <span className="font-bold text-[#8BBB92]">Budget:</span>
                <span className="font-black text-white text-sm">₹{salary.toLocaleString("en-IN")}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-black shadow-lg shadow-rose-950/50 transition-all cursor-pointer"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 z-10">
        {/* Quick Add Expense Card */}
        <section className="backdrop-blur-xl bg-[#092328]/90 border-2 border-[#2A835F] rounded-3xl p-6 shadow-[0_8px_32px_rgba(42,131,95,0.25)]">
          <div className="flex items-center gap-2 mb-4">
            <PlusCircle className="w-5 h-5 text-[#8BBB92]" />
            <h2 className="text-base font-black text-[#8BBB92] uppercase tracking-wider">Add New Expense</h2>
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
              <BarChart2 className="w-5 h-5 text-[#8BBB92]" />
              <h2 className="text-lg sm:text-xl font-black text-[#8BBB92] tracking-wide">
                Analytics & Charts
              </h2>
            </div>
            <span className="text-xs font-bold text-[#E2F1E4]">Category Breakdown, Trajectory & Distribution</span>
          </div>

          <ExpenseChart expenses={expenses} />
        </section>

        {/* Prediction Card & Recent Transactions in Responsive Grid */}
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

      {/* Footer */}
      <footer className="mt-auto backdrop-blur-xl bg-[#092328]/95 border-t-2 border-[#2A835F] py-5 text-center text-xs text-[#8BBB92] font-bold">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AI Expense Tracker • Real-Time Financial Intelligence</span>
          <span className="text-[#8BBB92]/80">Teal & Forest Edition</span>
        </div>
      </footer>
    </div>
  );
}
