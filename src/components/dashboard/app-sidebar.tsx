"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarLogo,
  SidebarFooter,
  SidebarMenu,
  SidebarList,
  SidebarItem,
  SidebarItemButton,
  SidebarGroup,
  SidebarGroupTitle,
} from "@/components/selia/sidebar";
import { Avatar } from "@/components/selia/avatar";
import { Badge } from "@/components/selia/badge";
import { Separator } from "@/components/selia/separator";
import {
  HomeIcon,
  ShoppingBagIcon,
  Package2Icon,
  UsersIcon,
  SettingsIcon,
  LogOutIcon,
  ChefHatIcon,
  BarChart3Icon,
} from "lucide-react";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: HomeIcon },
  { href: "/admin/pos", label: "Kasir (POS)", icon: ShoppingBagIcon },
  { href: "/admin/products", label: "Produk", icon: Package2Icon },
  { href: "/admin/customers", label: "Pelanggan", icon: UsersIcon },
  { href: "/admin/reports", label: "Laporan", icon: BarChart3Icon },
];

const settingsItems = [
  { href: "/admin/settings", label: "Pengaturan", icon: SettingsIcon },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="w-64 h-screen bg-background border-r border-border">
      <SidebarHeader>
        <SidebarLogo className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-primary flex items-center justify-center">
            <ChefHatIcon className="size-5 text-primary-foreground" />
          </div>
          <div>
            <span className="font-bold text-lg">RestoApp</span>
            <p className="text-xs text-muted">Restaurant Management</p>
          </div>
        </SidebarLogo>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarGroup>
            <SidebarGroupTitle>Navigation</SidebarGroupTitle>
            <SidebarList>
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarItem key={item.href}>
                    <SidebarItemButton
                      active={isActive}
                      render={<Link href={item.href} />}
                    >
                      <item.icon className="size-4" />
                      <span className="flex-1">{item.label}</span>
                      {item.href === "/admin/pos" && (
                        <Badge variant="primary" size="sm">3</Badge>
                      )}
                    </SidebarItemButton>
                  </SidebarItem>
                );
              })}
            </SidebarList>
          </SidebarGroup>

          <Separator className="my-2" />

          <SidebarGroup>
            <SidebarGroupTitle>System</SidebarGroupTitle>
            <SidebarList>
              {settingsItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarItem key={item.href}>
                    <SidebarItemButton
                      active={isActive}
                      render={<Link href={item.href} />}
                    >
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </SidebarItemButton>
                  </SidebarItem>
                );
              })}
            </SidebarList>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        <div className="flex items-center gap-3 p-4">
          <Avatar size="sm">
            <span className="text-sm font-medium">A</span>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin User</p>
            <p className="text-xs text-muted truncate">admin@resto.com</p>
          </div>
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <LogOutIcon className="size-4 text-muted" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
