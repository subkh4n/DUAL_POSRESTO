"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/selia/card";
import { Button } from "@/components/selia/button";
import { Input } from "@/components/selia/input";
import { MailIcon, Loader2Icon, ChefHatIcon } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const { signInWithGoogle, signInWithEmail } = useAuth();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setMessage(null);

    try {
      await signInWithEmail(email);
      setMessage({
        type: "success",
        text: "Magic link terkirim! Cek inbox email Anda.",
      });
    } catch (error: unknown) {
      console.error(error);
      setMessage({
        type: "error",
        text: "Gagal mengirim magic link. Coba lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      await signInWithGoogle();
    } catch (error: unknown) {
      console.error(error);
      setMessage({
        type: "error",
        text: "Gagal masuk dengan Google.",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-primary via-primary/90 to-blue-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <div className="size-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-8">
            <ChefHatIcon className="size-10" />
          </div>

          <h1 className="text-4xl font-bold mb-4">RestoApp Dashboard</h1>
          <p className="text-lg text-white/80 text-center max-w-md">
            Kelola restoran Anda dengan mudah. Pantau pesanan, statistik
            penjualan, dan manajemen produk dalam satu platform.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm text-white/70">Pesanan/hari</div>
            </div>
            <div>
              <div className="text-3xl font-bold">50+</div>
              <div className="text-sm text-white/70">Menu Aktif</div>
            </div>
            <div>
              <div className="text-3xl font-bold">98%</div>
              <div className="text-sm text-white/70">Kepuasan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 lg:hidden">
              <div className="size-16 rounded-2xl bg-primary flex items-center justify-center">
                <ChefHatIcon className="size-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Selamat Datang</CardTitle>
            <CardDescription>Masuk ke dashboard admin RestoApp</CardDescription>
          </CardHeader>
          <CardBody className="space-y-6">
            {/* Message */}
            {message && (
              <div
                className={`p-4 rounded-lg text-sm ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Google Login */}
            <Button
              variant="outline"
              className="w-full h-12 gap-3"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <Image
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                width={20}
                height={20}
              />
              Masuk dengan Google
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">atau</span>
              </div>
            </div>

            {/* Email Login */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                <Input
                  type="email"
                  placeholder="admin@restoran.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12"
                disabled={isLoading || !email}
              >
                {isLoading ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin mr-2" />
                    Mengirim...
                  </>
                ) : (
                  "Kirim Magic Link"
                )}
              </Button>
            </form>

            {/* Footer */}
            <p className="text-center text-xs text-slate-400 pt-4">
              Dengan masuk, Anda menyetujui ketentuan layanan kami.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
