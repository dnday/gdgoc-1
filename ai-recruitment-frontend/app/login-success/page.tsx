"use client";

import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function LoginSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const roleFromUrl = searchParams.get("role");
    const redirect = searchParams.get("redirect");

    if (token) {
      // Simpan token ke Cookie (berlaku 1 hari)
      Cookies.set("token", token, {
        expires: 1,
        path: "/",
        sameSite: "lax",
      });

      // Get role from URL or localStorage (for Google OAuth from register page)
      let finalRole = roleFromUrl;
      if (!finalRole && typeof window !== "undefined") {
        const pendingRole = localStorage.getItem("pendingRole");
        if (pendingRole) {
          finalRole = pendingRole;
          localStorage.removeItem("pendingRole"); // Clean up
        }
      }

      // Save to localStorage
      if (typeof window !== "undefined" && finalRole) {
        localStorage.setItem("userRole", finalRole);
      }

      // Redirect berdasarkan role
      const redirectPath =
        redirect || (finalRole === "candidate" ? "/dashboard/candidate" : "/dashboard");

      console.log("Google OAuth success - Role:", finalRole);
      console.log("Redirecting to:", redirectPath);

      router.push(redirectPath);
    } else {
      // Kalau gak ada token, balikin ke home
      router.push("/");
    }
  }, [searchParams, router]);

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Spinner */}
      <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
      <h1 className="text-xl font-semibold text-gray-800">
        Memproses Login...
      </h1>
      <p className="text-sm text-gray-500 mt-2">Mengalihkan ke Dashboard</p>
    </div>
  );
}

export default function LoginSuccess() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-gray-50">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      }>
      <LoginSuccessContent />
    </Suspense>
  );
}
