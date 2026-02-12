import { useState } from "react";
import { useNavigate } from "react-router-dom";

const POSTS = [
  {
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
    label: "🌅 Sunrise hike",
  },
  {
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80",
    label: "🎶 Live music",
  },
  {
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
    label: "🍜 Food tour",
  },
];

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }
      localStorage.setItem("token", data.token);
      navigate("/home");
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-rose-600/20 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-purple-600/20 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-6 flex flex-col lg:flex-row items-center gap-10 lg:gap-20">

        {/* LEFT SIDE - desktop only */}
        <div className="hidden lg:flex flex-col flex-1 text-white">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <span className="text-2xl font-bold" style={{ fontFamily: "'Georgia', serif" }}>Instagram</span>
          </div>
          <h2 className="text-5xl font-bold leading-tight mb-4">
            See everyday<br />moments from<br />
            <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              your close friends.
            </span>
          </h2>
          <p className="text-neutral-400 text-base mb-8 leading-relaxed">
            Share photos and videos, follow friends, and explore what's happening around you.
          </p>
          <div className="flex gap-3">
            {POSTS.map((post, i) => (
              <div key={i} className="flex-1 rounded-2xl overflow-hidden relative group shadow-xl" style={{ height: "180px" }}>
                <img src={post.image} alt={post.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-xs font-semibold">{post.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE - Form */}
        <div className="w-full lg:w-[380px] flex-shrink-0 flex flex-col">

          {/* Mobile logo */}
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/30 mb-4">
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-white" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Georgia', serif" }}>Instagram</h1>
            <p className="text-neutral-500 text-sm mt-1">Sign in to see photos & videos</p>
          </div>

          <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-2xl p-8 shadow-2xl">
            <div className="hidden lg:block mb-6">
              <h3 className="text-white text-xl font-semibold">Sign in</h3>
              <p className="text-neutral-500 text-sm mt-1">Welcome back!</p>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5 uppercase tracking-wider">Email or Username</label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Email or username"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-neutral-800/80 border border-neutral-700 text-white placeholder-neutral-600 text-sm outline-none focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/10 transition-all duration-200"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider">Password</label>
                  <a href="#" className="text-xs text-pink-500 hover:text-pink-400 transition-colors">Forgot password?</a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-neutral-800/80 border border-neutral-700 text-white placeholder-neutral-600 text-sm outline-none focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/10 transition-all duration-200"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:opacity-90 shadow-lg shadow-pink-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Signing in...
                  </span>
                ) : "Sign in"}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-neutral-800" />
              <span className="text-xs text-neutral-600 uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-neutral-800" />
            </div>

            <button className="w-full py-3 rounded-xl border border-neutral-700 text-neutral-400 text-sm font-medium hover:border-neutral-600 hover:text-neutral-300 hover:bg-neutral-800/50 transition-all duration-200 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.26 9.77A7.49 7.49 0 0112 4.5c1.93 0 3.68.72 5.01 1.9l3.73-3.73A11.97 11.97 0 0012 0C7.35 0 3.34 2.67 1.24 6.58l4.02 3.19z"/>
                <path fill="#34A853" d="M16.04 18.01A7.47 7.47 0 0112 19.5c-3.06 0-5.7-1.84-6.94-4.5l-4.03 3.11C3.23 21.28 7.3 24 12 24c3.24 0 6.17-1.21 8.4-3.2l-4.36-2.79z"/>
                <path fill="#FBBC05" d="M19.5 12c0-.68-.07-1.35-.18-2H12v3.8h4.23a3.72 3.72 0 01-1.6 2.44l4.36 2.79C20.7 17.01 21.5 14.65 21.5 12H19.5z"/>
                <path fill="#4285F4" d="M12 7.8h7.32a12.04 12.04 0 00-.18-2H12V7.8zm-6.94 6.7A7.5 7.5 0 014.5 12c0-.77.12-1.52.32-2.23L.8 6.58A11.97 11.97 0 000 12c0 1.93.46 3.75 1.24 5.35l3.82-2.85z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="text-center mt-5">
            <p className="text-neutral-500 text-sm">
              Don't have an account?{" "}
              <button onClick={() => navigate("/register")} className="text-pink-500 font-semibold hover:text-pink-400 transition-colors">
                Sign up
              </button>
            </p>
          </div>

          <div className="text-center mt-6 space-y-2">
            <p className="text-neutral-600 text-xs">Get the app.</p>
            <div className="flex justify-center gap-3">
              <div className="px-3 py-1.5 rounded-lg border border-neutral-800 text-neutral-500 text-xs hover:border-neutral-700 cursor-pointer">App Store</div>
              <div className="px-3 py-1.5 rounded-lg border border-neutral-800 text-neutral-500 text-xs hover:border-neutral-700 cursor-pointer">Google Play</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}