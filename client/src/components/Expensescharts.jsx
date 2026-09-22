import { 
  PieChart as PieIcon, 
  TrendingUp, 
  BarChart3, 
  ScatterChart as ScatterIcon 
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Tooltip, 
  Cell, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  ScatterChart, 
  Scatter 
} from "recharts";

// Clean, high-visibility palette aligned with #778873, #A1BC98, #DCCFC0, #FDF6ED
const COLORS = [
  "#778873", // Deep Sage
  "#A1BC98", // Soft Sage
  "#B5A08D", // Warm Sand
  "#62755E", // Forest Olive
  "#8CA684", // Muted Mint
  "#C4B5A5"  // Warm Taupe
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
      <div className="p-3 rounded-2xl bg-white border-2 border-[#DCCFC0] shadow-xl text-xs font-bold">
        {label && <p className="text-[#778873] font-black mb-1">{label}</p>}
        {payload.map((item, idx) => (
          <p key={idx} className="text-[#2B382A] flex items-center gap-2 text-sm font-extrabold">
            <span 
              className="w-2.5 h-2.5 rounded-full inline-block" 
              style={{ backgroundColor: item.color || item.fill }} 
            />
            <span className="font-semibold text-[#778873]">{item.name}:</span>
            <span className="text-[#2B382A] font-black">{prefix}{Number(item.value).toLocaleString("en-IN")}</span>
          </p>
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
      acc[e.category] = acc[e.category] || {
        name: e.category.charAt(0).toUpperCase() + e.category.slice(1),
        value: 0
      };
      acc[e.category].value += Number(e.amount);
      return acc;
    }, {})
  );

  // Chronological Line Trend
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
    <div className="space-y-4">
      {isDemo && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border-2 border-[#DCCFC0] shadow-sm text-xs sm:text-sm font-bold text-[#778873]">
          <span>Sample preview charts. Add your expenses above to display real-time personal analytics!</span>
          <span className="px-2.5 py-1 rounded-lg bg-[#778873] text-[#FDF6ED] font-black text-xs uppercase shadow-sm">
            Preview
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Category Distribution (Pie Chart) */}
        <div className="backdrop-blur-xl bg-[#FDF6ED]/95 border-2 border-[#DCCFC0] rounded-3xl p-6 shadow-xl shadow-[#778873]/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#A1BC98]/25 text-[#778873] border border-[#A1BC98]">
                <PieIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-black text-[#778873] uppercase tracking-wide">Category Distribution</h4>
                <p className="text-xs font-semibold text-[#2B382A]">Share of monthly expenses</p>
              </div>
            </div>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={index} 
                      fill={COLORS[index % COLORS.length]} 
                      stroke="#FFFFFF" 
                      strokeWidth={2} 
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

        {/* 2. Spending Velocity (Line Chart) */}
        <div className="backdrop-blur-xl bg-[#FDF6ED]/95 border-2 border-[#DCCFC0] rounded-3xl p-6 shadow-xl shadow-[#778873]/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#A1BC98]/25 text-[#778873] border border-[#A1BC98]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-black text-[#778873] uppercase tracking-wide">Spending Trend</h4>
                <p className="text-xs font-semibold text-[#2B382A]">Chronological outflow history</p>
              </div>
            </div>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DCCFC0" />
                <XAxis dataKey="date" stroke="#778873" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                <YAxis stroke="#778873" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  name="Expense"
                  stroke="#778873" 
                  strokeWidth={3} 
                  dot={{ fill: "#A1BC98", stroke: "#778873", strokeWidth: 2, r: 4 }} 
                  activeDot={{ r: 6, fill: "#778873" }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Category Comparison (Bar Chart) */}
        <div className="backdrop-blur-xl bg-[#FDF6ED]/95 border-2 border-[#DCCFC0] rounded-3xl p-6 shadow-xl shadow-[#778873]/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#A1BC98]/25 text-[#778873] border border-[#A1BC98]">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-black text-[#778873] uppercase tracking-wide">Category Comparison</h4>
                <p className="text-xs font-semibold text-[#2B382A]">Total spent per category</p>
              </div>
            </div>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DCCFC0" />
                <XAxis dataKey="name" stroke="#778873" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                <YAxis stroke="#778873" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  name="Total Spent"
                  fill="#778873" 
                  radius={[6, 6, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Day-wise Outflow Density (Scatter Plot) */}
        <div className="backdrop-blur-xl bg-[#FDF6ED]/95 border-2 border-[#DCCFC0] rounded-3xl p-6 shadow-xl shadow-[#778873]/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#A1BC98]/25 text-[#778873] border border-[#A1BC98]">
                <ScatterIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-black text-[#778873] uppercase tracking-wide">Expense Distribution</h4>
                <p className="text-xs font-semibold text-[#2B382A]">Day of month vs transaction magnitude</p>
              </div>
            </div>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid stroke="#DCCFC0" />
                <XAxis type="number" dataKey="x" name="Day of Month" stroke="#778873" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                <YAxis type="number" dataKey="y" name="Amount" stroke="#778873" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                <Tooltip content={<CustomTooltip prefix="₹" />} />
                <Scatter name="Transactions" data={scatterData} fill="#778873" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
