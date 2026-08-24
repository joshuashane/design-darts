import type { Comment, AnchorData } from './schema.js';
import { hashOf, isOnCurrentScreen } from './utils.js';

const _markers = new Map<string, HTMLElement>();
const _clickCallbacks: Array<(id: string) => void> = [];
let _layer: HTMLElement | null = null;
let _pulseStyleInjected = false;

const PIN_PATH = 'M13,0 C20.2,0 26,5.8 26,13 C26,18.6 22.6,23.3 17.8,25.3 L13,32 L8.2,25.3 C3.4,23.3 0,18.6 0,13 C0,5.8 5.8,0 13,0 Z';

function ensurePulseStyle(): void {
  if (_pulseStyleInjected) return;
  _pulseStyleInjected = true;
  const style = document.createElement('style');
  style.textContent = `
    @keyframes tack-pin-float-in {
      0%   { opacity: 0;   transform: translateY(-28px) scale(0.55); }
      55%  { opacity: 1;   transform: translateY(5px)   scale(1.08); }
      75%  { transform: translateY(-3px) scale(0.96); }
      90%  { transform: translateY(2px)  scale(1.02); }
      100% { opacity: 1;   transform: translateY(0)    scale(1); }
    }
    .tack-marker.is-floating-in {
      animation: tack-pin-float-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
      animation-delay: var(--tack-float-delay, 0ms);
    }
    /* Lawn-dart drop: rise → fall → squash → light bounce settle */
    @keyframes tack-dart-drop {
      0%   { transform: translateY(0)     scaleX(1)    scaleY(1); }
      20%  { transform: translateY(-24px) scaleX(0.93) scaleY(1.05); }
      50%  { transform: translateY(4px)   scaleX(1.3)  scaleY(0.76); }
      65%  { transform: translateY(-5px)  scaleX(0.97) scaleY(1.05); }
      80%  { transform: translateY(1px)   scaleX(1.02) scaleY(0.98); }
      90%  { transform: translateY(-2px)  scaleX(1)    scaleY(1.01); }
      100% { transform: translateY(0)     scaleX(1)    scaleY(1); }
    }
    .tack-marker.is-dart-drop {
      animation: tack-dart-drop 0.52s cubic-bezier(0.4, 0, 0.2, 1) both;
      transform-origin: bottom center;
    }

    @keyframes tack-ring {
      0%   { transform: scale(1);   opacity: 0.65; }
      100% { transform: scale(2.5); opacity: 0; }
    }
    /* Ring lives on the button (no clip-path), circle matches the circular part of the pin */
    .tack-marker::after {
      content: '';
      position: absolute;
      top: 0; left: 0;
      width: 26px; height: 26px;
      border-radius: 50%;
      border: 1.5px solid var(--tack-ring-color, rgba(124,92,191,0.7));
      animation: tack-ring 2.4s ease-out infinite;
      animation-delay: var(--tack-pulse-delay, 0s);
      pointer-events: none;
    }
    /* Pin shape lives on the inner span */
    .tack-pin {
      position: absolute;
      top: 0; left: 0;
      width: 26px; height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 6px;
      clip-path: path('${PIN_PATH}');
      color: #fff;
      font-size: 11px;
      font-weight: 800;
      font-family: system-ui, -apple-system, sans-serif;
      box-shadow: 0 3px 10px rgba(0,0,0,0.45);
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);
}

function ensureLayer(): HTMLElement {
  if (_layer) return _layer;
  ensurePulseStyle();
  _layer = document.createElement('div');
  Object.assign(_layer.style, {
    position: 'fixed',
    inset: '0',
    pointerEvents: 'none',
    zIndex: '2147480000',
  });
  _layer.setAttribute('data-tack-ui', '');
  document.body.appendChild(_layer);
  return _layer;
}

function positionMarker(badge: HTMLElement, el: Element, anchorData?: AnchorData): void {
  const rect = el.getBoundingClientRect();
  if (!rect.width && !rect.height) {
    badge.style.display = 'block';
    badge.style.visibility = 'hidden';
    return;
  }
  badge.style.visibility = 'visible';
  badge.style.display = 'block';
  // Pin tip (bottom-center) at click position; fall back to element top-right
  if (anchorData?.clickPctX !== undefined && anchorData?.clickPctY !== undefined) {
    const x = rect.left + rect.width * anchorData.clickPctX;
    const y = rect.top + rect.height * anchorData.clickPctY;
    badge.style.left = `${x - 13}px`; // center pin horizontally on click
    badge.style.top = `${y - 32}px`;  // pin tip (bottom) at click point
  } else {
    badge.style.left = `${rect.right - 26}px`;
    badge.style.top = `${rect.top - 32}px`;
  }
}

function createBadge(comment: Comment, index: number): HTMLElement {
  // Outer button: click target, no clip-path (so ::after ring isn't clipped)
  const badge = document.createElement('button');
  badge.className = 'tack-marker';
  badge.setAttribute('data-tack-ui', '');
  badge.setAttribute('aria-label', `Comment ${index + 1}`);

  const color = comment.status === 'resolved' ? '#34d399' : '#7c5cbf';
  const ringColor = comment.status === 'resolved' ? 'rgba(52,211,153,0.65)' : 'rgba(124,92,191,0.65)';
  const delay = (Math.random() * 3.5).toFixed(2);

  Object.assign(badge.style, {
    position: 'absolute',
    width: '26px',
    height: '32px',
    background: 'transparent',
    border: 'none',
    padding: '0',
    cursor: 'pointer',
    pointerEvents: 'auto',
    zIndex: '2147480001',
    '--tack-ring-color': ringColor,
    '--tack-pulse-delay': `${delay}s`,
  });

  // Inner span: pin shape via clip-path
  const pin = document.createElement('span');
  pin.className = 'tack-pin';
  pin.textContent = String(index + 1);
  pin.style.background = color;
  badge.appendChild(pin);

  initDrag(badge, comment.id);
  return badge;
}

const _dragCallbacks: Array<(id: string, clientX: number, clientY: number) => void> = [];
const DRAG_THRESHOLD = 6; // px of movement before a drag starts

function initDrag(badge: HTMLElement, id: string): void {
  let startX = 0, startY = 0, dragging = false, startLeft = '', startTop = '';

  badge.addEventListener('pointerdown', (e: PointerEvent) => {
    if (e.button !== 0) return;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = badge.style.left;
    startTop  = badge.style.top;
    dragging = false;

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      if (!dragging && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        dragging = true;
        badge.setPointerCapture(ev.pointerId);
        badge.style.cursor = 'grabbing';
        badge.style.transition = 'none'; // disable fade transitions while dragging
        badge.style.opacity = '1';
        badge.style.pointerEvents = 'auto';
      }
      if (dragging) {
        badge.style.left = `${parseFloat(startLeft) + (ev.clientX - startX)}px`;
        badge.style.top  = `${parseFloat(startTop)  + (ev.clientY - startY)}px`;
      }
    };

    const onUp = (ev: PointerEvent) => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      badge.style.cursor = 'pointer';
      badge.style.transition = '';

      if (dragging) {
        dragging = false;
        // Pin tip is at badge.left + 13, badge.top + 32
        const tipX = parseFloat(badge.style.left) + 13;
        const tipY = parseFloat(badge.style.top)  + 32;
        _dragCallbacks.forEach(cb => cb(id, tipX, tipY));
      } else {
        // Was a click — fire click callbacks
        _clickCallbacks.forEach(cb => cb(id));
      }
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  });
}

function updateBadgeColor(badge: HTMLElement, status: string): void {
  const pin = badge.querySelector('.tack-pin') as HTMLElement | null;
  const color = status === 'resolved' ? '#34d399' : '#7c5cbf';
  const ringColor = status === 'resolved' ? 'rgba(52,211,153,0.65)' : 'rgba(124,92,191,0.65)';
  if (pin) pin.style.background = color;
  badge.style.setProperty('--tack-ring-color', ringColor);
}

export function onMarkerClick(cb: (id: string) => void): void {
  _clickCallbacks.push(cb);
}

export function getMarkerEl(id: string): HTMLElement | undefined {
  return _markers.get(id);
}

export function onMarkerDrag(cb: (id: string, clientX: number, clientY: number) => void): void {
  _dragCallbacks.push(cb);
}

export function addMarker(comment: Comment, el: Element, index: number, floatInDelay?: number): void {
  const layer = ensureLayer();
  removeMarker(comment.id);
  const badge = createBadge(comment, index);
  positionMarker(badge, el, comment.anchorData);

  if (floatInDelay !== undefined) {
    badge.style.setProperty('--tack-float-delay', `${floatInDelay}ms`);
    badge.classList.add('is-floating-in');
    setTimeout(() => badge.classList.remove('is-floating-in'), floatInDelay + 700);
  }

  layer.appendChild(badge);
  _markers.set(comment.id, badge);
}

export function removeMarker(id: string): void {
  const badge = _markers.get(id);
  if (badge?.parentNode) badge.parentNode.removeChild(badge);
  _markers.delete(id);
}


// Screen fade uses opacity + pointer-events only. No setTimeout, no display:none, no races.
function fadeBadgeOut(badge: HTMLElement): void {
  badge.style.transition = 'opacity 0.3s ease';
  badge.style.opacity = '0';
  badge.style.pointerEvents = 'none';
}

function fadeBadgeIn(badge: HTMLElement): void {
  if (badge.style.display === 'none') badge.style.display = 'block'; // restore if element-hidden
  badge.style.transition = 'opacity 0.3s ease';
  badge.style.opacity = '1';
  badge.style.pointerEvents = 'auto';
}

export function refreshAllMarkers(comments: Comment[], resolvedEls: Map<string, Element>): void {
  comments.forEach((c) => {
    const badge = _markers.get(c.id);
    if (!isOnCurrentScreen(c.anchorData.pathname)) {
      if (badge) fadeBadgeOut(badge);
      return;
    }
    const el = resolvedEls.get(c.id);
    if (!badge || !el) return;
    positionMarker(badge, el, c.anchorData);
    updateBadgeColor(badge, c.status);
    fadeBadgeIn(badge); // always restore opacity — clears any lingering fade-out state
  });
}

export function clearAllMarkers(): void {
  _markers.forEach(badge => badge.parentNode?.removeChild(badge));
  _markers.clear();
}
