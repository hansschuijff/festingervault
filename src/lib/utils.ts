import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// it tells you if the current link is active or not based on the pathname
export function isLinkActive(href: string, pathname: string | null) {
  return pathname === href;
}

export function thousandToK(value: number) {
  return value / 1000;
}

export function formatDate(date: string | number | Date) {
  return format(new Date(date), "PP");
}

export function removeEmptyParams(params: Record<string, string | string[]>) {
  return Object.entries(params).reduce(function (acc, [key, val]) {
    if (val.length > 0) {
      acc[key] = val;
    }
    return acc;
  }, {});
}

