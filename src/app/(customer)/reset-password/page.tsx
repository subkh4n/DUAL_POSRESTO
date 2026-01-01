"use client";

import { Page, Button, List, ListInput, Preloader } from "konsta/react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password !== confirmPassword) {
      alert("Passwords do not match or are empty!");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Unknown error";
      alert("Failed to update password: " + message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Page className="bg-white">
      <div className="bg-slate-800 h-[30vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-white text-2xl font-bold mb-2">New Password</h2>
        <p className="text-white/70 text-sm">
          Please enter your strong new password.
        </p>
      </div>

      <div className="-mt-10 bg-white rounded-t-[40px] px-8 pt-10 min-h-[70vh] shadow-2xl relative z-20">
        {!success ? (
          <form onSubmit={handleUpdate} className="space-y-6">
            <List strong inset className="m-0!">
              <ListInput
                label="New Password"
                type="password"
                placeholder="******"
                value={password}
                onInput={(e) => setPassword(e.target.value)}
                className="h-16!"
              />
              <ListInput
                label="Confirm Password"
                type="password"
                placeholder="******"
                value={confirmPassword}
                onInput={(e) => setConfirmPassword(e.target.value)}
                className="h-16!"
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
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        ) : (
          <div className="text-center py-10 space-y-6">
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
            <h3 className="text-xl font-bold text-gray-800">Success!</h3>
            <p className="text-gray-500 text-sm">
              Your password has been updated. Redirecting to login page...
            </p>
          </div>
        )}
      </div>
    </Page>
  );
}
