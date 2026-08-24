import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function getRuntimeCode() {
    const candidates = [
        path.resolve(__dirname, '../../tack-runtime/dist/tack.iife.js'),
        path.resolve(__dirname, '../../../packages/tack-runtime/dist/tack.iife.js'),
    ];
    for (const p of candidates) {
        if (fs.existsSync(p))
            return fs.readFileSync(p, 'utf-8');
    }
    throw new Error('tack-runtime/dist/tack.iife.js not found. Run `node packages/tack-runtime/build.js` first.');
}
export function injectRuntime(html, opts) {
    const runtimeCode = getRuntimeCode();
    const config = JSON.stringify({
        prototypeId: opts.prototypeId,
        prototypeName: opts.prototypeName,
        builtAt: opts.builtAt,
        ...(opts.sinkUrl ? { sinkUrl: opts.sinkUrl } : {}),
    });
    const injection = `
<script>window.__TACK_CONFIG__ = ${config};</script>
<script>${runtimeCode}</script>
`;
    // Inject just before </body>; fall back to appending if </body> not found
    if (html.includes('</body>')) {
        return html.replace('</body>', `${injection}</body>`);
    }
    return html + injection;
}
