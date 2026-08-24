# Design Darts

Pin comments directly on HTML prototypes and collect stakeholder feedback — no install required for reviewers.

Design Darts lets designers package a Vite/React prototype as a single, offline-ready HTML file with a comment overlay injected. Stakeholders open the file in any browser, click elements to drop comment pins (lawn-dart style), type feedback, and download a JSON file. Designers then import that JSON to see all pins overlaid on the prototype and triage feedback with Claude Code.

## Quick start

```bash
# 1. Build the runtime (one-time)
node packages/tack-runtime/build.js

# 2. Bundle your prototype — inlines everything into a single HTML file
node packages/tack-bundle/bin/tack-bundle.js \
  --name "Sprint 12 Review" \
  --input ./my-prototype \
  --output sprint12-review.html

# 3. Share sprint12-review.html — opens in any browser, no install needed
```

Reviewers press **C** or click **Comment** to arm comment mode, click any element, type a note, and click **Export feedback** to download a JSON file. Email or Slack the JSON back to you.

## Packages

| Package | Description |
|---|---|
| `tack-runtime` | The in-browser comment overlay — compiled to a single IIFE, injected into the output HTML |
| `tack-bundle` | CLI that inlines all assets (CSS, JS, fonts, images) as data URIs and injects the runtime — output opens from `file://` with no network |
| `tack-ingest` | Reads feedback JSON files, merges and deduplicates, and produces a triage markdown report |
| `tack-vite-plugin` | Optional Vite plugin that stamps `data-tack-src="src/Foo.tsx:42"` on JSX elements during review builds, so each pin links directly to the source file and line |

## Claude Code skills

Install this repo as a Claude Code plugin (see below) to get two slash commands:

### `/darts` — Package for review

**Trigger phrases** — say any of these mid-session:

> "share for review", "ship for review", "ready for review", "send to stakeholders", "share with client", "share with team", "make shareable", "package for review", "bundle prototype", "add commenting", "add a comment layer", "embed feedback", "design darts", "single file", "shareable html"

Locates your prototype, runs `tack-bundle`, and drops a single shareable `.html` file with Design Darts injected. Also generates reviewer instructions you can paste into an email or Slack message.

### `/darts-ingest` — Triage feedback

**Trigger phrases:**

> "triage feedback", "process reviewer comments", "ingest darts output", "merge comments", "what did reviewers say", "read the feedback", "import feedback"

Reads all feedback JSON files returned by reviewers, merges and deduplicates them, and generates a markdown report sorted by screen, SPA state, and DOM order. If `tack-vite-plugin` was used during the build, each comment links directly to the source file and line number.

## Install as a Claude Code plugin

```bash
claude plugin add https://github.com/joshuashane/design-darts
```

Or add to your project's `.claude/plugins.json`:

```json
{
  "plugins": ["https://github.com/joshuashane/design-darts"]
}
```

## License

MIT — see [LICENSE](LICENSE).
