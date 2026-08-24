export function generateId(): string {
  return 'tack-' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

export function truncateText(s: string, max: number): string {
  return s.length <= max ? s : s.slice(0, max - 1) + '…';
}

export function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); }) as T;
}

// Reserved for future use by darts-ingest
export function normalizePageKey(url: string): string {
  try {
    const u = new URL(url, location.href);
    return u.origin + u.pathname;
  } catch {
    return location.origin + location.pathname;
  }
}

/** djb2-based hash — good enough for dedup, not cryptographic */
// Reserved for future use by darts-ingest
export function contentHash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return h >>> 0;
}

/** Extract the hash fragment from a stored pathname, e.g. '#/dashboard' */
export function hashOf(pathname: string): string {
  const m = pathname.match(/#.*$/);
  return m ? m[0] : '';
}

/**
 * Returns true if a comment belongs to the current screen.
 * Comments with no hash (made before any navigation) are always shown —
 * element resolution handles badge hiding when the element doesn't exist here.
 */
export function isOnCurrentScreen(anchorPathname: string | undefined): boolean {
  if (!anchorPathname) return true;
  const commentHash = hashOf(anchorPathname);
  if (!commentHash) return true;
  return commentHash === location.hash;
}
