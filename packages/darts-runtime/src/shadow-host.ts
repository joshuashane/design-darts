let _shadowRoot: ShadowRoot | null = null;
let _panel: HTMLElement | null = null;
let _toolbar: HTMLElement | null = null;
let _panelTab: HTMLElement | null = null;
let _tabTop = 80; // px from top of viewport; updated by drag

const CSS = `
  :host { all: initial; }
  *, *::before, *::after { box-sizing: border-box; }

  @keyframes tack-slide-up {
    from { transform: translateX(-50%) translateY(120%); opacity: 0; }
    to   { transform: translateX(-50%) translateY(0);    opacity: 1; }
  }

  @keyframes tack-slide-in-right {
    from { transform: translateX(120%); opacity: 0; }
    to   { transform: translateX(0);    opacity: 1; }
  }

  #tack-toolbar {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    background: #1a1a2e;
    border: 1px solid rgba(160, 130, 255, 0.25);
    border-radius: 999px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.35);
    font-family: system-ui, -apple-system, sans-serif;
    z-index: 9000;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
  }

  #tack-panel {
    position: fixed;
    top: 16px;
    right: 16px;
    bottom: 16px;
    width: min(340px, calc(100vw - 32px));
    background: rgba(18, 16, 38, 0.88);
    backdrop-filter: blur(20px) saturate(1.4);
    -webkit-backdrop-filter: blur(20px) saturate(1.4);
    border: 1px solid rgba(160, 130, 255, 0.18);
    border-radius: 16px;
    box-shadow: 0 12px 32px rgba(0,0,0,0.4);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-family: system-ui, -apple-system, sans-serif;
    color: #e0d7ff;
    z-index: 9000;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
  }

  /* Tooltip for toolbar buttons with title attribute */
  .tack-toolbar-icon, .tack-has-tip {
    position: relative;
  }
  .tack-toolbar-icon::after, .tack-has-tip::after {
    content: attr(title);
    position: absolute;
    bottom: calc(100% + 16px);
    left: 50%;
    transform: translateX(-50%);
    background: rgba(14, 12, 30, 0.97);
    color: #e0d7ff;
    font-size: 11px;
    font-family: system-ui, -apple-system, sans-serif;
    font-weight: 500;
    white-space: nowrap;
    padding: 5px 10px;
    border-radius: 7px;
    border: 1px solid rgba(160,130,255,0.18);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s, transform 0.15s;
    transform: translateX(-50%) translateY(4px);
  }
  .tack-toolbar-icon:hover::after, .tack-has-tip:hover::after {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  button {
    all: unset;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 13px;
    font-weight: 600;
    font-family: system-ui, -apple-system, sans-serif;
    transition: background 0.15s;
    white-space: nowrap;
  }

  .btn-primary {
    background: #7c5cbf;
    color: #fff;
  }
  .btn-primary:hover { background: #8f6fd4; }

  .btn-ghost {
    color: #c4b5fd;
    padding: 8px;
  }
  .btn-ghost:hover { background: rgba(160,130,255,0.15); }

  .btn-arm {
    background: rgba(160,130,255,0.12);
    color: #c4b5fd;
    border: 1px solid rgba(160,130,255,0.25);
  }
  .btn-arm.is-armed {
    background: #7c5cbf;
    color: #fff;
    box-shadow: 0 0 0 2px rgba(124,92,191,0.4);
  }
  .btn-arm:hover { background: rgba(160,130,255,0.22); }

  .panel-header {
    padding: 14px 16px 10px;
    border-bottom: 1px solid rgba(160,130,255,0.15);
    font-size: 13px;
    font-weight: 700;
    color: #c4b5fd;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .panel-collapse-btn {
    all: unset;
    cursor: pointer;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8878b8;
    font-size: 18px;
    line-height: 1;
    border-radius: 6px;
    border: 1px solid rgba(160,130,255,0.18);
    background: rgba(160,130,255,0.08);
    transition: color 0.15s, background 0.15s, border-color 0.15s;
    flex-shrink: 0;
    gap: 0;
    font-family: system-ui, -apple-system, sans-serif;
  }
  .panel-collapse-btn:hover {
    color: #e0d7ff;
    background: rgba(160,130,255,0.18);
    border-color: rgba(160,130,255,0.35);
  }

  #tack-panel.is-collapsed {
    transform: translateX(calc(100% + 20px));
  }
  #tack-panel-tab {
    position: fixed;
    right: 0;
    top: 80px; /* JS sets this; CSS value is just the initial fallback */
    transform: translateX(100%);
    background: #1a1a2e;
    border: 1px solid rgba(160, 130, 255, 0.25);
    border-right: none;
    border-radius: 8px 0 0 8px;
    padding: 12px 6px;
    cursor: grab;
    color: #c4b5fd;
    font-size: 12px;
    font-family: system-ui, -apple-system, sans-serif;
    writing-mode: vertical-rl;
    letter-spacing: 0.05em;
    z-index: 9001;
    gap: 0;
    user-select: none;
    /* Elastic snap-back on hover-release (base transition = out-transition) */
    transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
                padding-left 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
                background 0.2s ease;
  }
  #tack-panel-tab.is-visible { transform: translateX(0); }
  #tack-panel-tab.is-visible:active { cursor: grabbing; }
  /* Grow leftward via padding — no gap, background stays the same dark colour */
  #tack-panel-tab.is-visible:hover {
    padding-left: 12px;
    transition: padding-left 0.15s ease;
  }

  .panel-body {
    flex: 1;
    overflow-y: auto;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .comment-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(160,130,255,0.15);
    border-radius: 12px;
    padding: 12px;
    cursor: pointer;
    transition: border-color 0.15s;
  }
  .comment-card:hover { border-color: rgba(160,130,255,0.4); }
  .comment-card.is-focused { border-color: #7c5cbf; background: rgba(124,92,191,0.1); }

  .comment-num {
    font-size: 11px;
    font-weight: 800;
    color: #7c5cbf;
    margin-bottom: 4px;
  }
  .comment-text {
    font-size: 12px;
    color: #d1c4f9;
    line-height: 1.5;
    margin-bottom: 6px;
  }
  .comment-meta {
    font-size: 10px;
    color: #8878b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .status-badge {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 999px;
    margin-left: 6px;
  }
  .status-badge.open { background: rgba(251,191,36,0.15); color: #fbbf24; }
  .status-badge.resolved { background: rgba(52,211,153,0.15); color: #34d399; }
  .status-badge.orphaned { background: rgba(248,113,113,0.15); color: #f87171; }

  .orphan-section {
    margin-top: 8px;
    border-top: 1px dashed rgba(248,113,113,0.3);
    padding-top: 8px;
  }
  .orphan-label {
    font-size: 10px;
    font-weight: 700;
    color: #f87171;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 6px;
  }

  .filter-bar {
    padding: 8px 12px;
    border-bottom: 1px solid rgba(160,130,255,0.1);
    display: flex;
    gap: 6px;
  }
  .filter-chip {
    all: unset;
    cursor: pointer;
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 999px;
    border: 1px solid rgba(160,130,255,0.2);
    color: #8878b8;
    transition: all 0.12s;
  }
  .filter-chip.active { background: rgba(124,92,191,0.2); color: #c4b5fd; border-color: rgba(124,92,191,0.4); }

  .storage-banner {
    background: rgba(248,113,113,0.1);
    border-bottom: 1px solid rgba(248,113,113,0.3);
    padding: 8px 14px;
    font-size: 11px;
    color: #f87171;
    font-weight: 600;
    text-align: center;
  }

  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 9500;
  }
  .modal-backdrop.show { display: flex; }

  .modal {
    background: #1e1b3a;
    border: 1px solid rgba(160,130,255,0.25);
    border-radius: 16px;
    padding: 20px;
    width: min(420px, calc(100vw - 32px));
    display: flex;
    flex-direction: column;
    gap: 12px;
    box-shadow: 0 20px 48px rgba(0,0,0,0.5);
    font-family: system-ui, -apple-system, sans-serif;
  }
  .modal h3 { margin: 0; font-size: 15px; font-weight: 700; color: #e0d7ff; font-family: system-ui, -apple-system, sans-serif; }
  .modal label { font-size: 12px; font-weight: 600; color: #a89bcc; font-family: system-ui, -apple-system, sans-serif; }
  .modal-reviewer-line { font-size: 11px; color: #8878b8; }
  .modal-reviewer-line button { all: unset; cursor: pointer; color: #c4b5fd; font-size: 11px; margin-left: 4px; text-decoration: underline; }
  .modal input, .modal textarea {
    all: unset;
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(160,130,255,0.25);
    border-radius: 10px;
    padding: 10px 12px;
    font-size: 13px;
    color: #e0d7ff;
    font-family: system-ui, sans-serif;
    box-sizing: border-box;
  }
  .modal textarea { min-height: 80px; resize: vertical; }
  .modal input:focus, .modal textarea:focus {
    outline: 2px solid #7c5cbf;
  }
  .modal-actions { display: flex; gap: 8px; justify-content: flex-end; }

  /* ── Comment read popover ── */
  #tack-comment-popover {
    position: fixed;
    z-index: 9800;
    width: 280px;
    background: #1e1b3a;
    border: 1px solid rgba(160,130,255,0.25);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.55);
    font-family: system-ui, -apple-system, sans-serif;
    overflow: visible;
    opacity: 0;
    transform: scale(0.93) translateY(6px);
    transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.16,1,0.3,1);
    pointer-events: none;
  }
  #tack-comment-popover.is-open {
    opacity: 1;
    transform: scale(1) translateY(0);
    pointer-events: auto;
  }
  /* Arrow pointing toward the pin — up by default, down when popover is above pin */
  #tack-comment-popover::before,
  #tack-comment-popover::after {
    content: '';
    position: absolute;
    top: -9px;
    bottom: auto;
    left: var(--tack-arrow-x, 20px);
    transform: translateX(-50%);
    width: 0; height: 0;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    border-bottom: 9px solid rgba(160,130,255,0.3);
    border-top: none;
    pointer-events: none;
  }
  #tack-comment-popover::after {
    top: -7px;
    border-left-width: 7px;
    border-right-width: 7px;
    border-bottom-width: 7px;
    border-bottom-color: #1e1b3a;
  }
  /* Flipped: popover is above the pin, arrow points down */
  #tack-comment-popover.is-flipped::before {
    top: auto; bottom: -9px;
    border-bottom: none;
    border-top: 9px solid rgba(160,130,255,0.3);
  }
  #tack-comment-popover.is-flipped::after {
    top: auto; bottom: -7px;
    border-bottom: none;
    border-top: 7px solid #1e1b3a;
  }
  .cp-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 12px 10px;
    border-bottom: 1px solid rgba(160,130,255,0.12);
  }
  .cp-header-actions { display: flex; gap: 4px; align-items: center; }
  .cp-icon-btn {
    all: unset;
    cursor: pointer;
    width: 28px; height: 28px;
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    color: #8878b8;
    transition: background 0.12s, color 0.12s;
  }
  .cp-icon-btn:hover { background: rgba(160,130,255,0.12); color: #c4b5fd; }
  .cp-resolve:hover { color: #34d399; }
  .cp-close:hover { color: #f87171; }
  .cp-body { padding: 12px; display: flex; flex-direction: column; gap: 10px; }
  .cp-row { display: flex; gap: 10px; align-items: flex-start; }
  .cp-avatar {
    width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 800; color: #fff; letter-spacing: 0.02em;
  }
  .cp-meta { display: flex; flex-direction: column; gap: 1px; }
  .cp-name { font-size: 13px; font-weight: 700; color: #e0d7ff; }
  .cp-time { font-size: 11px; color: #8878b8; }
  .cp-text { font-size: 13px; color: #d1c4f9; line-height: 1.55; white-space: pre-wrap; word-break: break-word; }
  .cp-actions { display: flex; gap: 8px; align-items: center; }
  .cp-link {
    all: unset; cursor: pointer; font-size: 11px; color: #8878b8;
    text-decoration: underline; text-underline-offset: 2px;
    font-family: system-ui, -apple-system, sans-serif;
    transition: color 0.12s;
  }
  .cp-link:hover { color: #c4b5fd; }
  .cp-delete:hover { color: #f87171 !important; }
  .cp-sep { font-size: 11px; color: #4a4460; user-select: none; }

  /* ── Panel card enter / exit ── */
  @keyframes tack-card-enter {
    from { opacity: 0; transform: scale(0.96); max-height: 0;     margin-bottom: 0;  padding: 0 12px; }
    to   { opacity: 1; transform: scale(1);    max-height: 300px; margin-bottom: 8px; padding: 12px; }
  }
  @keyframes tack-card-exit {
    from { opacity: 1; transform: scale(1);    max-height: 300px; margin-bottom: 8px; padding: 12px; }
    to   { opacity: 0; transform: scale(0.96); max-height: 0;     margin-bottom: 0;  padding: 0; }
  }
  .comment-card.is-new {
    animation: tack-card-enter 0.28s ease-out both;
    overflow: hidden;
  }
  .comment-card.is-deleting {
    animation: tack-card-exit 0.22s ease-out forwards;
    overflow: hidden;
    pointer-events: none;
  }

  /* ── Panel card flash ── */
  @keyframes tack-card-flash {
    0%   { background: rgba(124, 92, 191, 0.32); border-color: rgba(124,92,191,0.6); }
    70%  { background: rgba(124, 92, 191, 0.10); border-color: rgba(124,92,191,0.3); }
    100% { background: rgba(255,255,255,0.04);   border-color: rgba(160,130,255,0.15); }
  }
  .comment-card.is-flash { animation: tack-card-flash 1.6s ease-out forwards; }
`;

export function initShadowHost(): void {
  const host = document.createElement('div');
  host.className = 'tack-shadow-host';
  host.setAttribute('data-tack-ui', '');
  // position + z-index creates a stacking context that renders above light-DOM marker badges
  host.style.position = 'relative';
  host.style.zIndex = '2147483000';
  document.body.appendChild(host);

  _shadowRoot = host.attachShadow({ mode: 'closed' });

  const style = document.createElement('style');
  style.textContent = CSS;
  _shadowRoot.appendChild(style);

  _toolbar = document.createElement('div');
  _toolbar.id = 'tack-toolbar';
  // Start off-screen; transition in after first paint
  _toolbar.style.transform = 'translateX(-50%) translateY(120%)';
  _toolbar.style.opacity = '0';
  _shadowRoot.appendChild(_toolbar);

  _panel = document.createElement('div');
  _panel.id = 'tack-panel';
  // Start off-screen; transition in slightly after toolbar
  _panel.style.transform = 'translateX(120%)';
  _panel.style.opacity = '0';
  _shadowRoot.appendChild(_panel);

  // Trigger entrance transitions
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (_toolbar) { _toolbar.style.transform = ''; _toolbar.style.opacity = ''; }
    setTimeout(() => { if (_panel && !_panel.classList.contains('is-collapsed')) { _panel.style.transform = ''; _panel.style.opacity = ''; } }, 60);
  }));

  _panelTab = document.createElement('button');
  _panelTab.id = 'tack-panel-tab';
  _panelTab.setAttribute('aria-label', 'Open comments panel');
  _panelTab.textContent = '‹ Comments';
  _panelTab.style.top = `${_tabTop}px`;

  // Drag to reposition vertically; click (no drag) to open panel
  _panelTab.addEventListener('pointerdown', (e: PointerEvent) => {
    const startY = e.clientY;
    const startTop = _tabTop;
    let dragging = false;
    (_panelTab as HTMLElement).setPointerCapture(e.pointerId);

    const onMove = (ev: PointerEvent) => {
      const dy = ev.clientY - startY;
      if (!dragging && Math.abs(dy) > 5) dragging = true;
      if (dragging) {
        _tabTop = Math.max(20, Math.min(startTop + dy, innerHeight - 80));
        (_panelTab as HTMLElement).style.top = `${_tabTop}px`;
      }
    };
    const onUp = () => {
      (_panelTab as HTMLElement).removeEventListener('pointermove', onMove);
      (_panelTab as HTMLElement).removeEventListener('pointerup', onUp);
      if (!dragging) setPanelCollapsed(false);
    };
    (_panelTab as HTMLElement).addEventListener('pointermove', onMove);
    (_panelTab as HTMLElement).addEventListener('pointerup', onUp);
  });

  _shadowRoot.appendChild(_panelTab);
}

export function getPanelCollapsed(): boolean {
  return !!_panel?.classList.contains('is-collapsed');
}

export function setPanelCollapsed(collapsed: boolean): void {
  if (!_panel || !_panelTab) return;
  _panel.classList.toggle('is-collapsed', collapsed);
  _panelTab.classList.toggle('is-visible', collapsed);
  if (!collapsed) {
    // Clear any lingering inline transform/opacity so the CSS transition can drive the slide-in
    _panel.style.removeProperty('transform');
    _panel.style.removeProperty('opacity');
  }
}

export function getShadowRoot(): ShadowRoot {
  if (!_shadowRoot) throw new Error('Shadow host not initialized');
  return _shadowRoot;
}

export function getPanel(): HTMLElement {
  if (!_panel) throw new Error('Panel not initialized');
  return _panel;
}

export function getToolbar(): HTMLElement {
  if (!_toolbar) throw new Error('Toolbar not initialized');
  return _toolbar;
}
