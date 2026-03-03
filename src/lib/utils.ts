import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const GALVESTON_CENTER: [number, number] = [29.2993, -94.7946]; // Galveston Island
export const GALVESTON_BOUNDS: [[number, number], [number, number]] = [
  [29.0, -95.3],
  [29.6, -94.3]
];

export interface Incident {
  id: string;
  type: 'police' | 'fire' | 'medical' | 'traffic' | 'other';
  title: string;
  description: string;
  location: { lat: number; lng: number; address?: string };
  timestamp: Date;
  source: 'scanner' | 'news' | 'user';
  status: 'active' | 'resolved';
}

export interface ScannerMessage {
  id: string;
  channel: string;
  content: string;
  timestamp: Date;
  isTranscribing: boolean;
}
