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
import { Trash2, MinusIcon, PlusIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import { sendOrderSuccessEmail } from "@/lib/email";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } =
    useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const subtotal = totalPrice;
  const tax = Math.round(subtotal * 0.1);
  const finalTotal = subtotal + tax;

  const handleCheckout = async () => {
    if (!user) {
      alert("Please login first!");
      router.push("/login");
      return;
    }

    if (cart.length === 0) return;

    setIsCheckingOut(true);
    try {
      // 1. Insert into transactions
      const { data: transaction, error: txError } = await supabase
        .from("transactions")
        .insert({
          customer_id: user.id !== "legacy" ? user.id : null,
          branch_id: user.branchId || "1e2d3c4b-5a6b-7c8d-9e0f-1a2b3c4d5e6f", // Placeholder branch or current branch from context if added
          subtotal: subtotal,
          tax: tax,
          total: finalTotal,
          payment_method: "QRIS", // Default for mobile
          order_type: "Take Away", // Default for mobile customer app
        })
        .select()
        .single();

      if (txError) throw txError;

      // 2. Insert into transaction_details
      const details = cart.map((item) => ({
        transaction_id: transaction.id,
        product_id: item.id.startsWith("V-") ? null : item.id,
        product_name: item.name,
        qty: item.qty,
        price: item.price + (item.modifierTotal || 0),
        modifiers: item.selectedModifiers
          ? JSON.stringify(item.selectedModifiers)
          : null,
      }));

      const { error: dtError } = await supabase
        .from("transaction_details")
        .insert(details);
      if (dtError) throw dtError;

      // 3. Update stock for STOK_FISIK items (Simplified - usually done via RPC or Trigger)
      // For now, we'll skip direct stock update here to keep it clean,
      // but in a real app, a trigger or edge function would handle this based on transaction_details.

      // 4. Send Confirmation Email if email exists
      if (user.email) {
        await sendOrderSuccessEmail(user.email, {
          id: transaction.id,
          total: finalTotal,
          items: cart.map((i) => ({
            ...i,
            quantity: i.qty, // Mapping for email template compatibility
          })),
        });
      }

      alert("Order placed successfully!");
      clearCart();
      router.push("/app");
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Unknown error";
      alert("Failed to checkout: " + message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <Page>
      <Navbar
        title="🛒 Cart"
        left={
          <Link href="/app">
            <NavbarBackLink text="Back" />
          </Link>
        }
      />

      <Block className="mt-4!">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Order</h2>
          <Badge variant="secondary">{cart.length} items</Badge>
        </div>
      </Block>

      <List strongIos outlineIos>
        {cart.map((item) => {
          const modifiersId =
            item.selectedModifiers
              ?.map((m) => m.id)
              .sort()
              .join(",") || "";
          const cartId = `${item.id}-${modifiersId}-${item.note}`;
          const unitPrice = item.price + (item.modifierTotal || 0);

          return (
            <ListItem
              key={cartId}
              title={item.name}
              subtitle={
                <div className="mt-1">
                  {item.selectedModifiers &&
                    item.selectedModifiers.map((m) => (
                      <div
                        key={m.id}
                        className="text-[10px] text-muted-foreground"
                      >
                        + {m.name}
                      </div>
                    ))}
                  {item.note && (
                    <div className="text-[10px] text-danger italic">
                      Note: {item.note}
                    </div>
                  )}
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(cartId, item.qty - 1)}
                        className="h-7 w-7 rounded-lg bg-black/5 flex items-center justify-center text-sm font-bold active:bg-black/10"
                      >
                        <MinusIcon className="size-3" />
                      </button>
                      <span className="w-6 text-center font-bold text-sm">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQuantity(cartId, item.qty + 1)}
                        className="h-7 w-7 rounded-lg bg-black/5 flex items-center justify-center text-sm font-bold active:bg-black/10"
                      >
                        <PlusIcon className="size-3" />
                      </button>
                    </div>
                  </div>
                </div>
              }
              after={
                <div className="flex flex-col items-end gap-2">
                  <span className="font-bold text-primary">
                    Rp {(unitPrice * item.qty).toLocaleString()}
                  </span>
                  <button
                    onClick={() => removeFromCart(cartId)}
                    className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              }
            />
          );
        })}
      </List>

      {cart.length === 0 && (
        <Block className="text-center py-12">
          <div className="size-20 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="size-10 text-muted/30" />
          </div>
          <p className="text-gray-400 text-lg">Cart is empty</p>
          <Link href="/app">
            <Button className="mt-4 bg-primary! text-white! rounded-xl!">
              View Menu
            </Button>
          </Link>
        </Block>
      )}

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 safe-area-bottom z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="space-y-1 mb-4">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>Rp {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Tax (10%)</span>
              <span>Rp {tax.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-50 border-dashed">
              <span className="font-medium text-slate-800">Total Amount</span>
              <span className="text-2xl font-black text-primary">
                Rp {finalTotal.toLocaleString()}
              </span>
            </div>
          </div>
          <Button
            size="lg"
            className="w-full bg-primary! text-white! rounded-2xl! h-14! font-bold! shadow-lg shadow-primary/20"
            onClick={handleCheckout}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? <Preloader className="w-5 h-5" /> : "Checkout Now"}
          </Button>
        </div>
      )}
    </Page>
  );
}
