"use client";

import { useState, useEffect } from "react";
import { App, List, ListItem } from "konsta/react";
import { Card, CardHeader, CardBody, CardTitle } from "@/components/selia/card";
import { Button } from "@/components/selia/button";
import { Badge } from "@/components/selia/badge";
import {
  PlusIcon,
  MinusIcon,
  SearchIcon,
  CheckIcon,
  XIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// Types
interface Product {
  id: string;
  name: string;
  base_price: number;
  category_id: string;
  category_name?: string;
}

interface ModifierGroup {
  id: string;
  name: string;
  type: "SINGLE" | "MULTIPLE";
  required: boolean;
  min_select: number;
  max_select: number;
  items: ModifierItem[];
}

interface ModifierItem {
  id: string;
  group_id: string;
  name: string;
  price_adjust: number;
  available: boolean;
}

interface SelectedModifier {
  groupId: string;
  groupName: string;
  itemId: string;
  itemName: string;
  priceAdjust: number;
}

interface CartItem {
  id: string;
  productId: string;
  name: string;
  basePrice: number;
  quantity: number;
  modifiers: SelectedModifier[];
  totalPrice: number;
}

export default function POSPage() {
  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [modifierGroups, setModifierGroups] = useState<ModifierGroup[]>([]);
  const [productModifiers, setProductModifiers] = useState<
    { product_id: string; group_id: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  // UI State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedModifiers, setSelectedModifiers] = useState<
    SelectedModifier[]
  >([]);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch products with category - ONLY ACTIVE products for POS
      const { data: productsData } = await supabase
        .from("products")
        .select("*, categories(name)")
        .eq("is_active", true);

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
      if (productsData) {
        setProducts(
          productsData.map((p: any) => ({
            ...p,
            category_name: p.categories?.name || "Others",
          }))
        );
      }

      // Map groups with items
      if (groupsData && itemsData) {
        const groups = groupsData.map((g: any) => ({
          ...g,
          items: itemsData.filter((i: any) => i.group_id === g.id),
        }));
        setModifierGroups(groups);
      }

      if (relationsData) {
        setProductModifiers(relationsData);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  // Get modifier groups for a product
  const getProductModifierGroups = (productId: string): ModifierGroup[] => {
    const groupIds = productModifiers
      .filter((pm) => pm.product_id === productId)
      .map((pm) => pm.group_id);
    return modifierGroups.filter((g) => groupIds.includes(g.id));
  };

  // Handle product click
  const handleProductClick = (product: Product) => {
    const groups = getProductModifierGroups(product.id);
    if (groups.length > 0) {
      setSelectedProduct(product);
      setSelectedModifiers([]);
      setShowModal(true);
    } else {
      // No modifiers, add directly
      addToCart(product, []);
    }
  };

  // Toggle modifier selection
  const toggleModifier = (group: ModifierGroup, item: ModifierItem) => {
    setSelectedModifiers((prev) => {
      const existing = prev.find((m) => m.itemId === item.id);

      if (group.type === "SINGLE") {
        // Remove other items from same group, add this one
        const filtered = prev.filter((m) => m.groupId !== group.id);
        if (existing) return filtered; // Deselect if already selected
        return [
          ...filtered,
          {
            groupId: group.id,
            groupName: group.name,
            itemId: item.id,
            itemName: item.name,
            priceAdjust: item.price_adjust,
          },
        ];
      } else {
        // MULTIPLE: toggle
        if (existing) {
          return prev.filter((m) => m.itemId !== item.id);
        }
        // Check max
        const currentCount = prev.filter((m) => m.groupId === group.id).length;
        if (currentCount >= group.max_select) return prev;
        return [
          ...prev,
          {
            groupId: group.id,
            groupName: group.name,
            itemId: item.id,
            itemName: item.name,
            priceAdjust: item.price_adjust,
          },
        ];
      }
    });
  };

  // Add to cart
  const addToCart = (product: Product, modifiers: SelectedModifier[]) => {
    const modifierTotal = modifiers.reduce((sum, m) => sum + m.priceAdjust, 0);
    const totalPrice = product.base_price + modifierTotal;

    // Create unique ID based on product + modifiers combination
    const modifierKey = modifiers
      .map((m) => m.itemId)
      .sort()
      .join("-");
    const cartId = `${product.id}-${modifierKey}`;

    setCart((prev) => {
      const existing = prev.find((c) => c.id === cartId);
      if (existing) {
        return prev.map((c) =>
          c.id === cartId ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [
        ...prev,
        {
          id: cartId,
          productId: product.id,
          name: product.name,
          basePrice: product.base_price,
          quantity: 1,
          modifiers,
          totalPrice,
        },
      ];
    });

    setShowModal(false);
    setSelectedProduct(null);
  };

  // Confirm modifier selection
  const confirmModifiers = () => {
    if (!selectedProduct) return;

    // Validate required groups
    const groups = getProductModifierGroups(selectedProduct.id);
    for (const group of groups) {
      if (group.required) {
        const selected = selectedModifiers.filter(
          (m) => m.groupId === group.id
        ).length;
        if (selected < group.min_select) {
          alert(`Silakan pilih ${group.name}`);
          return;
        }
      }
    }

    addToCart(selectedProduct, selectedModifiers);
  };

  // Update cart quantity
  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.id === id ? { ...c, quantity: Math.max(0, c.quantity + delta) } : c
        )
        .filter((c) => c.quantity > 0)
    );
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.totalPrice * item.quantity,
    0
  );

  if (loading) {
    return <div className="p-8 text-center text-muted">Loading data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">POS Cashier</h2>
          <p className="text-muted">Point of Sale - Manage customer orders</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SearchIcon className="size-5" />
                Product Menu
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {products.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleProductClick(item)}
                    className="p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left"
                  >
                    <Badge variant="secondary" className="mb-2">
                      {item.category_name}
                    </Badge>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-primary font-bold mt-1">
                      Rp {item.base_price.toLocaleString()}
                    </p>
                  </button>
                ))}
                {products.length === 0 && (
                  <p className="col-span-full text-center text-muted py-8">
                    No products yet. Add products in the Product menu.
                  </p>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Cart Section */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Cart
                <Badge>{cart.length} item</Badge>
              </CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              {cart.length === 0 ? (
                <p className="text-center text-muted py-8">Cart empty</p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-secondary/30 rounded-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          {item.modifiers.length > 0 && (
                            <p className="text-xs text-muted mt-0.5">
                              +{" "}
                              {item.modifiers.map((m) => m.itemName).join(", ")}
                            </p>
                          )}
                          <p className="text-xs text-primary font-medium mt-1">
                            Rp {item.totalPrice.toLocaleString()} x{" "}
                            {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="size-7 rounded bg-background border flex items-center justify-center hover:bg-secondary"
                          >
                            <MinusIcon className="size-3" />
                          </button>
                          <span className="w-6 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="size-7 rounded bg-background border flex items-center justify-center hover:bg-secondary"
                          >
                            <PlusIcon className="size-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-4">
                      <span className="text-muted">Total</span>
                      <span className="text-xl font-bold text-primary">
                        Rp {cartTotal.toLocaleString()}
                      </span>
                    </div>
                    <Button block size="lg">
                      Process Order
                    </Button>
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Modifier Selection Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="p-4 border-b sticky top-0 bg-background z-10">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">{selectedProduct.name}</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-secondary rounded-lg"
                >
                  <XIcon className="size-5" />
                </button>
              </div>
              <p className="text-primary font-bold">
                Rp {selectedProduct.base_price.toLocaleString()}
              </p>
            </div>

            <div className="p-4 space-y-6">
              {getProductModifierGroups(selectedProduct.id).map((group) => (
                <div key={group.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="font-semibold">{group.name}</h4>
                    {group.required && (
                      <Badge variant="danger" size="sm">
                        Required
                      </Badge>
                    )}
                    {group.type === "MULTIPLE" && (
                      <Badge variant="secondary" size="sm">
                        Max {group.max_select}
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-2">
                    {group.items.map((item) => {
                      const isSelected = selectedModifiers.some(
                        (m) => m.itemId === item.id
                      );
                      return (
                        <button
                          key={item.id}
                          onClick={() => toggleModifier(group, item)}
                          className={`w-full p-3 rounded-lg border flex items-center justify-between transition-all ${
                            isSelected
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <span>{item.name}</span>
                          <div className="flex items-center gap-2">
                            {item.price_adjust > 0 && (
                              <span className="text-sm text-muted">
                                +Rp {item.price_adjust.toLocaleString()}
                              </span>
                            )}
                            {isSelected && (
                              <CheckIcon className="size-4 text-primary" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t sticky bottom-0 bg-background">
              <div className="flex justify-between mb-3">
                <span>Total</span>
                <span className="font-bold text-primary">
                  Rp{" "}
                  {(
                    selectedProduct.base_price +
                    selectedModifiers.reduce((s, m) => s + m.priceAdjust, 0)
                  ).toLocaleString()}
                </span>
              </div>
              <Button block size="lg" onClick={confirmModifiers}>
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
