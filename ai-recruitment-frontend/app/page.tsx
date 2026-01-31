"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import AuthHeader from "../components/AuthHeader";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

function HomeContent() {
  const searchParams = useSearchParams();
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    const tab = searchParams?.get("tab");
    if (tab === "register") {
      setIsRegister(true);
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 font-sans p-4">
      {/* HEADER LOGO */}
      <AuthHeader />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* TABS */}
        <div className="flex border-b border-gray-100 p-2 bg-gray-50/50">
          <button
            onClick={() => setIsRegister(false)}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-200 ${
              !isRegister
                ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => setIsRegister(true)}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-200 ${
              isRegister
                ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="p-8 pt-6">
          {isRegister ? <RegisterForm /> : <LoginForm />}

          <p className="mt-8 text-center text-xs text-gray-500 leading-relaxed px-4">
            By clicking continue, you agree to our{" "}
            <a href="#" className="underline text-gray-700 font-medium">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline text-gray-700 font-medium">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
