"use client";

import {
  Page,
  Navbar,
  List,
  ListItem,
  Block,
  BlockTitle,
  Button,
} from "konsta/react";
import { Badge } from "@/components/selia/badge";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

// Sample menu data
const menuItems = [
  { id: 1, name: "Nasi Goreng Spesial", price: 25000, badge: "Best Seller" },
  { id: 2, name: "Mie Ayam Bakso", price: 20000, badge: null },
  { id: 3, name: "Ayam Bakar Madu", price: 35000, badge: "New" },
  { id: 4, name: "Es Teh Manis", price: 5000, badge: null },
  { id: 5, name: "Jus Alpukat", price: 15000, badge: null },
];

export default function MobileHomePage() {
  const { addToCart, totalItems } = useCart();

  return (
    <Page>
      <Navbar title="🍽️ RestoApp" subtitle="Pesan makanan favoritmu" />

      <Block className="mt-4!">
        <div className="bg-linear-to-r from-primary to-blue-600 rounded-2xl p-6 text-white">
          <h2 className="text-xl font-bold">Selamat Datang!</h2>
          <p className="text-sm opacity-90 mt-1">
            Nikmati diskon 20% untuk pesanan pertama
          </p>
          <Button className="mt-4 bg-white! text-primary!">
            Klaim Sekarang
          </Button>
        </div>
      </Block>

      <BlockTitle>📋 Menu Kami</BlockTitle>

      <List strongIos outlineIos>
        {menuItems.map((item) => (
          <ListItem
            key={item.id}
            link
            chevronMaterial
            onClick={() => addToCart(item)}
            title={item.name}
            after={
              <div className="flex items-center gap-2">
                {item.badge && (
                  <Badge
                    variant={
                      item.badge === "Best Seller" ? "warning" : "success"
                    }
                  >
                    {item.badge}
                  </Badge>
                )}
                <span className="font-semibold text-primary">
                  Rp {item.price.toLocaleString()}
                </span>
              </div>
            }
          />
        ))}
      </List>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border safe-area-bottom">
        <Link href="/app/cart">
          <Button large className="w-full bg-primary!">
            🛒 Lihat Keranjang ({totalItems} item)
          </Button>
        </Link>
      </div>
    </Page>
  );
}
