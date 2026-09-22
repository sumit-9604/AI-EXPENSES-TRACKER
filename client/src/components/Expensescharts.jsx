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

const COLORS = [
  "#06b6d4", // cyan-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#f43f5e", // rose-500
  "#8b5cf6", // violet-500
  "#3b82f6"  // blue-500
];

// Custom styled tooltip component for dark theme
const CustomTooltip = ({ active, payload, label, prefix = "₹" }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2.5 rounded-xl bg-slate-950/95 border border-slate-800 shadow-2xl backdrop-blur-md text-xs">
        {label && <p className="text-slate-400 font-medium mb-1">{label}</p>}
        {payload.map((item, idx) => (
          <p key={idx} className="text-white font-bold flex items-center gap-1.5">
            <span 
              className="w-2 h-2 rounded-full inline-block" 
              style={{ backgroundColor: item.color || item.fill }} 
            />
            <span>{item.name}:</span>
            <span className="text-cyan-400">{prefix}{Number(item.value).toLocaleString("en-IN")}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ExpenseChart({ expenses = [] }) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="backdrop-blur-xl bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center my-6">
        <p className="text-slate-400 text-sm">Visual analytics will appear automatically as you log expenses.</p>
      </div>
    );
  }

  // Aggregate by Category
  const categoryData = Object.values(
    expenses.reduce((acc, e) => {
      acc[e.category] = acc[e.category] || {
        name: e.category.charAt(0).toUpperCase() + e.category.slice(1),
        value: 0
      };
      acc[e.category].value += Number(e.amount);
      return acc;
    }, {})
  );

  // Chronological Line Trend
  const lineData = [...expenses]
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map(e => ({
      date: new Date(e.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      amount: Number(e.amount)
    }));

  // Scatter distribution
  const scatterData = expenses.map(e => ({
    x: new Date(e.createdAt).getDate(),
    y: Number(e.amount),
    z: Number(e.amount)
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Category Distribution (Pie Chart) */}
      <div className="backdrop-blur-xl bg-slate-900/70 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Expenses by Category</h4>
              <p className="text-xs text-slate-400">Share of monthly spend</p>
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
                    stroke="#0f172a" 
                    strokeWidth={2} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                formatter={(val) => <span className="text-xs text-slate-300 capitalize">{val}</span>} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Spending Trend (Line Chart) */}
      <div className="backdrop-blur-xl bg-slate-900/70 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Expenses Velocity</h4>
              <p className="text-xs text-slate-400">Day-by-day transaction trend</p>
            </div>
          </div>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="amount" 
                name="Expense"
                stroke="#6366f1" 
                strokeWidth={2.5} 
                dot={{ fill: "#06b6d4", r: 4 }} 
                activeDot={{ r: 6, fill: "#38bdf8" }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Category Comparison (Bar Chart) */}
      <div className="backdrop-blur-xl bg-slate-900/70 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Category Comparison</h4>
              <p className="text-xs text-slate-400">Total volume per bucket</p>
            </div>
          </div>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                name="Total Spent"
                fill="#10b981" 
                radius={[6, 6, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Day-wise Outflow Density (Scatter Plot) */}
      <div className="backdrop-blur-xl bg-slate-900/70 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ScatterIcon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Expense Distribution</h4>
              <p className="text-xs text-slate-400">Day of month vs transaction size</p>
            </div>
          </div>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#1e293b" />
              <XAxis type="number" dataKey="x" name="Day of Month" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis type="number" dataKey="y" name="Amount" stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip prefix="₹" />} />
              <Scatter name="Transactions" data={scatterData} fill="#f59e0b" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
