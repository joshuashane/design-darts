import * as fs from 'fs';
import * as path from 'path';
import { contentHash } from './hash.js';

export interface NormalizedComment {
  id: string;
  text: string;
  reviewer: { name: string; email?: string };
  cssSelector: string;
  xpath: string;
  textSnippet: string;
  pathname: string;
  screenState?: string;
  viewport: { width: number; height: number; dpr: number };
  status: 'open' | 'resolved';
  anchorStatus: 'resolved' | 'orphaned';
  createdAt: number;
  prototypeId: string;
  prototypeName: string;
  sourceLocation?: string;
  dedupKey: string;
}

function makeDedupKey(cssSelector: string, reviewerName: string, text: string): string {
  return `${cssSelector}::${reviewerName}::${contentHash(text)}`;
}

function isStoragePayload(obj: unknown): obj is {
  schemaVersion: number;
  prototypeId?: string;
  prototypeName?: string;
  comments?: unknown[];
} {
  return typeof obj === 'object' && obj !== null && 'schemaVersion' in obj;
}

function normalizeComment(
  raw: Record<string, unknown>,
  prototypeId: string,
  prototypeName: string
): NormalizedComment | null {
  const id = typeof raw['id'] === 'string' ? raw['id'] : null;
  const text = typeof raw['text'] === 'string' ? raw['text'] : '';
  if (!id || !text) return null;

  const reviewer = raw['reviewer'] && typeof raw['reviewer'] === 'object'
    ? raw['reviewer'] as { name: string; email?: string }
    : { name: 'Unknown' };

  const anchorData = raw['anchorData'] && typeof raw['anchorData'] === 'object'
    ? raw['anchorData'] as Record<string, unknown>
    : {};

  const cssSelector = typeof anchorData['cssSelector'] === 'string' ? anchorData['cssSelector'] : '';
  const xpath = typeof anchorData['xpath'] === 'string' ? anchorData['xpath'] : '';
  const textSnippet = typeof anchorData['textSnippet'] === 'string' ? anchorData['textSnippet'] : '';
  const pathname = typeof anchorData['pathname'] === 'string' ? anchorData['pathname'] : '/';
  const screenState = typeof anchorData['screenState'] === 'string' ? anchorData['screenState'] : undefined;
  const viewport = anchorData['viewport'] && typeof anchorData['viewport'] === 'object'
    ? anchorData['viewport'] as { width: number; height: number; dpr: number }
    : { width: 0, height: 0, dpr: 1 };
  const sourceLocation = typeof anchorData['sourceLocation'] === 'string' ? anchorData['sourceLocation'] : undefined;

  return {
    id,
    text,
    reviewer,
    cssSelector,
    xpath,
    textSnippet,
    pathname,
    screenState,
    viewport,
    status: raw['status'] === 'resolved' ? 'resolved' : 'open',
    anchorStatus: raw['anchorStatus'] === 'orphaned' ? 'orphaned' : 'resolved',
    createdAt: typeof raw['createdAt'] === 'number' ? raw['createdAt'] : 0,
    prototypeId,
    prototypeName,
    sourceLocation,
    dedupKey: makeDedupKey(cssSelector, reviewer.name, text),
  };
}

export function mergeFiles(dir: string): NormalizedComment[] {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  const seen = new Set<string>();
  const result: NormalizedComment[] = [];

  for (const file of files) {
    let payload: unknown;
    try {
      payload = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
    } catch {
      console.error(`Skipping invalid JSON: ${file}`);
      continue;
    }

    if (!isStoragePayload(payload)) {
      console.error(`Skipping non-tack JSON: ${file}`);
      continue;
    }

    const prototypeId = payload.prototypeId ?? 'unknown';
    const prototypeName = payload.prototypeName ?? 'Unknown Prototype';
    const comments = Array.isArray(payload.comments) ? payload.comments : [];

    for (const raw of comments) {
      if (!raw || typeof raw !== 'object') continue;
      const normalized = normalizeComment(raw as Record<string, unknown>, prototypeId, prototypeName);
      if (!normalized) continue;
      if (seen.has(normalized.dedupKey)) continue;
      seen.add(normalized.dedupKey);
      result.push(normalized);
    }
  }

  return result;
}
