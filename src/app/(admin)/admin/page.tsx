"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { formatIDR } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardFooter,
  CardHeaderAction,
} from "@/components/selia/card";
import { Badge } from "@/components/selia/badge";
import { Button } from "@/components/selia/button";
import { Stack, Text } from "@/components/selia/stack";
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemMeta,
} from "@/components/selia/item";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/selia/table";
import { Separator } from "@/components/selia/separator";
import {
  ShoppingBagIcon,
  Package2Icon,
  Users2Icon,
  TagsIcon,
  ArrowRightIcon,
  ArrowRightCircleIcon,
} from "lucide-react";

// Stats data
const stats = [
  {
    icon: ShoppingBagIcon,
    title: "Total Sales",
    value: formatIDR(12340000),
    change: "+8.2%",
    changeType: "increase" as const,
    iconVariant: "info-subtle" as const,
  },
  {
    icon: Users2Icon,
    title: "Customers",
    value: formatIDR(3210),
    change: "+4.1%",
    changeType: "increase" as const,
    iconVariant: "warning-subtle" as const,
  },
  {
    icon: Package2Icon,
    title: "Orders",
    value: formatIDR(1520),
    change: "-2.3%",
    changeType: "decrease" as const,
    iconVariant: "success-subtle" as const,
  },
  {
    icon: TagsIcon,
    title: "Revenue",
    value: formatIDR(24580000),
    change: "+6.9%",
    changeType: "increase" as const,
    iconVariant: "purple-subtle" as const,
  },
];

// Best selling products
const bestSelling = [
  {
    name: "Special Fried Rice",
    price: 25000,
    sales: 45,
    emoji: "🍛",
  },
  {
    name: "Honey Grilled Chicken",
    price: 35000,
    sales: 40,
    emoji: "🍗",
  },
  {
    name: "Chicken Noodle with Meatball",
    price: 20000,
    sales: 32,
    emoji: "🍜",
  },
  {
    name: "Sweet Iced Tea",
    price: 5000,
    sales: 28,
    emoji: "🧊",
  },
  {
    name: "Chicken Satay",
    price: 30000,
    sales: 21,
    emoji: "🍢",
  },
];

// Recent orders
const recentOrders = [
  {
    id: "5678",
    customer: "Ahmad Wijaya",
    date: "2025-06-01",
    total: 532000,
    status: "Completed",
  },
  {
    id: "5683",
    customer: "Budi Santoso",
    date: "2025-06-02",
    total: 89000,
    status: "Pending",
  },
  {
    id: "5690",
    customer: "Citra Dewi",
    date: "2025-06-04",
    total: 250000,
    status: "Cancelled",
  },
  {
    id: "5765",
    customer: "Dewi Sartika",
    date: "2025-06-06",
    total: 1732000,
    status: "Completed",
  },
  {
    id: "5892",
    customer: "Eko Prasetyo",
    date: "2025-06-08",
    total: 423000,
    status: "Processing",
  },
  {
    id: "5921",
    customer: "Fitri Handayani",
    date: "2025-06-09",
    total: 205000,
    status: "Pending",
  },
  {
    id: "6002",
    customer: "Gunawan Putra",
    date: "2025-06-10",
    total: 1225000,
    status: "Completed",
  },
];

const statusVariants: Record<
  string,
  "success" | "warning" | "danger" | "primary"
> = {
  Completed: "success",
  Pending: "warning",
  Cancelled: "danger",
  Processing: "primary",
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Chart & Best Selling Row */}
      <div className="flex gap-4 lg:flex-nowrap flex-wrap">
        {/* Sales Chart */}
        <div className="w-full lg:w-8/12">
          <SalesChart />
        </div>

        {/* Best Selling */}
        <div className="w-full lg:w-4/12">
          <Card>
            <CardHeader>
              <CardTitle>Best Selling</CardTitle>
            </CardHeader>
            <CardBody>
              <Stack>
                {bestSelling.map((product, index) => (
                  <div key={product.name}>
                    <Item render={<a href="#" />} variant="plain">
                      <ItemMedia>
                        <span className="text-3xl flex items-center justify-center w-full h-full">
                          {product.emoji}
                        </span>
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>{product.name}</ItemTitle>
                        <ItemDescription>
                          {formatIDR(product.price)}
                        </ItemDescription>
                      </ItemContent>
                      <ItemMeta className="ml-auto shrink-0">
                        {product.sales} sales
                      </ItemMeta>
                    </Item>
                    {index < bestSelling.length - 1 && <Separator />}
                  </div>
                ))}
              </Stack>
            </CardBody>
            <CardFooter>
              <Button variant="secondary" block size="lg" className="gap-2">
                View All <ArrowRightCircleIcon className="size-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardHeaderAction>
            <Button variant="secondary" className="gap-2">
              View All
              <ArrowRightIcon className="size-4" />
            </Button>
          </CardHeaderAction>
        </CardHeader>
        <CardBody>
          <TableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Text className="text-muted">{order.id}</Text>
                    </TableCell>
                    <TableCell>
                      <a href="#" className="text-primary hover:underline">
                        {order.customer}
                      </a>
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell className="font-medium">
                      {formatIDR(order.total)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[order.status]}>
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardBody>
      </Card>
    </div>
  );
}
