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
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  name: string;
  base_price: number;
  is_active: boolean;
  category_id: string;
  category_name?: string;
}

export default function ProductManagementPage() {
  const { isAdminPusat } = useAuth();
  const { currentBranch } = useBranch();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // Fetch ALL products from Supabase (both active and inactive)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      // Fetch ALL products (active & inactive) for management page
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name)")
        .order("name");

      if (error) {
        console.error("Error fetching products:", error);
      } else if (data) {
        setProducts(
          data.map((p: any) => ({
            ...p,
            category_name: p.categories?.name || "Others",
          }))
        );
      }

      setLoading(false);
    };

    fetchProducts();
  }, []);

  // Toggle product active status
  const toggleAvailability = async (
    productId: string,
    currentStatus: boolean
  ) => {
    setUpdating(productId);

    const { error } = await supabase
      .from("products")
      .update({ is_active: !currentStatus })
      .eq("id", productId);

    if (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product status");
    } else {
      // Update local state
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, is_active: !currentStatus } : p
        )
      );
    }

    setUpdating(null);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = products.filter((p) => p.is_active).length;
  const inactiveCount = products.filter((p) => !p.is_active).length;

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader2Icon className="size-8 animate-spin mx-auto text-primary" />
        <p className="text-muted mt-2">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Product Management</h1>
          <p className="text-muted text-sm">
            {isAdminPusat
              ? "Headquarters Dashboard: Manage global product catalog."
              : `Branch Dashboard: Manage product availability at ${currentBranch?.name}.`}
          </p>
          <div className="flex gap-3 mt-2">
            <Badge variant="success">{activeCount} Active</Badge>
            <Badge variant="secondary">{inactiveCount} Inactive</Badge>
          </div>
        </div>

        {/* Only Admin Pusat can add products */}
        {isAdminPusat && (
          <Button className="gap-2">
            <PlusIcon className="size-4" /> Upload New Product
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-border shadow-sm">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
          <Input
            placeholder="Search products..."
            className="pl-9 border-none bg-transparent focus-visible:ring-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const isActive = product.is_active;
          const isUpdating = updating === product.id;

          return (
            <Card
              key={product.id}
              className={`p-5 flex flex-col gap-4 group transition-opacity ${
                !isActive ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="size-12 rounded-xl bg-secondary flex items-center justify-center">
                  <Package2Icon className="size-6 text-muted" />
                </div>

                {/* Admin Pusat controls */}
                {isAdminPusat && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm-icon"
                      variant="plain"
                      className="bg-secondary/50"
                    >
                      <Edit2Icon className="size-3.5" />
                    </Button>
                    <Button
                      size="sm-icon"
                      variant="plain"
                      className="bg-secondary/50 text-danger"
                    >
                      <Trash2Icon className="size-3.5" />
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-medium text-muted uppercase tracking-wider">
                  {product.category_name}
                </p>
                <h3 className="font-bold text-lg leading-tight mt-0.5">
                  {product.name}
                </h3>
                <p className="text-primary font-bold mt-1">
                  Rp {product.base_price.toLocaleString()}
                </p>
              </div>

              <div className="mt-auto pt-4 border-t border-secondary flex items-center justify-between">
                <Badge variant={isActive ? "success" : "secondary"}>
                  {isActive ? "Active" : "Inactive"}
                </Badge>

                {/* Toggle availability */}
                <Button
                  size="sm"
                  variant={isActive ? "secondary" : "plain"}
                  onClick={() => toggleAvailability(product.id, isActive)}
                  disabled={isUpdating}
                  className="gap-2 text-xs"
                >
                  {isUpdating ? (
                    <Loader2Icon className="size-3 animate-spin" />
                  ) : (
                    <PowerIcon className="size-3" />
                  )}
                  {isActive ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </Card>
          );
        })}

        {filteredProducts.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted">
            {search
              ? "No products match your search."
              : "No products yet. Add new products to get started."}
          </div>
        )}
      </div>
    </div>
  );
}
