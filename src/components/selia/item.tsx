"use client";

import { cn } from "@/lib/utils";

interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "plain";
  render?: React.ReactElement;
}

export function Item({
  className,
  variant = "default",
  render,
  children,
  ...props
}: ItemProps) {
  const baseClassName = cn(
    "flex items-center gap-3 py-3",
    variant === "default" && "px-4 hover:bg-muted/50 transition-colors",
    variant === "plain" && "hover:bg-muted/30 transition-colors rounded-lg p-2",
    className
  );

  if (render) {
    // Simplified: just use div with onClick behavior
    return (
      <div data-slot="item" className={baseClassName} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div data-slot="item" className={baseClassName} {...props}>
      {children}
    </div>
  );
}

export function ItemMedia({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-media"
      className={cn(
        "size-12 rounded-lg overflow-hidden shrink-0 bg-muted",
        "[&>img]:w-full [&>img]:h-full [&>img]:object-cover",
        className
      )}
      {...props}
    />
  );
}

export function ItemContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn("flex-1 min-w-0", className)}
      {...props}
    />
  );
}

export function ItemTitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-title"
      className={cn("font-medium text-sm truncate text-primary", className)}
      {...props}
    />
  );
}

export function ItemDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn("text-sm text-muted", className)}
      {...props}
    />
  );
}

export function ItemMeta({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="item-meta"
      className={cn("text-xs text-muted shrink-0", className)}
      {...props}
    />
  );
}
