import { getShadowRoot } from './shadow-host.js';
import type { Comment } from './schema.js';

let _el: HTMLElement | null = null;

export type CommentPopoverCallbacks = {
  onToggleStatus: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
};

function initials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return 'Just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function ensure(): HTMLElement {
  const root = getShadowRoot();
  if (!_el) {
    _el = document.createElement('div');
    _el.id = 'tack-comment-popover';
    root.appendChild(_el);
  }
  return _el;
}

const ARROW_FROM_LEFT = 24; // px from popover's left edge to arrow center

function positionNear(el: HTMLElement, pinCenterX: number, pinTipY: number): void {
  const W = 280, margin = 12;

  // Position so the arrow (at ARROW_FROM_LEFT) points at pinCenterX
  let left = pinCenterX - ARROW_FROM_LEFT;
  let top = pinTipY + 8; // just below the pin tip

  left = Math.max(margin, Math.min(left, innerWidth - W - margin));

  const flippedAbove = top + 250 > innerHeight - margin;
  if (flippedAbove) top = pinTipY - 260;
  top = Math.max(margin, top);

  el.style.left = `${left}px`;
  el.style.top = `${top}px`;

  // Arrow x offset within the popover (clamped inside rounded corners)
  const arrowX = Math.max(16, Math.min(pinCenterX - left, W - 16));
  el.style.setProperty('--tack-arrow-x', `${arrowX}px`);

  // Toggle class to flip arrow direction when popover is above the pin
  el.classList.toggle('is-flipped', flippedAbove);
}

export function showCommentPopover(
  comment: Comment,
  badgeLeft: number,
  badgeTop: number,
  cb: CommentPopoverCallbacks
): void {
  const el = ensure();

  const avatarBg = comment.anchorStatus === 'orphaned' ? '#6b6480'
    : comment.status === 'resolved' ? '#2ea87e' : '#7c5cbf';

  const d = new Date(comment.createdAt);
  const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const timeStr = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  const fullDate = `${dateStr} at ${timeStr}`;

  el.innerHTML = `
    <div class="cp-header">
      <div class="cp-row">
        <div class="cp-avatar" style="background:${avatarBg}">${initials(comment.reviewer.name)}</div>
        <div class="cp-meta">
          <span class="cp-name">${comment.reviewer.name}</span>
          <span class="cp-time" title="${fullDate}">${relativeTime(comment.createdAt)}</span>
        </div>
      </div>
      <div class="cp-header-actions">
        <button class="cp-icon-btn cp-resolve" title="${comment.status === 'open' ? 'Mark resolved' : 'Reopen'}">
          ${comment.status === 'open'
            ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
            : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12 14 14"/></svg>`}
        </button>
        <button class="cp-icon-btn cp-close" title="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>
    <div class="cp-body">
      <div class="cp-text">${comment.text.replace(/\n/g, '<br>')}</div>
      <div class="cp-actions">
        <button class="cp-link cp-edit">Edit</button>
        <span class="cp-sep">·</span>
        <button class="cp-link cp-delete">Delete</button>
      </div>
    </div>
  `;

  positionNear(el, badgeLeft, badgeTop);
  requestAnimationFrame(() => el.classList.add('is-open'));

  const close = () => {
    el.classList.remove('is-open');
    document.removeEventListener('pointerdown', onOutside, true);
    document.removeEventListener('keydown', onKey);
    cb.onClose();
  };

  el.querySelector('.cp-close')!.addEventListener('click', close);
  el.querySelector('.cp-resolve')!.addEventListener('click', () => { cb.onToggleStatus(comment.id); close(); });
  el.querySelector('.cp-edit')!.addEventListener('click', () => { cb.onEdit(comment.id); close(); });
  el.querySelector('.cp-delete')!.addEventListener('click', () => { cb.onDelete(comment.id); close(); });

  const onOutside = (e: PointerEvent) => {
    // Closed shadow DOM: composedPath() only shows up to the host from the document level.
    // If the shadow host is in the path, the click originated somewhere inside our UI — keep open.
    const host = getShadowRoot().host;
    if (e.composedPath().includes(host)) return;
    close();
  };
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };

  // Delay outside listener so the triggering click doesn't immediately close it
  setTimeout(() => {
    document.addEventListener('pointerdown', onOutside, true);
    document.addEventListener('keydown', onKey);
  }, 120);
}

export function hideCommentPopover(): void {
  _el?.classList.remove('is-open');
}
