"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // State untuk Mode (Login vs Register)
  const [isRegister, setIsRegister] = useState(false);

  // State Form
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  // State UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handler Login Google
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  // Handler Submit Form (Login/Register Manual)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Tentukan mau nembak endpoint mana
    const endpoint = isRegister ? "register" : "login";

    try {
      const res = await fetch(`http://localhost:3000/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Terjadi kesalahan.");
      }

      // Jika sukses: Simpan Token & Pindah Halaman
      Cookies.set("token", data.accessToken, { expires: 1 });
      alert(isRegister ? "Registrasi Berhasil!" : "Login Berhasil!");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white p-4 font-sans">
      <div className="w-full max-w-md bg-gray-900/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-800">
        {/* JUDUL */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-2">
            AI Recruitment
          </h1>
          <p className="text-gray-400 text-sm">
            {isRegister
              ? "Buat akun recruiter baru dalam hitungan detik."
              : "Masuk untuk mengelola kandidat pelamar."}
          </p>
        </div>

        {/* ALERT ERROR */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* FORM INPUT */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Input Nama (Hanya muncul saat Register) */}
          {isRegister && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Contoh: Budi Santoso"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          )}

          {/* Input Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Email Profesional
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="hr@perusahaan.com"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* Input Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="••••••••"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {/* TOMBOL SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>{" "}
                Loading...
              </span>
            ) : isRegister ? (
              "Daftar Sekarang"
            ) : (
              "Masuk ke Dashboard"
            )}
          </button>
        </form>

        {/* PEMBATAS */}
        <div className="relative flex items-center py-6">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="flex-shrink-0 mx-4 text-gray-500 text-xs">
            ATAU LANJUT DENGAN
          </span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        {/* TOMBOL GOOGLE */}
        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-lg transition flex items-center justify-center gap-3 cursor-pointer"
        >
          <img
            src="https://authjs.dev/img/providers/google.svg"
            className="w-5 h-5"
            alt="Google Logo"
          />
          {isRegister ? "Daftar dengan Google" : "Masuk dengan Google"}
        </button>

        {/* SWITCH LOGIN/REGISTER */}
        <p className="mt-8 text-center text-sm text-gray-400">
          {isRegister ? "Sudah punya akun? " : "Belum punya akun? "}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError(""); // Reset error saat pindah mode
            }}
            className="text-blue-400 hover:text-blue-300 font-semibold hover:underline cursor-pointer transition"
          >
            {isRegister ? "Login di sini" : "Buat akun sekarang"}
          </button>
        </p>
      </div>
    </main>
  );
}
