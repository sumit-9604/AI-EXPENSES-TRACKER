import { useState } from "react";
import { 
  TrendingUp, 
  Wallet, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Edit2, 
  Check,
  Sparkles
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

  let statusColor = "text-[#587053]";
  let statusBg = "bg-[#A1BC98]/25 border border-[#A1BC98]";
  let progressColor = "bg-gradient-to-r from-[#587053] to-[#778873]";
  let statusText = "ON TRACK";

  if (remaining < 0) {
    statusColor = "text-rose-700";
    statusBg = "bg-rose-100 border border-rose-300";
    progressColor = "bg-gradient-to-r from-rose-500 to-red-600";
    statusText = "OVER BUDGET";
  } else if (percentUsed >= 85) {
    statusColor = "text-amber-800";
    statusBg = "bg-amber-100 border border-amber-300";
    progressColor = "bg-gradient-to-r from-amber-500 to-orange-500";
    statusText = "NEAR LIMIT";
  }

  const handleSave = () => {
    if (onUpdateSalary && Number(salaryInput) > 0) {
      onUpdateSalary(Number(salaryInput));
    }
    setEditingSalary(false);
  };

  return (
    <div className="h-full flex flex-col justify-between bg-white border border-[#DCCFC0] rounded-3xl p-6 sm:p-7 shadow-[0_10px_30px_-5px_rgba(119,136,115,0.1),0_2px_8px_rgba(0,0,0,0.02)]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#A1BC98]/25 text-[#587053] border border-[#A1BC98]/50">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#2B382A] tracking-wide uppercase">
                Budget & AI Prediction
              </h3>
              <p className="text-xs font-semibold text-[#778873]">Current Outflow & Monthly Forecast</p>
            </div>
          </div>

          <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${statusBg} ${statusColor}`}>
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            {statusText}
          </div>
        </div>

        {/* Highlight Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
          {/* Predicted Month-End */}
          <div className="p-4 rounded-2xl bg-[#FDF6ED]/60 border border-[#DCCFC0] shadow-sm">
            <div className="flex items-center justify-between text-[#778873] text-xs font-bold mb-1">
              <span>PREDICTED EXPENSES</span>
              <Activity className="w-4 h-4 text-[#587053]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#2B382A]">
              ₹{predValue.toLocaleString("en-IN")}
            </div>
            <span className="text-xs font-semibold text-[#778873] mt-1 block">Expected month-end total</span>
          </div>

          {/* Current Spent */}
          <div className="p-4 rounded-2xl bg-[#FDF6ED]/60 border border-[#DCCFC0] shadow-sm">
            <div className="flex items-center justify-between text-[#778873] text-xs font-bold mb-1">
              <span>TOTAL SPENT TILL NOW</span>
              <TrendingUp className="w-4 h-4 text-[#587053]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#587053]">
              ₹{totalValue.toLocaleString("en-IN")}
            </div>
            <span className="text-xs font-semibold text-[#778873] mt-1 block">Actual recorded outflow</span>
          </div>
        </div>

        {/* Budget Progress & Health */}
        {salaryValue > 0 ? (
          <div className="p-4 rounded-2xl bg-[#FDF6ED]/60 border border-[#DCCFC0] shadow-sm mb-4">
            <div className="flex items-center justify-between text-xs sm:text-sm font-black mb-2">
              <span className="text-[#778873]">BUDGET UTILIZATION</span>
              <span className={statusColor}>{percentUsed}% USED</span>
            </div>

            {/* Progress Track */}
            <div className="w-full h-3 bg-[#DCCFC0]/60 rounded-full overflow-hidden mb-3 border border-[#DCCFC0]/80">
              <div
                className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                style={{ width: `${Math.min(percentUsed, 100)}%` }}
              />
            </div>

            {/* Salary Breakdown Row */}
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold pt-2.5 border-t border-[#DCCFC0]">
              <div className="flex items-center gap-1.5 text-[#2B382A]">
                <Wallet className="w-4 h-4 text-[#778873]" />
                <span>Salary: <strong className="text-[#2B382A] text-sm">₹{salaryValue.toLocaleString("en-IN")}</strong></span>
              </div>
              <div className="text-right">
                <span className="text-[#778873]">Remaining: </span>
                <strong className={`text-sm ${remaining < 0 ? "text-rose-600 font-black" : "text-emerald-700 font-black"}`}>
                  {remaining < 0 ? "-" : ""}₹{Math.abs(remaining).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            {remaining < 0 && (
              <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500" />
                <span>⚠️ Projected to exceed budget by ₹{Math.abs(remaining).toLocaleString("en-IN")}!</span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-[#FDF6ED]/60 border border-[#DCCFC0] text-center mb-4">
            <p className="text-xs sm:text-sm font-bold text-[#778873]">
              Set your monthly salary above to activate real-time budget forecasting & health metrics!
            </p>
          </div>
        )}
      </div>

      {/* Footer Quick Salary Modifier */}
      <div className="pt-3 border-t border-[#DCCFC0] flex items-center justify-between text-xs font-bold text-[#778873]">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-[#587053]" />
          <span>Predictive AI Active</span>
        </span>

        {editingSalary ? (
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              placeholder="Salary"
              value={salaryInput}
              onChange={(e) => setSalaryInput(e.target.value)}
              className="w-28 px-2.5 py-1 bg-white border border-[#DCCFC0] focus:border-[#587053] rounded-lg text-xs font-bold text-[#2B382A] focus:outline-none"
            />
            <button
              onClick={handleSave}
              className="p-1.5 rounded-lg bg-[#587053] text-white font-bold cursor-pointer hover:bg-[#495E45]"
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
            className="flex items-center gap-1 text-[#587053] hover:text-[#2B382A] font-extrabold transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{salaryValue > 0 ? "Modify Budget" : "Set Budget"}</span>
          </button>
        )}
      </div>
    </div>
  );
}