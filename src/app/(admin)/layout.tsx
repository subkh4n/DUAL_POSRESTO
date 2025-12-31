"use client";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { Button } from "@/components/selia/button";
import { Input } from "@/components/selia/input";
import { Avatar } from "@/components/selia/avatar";
import { Badge } from "@/components/selia/badge";
import { BellIcon, SearchIcon, MenuIcon } from "lucide-react";
import { useState } from "react";
import { BranchProvider } from "@/context/BranchContext";
import { AuthProvider } from "@/context/AuthContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <AuthProvider>
      <BranchProvider>
        <div className="flex min-h-screen bg-secondary/20">
          {/* Sidebar */}
          {sidebarOpen && (
            <div className="fixed left-0 top-0 z-40 hidden lg:block">
              <AppSidebar />
            </div>
          )}

          {/* Main Content */}
          <div
            className={
              sidebarOpen
                ? "lg:ml-64 flex-1 min-h-screen"
                : "flex-1 min-h-screen"
            }
          >
            {/* Header */}
            <header className="sticky top-0 z-30 h-16 bg-background/95 backdrop-blur border-b border-border flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="plain"
                  size="sm-icon"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden"
                >
                  <MenuIcon className="size-5" />
                </Button>
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="hidden lg:flex p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <MenuIcon className="size-5 text-muted" />
                </button>
                <div className="relative hidden md:block">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                  <Input placeholder="Search..." className="w-64 pl-9" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="plain" size="sm-icon" className="relative">
                  <BellIcon className="size-5" />
                  <Badge
                    variant="danger"
                    size="sm"
                    className="absolute -top-1 -right-1 min-w-4 h-4 flex items-center justify-center p-0"
                  >
                    3
                  </Badge>
                </Button>
                <Avatar size="sm" className="cursor-pointer">
                  <span className="text-sm font-medium">A</span>
                </Avatar>
              </div>
            </header>

            {/* Page Content */}
            <main className="p-6">{children}</main>
          </div>

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <div
                className="fixed left-0 top-0 z-40"
                onClick={(e) => e.stopPropagation()}
              >
                <AppSidebar />
              </div>
            </div>
          )}
        </div>
      </BranchProvider>
    </AuthProvider>
  );
}
