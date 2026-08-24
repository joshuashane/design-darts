export function bindKeyboard(onArm: () => void, onDisarm: () => void, onPresenter: () => void): void {
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    // Don't fire when typing in inputs
    const tag = (e.target as HTMLElement).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.shiftKey && (e.key === 'C' || e.key === 'c')) { e.preventDefault(); onPresenter(); return; }
    if (e.key === 'c' || e.key === 'C') { e.preventDefault(); onArm(); }
    if (e.key === 'Escape') onDisarm();
  });
}
