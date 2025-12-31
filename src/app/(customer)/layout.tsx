"use client";

import { App } from "konsta/react";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { BranchProvider } from "@/context/BranchContext";

interface MobileLayoutProps {
  children: React.ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <AuthProvider>
      <BranchProvider>
        <CartProvider>
          <App theme="material" dark={false} className="min-h-screen">
            {children}
          </App>
        </CartProvider>
      </BranchProvider>
    </AuthProvider>
  );
}
