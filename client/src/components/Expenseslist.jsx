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

// Apple-style soft pastel category badges
const CATEGORY_MAP = {
  food: {
    label: "Food & Dining",
    icon: Utensils,
    badge: "bg-orange-500/10 text-orange-300 border-orange-500/20"
  },
  travel: {
    label: "Travel & Transit",
    icon: Plane,
    badge: "bg-sky-500/10 text-sky-300 border-sky-500/20"
  },
  shopping: {
    label: "Shopping",
    icon: ShoppingBag,
    badge: "bg-purple-500/10 text-purple-300 border-purple-500/20"
  },
  bills: {
    label: "Bills & Utilities",
    icon: FileText,
    badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
  },
  other: {
    label: "Other",
    icon: Package,
    badge: "bg-zinc-500/10 text-zinc-300 border-zinc-500/20"
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
    <div className="h-full flex flex-col justify-between backdrop-blur-2xl bg-zinc-900/50 border border-white/[0.08] rounded-2xl p-6 shadow-xl shadow-black/20">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">Recent Outflows</h3>
            <p className="text-xs text-zinc-400">
              {expenses.length} {expenses.length === 1 ? "transaction" : "transactions"} logged
            </p>
          </div>

          {/* Search Box */}
          <div className="relative sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-zinc-950/80 border border-white/[0.08] rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-white/30"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
          {["all", "food", "travel", "shopping", "bills", "other"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize shrink-0 transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-white text-zinc-950 font-semibold shadow-sm"
                  : "bg-zinc-950/60 text-zinc-400 hover:text-white border border-white/[0.06]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Transaction Rows */}
        {filteredExpenses.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500 mb-2.5 border border-white/[0.06]">
              <Receipt className="w-5 h-5" />
            </div>
            <p className="text-xs font-medium text-zinc-300">No transactions recorded</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              {expenses.length === 0
                ? "Add an expense above to start tracking."
                : "No items match your search filter."}
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {filteredExpenses.map((e) => {
              const catConfig = CATEGORY_MAP[e.category] || CATEGORY_MAP.other;
              const Icon = catConfig.icon;
              const dateObj = new Date(e.createdAt);
              const formattedDate = dateObj.toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric"
              });
              const formattedTime = dateObj.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit"
              });

              return (
                <div
                  key={e._id}
                  className="group flex items-center justify-between p-3.5 rounded-xl bg-zinc-950/60 hover:bg-zinc-950 border border-white/[0.06] hover:border-white/[0.12] transition-all"
                >
                  {/* Left: Icon & Description */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg border ${catConfig.badge} shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-zinc-100 truncate">
                          {e.title}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border uppercase tracking-wider ${catConfig.badge}`}>
                          {e.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-0.5">
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
                      <div className="text-sm font-semibold text-white">
                        ₹{Number(e.amount).toLocaleString("en-IN")}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDelete(e._id)}
                      title="Delete expense"
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
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
        <div className="pt-3.5 mt-3.5 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
          <span>Total Filtered</span>
          <span className="text-sm font-semibold text-white">
            ₹{filteredExpenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0).toLocaleString("en-IN")}
          </span>
        </div>
      )}
    </div>
  );
}