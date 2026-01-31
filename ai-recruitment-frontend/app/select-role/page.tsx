"use client";

import { API_URL } from "@/lib/config";
import Cookies from "js-cookie";
import { Briefcase, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function SelectRoleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<"candidate" | "recruiter">("recruiter");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const data = searchParams.get("data");
    if (data) {
      try {
        const decoded = JSON.parse(decodeURIComponent(data));
        setUserData(decoded);
      } catch (e) {
        console.error("Failed to parse user data:", e);
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [searchParams, router]);

  const handleSubmit = async () => {
    if (!userData) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/google/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...userData,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Terjadi kesalahan.");
      }

      // Save token
      Cookies.set("token", data.accessToken, {
        expires: 1,
        path: "/",
        sameSite: "lax",
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("userRole", role);
      }

      // Redirect based on role
      const redirectPath =
        role === "candidate" ? "/dashboard/candidate" : "/dashboard";
      window.location.href = redirectPath;
    } catch (err: any) {
      console.error("Error completing registration:", err);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome, {userData.name}!
          </h1>
          <p className="text-gray-600">
            Please select your role to complete registration
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setRole("candidate")}
            className={`p-6 rounded-xl border-2 text-left transition-all duration-200 ${
              role === "candidate"
                ? "border-blue-600 bg-blue-50/50"
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <div
              className={`mb-3 ${role === "candidate" ? "text-blue-600" : "text-gray-400"}`}
            >
              <User className="w-8 h-8" />
            </div>
            <div className="font-bold text-gray-900">Candidate</div>
            <div className="text-xs text-gray-500 mt-1">
              I'm looking for a job
            </div>
          </button>

          <button
            type="button"
            onClick={() => setRole("recruiter")}
            className={`p-6 rounded-xl border-2 text-left transition-all duration-200 ${
              role === "recruiter"
                ? "border-blue-600 bg-blue-50/50"
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <div
              className={`mb-3 ${role === "recruiter" ? "text-blue-600" : "text-gray-400"}`}
            >
              <Briefcase className="w-8 h-8" />
            </div>
            <div className="font-bold text-gray-900">Recruiter</div>
            <div className="text-xs text-gray-500 mt-1">I'm hiring talent</div>
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-lg shadow-gray-900/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Continue"}
        </button>
      </div>
    </div>
  );
}

export default function SelectRole() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-gray-50">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      }
    >
      <SelectRoleContent />
    </Suspense>
  );
}
