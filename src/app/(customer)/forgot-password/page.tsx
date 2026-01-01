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
      alert("Failed to send reset link: " + message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Page className="bg-white">
      <div className="bg-slate-800 h-[30vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-white text-2xl font-bold mb-2">Forgot Password?</h2>
        <p className="text-white/70 text-sm">
          No worries, we will send you a link to reset your password.
        </p>
      </div>

      <div className="-mt-10 bg-white rounded-t-[40px] px-8 pt-10 min-h-[70vh] shadow-2xl relative z-20">
        {!success ? (
          <form onSubmit={handleReset} className="space-y-6">
            <List strong inset className="m-0!">
              <ListInput
                label="Registered Email"
                type="email"
                placeholder="name@email.com"
                value={email}
                onInput={(e) => setEmail(e.target.value)}
                className="h-16!"
              />
            </List>

            <Button
              size="lg"
              className="bg-slate-800! rounded-full! h-14! font-bold w-full"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Preloader className="w-6 h-6" />
              ) : (
                "Send Reset Link"
              )}
            </Button>

            <div className="text-center">
              <Link href="/login" className="text-gray-400 text-sm font-medium">
                Back to login page
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
              <h3 className="text-xl font-bold text-gray-800">Email Sent!</h3>
              <p className="text-gray-500 text-sm">
                Please check your email inbox for <strong>{email}</strong> and
                follow the instructions.
              </p>
            </div>
            <div className="pt-4">
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-800! text-slate-800! rounded-full! h-14! font-bold w-full"
                >
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Page>
  );
}
