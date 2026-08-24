---
name: darts
description: "MANDATORY: Load this skill when a designer wants to add a comment layer, share a prototype for stakeholder review, get reviewer feedback, annotate a prototype, or produce a shareable review file. Triggers: comment layer, share prototype, stakeholder review, add darts, annotate, feedback layer, review link, share for feedback, commenting, add comments, send to review, ship for review, get feedback, send to stakeholders, ready for review, package for review, make shareable, share this, share with team, share with client, wrap up for review, prep for stakeholders, bundle prototype, export prototype, design darts, client review, reviewable, pin comments, embed feedback, stakeholder feedback, shareable html, single file | Phase: prototype"
argument-hint: "[prototype path or name]"
user-invocable: true
disable-model-invocation: false
metadata:
  author: joshuashane
  version: 1.1.0
---

# /darts — Share for Review

Package the current prototype into a single shareable HTML file with the Design Darts comment overlay injected. Reviewers open the file in any browser, pin comments on elements, and export a JSON file back to you.

---

## When to Activate

**Activate for:**
- Designer asks to share a prototype for stakeholder or PM review
- Designer wants to add commenting, annotation, or a feedback layer to their prototype
- Designer says "share this", "send this for review", "let them comment on it"
- Designer wants to send a prototype to a client or external reviewer

**Do NOT activate for:**
- Building a prototype from scratch
- Collecting feedback after it has already been sent — use the Import button in Design Darts

---

## Step 1 — Locate the prototype

Search for `vite.config.ts` anywhere in the project (excluding node_modules and dist):

```bash
find . -name "vite.config.ts" \
  -not -path "*/node_modules/*" \
  -not -path "*/dist/*" \
  -not -path "*/.tack-build/*" \
  2>/dev/null
```

**If one result:** Use that directory as the prototype path. Tell the designer what you found: "Found prototype at `./path/to/app` — using that."

**If multiple results:** List them and ask: "I found multiple Vite apps — which one should I package?"
```
1. ./apps/web (vite.config.ts)
2. ./packages/prototype (vite.config.ts)
3. ./examples/demo (vite.config.ts)

Which prototype should I package for review?
```

**If no results:** Ask once: "Where is your prototype? (path to the directory containing vite.config.ts)"

**If the path is provided in `$ARGUMENTS`:** Use it directly, skip the search.

---

## Step 2 — Confirm bundle name

Ask one question: "What should I call this review bundle? (e.g. 'Sprint 12 Review' — or press Enter to use the project name)"

If they press Enter or give no name, derive one from the prototype directory name.

---

## Step 3 — Build the runtime (automatic)

Check if the runtime is built and build it silently if not — never ask the designer to do this manually:

```bash
if ls packages/darts-runtime/dist/darts.iife.js > /dev/null 2>&1; then
  echo "runtime ready"
else
  echo "Building Design Darts runtime..."
  node packages/darts-runtime/build.js
  echo "Runtime built."
fi
```

If `packages/darts-runtime/` doesn't exist in this project, say: "Design Darts packages aren't installed here. Run `claude plugin add https://github.com/joshuashane/design-darts` first, or point me to where darts-bundle is installed."

---

## Step 4 — Run darts-bundle

Tell the designer upfront: "Bundling your prototype — Vite is compiling and inlining all assets. This usually takes 20–60 seconds..."

```bash
node packages/darts-bundle/bin/darts-bundle.js \
  --name "$PROTOTYPE_NAME" \
  --input "$PROTOTYPE_PATH" \
  --output "${PROTOTYPE_NAME// /-}-review.html"
```

Stream any output so the designer sees progress. Report the final output path and file size.

---

## Step 5 — Report + reviewer instructions

After bundling succeeds, report the output and generate ready-to-send reviewer instructions:

```
✅ Bundle ready: sprint-12-review.html (2.4 MB)

Here's a message you can paste into Slack or email:

---
Hi [name],

I've packaged the prototype for your review — no install needed.

**To review:**
1. Open the attached `sprint-12-review.html` in any browser (Chrome, Safari, Firefox)
2. Press **C** to enter comment mode, then click any element you want to comment on
3. Type your note and press Enter to save
4. When you're done, click **Export feedback** to download a JSON file
5. Send the JSON file back to me

The file works completely offline — no internet connection needed.

Thanks!
---

Attach sprint-12-review.html to your message.
```

---

## Rules

- Never ask the designer to build the runtime manually — do it automatically in Step 3
- Always search for vite.config.ts before asking where the prototype is
- If multiple Vite apps are found, list them clearly and let the designer choose
- Always narrate what's happening during the Vite build — never go silent for more than a few seconds
- Always output the reviewer instructions after a successful bundle
- If the bundle exceeds 10 MB, warn: "This file is large ({X} MB) — some email clients may block attachments over 10 MB. Consider sharing via a file link instead."
- Do not capture or store reviewer feedback yourself — that is the reviewer's action
