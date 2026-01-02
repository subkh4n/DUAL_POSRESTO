"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Page,
  Navbar,
  List,
  ListItem,
  Block,
  BlockTitle,
  Button,
  Preloader,
} from "konsta/react";
import { Badge } from "@/components/selia/badge";
import { useCart } from "@/context/CartContext";
import { useBranch } from "@/context/BranchContext";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types";
import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";

export default function MobileHomePage() {
  const { addToCart, totalItems } = useCart();
  const { currentBranch } = useBranch();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    if (!currentBranch) return;
    setLoading(true);

    const { data, error } = await supabase
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
      .eq("branch_id", currentBranch.id)
      .eq("is_active", true);

    if (error) {
      console.error("Error fetching products:", error);
    } else if (data) {
      setProducts(
        (data as any[]).map((bp) => ({
          id: bp.product_id,
          name: (bp.products as any)?.name || "Unknown",
          price: Number((bp.products as any)?.base_price) || 0,
          image: (bp.products as any)?.image || "",
          category: (bp.products as any)?.categories?.name || "Others",
          stock: bp.stock,
          stockType: bp.stock_type as any,
          available: bp.is_active,
        }))
      );
    }
    setLoading(false);
  }, [currentBranch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <Page>
      <Navbar
        title="🍽️ Zencode POS"
        subtitle={currentBranch?.name || "Welcome"}
      />

      <Block className="mt-4!">
        <div className="bg-linear-to-r from-primary to-blue-600 rounded-3xl p-6 text-white shadow-xl">
          <h2 className="text-2xl font-black">Ready to eat?</h2>
          <p className="text-sm opacity-90 mt-1">
            Browse our menu and order directly from your phone.
          </p>
          <div className="mt-6 flex gap-2">
            <Badge
              variant="warning"
              className="bg-white/20 text-white border-none"
            >
              Flash Sale
            </Badge>
            <Badge
              variant="success"
              className="bg-white/20 text-white border-none"
            >
              Free Delivery
            </Badge>
          </div>
        </div>
      </Block>

      <BlockTitle className="flex items-center justify-between">
        <span>📋 Fresh Menu</span>
        <span className="text-xs font-normal text-muted-foreground uppercase tracking-widest">
          {currentBranch?.name}
        </span>
      </BlockTitle>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 gap-2 text-muted-foreground">
          <Preloader className="w-8 h-8" />
          <p className="text-xs font-medium">Fetching delights...</p>
        </div>
      ) : (
        <List strongIos outlineIos className="mb-24!">
          {products.map((item) => {
            const isOutOfStock =
              item.stockType === "STOK_FISIK" && item.stock <= 0;
            return (
              <ListItem
                key={item.id}
                link={!isOutOfStock}
                chevronMaterial={!isOutOfStock}
                onClick={() => !isOutOfStock && addToCart(item, [], "")}
                title={
                  <div
                    className={`font-bold transition-opacity ${
                      isOutOfStock ? "opacity-50" : ""
                    }`}
                  >
                    {item.name}
                  </div>
                }
                subtitle={
                  <div
                    className={`text-[10px] mt-0.5 flex items-center gap-2 ${
                      isOutOfStock ? "opacity-50" : ""
                    }`}
                  >
                    <span className="text-muted-foreground uppercase">
                      {item.category}
                    </span>
                    {item.stockType === "STOK_FISIK" && (
                      <span
                        className={`font-bold ${
                          item.stock <= 5 ? "text-danger" : "text-success"
                        }`}
                      >
                        • {item.stock} left
                      </span>
                    )}
                  </div>
                }
                after={
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`font-black text-primary ${
                        isOutOfStock ? "opacity-50" : ""
                      }`}
                    >
                      Rp {item.price.toLocaleString()}
                    </span>
                    {isOutOfStock && (
                      <Badge
                        variant="danger"
                        size="sm"
                        className="text-[8px] px-1 py-0"
                      >
                        SOLD OUT
                      </Badge>
                    )}
                  </div>
                }
                className={isOutOfStock ? "bg-secondary/5" : ""}
              />
            );
          })}
          {products.length === 0 && (
            <div className="p-8 text-center text-muted-foreground italic text-sm">
              No products available at this branch.
            </div>
          )}
        </List>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-secondary safe-area-bottom z-40">
        <Link href="/app/cart" className="block">
          <Button
            large
            className={`w-full h-14! rounded-2xl! shadow-lg transition-all ${
              totalItems > 0 ? "bg-primary! shadow-primary/30" : "bg-slate-300!"
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              <ShoppingCartIcon className="size-5" />
              <span className="font-extrabold">
                View Cart ({totalItems} items)
              </span>
            </div>
          </Button>
        </Link>
      </div>
    </Page>
  );
}
