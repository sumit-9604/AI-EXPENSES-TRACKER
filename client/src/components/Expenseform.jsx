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
        <div className="mb-5 p-4 rounded-2xl bg-white border-2 border-[#DCCFC0] shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#A1BC98]/20 text-[#778873] border border-[#A1BC98]">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-[#2B382A]">Enter Monthly Salary</h4>
                <p className="text-xs sm:text-sm font-medium text-[#778873]">Enables automated budget limit calculations and spending alerts</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-48">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#778873] font-bold text-sm">₹</span>
                <input
                  type="number"
                  placeholder="Monthly Salary"
                  value={salaryInput}
                  onChange={(e) => setSalaryInput(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-[#FDF6ED] border-2 border-[#DCCFC0] focus:border-[#778873] rounded-xl text-[#2B382A] placeholder-[#778873]/50 font-bold text-sm focus:outline-none"
                  min="0"
                />
              </div>
              <button
                type="button"
                onClick={handleSalarySave}
                className="px-5 py-2 bg-gradient-to-r from-[#778873] to-[#A1BC98] hover:from-[#657561] hover:to-[#8ea986] text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer"
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
              placeholder="Expense title (e.g. Grocery, Flight, Rent)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white border-2 border-[#DCCFC0] focus:border-[#778873] focus:ring-2 focus:ring-[#A1BC98]/40 rounded-xl text-[#2B382A] placeholder-[#778873]/50 text-sm font-bold transition-all shadow-sm focus:outline-none"
            />
          </div>

          {/* Amount Input */}
          <div className="lg:col-span-3 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#778873] font-bold">
              <IndianRupee className="w-4 h-4" />
            </div>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-[#DCCFC0] focus:border-[#778873] focus:ring-2 focus:ring-[#A1BC98]/40 rounded-xl text-[#2B382A] placeholder-[#778873]/50 text-sm font-bold transition-all shadow-sm focus:outline-none"
            />
          </div>

          {/* Category Select */}
          <div className="lg:col-span-3 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#778873]">
              <Tag className="w-4 h-4" />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-10 pr-8 py-3 bg-white border-2 border-[#DCCFC0] focus:border-[#778873] focus:ring-2 focus:ring-[#A1BC98]/40 rounded-xl text-[#2B382A] text-sm font-bold transition-all capitalize appearance-none cursor-pointer focus:outline-none"
            >
              <option value="food" className="text-[#2B382A]">🍽️ Food</option>
              <option value="travel" className="text-[#2B382A]">✈️ Travel</option>
              <option value="shopping" className="text-[#2B382A]">🛍️ Shopping</option>
              <option value="bills" className="text-[#2B382A]">🧾 Bills</option>
              <option value="other" className="text-[#2B382A]">📦 Other</option>
            </select>
          </div>

          {/* Primary Action Button */}
          <div className="sm:col-span-2 lg:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#778873] to-[#A1BC98] hover:from-[#657561] hover:to-[#8ea986] text-white font-black text-sm sm:text-base rounded-xl shadow-md shadow-[#778873]/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
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
