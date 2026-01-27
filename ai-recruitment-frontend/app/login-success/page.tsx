// src/app/login-success/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

export default function LoginSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 1. Ambil token dari URL (?token=...)
    const token = searchParams.get("token");

    if (token) {
      // 2. Simpan ke Cookie (berlaku 1 hari)
      Cookies.set("token", token, { expires: 1 });

      // 3. Pindah ke halaman Dashboard
      alert("Login Berhasil! Mengalihkan ke Dashboard...");
      router.push("/dashboard");
    } else {
      // Kalau gak ada token, balikin ke home
      router.push("/");
    }
  }, [searchParams, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      <h1 className="text-2xl animate-pulse">Memproses Login...</h1>
    </div>
  );
}
