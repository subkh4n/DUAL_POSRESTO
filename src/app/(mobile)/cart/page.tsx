"use client";

import {
  Page,
  Navbar,
  NavbarBackLink,
  List,
  ListItem,
  Block
} from "konsta/react";
import { Button } from "@/components/selia/button";
import { Badge } from "@/components/selia/badge";
import Link from "next/link";
import { useState } from "react";
import { Trash2 } from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const initialCart: CartItem[] = [
  { id: 1, name: "Nasi Goreng Spesial", price: 25000, quantity: 2 },
  { id: 2, name: "Es Teh Manis", price: 5000, quantity: 1 },
  { id: 3, name: "Ayam Bakar Madu", price: 35000, quantity: 1 },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCart);

  const handleDelete = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <Page>
      <Navbar
        title="🛒 Keranjang"
        left={
          <Link href="/">
            <NavbarBackLink text="Kembali" />
          </Link>
        }
      />

      <Block className="!mt-4">
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
                  className="h-6 w-6 rounded bg-muted flex items-center justify-center text-sm font-bold"
                >
                  -
                </button>
                <span className="w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="h-6 w-6 rounded bg-muted flex items-center justify-center text-sm font-bold"
                >
                  +
                </button>
              </div>
            }
            after={
              <div className="flex items-center gap-3">
                <span className="font-bold text-primary">
                  Rp {(item.price * item.quantity).toLocaleString()}
                </span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="h-8 w-8 rounded-full bg-danger/10 flex items-center justify-center text-danger hover:bg-danger/20 transition-colors"
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
          <p className="text-muted-foreground text-lg">Keranjang kosong</p>
          <Link href="/">
            <Button variant="outline" className="mt-4">
              Lihat Menu
            </Button>
          </Link>
        </Block>
      )}

      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border safe-area-bottom">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground">Total</span>
            <span className="text-2xl font-bold text-primary">
              Rp {total.toLocaleString()}
            </span>
          </div>
          <Button size="lg" className="w-full !bg-success !text-white">
            🎉 Checkout Sekarang
          </Button>
        </div>
      )}
    </Page>
  );
}
