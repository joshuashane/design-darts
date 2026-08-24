import { config } from './config.js';
import type { StoragePayload, Comment } from './schema.js';

export function downloadJSON(payload: StoragePayload): void {
  const reviewer = payload.reviewer?.name ?? 'reviewer';
  const date = new Date().toISOString().slice(0, 10);
  const filename = `design-darts-${config.prototypeName.replace(/[^a-z0-9]/gi, '-')}-${reviewer.replace(/\s+/g, '-')}-${date}.json`;
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function postToSink(payload: StoragePayload): Promise<'sent' | 'failed'> {
  const url = config.sinkUrl;
  if (!url) return 'failed';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok ? 'sent' : 'failed';
  } catch {
    return 'failed';
  }
}

function formatMarkdown(payload: StoragePayload): string {
  const lines: string[] = [
    `# Feedback: ${payload.prototypeName}`,
    `Built: ${payload.builtAt ? new Date(payload.builtAt).toISOString() : 'unknown'}`,
    '',
  ];

  const byRoute = new Map<string, Comment[]>();
  for (const c of payload.comments) {
    const key = c.anchorData.pathname + (c.anchorData.screenState ? `#${c.anchorData.screenState}` : '');
    if (!byRoute.has(key)) byRoute.set(key, []);
    byRoute.get(key)!.push(c);
  }

  let n = 1;
  for (const [route, comments] of byRoute) {
    lines.push(`## Route: ${route}`, '');
    for (const c of comments) {
      lines.push(
        `### Comment ${n++} — ${c.status === 'resolved' ? '✅ resolved' : '🔴 open'}`,
        `**Reviewer:** ${c.reviewer.name}${c.reviewer.email ? ` (${c.reviewer.email})` : ''}`,
        `**Element:** \`${c.anchorData.cssSelector}\``,
        `**Viewport:** ${c.anchorData.viewport.width}×${c.anchorData.viewport.height} @${c.anchorData.viewport.dpr}x`,
        `**Anchor status:** ${c.anchorStatus}`,
        '',
        c.text,
        '',
      );
    }
  }
  return lines.join('\n');
}


export async function sendFeedback(payload: StoragePayload, showStatus: (msg: string) => void): Promise<void> {
  downloadJSON(payload);
  showStatus('Feedback saved to Downloads ↓');

  if (config.sinkUrl) {
    const result = await postToSink(payload);
    if (result === 'failed') {
      showStatus('POST failed — check your connection.');
    }
  }
}
