"use client";

import { useState } from "react";
import { useBranch } from "@/context/BranchContext";
import { Card } from "@/components/selia/card";
import { Button } from "@/components/selia/button";
import { Badge } from "@/components/selia/badge";
import { PlusIcon, TicketIcon, Trash2Icon, Edit2Icon } from "lucide-react";

export default function VoucherManagementPage() {
  const { currentBranch } = useBranch();

  // Mock vouchers - in real app, fetch from Supabase where branch_id = currentBranch.id
  const [vouchers, setVouchers] = useState([
    {
      id: 1,
      code: "RESTONEW",
      type: "Percentage",
      value: 20,
      branchId: "branch-a",
      status: "Active",
    },
    {
      id: 2,
      code: "MAKANHEMAT",
      type: "Fixed",
      value: 10000,
      branchId: "branch-a",
      status: "Active",
    },
    {
      id: 3,
      code: "MUSEUM",
      type: "Percentage",
      value: 15,
      branchId: "branch-b",
      status: "Expired",
    },
  ]);

  const filteredVouchers = vouchers.filter(
    (v) => v.branchId === currentBranch?.id
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Voucher</h1>
          <p className="text-muted text-sm">
            Kelola promo dan diskon untuk cabang {currentBranch?.name}
          </p>
        </div>
        <Button className="gap-2">
          <PlusIcon className="size-4" /> Tambah Voucher
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVouchers.map((voucher) => (
          <Card key={voucher.id} className="p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm-icon"
                variant="plain"
                className="bg-white/80 backdrop-blur"
              >
                <Edit2Icon className="size-3.5" />
              </Button>
              <Button
                size="sm-icon"
                variant="plain"
                className="bg-white/80 backdrop-blur text-danger"
              >
                <Trash2Icon className="size-3.5" />
              </Button>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <TicketIcon className="size-6 text-primary" />
              </div>
              <div>
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                  {voucher.type}
                </span>
                <h3 className="text-lg font-bold font-mono">{voucher.code}</h3>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-primary">
                  {voucher.type === "Percentage"
                    ? `${voucher.value}%`
                    : `Rp ${voucher.value.toLocaleString()}`}
                </p>
                <p className="text-xs text-muted mt-1">
                  Berlaku di {currentBranch?.name}
                </p>
              </div>
              <Badge
                variant={voucher.status === "Active" ? "success" : "secondary"}
              >
                {voucher.status}
              </Badge>
            </div>
          </Card>
        ))}

        {filteredVouchers.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-3xl border-2 border-dashed border-border">
            <TicketIcon className="size-12 text-muted mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-medium text-muted">
              Belum ada voucher aktif
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Buat voucher pertama Anda untuk meningkatkan penjualan!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
