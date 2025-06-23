import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// `cn` merges Tailwind classes intelligently and resolves conflicts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}
