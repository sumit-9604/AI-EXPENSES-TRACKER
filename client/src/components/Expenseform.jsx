import { useState, useEffect } from "react";
import API from "../api";
import { Plus, Wallet, Check, Tag, IndianRupee } from "lucide-react";

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
      {/* Monthly Budget Setup Prompt */}
      {showSalaryInput && (
        <div className="mb-4 p-4 rounded-xl bg-zinc-950/80 border border-white/[0.08]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-zinc-800 text-zinc-300">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-medium text-white">Set Monthly Budget</h4>
                <p className="text-xs text-zinc-400">Establish a target budget to track your monthly spending</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-44">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">₹</span>
                <input
                  type="number"
                  placeholder="Monthly Budget"
                  value={salaryInput}
                  onChange={(e) => setSalaryInput(e.target.value)}
                  className="w-full pl-7 pr-3 py-1.5 bg-zinc-900 border border-white/[0.08] rounded-lg text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white/30"
                  min="0"
                />
              </div>
              <button
                type="button"
                onClick={handleSalarySave}
                className="px-3.5 py-1.5 bg-white hover:bg-zinc-200 text-zinc-950 font-medium text-xs rounded-lg transition-all flex items-center gap-1 shrink-0 cursor-pointer"
              >
                {salarySavedAlert ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{salarySavedAlert ? "Saved" : "Save"}</span>
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
              placeholder="Expense title (e.g. Grocery, Flight)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-zinc-950/70 border border-white/[0.08] rounded-xl text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
            />
          </div>

          {/* Amount Input */}
          <div className="lg:col-span-3 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <IndianRupee className="w-4 h-4" />
            </div>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
              className="w-full pl-9 pr-3.5 py-2.5 bg-zinc-950/70 border border-white/[0.08] rounded-xl text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
            />
          </div>

          {/* Category Select */}
          <div className="lg:col-span-3 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <Tag className="w-4 h-4" />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-zinc-950/70 border border-white/[0.08] rounded-xl text-zinc-100 text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all capitalize appearance-none cursor-pointer"
            >
              <option value="food" className="bg-zinc-900 text-zinc-100">🍽️ Food & Dining</option>
              <option value="travel" className="bg-zinc-900 text-zinc-100">✈️ Travel & Transit</option>
              <option value="shopping" className="bg-zinc-900 text-zinc-100">🛍️ Shopping</option>
              <option value="bills" className="bg-zinc-900 text-zinc-100">🧾 Bills & Utilities</option>
              <option value="other" className="bg-zinc-900 text-zinc-100">📦 Other</option>
            </select>
          </div>

          {/* Primary Apple-style White Button */}
          <div className="sm:col-span-2 lg:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-sm rounded-xl transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? "Adding..." : "Add"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
