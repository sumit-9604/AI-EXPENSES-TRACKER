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
    badge: "bg-[#A1BC98]/20 text-[#778873] border-2 border-[#A1BC98]"
  },
  travel: {
    label: "Travel",
    icon: Plane,
    badge: "bg-[#778873]/15 text-[#778873] border-2 border-[#778873]/30"
  },
  shopping: {
    label: "Shopping",
    icon: ShoppingBag,
    badge: "bg-[#DCCFC0]/60 text-[#5B6D57] border-2 border-[#DCCFC0]"
  },
  bills: {
    label: "Bills",
    icon: FileText,
    badge: "bg-[#A1BC98]/30 text-[#2B382A] border-2 border-[#A1BC98]"
  },
  other: {
    label: "Other",
    icon: Package,
    badge: "bg-[#DCCFC0]/40 text-[#778873] border-2 border-[#DCCFC0]"
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
    <div className="h-full flex flex-col justify-between backdrop-blur-xl bg-[#FDF6ED]/95 border-2 border-[#DCCFC0] rounded-3xl p-6 shadow-xl shadow-[#778873]/10">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#778873] tracking-wide uppercase">
              Recent Transactions
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-[#2B382A]">
              {expenses.length} {expenses.length === 1 ? "expense" : "expenses"} recorded
            </p>
          </div>

          {/* Search Box */}
          <div className="relative sm:w-52">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#778873] font-bold" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border-2 border-[#DCCFC0] focus:border-[#778873] rounded-xl text-xs sm:text-sm font-bold text-[#2B382A] placeholder-[#778873]/50 focus:outline-none shadow-sm"
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
                  ? "bg-[#778873] text-[#FDF6ED] shadow-md shadow-[#778873]/30"
                  : "bg-white text-[#778873] hover:text-[#2B382A] border border-[#DCCFC0]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Expenses List Rows */}
        {filteredExpenses.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#778873] mb-3 border-2 border-[#DCCFC0] shadow-sm">
              <Receipt className="w-6 h-6" />
            </div>
            <p className="text-sm font-black text-[#2B382A]">No transactions found</p>
            <p className="text-xs font-semibold text-[#778873] mt-1">
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
                  className="group flex items-center justify-between p-4 rounded-2xl bg-white border-2 border-[#DCCFC0] hover:border-[#A1BC98] transition-all shadow-sm hover:shadow-md"
                >
                  {/* Left: Icon & Description */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`p-2.5 rounded-xl ${catConfig.badge} shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm sm:text-base text-[#2B382A] truncate">
                          {e.title}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${catConfig.badge}`}>
                          {e.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#778873] mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#778873]" />
                          {formattedDate} • {formattedTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount & Delete */}
                  <div className="flex items-center gap-4 shrink-0 ml-3">
                    <div className="text-right">
                      <div className="text-base sm:text-lg font-black text-[#778873]">
                        ₹{Number(e.amount).toLocaleString("en-IN")}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDelete(e._id)}
                      title="Delete expense"
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all cursor-pointer hover:scale-105"
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
        <div className="pt-4 mt-4 border-t-2 border-[#DCCFC0] flex items-center justify-between text-xs sm:text-sm font-extrabold text-[#778873]">
          <span>Filtered Total</span>
          <span className="text-base sm:text-lg font-black text-[#2B382A]">
            ₹{filteredExpenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0).toLocaleString("en-IN")}
          </span>
        </div>
      )}
    </div>
  );
}