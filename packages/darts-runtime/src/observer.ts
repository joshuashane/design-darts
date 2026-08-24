import { resolveElement } from './anchor.js';
import type { Comment } from './schema.js';
import { debounce } from './utils.js';

let _mutation: MutationObserver | null = null;
let _layout: MutationObserver | null = null;
let _getOrphans: (() => Comment[]) | null = null;
let _onReanchor: ((id: string, el: Element) => void) | null = null;
let _onLayout: (() => void) | null = null;

const tryReanchor = debounce(() => {
  if (!_getOrphans || !_onReanchor) return;
  for (const c of _getOrphans()) {
    const el = resolveElement(c.anchorData);
    if (el) _onReanchor(c.id, el);
  }
}, 300);

const refreshLayout = debounce(() => { _onLayout?.(); }, 120);

export function startObservers(
  getOrphans: () => Comment[],
  onReanchor: (id: string, el: Element) => void,
  onLayout: () => void,
): void {
  _getOrphans = getOrphans;
  _onReanchor = onReanchor;
  _onLayout = onLayout;

  _mutation = new MutationObserver(() => tryReanchor());
  _mutation.observe(document.body, { childList: true, subtree: true });

  _layout = new MutationObserver(mutations => {
    const relevant = mutations.some(m => {
      const t = m.target as Element;
      return !t.closest?.('[data-tack-ui]');
    });
    if (relevant) refreshLayout();
  });
  _layout.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class', 'hidden', 'open', 'aria-hidden'],
  });
}

export function stopObservers(): void {
  _mutation?.disconnect();
  _layout?.disconnect();
  _mutation = null;
  _layout = null;
}
