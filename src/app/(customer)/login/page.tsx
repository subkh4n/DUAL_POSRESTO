"use client";

import { Page, Button, List, ListInput, Preloader } from "konsta/react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";

export default function CustomerLoginPage() {
  const [email, setEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signInWithGoogle, signInWithEmail } = useAuth();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await signInWithEmail(email);
      alert("Cek email Anda untuk tautan masuk (Magic Link)!");
    } catch (error: unknown) {
      console.error(error);
      alert("Gagal mengirim email login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (error: unknown) {
      console.error(error);
      alert("Gagal masuk dengan Google.");
      setIsSubmitting(false);
    }
  };

  return (
    <Page className="bg-white">
      {/* Hero Section */}
      <div className="relative h-[55vh] w-full overflow-hidden">
        <Image
          src="/login-bg.png"
          alt="Coffee Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="px-8 -mt-10 relative z-10 flex flex-col items-center text-center">
        {/* Carousel Dots */}
        <div className="flex gap-2 mb-6">
          <div className="size-2 rounded-full bg-gray-200" />
          <div className="size-2 rounded-full bg-gray-200" />
          <div className="size-2 w-4 rounded-full bg-[#006241]" />
        </div>

        <h1 className="text-xl font-bold text-[#006241] leading-tight mb-2">
          Menikmati Kopi Kapanpun,
          <br />
          Dimanapun
        </h1>
        <p className="text-gray-500 text-xs leading-relaxed max-w-[280px]">
          Bebas pilih cara pengambilan, bisa pick up di store atau dikirim
          langsung ke tujuanmu
        </p>

        {/* Language Selector Dummy */}
        <div className="mt-6 flex items-center justify-between w-32 px-3 py-1.5 border border-gray-200 rounded-full text-xs font-medium">
          <span className="flex items-center gap-2">
            <span className="text-lg">🇮🇩</span> Indonesia
          </span>
          <span className="text-gray-400">▼</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 px-6 space-y-3 pb-10">
        {!showEmailInput ? (
          <Button
            large
            className="bg-[#006241]! rounded-full! h-14! font-bold"
            onClick={() => setShowEmailInput(true)}
          >
            Masuk
          </Button>
        ) : (
          <form onSubmit={handleEmailLogin} className="animate-logo-reveal">
            <List strong inset className="m-0! mb-3!">
              <ListInput
                label="Email"
                type="email"
                placeholder="email@anda.com"
                value={email}
                onInput={(e) => setEmail(e.target.value)}
                className="h-14!"
              />
            </List>
            <Button
              large
              className="bg-[#006241]! rounded-full! h-14! font-bold"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Preloader className="w-6 h-6" />
              ) : (
                "Kirim Magic Link"
              )}
            </Button>
          </form>
        )}

        <Button
          large
          outline
          className="border-gray-300! text-gray-700! rounded-full! h-14! font-bold flex items-center justify-center gap-3"
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
        >
          <Image
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            width={20}
            height={20}
          />
          Masuk dengan Google
        </Button>

        <div className="pt-4 text-center space-y-4">
          <Link
            href="/forgot-password"
            className="text-gray-400 text-xs hover:text-[#006241]"
          >
            Lupa Password?
          </Link>
          <div className="h-px bg-gray-100 w-1/2 mx-auto" />
          <Link
            href="/app"
            className="block text-[#006241] text-xs font-bold tracking-wide"
          >
            Lewati tahap ini
          </Link>
        </div>
      </div>

      {isSubmitting && !showEmailInput && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
          <Preloader className="w-10 h-10" />
        </div>
      )}
    </Page>
  );
}
