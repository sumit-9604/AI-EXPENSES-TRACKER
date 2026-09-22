import { useState } from "react";
import { 
  TrendingUp, 
  Wallet, 
  AlertTriangle, 
  CheckCircle2, 
  Activity,
  Edit2,
  Check,
  ShieldCheck
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
  let statusColor = "text-amber-300";
  let statusBg = "bg-amber-500/10 border-amber-500/30";
  let progressColor = "bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37]";
  let statusText = "Optimal Trajectory";

  if (remaining < 0) {
    statusColor = "text-rose-400";
    statusBg = "bg-rose-950/40 border-rose-500/30";
    progressColor = "bg-gradient-to-r from-rose-600 to-red-500";
    statusText = "Exceeding Budget";
  } else if (percentUsed >= 85) {
    statusColor = "text-yellow-400";
    statusBg = "bg-yellow-950/40 border-yellow-500/30";
    progressColor = "bg-gradient-to-r from-amber-600 to-yellow-500";
    statusText = "Approaching Limit";
  }

  const handleSave = () => {
    if (onUpdateSalary && Number(salaryInput) > 0) {
      onUpdateSalary(Number(salaryInput));
    }
    setEditingSalary(false);
  };

  return (
    <div className="h-full flex flex-col justify-between backdrop-blur-xl bg-[#0e1626]/80 border border-amber-500/20 rounded-3xl p-6 shadow-xl shadow-black/40 relative overflow-hidden">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-amber-100 font-serif-luxury tracking-wide">Capital & Spending Trajectory</h3>
              <p className="text-xs text-slate-400">Statistical forecasting based on spending rate</p>
            </div>
          </div>

          <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${statusBg} ${statusColor}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {statusText}
          </div>
        </div>

        {/* Highlight Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {/* Projected Month-End */}
          <div className="p-4 rounded-2xl bg-[#080d16]/90 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
              <span>Projected Month-End</span>
              <Activity className="w-3.5 h-3.5 text-amber-400/80" />
            </div>
            <div className="text-2xl font-extrabold text-amber-300 font-serif-luxury">
              ₹{predValue.toLocaleString("en-IN")}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Forecasted end-of-month outflow</span>
          </div>

          {/* Current Spent */}
          <div className="p-4 rounded-2xl bg-[#080d16]/90 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
              <span>Current Total Disbursed</span>
              <TrendingUp className="w-3.5 h-3.5 text-amber-400/80" />
            </div>
            <div className="text-2xl font-extrabold text-white font-serif-luxury">
              ₹{totalValue.toLocaleString("en-IN")}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Actual recorded outflow to date</span>
          </div>
        </div>

        {/* Budget Progress & Health */}
        {salaryValue > 0 ? (
          <div className="p-4 rounded-2xl bg-[#080d16]/60 border border-slate-800/80 mb-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400">Capital Utilization</span>
              <span className={`font-bold ${statusColor}`}>{percentUsed}%</span>
            </div>

            {/* Progress Track */}
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden mb-3 border border-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                style={{ width: `${Math.min(percentUsed, 100)}%` }}
              />
            </div>

            {/* Salary Breakdown Row */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Wallet className="w-3.5 h-3.5 text-amber-400/70" />
                <span>Budget: <strong className="text-amber-100">₹{salaryValue.toLocaleString("en-IN")}</strong></span>
              </div>
              <div className="text-right">
                <span className="text-slate-400">Remaining: </span>
                <strong className={remaining < 0 ? "text-rose-400" : "text-amber-300"}>
                  {remaining < 0 ? "-" : ""}₹{Math.abs(remaining).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            {remaining < 0 && (
              <div className="mt-3 flex items-center gap-2 p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>Projected to exceed baseline capital allocation by <strong>₹{Math.abs(remaining).toLocaleString("en-IN")}</strong>.</span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-[#080d16]/60 border border-amber-500/20 text-center mb-4">
            <p className="text-xs text-slate-300">
              Define your monthly baseline budget above or below to monitor burn rate and capital margins.
            </p>
          </div>
        )}
      </div>

      {/* Footer Quick Budget Modifier */}
      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
          Real-time Matrix Synced
        </span>

        {editingSalary ? (
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              placeholder="Budget"
              value={salaryInput}
              onChange={(e) => setSalaryInput(e.target.value)}
              className="w-24 px-2 py-1 bg-[#060a12] border border-slate-700 rounded-lg text-xs text-white"
            />
            <button
              onClick={handleSave}
              className="p-1 rounded bg-[#d4af37] text-slate-950 cursor-pointer hover:brightness-110"
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
            className="flex items-center gap-1 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <Edit2 className="w-3 h-3" />
            <span>{salaryValue > 0 ? "Adjust Budget" : "Set Budget"}</span>
          </button>
        )}
      </div>
    </div>
  );
}