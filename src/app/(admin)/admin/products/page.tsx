"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useBranch } from "@/context/BranchContext";
import { Card } from "@/components/selia/card";
import { Button } from "@/components/selia/button";
import { Badge } from "@/components/selia/badge";
import { Input } from "@/components/selia/input";
import {
  PlusIcon,
  Package2Icon,
  Trash2Icon,
  Edit2Icon,
  SearchIcon,
  PowerIcon,
  Loader2Icon,
  RefreshCcwIcon,
  ClipboardEditIcon,
  XIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  LayersIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Product, StockType } from "@/types";

// Type definitions for Supabase responses
interface BranchProductRow {
  stock: number | null;
  stock_type: string;
  is_active: boolean | null;
  product_id: string;
  products: {
    id: string;
    name: string;
    base_price: number;
    image: string | null;
    categories: { name: string } | null;
  } | null;
}

interface ProductModifierRow {
  product_id: string;
  group_id: string;
  modifier_groups: { id: string; name: string } | null;
}

interface ModifierGroupInfo {
  id: string;
  name: string;
}

interface ProductWithModifiers extends Product {
  modifierGroups?: ModifierGroupInfo[];
}

export default function ProductManagementPage() {
  const { isAdminPusat } = useAuth();
  const { currentBranch } = useBranch();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<ProductWithModifiers[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // Stock Modal
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithModifiers | null>(null);
  const [stockAdjustment, setStockAdjustment] = useState({
    type: "STOCK_IN",
    quantity: 0,
    notes: "",
  });
  const [savingStock, setSavingStock] = useState(false);

  // Fetch products when branch changes
  useEffect(() => {
    if (!currentBranch) return;

    let isMounted = true;

    const loadProducts = async () => {
      if (isMounted) setLoading(true);
      try {
        // Fetch branch products
        const { data: branchProductsData, error: bpError } = await supabase
          .from("branch_products")
          .select(
            `
            stock,
            stock_type,
            is_active,
            product_id,
            products (
              id,
              name,
              base_price,
              image,
              categories (name)
            )
          `
          )
          .eq("branch_id", currentBranch.id);

        if (bpError) {
          console.error(
            "Error fetching branch products:",
            bpError.message || bpError
          );
          if (isMounted) setLoading(false);
          return;
        }

        // Fetch product modifiers (separate query)
        let productModifiersData: ProductModifierRow[] = [];
        try {
          const { data: pmData } = await supabase
            .from("product_modifiers")
            .select("product_id, group_id, modifier_groups(id, name)");
          productModifiersData =
            (pmData as unknown as ProductModifierRow[]) || [];
        } catch (pmErr) {
          console.warn("Could not fetch product modifiers:", pmErr);
        }

        if (branchProductsData && isMounted) {
          const typedData = branchProductsData as unknown as BranchProductRow[];
          const productsWithModifiers: ProductWithModifiers[] = typedData.map(
            (bp) => {
              const modifiers = productModifiersData.filter(
                (pm) => pm.product_id === bp.product_id
              );

              return {
                id: bp.product_id,
                name: bp.products?.name || "Unknown",
                price: Number(bp.products?.base_price) || 0,
                image: bp.products?.image || "",
                category: bp.products?.categories?.name || "Others",
                stock: bp.stock ?? 0,
                stockType: bp.stock_type as StockType,
                available: bp.is_active ?? true,
                modifierGroups: modifiers
                  .map((m) => ({
                    id: m.modifier_groups?.id || "",
                    name: m.modifier_groups?.name || "",
                  }))
                  .filter((mg) => mg.id),
              };
            }
          );
          setProducts(productsWithModifiers);
        }
      } catch (err) {
        console.error("Unexpected error fetching products:", err);
      }

      if (isMounted) setLoading(false);
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [currentBranch]);

  // Manual refresh function
  const refreshProducts = async () => {
    if (!currentBranch) return;
    setLoading(true);

    try {
      // Fetch branch products
      const { data: branchProductsData, error: bpError } = await supabase
        .from("branch_products")
        .select(
          `
          stock,
          stock_type,
          is_active,
          product_id,
          products (
            id,
            name,
            base_price,
            image,
            categories (name)
          )
        `
        )
        .eq("branch_id", currentBranch.id);

      if (bpError) {
        console.error(
          "Error fetching branch products:",
          bpError.message || bpError
        );
        setLoading(false);
        return;
      }

      // Fetch product modifiers
      let productModifiersData: ProductModifierRow[] = [];
      try {
        const { data: pmData } = await supabase
          .from("product_modifiers")
          .select("product_id, group_id, modifier_groups(id, name)");
        productModifiersData =
          (pmData as unknown as ProductModifierRow[]) || [];
      } catch (pmErr) {
        console.warn("Could not fetch product modifiers:", pmErr);
      }

      if (branchProductsData) {
        const typedData = branchProductsData as unknown as BranchProductRow[];
        const productsWithModifiers: ProductWithModifiers[] = typedData.map(
          (bp) => {
            const modifiers = productModifiersData.filter(
              (pm) => pm.product_id === bp.product_id
            );

            return {
              id: bp.product_id,
              name: bp.products?.name || "Unknown",
              price: Number(bp.products?.base_price) || 0,
              image: bp.products?.image || "",
              category: bp.products?.categories?.name || "Others",
              stock: bp.stock ?? 0,
              stockType: bp.stock_type as StockType,
              available: bp.is_active ?? true,
              modifierGroups: modifiers
                .map((m) => ({
                  id: m.modifier_groups?.id || "",
                  name: m.modifier_groups?.name || "",
                }))
                .filter((mg) => mg.id),
            };
          }
        );
        setProducts(productsWithModifiers);
      }
    } catch (err) {
      console.error("Unexpected error fetching products:", err);
    }

    setLoading(false);
  };

  // Toggle product active status at branch
  const toggleAvailability = async (
    productId: string,
    currentStatus: boolean
  ) => {
    if (!currentBranch) return;
    setUpdating(productId);

    const { error } = await supabase
      .from("branch_products")
      .update({ is_active: !currentStatus })
      .eq("branch_id", currentBranch.id)
      .eq("product_id", productId);

    if (error) {
      console.error("Error updating product availability:", error);
      alert("Failed to update product status");
    } else {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, available: !currentStatus } : p
        )
      );
    }

    setUpdating(null);
  };

  // Open Stock Modal
  const openStockModal = (product: ProductWithModifiers) => {
    setSelectedProduct(product);
    setStockAdjustment({ type: "STOCK_IN", quantity: 0, notes: "" });
    setShowStockModal(true);
  };

  // Handle Stock Adjustment
  const handleStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBranch || !selectedProduct || stockAdjustment.quantity <= 0)
      return;
    setSavingStock(true);

    const isAdding = stockAdjustment.type === "STOCK_IN";
    const newStock = isAdding
      ? selectedProduct.stock + stockAdjustment.quantity
      : selectedProduct.stock - stockAdjustment.quantity;

    if (newStock < 0) {
      alert("Cannot reduce stock below zero.");
      setSavingStock(false);
      return;
    }

    // Update branch_products stock
    const { error: updateError } = await supabase
      .from("branch_products")
      .update({ stock: newStock })
      .eq("branch_id", currentBranch.id)
      .eq("product_id", selectedProduct.id);

    if (updateError) {
      alert("Failed to update stock: " + updateError.message);
      setSavingStock(false);
      return;
    }

    // Log stock change
    const { error: logError } = await supabase.from("stock_log").insert({
      branch_id: currentBranch.id,
      product_id: selectedProduct.id,
      action_type: stockAdjustment.type,
      stock_value: stockAdjustment.quantity,
      notes: stockAdjustment.notes || null,
    });

    if (logError) {
      console.error("Failed to log stock change:", logError);
    }

    // Update local state
    setProducts((prev) =>
      prev.map((p) =>
        p.id === selectedProduct.id ? { ...p, stock: newStock } : p
      )
    );

    setShowStockModal(false);
    setSavingStock(false);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = products.filter((p) => p.available).length;
  const outOfStockCount = products.filter(
    (p) => p.stockType === "STOK_FISIK" && p.stock <= 0
  ).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <Loader2Icon className="size-10 animate-spin text-primary" />
        <p className="text-muted font-medium">Synchronizing Catalog...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Product Catalog
          </h1>
          <p className="text-muted text-sm font-medium mt-1">
            Managing products for{" "}
            <span className="text-primary">{currentBranch?.name}</span>
          </p>
          <div className="flex gap-2 mt-4">
            <Badge variant="success" className="rounded-lg px-3 py-1">
              {activeCount} Published
            </Badge>
            <Badge variant="danger" className="rounded-lg px-3 py-1">
              {outOfStockCount} Out of Stock
            </Badge>
            <Button
              variant="secondary"
              size="sm"
              className="h-7 text-[10px] rounded-lg gap-1"
              onClick={refreshProducts}
            >
              <RefreshCcwIcon className="size-3" /> Sync
            </Button>
          </div>
        </div>

        {/* Only Admin Pusat can add products */}
        {isAdminPusat && (
          <Button className="gap-2 rounded-2xl h-12 px-6 shadow-lg shadow-primary/20">
            <PlusIcon className="size-5" /> Master Product
          </Button>
        )}
      </div>

      <div className="relative group max-w-xl">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted transition-colors group-focus-within:text-primary" />
        <Input
          placeholder="Search items, categories..."
          className="pl-12 py-6 rounded-2xl border-border bg-white shadow-sm focus-visible:ring-primary/20"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const isActive = product.available;
          const isUpdating = updating === product.id;
          const isOutOfStock =
            product.stockType === "STOK_FISIK" && product.stock <= 0;

          return (
            <Card
              key={product.id}
              className={`p-6 flex flex-col gap-5 group transition-all rounded-3xl border-2 hover:border-primary/30 hover:shadow-xl ${
                !isActive ? "opacity-60 bg-secondary/5" : "bg-white"
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`p-4 rounded-2xl transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary text-muted"
                  }`}
                >
                  <Package2Icon className="size-8" />
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Stock Adjustment Button (Only for STOK_FISIK) */}
                  {product.stockType === "STOK_FISIK" && (
                    <Button
                      size="sm-icon"
                      variant="secondary"
                      className="rounded-xl"
                      onClick={() => openStockModal(product)}
                      title="Adjust Stock"
                    >
                      <ClipboardEditIcon className="size-4" />
                    </Button>
                  )}
                  {/* Admin Pusat controls */}
                  {isAdminPusat && (
                    <>
                      <Button
                        size="sm-icon"
                        variant="secondary"
                        className="rounded-xl"
                      >
                        <Edit2Icon className="size-4" />
                      </Button>
                      <Button
                        size="sm-icon"
                        variant="secondary"
                        className="rounded-xl text-danger hover:bg-danger/10"
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div>
                <Badge
                  variant="secondary"
                  className="mb-2 text-[10px] tracking-widest uppercase py-0.5 px-2"
                >
                  {product.category}
                </Badge>
                <h3 className="font-extrabold text-xl leading-tight">
                  {product.name}
                </h3>

                {/* Modifier Groups */}
                {product.modifierGroups &&
                  product.modifierGroups.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {product.modifierGroups.map((mg) => (
                        <span
                          key={mg.id}
                          className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5"
                        >
                          <LayersIcon className="size-2.5" />
                          {mg.name}
                        </span>
                      ))}
                    </div>
                  )}

                <div className="flex items-center justify-between mt-3">
                  <p className="text-primary font-black text-2xl">
                    Rp {product.price.toLocaleString()}
                  </p>
                  <div className="text-right">
                    <p
                      className={`text-sm font-bold ${
                        isOutOfStock ? "text-danger" : "text-slate-600"
                      }`}
                    >
                      {product.stockType === "STOK_FISIK"
                        ? product.stock
                        : product.stockType}
                    </p>
                    <p className="text-[10px] text-muted font-medium uppercase tracking-tighter">
                      Availability
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-5 border-t border-secondary/50 flex items-center justify-between gap-3">
                <Badge
                  variant={isActive ? "success" : "secondary"}
                  className="rounded-lg"
                >
                  {isActive ? "Live" : "Draft"}
                </Badge>

                {/* Toggle availability */}
                <Button
                  size="sm"
                  variant={isActive ? "secondary" : "primary"}
                  onClick={() => toggleAvailability(product.id, isActive)}
                  disabled={isUpdating}
                  className="flex-1 rounded-xl h-10 gap-2 font-bold shadow-sm"
                >
                  {isUpdating ? (
                    <Loader2Icon className="size-4 animate-spin" />
                  ) : (
                    <PowerIcon className="size-4" />
                  )}
                  {isActive ? "Take Down" : "Publish"}
                </Button>
              </div>
            </Card>
          );
        })}

        {filteredProducts.length === 0 && (
          <div className="col-span-full bg-secondary/10 rounded-3xl py-32 text-center text-muted-foreground flex flex-col items-center gap-4">
            <div className="p-6 bg-white rounded-full shadow-inner">
              <SearchIcon className="size-12 opacity-20" />
            </div>
            <div>
              <p className="text-xl font-bold">No products found</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          </div>
        )}
      </div>

      {/* Stock Adjustment Modal */}
      {showStockModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b bg-white flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-xl">Stock Adjustment</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedProduct.name}
                </p>
              </div>
              <button
                onClick={() => setShowStockModal(false)}
                className="size-10 flex items-center justify-center hover:bg-secondary rounded-full transition-colors"
              >
                <XIcon className="size-6 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleStockSubmit} className="p-6 space-y-5">
              <div className="text-center p-4 bg-secondary/20 rounded-2xl">
                <p className="text-sm text-muted-foreground">Current Stock</p>
                <p className="text-4xl font-black text-primary">
                  {selectedProduct.stock}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setStockAdjustment({ ...stockAdjustment, type: "STOCK_IN" })
                  }
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                    stockAdjustment.type === "STOCK_IN"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-secondary bg-secondary/10 text-muted-foreground"
                  }`}
                >
                  <ArrowUpIcon className="size-6" />
                  <span className="font-bold text-sm">Stock In</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setStockAdjustment({
                      ...stockAdjustment,
                      type: "STOCK_OUT",
                    })
                  }
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                    stockAdjustment.type === "STOCK_OUT"
                      ? "border-rose-500 bg-rose-50 text-rose-700"
                      : "border-secondary bg-secondary/10 text-muted-foreground"
                  }`}
                >
                  <ArrowDownIcon className="size-6" />
                  <span className="font-bold text-sm">Stock Out</span>
                </button>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 mb-1.5 block">
                  Quantity
                </label>
                <Input
                  type="number"
                  min="1"
                  placeholder="Enter quantity"
                  value={stockAdjustment.quantity || ""}
                  onChange={(e) =>
                    setStockAdjustment({
                      ...stockAdjustment,
                      quantity: Number(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 mb-1.5 block">
                  Notes (Optional)
                </label>
                <Input
                  placeholder="e.g., Restock from supplier"
                  value={stockAdjustment.notes}
                  onChange={(e) =>
                    setStockAdjustment({
                      ...stockAdjustment,
                      notes: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1 rounded-xl h-12"
                  onClick={() => setShowStockModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 rounded-xl h-12 gap-2"
                  disabled={savingStock || stockAdjustment.quantity <= 0}
                >
                  {savingStock && (
                    <Loader2Icon className="size-4 animate-spin" />
                  )}
                  Confirm
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
