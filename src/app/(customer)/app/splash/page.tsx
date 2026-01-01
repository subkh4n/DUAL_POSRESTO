"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 4000); // 4 seconds splash

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#4a0e0e] flex flex-col items-center justify-center">
      {/* Background Image with slight pulse */}
      <div className="absolute inset-0 z-0 opacity-60">
        <Image
          src="/splash-bg.png"
          alt="Splash Background"
          fill
          className="object-cover animate-pulse-soft"
          priority
        />
      </div>

      {/* Animated Overlay Gradient */}
      <div className="absolute inset-0 z-10 bg-linear-to-t from-[#2a0505] via-transparent to-transparent opacity-80" />

      {/* Floating Elements (Decorative) */}
      <div className="absolute top-[15%] left-[10%] size-12 bg-[#8ec641]/20 rounded-full blur-xl animate-float-slow z-20" />
      <div className="absolute bottom-[20%] right-[15%] size-20 bg-[#fefefe]/10 rounded-full blur-2xl animate-float-reverse z-20" />

      {/* Main Logo Container */}
      <div className="relative z-30 flex flex-col items-center space-y-6 animate-logo-reveal">
        <div className="relative size-32 md:size-40">
          <Image
            src="/logo.png"
            alt="Fore Coffee Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-white text-3xl font-light tracking-[0.2em] uppercase">
            Fore <span className="font-bold">Coffee</span>
          </h1>
          <p className="text-[#8ec641] text-sm tracking-widest font-medium uppercase opacity-80">
            Smooth Like Pistachio
          </p>
        </div>
      </div>

      {/* Bottom Loading Indicator */}
      <div className="absolute bottom-12 z-30 flex flex-col items-center space-y-4 w-full px-12">
        <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-[#8ec641] w-0 animate-[loading_3.5s_ease-in-out_forwards]" />
        </div>
        <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase">
          Initializing experience
        </p>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% {
            width: 0;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
