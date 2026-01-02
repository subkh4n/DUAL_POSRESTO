"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, Product, SelectedModifier } from "@/types";

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: Product,
    selectedModifiers?: SelectedModifier[],
    note?: string
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  orderType: "Dine In" | "Take Away";
  setOrderType: (type: "Dine In" | "Take Away") => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<"Dine In" | "Take Away">(
    "Dine In"
  );
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("resto_cart");
    const savedOrderType = localStorage.getItem("resto_order_type") as
      | "Dine In"
      | "Take Away";

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }

    if (savedOrderType) {
      setOrderType(savedOrderType);
    }
    setIsLoaded(true);
  }, []);

  // Save cart and orderType to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("resto_cart", JSON.stringify(cart));
      localStorage.setItem("resto_order_type", orderType);
    }
  }, [cart, orderType, isLoaded]);

  // Handle Auto-Bungkus Logic
  useEffect(() => {
    if (!isLoaded) return;

    if (orderType === "Take Away") {
      setCart((prev) => {
        const hasBungkus = prev.some((item) =>
          item.name.toLowerCase().includes("bungkus")
        );

        if (!hasBungkus) {
          const bungkusItem: CartItem = {
            id: "V-BUNGKUS",
            name: "Packaging Fee (TA)",
            price: 2000,
            image: "",
            category: "Service",
            stock: 999,
            stockType: "NON_STOK",
            available: true,
            qty: 1,
          };
          return [...prev, bungkusItem];
        }
        return prev;
      });
    } else if (orderType === "Dine In") {
      setCart((prev) => {
        const hasBungkus = prev.some((item) =>
          item.name.toLowerCase().includes("bungkus")
        );
        if (hasBungkus) {
          return prev.filter(
            (item) => !item.name.toLowerCase().includes("bungkus")
          );
        }
        return prev;
      });
    }
  }, [orderType, isLoaded]);

  const addToCart = (
    product: Product,
    selectedModifiers: SelectedModifier[] = [],
    note: string = ""
  ) => {
    // Generate a unique key for the cart item based on product ID and selected modifiers
    const modifierTotal = selectedModifiers.reduce(
      (sum, mod) => sum + mod.price,
      0
    );
    const modifiersId = selectedModifiers
      .map((m) => m.id)
      .sort()
      .join(",");

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => {
        const itemModifiersId =
          item.selectedModifiers
            ?.map((m) => m.id)
            .sort()
            .join(",") || "";
        return (
          item.id === product.id &&
          itemModifiersId === modifiersId &&
          item.note === note
        );
      });

      if (existingItemIndex > -1) {
        return prevCart.map((item, index) =>
          index === existingItemIndex ? { ...item, qty: item.qty + 1 } : item
        );
      }

      const newItem: CartItem = {
        ...product,
        qty: 1,
        note,
        selectedModifiers,
        modifierTotal,
      };

      return [...prevCart, newItem];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    // For simplicity in this implementation, we'll use a match on product.id + modifiers + note
    // In a real scenario, we might want to add a unique 'cartItemId' property to the interface
    setCart((prevCart) =>
      prevCart.filter((item) => {
        const itemModifiersId =
          item.selectedModifiers
            ?.map((m) => m.id)
            .sort()
            .join(",") || "";
        const currentCartId = `${item.id}-${itemModifiersId}-${item.note}`;
        return currentCartId !== cartItemId;
      })
    );
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => {
        const itemModifiersId =
          item.selectedModifiers
            ?.map((m) => m.id)
            .sort()
            .join(",") || "";
        const currentCartId = `${item.id}-${itemModifiersId}-${item.note}`;
        return currentCartId === cartItemId ? { ...item, qty: quantity } : item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.price + (item.modifierTotal || 0)) * item.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        orderType,
        setOrderType,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
