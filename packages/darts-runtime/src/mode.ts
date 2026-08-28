let _armed = false;
const _armCallbacks: Array<() => void> = [];
const _disarmCallbacks: Array<() => void> = [];
const _clickCallbacks: Array<(el: Element, clientX: number, clientY: number) => void> = [];

let _banner: HTMLElement | null = null;
let _overlay: HTMLElement | null = null;

// SVG crosshair reticle: dark outline for contrast on any background, brand purple on top
const _CURSOR = (() => {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">` +
    `<g stroke="rgba(0,0,0,0.45)" stroke-width="2.5" fill="none" stroke-linecap="round">` +
    `<circle cx="16" cy="16" r="7"/>` +
    `<line x1="16" y1="0" x2="16" y2="8"/>` +
    `<line x1="16" y1="24" x2="16" y2="32"/>` +
    `<line x1="0" y1="16" x2="8" y2="16"/>` +
    `<line x1="24" y1="16" x2="32" y2="16"/>` +
    `</g>` +
    `<g stroke="#c4b5fd" stroke-width="1.5" fill="none" stroke-linecap="round">` +
    `<circle cx="16" cy="16" r="7"/>` +
    `<line x1="16" y1="0" x2="16" y2="8"/>` +
    `<line x1="16" y1="24" x2="16" y2="32"/>` +
    `<line x1="0" y1="16" x2="8" y2="16"/>` +
    `<line x1="24" y1="16" x2="32" y2="16"/>` +
    `</g>` +
    `<circle cx="16" cy="16" r="1.5" fill="#c4b5fd"/>` +
    `</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 16 16, crosshair`;
})();

function createBanner(): HTMLElement {
  const el = document.createElement('div');
  el.className = 'tack-mode-banner';
  el.setAttribute('aria-live', 'polite');
  el.textContent = 'Click any element to pin a comment · Esc to cancel';
  Object.assign(el.style, {
    position: 'fixed',
    bottom: '82px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: '2147483000',
    background: 'rgba(26, 26, 46, 0.95)',
    color: '#e0d7ff',
    padding: '7px 16px',
    borderRadius: '999px',
    fontSize: '12px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontWeight: '600',
    border: '1px solid rgba(160, 130, 255, 0.3)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    letterSpacing: '0.01em',
  });
  return el;
}

// Full-viewport transparent overlay that intercepts ALL pointer events so
// nothing in the prototype (outside-click handlers, hover states, etc.) fires.
// The cursor is set here so it never reverts to the prototype element's cursor.
// We hit-test through the overlay by briefly hiding it and calling elementFromPoint.
function createOverlay(): HTMLElement {
  const el = document.createElement('div');
  el.setAttribute('data-tack-ui', '');
  Object.assign(el.style, {
    position: 'fixed',
    inset: '0',
    // Below the Design Darts shadow host (2147483000) but above everything else
    zIndex: '2147482999',
    cursor: _CURSOR,
  });

  el.addEventListener('click', (e: MouseEvent) => {
    if (!_armed) return;
    // Temporarily hide to find the real element underneath
    el.style.display = 'none';
    const target = document.elementFromPoint(e.clientX, e.clientY) as Element | null;
    el.style.display = '';
    if (!target || !isAnnotatable(target)) return;
    e.stopPropagation();
    _clickCallbacks.forEach(cb => cb(target, e.clientX, e.clientY));
  });

  return el;
}

export function isAnnotatable(el: Element): boolean {
  if (el.closest('[data-tack-ignore]')) return false;
  if (el.closest('[data-tack-allow]')) return true;
  if (el.closest('.tack-shadow-host, [data-tack-ui]')) return false;
  return true;
}

export function isArmed(): boolean { return _armed; }

export function onArm(cb: () => void): void { _armCallbacks.push(cb); }
export function onDisarm(cb: () => void): void { _disarmCallbacks.push(cb); }
export function onElementClick(cb: (el: Element, clientX: number, clientY: number) => void): void { _clickCallbacks.push(cb); }

export function arm(): void {
  if (_armed) return;
  _armed = true;
  _overlay = createOverlay();
  document.body.appendChild(_overlay);
  _banner = createBanner();
  document.body.appendChild(_banner);
  _armCallbacks.forEach(cb => cb());
}

export function disarm(): void {
  if (!_armed) return;
  _armed = false;
  if (_overlay?.parentNode) _overlay.parentNode.removeChild(_overlay);
  _overlay = null;
  if (_banner?.parentNode) _banner.parentNode.removeChild(_banner);
  _banner = null;
  _disarmCallbacks.forEach(cb => cb());
}
