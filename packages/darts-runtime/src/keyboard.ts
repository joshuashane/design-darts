export function bindKeyboard(onArm: () => void, onDisarm: () => void, onPresenter: () => void): void {
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    // composedPath() pierces shadow DOM; e.target stops at the shadow host
    const innerTarget = e.composedPath()[0] as HTMLElement;
    const tag = innerTarget?.tagName ?? (e.target as HTMLElement).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if ((innerTarget as HTMLElement)?.isContentEditable) return;
    if (e.shiftKey && (e.key === 'C' || e.key === 'c')) { e.preventDefault(); onPresenter(); return; }
    if (e.key === 'c' || e.key === 'C') { e.preventDefault(); onArm(); }
    if (e.key === 'Escape') onDisarm();
  });
}
