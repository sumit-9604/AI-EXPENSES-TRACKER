import { useContext, useState } from "react";
import API from "../api";
import { AuthContext } from "../content";
import loginBg from "../assets/ChatGPT Image Feb 15, 2026, 01_44_55 PM.png";
import { 
  Sparkles, 
  Mail, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  PieChart, 
  Wallet,
  AlertCircle
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
        // Register flow
        const res = await API.post("/auth/register", data);
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          login(res.data.token);
        } else {
          // If register returns message, switch to login
          setIsRegister(false);
          alert("Account created successfully! Please sign in.");
        }
      } else {
        // Login flow
        const res = await API.post("/auth/login", data);
        localStorage.setItem("token", res.data.token);
        login(res.data.token);
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(
        err.response?.data?.message || 
        (isRegister ? "Registration failed. Email might already exist." : "Invalid email or password.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: `url("${loginBg}")` }}
    >
      {/* Background dark glass overlay ensuring text readability and contrast */}
      <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px]" />

      {/* Dynamic ambient glowing background gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-md z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wide uppercase shadow-sm mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Personal Finance
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Expense<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Tracker</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Predict, analyze, and master your monthly budget with AI
          </p>
        </div>

        {/* Glassmorphic Auth Card */}
        <div className="backdrop-blur-xl bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/30 transition-all duration-300">
          {/* Mode Switcher Tabs */}
          <div className="flex p-1 bg-slate-950/70 rounded-xl border border-slate-800/80 mb-6">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setError(""); }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                !isRegister 
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setError(""); }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                isRegister 
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:via-indigo-400 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isRegister ? "Create Free Account" : "Sign In to Dashboard"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Features List */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-slate-400 text-[11px]">
            <div className="flex flex-col items-center gap-1">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>AI Predictions</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <PieChart className="w-4 h-4 text-indigo-400" />
              <span>Smart Charts</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Secure Data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}