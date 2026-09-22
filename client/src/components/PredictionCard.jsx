import { useState } from "react";
import { 
  TrendingUp, 
  Wallet, 
  AlertCircle, 
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

  // Apple-style soft pastel badge colors
  let statusColor = "text-emerald-400";
  let statusBg = "bg-emerald-500/10 border-emerald-500/20";
  let progressColor = "bg-emerald-400";
  let statusText = "On Track";

  if (remaining < 0) {
    statusColor = "text-rose-400";
    statusBg = "bg-rose-500/10 border-rose-500/20";
    progressColor = "bg-rose-400";
    statusText = "Over Budget";
  } else if (percentUsed >= 85) {
    statusColor = "text-amber-400";
    statusBg = "bg-amber-500/10 border-amber-500/20";
    progressColor = "bg-amber-400";
    statusText = "Near Limit";
  }

  const handleSave = () => {
    if (onUpdateSalary && Number(salaryInput) > 0) {
      onUpdateSalary(Number(salaryInput));
    }
    setEditingSalary(false);
  };

  return (
    <div className="h-full flex flex-col justify-between backdrop-blur-2xl bg-zinc-900/50 border border-white/[0.08] rounded-2xl p-6 shadow-xl shadow-black/20">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">Spending Summary</h3>
            <p className="text-xs text-zinc-400">Monthly budget and projection</p>
          </div>

          <div className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 ${statusBg} ${statusColor}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {statusText}
          </div>
        </div>

        {/* Large Clean Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {/* Projected Month-End */}
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-white/[0.06]">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-medium mb-1">
              <span>Projected Month-End</span>
              <Activity className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-white">
              ₹{predValue.toLocaleString("en-IN")}
            </div>
            <span className="text-[11px] text-zinc-500 mt-1 block">Based on recent activity</span>
          </div>

          {/* Current Spent */}
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-white/[0.06]">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-medium mb-1">
              <span>Total Spent So Far</span>
              <TrendingUp className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-zinc-100">
              ₹{totalValue.toLocaleString("en-IN")}
            </div>
            <span className="text-[11px] text-zinc-500 mt-1 block">Actual recorded outflow</span>
          </div>
        </div>

        {/* Budget Progress */}
        {salaryValue > 0 ? (
          <div className="p-4 rounded-xl bg-zinc-950/40 border border-white/[0.06] mb-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-zinc-400">Budget Progress</span>
              <span className={`font-semibold ${statusColor}`}>{percentUsed}%</span>
            </div>

            {/* Progress Track */}
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                style={{ width: `${Math.min(percentUsed, 100)}%` }}
              />
            </div>

            {/* Numbers Breakdown */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-white/[0.06]">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Wallet className="w-3.5 h-3.5 text-zinc-500" />
                <span>Budget: <strong className="text-zinc-200">₹{salaryValue.toLocaleString("en-IN")}</strong></span>
              </div>
              <div className="text-right">
                <span className="text-zinc-400">Remaining: </span>
                <strong className={remaining < 0 ? "text-rose-400" : "text-zinc-200"}>
                  {remaining < 0 ? "-" : ""}₹{Math.abs(remaining).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            {remaining < 0 && (
              <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>Over budget by <strong>₹{Math.abs(remaining).toLocaleString("en-IN")}</strong>.</span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-zinc-950/40 border border-white/[0.06] text-center mb-4">
            <p className="text-xs text-zinc-400">
              Set a monthly budget to monitor your burn rate and remaining allowance.
            </p>
          </div>
        )}
      </div>

      {/* Footer Quick Budget Modifier */}
      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
          Synchronized
        </span>

        {editingSalary ? (
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              placeholder="Budget"
              value={salaryInput}
              onChange={(e) => setSalaryInput(e.target.value)}
              className="w-24 px-2 py-1 bg-zinc-900 border border-white/[0.1] rounded-lg text-xs text-white"
            />
            <button
              onClick={handleSave}
              className="p-1 rounded bg-white text-zinc-950 cursor-pointer hover:bg-zinc-200"
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
            className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <Edit2 className="w-3 h-3" />
            <span>{salaryValue > 0 ? "Edit Budget" : "Set Budget"}</span>
          </button>
        )}
      </div>
    </div>
  );
}