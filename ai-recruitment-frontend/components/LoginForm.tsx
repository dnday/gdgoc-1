"use client";

import Cookies from "js-cookie";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Terjadi kesalahan.");
      }

      // Set cookie with proper settings
      Cookies.set("token", data.accessToken, {
        expires: 1,
        path: "/",
        sameSite: "lax",
      });

      // Also save to localStorage as fallback
      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("userRole", data.user?.role || "recruiter");
      }

      console.log("✅ Login success!");
      console.log("Token saved:", data.accessToken.substring(0, 20) + "...");
      console.log("User role:", data.user?.role);
      console.log("Cookie set:", Cookies.get("token") ? "YES" : "NO");

      // Redirect berdasarkan role dari response
      const userRole = data.user?.role || "recruiter";
      const redirectPath =
        userRole === "candidate" ? "/dashboard/candidate" : "/dashboard";

      console.log("Redirecting to:", redirectPath);
      
      // Use window.location for more reliable redirect
      window.location.href = redirectPath;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* ERROR ALERT */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2">
          <span className="font-bold">Error:</span> {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-700">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              required
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
              placeholder="name@company.com"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-700">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type="password"
              required
              minLength={6}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
              placeholder="••••••••"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="text-sm font-bold text-blue-600 hover:text-blue-700">
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-lg shadow-gray-900/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {loading ? (
            <span>Loading...</span>
          ) : (
            <>
              Sign In
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        {/* Info: Google OAuth only on Register page */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 font-bold hover:text-blue-700">
            Register here
          </a>
        </p>
      </form>
    </div>
  );
}
