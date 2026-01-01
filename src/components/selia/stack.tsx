"use client";

import { cn } from "@/lib/utils";

export function Stack({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stack"
      className={cn("flex flex-col", className)}
      {...props}
    />
  );
}

export function Text({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="text" className={cn(className)} {...props} />;
}

export function Heading({
  className,
  size = "md",
  ...props
}: React.ComponentProps<"h2"> & {
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizeClasses = {
    sm: "text-lg font-semibold",
    md: "text-xl font-semibold",
    lg: "text-2xl font-bold",
    xl: "text-3xl font-bold",
  };

  return (
    <h2
      data-slot="heading"
      className={cn(sizeClasses[size], className)}
      {...props}
    />
  );
}
