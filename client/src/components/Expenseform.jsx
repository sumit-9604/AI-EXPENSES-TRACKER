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
      {/* Monthly Salary Input Prompt */}
      {showSalaryInput && (
        <div className="mb-5 p-4 rounded-2xl bg-[#051518] border-2 border-[#12544F] shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#2A835F]/20 text-[#8BBB92] border border-[#2A835F]">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-white">Enter Monthly Salary</h4>
                <p className="text-xs sm:text-sm font-semibold text-[#8BBB92]">Activates automated budget forecasting and outflow limit alerts</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-48">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8BBB92] font-bold text-sm">₹</span>
                <input
                  type="number"
                  placeholder="Monthly Salary"
                  value={salaryInput}
                  onChange={(e) => setSalaryInput(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-[#092328] border-2 border-[#12544F] focus:border-[#8BBB92] rounded-xl text-white placeholder-[#8BBB92]/50 font-bold text-sm focus:outline-none"
                  min="0"
                />
              </div>
              <button
                type="button"
                onClick={handleSalarySave}
                className="px-5 py-2 bg-gradient-to-r from-[#2A835F] to-[#8BBB92] hover:brightness-105 text-[#092328] font-black text-sm rounded-xl transition-all shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                {salarySavedAlert ? <Check className="w-4 h-4" /> : null}
                <span>{salarySavedAlert ? "Saved!" : "Save Salary"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Add Expense Form */}
      <form onSubmit={submit} className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-center">
          {/* Title Input */}
          <div className="lg:col-span-4">
            <input
              type="text"
              placeholder="Expense description (e.g. Grocery, Flight, Rent)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#051518] border-2 border-[#12544F] focus:border-[#8BBB92] focus:ring-2 focus:ring-[#8BBB92]/30 rounded-xl text-white placeholder-[#8BBB92]/50 text-sm font-bold transition-all shadow-inner"
            />
          </div>

          {/* Amount Input */}
          <div className="lg:col-span-3 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8BBB92] font-bold">
              <IndianRupee className="w-4 h-4" />
            </div>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
              className="w-full pl-10 pr-4 py-3 bg-[#051518] border-2 border-[#12544F] focus:border-[#8BBB92] focus:ring-2 focus:ring-[#8BBB92]/30 rounded-xl text-white placeholder-[#8BBB92]/50 text-sm font-bold transition-all shadow-inner"
            />
          </div>

          {/* Category Select */}
          <div className="lg:col-span-3 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8BBB92]">
              <Tag className="w-4 h-4" />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-10 pr-8 py-3 bg-[#051518] border-2 border-[#12544F] focus:border-[#8BBB92] focus:ring-2 focus:ring-[#8BBB92]/30 rounded-xl text-white text-sm font-bold transition-all capitalize appearance-none cursor-pointer"
            >
              <option value="food" className="bg-[#092328] text-white font-bold">🍽️ Food</option>
              <option value="travel" className="bg-[#092328] text-white font-bold">✈️ Travel</option>
              <option value="shopping" className="bg-[#092328] text-white font-bold">🛍️ Shopping</option>
              <option value="bills" className="bg-[#092328] text-white font-bold">🧾 Bills</option>
              <option value="other" className="bg-[#092328] text-white font-bold">📦 Other</option>
            </select>
          </div>

          {/* Action Button */}
          <div className="sm:col-span-2 lg:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#2A835F] to-[#8BBB92] hover:brightness-105 text-[#092328] font-black text-sm sm:text-base rounded-xl shadow-[0_0_15px_rgba(42,131,95,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <PlusCircle className="w-5 h-5" />
              <span>{isSubmitting ? "ADDING..." : "ADD"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
