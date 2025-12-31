"use client";

import { useState } from "react";
import { useAuth, UserRole } from "@/context/AuthContext";
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
} from "lucide-react";

export default function ProductManagementPage() {
  const { user, isAdminPusat } = useAuth();
  const { currentBranch } = useBranch();
  const [search, setSearch] = useState("");

  // Simulated global products
  const [products, setProducts] = useState([
    { id: 1, name: "Nasi Goreng Spesial", price: 25000, category: "Makanan" },
    { id: 2, name: "Mie Ayam Bakso", price: 20000, category: "Makanan" },
    { id: 3, name: "Es Teh Manis", price: 5000, category: "Minuman" },
    { id: 4, name: "Ayam Bakar Madu", price: 35000, category: "Makanan" },
  ]);

  // Simulated branch availability (mapping product_id to active status in current branch)
  const [branchAvailability, setBranchAvailability] = useState<{
    [key: number]: boolean;
  }>({
    1: true,
    2: true,
    3: false, // Es Teh inactive in this branch
    4: true,
  });

  const toggleAvailability = (productId: number) => {
    setBranchAvailability((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Produk</h1>
          <p className="text-muted text-sm">
            {isAdminPusat
              ? "Dashboard Pusat: Kelola katalog produk global."
              : `Dashboard Cabang: Kelola ketersediaan produk di ${currentBranch?.name}.`}
          </p>
        </div>

        {/* Only Admin Pusat can add products */}
        {isAdminPusat && (
          <Button className="gap-2">
            <PlusIcon className="size-4" /> Upload Produk Baru
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-border shadow-sm">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
          <Input
            placeholder="Cari produk..."
            className="pl-9 border-none bg-transparent focus-visible:ring-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const isActive = branchAvailability[product.id] ?? false;

          return (
            <Card key={product.id} className="p-5 flex flex-col gap-4 group">
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
                  {product.category}
                </p>
                <h3 className="font-bold text-lg leading-tight mt-0.5">
                  {product.name}
                </h3>
                <p className="text-primary font-bold mt-1">
                  Rp {product.price.toLocaleString()}
                </p>
              </div>

              <div className="mt-auto pt-4 border-t border-secondary flex items-center justify-between">
                <Badge variant={isActive ? "success" : "secondary"}>
                  {isActive ? "Tersedia" : "Kosong"}
                </Badge>

                {/* Branch level control: toggle availability */}
                <Button
                  size="sm"
                  variant={isActive ? "secondary" : "plain"}
                  onClick={() => toggleAvailability(product.id)}
                  className="gap-2 text-xs"
                >
                  <PowerIcon className="size-3" />
                  {isActive ? "Nonaktifkan" : "Aktifkan"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
