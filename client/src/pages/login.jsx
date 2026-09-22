import { useContext, useState } from "react";
import API from "../api";
import { AuthContext } from "../content";
import loginBg from "../assets/ChatGPT Image Feb 15, 2026, 01_44_55 PM.png";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle,
  Shield,
  Coins,
  BarChart3
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
          alert("Account registered successfully! Please sign in.");
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
        (isRegister ? "Registration failed. Email may already be in use." : "Invalid credentials. Please verify your email and password.")
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
      {/* Editorial dark glass overlay preserving the painting background */}
      <div className="absolute inset-0 bg-[#070b14]/75 backdrop-blur-[2px]" />

      {/* Main Container */}
      <div className="relative w-full max-w-md z-10">
        {/* Header Title with Editorial Serif Typography */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-medium tracking-widest uppercase mb-3">
            Financial Ledger & Insights
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-amber-100 font-bold tracking-wider italic">
            Expenses Tracker
          </h1>
          <p className="text-slate-300/80 text-xs sm:text-sm mt-2 tracking-wide font-light">
            Private Capital Management & Spending Analysis
          </p>
        </div>

        {/* Wealth / Luxury Fintech Glass Card */}
        <div className="backdrop-blur-xl bg-[#0e1626]/85 border border-amber-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60 transition-all duration-300">
          {/* Sign In vs Register Tabs */}
          <div className="flex p-1 bg-[#090e18]/80 rounded-xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setError(""); }}
              className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                !isRegister 
                  ? "bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] text-slate-950 font-bold shadow-md shadow-amber-950/40" 
                  : "text-slate-400 hover:text-amber-200"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setError(""); }}
              className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                isRegister 
                  ? "bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] text-slate-950 font-bold shadow-md shadow-amber-950/40" 
                  : "text-slate-400 hover:text-amber-200"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400/60">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#080d16]/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/80 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 tracking-wide">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400/60">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#080d16]/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/80 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f7e7a9] to-[#d4af37] hover:brightness-110 text-slate-950 font-bold text-sm shadow-lg shadow-amber-950/40 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-900/40 border-t-slate-900 rounded-full animate-spin" />
              ) : (
                <>
                  <span className="tracking-wide">{isRegister ? "Open Ledger Account" : "Access Portfolio"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Understated Luxury Badges */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-slate-400 text-[11px]">
            <div className="flex flex-col items-center gap-1">
              <Coins className="w-4 h-4 text-amber-400/80" />
              <span>Capital Health</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <BarChart3 className="w-4 h-4 text-amber-400/80" />
              <span>Asset Analytics</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Shield className="w-4 h-4 text-amber-400/80" />
              <span>Confidential</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}