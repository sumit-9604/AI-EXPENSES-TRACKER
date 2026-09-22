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
      {/* Monthly Capital Allocation Prompt */}
      {showSalaryInput && (
        <div className="mb-4 p-4 rounded-2xl bg-[#090f1b]/80 border border-amber-500/30 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-amber-100 font-serif-luxury">Establish Monthly Capital Baseline</h4>
                <p className="text-xs text-slate-400">Sets your monthly budget benchmark for real-time burn-rate monitoring</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-44">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400/80 text-xs font-semibold">₹</span>
                <input
                  type="number"
                  placeholder="Monthly Budget"
                  value={salaryInput}
                  onChange={(e) => setSalaryInput(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 bg-[#060a12] border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                  min="0"
                />
              </div>
              <button
                type="button"
                onClick={handleSalarySave}
                className="px-4 py-2 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] text-slate-950 font-bold text-xs sm:text-sm rounded-xl hover:brightness-110 transition-all shadow-md shadow-amber-950/40 flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                {salarySavedAlert ? <Check className="w-4 h-4" /> : null}
                <span>{salarySavedAlert ? "Recorded!" : "Save"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Add Outflow Form */}
      <form onSubmit={submit} className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Title Input */}
          <div className="lg:col-span-4">
            <input
              type="text"
              placeholder="Description (e.g. Investment, Flight, Rent)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-[#080d16]/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/80 transition-all"
            />
          </div>

          {/* Amount Input */}
          <div className="lg:col-span-3 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-400/70">
              <IndianRupee className="w-4 h-4" />
            </div>
            <input
              type="number"
              placeholder="Amount (INR)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
              className="w-full pl-9 pr-4 py-2.5 bg-[#080d16]/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/80 transition-all"
            />
          </div>

          {/* Category Select */}
          <div className="lg:col-span-3 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-400/70">
              <Tag className="w-4 h-4" />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-[#080d16]/80 border border-slate-700/80 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/80 transition-all capitalize appearance-none cursor-pointer"
            >
              <option value="food" className="bg-[#0b111d] text-slate-100">🍽️ Food & Dining</option>
              <option value="travel" className="bg-[#0b111d] text-slate-100">✈️ Travel & Commute</option>
              <option value="shopping" className="bg-[#0b111d] text-slate-100">🛍️ Retail & Shopping</option>
              <option value="bills" className="bg-[#0b111d] text-slate-100">🧾 Bills & Utilities</option>
              <option value="other" className="bg-[#0b111d] text-slate-100">📦 Other Outflows</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="sm:col-span-2 lg:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-[#d4af37] via-[#f7e7a9] to-[#d4af37] hover:brightness-110 text-slate-950 font-bold text-sm rounded-xl shadow-md shadow-amber-950/40 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isSubmitting ? "Recording..." : "Record Outflow"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
