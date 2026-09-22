import { 
  PieChart as PieIcon, 
  TrendingUp, 
  BarChart3, 
  ScatterChart as ScatterIcon,
  Sparkles
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Tooltip, 
  Cell, 
  Legend, 
  ResponsiveContainer, 
  AreaChart,
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  ScatterChart, 
  Scatter 
} from "recharts";

// Vibrant, distinct colors for categories that complement the warm aesthetic
const CATEGORY_COLORS = {
  Food: "#587053",       // Forest Sage
  Travel: "#2563EB",     // Azure Cobalt
  Shopping: "#E17055",   // Terracotta Coral
  Bills: "#D97706",      // Warm Amber
  Other: "#8B5CF6",      // Lavender Purple
  Default: "#778873"
};

const PALETTE = [
  "#587053", // Forest Sage
  "#2563EB", // Azure Cobalt
  "#E17055", // Terracotta Coral
  "#D97706", // Warm Amber
  "#8B5CF6", // Lavender Purple
  "#0D9488"  // Emerald Teal
];

// Fallback demo data shown when the user has not logged any expenses yet
const DEMO_EXPENSES = [
  { category: "food", amount: 3500, createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  { category: "bills", amount: 6200, createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
  { category: "shopping", amount: 2800, createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  { category: "travel", amount: 1500, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { category: "other", amount: 950, createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
];

// High contrast light tooltip component
const CustomTooltip = ({ active, payload, label, prefix = "₹" }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3.5 rounded-2xl bg-white border border-[#DCCFC0] shadow-[0_10px_25px_rgba(0,0,0,0.12)] text-xs font-bold">
        {label && <p className="text-[#778873] font-black mb-1.5 uppercase tracking-wide">{label}</p>}
        {payload.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2.5 text-sm">
            <span 
              className="w-3 h-3 rounded-full inline-block shadow-sm" 
              style={{ backgroundColor: item.color || item.fill }} 
            />
            <span className="font-semibold text-[#586854]">{item.name}:</span>
            <span className="text-[#2B382A] font-black">{prefix}{Number(item.value).toLocaleString("en-IN")}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ExpenseChart({ expenses = [] }) {
  const isDemo = !expenses || expenses.length === 0;
  const activeExpenses = isDemo ? DEMO_EXPENSES : expenses;

  // Aggregate by Category
  const categoryData = Object.values(
    activeExpenses.reduce((acc, e) => {
      const catKey = e.category || "other";
      const name = catKey.charAt(0).toUpperCase() + catKey.slice(1);
      acc[catKey] = acc[catKey] || {
        name,
        value: 0,
        color: CATEGORY_COLORS[name] || CATEGORY_COLORS.Default
      };
      acc[catKey].value += Number(e.amount);
      return acc;
    }, {})
  );

  // Chronological Area Trend
  const lineData = [...activeExpenses]
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map(e => ({
      date: new Date(e.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      amount: Number(e.amount)
    }));

  // Scatter distribution
  const scatterData = activeExpenses.map(e => ({
    x: new Date(e.createdAt).getDate(),
    y: Number(e.amount),
    z: Number(e.amount)
  }));

  return (
    <div className="space-y-6">
      {isDemo && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#DCCFC0] shadow-sm text-xs sm:text-sm font-bold text-[#586854]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#778873]" />
            <span>Interactive Sample Charts. Add your personal expenses above to watch your analytics update in real time!</span>
          </div>
          <span className="px-3 py-1 rounded-lg bg-[#778873] text-white font-black text-xs uppercase shadow-sm">
            Live Demo
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Category Distribution (Pie/Donut Chart) */}
        <div className="bg-white border border-[#DCCFC0] rounded-3xl p-6 sm:p-7 shadow-[0_8px_30px_rgba(119,136,115,0.08)] hover:shadow-[0_12px_35px_rgba(119,136,115,0.14)] transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-[#A1BC98]/25 text-[#586854] border border-[#A1BC98]/50">
                <PieIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-black text-[#2B382A] uppercase tracking-wide">Category Distribution</h4>
                <p className="text-xs font-semibold text-[#778873]">Spending breakdown by category</p>
              </div>
            </div>
            <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#FDF6ED] text-[#778873] border border-[#DCCFC0]">
              Donut
            </span>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={4}
                  stroke="#FFFFFF"
                  strokeWidth={3}
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={index} 
                      fill={entry.color || PALETTE[index % PALETTE.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(val) => <span className="text-xs font-bold text-[#2B382A] capitalize">{val}</span>} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Spending Velocity (Area Chart with Gradient Fill) */}
        <div className="bg-white border border-[#DCCFC0] rounded-3xl p-6 sm:p-7 shadow-[0_8px_30px_rgba(119,136,115,0.08)] hover:shadow-[0_12px_35px_rgba(119,136,115,0.14)] transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-[#A1BC98]/25 text-[#586854] border border-[#A1BC98]/50">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-black text-[#2B382A] uppercase tracking-wide">Spending Trajectory</h4>
                <p className="text-xs font-semibold text-[#778873]">Chronological outflow velocity</p>
              </div>
            </div>
            <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#FDF6ED] text-[#778873] border border-[#DCCFC0]">
              Area Fill
            </span>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="sageAreaGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#778873" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#778873" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#DCCFC0" vertical={false} />
                <XAxis dataKey="date" stroke="#778873" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                <YAxis stroke="#778873" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  name="Expense"
                  stroke="#587053" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#sageAreaGlow)"
                  dot={{ fill: "#FFFFFF", stroke: "#587053", strokeWidth: 2.5, r: 4 }} 
                  activeDot={{ r: 6, fill: "#587053" }} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Category Comparison (Multi-Colored Bar Chart) */}
        <div className="bg-white border border-[#DCCFC0] rounded-3xl p-6 sm:p-7 shadow-[0_8px_30px_rgba(119,136,115,0.08)] hover:shadow-[0_12px_35px_rgba(119,136,115,0.14)] transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-[#A1BC98]/25 text-[#586854] border border-[#A1BC98]/50">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-black text-[#2B382A] uppercase tracking-wide">Category Comparison</h4>
                <p className="text-xs font-semibold text-[#778873]">Total expenditure grouped by category</p>
              </div>
            </div>
            <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#FDF6ED] text-[#778873] border border-[#DCCFC0]">
              Bars
            </span>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DCCFC0" vertical={false} />
                <XAxis dataKey="name" stroke="#778873" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                <YAxis stroke="#778873" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  name="Total Spent"
                  radius={[8, 8, 0, 0]} 
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={`bar-${index}`} 
                      fill={entry.color || PALETTE[index % PALETTE.length]} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Day-wise Outflow Density (Scatter Plot) */}
        <div className="bg-white border border-[#DCCFC0] rounded-3xl p-6 sm:p-7 shadow-[0_8px_30px_rgba(119,136,115,0.08)] hover:shadow-[0_12px_35px_rgba(119,136,115,0.14)] transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-[#A1BC98]/25 text-[#586854] border border-[#A1BC98]/50">
                <ScatterIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-black text-[#2B382A] uppercase tracking-wide">Expense Density</h4>
                <p className="text-xs font-semibold text-[#778873]">Day of month vs transaction magnitude</p>
              </div>
            </div>
            <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#FDF6ED] text-[#778873] border border-[#DCCFC0]">
              Scatter
            </span>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid stroke="#DCCFC0" />
                <XAxis type="number" dataKey="x" name="Day of Month" stroke="#778873" tick={{ fontSize: 11, fontWeight: 'bold' }} domain={[1, 31]} />
                <YAxis type="number" dataKey="y" name="Amount" stroke="#778873" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                <Tooltip content={<CustomTooltip prefix="₹" />} />
                <Scatter name="Transactions" data={scatterData} fill="#587053" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
