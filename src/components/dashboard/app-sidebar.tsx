"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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
  SidebarCollapsible,
  SidebarCollapsibleTrigger,
  SidebarCollapsiblePanel,
  SidebarSubmenu,
} from "@/components/selia/sidebar";
import { Avatar } from "@/components/selia/avatar";
import { Badge } from "@/components/selia/badge";
import { Input } from "@/components/selia/input";
import { Separator } from "@/components/selia/separator";
import {
  HomeIcon,
  ShoppingBagIcon,
  Package2Icon,
  UsersIcon,
  SettingsIcon,
  LogOutIcon,
  BarChart3Icon,
  TicketIcon,
  MailIcon,
  SearchIcon,
} from "lucide-react";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: HomeIcon },
  { href: "/admin/pos", label: "Point of Sale", icon: ShoppingBagIcon },
  { href: "/admin/vouchers", label: "Vouchers & Promo", icon: TicketIcon },
  { href: "/admin/products", label: "Products", icon: Package2Icon },
  { href: "/admin/modifiers", label: "Modifiers", icon: SettingsIcon },
  { href: "/admin/customers", label: "Customers", icon: UsersIcon },
];

// Reports submenu items
const reportItems = [
  { href: "/admin/reports/sales", label: "Sales" },
  { href: "/admin/reports/traffic", label: "Traffic" },
  { href: "/admin/reports/conversion", label: "Conversion" },
];

const settingsItems = [
  { href: "/admin/email-logs", label: "Email Monitoring", icon: MailIcon },
  { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/desktop-login");
  };

  return (
    <Sidebar
      size="loose"
      className="w-64 h-screen bg-background border-r border-border"
    >
      <SidebarHeader>
        <SidebarLogo className="flex items-center gap-3">
          <Image
            src="/icons/logo.png"
            alt="Zencode"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <div>
            <span className="font-bold text-lg">Zencode</span>
            <p className="text-xs text-muted">Professional Software House</p>
          </div>
        </SidebarLogo>

        {/* Search Box */}
        <div className="relative mt-4">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
          <Input
            placeholder="Search..."
            className="pl-9 pr-10 h-10 bg-secondary/50 border-border"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted opacity-100">
            /
          </kbd>
        </div>
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
                        <Badge variant="primary" size="sm">
                          3
                        </Badge>
                      )}
                    </SidebarItemButton>
                  </SidebarItem>
                );
              })}

              {/* Reports with Collapsible Submenu */}
              <SidebarCollapsible defaultOpen>
                <SidebarCollapsibleTrigger
                  render={
                    <SidebarItemButton
                      active={pathname.startsWith("/admin/reports")}
                    >
                      <BarChart3Icon className="size-4" />
                      <span className="flex-1">Reports</span>
                    </SidebarItemButton>
                  }
                />
                <SidebarCollapsiblePanel>
                  <SidebarSubmenu>
                    <SidebarList>
                      {reportItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <SidebarItem key={item.href}>
                            <SidebarItemButton
                              active={isActive}
                              render={<Link href={item.href} />}
                            >
                              {item.label}
                            </SidebarItemButton>
                          </SidebarItem>
                        );
                      })}
                    </SidebarList>
                  </SidebarSubmenu>
                </SidebarCollapsiblePanel>
              </SidebarCollapsible>
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
            <span className="text-sm font-medium">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </span>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-muted truncate">
              {user?.email || "No email"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            title="Logout"
          >
            <LogOutIcon className="size-4 text-muted" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
