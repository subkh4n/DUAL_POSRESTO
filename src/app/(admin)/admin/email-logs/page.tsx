"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardBody } from "@/components/selia/card";
import { Badge } from "@/components/selia/badge";
import { Button } from "@/components/selia/button";
import {
  CheckCircle2Icon,
  XCircleIcon,
  SearchIcon,
  RefreshCcwIcon,
} from "lucide-react";
import { Input } from "@/components/selia/input";

interface EmailLog {
  id: string;
  recipient: string;
  subject: string;
  status: string;
  sent_at: string;
  error_message?: string;
}

export default function EmailLogsPage() {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("email_logs")
      .select("*")
      .order("sent_at", { ascending: false });

    if (!error) {
      setLogs(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    void (async () => {
      await fetchLogs();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredLogs = logs.filter(
    (log) =>
      log.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Monitoring Email
          </h1>
          <p className="text-muted">
            Riwayat pengiriman email transactional (Brevo).
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchLogs}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCcwIcon
            className={`size-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
              <Input
                placeholder="Cari email atau subjek..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-secondary/50 border-y border-border">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">
                    Tujuan
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">
                    Subjek
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">
                    Waktu
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">
                    Detail Error
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-muted"
                    >
                      Memuat data...
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-muted"
                    >
                      Tidak ada riwayat email ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-secondary/20 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={
                            log.status === "SUCCESS" ? "success" : "danger"
                          }
                        >
                          <div className="flex items-center gap-1.5">
                            {log.status === "SUCCESS" ? (
                              <CheckCircle2Icon className="size-3" />
                            ) : (
                              <XCircleIcon className="size-3" />
                            )}
                            {log.status}
                          </div>
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {log.recipient}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted">
                        {log.subject}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted whitespace-nowrap">
                        {new Date(log.sent_at).toLocaleString("id-ID")}
                      </td>
                      <td
                        className="px-6 py-4 text-sm text-danger max-w-xs truncate"
                        title={log.error_message}
                      >
                        {log.error_message || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
