import { mergeFiles } from './merge.js';
import { sortComments } from './sort.js';
import { generateReport } from './report.js';
import * as path from 'path';
import * as fs from 'fs';

function parseArgs(): { dir: string; output?: string } {
  const args = process.argv.slice(2);
  const get = (flag: string) => {
    const i = args.indexOf(flag);
    return i !== -1 ? args[i + 1] : undefined;
  };
  const dir = get('--dir') ?? '.';
  const output = get('--output');
  return { dir: path.resolve(dir), output: output ? path.resolve(output) : undefined };
}

async function main(): Promise<void> {
  const { dir, output } = parseArgs();
  console.error(`Reading feedback JSON from: ${dir}`);

  const merged = mergeFiles(dir);
  console.error(`Loaded ${merged.length} comments from ${dir}`);

  const sorted = sortComments(merged);
  const report = generateReport(sorted);

  if (output) {
    fs.writeFileSync(output, report, 'utf-8');
    console.error(`Triage report written to: ${output}`);
  } else {
    process.stdout.write(report);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
