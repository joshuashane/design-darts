import { injectRuntime } from './inject.js';
import { generatePrototypeId } from './id.js';
import * as path from 'path';
import * as fs from 'fs';
function mimeForExt(ext) {
    const map = {
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.webp': 'image/webp',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '.ico': 'image/x-icon',
    };
    return map[ext] ?? 'application/octet-stream';
}
function toDataUri(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mime = mimeForExt(ext);
    const binary = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.woff', '.woff2', '.ttf', '.ico'];
    if (binary.includes(ext)) {
        const data = fs.readFileSync(filePath).toString('base64');
        return `data:${mime};base64,${data}`;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return `data:${mime};charset=utf-8,${encodeURIComponent(data)}`;
}
function inlineAssets(html, baseDir) {
    // Inline <link rel="stylesheet" href="...">
    html = html.replace(/<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi, (tag, href) => {
        if (href.startsWith('http') || href.startsWith('data:'))
            return tag;
        const abs = path.resolve(baseDir, href);
        if (!fs.existsSync(abs))
            return tag;
        const css = fs.readFileSync(abs, 'utf-8');
        return `<style>${css}</style>`;
    });
    // Inline <script src="...">
    html = html.replace(/<script([^>]*)src=["']([^"']+)["']([^>]*)><\/script>/gi, (tag, pre, src, post) => {
        if (src.startsWith('http') || src.startsWith('data:'))
            return tag;
        const abs = path.resolve(baseDir, src);
        if (!fs.existsSync(abs))
            return tag;
        const js = fs.readFileSync(abs, 'utf-8');
        return `<script${pre}${post}>${js}</script>`;
    });
    // Inline <img src="...">
    html = html.replace(/(<img[^>]+src=["'])([^"']+)(["'][^>]*>)/gi, (tag, pre, src, post) => {
        if (src.startsWith('http') || src.startsWith('data:'))
            return tag;
        const abs = path.resolve(baseDir, src);
        if (!fs.existsSync(abs))
            return tag;
        return `${pre}${toDataUri(abs)}${post}`;
    });
    return html;
}
export async function buildStatic(opts) {
    const prototypeId = generatePrototypeId();
    const indexPath = path.join(opts.input, 'index.html');
    if (!fs.existsSync(indexPath)) {
        throw new Error(`No index.html found in ${opts.input}`);
    }
    console.log('Inlining static assets…');
    let html = fs.readFileSync(indexPath, 'utf-8');
    html = inlineAssets(html, opts.input);
    html = injectRuntime(html, {
        prototypeId,
        prototypeName: opts.name,
        builtAt: Date.now(),
        sinkUrl: opts.sink,
    });
    fs.mkdirSync(path.dirname(opts.output), { recursive: true });
    fs.writeFileSync(opts.output, html, 'utf-8');
    console.log(`Bundled static prototype → ${opts.output}`);
}
