"use client";

import { Page, Button, List, ListInput, Preloader } from "konsta/react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";

export default function CustomerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signInWithGoogle, signInWithPassword, signUp } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (isSignUp && !name) return;

    setIsSubmitting(true);
    try {
      if (isSignUp) {
        await signUp(email, password, name);
        alert(
          "Registration successful! Please check your email for confirmation."
        );
        setIsSignUp(false);
      } else {
        await signInWithPassword(email, password);
        // Successful login will be handled by AuthContext state change and redirects
      }
    } catch (error: any) {
      console.error(error);
      alert(
        error.message ||
          (isSignUp ? "Failed to sign up." : "Invalid email or password.")
      );
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
      alert("Failed to sign in with Google.");
      setIsSubmitting(false);
    }
  };

  return (
    <Page className="bg-white">
      {/* Hero Section */}
      <div className="relative h-[55vh] w-full overflow-hidden">
        <Image
          src="/images/login-bg.png"
          alt="Zencode Background"
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

        <h1 className="text-xl font-bold text-slate-800 leading-tight mb-2">
          Experience Seamless
          <br />
          Zencode POS
        </h1>
        <p className="text-gray-500 text-xs leading-relaxed max-w-[280px]">
          Professional Point of Sale Management System. Manage your business
          with clarity.
        </p>

        {/* Language Selector Dummy */}
        <div className="mt-6 flex items-center justify-between w-32 px-3 py-1.5 border border-gray-200 rounded-full text-xs font-medium">
          <span className="flex items-center gap-2">
            <span className="text-lg">🇺🇸</span> English
          </span>
          <span className="text-gray-400">▼</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 px-6 space-y-3 pb-10">
        {!showEmailInput ? (
          <Button
            large
            className="bg-slate-800! rounded-full! h-14! font-bold"
            onClick={() => setShowEmailInput(true)}
          >
            Sign In with Email
          </Button>
        ) : (
          <form onSubmit={handleAuth} className="animate-logo-reveal">
            <List strong inset className="m-0! mb-3!">
              {isSignUp && (
                <ListInput
                  label="Full Name"
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onInput={(e) => setName(e.target.value)}
                  className="h-14!"
                />
              )}
              <ListInput
                label="Email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onInput={(e) => setEmail(e.target.value)}
                className="h-14!"
              />
              <ListInput
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onInput={(e) => setPassword(e.target.value)}
                className="h-14!"
              />
            </List>
            <Button
              large
              className="bg-slate-800! rounded-full! h-14! font-bold"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Preloader className="w-6 h-6" />
              ) : isSignUp ? (
                "Sign Up"
              ) : (
                "Log In"
              )}
            </Button>
            <div className="text-center mt-4">
              <button
                type="button"
                className="text-slate-600 text-sm font-medium"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp
                  ? "Already have an account? Log In"
                  : "Don't have an account? Sign Up"}
              </button>
            </div>
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
          Sign in with Google
        </Button>

        <div className="pt-4 text-center space-y-4">
          <Link
            href="/forgot-password"
            className="text-gray-400 text-xs hover:text-slate-800"
          >
            Forgot Password?
          </Link>
          <div className="h-px bg-gray-100 w-1/2 mx-auto" />
          <Link
            href="/app"
            className="block text-slate-800 text-xs font-bold tracking-wide"
          >
            Skip this step
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
