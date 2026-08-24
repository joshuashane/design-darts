import { config } from './config.js';
import type { StoragePayload, Comment } from './schema.js';

const STORAGE_KEY = `dd:${config.prototypeId}`;
let _mode: 'local' | 'memory' = 'local';
let _memoryPayload: StoragePayload | null = null;
const _unavailableCallbacks: Array<() => void> = [];

function emptyPayload(): StoragePayload {
  return {
    schemaVersion: 1,
    prototypeId: config.prototypeId,
    prototypeName: config.prototypeName,
    builtAt: config.builtAt,
    reviewer: null,
    comments: [],
  };
}

function detectStorage(): 'local' | 'memory' {
  try {
    const probe = '__tack_probe__';
    localStorage.setItem(probe, '1');
    localStorage.removeItem(probe);
    return 'local';
  } catch {
    return 'memory';
  }
}

function migratePayload(raw: unknown): StoragePayload {
  if (!raw || typeof raw !== 'object') return emptyPayload();
  const r = raw as Record<string, unknown>;
  // v1 is the only schema; future versions add migration steps here
  if (r['schemaVersion'] === 1) return raw as unknown as StoragePayload;
  // Unrecognized schema — return empty rather than corrupt data
  return emptyPayload();
}

export function storageMode(): 'local' | 'memory' { return _mode; }

export function onStorageUnavailable(cb: () => void): void {
  _unavailableCallbacks.push(cb);
}

export function loadPayload(): StoragePayload {
  _mode = detectStorage();
  if (_mode === 'memory') {
    _unavailableCallbacks.forEach(cb => cb());
    if (_memoryPayload) return _memoryPayload;
    _memoryPayload = emptyPayload();
    return _memoryPayload;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyPayload();
    return migratePayload(JSON.parse(raw));
  } catch {
    return emptyPayload();
  }
}

export function savePayload(payload: StoragePayload): void {
  if (_mode === 'memory') {
    _memoryPayload = payload;
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    // Quota exceeded — switch to memory and fire banner
    _mode = 'memory';
    _memoryPayload = payload;
    _unavailableCallbacks.forEach(cb => cb());
  }
}

// Used by future import UI
export function mergeComments(payload: StoragePayload, incoming: Comment[]): StoragePayload {
  const existingIds = new Set(payload.comments.map(c => c.id));
  const fresh = incoming.filter(c => !existingIds.has(c.id));
  return { ...payload, comments: [...payload.comments, ...fresh] };
}
