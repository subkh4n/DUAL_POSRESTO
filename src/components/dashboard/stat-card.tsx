"use client";

import { Card, CardBody } from "@/components/selia/card";
import { IconBox } from "@/components/selia/icon-box";
import { Badge } from "@/components/selia/badge";
import { Heading } from "@/components/selia/stack";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  iconVariant?:
    | "info-subtle"
    | "warning-subtle"
    | "success-subtle"
    | "purple-subtle";
}

export function StatCard({
  icon: Icon,
  title,
  value,
  change,
  changeType,
  iconVariant = "info-subtle",
}: StatCardProps) {
  return (
    <Card>
      <CardBody>
        <IconBox size="lg" variant={iconVariant} className="mb-4">
          <Icon />
        </IconBox>
        <Heading size="sm" className="font-medium text-muted">
          {title}
        </Heading>
        <p className="text-4xl font-semibold mt-2">{value}</p>
        <div className="flex items-center gap-2 mt-2">
          <Badge
            variant={changeType === "increase" ? "success" : "danger"}
            className="mt-2"
          >
            {change}
          </Badge>
          <span className="text-sm text-muted mt-2">
            {changeType === "increase"
              ? "Compared to last month"
              : "Compared to last week"}
          </span>
        </div>
      </CardBody>
    </Card>
  );
}
