"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/selia/button";
import { Badge } from "@/components/selia/badge";
import { Input } from "@/components/selia/input";
import {
  UsersIcon,
  SearchIcon,
  Loader2Icon,
  RefreshCcwIcon,
  StarIcon,
  PhoneIcon,
  CalendarIcon,
  UserCircleIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface CustomerRaw {
  id: string;
  name: string;
  phone: string;
  last_login: string | null;
  is_active: boolean;
  created_at: string;
  customer_points: { total_points: number }[];
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  last_login: string | null;
  is_active: boolean;
  created_at: string;
  customer_points?: { total_points: number } | null;
}

export default function CustomerManagementPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch customers on mount using IIFE pattern to avoid cascading renders
  useEffect(() => {
    let isMounted = true;

    (async () => {
      const { data, error } = await supabase
        .from("users")
        .select(
          "id, name, phone, last_login, is_active, created_at, customer_points(total_points)"
        )
        .eq("role", "CUSTOMER")
        .order("created_at", { ascending: false });

      if (!isMounted) return;

      if (error) {
        console.error("Error fetching customers:", error);
      } else {
        const mappedData: Customer[] = ((data as CustomerRaw[]) || []).map(
          (c) => ({
            ...c,
            customer_points: c.customer_points?.[0] || null,
          })
        );
        setCustomers(mappedData);
      }
      setLoading(false);
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Manual refresh function
  const fetchCustomers = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("users")
      .select(
        "id, name, phone, last_login, is_active, created_at, customer_points(total_points)"
      )
      .eq("role", "CUSTOMER")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching customers:", error);
    } else {
      const mappedData: Customer[] = ((data as CustomerRaw[]) || []).map(
        (c) => ({
          ...c,
          customer_points: c.customer_points?.[0] || null,
        })
      );
      setCustomers(mappedData);
    }
    setLoading(false);
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search)
  );

  const totalPoints = customers.reduce(
    (sum, c) => sum + (c.customer_points?.total_points || 0),
    0
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <Loader2Icon className="size-10 animate-spin text-primary" />
        <p className="text-muted font-medium">Loading Customers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Customer Database
          </h1>
          <p className="text-muted text-sm font-medium mt-1">
            View and manage registered customers
          </p>
          <div className="flex gap-2 mt-4">
            <Badge variant="primary" className="rounded-lg px-3 py-1">
              {customers.length} Customers
            </Badge>
            <Badge variant="warning" className="rounded-lg px-3 py-1 gap-1">
              <StarIcon className="size-3" /> {totalPoints.toLocaleString()}{" "}
              Total Points
            </Badge>
            <Button
              variant="secondary"
              size="sm"
              className="h-7 text-[10px] rounded-lg gap-1"
              onClick={fetchCustomers}
            >
              <RefreshCcwIcon className="size-3" /> Sync
            </Button>
          </div>
        </div>
      </div>

      <div className="relative group max-w-xl">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted transition-colors group-focus-within:text-primary" />
        <Input
          placeholder="Search by name or phone..."
          className="pl-12 py-6 rounded-2xl border-border bg-white shadow-sm focus-visible:ring-primary/20"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Customer List */}
      <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-secondary/30 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
          <div className="col-span-4">Customer</div>
          <div className="col-span-2">Phone</div>
          <div className="col-span-2 text-center">Points</div>
          <div className="col-span-2 text-center">Joined</div>
          <div className="col-span-2 text-center">Status</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center hover:bg-secondary/10 transition-colors"
            >
              {/* Customer Info */}
              <div className="col-span-4 flex items-center gap-3">
                <div className="size-11 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <UserCircleIcon className="size-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">
                    {customer.name || "No Name"}
                  </h4>
                  <p className="text-xs text-muted-foreground md:hidden flex items-center gap-1">
                    <PhoneIcon className="size-3" /> {customer.phone}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="col-span-2 hidden md:flex items-center gap-1 text-sm text-slate-600">
                <PhoneIcon className="size-3.5 text-muted" />
                {customer.phone}
              </div>

              {/* Points */}
              <div className="col-span-2 hidden md:flex justify-center">
                <Badge variant="warning" className="gap-1 rounded-lg">
                  <StarIcon className="size-3" />
                  {customer.customer_points?.total_points?.toLocaleString() ||
                    0}
                </Badge>
              </div>

              {/* Joined */}
              <div className="col-span-2 hidden md:flex justify-center items-center gap-1 text-xs text-muted-foreground">
                <CalendarIcon className="size-3" />
                {new Date(customer.created_at).toLocaleDateString()}
              </div>

              {/* Status */}
              <div className="col-span-2 hidden md:flex justify-center">
                <Badge
                  variant={customer.is_active ? "success" : "secondary"}
                  className="rounded-lg"
                >
                  {customer.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>

              {/* Mobile-only info */}
              <div className="md:hidden flex items-center justify-between gap-2 pt-2 border-t border-secondary/50 mt-2">
                <Badge variant="warning" className="gap-1 rounded-lg text-xs">
                  <StarIcon className="size-2.5" />
                  {customer.customer_points?.total_points?.toLocaleString() ||
                    0}{" "}
                  pts
                </Badge>
                <span className="text-[10px] text-muted-foreground">
                  Joined {new Date(customer.created_at).toLocaleDateString()}
                </span>
                <Badge
                  variant={customer.is_active ? "success" : "secondary"}
                  className="rounded-lg text-xs"
                >
                  {customer.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          ))}

          {filteredCustomers.length === 0 && (
            <div className="p-20 text-center text-muted-foreground flex flex-col items-center gap-4">
              <div className="p-6 bg-secondary/20 rounded-full">
                <UsersIcon className="size-12 opacity-30" />
              </div>
              <div>
                <p className="text-xl font-bold">No customers found</p>
                <p className="text-sm">
                  {search
                    ? "Try adjusting your search"
                    : "Customers will appear here when they register"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
