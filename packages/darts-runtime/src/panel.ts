import { getPanel, setPanelCollapsed } from './shadow-host.js';
import type { Comment } from './schema.js';

export function showStorageBanner(): void {
  const panel = getPanel();
  const existing = panel.querySelector('.storage-banner');
  if (existing) return;
  const banner = document.createElement('div');
  banner.className = 'storage-banner';
  banner.textContent = "Your comments won't survive a refresh. Send them before you close this tab.";
  panel.prepend(banner);
}

// Screen key = hash fragment, or full pathname if no hash (comments made before any navigation)
function screenKey(c: Comment): string {
  if (!c.anchorData.pathname) return '';
  return c.anchorData.pathname.match(/#.*$/)?.[0] ?? c.anchorData.pathname;
}

// Subtle per-screen tints applied when comments span multiple screens.
// Index 0 = first screen seen; colors cycle if there are more than 5 screens.
const SCREEN_PALETTES = [
  { bg: 'rgba(255,255,255,0.04)', accent: 'rgba(124,92,191,0.55)'  },  // purple (default)
  { bg: 'rgba(59,130,246,0.07)',  accent: 'rgba(99,130,246,0.60)'  },  // blue
  { bg: 'rgba(20,184,166,0.07)',  accent: 'rgba(20,184,166,0.60)'  },  // teal
  { bg: 'rgba(234,179,8,0.06)',   accent: 'rgba(234,179,8,0.55)'   },  // amber
  { bg: 'rgba(249,115,22,0.06)',  accent: 'rgba(249,115,22,0.50)'  },  // orange
];

export function renderPanel(
  comments: Comment[],
  onFocus: (id: string) => void,
  onToggleStatus: (id: string) => void,
  currentFilter: 'all' | 'open' | 'resolved',
  onEdit?: (id: string) => void,
  onDelete?: (id: string) => void,
  newCommentId?: string
): void {
  const panel = getPanel();
  const storageBanner = panel.querySelector('.storage-banner');

  panel.innerHTML = '';
  if (storageBanner) panel.appendChild(storageBanner);

  // Header
  const header = document.createElement('div');
  header.className = 'panel-header';
  const collapseBtn = document.createElement('button');
  collapseBtn.className = 'panel-collapse-btn';
  collapseBtn.setAttribute('aria-label', 'Close panel');
  collapseBtn.setAttribute('title', 'Close panel');
  collapseBtn.innerHTML = '›';
  collapseBtn.addEventListener('click', () => setPanelCollapsed(true));
  header.innerHTML = `<span>Comments (${comments.filter(c => c.anchorStatus !== 'orphaned').length})</span>`;
  header.appendChild(collapseBtn);
  panel.appendChild(header);

  // Filter bar
  const filterBar = document.createElement('div');
  filterBar.className = 'filter-bar';
  (['all', 'open', 'resolved'] as const).forEach(f => {
    const chip = document.createElement('button');
    chip.className = `filter-chip${currentFilter === f ? ' active' : ''}`;
    chip.textContent = f.charAt(0).toUpperCase() + f.slice(1);
    chip.addEventListener('click', () => {
      renderPanel(comments, onFocus, onToggleStatus, f);
    });
    filterBar.appendChild(chip);
  });
  panel.appendChild(filterBar);

  // Chronological ranks: oldest comment = #1, newest = #N
  const byAge = [...comments].sort((a, b) => a.createdAt - b.createdAt);
  const rankMap = new Map<string, number>(byAge.map((c, i) => [c.id, i + 1]));

  // Screen color index — assigned in first-seen order; only applied when > 1 screen present
  const screenIndex = new Map<string, number>();
  comments.forEach(c => {
    const key = screenKey(c);
    if (!screenIndex.has(key)) screenIndex.set(key, screenIndex.size);
  });
  const multiScreen = screenIndex.size > 1;

  const colorFor = (c: Comment): number =>
    multiScreen ? (screenIndex.get(screenKey(c)) ?? 0) % SCREEN_PALETTES.length : -1;

  // Comment list — newest first
  const body = document.createElement('div');
  body.className = 'panel-body';

  const sorted = [...comments].sort((a, b) => b.createdAt - a.createdAt);
  const visible = sorted.filter(c => c.anchorStatus !== 'orphaned' && (currentFilter === 'all' || c.status === currentFilter));
  const orphans = sorted.filter(c => c.anchorStatus === 'orphaned');

  visible.forEach(c => {
    const card = makeCard(c, rankMap.get(c.id) ?? 1, colorFor(c), onFocus, onToggleStatus, onEdit, onDelete);
    if (c.id === newCommentId) card.classList.add('is-new');
    body.appendChild(card);
  });

  if (orphans.length) {
    const section = document.createElement('div');
    section.className = 'orphan-section';
    const label = document.createElement('div');
    label.className = 'orphan-label';
    label.textContent = `Orphaned comments (${orphans.length})`;
    section.appendChild(label);
    orphans.forEach(c => section.appendChild(
      makeCard(c, rankMap.get(c.id) ?? 1, colorFor(c), onFocus, onToggleStatus, onEdit, onDelete)
    ));
    body.appendChild(section);
  }

  if (!visible.length && !orphans.length) {
    const empty = document.createElement('div');
    empty.style.cssText = 'color: #8878b8; font-size: 12px; padding: 20px; text-align: center;';
    empty.textContent = 'No comments yet. Click "Comment" and then click any element.';
    body.appendChild(empty);
  }

  panel.appendChild(body);
}

const LINK_CSS = 'all: unset; cursor: pointer; font-size: 10px; color: #8878b8; text-decoration: underline; text-underline-offset: 2px;';

function makeCard(
  c: Comment,
  rank: number,
  colorIdx: number,
  onFocus: (id: string) => void,
  onToggleStatus: (id: string) => void,
  onEdit?: (id: string) => void,
  onDelete?: (id: string) => void
): HTMLElement {
  const card = document.createElement('div');
  card.className = 'comment-card';
  card.dataset.commentId = c.id;

  if (colorIdx >= 0) {
    const p = SCREEN_PALETTES[colorIdx];
    card.style.background = p.bg;
    card.style.borderLeft = `3px solid ${p.accent}`;
  }

  const num = document.createElement('div');
  num.className = 'comment-num';
  num.innerHTML = `#${rank} <span class="status-badge ${c.anchorStatus === 'orphaned' ? 'orphaned' : c.status}">${c.anchorStatus === 'orphaned' ? 'orphaned' : c.status}</span>`;

  const text = document.createElement('div');
  text.className = 'comment-text';
  text.textContent = c.text;

  const meta = document.createElement('div');
  meta.className = 'comment-meta';
  const d = new Date(c.createdAt);
  const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const timeStr = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  meta.textContent = `${c.reviewer.name} · ${dateStr} ${timeStr}`;

  const actions = document.createElement('div');
  actions.style.cssText = 'display: flex; gap: 10px; margin-top: 6px; align-items: center;';

  if (c.anchorStatus !== 'orphaned') {
    const toggleBtn = document.createElement('button');
    toggleBtn.style.cssText = LINK_CSS;
    toggleBtn.textContent = c.status === 'open' ? 'Mark resolved' : 'Reopen';
    toggleBtn.addEventListener('click', e => { e.stopPropagation(); onToggleStatus(c.id); });
    actions.appendChild(toggleBtn);
  }

  if (onEdit) {
    const sep1 = document.createElement('span');
    sep1.style.cssText = 'color: #4a4460; font-size: 10px; user-select: none;';
    sep1.textContent = '·';
    const editBtn = document.createElement('button');
    editBtn.style.cssText = LINK_CSS;
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', e => { e.stopPropagation(); onEdit(c.id); });
    actions.appendChild(sep1);
    actions.appendChild(editBtn);
  }

  if (onDelete) {
    const sep2 = document.createElement('span');
    sep2.style.cssText = 'color: #4a4460; font-size: 10px; user-select: none;';
    sep2.textContent = '·';
    const deleteBtn = document.createElement('button');
    deleteBtn.style.cssText = LINK_CSS + ' color: #f87171;';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', e => { e.stopPropagation(); onDelete(c.id); });
    actions.appendChild(sep2);
    actions.appendChild(deleteBtn);
  }

  card.appendChild(num);
  card.appendChild(text);
  card.appendChild(meta);
  card.appendChild(actions);
  card.addEventListener('click', () => onFocus(c.id));
  return card;
}

export function focusPanelItem(id: string): void {
  const panel = getPanel();
  panel.querySelectorAll('.comment-card').forEach(el => el.classList.remove('is-focused'));
  const target = panel.querySelector(`[data-comment-id="${id}"]`);
  if (target) {
    target.classList.add('is-focused');
    target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

export function flashPanelItem(id: string): void {
  const panel = getPanel();
  const target = panel.querySelector(`[data-comment-id="${id}"]`) as HTMLElement | null;
  if (!target) return;
  target.classList.remove('is-flash');
  void target.offsetWidth;
  target.classList.add('is-flash');
  target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  setTimeout(() => target.classList.remove('is-flash'), 1700);
}
