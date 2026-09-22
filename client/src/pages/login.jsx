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
      {/* Light translucent overlay that preserves the painting's natural visibility */}
      <div className="absolute inset-0 bg-[#0A192F]/30 backdrop-blur-[1px]" />

      {/* Main Container */}
      <div className="relative w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-black tracking-wider text-[#38BDF8] drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] uppercase">
            AI Expenses Tracker
          </h1>
          <p className="text-white font-bold text-sm sm:text-base mt-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            Smart Financial Management & Real-Time Analytics
          </p>
        </div>

        {/* High-Visibility Frosted Glass Card */}
        <div className="backdrop-blur-xl bg-[#0A192F]/90 border-2 border-[#38BDF8] rounded-3xl p-7 sm:p-8 shadow-[0_8px_32px_rgba(56,189,248,0.4)]">
          {/* Segmented Control Tabs */}
          <div className="flex p-1.5 bg-[#050D1A] rounded-2xl border border-sky-400/40 mb-6">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setError(""); }}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                !isRegister 
                  ? "bg-[#38BDF8] text-slate-950 shadow-md shadow-sky-400/40" 
                  : "text-sky-200 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setError(""); }}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                isRegister 
                  ? "bg-[#38BDF8] text-slate-950 shadow-md shadow-sky-400/40" 
                  : "text-sky-200 hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 p-3 rounded-xl bg-red-500/20 border-2 border-red-500/50 text-red-200 font-semibold text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-sky-200 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-[#050D1A] border-2 border-sky-400/60 rounded-xl text-white placeholder-sky-300/60 text-sm font-bold focus:outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-300/40 transition-all shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-sky-200 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-[#050D1A] border-2 border-sky-400/60 rounded-xl text-white placeholder-sky-300/60 text-sm font-bold focus:outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-300/40 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* High Visibility Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-300 hover:to-cyan-300 text-slate-950 font-black text-sm sm:text-base tracking-wide shadow-[0_0_20px_rgba(56,189,248,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isRegister ? "REGISTER ACCOUNT" : "LOGIN TO DASHBOARD"}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Highlights */}
          <div className="mt-8 pt-5 border-t border-sky-400/30 grid grid-cols-3 gap-2 text-center text-sky-200 text-xs font-bold">
            <div className="flex flex-col items-center gap-1">
              <TrendingUp className="w-4 h-4 text-sky-300" />
              <span>Predictions</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <PieChart className="w-4 h-4 text-sky-300" />
              <span>Live Charts</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-sky-300" />
              <span>Protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}