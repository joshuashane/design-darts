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

  // Comment list
  const body = document.createElement('div');
  body.className = 'panel-body';

  // Newest first
  const sorted = [...comments].sort((a, b) => b.createdAt - a.createdAt);
  const visible = sorted.filter(c => c.anchorStatus !== 'orphaned' && (currentFilter === 'all' || c.status === currentFilter));
  const orphans = sorted.filter(c => c.anchorStatus === 'orphaned');

  visible.forEach((c, i) => {
    const card = makeCard(c, i, onFocus, onToggleStatus, onEdit, onDelete);
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
    orphans.forEach((c, i) => section.appendChild(makeCard(c, i, onFocus, onToggleStatus, onEdit, onDelete)));
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
  i: number,
  onFocus: (id: string) => void,
  onToggleStatus: (id: string) => void,
  onEdit?: (id: string) => void,
  onDelete?: (id: string) => void
): HTMLElement {
  const card = document.createElement('div');
  card.className = 'comment-card';
  card.dataset.commentId = c.id;

  const num = document.createElement('div');
  num.className = 'comment-num';
  num.innerHTML = `#${i + 1} <span class="status-badge ${c.anchorStatus === 'orphaned' ? 'orphaned' : c.status}">${c.anchorStatus === 'orphaned' ? 'orphaned' : c.status}</span>`;

  const text = document.createElement('div');
  text.className = 'comment-text';
  text.textContent = c.text;

  const meta = document.createElement('div');
  meta.className = 'comment-meta';
  const d = new Date(c.createdAt);
  const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const timeStr = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  meta.textContent = `${c.reviewer.name} · ${dateStr} ${timeStr}`;

  // Action row: Mark resolved / Reopen · Edit · Delete
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
  // Remove and re-add to restart the animation
  target.classList.remove('is-flash');
  void target.offsetWidth; // force reflow
  target.classList.add('is-flash');
  target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  setTimeout(() => target.classList.remove('is-flash'), 1700);
}
