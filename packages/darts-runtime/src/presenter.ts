export function isPresenterMode(): boolean {
  return new URLSearchParams(location.search).get('comments') === 'off';
}

export function applyPresenterMode(hidden: boolean): void {
  const host = document.querySelector('.tack-shadow-host') as HTMLElement | null;
  if (host) host.style.display = hidden ? 'none' : '';
  // Hide all light-DOM tack elements
  document.querySelectorAll('[data-tack-ui]').forEach((el: Element) => {
    (el as HTMLElement).style.display = hidden ? 'none' : '';
  });
}
