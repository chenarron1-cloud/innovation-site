import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getMonthYear(date: Date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function getAvatarInitial(name?: string | null, email?: string | null) {
  if (name) return name.charAt(0).toUpperCase();
  if (email) return email.charAt(0).toUpperCase();
  return "U";
}

export function isPremiumUser(role?: string) {
  return role === "pro" || role === "diamond" || role === "admin";
}

export function canUploadWork(role?: string) {
  return role === "pro" || role === "diamond" || role === "admin";
}

export function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max) + "…" : str;
}
