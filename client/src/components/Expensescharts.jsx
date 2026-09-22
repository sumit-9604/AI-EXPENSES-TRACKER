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

// Apple-inspired soft pastel palette
const COLORS = [
  "#38bdf8", // Soft Sky
  "#34d399", // Soft Mint
  "#fb923c", // Soft Tangerine
  "#c084fc", // Soft Violet
  "#fb7185", // Soft Rose
  "#facc15"  // Soft Amber
];

// Fallback demo data shown when the user has not logged any expenses yet
const DEMO_EXPENSES = [
  { category: "food", amount: 3500, createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  { category: "bills", amount: 6200, createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
  { category: "shopping", amount: 2800, createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  { category: "travel", amount: 1500, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { category: "other", amount: 950, createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
];

// Apple-style minimalist frosted tooltip
const CustomTooltip = ({ active, payload, label, prefix = "₹" }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2.5 rounded-xl bg-zinc-900/95 border border-white/[0.12] shadow-2xl backdrop-blur-md text-xs">
        {label && <p className="text-zinc-400 font-medium mb-1">{label}</p>}
        {payload.map((item, idx) => (
          <p key={idx} className="text-white font-medium flex items-center gap-1.5">
            <span 
              className="w-2 h-2 rounded-full inline-block" 
              style={{ backgroundColor: item.color || item.fill }} 
            />
            <span className="text-zinc-300">{item.name}:</span>
            <span className="font-semibold text-white">{prefix}{Number(item.value).toLocaleString("en-IN")}</span>
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
        <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-white/[0.08] text-xs text-zinc-400">
          <span>Sample preview charts. Log an expense above to view real-time data.</span>
          <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 text-[10px] font-medium">
            Sample Data
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Category Allocation (Pie Chart) */}
        <div className="backdrop-blur-2xl bg-zinc-900/50 border border-white/[0.08] rounded-2xl p-6 shadow-xl shadow-black/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300">
                <PieIcon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white tracking-tight">Category Breakdown</h4>
                <p className="text-xs text-zinc-400">Distribution by bucket</p>
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
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={index} 
                      fill={COLORS[index % COLORS.length]} 
                      stroke="#09090b" 
                      strokeWidth={2} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(val) => <span className="text-xs text-zinc-400 capitalize">{val}</span>} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Spending Trajectory (Line Chart) */}
        <div className="backdrop-blur-2xl bg-zinc-900/50 border border-white/[0.08] rounded-2xl p-6 shadow-xl shadow-black/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white tracking-tight">Spending Trajectory</h4>
                <p className="text-xs text-zinc-400">Daily outflow trend</p>
              </div>
            </div>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" stroke="#71717a" tick={{ fontSize: 11 }} />
                <YAxis stroke="#71717a" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  name="Expense"
                  stroke="#ffffff" 
                  strokeWidth={2} 
                  dot={{ fill: "#38bdf8", r: 3.5 }} 
                  activeDot={{ r: 5, fill: "#ffffff" }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Category Comparison (Bar Chart) */}
        <div className="backdrop-blur-2xl bg-zinc-900/50 border border-white/[0.08] rounded-2xl p-6 shadow-xl shadow-black/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white tracking-tight">Comparison by Category</h4>
                <p className="text-xs text-zinc-400">Total volume per bucket</p>
              </div>
            </div>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#71717a" tick={{ fontSize: 11 }} />
                <YAxis stroke="#71717a" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  name="Total Spent"
                  fill="#38bdf8" 
                  radius={[5, 5, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Day-wise Outflow Density (Scatter Plot) */}
        <div className="backdrop-blur-2xl bg-zinc-900/50 border border-white/[0.08] rounded-2xl p-6 shadow-xl shadow-black/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300">
                <ScatterIcon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white tracking-tight">Expense Distribution</h4>
                <p className="text-xs text-zinc-400">Transaction date vs magnitude</p>
              </div>
            </div>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#27272a" />
                <XAxis type="number" dataKey="x" name="Day of Month" stroke="#71717a" tick={{ fontSize: 11 }} />
                <YAxis type="number" dataKey="y" name="Amount" stroke="#71717a" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip prefix="₹" />} />
                <Scatter name="Transactions" data={scatterData} fill="#fb923c" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
