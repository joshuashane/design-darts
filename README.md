# Design Darts

Pin comments directly on HTML prototypes and collect stakeholder feedback — no install required for reviewers.

Design Darts packages any Vite/React prototype as a single, offline-ready HTML file with a comment overlay injected. Stakeholders open the file in any browser, click elements to drop comment pins, type feedback, and export a JSON file. Designers import that JSON to see all pins overlaid on the prototype.

## Quick start

```bash
# 1. Build the runtime (one-time setup)
node packages/tack-runtime/build.js

# 2. Bundle your prototype into a single shareable HTML file
node packages/tack-bundle/bin/tack-bundle.js \
  --name "Sprint 12 Review" \
  --input ./my-prototype \
  --output sprint12-review.html

# 3. Share sprint12-review.html — opens in any browser, zero install for reviewers
```

Reviewers press **C** to enter comment mode, click any element, type a note, and click **Export feedback** to download a JSON file. Send the JSON back to you.

To see their comments: open the same HTML file, click the **↑ Import** button, and select their JSON. All pins appear overlaid at exactly where they clicked.

## Claude Code skill

Install this repo as a Claude Code plugin to get the `/darts` slash command:

### `/darts` — Share for review

Say any of these mid-session and Claude Code will handle the rest:

> "share for review" · "ship for review" · "ready for review" · "send to stakeholders" · "share with client" · "make shareable" · "package for review" · "add a comment layer" · "design darts" · "single file" · "shareable html"

Locates your prototype, runs `tack-bundle`, produces a single `.html` file, and generates reviewer instructions you can paste into an email or Slack message.

## Install as a Claude Code plugin

```bash
claude plugin add https://github.com/joshuashane/design-darts
```

## Packages

| Package | Purpose |
|---|---|
| `tack-runtime` | In-browser comment overlay, compiled to a single IIFE |
| `tack-bundle` | CLI — inlines all assets as data URIs and injects the runtime |
| `tack-ingest` | CLI — merges feedback JSON files into a triage markdown report (for developers) |
| `tack-vite-plugin` | Vite plugin — stamps source file + line on JSX elements so pins link to code |

## License

MIT — Copyright (c) 2026 Josh Stone
