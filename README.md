# Design Darts

Pin comments directly on HTML prototypes and collect stakeholder feedback — no install required for reviewers.

Design Darts lets designers package a Vite/React prototype as a single, offline-ready HTML file with a comment overlay injected. Stakeholders open the file in any browser, click elements to drop comment pins (lawn-dart style), type feedback, and download a JSON file. Designers then import that JSON to see all pins overlaid on the prototype and triage feedback with Claude Code.


## Quick start

```bash
# 1. Build the tack runtime (one-time)
node packages/darts-runtime/build.js

# 2. Bundle your prototype with the comment overlay injected
npx tack-bundle path/to/your/index.html --out review.html

# 3. Share review.html — reviewers open it in any browser, no install needed
```

Reviewers press **C** or click **Comment** to arm comment mode, click any element, type a note, and click **Send feedback** to download a JSON file. They email the JSON back to you.

## Packages

| Package | Description |
|---|---|
| `@tack/runtime` | The in-browser comment overlay — bundled into the output HTML |
| `@tack/bundle` | CLI that inlines all assets into a single HTML file and injects the runtime |
| `@tack/ingest` | Reads feedback JSON files, merges/deduplicates, and produces a triage report |
| `@tack/vite-plugin` | Vite plugin that stamps `data-tack-src` attributes (file + line) on elements during dev, enabling Claude Code to navigate directly to source |

## Claude Code skills

Install this repo as a Claude Code plugin (see below) to get two slash commands:

### `/darts` — Package for review

Trigger phrases: "share for review", "add commenting", "send to review", "tack"

Locates your prototype, runs `@tack/bundle`, and drops a single shareable `.html` file. Also generates reviewer instructions you can paste into an email or Slack message.

### `/darts-ingest` — Triage feedback

Trigger phrases: "triage feedback", "process reviewer comments", "ingest darts output", "merge comments"

Reads all feedback JSON files returned by reviewers, merges and deduplicates them, and generates a markdown report sorted by screen, SPA state, and DOM order. If `@tack/vite-plugin` was used, each comment links directly to the source file and line number.

## Install as a Claude Code plugin

```bash
claude plugin add https://github.com/YOUR_ORG/design-darts
```

Or add to your project's `.claude/plugins.json`:

```json
{
  "plugins": ["https://github.com/YOUR_ORG/design-darts"]
}
```

## License

MIT — see [LICENSE](LICENSE).
