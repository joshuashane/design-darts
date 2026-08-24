# /tack-ingest — Feedback Triage

Reads feedback JSON files produced by tack reviewers, merges and deduplicates them, and generates a triage report grouped by screen.

## Triggers

Load this skill when a designer says:
- "triage feedback", "read the feedback", "process reviewer comments"
- "what did reviewers say", "ingest tack output", "merge comments"

## What it produces

A markdown triage report sorted by:
1. URL pathname
2. SPA screen state (if set)
3. Approximate DOM order

Each comment shows: reviewer name, viewport, element selector, source location (if stamped), and comment text.

## Source location (optional)

If the prototype was built with `tackVitePlugin()`, each comment includes a `data-tack-src` attribute pointing to the exact file and line number in the source. Claude Code can navigate directly to the component without grepping.
