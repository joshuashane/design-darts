---
name: darts
description: "MANDATORY: Load this skill when a designer wants to add a comment layer, share a prototype for stakeholder review, get reviewer feedback, annotate a prototype, or produce a shareable review file. Triggers: comment layer, share prototype, stakeholder review, add darts, annotate, feedback layer, review link, share for feedback, commenting, add comments, send to review, ship for review, get feedback, send to stakeholders, ready for review, package for review, make shareable, share this, share with team, share with client, wrap up for review, prep for stakeholders, bundle prototype, export prototype, design darts, client review, reviewable, pin comments, embed feedback, stakeholder feedback, shareable html, single file | Phase: prototype"
argument-hint: "[prototype path or name]"
user-invocable: true
disable-model-invocation: false
metadata:
  author: joshuashane
  version: 1.0.0
---

# /darts — Prototype Comment Layer

Package the current prototype into a single shareable HTML file with the tack comment overlay injected. Reviewers can open the file from a local path or email, click any element to comment, and send feedback back as JSON.

---

## When to Activate

**Activate for:**
- Designer asks to share a prototype for stakeholder or PM review
- Designer wants to add commenting, annotation, or a feedback layer to their prototype
- Designer says "share this", "send this for review", "let them comment on it", "add darts"
- Designer wants to share a finished prototype with stakeholders for annotation

**Do NOT activate for:**
- Building a prototype from scratch
- Collecting feedback after it has already been sent — that is `/darts-ingest`

---

## Step 1 — Locate the prototype

Check whether a Vite/React prototype exists in the session context or the current working directory:

```bash
ls prototype/ 2>/dev/null && echo "found: ./prototype" || echo "not found"
ls examples/demo-prototype/ 2>/dev/null && echo "found: ./examples/demo-prototype" || echo "not found"
```

If neither exists, ask:
```
Where is your prototype? (path to the directory, e.g. ./prototype)
```

---

## Step 2 — Confirm bundle details

Ask one question at a time:

1. "What should I call this review bundle? (e.g. 'Sprint 12 Review')"
2. "Should I send feedback to a collection endpoint? If yes, paste the URL. Otherwise press Enter to skip."

---

## Step 3 — Build the runtime (if needed)

```bash
# Check if the runtime is already built
ls packages/tack-runtime/dist/tack.iife.js 2>/dev/null && echo "runtime ready" || node packages/tack-runtime/build.js
```

Note: `packages/tack-bundle` must be installed in the same repo as the prototype. For designers working in their own app repos, install tack-bundle globally (`npm install -g tack-bundle`) or via `npx tack-bundle`.

---

## Step 4 — Run tack-bundle

```bash
node packages/tack-bundle/dist/cli.js \
  --name "$PROTOTYPE_NAME" \
  --input "$PROTOTYPE_PATH" \
  --output "${PROTOTYPE_NAME// /-}-review.html" \
  ${SINK_URL:+--sink "$SINK_URL"}
```

Report the output path and size to the designer.

---

## Step 5 — Share instructions for reviewers

After bundling, tell the designer:

```
Your review bundle is ready: {output-filename}

To share with reviewers:
• Email the file directly, or drop it in Slack/Teams
• Reviewers open it in any browser — no install needed
• They press C (or click "Comment") to arm comment mode, then click any element
• When done, they click "Send feedback" to download a JSON file
• Send the JSON file back to you

Once you have the JSON files, run /darts-ingest to triage.
```

---

## Rules

- Never run tack-bundle without confirming the prototype path and bundle name
- If the runtime is not built, build it silently before bundling
- Always report the output file path and size after bundling
- If the bundle exceeds 10 MB, suggest a hosted alternative and warn the designer
- Do not capture or store reviewer feedback yourself — that is the reviewer's action
