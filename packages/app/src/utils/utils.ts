import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function tw(...args: Parameters<typeof twMerge>) {
  return twMerge(...args);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const cx = (...classNames: any) => classNames.filter(Boolean).join(" ");
