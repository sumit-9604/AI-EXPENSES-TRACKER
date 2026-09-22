import { useState } from "react";
import { 
  Trash2, 
  Receipt, 
  Search, 
  ShoppingBag, 
  Utensils, 
  Plane, 
  FileText, 
  Package, 
  Calendar
} from "lucide-react";

// Category configurations with distinct styling and icons
const CATEGORY_MAP = {
  food: {
    label: "Food & Dining",
    icon: Utensils,
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20"
  },
  travel: {
    label: "Travel & Commute",
    icon: Plane,
    badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
  },
  shopping: {
    label: "Shopping",
    icon: ShoppingBag,
    badge: "bg-pink-500/10 text-pink-400 border-pink-500/20"
  },
  bills: {
    label: "Bills & Utilities",
    icon: FileText,
    badge: "bg-purple-500/10 text-purple-400 border-purple-500/20"
  },
  other: {
    label: "Other",
    icon: Package,
    badge: "bg-slate-500/10 text-slate-300 border-slate-500/20"
  }
};

export default function Expenseslist({ expenses = [], onDelete }) {
  const [filterQuery, setFilterQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredExpenses = expenses.filter((item) => {
    const matchesQuery = item.title?.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesCat = selectedCategory === "all" || item.category === selectedCategory;
    return matchesQuery && matchesCat;
  });

  return (
    <div className="h-full flex flex-col justify-between backdrop-blur-xl bg-slate-900/70 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Recent Transactions</h3>
              <p className="text-xs text-slate-400">
                {expenses.length} {expenses.length === 1 ? "expense" : "expenses"} recorded
              </p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="relative sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
          {["all", "food", "travel", "shopping", "bills", "other"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize shrink-0 transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-cyan-500 text-slate-950 font-semibold shadow-sm"
                  : "bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Expenses List */}
        {filteredExpenses.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/50 flex items-center justify-center text-slate-500 mb-3">
              <Receipt className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-300">No transactions found</p>
            <p className="text-xs text-slate-500 mt-1">
              {expenses.length === 0
                ? "Add your first expense above to start tracking!"
                : "No expenses match the current filter."}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {filteredExpenses.map((e) => {
              const catConfig = CATEGORY_MAP[e.category] || CATEGORY_MAP.other;
              const Icon = catConfig.icon;
              const dateObj = new Date(e.createdAt);
              const formattedDate = dateObj.toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
                year: "numeric"
              });
              const formattedTime = dateObj.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit"
              });

              return (
                <div
                  key={e._id}
                  className="group flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 hover:bg-slate-950/90 border border-slate-800/80 hover:border-slate-700 transition-all duration-200"
                >
                  {/* Left: Icon & Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2.5 rounded-xl border ${catConfig.badge} shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white truncate group-hover:text-cyan-300 transition-colors">
                          {e.title}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border uppercase tracking-wider ${catConfig.badge}`}>
                          {e.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formattedDate} • {formattedTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount & Delete */}
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <div className="text-right">
                      <div className="text-sm font-bold text-white">
                        ₹{Number(e.amount).toLocaleString("en-IN")}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDelete(e._id)}
                      title="Delete expense"
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Total */}
      {filteredExpenses.length > 0 && (
        <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <span>Filtered Total</span>
          <span className="text-sm font-bold text-cyan-400">
            ₹{filteredExpenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0).toLocaleString("en-IN")}
          </span>
        </div>
      )}
    </div>
  );
}