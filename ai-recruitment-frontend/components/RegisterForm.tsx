"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, User, Briefcase } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const [role, setRole] = useState<"candidate" | "recruiter">("recruiter");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = { ...form, role };

      const res = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Terjadi kesalahan.");
      }

      Cookies.set("token", data.accessToken, { expires: 1 });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* ROLE SELECTION */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          type="button"
          onClick={() => setRole("candidate")}
          className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
            role === "candidate"
              ? "border-blue-600 bg-blue-50/50"
              : "border-gray-100 hover:border-gray-200"
          }`}>
          <div
            className={`mb-3 ${role === "candidate" ? "text-blue-600" : "text-gray-400"}`}>
            <User className="w-6 h-6" />
          </div>
          <div className="font-bold text-gray-900 text-sm">Candidate</div>
          <div className="text-xs text-gray-500 mt-1">
            I'm looking for a job
          </div>
        </button>

        <button
          type="button"
          onClick={() => setRole("recruiter")}
          className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
            role === "recruiter"
              ? "border-blue-600 bg-blue-50/50"
              : "border-gray-100 hover:border-gray-200"
          }`}>
          <div
            className={`mb-3 ${role === "recruiter" ? "text-blue-600" : "text-gray-400"}`}>
            <Briefcase className="w-6 h-6" />
          </div>
          <div className="font-bold text-gray-900 text-sm">Recruiter</div>
          <div className="text-xs text-gray-500 mt-1">I'm hiring talent</div>
        </button>
      </div>

      {/* ERROR ALERT */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2">
          <span className="font-bold">Error:</span> {error}
        </div>
      )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5">
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
          className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-lg shadow-gray-900/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {loading ? (
            <span>Loading...</span>
          ) : (
            <>
              Create Account
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
