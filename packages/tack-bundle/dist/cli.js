import { buildVite } from './build-vite.js';
import { buildStatic } from './build-static.js';
import * as path from 'path';
import * as fs from 'fs';
function parseArgs() {
    const args = process.argv.slice(2);
    const get = (flag) => {
        const i = args.indexOf(flag);
        return i !== -1 ? args[i + 1] : undefined;
    };
    const name = get('--name') ?? path.basename(process.cwd());
    const input = get('--input') ?? '.';
    const output = get('--output') ?? `${name.replace(/\s+/g, '-').toLowerCase()}-review.html`;
    const sink = get('--sink');
    return { name, input: path.resolve(input), output: path.resolve(output), sink };
}
async function main() {
    const { name, input, output, sink } = parseArgs();
    console.log(`\n📌 tack-bundle — packaging "${name}"\n`);
    const isVite = fs.existsSync(path.join(input, 'vite.config.ts')) ||
        fs.existsSync(path.join(input, 'vite.config.js'));
    if (isVite) {
        await buildVite({ name, input, output, sink });
    }
    else {
        await buildStatic({ name, input, output, sink });
    }
    const sizeMb = fs.statSync(output).size / 1024 / 1024;
    console.log(`\n✅ Bundle written: ${output} (${sizeMb.toFixed(1)} MB)`);
    if (sizeMb > 10) {
        console.warn('\n⚠️  Bundle exceeds 10 MB. Email attachments may bounce and Outlook may misbehave.', '\nConsider hosting the file on an internal share and sending a link instead.');
    }
}
main().catch(err => { console.error(err); process.exit(1); });
