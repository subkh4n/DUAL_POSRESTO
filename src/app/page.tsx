"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Mobile detection
    const isMobile =
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
      window.innerWidth < 768;

    if (isMobile) {
      // Mobile: go to customer login
      router.push("/login");
    } else {
      // Desktop: go to admin login
      router.push("/admin/login");
    }
  }, [router]);

  // Loading state while detecting device
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-pulse text-slate-400">Memuat...</div>
    </div>
  );
}
