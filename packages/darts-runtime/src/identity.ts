import { config } from './config.js';
import type { Reviewer } from './schema.js';

const KEY = `tack-reviewer:${config.prototypeId}`;

export function getStoredReviewer(): Reviewer | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.name === 'string' && parsed.name) return parsed as Reviewer;
  } catch { /* ignore */ }
  return null;
}

export function saveReviewer(r: Reviewer): void {
  try { localStorage.setItem(KEY, JSON.stringify(r)); } catch { /* ignore */ }
}
