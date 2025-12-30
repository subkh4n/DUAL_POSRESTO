"use client";

import { useState } from "react";
import { App, List, ListItem } from "konsta/react";
import { Card, CardHeader, CardBody, CardTitle } from "@/components/selia/card";
import { Button } from "@/components/selia/button";
import { Badge } from "@/components/selia/badge";
import { PlusIcon, MinusIcon, SearchIcon, CheckIcon, XIcon } from "lucide-react";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  tableNo: string;
}

const menuItems: MenuItem[] = [
  { id: 1, name: "Nasi Goreng Spesial", price: 25000, category: "Makanan" },
  { id: 2, name: "Mie Ayam Bakso", price: 20000, category: "Makanan" },
  { id: 3, name: "Ayam Bakar Madu", price: 35000, category: "Makanan" },
  { id: 4, name: "Es Teh Manis", price: 5000, category: "Minuman" },
  { id: 5, name: "Jus Alpukat", price: 15000, category: "Minuman" },
  { id: 6, name: "Kopi Susu", price: 12000, category: "Minuman" },
];

export default function POSPage() {
  const [orders, setOrders] = useState<OrderItem[]>([
    { id: 1, name: "Nasi Goreng Spesial", price: 25000, quantity: 2, tableNo: "Meja 5" },
    { id: 2, name: "Es Teh Manis", price: 5000, quantity: 3, tableNo: "Meja 5" },
  ]);

  const [cart, setCart] = useState<OrderItem[]>([]);

  const addToCart = (item: MenuItem) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c =>
        c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1, tableNo: "Meja 1" }]);
    }
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(cart.map(c => {
      if (c.id === id) {
        const newQty = c.quantity + delta;
        return newQty > 0 ? { ...c, quantity: newQty } : c;
      }
      return c;
    }).filter(c => c.quantity > 0));
  };

  const completeOrder = (id: number) => {
    setOrders(orders.filter(o => o.id !== id));
  };

  const cancelOrder = (id: number) => {
    setOrders(orders.filter(o => o.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Kasir (POS)</h2>
          <p className="text-muted">
            Point of Sale - Kelola pesanan pelanggan
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Section */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SearchIcon className="size-5" />
                Menu Produk
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => addToCart(item)}
                    className="p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left"
                  >
                    <Badge variant="secondary" className="mb-2">
                      {item.category}
                    </Badge>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-primary font-bold mt-1">
                      Rp {item.price.toLocaleString()}
                    </p>
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Active Orders - Using Konsta List for mobile-friendly styling */}
          <Card>
            <CardHeader>
              <CardTitle>Pesanan Aktif</CardTitle>
            </CardHeader>
            <CardBody className="p-0">
              {/* Konsta App wrapper for consistent styling */}
              <App theme="material" dark={false}>
                <List strongIos outlineIos className="!my-0">
                  {orders.map((order) => (
                    <ListItem
                      key={order.id}
                      title={`${order.name} (${order.quantity}x)`}
                      subtitle={order.tableNo}
                      after={
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-primary mr-2">
                            Rp {(order.price * order.quantity).toLocaleString()}
                          </span>
                          <button
                            onClick={() => completeOrder(order.id)}
                            className="size-8 rounded-full bg-success/10 flex items-center justify-center text-success hover:bg-success/20 transition-colors"
                          >
                            <CheckIcon className="size-4" />
                          </button>
                          <button
                            onClick={() => cancelOrder(order.id)}
                            className="size-8 rounded-full bg-danger/10 flex items-center justify-center text-danger hover:bg-danger/20 transition-colors"
                          >
                            <XIcon className="size-4" />
                          </button>
                        </div>
                      }
                    />
                  ))}
                </List>
              </App>
              {orders.length === 0 && (
                <p className="text-center text-muted py-8">
                  Tidak ada pesanan aktif
                </p>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Cart Section */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Keranjang
                <Badge>{cart.length} item</Badge>
              </CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              {cart.length === 0 ? (
                <p className="text-center text-muted py-8">
                  Keranjang kosong
                </p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted">
                          Rp {item.price.toLocaleString()} x {item.quantity}
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
                  ))}

                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-4">
                      <span className="text-muted">Total</span>
                      <span className="text-xl font-bold text-primary">
                        Rp {cartTotal.toLocaleString()}
                      </span>
                    </div>
                    <Button block size="lg">
                      Proses Pesanan
                    </Button>
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
