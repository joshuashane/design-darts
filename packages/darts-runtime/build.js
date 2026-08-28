const esbuild = require('esbuild');
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const BUDGET_BYTES = 40 * 1024;

async function build() {
  const result = await esbuild.build({
    entryPoints: ['src/index.ts'],
    outfile: 'dist/darts.iife.js',
    bundle: true,
    minify: true,
    format: 'iife',
    globalName: '__tack_iife__',
    target: ['es2017'],
    sourcemap: 'external',
    logLevel: 'info',
    banner: { js: '/* Design Darts — Joshua Stone | https://github.com/joshuashane/design-darts */' },
  });

  const raw = fs.readFileSync('dist/darts.iife.js');
  const gz = zlib.gzipSync(raw);
  const kb = (gz.length / 1024).toFixed(1);
  console.log(`Bundle: ${(raw.length / 1024).toFixed(1)} KB raw, ${kb} KB gzipped`);

  if (gz.length > BUDGET_BYTES) {
    console.error(`BUDGET EXCEEDED: ${kb} KB > 40 KB gzipped. Stop and discuss with owner.`);
    process.exit(1);
  }
}

build().catch(err => { console.error(err); process.exit(1); });
