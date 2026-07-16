import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@makasanaroom.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Incorrect email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-ochre-100 flex items-center justify-center mx-auto mb-4">
            <Lock size={20} className="text-ochre-700" />
          </div>
          <h1 className="font-display text-2xl">Admin Login</h1>
          <p className="text-sm text-ink/50 mt-1">Manage bookings, services, and your team.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-ochre-100 rounded-2xl p-6 shadow-soft">
          <div>
            <label className="text-xs text-ink/50 mb-1 block">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-ochre-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ochre-400"
            />
          </div>
          <div>
            <label className="text-xs text-ink/50 mb-1 block">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-ochre-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ochre-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-ochre-600 hover:bg-ochre-700 disabled:opacity-60 text-cream py-3 rounded-xl font-medium transition-colors"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Sign In
          </button>
          <p className="text-[11px] text-ink/40 text-center">
            Demo credentials: admin@makasanaroom.com / MakasanaAdmin123!
          </p>
        </form>
      </div>
    </div>
  );
}
