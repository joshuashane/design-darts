---
name: darts
description: "MANDATORY: Load this skill when a designer wants to add a comment layer, share a prototype for stakeholder review, get reviewer feedback, annotate a prototype, or produce a shareable review file. Triggers: comment layer, share prototype, stakeholder review, add darts, annotate, feedback layer, review link, share for feedback, commenting, add comments, send to review, ship for review, get feedback, send to stakeholders, ready for review, package for review, make shareable, share this, share with team, share with client, wrap up for review, prep for stakeholders, bundle prototype, export prototype, design darts, client review, reviewable, pin comments, embed feedback, stakeholder feedback, shareable html, single file, share storybook, storybook review, share component library, angular review, share next app | Phase: prototype"
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

## Step 1 — Detect the framework and locate the prototype

Design Darts works with any web project. First, detect what kind of project this is:

```bash
# Check for framework config files
find . -maxdepth 3 \
  \( -name "vite.config.ts" -o -name "vite.config.js" \
  -o -name "next.config.js" -o -name "next.config.ts" -o -name "next.config.mjs" \
  -o -name "svelte.config.js" -o -name "nuxt.config.ts" \) \
  -not -path "*/node_modules/*" -not -path "*/dist/*" \
  2>/dev/null
```

Also check package.json for CRA, Storybook, and Angular:
```bash
grep -l "react-scripts\|@storybook\|@angular/core" */package.json package.json 2>/dev/null | head -3
cat angular.json 2>/dev/null | grep "\"defaultProject\"\|\"projects\"" | head -3
```

**Match the result to a strategy:**

| What you found | Framework | Strategy |
|---|---|---|
| `vite.config.*` | Vite/React | darts-bundle handles the build internally |
| `next.config.*` | Next.js | Run `next build` → use `out/` directory |
| `angular.json` | Angular | Run `ng build` → use `dist/{project}/browser/` |
| `react-scripts` in package.json | Create React App | Run `npm run build` → use `build/` directory |
| `@storybook` in package.json | Storybook | Run `build-storybook` → use `storybook-static/` |
| `svelte.config.js` | SvelteKit | Run `npm run build` → use `build/` directory |
| `nuxt.config.*` | Nuxt | Run `npx nuxi generate` → use `.output/public/` |
| `index.html` with no framework | Plain HTML | Use directory directly |
| None of the above | Unknown | Ask: "What kind of project is this? I can bundle Vite, Next.js, Angular, React (CRA), Storybook, SvelteKit, Nuxt, or plain HTML." |

**If multiple apps found:** List them and ask which one to package.

**If the path is provided in `$ARGUMENTS`:** Use it directly, detect its framework, skip the search.

---

## Step 2 — Confirm bundle name

Ask one question: "What should I call this review bundle? (e.g. 'Sprint 12 Review' — or press Enter to use the project name)"

If they press Enter or give no name, derive one from the prototype directory name.

---

## Step 2b — Framework-specific pre-build

For non-Vite frameworks, produce a static export before bundling. Run the appropriate command from the prototype directory:

**Next.js:**
Check if `output: 'export'` is in `next.config.*`. If not, add it temporarily:
```bash
# Check
grep -q "output.*export" next.config.* 2>/dev/null || echo "needs config"
```
If missing, tell the designer: "I'll add `output: 'export'` to next.config.js temporarily to produce static HTML — I'll remove it after bundling." Then add `output: 'export'` to the next.config, run the build, and restore the file.

```bash
cd "$PROTOTYPE_PATH" && npx next build
# Output is in ./out/
```
Set `STATIC_INPUT="$PROTOTYPE_PATH/out"`.

**Angular:**
```bash
cd "$PROTOTYPE_PATH" && npx ng build --configuration=production
```
Find the output directory — Angular puts it in `dist/{projectName}/browser/` (Angular 17+) or `dist/{projectName}/` (older):
```bash
ls dist/
```
Set `STATIC_INPUT` to whichever path contains `index.html`.

**Storybook:**
```bash
cd "$PROTOTYPE_PATH" && npx build-storybook --output-dir storybook-static
# Output is in ./storybook-static/
```
Set `STATIC_INPUT="$PROTOTYPE_PATH/storybook-static"`.

Tell the designer: "I'm building your Storybook as a single offline file — reviewers will be able to browse all your components and pin comments on anything they want to discuss."

**Create React App:**
```bash
cd "$PROTOTYPE_PATH" && npm run build
# Output is in ./build/
```
Set `STATIC_INPUT="$PROTOTYPE_PATH/build"`.

**SvelteKit:**
```bash
cd "$PROTOTYPE_PATH" && npm run build
# Output is in ./build/
```
Set `STATIC_INPUT="$PROTOTYPE_PATH/build"`.

**Nuxt:**
```bash
cd "$PROTOTYPE_PATH" && npx nuxi generate
# Output is in ./.output/public/
```
Set `STATIC_INPUT="$PROTOTYPE_PATH/.output/public"`.

**Plain HTML / already-built folder:** Set `STATIC_INPUT="$PROTOTYPE_PATH"`.

**Vite:** No pre-build needed — darts-bundle handles it. Skip this step entirely.

For non-Vite frameworks, pass `--input "$STATIC_INPUT"` to darts-bundle in Step 4 instead of `--input "$PROTOTYPE_PATH"`.

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

If `packages/darts-runtime/` doesn't exist in this project, install it automatically — don't ask:

```bash
claude plugin add https://github.com/joshuashane/design-darts
```

Then continue to Step 4 without any interruption.

---

## Step 3b — Check for BrowserRouter (React apps)

Before bundling, check if the app uses BrowserRouter:

```bash
grep -r "BrowserRouter" "$PROTOTYPE_PATH/src" --include="*.tsx" --include="*.ts" -l 2>/dev/null
```

If found and `HashRouter` is NOT also present, warn the designer:

> "⚠️ Your app uses BrowserRouter, which produces a blank page when opened from file:// (the URL path becomes a filesystem path and no routes match). I'll switch it to HashRouter — this only affects the bundled review file, not your dev server."

Then make the replacement in the entry file (main.tsx or index.tsx):
```
import { HashRouter as BrowserRouter } from 'react-router-dom'
```

This is a safe swap — HashRouter uses the `#` fragment which works from file://, and your dev server continues to work with BrowserRouter.

## Step 4 — Run darts-bundle

Tell the designer upfront: "Bundling your prototype — Vite is compiling and inlining all assets. This usually takes 20–60 seconds..."

```bash
# For Vite projects:
node packages/darts-bundle/bin/darts-bundle.js \
  --name "$PROTOTYPE_NAME" \
  --input "$PROTOTYPE_PATH" \
  --output "${PROTOTYPE_NAME// /-}-review.html"

# For all other frameworks (use STATIC_INPUT from Step 2b):
node packages/darts-bundle/bin/darts-bundle.js \
  --name "$PROTOTYPE_NAME" \
  --input "$STATIC_INPUT" \
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
