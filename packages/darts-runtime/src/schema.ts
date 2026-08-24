export interface Reviewer {
  name: string;
  email?: string;
}

export interface AnchorData {
  /** Preferred: data-testid, id, or stable class-based CSS selector */
  cssSelector: string;
  /** Fallback 1 */
  xpath: string;
  /** Fallback 2: first ~80 chars of element's text content */
  textSnippet: string;
  /** Page pathname + search + hash at time of comment */
  pathname: string;
  /** Optional SPA screen state set via window.Tack.setScreenState() */
  screenState?: string;
  /** Viewport at time of comment */
  viewport: { width: number; height: number; dpr: number };
  /** Source file + line stamped by tackVitePlugin, e.g. "src/Foo.tsx:42" */
  sourceLocation?: string;
  /** Click position as fraction of element bbox so pin survives responsive reflow */
  clickPctX?: number;
  clickPctY?: number;
}

export type CommentStatus = 'open' | 'resolved';
export type AnchorStatus = 'resolved' | 'orphaned';

export interface Comment {
  id: string;
  reviewer: Reviewer;
  text: string;
  anchorData: AnchorData;
  anchorStatus: AnchorStatus;
  status: CommentStatus;
  createdAt: number;
}

export interface StoragePayload {
  schemaVersion: 1;
  prototypeId: string;
  prototypeName: string;
  builtAt: number;
  reviewer: Reviewer | null;
  comments: Comment[];
}
