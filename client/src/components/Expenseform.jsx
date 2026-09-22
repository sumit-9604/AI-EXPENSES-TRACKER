import { useState, useEffect } from "react";
import API from "../api";
import { PlusCircle, Wallet, Check, Tag, IndianRupee } from "lucide-react";

export default function ExpenseForm({
  onAdd,
  salary,
  setSalary,
  showSalaryInput,
  onSalarySave
}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");
  const [salaryInput, setSalaryInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [salarySavedAlert, setSalarySavedAlert] = useState(false);

  useEffect(() => {
    const savedSalary = localStorage.getItem("salary");
    if (savedSalary) {
      setSalary(Number(savedSalary));
    }
  }, [setSalary]);

  const handleSalarySave = async () => {
    const value = Number(salaryInput);
    if (value <= 0) return;

    try {
      await API.post("/auth/salary", { salary: value });
      setSalary(value);
      localStorage.setItem("salary", value);
      setSalaryInput("");
      if (onSalarySave) onSalarySave(value);
      setSalarySavedAlert(true);
      setTimeout(() => setSalarySavedAlert(false), 3000);
    } catch (err) {
      console.error("Salary save error:", err);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !amount || Number(amount) <= 0) return;

    setIsSubmitting(true);
    try {
      const res = await API.post("/expenses", {
        title: title.trim(),
        amount: Number(amount),
        category
      });

      onAdd(res.data);
      setTitle("");
      setAmount("");
      setCategory("food");
    } catch (err) {
      console.error("Add error:", err.response?.data || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Monthly Salary Input (Prompted when not yet configured or requested) */}
      {showSalaryInput && (
        <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-slate-900 border border-cyan-500/30 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Set Monthly Budget / Salary</h4>
                <p className="text-xs text-slate-400">Enables real-time AI budget forecasting and burn-rate analysis</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-44">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">₹</span>
                <input
                  type="number"
                  placeholder="Monthly Salary"
                  value={salaryInput}
                  onChange={(e) => setSalaryInput(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  min="0"
                />
              </div>
              <button
                type="button"
                onClick={handleSalarySave}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                {salarySavedAlert ? <Check className="w-4 h-4" /> : null}
                <span>{salarySavedAlert ? "Saved!" : "Save"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Add Expense Form */}
      <form onSubmit={submit} className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Title Input */}
          <div className="lg:col-span-4">
            <input
              type="text"
              placeholder="Expense title (e.g. Grocery, Flight, Rent)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            />
          </div>

          {/* Amount Input */}
          <div className="lg:col-span-3 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <IndianRupee className="w-4 h-4" />
            </div>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-950/70 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            />
          </div>

          {/* Category Select */}
          <div className="lg:col-span-3 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Tag className="w-4 h-4" />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-slate-950/70 border border-slate-700/60 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all capitalize appearance-none cursor-pointer"
            >
              <option value="food" className="bg-slate-900 text-slate-100">🍽️ Food</option>
              <option value="travel" className="bg-slate-900 text-slate-100">✈️ Travel</option>
              <option value="shopping" className="bg-slate-900 text-slate-100">🛍️ Shopping</option>
              <option value="bills" className="bg-slate-900 text-slate-100">🧾 Bills & Utilities</option>
              <option value="other" className="bg-slate-900 text-slate-100">📦 Other</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="sm:col-span-2 lg:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isSubmitting ? "Adding..." : "Add Expense"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
