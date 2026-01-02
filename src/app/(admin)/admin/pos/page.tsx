"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardTitle } from "@/components/selia/card";
import { Button } from "@/components/selia/button";
import { Badge } from "@/components/selia/badge";
import {
  PlusIcon,
  MinusIcon,
  SearchIcon,
  CheckIcon,
  XIcon,
  ShoppingCartIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import { useBranch } from "@/context/BranchContext";
import {
  Product,
  ModifierGroup,
  ModifierItem,
  SelectedModifier,
  StockType,
} from "@/types";

// Type definitions for Supabase responses
interface BranchProductRow {
  stock: number;
  stock_type: string;
  is_active: boolean;
  product_id: string;
  products: {
    id: string;
    name: string;
    base_price: number;
    image: string | null;
    categories: { name: string } | null;
  } | null;
}

interface ModifierGroupRow {
  id: string;
  name: string;
  type: string;
  required: boolean;
  min_select: number;
  max_select: number;
}

interface ModifierItemRow {
  id: string;
  name: string;
  price_adjust: number;
  available: boolean;
  group_id: string;
}

export default function POSPage() {
  const {
    cart,
    addToCart,
    updateQuantity,
    totalPrice,
    orderType,
    setOrderType,
  } = useCart();
  const { currentBranch } = useBranch();

  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [modifierGroups, setModifierGroups] = useState<ModifierGroup[]>([]);
  const [productModifiers, setProductModifiers] = useState<
    { product_id: string; group_id: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  // UI State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentSelectedModifiers, setCurrentSelectedModifiers] = useState<
    SelectedModifier[]
  >([]);
  const [note, setNote] = useState("");
  const [search, setSearch] = useState("");

  // Fetch data on mount or when branch changes
  useEffect(() => {
    const fetchData = async () => {
      if (!currentBranch) return;
      setLoading(true);

      try {
        // Fetch products joined with branch_products for stock info
        console.log(
          "Fetching products for branch:",
          currentBranch.id,
          currentBranch.name
        );
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
              category_id,
              categories (name)
            )
          `
          )
          .eq("branch_id", currentBranch.id)
          .eq("is_active", true);

        console.log("Branch products result:", {
          data: branchProductsData,
          error: bpError,
        });

        if (bpError) {
          console.error("Error fetching branch products:", bpError);
        }

        // Fetch modifier groups
        const { data: groupsData } = await supabase
          .from("modifier_groups")
          .select("*");

        // Fetch modifier items
        const { data: itemsData } = await supabase
          .from("modifier_items")
          .select("*")
          .eq("available", true);

        // Fetch product-modifier relations
        const { data: relationsData } = await supabase
          .from("product_modifiers")
          .select("product_id, group_id");

        // Map products
        if (branchProductsData) {
          const typedProducts =
            branchProductsData as unknown as BranchProductRow[];
          setProducts(
            typedProducts.map((bp) => ({
              id: bp.product_id,
              name: bp.products?.name || "Unknown",
              price: Number(bp.products?.base_price) || 0,
              image: bp.products?.image || "",
              category: bp.products?.categories?.name || "Others",
              stock: bp.stock,
              stockType: bp.stock_type as StockType,
              available: bp.is_active,
            }))
          );
        }

        // Map groups with items
        if (groupsData && itemsData) {
          const typedGroups = groupsData as unknown as ModifierGroupRow[];
          const typedItems = itemsData as unknown as ModifierItemRow[];
          const groups: ModifierGroup[] = typedGroups.map((g) => ({
            ...g,
            type: g.type as "SINGLE" | "MULTIPLE",
            items: typedItems.filter((i) => i.group_id === g.id),
          }));
          setModifierGroups(groups);
        }

        if (relationsData) {
          setProductModifiers(relationsData);
        }
      } catch (err) {
        console.error("Error fetching POS data:", err);
      }

      setLoading(false);
    };

    fetchData();
  }, [currentBranch]);

  // Get modifier groups for a product
  const getProductModifierGroups = (productId: string) => {
    const groupIds = productModifiers
      .filter((pm) => pm.product_id === productId)
      .map((pm) => pm.group_id);
    return modifierGroups.filter((g) => groupIds.includes(g.id));
  };

  // Handle product click
  const handleProductClick = (product: Product) => {
    // Check stock for STOK_FISIK
    if (product.stockType === "STOK_FISIK" && product.stock <= 0) {
      alert("Out of stock!");
      return;
    }

    const groups = getProductModifierGroups(product.id);
    if (groups.length > 0) {
      setSelectedProduct(product);
      setCurrentSelectedModifiers([]);
      setNote("");
      setShowModal(true);
    } else {
      // No modifiers, add directly
      addToCart(product, [], "");
    }
  };

  // Toggle modifier selection
  const toggleModifier = (group: ModifierGroup, item: ModifierItem) => {
    setCurrentSelectedModifiers((prev) => {
      const existing = prev.find((m) => m.id === item.id);

      if (group.type === "SINGLE") {
        const filtered = prev.filter((m) => {
          // Find if there's any modifier from this group already
          const modItem = modifierGroups
            .find((g) => g.id === group.id)
            ?.items.find((i: ModifierItem) => i.id === m.id);
          return !modItem;
        });
        if (existing) return filtered;
        return [
          ...filtered,
          {
            id: item.id,
            name: item.name,
            price: item.price_adjust,
          },
        ];
      } else {
        if (existing) {
          return prev.filter((m) => m.id !== item.id);
        }
        // Check max
        const currentCountInGroup = prev.filter((m) =>
          modifierGroups
            .find((g) => g.id === group.id)
            ?.items.some((i: ModifierItem) => i.id === m.id)
        ).length;
        if (currentCountInGroup >= group.max_select) return prev;
        return [
          ...prev,
          {
            id: item.id,
            name: item.name,
            price: item.price_adjust,
          },
        ];
      }
    });
  };

  // Confirm modifier selection
  const confirmModifiers = () => {
    if (!selectedProduct) return;

    // Validate required groups
    const groups = getProductModifierGroups(selectedProduct.id);
    for (const group of groups) {
      if (group.required) {
        const selectedInGroup = currentSelectedModifiers.filter((m) =>
          group.items.some((i: ModifierItem) => i.id === m.id)
        ).length;
        if (selectedInGroup < group.min_select) {
          alert(`Please select ${group.name}`);
          return;
        }
      }
    }

    addToCart(selectedProduct, currentSelectedModifiers, note);
    setShowModal(false);
    setSelectedProduct(null);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted font-medium">Loading POS Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">POS Cashier</h2>
          <p className="text-muted">
            Branch:{" "}
            <span className="text-foreground font-semibold">
              {currentBranch?.name}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-xl">
          <Button
            variant={orderType === "Dine In" ? "primary" : "plain"}
            size="sm"
            onClick={() => setOrderType("Dine In")}
            className="rounded-lg"
          >
            Dine In
          </Button>
          <Button
            variant={orderType === "Take Away" ? "primary" : "plain"}
            size="sm"
            onClick={() => setOrderType("Take Away")}
            className="rounded-lg"
          >
            Take Away
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Menu Section */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="relative group">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted transition-colors group-focus-within:text-primary" />
            <input
              type="text"
              placeholder="Search products or categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 overflow-hidden">
            {filteredProducts.map((item) => (
              <button
                key={item.id}
                onClick={() => handleProductClick(item)}
                disabled={item.stockType === "STOK_FISIK" && item.stock <= 0}
                className={`flex flex-col p-4 bg-white border border-border rounded-2xl text-left transition-all hover:border-primary hover:shadow-md active:scale-[0.98] group relative ${
                  item.stockType === "STOK_FISIK" && item.stock <= 0
                    ? "opacity-50 grayscale"
                    : ""
                }`}
              >
                <div className="mb-3">
                  <Badge
                    variant="secondary"
                    className="mb-1 text-[10px] px-2 py-0"
                  >
                    {item.category}
                  </Badge>
                  <h3 className="font-bold text-sm leading-tight line-clamp-2 h-10">
                    {item.name}
                  </h3>
                </div>

                <div className="mt-auto pt-3 border-t border-secondary/50 flex flex-col gap-1">
                  <p className="text-primary font-bold text-lg">
                    Rp {item.price.toLocaleString()}
                  </p>
                  <p
                    className={`text-[10px] font-medium ${
                      item.stock <= 5 && item.stockType === "STOK_FISIK"
                        ? "text-danger"
                        : "text-muted"
                    }`}
                  >
                    {item.stockType === "STOK_FISIK"
                      ? `Stock: ${item.stock}`
                      : item.stockType}
                  </p>
                </div>

                {item.stockType === "STOK_FISIK" && item.stock <= 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-2xl">
                    <Badge
                      variant="danger"
                      className="rotate-[-10deg] shadow-lg"
                    >
                      OUT OF STOCK
                    </Badge>
                  </div>
                )}
              </button>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="bg-secondary/20 rounded-3xl p-20 text-center">
              <p className="text-muted font-medium italic">
                No products found for &quot;{search}&quot;
              </p>
            </div>
          )}
        </div>

        {/* Cart Section */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
          <Card className="shadow-xl border-t-4 border-t-primary overflow-hidden">
            <CardHeader className="bg-secondary/30 pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCartIcon className="size-5 text-primary" />
                  Order Summary
                </div>
                <Badge variant="primary" className="rounded-full px-3">
                  {cart.length} items
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardBody className="p-0">
              <div className="max-h-[50vh] overflow-y-auto p-4 space-y-4">
                {cart.length === 0 ? (
                  <div className="py-20 text-center flex flex-col items-center gap-4">
                    <div className="size-16 bg-secondary/50 rounded-full flex items-center justify-center mb-2">
                      <ShoppingCartIcon className="size-8 text-muted/50" />
                    </div>
                    <p className="text-muted font-medium italic">
                      Your cart is empty
                    </p>
                  </div>
                ) : (
                  cart.map((item, index) => {
                    const modifiersId =
                      item.selectedModifiers
                        ?.map((m) => m.id)
                        .sort()
                        .join(",") || "";
                    const cartId = `${item.id}-${modifiersId}-${index}`;
                    const unitTotalPrice =
                      item.price + (item.modifierTotal || 0);

                    return (
                      <div
                        key={cartId}
                        className="group flex flex-col gap-2 p-3 bg-white border border-border rounded-xl hover:border-primary/30 transition-all shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="font-bold text-sm leading-tight">
                              {item.name}
                            </h4>
                            {item.selectedModifiers &&
                              item.selectedModifiers.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {item.selectedModifiers.map((mod) => (
                                    <span
                                      key={mod.id}
                                      className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground flex items-center gap-1"
                                    >
                                      {mod.name}{" "}
                                      {mod.price > 0 &&
                                        `(+${mod.price.toLocaleString()})`}
                                    </span>
                                  ))}
                                </div>
                              )}
                            {item.note && (
                              <p className="text-[11px] text-danger mt-1 italic font-medium">
                                Note: {item.note}
                              </p>
                            )}
                          </div>
                          <p className="font-bold text-sm text-primary whitespace-nowrap">
                            Rp {(unitTotalPrice * item.qty).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-1 pt-2 border-t border-secondary/50">
                          <p className="text-[10px] text-muted-foreground lowercase italic">
                            {unitTotalPrice.toLocaleString()} per unit
                          </p>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                updateQuantity(cartId, item.qty - 1)
                              }
                              className="size-6 rounded-lg bg-secondary flex items-center justify-center hover:bg-danger/10 hover:text-danger text-muted-foreground transition-all"
                            >
                              <MinusIcon className="size-3" />
                            </button>
                            <span className="text-sm font-bold w-4 text-center">
                              {item.qty}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(cartId, item.qty + 1)
                              }
                              className="size-6 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/10 hover:text-primary text-muted-foreground transition-all"
                            >
                              <PlusIcon className="size-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-4 bg-secondary/20 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      Subtotal
                    </span>
                    <span className="text-sm font-medium">
                      Rp {totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-base font-bold">Total Payable</span>
                    <span className="text-xl font-bold text-primary">
                      Rp {totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <Button
                    block
                    size="lg"
                    className="rounded-2xl h-14 font-bold text-lg shadow-lg shadow-primary/20"
                  >
                    Process Checkout
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Modifier Selection Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b bg-white">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="primary" className="mb-2">
                  {selectedProduct.category}
                </Badge>
                <button
                  onClick={() => setShowModal(false)}
                  className="size-10 flex items-center justify-center hover:bg-secondary rounded-full transition-colors"
                >
                  <XIcon className="size-6 text-muted-foreground" />
                </button>
              </div>
              <h3 className="font-extrabold text-2xl">
                {selectedProduct.name}
              </h3>
              <p className="text-primary font-black text-xl mt-1">
                Rp {selectedProduct.price.toLocaleString()}
              </p>
            </div>

            <div className="p-6 space-y-8 overflow-y-auto flex-1">
              {getProductModifierGroups(selectedProduct.id).map((group) => (
                <div key={group.id} className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-lg">{group.name}</h4>
                      {group.required && (
                        <span className="text-[10px] font-bold bg-danger/10 text-danger px-1.5 py-0.5 rounded uppercase letter-tracking-wider">
                          Field required
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {group.type === "SINGLE"
                        ? "Select only one option"
                        : `Select up to ${group.max_select} options`}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {group.items.map((item: ModifierItem) => {
                      const isSelected = currentSelectedModifiers.some(
                        (m) => m.id === item.id
                      );
                      return (
                        <button
                          key={item.id}
                          onClick={() => toggleModifier(group, item)}
                          className={`group relative p-4 rounded-2xl border-2 flex items-center justify-between transition-all active:scale-[0.98] ${
                            isSelected
                              ? "border-primary bg-primary/5 shadow-inner"
                              : "border-secondary bg-secondary/10 hover:border-primary/30"
                          }`}
                        >
                          <span
                            className={`font-bold transition-colors ${
                              isSelected ? "text-primary" : "text-foreground"
                            }`}
                          >
                            {item.name}
                          </span>
                          <div className="flex items-center gap-3">
                            {item.price_adjust > 0 && (
                              <span
                                className={`text-sm font-semibold ${
                                  isSelected
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                }`}
                              >
                                +Rp {item.price_adjust.toLocaleString()}
                              </span>
                            )}
                            <div
                              className={`size-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                isSelected
                                  ? "bg-primary border-primary"
                                  : "bg-white border-secondary group-hover:border-primary/30"
                              }`}
                            >
                              {isSelected && (
                                <CheckIcon
                                  className="size-4 text-white"
                                  strokeWidth={4}
                                />
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="space-y-2">
                <h4 className="font-bold text-lg">Special Notes</h4>
                <textarea
                  placeholder="Extra spicy, no onions, etc..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-4 bg-secondary/10 border-2 border-secondary rounded-2xl focus:outline-none focus:border-primary/30 focus:bg-white transition-all h-24 text-sm resize-none"
                />
              </div>
            </div>

            <div className="p-6 bg-secondary/20 border-t border-border mt-auto">
              <div className="flex justify-between items-center mb-6">
                <span className="text-muted-foreground font-medium italic">
                  Item total with modifiers
                </span>
                <span className="font-black text-2xl text-primary">
                  Rp{" "}
                  {(
                    selectedProduct.price +
                    currentSelectedModifiers.reduce((s, m) => s + m.price, 0)
                  ).toLocaleString()}
                </span>
              </div>
              <Button
                block
                size="lg"
                className="rounded-2xl h-14 font-black shadow-lg shadow-primary/20"
                onClick={confirmModifiers}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
