import { build } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { injectRuntime } from './inject.js';
import { generatePrototypeId } from './id.js';
import * as path from 'path';
import * as fs from 'fs';
export async function buildVite(opts) {
    const prototypeId = generatePrototypeId();
    const tempOut = path.join(opts.input, '.tack-build');
    console.log('Running Vite production build with singlefile…');
    await build({
        root: opts.input,
        base: './',
        plugins: [viteSingleFile()],
        build: {
            outDir: tempOut,
            emptyOutDir: true,
            assetsInlineLimit: Infinity, // inline everything as data URIs
            rollupOptions: {
                output: {
                    manualChunks: undefined, // single bundle
                },
            },
        },
        logLevel: 'warn',
    });
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
