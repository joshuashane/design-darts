interface TackConfig {
  prototypeId: string;
  prototypeName: string;
  builtAt: number;
  sinkUrl?: string;
}

declare global {
  interface Window {
    __TACK_CONFIG__?: Partial<TackConfig>;
  }
}

const cfg = window.__TACK_CONFIG__ ?? {};

export const config: TackConfig = {
  prototypeId: cfg.prototypeId ?? 'dev-' + location.hostname,
  prototypeName: cfg.prototypeName ?? (document.title || 'Prototype'),
  builtAt: cfg.builtAt ?? 0,
  sinkUrl: cfg.sinkUrl,
};
