import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDaysAgo(dateString: string | undefined): string {
  if (!dateString) return "Recently posted";
  const createdAt = new Date(dateString);
  const currentDate = new Date();
  const days = Math.floor(
    (currentDate.getTime() - createdAt.getTime()) / (1000 * 24 * 60 * 60),
  );

  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

export function formatSalary(salary: number | undefined): string {
  if (!salary) return "Negotiable";
  return `${salary.toLocaleString("en-BD")}`;
}

export function formatJobType(type: string | undefined): string {
  if (!type) return "Not specified";
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
}

export function pluralize(
  count: number,
  singular: string,
  plural?: string,
): string {
  return count === 1 ? singular : plural || `${singular}s`;
}

export const formatDaysAgo = getDaysAgo;
