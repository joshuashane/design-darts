import { initShadowHost, setPanelCollapsed, getPanelCollapsed, getPanel } from './shadow-host.js';
import { loadPayload, savePayload, onStorageUnavailable } from './store.js';
import { buildAnchorData, resolveElement } from './anchor.js';
import { arm, disarm, isArmed, isAnnotatable, onElementClick, onArm, onDisarm } from './mode.js';
import { promptComment } from './modal.js';
import { addMarker, refreshAllMarkers, removeMarker, onMarkerClick, onMarkerDrag, getMarkerEl } from './markers.js';
import { renderPanel, showStorageBanner, focusPanelItem, flashPanelItem } from './panel.js';
import { renderToolbar, onSend, onPresenter, onImport } from './toolbar.js';
import { sendFeedback, downloadJSON } from './send.js';
import { startObservers } from './observer.js';
import { bindKeyboard } from './keyboard.js';
import { isPresenterMode, applyPresenterMode } from './presenter.js';
import { handleDeepLink } from './deeplinking.js';
import { generateId, contentHash, hashOf, isOnCurrentScreen } from './utils.js';
import { showCommentPopover, hideCommentPopover } from './comment-popover.js';
import type { Comment, StoragePayload } from './schema.js';

let payload: StoragePayload;
const resolvedEls = new Map<string, Element>();
let _screenState: string | undefined;
let _filter: 'all' | 'open' | 'resolved' = 'all';
let _presenterHidden = false;
let _latestCommentId: string | undefined;

let _toastTimer: ReturnType<typeof setTimeout> | null = null;

function injectToastStyles(): void {
  if (document.getElementById('tack-toast-styles')) return;
  const s = document.createElement('style');
  s.id = 'tack-toast-styles';
  s.textContent = `
    @keyframes tack-icon-pop {
      0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
      65%  { transform: scale(1.35) rotate(6deg);  opacity: 1; }
      100% { transform: scale(1)   rotate(0deg);   opacity: 1; }
    }
    .tack-import-toast { display: flex; align-items: center; gap: 10px; }
    .tack-import-toast .ti-icon {
      width: 22px; height: 22px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 900; flex-shrink: 0;
      animation: tack-icon-pop 0.45s cubic-bezier(0.22,1,0.36,1) both;
    }
    .tack-import-toast .ti-msg { font-size: 12px; font-weight: 600; white-space: nowrap; }
  `;
  document.head.appendChild(s);
}

function showToast(msg: string): void {
  document.querySelector('.tack-toast')?.remove();
  if (_toastTimer) clearTimeout(_toastTimer);

  const toast = document.createElement('div');
  toast.className = 'tack-toast';
  toast.setAttribute('data-tack-ui', '');
  toast.textContent = msg;
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '80px',
    left: '50%',
    transform: 'translateX(-50%) translateY(12px)',
    opacity: '0',
    zIndex: '2147483000',
    background: 'rgba(26, 26, 46, 0.95)',
    color: '#e0d7ff',
    fontSize: '12px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: '8px 18px',
    borderRadius: '999px',
    border: '1px solid rgba(160,130,255,0.25)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease',
  });
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(-50%) translateY(0)';
    toast.style.opacity = '1';
  });
  _toastTimer = setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(12px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

type ImportToastKind = 'success' | 'partial' | 'error' | 'dupe';

function showImportToast(kind: ImportToastKind, message: string): void {
  injectToastStyles();
  document.querySelector('.tack-toast')?.remove();
  if (_toastTimer) clearTimeout(_toastTimer);

  const cfg = {
    success: { icon: '✓', iconBg: '#34d399', iconColor: '#022c22', border: 'rgba(52,211,153,0.4)',  bg: 'rgba(6,46,32,0.92)',  glow: 'rgba(52,211,153,0.2)'  },
    partial:  { icon: '↓', iconBg: '#fbbf24', iconColor: '#1c1100', border: 'rgba(251,191,36,0.4)',  bg: 'rgba(28,20,0,0.92)',   glow: 'rgba(251,191,36,0.2)'  },
    error:    { icon: '✕', iconBg: '#f87171', iconColor: '#1a0000', border: 'rgba(248,113,113,0.4)', bg: 'rgba(30,8,8,0.92)',    glow: 'rgba(248,113,113,0.2)' },
    dupe:     { icon: '↺', iconBg: '#8878b8', iconColor: '#1a1a2e', border: 'rgba(160,130,255,0.3)', bg: 'rgba(26,26,46,0.95)',  glow: 'rgba(124,92,191,0.15)' },
  }[kind];

  const toast = document.createElement('div');
  toast.className = 'tack-toast tack-import-toast';
  toast.setAttribute('data-tack-ui', '');
  toast.innerHTML = `
    <span class="ti-icon" style="background:${cfg.iconBg};color:${cfg.iconColor}">${cfg.icon}</span>
    <span class="ti-msg">${message}</span>
  `;

  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '80px',
    left: '50%',
    transform: 'translateX(-50%) translateY(20px) scale(0.88)',
    opacity: '0',
    zIndex: '2147483000',
    background: cfg.bg,
    color: '#e0d7ff',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: '8px 14px 8px 10px',
    borderRadius: '999px',
    border: `1px solid ${cfg.border}`,
    boxShadow: `0 4px 24px rgba(0,0,0,0.5), 0 0 0 4px ${cfg.glow}`,
    pointerEvents: 'none',
    transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease',
  });

  document.body.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    toast.style.transform = 'translateX(-50%) translateY(0) scale(1)';
    toast.style.opacity = '1';
  }));

  _toastTimer = setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(12px) scale(0.92)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

function dartImpactRipple(x: number, y: number): void {
  // Elliptical ring at pin tip — like a dart poking into dirt
  const ring = document.createElement('div');
  Object.assign(ring.style, {
    position: 'fixed',
    left: `${x - 18}px`,
    top: `${y - 5}px`,
    width: '36px',
    height: '10px',
    borderRadius: '50%',
    border: '1.5px solid rgba(124, 92, 191, 0.55)',
    transform: 'scale(0.2)',
    opacity: '0.9',
    pointerEvents: 'none',
    zIndex: '2147483000',
    transition: 'transform 0.45s cubic-bezier(0.2, 0, 0.8, 1), opacity 0.45s ease-out',
  });
  document.body.appendChild(ring);
  requestAnimationFrame(() => {
    ring.style.transform = 'scale(1)';
    ring.style.opacity = '0';
  });
  setTimeout(() => ring.remove(), 500);
}

function refresh(newId?: string): void {
  if (newId !== undefined) _latestCommentId = newId;
  refreshAllMarkers(payload.comments, resolvedEls);
  renderPanel(payload.comments, focusComment, toggleStatus, _filter, editComment, deleteComment, _latestCommentId);
  renderToolbar(payload.comments.length);
  // Clear after one render so the entrance animation only plays once
  _latestCommentId = undefined;
}

function isPanelOpen(): boolean {
  return !getPanelCollapsed();
}

function currentPath(): string {
  return location.pathname + location.search + location.hash;
}

function focusComment(id: string): void {
  const c = payload.comments.find(x => x.id === id);
  if (!c) return;

  // If comment is on a different screen, navigate there first and re-focus after DOM rebuilds
  const commentPath = c.anchorData.pathname;
  const onDifferentScreen = commentPath && commentPath !== currentPath();

  if (onDifferentScreen) {
    // Extract the hash portion to navigate — works for hash-based SPAs
    const hashMatch = commentPath.match(/#.*$/);
    if (hashMatch) location.hash = hashMatch[0];
    // Re-run after DOM settles (the hashchange listener will resolveAll, then we focus)
    setTimeout(() => focusComment(id), 350);
    return;
  }

  // If panel is open: focus + flash the card
  if (isPanelOpen()) {
    focusPanelItem(id);
    flashPanelItem(id);
  }

  // Get badge rect; fall back to anchor element rect if badge is hidden (display:none → zero dims)
  const el = resolvedEls.get(id);
  const badge = getMarkerEl(id);
  const badgeRect = badge?.getBoundingClientRect();
  // Badge is usable if it has size AND isn't currently faded out (opacity:0 from screen filter)
  const badgeVisible = badgeRect && (badgeRect.width > 0 || badgeRect.height > 0)
    && badge!.style.opacity !== '0';
  // pinCenterX = horizontal center of the pin circle; pinTipY = the pointed tip at the bottom
  let pinCenterX: number, pinTipY: number;
  if (badgeVisible) {
    pinCenterX = badgeRect!.left + 13;  // center of 26px badge
    pinTipY    = badgeRect!.top  + 32;  // tip at bottom of pin
  } else {
    const elRect = el?.getBoundingClientRect();
    pinCenterX = elRect ? elRect.left + elRect.width  * (c.anchorData.clickPctX ?? 0.5) : innerWidth  / 2;
    pinTipY    = elRect ? elRect.top  + elRect.height * (c.anchorData.clickPctY ?? 0.3) : innerHeight / 3;
  }
  const bx = pinCenterX;
  const by = pinTipY;

  // Scroll first so the badge is at its final position before the popover is placed
  if (el) el.scrollIntoView({ block: 'center' });

  showCommentPopover(c, bx, by, {
    onToggleStatus: (cid) => { toggleStatus(cid); refresh(); },
    onEdit: (cid) => editComment(cid),
    onDelete: (cid) => deleteComment(cid),
    onClose: () => {},
  });
}

function toggleStatus(id: string): void {
  const c = payload.comments.find(x => x.id === id);
  if (!c) return;
  c.status = c.status === 'open' ? 'resolved' : 'open';
  savePayload(payload);
  refresh();
}

async function editComment(id: string): Promise<void> {
  const c = payload.comments.find(x => x.id === id);
  if (!c) return;
  const badge = document.querySelector<HTMLButtonElement>(`.tack-marker[aria-label="Comment ${payload.comments.indexOf(c) + 1}"]`);
  const rect = badge?.getBoundingClientRect();
  const ax = rect ? rect.left + rect.width / 2 : innerWidth / 2;
  const ay = rect ? rect.bottom : innerHeight / 2;
  const result = await promptComment({ defaultText: c.text, submitLabel: 'Save changes', anchorX: ax, anchorY: ay });
  if (!result) return;
  c.text = result.text;
  c.reviewer = result.reviewer;
  savePayload(payload);
  refresh();
}

function burstParticles(x: number, y: number): void {
  const colors = ['#7c5cbf', '#c4b5fd', '#a78bfa', '#8b5cf6', '#ede9fe'];
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    const angle = (i / 12) * Math.PI * 2;
    const dist = 30 + Math.random() * 30;
    const size = 4 + Math.random() * 4;
    Object.assign(p.style, {
      position: 'fixed',
      left: `${x - size / 2}px`,
      top: `${y - size / 2}px`,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      background: colors[Math.floor(Math.random() * colors.length)],
      pointerEvents: 'none',
      zIndex: '2147483000',
      transition: `transform 0.45s cubic-bezier(0.2,0,0.8,1), opacity 0.45s ease`,
      opacity: '1',
    });
    document.body.appendChild(p);
    requestAnimationFrame(() => {
      p.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0.1)`;
      p.style.opacity = '0';
    });
    setTimeout(() => p.remove(), 500);
  }
}

function deleteComment(id: string): void {
  // Animate the panel card out first, then actually delete
  const panelCard = getPanel().querySelector(`[data-comment-id="${id}"]`) as HTMLElement | null;

  const doDelete = () => {
    const idx = payload.comments.findIndex(x => x.id === id);
    if (idx === -1) return;
    const badge = getMarkerEl(id);
    if (badge) {
      const rect = badge.getBoundingClientRect();
      burstParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
    payload.comments = payload.comments.filter(x => x.id !== id);
    resolvedEls.delete(id);
    removeMarker(id);
    savePayload(payload);
    refresh();
  };

  if (panelCard) {
    panelCard.classList.add('is-deleting');
    setTimeout(doDelete, 230);
  } else {
    doDelete();
  }
}

function togglePresenter(): void {
  _presenterHidden = !_presenterHidden;
  applyPresenterMode(_presenterHidden);
}


function resolveAll(): void {
  payload.comments.forEach((c, i) => {
    const el = resolveElement(c.anchorData);
    if (el) {
      resolvedEls.set(c.id, el);
      c.anchorStatus = 'resolved';
      // Create badge if one doesn't exist yet (e.g. comment was deferred from import)
      if (!getMarkerEl(c.id)) {
        addMarker(c, el, i);
      }
    } else {
      resolvedEls.delete(c.id);
      if (isOnCurrentScreen(c.anchorData.pathname)) {
        c.anchorStatus = 'orphaned';
      }
    }
  });
}

function init(): void {
  if ((window as { Tack?: unknown }).Tack) return; // guard against double-init

  onStorageUnavailable(() => showStorageBanner());
  payload = loadPayload();

  initShadowHost();
  setPanelCollapsed(true); // panel starts collapsed; opens when user wants it
  resolveAll();

  payload.comments.forEach((c, i) => {
    const el = resolvedEls.get(c.id);
    if (el) addMarker(c, el, i);
  });

  onMarkerClick(focusComment);

  onMarkerDrag((id, tipX, tipY) => {
    const c = payload.comments.find(x => x.id === id);
    if (!c) return;

    // Find the element under the pin tip — hide badge briefly to avoid self-targeting
    const badge = getMarkerEl(id);
    if (badge) { badge.style.visibility = 'hidden'; badge.style.pointerEvents = 'none'; }
    const target = document.elementFromPoint(tipX, tipY) as Element | null;
    if (badge) { badge.style.visibility = ''; badge.style.pointerEvents = 'auto'; }

    if (!target || !isAnnotatable(target)) {
      // Invalid drop target — snap back to last known position
      refresh();
      return;
    }

    // Recompute anchor data at the new position
    c.anchorData = buildAnchorData(target, tipX, tipY);
    c.anchorData.screenState = _screenState;
    c.anchorStatus = 'resolved';
    resolvedEls.set(id, target);
    savePayload(payload);
    refresh();

    // Lawn-dart drop animation: rise → fall → squash + impact ripple
    requestAnimationFrame(() => {
      const b = getMarkerEl(id);
      if (b) {
        b.classList.remove('is-dart-drop');
        void b.offsetWidth; // force reflow to restart animation
        b.classList.add('is-dart-drop');
        setTimeout(() => b.classList.remove('is-dart-drop'), 560);
      }
      dartImpactRipple(tipX, tipY);
    });
  });

  onArm(() => { hideCommentPopover(); renderToolbar(payload.comments.length); });
  onDisarm(() => renderToolbar(payload.comments.length));

  onElementClick(async (el, clientX, clientY) => {
    disarm();
    const anchorData = buildAnchorData(el, clientX, clientY);
    anchorData.screenState = _screenState;
    const result = await promptComment({ anchorX: clientX, anchorY: clientY });
    if (!result) return;
    const comment: Comment = {
      id: generateId(),
      reviewer: result.reviewer,
      text: result.text,
      anchorData,
      anchorStatus: 'resolved',
      status: 'open',
      createdAt: Date.now(),
    };
    payload.comments.push(comment);
    savePayload(payload);
    resolvedEls.set(comment.id, el);
    addMarker(comment, el, payload.comments.length - 1);
    setPanelCollapsed(false);
    refresh(comment.id);

    // Lawn-dart drop for newly placed pin
    requestAnimationFrame(() => {
      const b = getMarkerEl(comment.id);
      if (b) {
        b.classList.remove('is-dart-drop');
        void b.offsetWidth;
        b.classList.add('is-dart-drop');
        setTimeout(() => b.classList.remove('is-dart-drop'), 560);
      }
      dartImpactRipple(clientX, clientY);
    });
  });

  onSend(async () => {
    await sendFeedback(payload, showToast);
  });

  onImport(async (file) => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(await file.text());
    } catch {
      showImportToast('error', 'Invalid JSON file');
      return;
    }
    if (!parsed || typeof parsed !== 'object' || (parsed as Record<string, unknown>)['schemaVersion'] !== 1) {
      showImportToast('error', 'Not a valid tack feedback file');
      return;
    }
    const incoming = (parsed as { comments?: unknown[] }).comments;
    if (!Array.isArray(incoming)) { showImportToast('error', 'No comments found in file'); return; }

    // Dedup key: same formula as darts-ingest
    const existingKeys = new Set(payload.comments.map(c =>
      `${c.anchorData.cssSelector}::${c.reviewer.name}::${contentHash(c.text)}`
    ));

    let placed = 0, deferred = 0, orphaned = 0;
    for (const raw of incoming) {
      if (!raw || typeof raw !== 'object') continue;
      const r = raw as Record<string, unknown>;
      const text = typeof r['text'] === 'string' ? r['text'] : '';
      const anchorData = (r['anchorData'] && typeof r['anchorData'] === 'object') ? r['anchorData'] as Record<string, unknown> : {};
      const cssSelector = typeof anchorData['cssSelector'] === 'string' ? anchorData['cssSelector'] : '';
      const reviewer = (r['reviewer'] && typeof r['reviewer'] === 'object') ? r['reviewer'] as { name?: string } : {};
      const reviewerName = typeof reviewer['name'] === 'string' ? reviewer['name'] : 'Unknown';
      if (!text) continue;

      const key = `${cssSelector}::${reviewerName}::${contentHash(text)}`;
      if (existingKeys.has(key)) continue;
      existingKeys.add(key);

      const storedPathname = typeof anchorData['pathname'] === 'string' ? anchorData['pathname'] : '';
      const comment: Comment = {
        id: generateId(),
        text,
        reviewer: { name: reviewerName },
        anchorData: {
          cssSelector,
          xpath: typeof anchorData['xpath'] === 'string' ? anchorData['xpath'] : '',
          textSnippet: typeof anchorData['textSnippet'] === 'string' ? anchorData['textSnippet'] : '',
          pathname: storedPathname,
          screenState: typeof anchorData['screenState'] === 'string' ? anchorData['screenState'] : undefined,
          viewport: (anchorData['viewport'] && typeof anchorData['viewport'] === 'object')
            ? anchorData['viewport'] as { width: number; height: number; dpr: number }
            : { width: 0, height: 0, dpr: 1 },
          clickPctX: typeof anchorData['clickPctX'] === 'number' ? anchorData['clickPctX'] : undefined,
          clickPctY: typeof anchorData['clickPctY'] === 'number' ? anchorData['clickPctY'] : undefined,
        },
        anchorStatus: 'resolved',
        status: r['status'] === 'resolved' ? 'resolved' : 'open',
        createdAt: typeof r['createdAt'] === 'number' ? r['createdAt'] : Date.now(),
      };

      // Check if this comment belongs to the current screen
      const commentHash = storedPathname.match(/#.*$/)?.[0] ?? '';
      const curHash = location.hash;
      const onThisScreen = !commentHash
        ? true // pre-navigation comment; element resolution handles badge hiding
        : commentHash === curHash;

      if (onThisScreen) {
        // Try to resolve immediately and show pin with float-in
        const el = resolveElement(comment.anchorData);
        if (el) {
          resolvedEls.set(comment.id, el);
          comment.anchorStatus = 'resolved';
          addMarker(comment, el, payload.comments.length, placed * 80);
          placed++;
        } else {
          comment.anchorStatus = 'orphaned';
          orphaned++;
        }
      } else {
        // Comment belongs to another screen — defer resolution until user navigates there
        comment.anchorStatus = 'resolved'; // optimistic; resolveAll() will confirm on nav
        deferred++;
      }
      payload.comments.push(comment);
    }

    const total = placed + deferred + orphaned;
    if (total === 0) { showImportToast('dupe', 'Already imported — no new comments'); return; }
    savePayload(payload);
    refresh();

    if (orphaned > 0 && deferred === 0) {
      showImportToast('partial', `${total} imported · ${orphaned} couldn't be placed`);
    } else if (deferred > 0 && orphaned === 0) {
      showImportToast('success',
        `${total} imported · ${deferred} will appear on other screens`);
    } else if (deferred > 0 && orphaned > 0) {
      showImportToast('partial',
        `${total} imported · ${deferred} on other screens · ${orphaned} unresolved`);
    } else {
      showImportToast('success', `${total} comment${total !== 1 ? 's' : ''} imported`);
    }
  });

  onPresenter(togglePresenter);

  startObservers(
    () => payload.comments.filter(c => c.anchorStatus === 'orphaned'),
    (id, el) => {
      const c = payload.comments.find(x => x.id === id);
      if (!c) return;
      c.anchorStatus = 'resolved';
      resolvedEls.set(id, el);
      addMarker(c, el, payload.comments.indexOf(c));
      savePayload(payload);
      refresh();
    },
    () => refreshAllMarkers(payload.comments, resolvedEls),
  );

  bindKeyboard(arm, disarm, togglePresenter);

  if (isPresenterMode()) applyPresenterMode(true);

  handleDeepLink(payload.comments, focusComment);

  window.addEventListener('resize', () => refreshAllMarkers(payload.comments, resolvedEls));
  window.addEventListener('scroll', () => refreshAllMarkers(payload.comments, resolvedEls), { passive: true });

  // Re-resolve after SPA navigation — the DOM is rebuilt, so element references go stale
  window.addEventListener('hashchange', () => {
    // Small delay so the SPA's new DOM is in place before we try to resolve
    setTimeout(() => { resolveAll(); refresh(); }, 100);
  });

  refresh();

  (window as { Tack?: unknown }).Tack = {
    setScreenState(s: string) { _screenState = s; },
    refresh() { resolveAll(); refresh(); }, // full re-resolve + re-render
    arm,
    disarm,
    isArmed,
    download: () => downloadJSON(payload),
  };
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();
