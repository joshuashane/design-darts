import type { NormalizedComment } from './merge.js';

function selectorSortKey(selector: string): string {
  const parts = selector.split('>').map(s => s.trim());
  const depths = parts.map(part => {
    const match = part.match(/:nth-child\((\d+)\)/);
    return match ? parseInt(match[1], 10).toString().padStart(6, '0') : '000000';
  });
  return `${parts.length.toString().padStart(4, '0')}:${depths.join(':')}`;
}

export function sortComments(comments: NormalizedComment[]): NormalizedComment[] {
  return [...comments].sort((a, b) => {
    if (a.pathname !== b.pathname) return a.pathname.localeCompare(b.pathname);
    const aState = a.screenState ?? '';
    const bState = b.screenState ?? '';
    if (aState !== bState) return aState.localeCompare(bState);
    return selectorSortKey(a.cssSelector).localeCompare(selectorSortKey(b.cssSelector));
  });
}
