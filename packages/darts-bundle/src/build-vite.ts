import { build } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { injectRuntime } from './inject.js';
import { generatePrototypeId } from './id.js';
import * as path from 'path';
import * as fs from 'fs';

export interface BuildViteOptions {
  name: string;
  input: string;
  output: string;
  sink?: string;
}

export async function buildVite(opts: BuildViteOptions): Promise<void> {
  const prototypeId = generatePrototypeId();
  const tempOut = path.join(opts.input, '.tack-build');

  // Warn if the app uses BrowserRouter — it produces a blank page from file://
  const mainFiles = ['src/main.tsx', 'src/main.ts', 'src/index.tsx', 'src/index.ts'];
  for (const f of mainFiles) {
    const p = path.join(opts.input, f);
    if (fs.existsSync(p)) {
      const src = fs.readFileSync(p, 'utf-8');
      if (src.includes('BrowserRouter') && !src.includes('HashRouter')) {
        console.warn(
          '\n⚠️  BrowserRouter detected. Apps using BrowserRouter produce a blank page when opened from file://\n' +
          '   because the URL path is a filesystem path and no routes match.\n' +
          '   Fix: replace BrowserRouter with HashRouter in your app entry point.\n'
        );
      }
      break;
    }
  }

  console.log('Running Vite production build with singlefile…');

  // Change to the prototype directory before building so PostCSS plugins
  // (e.g. Tailwind) resolve content globs from the right location.
  const prevCwd = process.cwd();
  process.chdir(opts.input);

  try {
    await build({
      root: opts.input,
      base: './',
      plugins: [viteSingleFile()],
      build: {
        outDir: tempOut,
        emptyOutDir: true,
        assetsInlineLimit: Infinity,
        rollupOptions: {
          output: {
            manualChunks: undefined,
          },
        },
      },
      logLevel: 'warn',
    });
  } finally {
    process.chdir(prevCwd);
  }

  const indexPath = path.join(tempOut, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error(`Vite build did not produce index.html in ${tempOut}`);
  }

  let html = fs.readFileSync(indexPath, 'utf-8');
  html = injectRuntime(html, {
    prototypeId,
    prototypeName: opts.name,
    builtAt: Date.now(),
    sinkUrl: opts.sink,
  });

  fs.mkdirSync(path.dirname(opts.output), { recursive: true });
  fs.writeFileSync(opts.output, html, 'utf-8');

  // Cleanup temp build dir
  fs.rmSync(tempOut, { recursive: true, force: true });
  console.log(`Bundled Vite prototype → ${opts.output}`);
}
