"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from "@/components/selia/card";
import { Badge } from "@/components/selia/badge";
import { Button } from "@/components/selia/button";
import {
  DollarSignIcon,
  ShoppingBagIcon,
  UsersIcon,
  TrendingUpIcon,
  ArrowRightIcon,
  ClockIcon,
} from "lucide-react";

const stats = [
  {
    title: "Pendapatan Hari Ini",
    value: "Rp 2.450.000",
    change: "+12.5%",
    trend: "up" as const,
    icon: DollarSignIcon
  },
  {
    title: "Total Pesanan",
    value: "156",
    change: "+8.2%",
    trend: "up" as const,
    icon: ShoppingBagIcon
  },
  {
    title: "Pelanggan Baru",
    value: "23",
    change: "-2.4%",
    trend: "down" as const,
    icon: UsersIcon
  },
  {
    title: "Rata-rata Transaksi",
    value: "Rp 45.000",
    change: "+5.1%",
    trend: "up" as const,
    icon: TrendingUpIcon
  },
];

const recentOrders = [
  { id: "#001", customer: "Ahmad Wijaya", items: 3, total: 75000, status: "completed", time: "10 menit lalu" },
  { id: "#002", customer: "Budi Santoso", items: 2, total: 45000, status: "preparing", time: "15 menit lalu" },
  { id: "#003", customer: "Citra Dewi", items: 5, total: 125000, status: "pending", time: "20 menit lalu" },
  { id: "#004", customer: "Dewi Sartika", items: 1, total: 25000, status: "completed", time: "25 menit lalu" },
  { id: "#005", customer: "Eko Prasetyo", items: 4, total: 95000, status: "preparing", time: "30 menit lalu" },
];

const topProducts = [
  { name: "Nasi Goreng Spesial", orders: 45, revenue: 1125000 },
  { name: "Ayam Bakar Madu", orders: 38, revenue: 1330000 },
  { name: "Mie Ayam Bakso", orders: 32, revenue: 640000 },
  { name: "Es Teh Manis", orders: 89, revenue: 445000 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted">
            Selamat datang! Berikut ringkasan bisnis Anda hari ini.
          </p>
        </div>
        <Button variant="primary">
          <ClockIcon className="size-4" />
          Laporan Hari Ini
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders - 2 columns */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pesanan Terbaru</CardTitle>
              <CardDescription>5 pesanan terakhir dari pelanggan</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Lihat Semua
              <ArrowRightIcon className="size-4" />
            </Button>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-border">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <ShoppingBagIcon className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{order.id} - {order.customer}</p>
                      <p className="text-sm text-muted">{order.items} item • {order.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={
                        order.status === "completed" ? "success" :
                        order.status === "preparing" ? "warning" : "secondary"
                      }
                    >
                      {order.status === "completed" ? "Selesai" :
                       order.status === "preparing" ? "Diproses" : "Pending"}
                    </Badge>
                    <span className="font-semibold text-right min-w-20">
                      Rp {order.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Top Products - 1 column */}
        <Card>
          <CardHeader>
            <CardTitle>Produk Terlaris</CardTitle>
            <CardDescription>Berdasarkan jumlah pesanan</CardDescription>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-border">
              {topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center gap-4 p-4"
                >
                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.name}</p>
                    <p className="text-sm text-muted">{product.orders} pesanan</p>
                  </div>
                  <span className="text-sm font-medium">
                    Rp {(product.revenue / 1000).toFixed(0)}K
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
