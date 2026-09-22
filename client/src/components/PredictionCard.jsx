import { useState } from "react";
import { 
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

  let statusColor = "text-emerald-300";
  let statusBg = "bg-emerald-500/20 border-2 border-emerald-400";
  let progressColor = "bg-gradient-to-r from-emerald-400 to-teal-300";
  let statusText = "WITHIN BUDGET";

  if (remaining < 0) {
    statusColor = "text-rose-300";
    statusBg = "bg-rose-500/20 border-2 border-rose-400";
    progressColor = "bg-gradient-to-r from-rose-500 to-red-500";
    statusText = "OVER BUDGET";
  } else if (percentUsed >= 85) {
    statusColor = "text-yellow-300";
    statusBg = "bg-yellow-500/20 border-2 border-yellow-400";
    progressColor = "bg-gradient-to-r from-yellow-400 to-amber-400";
    statusText = "NEAR LIMIT";
  }

  const handleSave = () => {
    if (onUpdateSalary && Number(salaryInput) > 0) {
      onUpdateSalary(Number(salaryInput));
    }
    setEditingSalary(false);
  };

  return (
    <div className="h-full flex flex-col justify-between backdrop-blur-xl bg-[#0A192F]/90 border-2 border-sky-400/50 rounded-3xl p-6 shadow-[0_8px_32px_rgba(56,189,248,0.25)]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#38BDF8] tracking-wide uppercase">
              Budget & AI Prediction
            </h3>
            <p className="text-xs sm:text-sm font-bold text-sky-200">Current Outflow & Monthly Forecast</p>
          </div>

          <div className={`px-3 py-1 rounded-full text-xs font-black border flex items-center gap-1.5 ${statusBg} ${statusColor}`}>
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            {statusText}
          </div>
        </div>

        {/* Highlight Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
          {/* Predicted Month-End */}
          <div className="p-4 rounded-2xl bg-[#050D1A] border-2 border-sky-400/40">
            <div className="flex items-center justify-between text-sky-200 text-xs font-bold mb-1">
              <span>PREDICTED EXPENSES</span>
              <Activity className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              ₹{predValue.toLocaleString("en-IN")}
            </div>
            <span className="text-xs font-bold text-sky-300 mt-1 block">Expected month-end total</span>
          </div>

          {/* Current Spent */}
          <div className="p-4 rounded-2xl bg-[#050D1A] border-2 border-sky-400/40">
            <div className="flex items-center justify-between text-sky-200 text-xs font-bold mb-1">
              <span>TOTAL SPENT TILL NOW</span>
              <TrendingUp className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#38BDF8]">
              ₹{totalValue.toLocaleString("en-IN")}
            </div>
            <span className="text-xs font-bold text-sky-300 mt-1 block">Actual recorded amount</span>
          </div>
        </div>

        {/* Budget Progress & Health */}
        {salaryValue > 0 ? (
          <div className="p-4 rounded-2xl bg-[#050D1A] border-2 border-sky-400/40 mb-4">
            <div className="flex items-center justify-between text-xs sm:text-sm font-black mb-2">
              <span className="text-sky-200">BUDGET UTILIZATION</span>
              <span className={statusColor}>{percentUsed}% USED</span>
            </div>

            {/* Progress Track */}
            <div className="w-full h-3 bg-[#0A192F] rounded-full overflow-hidden mb-3 border border-sky-400/30">
              <div
                className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                style={{ width: `${Math.min(percentUsed, 100)}%` }}
              />
            </div>

            {/* Salary Breakdown Row */}
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold pt-2 border-t border-sky-400/20">
              <div className="flex items-center gap-1.5 text-sky-200">
                <Wallet className="w-4 h-4 text-sky-400" />
                <span>Salary: <strong className="text-white text-sm">₹{salaryValue.toLocaleString("en-IN")}</strong></span>
              </div>
              <div className="text-right">
                <span className="text-sky-200">Remaining: </span>
                <strong className={`text-sm ${remaining < 0 ? "text-rose-400" : "text-emerald-400"}`}>
                  {remaining < 0 ? "-" : ""}₹{Math.abs(remaining).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            {remaining < 0 && (
              <div className="mt-3 flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/20 border border-rose-500 text-rose-300 text-xs font-bold">
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
                <span>⚠️ Over budget by ₹{Math.abs(remaining).toLocaleString("en-IN")}!</span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-[#050D1A] border-2 border-sky-400/40 text-center mb-4">
            <p className="text-xs sm:text-sm font-bold text-sky-200">
              Enter your monthly salary above to activate real-time budget forecasting!
            </p>
          </div>
        )}
      </div>

      {/* Footer Quick Salary Modifier */}
      <div className="pt-3 border-t border-sky-400/30 flex items-center justify-between text-xs font-bold text-sky-300">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-sky-400" />
          AI Model Active
        </span>

        {editingSalary ? (
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              placeholder="Salary"
              value={salaryInput}
              onChange={(e) => setSalaryInput(e.target.value)}
              className="w-28 px-2.5 py-1 bg-[#050D1A] border-2 border-sky-400 rounded-lg text-xs font-bold text-white"
            />
            <button
              onClick={handleSave}
              className="p-1.5 rounded-lg bg-sky-400 text-slate-950 font-black cursor-pointer hover:bg-sky-300"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setSalaryInput(salaryValue || "");
              setEditingSalary(true);
            }}
            className="flex items-center gap-1 text-sky-300 hover:text-white transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{salaryValue > 0 ? "Edit Salary" : "Set Salary"}</span>
          </button>
        )}
      </div>
    </div>
  );
}