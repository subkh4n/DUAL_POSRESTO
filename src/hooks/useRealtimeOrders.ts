"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useRealtimeOrders() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    // 1. Fetch initial transactions
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching transactions:", error);
      } else {
        setOrders(data || []);
      }
    };

    fetchOrders();

    // 2. Subscribe to realtime updates
    const channel = supabase
      .channel("transactions-realtime")
      .on(
        "postgres_changes",
        { event: "*", table: "transactions", schema: "public" },
        (payload) => {
          console.log("Realtime change received:", payload);

          if (payload.eventType === "INSERT") {
            setOrders((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setOrders((prev) =>
              prev.map((order) =>
                order.id === payload.new.id ? payload.new : order
              )
            );
          } else if (payload.eventType === "DELETE") {
            setOrders((prev) =>
              prev.filter((order) => order.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { orders };
}
