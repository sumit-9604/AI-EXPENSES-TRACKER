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

const CATEGORY_MAP = {
  food: {
    label: "Food",
    icon: Utensils,
    badge: "bg-[#2A835F]/20 text-[#8BBB92] border-2 border-[#2A835F]"
  },
  travel: {
    label: "Travel",
    icon: Plane,
    badge: "bg-[#12544F]/40 text-[#8BBB92] border-2 border-[#12544F]"
  },
  shopping: {
    label: "Shopping",
    icon: ShoppingBag,
    badge: "bg-[#8BBB92]/20 text-[#8BBB92] border-2 border-[#8BBB92]/50"
  },
  bills: {
    label: "Bills",
    icon: FileText,
    badge: "bg-[#092328] text-[#8BBB92] border-2 border-[#2A835F]"
  },
  other: {
    label: "Other",
    icon: Package,
    badge: "bg-[#12544F]/25 text-[#E2F1E4] border-2 border-[#12544F]"
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
    <div className="h-full flex flex-col justify-between backdrop-blur-xl bg-[#092328]/90 border-2 border-[#2A835F] rounded-3xl p-6 shadow-[0_8px_32px_rgba(42,131,95,0.25)]">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#8BBB92] tracking-wide uppercase">
              Recent Transactions
            </h3>
            <p className="text-xs sm:text-sm font-bold text-[#E2F1E4]">
              {expenses.length} {expenses.length === 1 ? "expense" : "expenses"} recorded
            </p>
          </div>

          {/* Search Box */}
          <div className="relative sm:w-52">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8BBB92] font-bold" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#051518] border-2 border-[#12544F] focus:border-[#8BBB92] rounded-xl text-xs sm:text-sm font-bold text-white placeholder-[#8BBB92]/50 focus:outline-none"
            />
          </div>
        </div>

        {/* Category Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
          {["all", "food", "travel", "shopping", "bills", "other"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black capitalize shrink-0 transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#8BBB92] text-[#092328] shadow-md shadow-[#2A835F]/40"
                  : "bg-[#051518] text-[#8BBB92] hover:text-white border border-[#12544F]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Expenses List Rows */}
        {filteredExpenses.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#051518] flex items-center justify-center text-[#8BBB92] mb-3 border border-[#12544F]">
              <Receipt className="w-6 h-6" />
            </div>
            <p className="text-sm font-black text-white">No transactions found</p>
            <p className="text-xs font-bold text-[#E2F1E4] mt-1">
              {expenses.length === 0
                ? "Add an expense above to populate your list."
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
                  className="group flex items-center justify-between p-4 rounded-2xl bg-[#051518] border-2 border-[#12544F] hover:border-[#2A835F] transition-all shadow-sm"
                >
                  {/* Left: Icon & Description */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`p-2.5 rounded-xl ${catConfig.badge} shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm sm:text-base text-white truncate">
                          {e.title}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${catConfig.badge}`}>
                          {e.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-[#E2F1E4] mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#8BBB92]" />
                          {formattedDate} • {formattedTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount & Delete */}
                  <div className="flex items-center gap-4 shrink-0 ml-3">
                    <div className="text-right">
                      <div className="text-base sm:text-lg font-black text-[#8BBB92]">
                        ₹{Number(e.amount).toLocaleString("en-IN")}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDelete(e._id)}
                      title="Delete expense"
                      className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-400/50 transition-all cursor-pointer"
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
        <div className="pt-4 mt-4 border-t-2 border-[#12544F] flex items-center justify-between text-xs sm:text-sm font-extrabold text-[#E2F1E4]">
          <span>Filtered Total</span>
          <span className="text-base sm:text-lg font-black text-white">
            ₹{filteredExpenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0).toLocaleString("en-IN")}
          </span>
        </div>
      )}
    </div>
  );
}