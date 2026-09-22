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

  let statusColor = "text-[#778873]";
  let statusBg = "bg-[#A1BC98]/20 border-2 border-[#A1BC98]";
  let progressColor = "bg-gradient-to-r from-[#778873] to-[#A1BC98]";
  let statusText = "WITHIN BUDGET";

  if (remaining < 0) {
    statusColor = "text-rose-700";
    statusBg = "bg-rose-100 border-2 border-rose-300";
    progressColor = "bg-gradient-to-r from-rose-500 to-red-500";
    statusText = "OVER BUDGET";
  } else if (percentUsed >= 85) {
    statusColor = "text-amber-800";
    statusBg = "bg-amber-100 border-2 border-amber-300";
    progressColor = "bg-gradient-to-r from-amber-500 to-orange-400";
    statusText = "NEAR LIMIT";
  }

  const handleSave = () => {
    if (onUpdateSalary && Number(salaryInput) > 0) {
      onUpdateSalary(Number(salaryInput));
    }
    setEditingSalary(false);
  };

  return (
    <div className="h-full flex flex-col justify-between backdrop-blur-xl bg-[#FDF6ED]/95 border-2 border-[#DCCFC0] rounded-3xl p-6 shadow-xl shadow-[#778873]/10">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#778873] tracking-wide uppercase">
              Budget & AI Prediction
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-[#2B382A]">Current Outflow & Monthly Forecast</p>
          </div>

          <div className={`px-3 py-1 rounded-full text-xs font-black border flex items-center gap-1.5 ${statusBg} ${statusColor}`}>
            <span className="w-2 h-2 rounded-full bg-current" />
            {statusText}
          </div>
        </div>

        {/* Highlight Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
          {/* Predicted Month-End */}
          <div className="p-4 rounded-2xl bg-white border-2 border-[#DCCFC0] shadow-sm">
            <div className="flex items-center justify-between text-[#778873] text-xs font-bold mb-1">
              <span>PREDICTED EXPENSES</span>
              <Activity className="w-4 h-4 text-[#778873]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#2B382A]">
              ₹{predValue.toLocaleString("en-IN")}
            </div>
            <span className="text-xs font-semibold text-[#778873] mt-1 block">Expected month-end total</span>
          </div>

          {/* Current Spent */}
          <div className="p-4 rounded-2xl bg-white border-2 border-[#DCCFC0] shadow-sm">
            <div className="flex items-center justify-between text-[#778873] text-xs font-bold mb-1">
              <span>TOTAL SPENT TILL NOW</span>
              <TrendingUp className="w-4 h-4 text-[#778873]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#778873]">
              ₹{totalValue.toLocaleString("en-IN")}
            </div>
            <span className="text-xs font-semibold text-[#778873] mt-1 block">Actual recorded outflow</span>
          </div>
        </div>

        {/* Budget Progress & Health */}
        {salaryValue > 0 ? (
          <div className="p-4 rounded-2xl bg-white border-2 border-[#DCCFC0] shadow-sm mb-4">
            <div className="flex items-center justify-between text-xs sm:text-sm font-black mb-2">
              <span className="text-[#778873]">BUDGET UTILIZATION</span>
              <span className={statusColor}>{percentUsed}% USED</span>
            </div>

            {/* Progress Track */}
            <div className="w-full h-3 bg-[#DCCFC0]/40 rounded-full overflow-hidden mb-3 border border-[#DCCFC0]">
              <div
                className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                style={{ width: `${Math.min(percentUsed, 100)}%` }}
              />
            </div>

            {/* Salary Breakdown Row */}
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold pt-2 border-t border-[#DCCFC0]">
              <div className="flex items-center gap-1.5 text-[#2B382A]">
                <Wallet className="w-4 h-4 text-[#778873]" />
                <span>Salary: <strong className="text-[#2B382A] text-sm">₹{salaryValue.toLocaleString("en-IN")}</strong></span>
              </div>
              <div className="text-right">
                <span className="text-[#778873]">Remaining: </span>
                <strong className={`text-sm ${remaining < 0 ? "text-rose-600" : "text-emerald-700"}`}>
                  {remaining < 0 ? "-" : ""}₹{Math.abs(remaining).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            {remaining < 0 && (
              <div className="mt-3 flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500" />
                <span>⚠️ Over budget by ₹{Math.abs(remaining).toLocaleString("en-IN")}!</span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-white border-2 border-[#DCCFC0] text-center mb-4">
            <p className="text-xs sm:text-sm font-bold text-[#778873]">
              Enter your monthly salary above to activate real-time budget forecasting!
            </p>
          </div>
        )}
      </div>

      {/* Footer Quick Salary Modifier */}
      <div className="pt-3 border-t border-[#DCCFC0] flex items-center justify-between text-xs font-bold text-[#778873]">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-[#778873]" />
          AI Model Active
        </span>

        {editingSalary ? (
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              placeholder="Salary"
              value={salaryInput}
              onChange={(e) => setSalaryInput(e.target.value)}
              className="w-28 px-2.5 py-1 bg-white border-2 border-[#DCCFC0] focus:border-[#778873] rounded-lg text-xs font-bold text-[#2B382A] focus:outline-none"
            />
            <button
              onClick={handleSave}
              className="p-1.5 rounded-lg bg-[#778873] text-white font-bold cursor-pointer hover:bg-[#657561]"
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
            className="flex items-center gap-1 text-[#778873] hover:text-[#2B382A] transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{salaryValue > 0 ? "Edit Salary" : "Set Salary"}</span>
          </button>
        )}
      </div>
    </div>
  );
}