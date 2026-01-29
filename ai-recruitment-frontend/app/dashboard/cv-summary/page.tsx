"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import CVSummary from "@/components/dashboard/CVSummary";

export default function CVSummaryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/");
      return;
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      {/* Back Button */}
      <div className="w-full max-w-2xl mb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* CV Summary Component */}
      <CVSummary
        fileName="Sarah_Jenkins_Resume_2024.pdf"
        fileSize="2.4 MB"
        uploadedAgo="2 hours ago"
      />
    </div>
  );
}
