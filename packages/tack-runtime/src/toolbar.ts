import { getToolbar } from './shadow-host.js';
import { arm, disarm, isArmed } from './mode.js';
import { icons } from './icons.js';

type SendHandler = () => void;
type PresenterHandler = () => void;
type ImportHandler = (file: File) => void;

let _onSend: SendHandler | null = null;
let _onPresenter: PresenterHandler | null = null;
let _onImport: ImportHandler | null = null;
let _rendered = false;

export function onSend(cb: SendHandler): void { _onSend = cb; }
export function onPresenter(cb: PresenterHandler): void { _onPresenter = cb; }
export function onImport(cb: ImportHandler): void { _onImport = cb; }

export function renderToolbar(_commentCount: number): void {
  const toolbar = getToolbar();
  const armed = isArmed();

  if (!_rendered) {
    // Hidden file input for import
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json,application/json';
    fileInput.style.display = 'none';
    fileInput.setAttribute('data-tack-ui', '');
    fileInput.addEventListener('change', () => {
      if (fileInput.files?.[0]) {
        _onImport?.(fileInput.files[0]);
        fileInput.value = ''; // reset so same file can be re-imported
      }
    });
    document.body.appendChild(fileInput);

    toolbar.innerHTML = `
      <button class="btn-arm${armed ? ' is-armed' : ''}" id="tack-arm-btn" aria-label="${armed ? 'Disarm comment mode' : 'Add comment'}" title="Add a comment (C)">
        ${icons.pin} ${armed ? 'Cancel' : 'Comment'}
      </button>
      <button class="btn-ghost tack-toolbar-icon" id="tack-import-btn" aria-label="Import feedback" title="Import feedback JSON">
        ${icons.upload}
      </button>
      <button class="btn-ghost tack-has-tip" id="tack-send-btn" aria-label="Export feedback" title="Export feedback — saves JSON to Downloads">
        ${icons.send} Export feedback
      </button>
      <button class="btn-ghost tack-toolbar-icon" id="tack-presenter-btn" aria-label="Hide/show overlay" title="Hide/show overlay (Shift+C)">
        ${icons.eye}
      </button>
    `;

    toolbar.querySelector('#tack-arm-btn')!.addEventListener('click', () => isArmed() ? disarm() : arm());
    toolbar.querySelector('#tack-import-btn')!.addEventListener('click', () => fileInput.click());
    toolbar.querySelector('#tack-send-btn')!.addEventListener('click', () => _onSend?.());
    toolbar.querySelector('#tack-presenter-btn')!.addEventListener('click', () => _onPresenter?.());
    _rendered = true;
  }

  const armBtn = toolbar.querySelector('#tack-arm-btn') as HTMLButtonElement;
  armBtn.classList.toggle('is-armed', armed);
  armBtn.setAttribute('aria-label', armed ? 'Disarm comment mode' : 'Add comment');
  armBtn.innerHTML = `${icons.pin} ${armed ? 'Cancel' : 'Comment'}`;
}
