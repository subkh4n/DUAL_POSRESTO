"use client";

import { App } from "konsta/react";

interface MobileLayoutProps {
  children: React.ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <App
      theme="material"
      dark={false}
      className="min-h-screen"
    >
      {children}
    </App>
  );
}
