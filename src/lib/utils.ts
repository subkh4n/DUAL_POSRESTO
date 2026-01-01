import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes with tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number to Indonesian style (1.000.000)
 * Uses dot as thousands separator
 * @param value - Number to format
 * @param withPrefix - Include "Rp " prefix (default: false)
 * @returns Formatted string like "1.000.000" or "Rp 1.000.000"
 */
export function formatIDR(value: number, withPrefix: boolean = false): string {
  const formatted = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return withPrefix ? `Rp ${formatted}` : formatted;
}

/**
 * Format number with comma separator (US style: 1,000,000)
 * @param value - Number to format
 * @returns Formatted string like "1,000,000"
 */
export function formatNumber(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
