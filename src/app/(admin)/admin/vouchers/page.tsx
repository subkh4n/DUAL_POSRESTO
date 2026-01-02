"use client";

import { useState, useEffect, useCallback } from "react";
import { useBranch } from "@/context/BranchContext";
import { Card } from "@/components/selia/card";
import { Button } from "@/components/selia/button";
import { Badge } from "@/components/selia/badge";
import { Input } from "@/components/selia/input";
import {
  PlusIcon,
  TicketIcon,
  Trash2Icon,
  Edit2Icon,
  XIcon,
  Loader2Icon,
  PercentIcon,
  BadgeDollarSign,
  CalendarIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Voucher {
  id: string;
  code: string;
  discount_type: "PERCENTAGE" | "FIXED";
  value: number;
  min_spend: number;
  expires_at: string | null;
  is_active: boolean;
  branch_id: string;
}

const emptyVoucher: Omit<Voucher, "id" | "branch_id"> = {
  code: "",
  discount_type: "PERCENTAGE",
  value: 0,
  min_spend: 0,
  expires_at: null,
  is_active: true,
};

export default function VoucherManagementPage() {
  const { currentBranch } = useBranch();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [formData, setFormData] = useState(emptyVoucher);

  const fetchVouchers = useCallback(async () => {
    if (!currentBranch) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("vouchers")
      .select("*")
      .eq("branch_id", currentBranch.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching vouchers:", error);
    } else {
      setVouchers(data || []);
    }
    setLoading(false);
  }, [currentBranch]);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  const openAddModal = () => {
    setEditingVoucher(null);
    setFormData(emptyVoucher);
    setShowModal(true);
  };

  const openEditModal = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setFormData({
      code: voucher.code,
      discount_type: voucher.discount_type,
      value: voucher.value,
      min_spend: voucher.min_spend,
      expires_at: voucher.expires_at,
      is_active: voucher.is_active,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBranch) return;
    setSaving(true);

    if (editingVoucher) {
      // Update
      const { error } = await supabase
        .from("vouchers")
        .update({
          code: formData.code.toUpperCase(),
          discount_type: formData.discount_type,
          value: formData.value,
          min_spend: formData.min_spend,
          expires_at: formData.expires_at || null,
          is_active: formData.is_active,
        })
        .eq("id", editingVoucher.id);

      if (error) {
        alert("Failed to update voucher: " + error.message);
      } else {
        setVouchers((prev) =>
          prev.map((v) =>
            v.id === editingVoucher.id
              ? { ...v, ...formData, code: formData.code.toUpperCase() }
              : v
          )
        );
        setShowModal(false);
      }
    } else {
      // Insert
      const { data, error } = await supabase
        .from("vouchers")
        .insert({
          branch_id: currentBranch.id,
          code: formData.code.toUpperCase(),
          discount_type: formData.discount_type,
          value: formData.value,
          min_spend: formData.min_spend,
          expires_at: formData.expires_at || null,
          is_active: formData.is_active,
        })
        .select()
        .single();

      if (error) {
        alert("Failed to create voucher: " + error.message);
      } else if (data) {
        setVouchers((prev) => [data, ...prev]);
        setShowModal(false);
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this voucher?")) return;

    const { error } = await supabase.from("vouchers").delete().eq("id", id);

    if (error) {
      alert("Failed to delete voucher: " + error.message);
    } else {
      setVouchers((prev) => prev.filter((v) => v.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <Loader2Icon className="size-10 animate-spin text-primary" />
        <p className="text-muted font-medium">Loading Vouchers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Voucher Management
          </h1>
          <p className="text-muted text-sm font-medium mt-1">
            Manage promos and discounts for{" "}
            <span className="text-primary">{currentBranch?.name}</span>
          </p>
          <div className="flex gap-2 mt-4">
            <Badge variant="success" className="rounded-lg px-3 py-1">
              {vouchers.filter((v) => v.is_active).length} Active
            </Badge>
            <Badge variant="secondary" className="rounded-lg px-3 py-1">
              {vouchers.filter((v) => !v.is_active).length} Inactive
            </Badge>
          </div>
        </div>
        <Button
          className="gap-2 rounded-2xl h-12 px-6 shadow-lg shadow-primary/20"
          onClick={openAddModal}
        >
          <PlusIcon className="size-5" /> Add Voucher
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vouchers.map((voucher) => {
          const isExpired =
            voucher.expires_at && new Date(voucher.expires_at) < new Date();
          return (
            <Card
              key={voucher.id}
              className={`p-6 relative overflow-hidden group rounded-3xl border-2 transition-all hover:border-primary/30 hover:shadow-xl ${
                !voucher.is_active || isExpired
                  ? "opacity-60 bg-secondary/5"
                  : "bg-white"
              }`}
            >
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm-icon"
                  variant="secondary"
                  className="rounded-xl"
                  onClick={() => openEditModal(voucher)}
                >
                  <Edit2Icon className="size-4" />
                </Button>
                <Button
                  size="sm-icon"
                  variant="secondary"
                  className="rounded-xl text-danger hover:bg-danger/10"
                  onClick={() => handleDelete(voucher.id)}
                >
                  <Trash2Icon className="size-4" />
                </Button>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`p-4 rounded-2xl ${
                    voucher.discount_type === "PERCENTAGE"
                      ? "bg-amber-500/10 text-amber-600"
                      : "bg-emerald-500/10 text-emerald-600"
                  }`}
                >
                  {voucher.discount_type === "PERCENTAGE" ? (
                    <PercentIcon className="size-7" />
                  ) : (
                    <BadgeDollarSign className="size-7" />
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-muted uppercase tracking-widest">
                    {voucher.discount_type}
                  </span>
                  <h3 className="text-xl font-black font-mono tracking-wider">
                    {voucher.code}
                  </h3>
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl font-black text-primary">
                    {voucher.discount_type === "PERCENTAGE"
                      ? `${voucher.value}%`
                      : `Rp ${voucher.value.toLocaleString()}`}
                  </p>
                  {voucher.min_spend > 0 && (
                    <p className="text-xs text-muted mt-1">
                      Min. Spend: Rp {voucher.min_spend.toLocaleString()}
                    </p>
                  )}
                  {voucher.expires_at && (
                    <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                      <CalendarIcon className="size-3" />
                      Expires:{" "}
                      {new Date(voucher.expires_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Badge
                  variant={
                    isExpired
                      ? "danger"
                      : voucher.is_active
                      ? "success"
                      : "secondary"
                  }
                  className="rounded-lg"
                >
                  {isExpired
                    ? "Expired"
                    : voucher.is_active
                    ? "Active"
                    : "Inactive"}
                </Badge>
              </div>
            </Card>
          );
        })}

        {vouchers.length === 0 && (
          <div className="col-span-full py-20 text-center bg-secondary/10 rounded-3xl border-2 border-dashed border-secondary flex flex-col items-center gap-4">
            <div className="p-6 bg-white rounded-full shadow-inner">
              <TicketIcon className="size-12 text-muted/30" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-muted">No Vouchers Yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Create your first voucher to boost sales!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b bg-white flex items-center justify-between">
              <h3 className="font-extrabold text-2xl">
                {editingVoucher ? "Edit Voucher" : "Add New Voucher"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="size-10 flex items-center justify-center hover:bg-secondary rounded-full transition-colors"
              >
                <XIcon className="size-6 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="text-sm font-bold text-slate-700 mb-1.5 block">
                  Voucher Code
                </label>
                <Input
                  placeholder="e.g., NEWCUSTOMER20"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  className="uppercase font-mono tracking-wider"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1.5 block">
                    Discount Type
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={formData.discount_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount_type: e.target.value as "PERCENTAGE" | "FIXED",
                      })
                    }
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (Rp)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1.5 block">
                    Value
                  </label>
                  <Input
                    type="number"
                    placeholder={
                      formData.discount_type === "PERCENTAGE"
                        ? "e.g., 20"
                        : "e.g., 10000"
                    }
                    value={formData.value || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        value: Number(e.target.value),
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1.5 block">
                    Min. Spend (Rp)
                  </label>
                  <Input
                    type="number"
                    placeholder="0 for no minimum"
                    value={formData.min_spend || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        min_spend: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1.5 block">
                    Expires At
                  </label>
                  <Input
                    type="date"
                    value={
                      formData.expires_at
                        ? new Date(formData.expires_at)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expires_at: e.target.value || null,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="size-5 rounded border-border accent-primary"
                />
                <label htmlFor="is_active" className="text-sm font-medium">
                  Voucher is Active
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1 rounded-xl h-12"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 rounded-xl h-12 gap-2"
                  disabled={saving}
                >
                  {saving && <Loader2Icon className="size-4 animate-spin" />}
                  {editingVoucher ? "Save Changes" : "Create Voucher"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
