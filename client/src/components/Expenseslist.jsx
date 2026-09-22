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

// Curated luxury color badges for categories
const CATEGORY_MAP = {
  food: {
    label: "Food & Dining",
    icon: Utensils,
    badge: "bg-amber-500/10 text-amber-300 border-amber-500/30"
  },
  travel: {
    label: "Travel & Transit",
    icon: Plane,
    badge: "bg-blue-500/10 text-blue-300 border-blue-500/30"
  },
  shopping: {
    label: "Retail & Goods",
    icon: ShoppingBag,
    badge: "bg-rose-500/10 text-rose-300 border-rose-500/30"
  },
  bills: {
    label: "Bills & Obligations",
    icon: FileText,
    badge: "bg-purple-500/10 text-purple-300 border-purple-500/30"
  },
  other: {
    label: "General Outflows",
    icon: Package,
    badge: "bg-slate-500/10 text-slate-300 border-slate-500/30"
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
    <div className="h-full flex flex-col justify-between backdrop-blur-xl bg-[#0e1626]/80 border border-amber-500/20 rounded-3xl p-6 shadow-xl shadow-black/40 relative overflow-hidden">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-amber-100 font-serif-luxury tracking-wide">Transaction Ledger</h3>
              <p className="text-xs text-slate-400">
                {expenses.length} {expenses.length === 1 ? "entry" : "entries"} recorded in current period
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search ledger..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#080d16]/90 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400/60"
            />
          </div>
        </div>

        {/* Category Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
          {["all", "food", "travel", "shopping", "bills", "other"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize shrink-0 transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-slate-950 font-bold shadow-sm"
                  : "bg-[#080d16]/80 text-slate-400 hover:text-amber-200 border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Transaction Rows */}
        {filteredExpenses.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#080d16] flex items-center justify-center text-amber-400/50 mb-3 border border-slate-800">
              <Receipt className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-300 font-serif-luxury">No ledger entries recorded</p>
            <p className="text-xs text-slate-500 mt-1">
              {expenses.length === 0
                ? "Enter your first outflow above to populate the ledger."
                : "No entries match your search criteria."}
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
                  className="group flex items-center justify-between p-3.5 rounded-2xl bg-[#080d16]/85 hover:bg-[#0c1322] border border-slate-800/80 hover:border-amber-500/30 transition-all duration-200"
                >
                  {/* Left: Icon & Description */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2.5 rounded-xl border ${catConfig.badge} shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-100 truncate group-hover:text-amber-200 transition-colors">
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
                      <div className="text-sm font-bold text-amber-200 font-serif-luxury">
                        ₹{Number(e.amount).toLocaleString("en-IN")}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDelete(e._id)}
                      title="Remove record"
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
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
          <span>Subtotal Filtered</span>
          <span className="text-sm font-bold text-amber-300 font-serif-luxury">
            ₹{filteredExpenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0).toLocaleString("en-IN")}
          </span>
        </div>
      )}
    </div>
  );
}