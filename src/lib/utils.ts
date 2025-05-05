import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Łączy klasy CSS z pomocą clsx i tailwind-merge
 * Umożliwia inteligentne łączenie klas Tailwind CSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
