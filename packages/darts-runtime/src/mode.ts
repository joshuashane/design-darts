let _armed = false;
const _armCallbacks: Array<() => void> = [];
const _disarmCallbacks: Array<() => void> = [];
const _clickCallbacks: Array<(el: Element, clientX: number, clientY: number) => void> = [];

let _banner: HTMLElement | null = null;

function createBanner(): HTMLElement {
  const el = document.createElement('div');
  el.className = 'tack-mode-banner';
  el.setAttribute('aria-live', 'polite');
  el.textContent = 'Design Darts — click any element to pin a comment. Press Esc to cancel.';
  Object.assign(el.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    zIndex: '2147483000',
    background: '#1a1a2e',
    color: '#e0d7ff',
    textAlign: 'center',
    padding: '10px 16px',
    fontSize: '13px',
    fontFamily: 'system-ui, sans-serif',
    fontWeight: '600',
    pointerEvents: 'none',
  });
  return el;
}

function onDocClick(evt: MouseEvent): void {
  if (!_armed) return;
  const target = evt.target as Element;
  if (!target || !isAnnotatable(target)) return;
  evt.preventDefault();
  evt.stopPropagation();
  _clickCallbacks.forEach(cb => cb(target, evt.clientX, evt.clientY));
}

export function isAnnotatable(el: Element): boolean {
  if (el.closest('[data-tack-ignore]')) return false;
  if (el.closest('[data-tack-allow]')) return true;
  if (el.closest('.tack-shadow-host, [data-tack-ui]')) return false;
  const blocked = el.closest('dialog, [popover], [role="dialog"], [role="menu"], [role="tooltip"], [aria-modal="true"]');
  return !blocked;
}

export function isArmed(): boolean { return _armed; }

export function onArm(cb: () => void): void { _armCallbacks.push(cb); }
export function onDisarm(cb: () => void): void { _disarmCallbacks.push(cb); }
export function onElementClick(cb: (el: Element, clientX: number, clientY: number) => void): void { _clickCallbacks.push(cb); }

export function arm(): void {
  if (_armed) return;
  _armed = true;
  document.body.style.cursor = 'crosshair';
  _banner = createBanner();
  document.body.appendChild(_banner);
  document.addEventListener('click', onDocClick, { capture: true });
  _armCallbacks.forEach(cb => cb());
}

export function disarm(): void {
  if (!_armed) return;
  _armed = false;
  document.body.style.cursor = '';
  if (_banner?.parentNode) _banner.parentNode.removeChild(_banner);
  _banner = null;
  document.removeEventListener('click', onDocClick, { capture: true });
  _disarmCallbacks.forEach(cb => cb());
}
