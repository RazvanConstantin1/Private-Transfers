import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatEur(amount: number): string {
  return `€${amount.toLocaleString('en-EU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

export function buildWhatsAppLink(phone: string, message: string): string {
  const e164 = phone.replace(/^\+/, '');
  return `https://wa.me/${e164}?text=${encodeURIComponent(message)}`;
}
