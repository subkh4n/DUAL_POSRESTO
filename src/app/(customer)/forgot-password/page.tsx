"use client";

import { Page, List, ListInput, Preloader } from "konsta/react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/selia/button";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      // Use resetPasswordForEmail
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: window.location.origin + "/reset-password",
        }
      );

      if (resetError) throw resetError;

      setSuccess(true);
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Unknown error";
      alert("Gagal mengirim link reset: " + message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Page className="bg-white">
      <div className="bg-[#006241] h-[30vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-white text-2xl font-bold mb-2">Lupa Password?</h2>
        <p className="text-white/70 text-sm">
          Jangan khawatir, kami akan mengirimkan link untuk mereset password
          Anda.
        </p>
      </div>

      <div className="-mt-10 bg-white rounded-t-[40px] px-8 pt-10 min-h-[70vh] shadow-2xl relative z-20">
        {!success ? (
          <form onSubmit={handleReset} className="space-y-6">
            <List strong inset className="m-0!">
              <ListInput
                label="Email Terdaftar"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onInput={(e) => setEmail(e.target.value)}
                className="h-16!"
              />
            </List>

            <Button
              size="lg"
              className="bg-[#006241]! rounded-full! h-14! font-bold w-full"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Preloader className="w-6 h-6" />
              ) : (
                "Kirim Link Reset"
              )}
            </Button>

            <div className="text-center">
              <Link href="/login" className="text-gray-400 text-sm font-medium">
                Kembali ke halaman login
              </Link>
            </div>
          </form>
        ) : (
          <div className="text-center py-10 space-y-6 animate-logo-reveal">
            <div className="size-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
              <svg
                className="size-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-800">
                Email Terkirim!
              </h3>
              <p className="text-gray-500 text-sm">
                Silakan cek kotak masuk email <strong>{email}</strong> Anda dan
                ikuti instruksi yang ada.
              </p>
            </div>
            <div className="pt-4">
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#006241]! text-[#006241]! rounded-full! h-14! font-bold w-full"
                >
                  Kembali ke Login
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Page>
  );
}
