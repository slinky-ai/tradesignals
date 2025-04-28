import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatNumberInput = (value: string): string => {
  // Remove leading zeros but preserve decimal values
  if (value.includes('.')) {
    const [whole, decimal] = value.split('.');
    return `${parseInt(whole || '0')}.${decimal}`;
  }
  return parseInt(value || '0').toString();
};