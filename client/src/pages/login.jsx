import { useContext, useState } from "react";
import API from "../api";
import { AuthContext } from "../content";
import loginBg from "../assets/ChatGPT Image Feb 15, 2026, 01_44_55 PM.png";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle,
  TrendingUp,
  PieChart,
  ShieldCheck
} from "lucide-react";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        const res = await API.post("/auth/register", data);
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          login(res.data.token);
        } else {
          setIsRegister(false);
          alert("Account created successfully! Please sign in.");
        }
      } else {
        const res = await API.post("/auth/login", data);
        localStorage.setItem("token", res.data.token);
        login(res.data.token);
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(
        err.response?.data?.message || 
        (isRegister ? "Registration failed. Email may already be in use." : "Invalid email or password.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: `url("${loginBg}")` }}
    >
      {/* Light translucent warm overlay preserving artwork while maximizing clarity */}
      <div className="absolute inset-0 bg-[#FDF6ED]/45 backdrop-blur-[2px]" />

      {/* Main Container */}
      <div className="relative w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#778873] uppercase drop-shadow-sm">
            AI Expenses Tracker
          </h1>
          <p className="text-[#2B382A] font-semibold text-sm sm:text-base mt-1.5">
            Smart Budgeting & Real-Time Financial Ledger
          </p>
        </div>

        {/* Crisp Warm Frosted Glass Card */}
        <div className="backdrop-blur-2xl bg-[#FDF6ED]/95 border-2 border-[#DCCFC0] rounded-3xl p-7 sm:p-8 shadow-2xl shadow-[#778873]/25">
          {/* Segmented Control Tabs */}
          <div className="flex p-1.5 bg-[#DCCFC0]/40 rounded-2xl border border-[#DCCFC0] mb-6">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setError(""); }}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                !isRegister 
                  ? "bg-[#778873] text-[#FDF6ED] shadow-md shadow-[#778873]/30" 
                  : "text-[#778873] hover:text-[#2B382A]"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setError(""); }}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                isRegister 
                  ? "bg-[#778873] text-[#FDF6ED] shadow-md shadow-[#778873]/30" 
                  : "text-[#778873] hover:text-[#2B382A]"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-700 font-semibold text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#778873] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#778873]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-[#DCCFC0] focus:border-[#778873] focus:ring-2 focus:ring-[#A1BC98]/40 rounded-xl text-[#2B382A] placeholder-[#778873]/50 text-sm font-semibold transition-all shadow-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#778873] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#778873]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-[#DCCFC0] focus:border-[#778873] focus:ring-2 focus:ring-[#A1BC98]/40 rounded-xl text-[#2B382A] placeholder-[#778873]/50 text-sm font-semibold transition-all shadow-sm focus:outline-none"
                />
              </div>
            </div>

            {/* High Visibility Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 px-4 rounded-xl bg-gradient-to-r from-[#778873] to-[#A1BC98] hover:from-[#657561] hover:to-[#8ea986] text-white font-black text-sm sm:text-base tracking-wide shadow-lg shadow-[#778873]/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isRegister ? "REGISTER ACCOUNT" : "LOGIN TO DASHBOARD"}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Highlights */}
          <div className="mt-8 pt-5 border-t border-[#DCCFC0] grid grid-cols-3 gap-2 text-center text-[#778873] text-xs font-bold">
            <div className="flex flex-col items-center gap-1">
              <TrendingUp className="w-4 h-4 text-[#778873]" />
              <span>Predictions</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <PieChart className="w-4 h-4 text-[#778873]" />
              <span>Analytics</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#778873]" />
              <span>Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}