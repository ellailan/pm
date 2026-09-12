import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return `REQ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

/**
 * Prepends https:// to URLs that don't already include a protocol
 * so pasted links (e.g. "pinterest.com/..." or "example.org/invite") open correctly
 * instead of being treated as relative internal links.
 */
export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  if (!/^https?:\/\//i.test(trimmed) && !/^mailto:/i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function timeAgo(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getDeadlineColor(deadline: string): string {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diff = deadlineDate.getTime() - now.getTime();
  const days = Math.floor(diff / 86400000);

  if (days < 0) return "text-pink-600";
  if (days < 3) return "text-orange-500";
  if (days < 7) return "text-gold-600";
  return "text-mint-700";
}

export function isOverdue(deadline: string): boolean {
  return new Date(deadline) < new Date();
}

/**
 * Returns a timezone-safe `YYYY-MM-DD` key for a date or date string.
 * When given an ISO date string like "2026-09-12", the value is used as-is
 * (avoids the UTC-vs-local shift that `new Date("2026-09-12")` can cause).
 */
export function toDateKey(date: Date | string): string {
  if (typeof date === "string") {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);
    if (m) return `${m[1]}-${m[2]}-${m[3]}`;
    date = new Date(date);
  }
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
