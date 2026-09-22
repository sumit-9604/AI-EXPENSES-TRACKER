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
  Calendar,
  Layers
} from "lucide-react";

const CATEGORY_MAP = {
  food: {
    label: "Food",
    icon: Utensils,
    badge: "bg-[#597928]/15 text-[#597928] border border-[#597928]/30"
  },
  travel: {
    label: "Travel",
    icon: Plane,
    badge: "bg-[#2563EB]/15 text-[#2563EB] border border-[#2563EB]/30"
  },
  shopping: {
    label: "Shopping",
    icon: ShoppingBag,
    badge: "bg-[#E17055]/15 text-[#E17055] border border-[#E17055]/30"
  },
  bills: {
    label: "Bills",
    icon: FileText,
    badge: "bg-[#D97706]/15 text-[#D97706] border border-[#D97706]/30"
  },
  other: {
    label: "Other",
    icon: Package,
    badge: "bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30"
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
    <div className="h-full flex flex-col justify-between bg-white border border-[#DCCFC0] rounded-3xl p-6 sm:p-7 shadow-[0_10px_30px_-5px_rgba(89,121,40,0.08),0_2px_8px_rgba(0,0,0,0.02)] text-[#597928]">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#A1BC98]/25 text-[#597928] border border-[#A1BC98]/50">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#597928] tracking-wide uppercase">
                Recent Outflow Records
              </h3>
              <p className="text-xs font-semibold text-[#597928]/75">
                {expenses.length} {expenses.length === 1 ? "transaction" : "transactions"} logged
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative sm:w-56">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#597928]" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#FDF6ED]/50 border border-[#DCCFC0] focus:bg-white focus:border-[#597928] focus:ring-2 focus:ring-[#A1BC98]/20 rounded-xl text-xs sm:text-sm font-bold text-[#597928] placeholder-[#597928]/50 focus:outline-none transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Category Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
          {["all", "food", "travel", "shopping", "bills", "other"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black capitalize shrink-0 transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#597928] text-white shadow-md shadow-[#597928]/25 scale-[1.02]"
                  : "bg-[#FDF6ED] text-[#597928] hover:text-[#486320] border border-[#DCCFC0]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Expenses List Rows */}
        {filteredExpenses.length === 0 ? (
          <div className="py-14 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FDF6ED] flex items-center justify-center text-[#597928] mb-3 border border-[#DCCFC0]">
              <Receipt className="w-7 h-7" />
            </div>
            <p className="text-sm font-black text-[#597928]">No records found</p>
            <p className="text-xs font-semibold text-[#597928]/75 mt-1">
              {expenses.length === 0
                ? "Add an expense above to populate your personal ledger."
                : "No transactions match your active search filter."}
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
                  className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-[#FDF6ED]/40 hover:bg-white border border-[#DCCFC0] hover:border-[#597928] transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  {/* Left: Icon & Description */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`p-2.5 rounded-xl ${catConfig.badge} shrink-0 shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm sm:text-base text-[#597928] truncate">
                          {e.title}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${catConfig.badge}`}>
                          {e.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#597928]/75 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#597928]" />
                          {formattedDate} • {formattedTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount & Delete */}
                  <div className="flex items-center gap-4 shrink-0 ml-3">
                    <div className="text-right">
                      <div className="text-base sm:text-lg font-black text-[#597928]">
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
        <div className="pt-4 mt-4 border-t border-[#DCCFC0] flex items-center justify-between text-xs sm:text-sm font-extrabold text-[#597928]">
          <span className="uppercase tracking-wider">Filtered Outflow</span>
          <span className="text-base sm:text-lg font-black text-[#597928]">
            ₹{filteredExpenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0).toLocaleString("en-IN")}
          </span>
        </div>
      )}
    </div>
  );
}