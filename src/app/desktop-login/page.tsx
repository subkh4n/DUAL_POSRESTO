"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/selia/button";
import { Input } from "@/components/selia/input";
import { Loader2Icon, EyeIcon, EyeOffIcon } from "lucide-react";
import { AuthProvider } from "@/context/AuthContext";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const { signInWithPassword, resetPassword } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setMessage(null);

    try {
      await signInWithPassword(email, password);
      router.push("/admin");
    } catch (error: unknown) {
      console.error(error);
      setMessage({
        type: "error",
        text: "Invalid email or password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage({
        type: "error",
        text: "Please enter your email address first.",
      });
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
      setMessage({
        type: "success",
        text: "Password reset link sent! Check your inbox.",
      });
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "Failed to send reset link. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 lg:p-16 bg-white">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/icons/logo.png" alt="Zencode" className="size-8" />
          <span className="font-semibold text-lg tracking-tight">ZENPOS</span>
        </div>

        {/* Form Content */}
        <div className="max-w-md mx-auto w-full">
          {/* Headline */}
          <div className="mb-10">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              Clarity in
              <br />
              <span className="text-slate-700">Commerce.</span>
            </h1>
            <p className="mt-4 text-slate-500">
              Welcome back. Please sign in to access your dashboard.
            </p>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`p-4 rounded-lg text-sm mb-6 ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-slate-50 border-slate-200"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-slate-50 border-slate-200 pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOffIcon className="size-5" />
                  ) : (
                    <EyeIcon className="size-5" />
                  )}
                </button>
              </div>
              <div className="text-right mt-2">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-slate-500 hover:text-slate-700"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-slate-800 hover:bg-slate-900 text-white"
              disabled={isLoading || !email || !password}
            >
              {isLoading ? (
                <>
                  <Loader2Icon className="size-4 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Log In"
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-sm text-slate-400">
          © 2025 Zencode Inc. All rights reserved.
        </p>
      </div>

      {/* Right Side - Image & Quote */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <img
          src="/images/login-bg.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Quote */}
        <div className="absolute bottom-16 right-16 left-16 text-white">
          <p className="text-lg lg:text-xl font-light italic leading-relaxed">
            &ldquo;Simplicity is the ultimate sophistication. Managing your
            business shouldn&apos;t be complicated.&rdquo;
          </p>
          <div className="mt-6 flex items-center gap-2">
            <div className="w-8 h-px bg-white/50" />
            <span className="text-sm text-white/70 tracking-widest uppercase">
              The Industrial Philosophy
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DesktopLoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}
