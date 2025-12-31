"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChefHatIcon,
  ShoppingCartIcon,
  LayoutDashboardIcon,
  ArrowRightIcon,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    // Basic mobile detection
    const isMobile =
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
      window.innerWidth < 768;
    if (isMobile) {
      router.push("/app/splash");
    }
  }, [router]);
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="max-w-4xl w-full text-center space-y-12">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center size-20 rounded-2xl bg-linear-to-br from-primary to-blue-600 shadow-xl shadow-primary/20 mb-4 transform hover:rotate-6 transition-transform">
            <ChefHatIcon className="size-10 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Resto<span className="text-primary">App</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Solusi manajemen restoran modern dalam satu genggaman. Pilih cara
            Anda berinteraksi hari ini.
          </p>
        </div>

        {/* Entry Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {/* Customer Entry */}
          <Link href="/app" className="group">
            <div className="relative h-full bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="size-14 rounded-2xl bg-orange-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShoppingCartIcon className="size-7 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Order Sekarang
              </h3>
              <p className="text-slate-500 mb-6">
                Lihat menu kami yang lezat dan pesan langsung dari ponsel Anda.
                Cepat, mudah, dan menyenangkan.
              </p>
              <div className="flex items-center text-orange-600 font-semibold group-hover:gap-2 transition-all">
                Mulai Pesanan <ArrowRightIcon className="size-4 ml-1" />
              </div>
            </div>
          </Link>

          {/* Admin Entry */}
          <Link href="/admin" className="group">
            <div className="relative h-full bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="size-14 rounded-2xl bg-indigo-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <LayoutDashboardIcon className="size-7 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Kelola Resto
              </h3>
              <p className="text-slate-500 mb-6">
                Pantau pesanan, statistik penjualan, dan manajemen produk dalam
                satu dashboard yang powerful.
              </p>
              <div className="flex items-center text-indigo-600 font-semibold group-hover:gap-2 transition-all">
                Buka Dashboard <ArrowRightIcon className="size-4 ml-1" />
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="pt-8 text-slate-400 text-sm">
          &copy; 2025 RestoApp. Didesain untuk efisiensi dan pengalaman terbaik.
        </div>
      </div>
    </div>
  );
}
