"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Branch {
  id: string;
  name: string;
  address: string;
}

export default function DebugPage() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const [data, setData] = useState<Branch[]>([]);

  useEffect(() => {
    async function testConnection() {
      try {
        // Test fetching branches (created in migration)
        const { data: branches, error } = await supabase
          .from("branches")
          .select("*")
          .limit(5);

        if (error) throw error;

        setStatus("connected");
        setMessage("Berhasil terhubung ke Supabase!");
        setData(branches || []);
      } catch (err) {
        console.error("Connection test failed:", err);
        setStatus("error");
        setMessage(
          err instanceof Error ? err.message : "Gagal terhubung ke Supabase."
        );
      }
    }

    testConnection();
  }, []);

  return (
    <div className="p-10 font-sans">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>

      <div
        className={`p-4 rounded-lg mb-6 ${
          status === "loading"
            ? "bg-secondary text-muted"
            : status === "connected"
            ? "bg-success/10 text-success border border-success"
            : "bg-danger/10 text-danger border border-danger"
        }`}
      >
        <p className="font-semibold">
          {status === "loading" ? "Mengecek koneksi..." : message}
        </p>
      </div>

      {status === "connected" && (
        <div>
          <h2 className="text-lg font-semibold mb-2">
            Data Cabang (dari Database):
          </h2>
          <ul className="list-disc pl-5">
            {data.map((item) => (
              <li key={item.id} className="mb-1">
                <span className="font-medium">{item.name}</span> -{" "}
                {item.address}
              </li>
            ))}
            {data.length === 0 && <li>Tidak ada data cabang ditemukan.</li>}
          </ul>
        </div>
      )}

      <div className="mt-8 text-sm text-muted">
        <p>Tips:</p>
        <ul className="list-disc pl-5">
          <li>
            Pastikan <b>.env.local</b> sudah diisi dengan benar.
          </li>
          <li>
            Pastikan <b>SQL Migration</b> sudah dijalankan di Supabase SQL
            Editor.
          </li>
          <li>
            Cek tab <b>Console</b> di developer tools (F12) jika error
            berlanjut.
          </li>
        </ul>
      </div>
    </div>
  );
}
