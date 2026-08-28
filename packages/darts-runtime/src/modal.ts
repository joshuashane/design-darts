import { getShadowRoot } from './shadow-host.js';
import { getStoredReviewer, saveReviewer } from './identity.js';
import type { Reviewer } from './schema.js';

let _popover: HTMLElement | null = null;
let _activeResolve: ((v: { text: string; reviewer: Reviewer } | null) => void) | null = null;

function ensurePopoverCSS(root: ShadowRoot): void {
  if (root.querySelector('#tack-popover-style')) return;
  const style = document.createElement('style');
  style.id = 'tack-popover-style';
  style.textContent = `
    .tack-popover {
      position: fixed;
      z-index: 2147483003;
      background: #1e1b3a;
      border: 1px solid rgba(160,130,255,0.3);
      border-radius: 12px;
      padding: 12px;
      width: 280px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      gap: 8px;
      opacity: 0;
      transform: scale(0.92) translateY(6px);
      transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.16,1,0.3,1);
      pointer-events: none;
    }
    .tack-popover.is-open {
      opacity: 1;
      transform: scale(1) translateY(0);
      pointer-events: auto;
    }
    .tack-popover-name {
      font-size: 11px;
      color: #8878b8;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .tack-popover-name button {
      all: unset;
      cursor: pointer;
      color: #c4b5fd;
      font-size: 11px;
      text-decoration: underline;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .tack-popover-row {
      display: flex;
      gap: 6px;
      align-items: flex-end;
    }
    .tack-popover textarea, .tack-popover input[type="text"] {
      all: unset;
      flex: 1;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(160,130,255,0.2);
      border-radius: 8px;
      padding: 9px 10px;
      font-size: 13px;
      color: #e0d7ff;
      font-family: system-ui, -apple-system, sans-serif;
      box-sizing: border-box;
      width: 100%;
      resize: none;
      line-height: 1.45;
    }
    .tack-popover textarea { min-height: 70px; }
    .tack-popover textarea:focus, .tack-popover input[type="text"]:focus {
      outline: 2px solid #7c5cbf;
      border-color: transparent;
    }
    .tack-popover-send {
      all: unset;
      cursor: pointer;
      width: 32px;
      height: 32px;
      min-width: 32px;
      border-radius: 50%;
      background: #7c5cbf;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      transition: background 0.15s, transform 0.1s;
      font-family: system-ui, sans-serif;
    }
    .tack-popover-send:hover { background: #9370e0; }
    .tack-popover-send:active { transform: scale(0.92); }
  `;
  root.appendChild(style);
}

function getPopover(): HTMLElement {
  const root = getShadowRoot();
  ensurePopoverCSS(root);
  if (_popover) return _popover;

  _popover = document.createElement('div');
  _popover.className = 'tack-popover';
  root.appendChild(_popover);
  return _popover;
}

function positionPopover(popover: HTMLElement, anchorX: number, anchorY: number): void {
  const W = 280, margin = 12;
  let left = anchorX - W / 2;
  let top = anchorY + 16; // below click by default

  // Clamp to viewport
  left = Math.max(margin, Math.min(left, innerWidth - W - margin));
  if (top + 200 > innerHeight - margin) top = anchorY - 220; // flip above if too low
  top = Math.max(margin, top);

  popover.style.left = `${left}px`;
  popover.style.top = `${top}px`;
}

export function closePopover(): void {
  if (_activeResolve) { _activeResolve(null); _activeResolve = null; }
  if (_popover) { _popover.classList.remove('is-open'); _popover.innerHTML = ''; }
}

export function promptComment(
  options?: { defaultText?: string; submitLabel?: string; anchorX?: number; anchorY?: number }
): Promise<{ text: string; reviewer: Reviewer } | null> {
  return new Promise(resolve => {
    // Cancel any open popover
    if (_activeResolve) { _activeResolve(null); _activeResolve = null; }
    _activeResolve = resolve;

    const popover = getPopover();
    const stored = getStoredReviewer();
    const isEdit = !!options?.defaultText;

    popover.innerHTML = '';

    // Reviewer line (shown when name known)
    if (stored?.name) {
      const reviewerLine = document.createElement('div');
      reviewerLine.className = 'tack-popover-name';
      const changeBtn = document.createElement('button');
      changeBtn.textContent = 'Change';
      changeBtn.addEventListener('click', () => {
        nameInput.style.display = '';
        reviewerLine.style.display = 'none';
        nameInput.focus();
      });
      reviewerLine.innerHTML = `Commenting as <strong>${stored.name}</strong> `;
      reviewerLine.appendChild(changeBtn);
      popover.appendChild(reviewerLine);
    }

    // Name input (hidden if already stored)
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Your name (required)';
    nameInput.autocomplete = 'name';
    nameInput.value = stored?.name ?? '';
    nameInput.style.display = stored?.name ? 'none' : '';
    popover.appendChild(nameInput);

    // Textarea + send button row
    const row = document.createElement('div');
    row.className = 'tack-popover-row';

    const textarea = document.createElement('textarea');
    textarea.placeholder = 'Add a comment…';
    textarea.rows = 3;
    textarea.value = options?.defaultText ?? '';

    const sendBtn = document.createElement('button');
    sendBtn.className = 'tack-popover-send';
    sendBtn.setAttribute('aria-label', options?.submitLabel ?? 'Save comment');
    sendBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z"/></svg>`;

    row.appendChild(textarea);
    row.appendChild(sendBtn);
    popover.appendChild(row);

    // Position and show
    const ax = options?.anchorX ?? innerWidth / 2;
    const ay = options?.anchorY ?? innerHeight / 2;
    positionPopover(popover, ax, ay);
    requestAnimationFrame(() => popover.classList.add('is-open'));

    const close = (result: { text: string; reviewer: Reviewer } | null) => {
      popover.classList.remove('is-open');
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onOutside, true);
      _activeResolve = null;
      resolve(result);
    };

    const onSubmit = () => {
      const name = nameInput.style.display === 'none' ? (stored?.name ?? '') : nameInput.value.trim();
      const text = textarea.value.trim();
      if (!name) { nameInput.style.display = ''; nameInput.style.outline = '2px solid #f87171'; nameInput.focus(); return; }
      if (!text) { textarea.focus(); return; }
      nameInput.style.outline = '';
      const reviewer: Reviewer = { name };
      saveReviewer(reviewer);
      close({ text, reviewer });
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close(null);
    };

    const onOutside = (e: PointerEvent) => {
      const root = getShadowRoot();
      const target = e.target as Node;
      // Check if click is outside the popover (in light DOM or shadow DOM)
      if (!popover.contains(target) && !(root.host as HTMLElement).contains(target)) {
        close(null);
      }
    };

    // stopPropagation inside the shadow DOM prevents document-level hotkeys (e.g. 'C' → arm mode)
    // from firing while the user is typing. composedPath() is truncated for closed shadow roots
    // at the document level, so the keyboard.ts guard can't detect focus inside shadow inputs.
    textarea.addEventListener('keydown', (e: KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === 'Escape') { e.preventDefault(); close(null); }
      // Shift+Enter for newline; plain Enter submits
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSubmit(); }
    });
    nameInput.addEventListener('keydown', (e: KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === 'Escape') { e.preventDefault(); close(null); }
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSubmit(); }
    });

    sendBtn.addEventListener('click', onSubmit);
    document.addEventListener('keydown', onKey);
    setTimeout(() => document.addEventListener('pointerdown', onOutside, true), 100);

    if (isEdit || stored?.name) {
      textarea.focus();
      if (isEdit) { textarea.select(); }
    } else {
      nameInput.focus();
    }
  });
}
