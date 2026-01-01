"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

export const iconBoxVariants = cva(
  "inline-flex items-center justify-center rounded-lg shrink-0",
  {
    variants: {
      size: {
        sm: "size-8 *:size-4",
        md: "size-10 *:size-5",
        lg: "size-12 *:size-6",
      },
      variant: {
        primary: "bg-primary text-primary-foreground",
        "primary-subtle": "bg-primary/10 text-primary",
        secondary: "bg-secondary text-secondary-foreground",
        info: "bg-blue-500 text-white",
        "info-subtle": "bg-blue-100 text-blue-600",
        success: "bg-green-500 text-white",
        "success-subtle": "bg-green-100 text-green-600",
        warning: "bg-orange-500 text-white",
        "warning-subtle": "bg-orange-100 text-orange-600",
        danger: "bg-red-500 text-white",
        "danger-subtle": "bg-red-100 text-red-600",
        purple: "bg-purple-500 text-white",
        "purple-subtle": "bg-purple-100 text-purple-600",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "primary-subtle",
    },
  }
);

export function IconBox({
  className,
  size,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof iconBoxVariants>) {
  return (
    <div
      data-slot="iconbox"
      className={cn(iconBoxVariants({ size, variant, className }))}
      {...props}
    />
  );
}
