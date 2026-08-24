import type { AnchorData } from './schema';
import { truncateText } from './utils';

// Stable class names: skip utility/state/animation classes that change at runtime
const UNSTABLE_CLASS_RE = /^(is-|has-|js-|active|open|closed|selected|focused|hover|hidden|visible|animate|motion|transition)/;

function escapeCss(val: string): string {
  if (window.CSS?.escape) return window.CSS.escape(val);
  return val.replace(/[^a-zA-Z0-9_-]/g, '\\$&');
}

function stableClasses(el: Element): string[] {
  return Array.from(el.classList).filter(c => c && !UNSTABLE_CLASS_RE.test(c) && !c.startsWith('tack-'));
}

/**
 * Tier 1: data-testid → id → stable semantic classes → nth-child path.
 * Returns the most specific stable selector we can build.
 */
export function buildSelector(el: Element): string {
  // data-testid
  const testid = el.getAttribute('data-testid');
  if (testid) return `[data-testid="${escapeCss(testid)}"]`;

  // id
  if (el.id) return `#${escapeCss(el.id)}`;

  // Build a path upward, stopping when we hit something uniquely identifying
  const parts: string[] = [];
  let node: Element | null = el;
  let depth = 0;
  while (node && node !== document.body && depth < 5) {
    let part = node.tagName.toLowerCase();
    const classes = stableClasses(node);
    if (classes.length) part += `.${classes.slice(0, 2).map(escapeCss).join('.')}`;

    if (node.id) {
      parts.unshift(`#${escapeCss(node.id)}`);
      break;
    }
    const testid2 = node.getAttribute('data-testid');
    if (testid2) {
      parts.unshift(`[data-testid="${escapeCss(testid2)}"]`);
      break;
    }
    // Add nth-child only when the tag + classes combination is not unique among siblings
    const siblings = Array.from(node.parentElement?.children ?? []).filter(
      s => s.tagName === node!.tagName
    );
    if (siblings.length > 1) part += `:nth-child(${Array.from(node.parentElement!.children).indexOf(node) + 1})`;

    parts.unshift(part);
    node = node.parentElement;
    depth++;
  }
  return parts.join(' > ') || el.tagName.toLowerCase();
}

export function getXPath(node: Node): string {
  if (node === document.body) return '/html/body';
  const parts: string[] = [];
  let current: Node | null = node;
  while (current && current !== document) {
    let index = 1;
    let sibling = current.previousSibling;
    while (sibling) {
      if (sibling.nodeType === current.nodeType && sibling.nodeName === current.nodeName) index++;
      sibling = sibling.previousSibling;
    }
    const name = current.nodeType === Node.TEXT_NODE ? 'text()' : current.nodeName.toLowerCase();
    parts.unshift(`${name}[${index}]`);
    current = current.parentNode;
    if (!current || current.nodeType !== Node.ELEMENT_NODE) break;
  }
  return '/' + parts.join('/');
}

function findByXPath(xpath: string): Element | null {
  try {
    const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    const node = result.singleNodeValue;
    return node instanceof Element ? node : null;
  } catch {
    return null;
  }
}

export function buildAnchorData(el: Element, clientX?: number, clientY?: number): AnchorData {
  let clickPctX: number | undefined;
  let clickPctY: number | undefined;
  if (clientX !== undefined && clientY !== undefined) {
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      clickPctX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      clickPctY = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    }
  }
  return {
    cssSelector: buildSelector(el),
    xpath: getXPath(el),
    textSnippet: truncateText((el as HTMLElement).innerText?.trim() ?? el.textContent?.trim() ?? '', 80),
    pathname: location.pathname + location.search + location.hash,
    screenState: (window as { Tack?: { _screenState?: string } }).Tack?._screenState,
    viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio },
    sourceLocation: el.getAttribute('data-tack-src') ?? undefined,
    clickPctX,
    clickPctY,
  };
}

/**
 * Four-tier resolver. Returns null only when all four strategies fail.
 * Caller is responsible for moving the comment to the orphan tray on null.
 */
export function resolveElement(anchor: AnchorData): Element | null {
  // Tier 1: CSS selector
  try {
    const el = document.querySelector(anchor.cssSelector);
    if (el) return el;
  } catch { /* invalid selector — fall through */ }

  // Tier 2: XPath
  const byXPath = findByXPath(anchor.xpath);
  if (byXPath) return byXPath;

  // Tier 3: text snippet
  if (anchor.textSnippet.length >= 4) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let textNode: Node | null;
    while ((textNode = walker.nextNode())) {
      if ((textNode.nodeValue ?? '').includes(anchor.textSnippet)) {
        return textNode.parentElement;
      }
    }
  }

  // Tier 4: all strategies exhausted — caller sends to orphan tray
  return null;
}
