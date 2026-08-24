---
name: darts-ingest
description: "MANDATORY: Load this skill when a designer has received feedback JSON files from stakeholder review and wants to triage, read, or process them. Triggers: tack-ingest, feedback JSON, triage feedback, process review, ingest feedback, reviewer comments, read feedback, merge comments, read tack output, what did reviewers say | Phase: refine"
argument-hint: "[path to folder containing feedback JSON files]"
user-invocable: true
disable-model-invocation: false
metadata:
  author: joshuashane
  version: 1.0.0
---

# /darts-ingest — Feedback Triage

Read feedback JSON files collected from stakeholder prototype review, merge and deduplicate them, and produce a triage report sorted by screen and DOM order.

---

## When to Activate

**Activate for:**
- Designer has received feedback JSON files from reviewers
- Designer says "what did reviewers say", "read the feedback", "triage comments"
- Designer wants to process tack feedback into actionable items

**Do NOT activate for:**
- Packaging a prototype for review — that is `/tack`
- Capturing session notes unrelated to a prototype review

---

## Step 1 — Find the feedback files

Ask the designer:
```
Where are the feedback JSON files? (folder path, or drag/drop them here)
```

If a path is given, verify it exists:
```bash
ls "$FEEDBACK_DIR"/*.json 2>/dev/null | head -10
```

---

## Step 2 — Run tack-ingest

```bash
node packages/darts-ingest/dist/cli.js \
  --dir "$FEEDBACK_DIR" \
  --output triage-$(date +%Y-%m-%d).md
```

If the CLI is not built:
```bash
cd packages/darts-ingest && npm install && npm run build
```

---

## Step 3 — Present the report

Read `triage-{date}.md` and present a summary:
- Total comment count (open / resolved / orphaned)
- Screens with most comments
- Any orphaned comments that need manual review

Then ask:
```
Would you like me to:
a) Show the full triage report
b) Focus on a specific screen
c) Propose fixes for the open comments
d) Mark specific comments as resolved
```

---

## Step 4 — Propose or apply fixes (optional)

If the designer asks for proposed fixes:
- Read each open comment with a `sourceLocation` field
- Open the referenced file at the referenced line
- Propose a specific code or copy change based on the comment text
- Ask for confirmation before applying

If no `sourceLocation` is available:
- Use the `cssSelector` to locate the component in the source tree via grep
- Propose the change based on the best match found

---

## Rules

- Never apply changes without designer confirmation
- Orphaned comments are surfaced prominently — never silently skip them
- If a comment has `sourceLocation`, go directly to the file; do not grep
- If no feedback files are found in the specified folder, say so explicitly
- Do not ingest files from outside the specified folder
