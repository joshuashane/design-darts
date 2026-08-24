# /tack — Prototype Comment Layer

Packages a Vite/React prototype into a single shareable HTML file with the tack comment overlay injected. Stakeholders open the file locally, click elements to comment, and send feedback back as JSON.

## Triggers

Load this skill when a designer says any of:
- "share for review", "add commenting", "comment layer", "stakeholder feedback"
- "send to review", "share this prototype", "annotate", "tack"

## What it does

1. Locates the Vite/React prototype in the repo
2. Runs `darts-bundle` to inline all assets and inject the darts runtime
3. Outputs a single `.html` file the designer can email or drop in Slack
4. Gives the designer instructions to pass to their reviewers

## Reviewer workflow (no install required)

1. Open the HTML file in any browser
2. Press **C** or click **Comment** to arm comment mode
3. Click any element, type a comment, then Save
4. Click **Send feedback** to download a JSON file
5. Email the JSON back to the designer

## Designer triage workflow

Run `/darts-ingest` once you have the JSON files.

## Notes

`darts-bundle` must be available in the same repo as the prototype. For designers working in standalone app repos, install globally: `npm install -g darts-bundle`, or invoke with `npx darts-bundle`.
