"use client";

import { API_URL } from "@/lib/config";
import Cookies from "js-cookie";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Terjadi kesalahan.");
      }

      // Clear old user data first
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
      Object.keys(Cookies.get()).forEach((cookieName) => {
        Cookies.remove(cookieName);
      });

      // Set new token
      Cookies.set("token", data.accessToken, { expires: 1 });

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("userRole", "candidate");
        localStorage.setItem("userName", data.user.name || form.name);
        localStorage.setItem("userEmail", data.user.email || form.email);
      }

      console.log("✅ Register success! Role: candidate");

      // Redirect to candidate dashboard
      window.location.href = "/dashboard/candidate";
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

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-700">Full Name</label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
            placeholder="e.g. John Doe"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

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

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-lg shadow-gray-900/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <span>Loading...</span>
          ) : (
            <>
              Create Account
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        {/* Want to be a recruiter link */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => (window.location.href = "/become-recruiter")}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
          >
            Want to be a recruiter? Apply here
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">
              or continue with
            </span>
          </div>
        </div>

        {/* Google Sign-Up Button */}
        <button
          type="button"
          onClick={() => {
            const apiUrl = (
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
            ).replace(/\/$/, "");
            window.location.href = `${apiUrl}/auth/google`;
          }}
          className="w-full py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl border border-gray-200 transition-all flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>
      </form>
    </div>
  );
}
