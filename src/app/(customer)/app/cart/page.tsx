"use client";

import {
  Page,
  Navbar,
  NavbarBackLink,
  List,
  ListItem,
  Block,
  Preloader,
} from "konsta/react";
import { Button } from "@/components/selia/button";
import { Badge } from "@/components/selia/badge";
import Link from "next/link";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { sendOrderSuccessEmail } from "@/lib/email";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  product_id?: string;
}

const initialCart: CartItem[] = [
  {
    id: 1,
    name: "Nasi Goreng Spesial",
    price: 25000,
    quantity: 2,
    product_id: "71e5a52d-8e5f-4d6d-9d6a-5c2b5c4d3e1a",
  },
  {
    id: 2,
    name: "Es Teh Manis",
    price: 5000,
    quantity: 1,
    product_id: "82f6b63e-9f6g-5e7h-0e7b-6d3c6d5e4f2b",
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCart);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleDelete = (id: string | number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string | number, delta: number) => {
    setCartItems(
      cartItems
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : item;
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (!user) {
      alert("Silakan login terlebih dahulu!");
      router.push("/login");
      return;
    }

    setIsCheckingOut(true);
    try {
      // 1. Insert into transactions
      const { data: transaction, error: txError } = await supabase
        .from("transactions")
        .insert({
          customer_id: user.id !== "legacy" ? user.id : null,
          branch_id: user.branchId || "1e2d3c4b-5a6b-7c8d-9e0f-1a2b3c4d5e6f", // Placeholder branch
          subtotal: subtotal,
          tax: tax,
          total: total,
          payment_method: "QRIS", // Default for mobile
          order_type: "DINE_IN",
        })
        .select()
        .single();

      if (txError) throw txError;

      // 2. Insert into transaction_details
      const details = cartItems.map((item) => ({
        transaction_id: transaction.id,
        product_id: typeof item.id === "string" ? item.id : null,
        product_name: item.name,
        qty: item.quantity,
        price: item.price,
      }));

      const { error: dtError } = await supabase
        .from("transaction_details")
        .insert(details);
      if (dtError) throw dtError;

      // 3. Send Confirmation Email if email exists
      if (user.email) {
        await sendOrderSuccessEmail(user.email, {
          id: transaction.id,
          total: total,
          items: cartItems,
        });
      }

      alert("Pesanan berhasil dikirim!");
      setCartItems([]);
      router.push("/app");
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Unknown error";
      alert("Gagal melakukan checkout: " + message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <Page>
      <Navbar
        title="🛒 Keranjang"
        left={
          <Link href="/app">
            <NavbarBackLink text="Kembali" />
          </Link>
        }
      />

      <Block className="mt-4!">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Pesanan Anda</h2>
          <Badge variant="secondary">{cartItems.length} item</Badge>
        </div>
      </Block>

      <List strongIos outlineIos>
        {cartItems.map((item) => (
          <ListItem
            key={item.id}
            title={item.name}
            subtitle={
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="h-6 w-6 rounded bg-black/5 flex items-center justify-center text-sm font-bold"
                >
                  -
                </button>
                <span className="w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="h-6 w-6 rounded bg-black/5 flex items-center justify-center text-sm font-bold"
                >
                  +
                </button>
              </div>
            }
            after={
              <div className="flex items-center gap-3">
                <span className="font-bold text-[#006241]">
                  Rp {(item.price * item.quantity).toLocaleString()}
                </span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            }
          />
        ))}
      </List>

      {cartItems.length === 0 && (
        <Block className="text-center py-12">
          <p className="text-gray-400 text-lg">Keranjang kosong</p>
          <Link href="/app">
            <Button className="mt-4 bg-[#006241]!">Lihat Menu</Button>
          </Link>
        </Block>
      )}

      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 safe-area-bottom z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="space-y-1 mb-4">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>Rp {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Pajak (10%)</span>
              <span>Rp {tax.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-50 border-dashed">
              <span className="font-medium">Total</span>
              <span className="text-xl font-bold text-[#006241]">
                Rp {total.toLocaleString()}
              </span>
            </div>
          </div>
          <Button
            size="lg"
            className="w-full bg-[#006241]! text-white! rounded-2xl! flex items-center justify-center gap-2"
            onClick={handleCheckout}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? (
              <Preloader className="w-5 h-5" />
            ) : (
              "Checkout Sekarang"
            )}
          </Button>
        </div>
      )}
    </Page>
  );
}
