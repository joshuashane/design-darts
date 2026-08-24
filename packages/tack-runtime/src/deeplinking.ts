import type { Comment } from './schema.js';

export function handleDeepLink(comments: Comment[], onFocus: (id: string) => void): void {
  const hash = location.hash; // e.g. #tack-7
  if (!hash.startsWith('#tack-')) return;
  const num = parseInt(hash.slice(6), 10);
  if (isNaN(num) || num < 1 || num > comments.length) return;
  const comment = comments[num - 1];
  if (comment) setTimeout(() => onFocus(comment.id), 300);
}
