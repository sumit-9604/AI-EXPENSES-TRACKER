import { useContext, useState } from "react";
import API from "../api";
import { AuthContext } from "../content";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle,
  CreditCard,
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
          alert("Account created successfully. Please sign in.");
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
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#09090b] text-zinc-100 overflow-hidden">
      {/* Subtle Apple-style radial ambient light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zinc-800/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-sm z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-zinc-900 border border-white/[0.08] flex items-center justify-center text-zinc-100 shadow-lg shadow-black/40">
            <CreditCard className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Expenses
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Personal finance and budget tracking
          </p>
        </div>

        {/* Frosted Glass Card */}
        <div className="backdrop-blur-2xl bg-zinc-900/60 border border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/60">
          {/* Segmented Control */}
          <div className="flex p-1 bg-zinc-950/70 rounded-xl border border-white/[0.06] mb-5">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setError(""); }}
              className={`flex-1 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
                !isRegister 
                  ? "bg-zinc-800 text-white shadow-sm border border-white/[0.08]" 
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setError(""); }}
              className={`flex-1 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
                isRegister 
                  ? "bg-zinc-800 text-white shadow-sm border border-white/[0.08]" 
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Register
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 flex items-start gap-2.5 p-3 rounded-xl bg-rose-950/30 border border-rose-500/20 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-950/80 border border-white/[0.08] rounded-xl text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-950/80 border border-white/[0.08] rounded-xl text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
                />
              </div>
            </div>

            {/* Apple-style primary white button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-semibold text-sm shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isRegister ? "Create Account" : "Continue"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Minimalist Feature Icons */}
          <div className="mt-6 pt-5 border-t border-white/[0.06] grid grid-cols-3 gap-2 text-center text-zinc-400 text-[11px]">
            <div className="flex flex-col items-center gap-1">
              <CreditCard className="w-4 h-4 text-zinc-300" />
              <span>Spending</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <PieChart className="w-4 h-4 text-zinc-300" />
              <span>Insights</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-zinc-300" />
              <span>Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}