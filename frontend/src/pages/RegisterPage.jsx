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

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.email.split("@")[0],
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Registration failed");
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

  const getStrength = () => {
    const p = form.password;
    if (!p) return { level: 0, label: "", color: "" };
    if (p.length < 6) return { level: 1, label: "Too short", color: "bg-rose-500" };
    if (p.length < 8) return { level: 2, label: "Weak", color: "bg-orange-400" };
    if (!/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { level: 3, label: "Fair", color: "bg-yellow-400" };
    return { level: 4, label: "Strong", color: "bg-green-400" };
  };

  const strength = getStrength();

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 relative overflow-hidden">

      {/* Ambient blobs */}
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
            Join millions<br />sharing their<br />
            <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              best moments.
            </span>
          </h2>
          <p className="text-neutral-400 text-base mb-8 leading-relaxed">
            Create an account and start sharing photos, following friends, and discovering new content.
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
            <p className="text-neutral-500 text-sm mt-1 text-center">Sign up to see photos & videos<br />from your friends.</p>
          </div>

          {/* Form card */}
          <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-2xl p-8 shadow-2xl">

            <div className="hidden lg:block mb-6">
              <h3 className="text-white text-xl font-semibold">Create account</h3>
              <p className="text-neutral-500 text-sm mt-1">Sign up to get started.</p>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4" autoComplete="off">
              {/* Hidden dummy inputs to catch browser autofill */}
              <input
                type="text"
                name="username"
                autoComplete="username"
                tabIndex="-1"
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', top: '0' }}
              />
              <input
                type="password"
                name="current-password"
                autoComplete="current-password"
                tabIndex="-1"
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', top: '0' }}
              />

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  autoComplete="off"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-800/80 border border-neutral-700 text-white placeholder-neutral-600 text-sm outline-none focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/10 transition-all duration-200"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5 uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-800/80 border border-neutral-700 text-white placeholder-neutral-600 text-sm outline-none focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/10 transition-all duration-200"
                />
                {form.password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${i <= strength.level ? strength.color : "bg-neutral-700"}`} />
                      ))}
                    </div>
                    <p className="text-xs text-neutral-500">{strength.label}</p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5 uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                    className={`w-full px-4 py-3 rounded-xl bg-neutral-800/80 border text-white placeholder-neutral-600 text-sm outline-none focus:ring-2 transition-all duration-200 ${
                      form.confirmPassword && form.password !== form.confirmPassword
                        ? "border-rose-500/60 focus:ring-rose-500/10"
                        : form.confirmPassword && form.password === form.confirmPassword
                        ? "border-green-500/60 focus:ring-green-500/10"
                        : "border-neutral-700 focus:border-pink-500/60 focus:ring-pink-500/10"
                    }`}
                  />
                  {form.confirmPassword && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2">
                      {form.password === form.confirmPassword ? (
                        <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </span>
                  )}
                </div>
              </div>

              {/* Terms */}
              <p className="text-xs text-neutral-600 text-center leading-relaxed">
                By signing up, you agree to our{" "}
                <span className="text-neutral-400">Terms</span>,{" "}
                <span className="text-neutral-400">Privacy Policy</span> and{" "}
                <span className="text-neutral-400">Cookies Policy</span>.
              </p>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:opacity-90 shadow-lg shadow-pink-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Creating account...
                  </span>
                ) : "Create new account"}
              </button>
            </form>
          </div>

          {/* Sign in link */}
          <div className="text-center mt-5">
            <p className="text-neutral-500 text-sm">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-pink-500 font-semibold hover:text-pink-400 transition-colors cursor-pointer"
              >
                Sign in
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}