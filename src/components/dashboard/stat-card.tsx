"use client";

import { Card, CardBody } from "@/components/selia/card";
import { cn } from "@/lib/utils";
import { TrendingUpIcon, TrendingDownIcon, type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
}

export function StatCard({ title, value, change, trend, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardBody className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <div className="flex items-center gap-1 mt-2">
              {trend === "up" ? (
                <TrendingUpIcon className="size-3.5 text-success" />
              ) : (
                <TrendingDownIcon className="size-3.5 text-danger" />
              )}
              <span className={cn(
                "text-xs font-medium",
                trend === "up" ? "text-success" : "text-danger"
              )}>
                {change}
              </span>
              <span className="text-xs text-muted">vs kemarin</span>
            </div>
          </div>
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="size-5 text-primary" />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
