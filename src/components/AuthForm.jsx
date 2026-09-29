import { useState } from "react";
import { supabase } from "../lib/supabase";

function AuthForm() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    if (mode === "register") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      setMessage(
        "Registrasi berhasil. Silakan cek email jika verifikasi aktif.",
      );
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("LOGIN DATA:", data);
      console.log("LOGIN ERROR:", error);

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-sky-50 to-fuchsia-50 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white/80 p-6 shadow-xl backdrop-blur-xl">
        <h1 className="text-2xl font-bold text-slate-800">Finance Tracker</h1>

        <p className="mt-1 text-sm text-slate-500">
          {mode === "login" ? "Masuk ke akunmu" : "Buat akun baru"}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          {message && <p className="text-sm text-slate-500">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 py-3 font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Memproses..." : mode === "login" ? "Login" : "Register"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="mt-4 w-full text-sm font-medium text-indigo-500"
        >
          {mode === "login"
            ? "Belum punya akun? Register"
            : "Sudah punya akun? Login"}
        </button>
      </div>
    </div>
  );
}

export default AuthForm;
