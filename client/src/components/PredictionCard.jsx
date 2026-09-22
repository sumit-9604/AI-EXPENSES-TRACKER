import { useState } from "react";
import { 
  Sparkles, 
  TrendingUp, 
  Wallet, 
  AlertTriangle, 
  CheckCircle2, 
  Activity,
  Edit2,
  Check
} from "lucide-react";

export default function PredictionCard({ prediction = 0, total = 0, salary = 0, onUpdateSalary }) {
  const [editingSalary, setEditingSalary] = useState(false);
  const [salaryInput, setSalaryInput] = useState(salary || "");

  const predValue = Number(prediction) || 0;
  const totalValue = Number(total) || 0;
  const salaryValue = Number(salary) || 0;

  const remaining = salaryValue - predValue;
  const percentUsed =
    salaryValue > 0
      ? Math.min(Math.round((predValue / salaryValue) * 100), 999)
      : 0;

  // Determine budget status
  let statusColor = "text-emerald-400";
  let statusBg = "bg-emerald-500/10 border-emerald-500/20";
  let progressColor = "bg-gradient-to-r from-emerald-500 to-teal-400";
  let statusText = "Healthy Spending";

  if (remaining < 0) {
    statusColor = "text-rose-400";
    statusBg = "bg-rose-500/10 border-rose-500/20";
    progressColor = "bg-gradient-to-r from-rose-500 to-red-600";
    statusText = "Over Budget";
  } else if (percentUsed >= 85) {
    statusColor = "text-amber-400";
    statusBg = "bg-amber-500/10 border-amber-500/20";
    progressColor = "bg-gradient-to-r from-amber-500 to-orange-500";
    statusText = "Near Budget Limit";
  }

  const handleSave = () => {
    if (onUpdateSalary && Number(salaryInput) > 0) {
      onUpdateSalary(Number(salaryInput));
    }
    setEditingSalary(false);
  };

  return (
    <div className="h-full flex flex-col justify-between backdrop-blur-xl bg-slate-900/70 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Header with AI Pill */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 text-cyan-400 border border-cyan-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">AI Financial Copilot</h3>
              <p className="text-xs text-slate-400">Predictive analysis based on spending pattern</p>
            </div>
          </div>

          <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${statusBg} ${statusColor}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            {statusText}
          </div>
        </div>

        {/* Highlight KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {/* Predicted Monthly */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
              <span>Predicted Month-End</span>
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              ₹{predValue.toLocaleString("en-IN")}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Machine learning forecast</span>
          </div>

          {/* Current Spent */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
              <span>Total Spent Till Now</span>
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">
              ₹{totalValue.toLocaleString("en-IN")}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Actual recorded outflow</span>
          </div>
        </div>

        {/* Budget Progress & Health */}
        {salaryValue > 0 ? (
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60 mb-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400">Budget Utilization</span>
              <span className={`font-bold ${statusColor}`}>{percentUsed}%</span>
            </div>

            {/* Progress Track */}
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                style={{ width: `${Math.min(percentUsed, 100)}%` }}
              />
            </div>

            {/* Salary Breakdown Row */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Wallet className="w-3.5 h-3.5 text-slate-500" />
                <span>Salary: <strong className="text-slate-200">₹{salaryValue.toLocaleString("en-IN")}</strong></span>
              </div>
              <div className="text-right">
                <span className="text-slate-400">Remaining: </span>
                <strong className={remaining < 0 ? "text-rose-400" : "text-emerald-400"}>
                  {remaining < 0 ? "-" : ""}₹{Math.abs(remaining).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            {remaining < 0 && (
              <div className="mt-3 flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Forecasted to exceed budget by <strong>₹{Math.abs(remaining).toLocaleString("en-IN")}</strong>.</span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-center mb-4">
            <p className="text-xs text-slate-300">
              Set your monthly salary above or below to unlock automated budget limit warnings and burn rate analytics.
            </p>
          </div>
        )}
      </div>

      {/* Footer Quick Salary Modifier */}
      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
          Real-time AI Model Synced
        </span>

        {editingSalary ? (
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              placeholder="Salary"
              value={salaryInput}
              onChange={(e) => setSalaryInput(e.target.value)}
              className="w-24 px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
            />
            <button
              onClick={handleSave}
              className="p-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setSalaryInput(salaryValue || "");
              setEditingSalary(true);
            }}
            className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <Edit2 className="w-3 h-3" />
            <span>{salaryValue > 0 ? "Edit Salary" : "Set Salary"}</span>
          </button>
        )}
      </div>
    </div>
  );
}