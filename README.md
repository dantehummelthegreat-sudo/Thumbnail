# ThumbTest

A free YouTube thumbnail previewer. Upload your thumbnail designs and instantly
see how they'll look inside realistic YouTube layouts — before you publish.

The app runs client-side in your browser: no backend, no database, no login.
Images stay in the browser — the only exception is the optional **AI critique**
button, which (only when you click it) sends that one image to an AI vision
model via a small serverless function.

## Features

- **Built-in example on load** — a deliberately weak thumbnail next to a strong
  one, already scored, so you see what the tool does before uploading anything.
  One click clears it.
- **Upload 1–3 thumbnails** via drag-and-drop or file picker, with an editable
  video title and channel name for each.
- **Overview tab** — every layout at once on one scrollable page.
- **Four YouTube layouts**, styled to match YouTube's real proportions and
  spacing: homepage grid, search results, watch-page "Up next" sidebar, and
  the mobile feed. The surrounding videos are filled from a bundled library of
  ~100 generated placeholder thumbnails (gaming, vlog, cooking, tech, …) with
  fake titles, shuffled on every page load — all local assets, no real YouTube
  data and no network calls.
- **Desktop / Mobile toggle** — see how readable your thumbnail is at phone size.
- **Dark / Light mode toggle** — YouTube has both, so preview against both.
- **Squint test** — blurs every thumbnail to simulate a split-second glance;
  if yours still reads, it's strong.
- **Overall 0–100 score** — the centerpiece of each thumbnail's card: a big
  number in a colored ring with a band label (90+ Excellent, 75+ Good,
  60+ Okay, 40+ Weak, below 40 Poor). It's a weighted blend of the four
  rule-based checks — contrast and mobile readability carry 35% each (they
  matter most in the feed), edge safety 20%, aspect ratio 10%. When the AI
  critique runs, its 1–10 score is converted to the same scale and blended
  50/50 into the headline number, with both components shown.
- **Rule-based scorecard** — four honest, pixel-measured checks per thumbnail,
  each scored 0–100 on a canvas in the browser (no AI, no network):
  - *Contrast*: luminance spread (P95 − P5 of linear luminance)
  - *Mobile readability*: contrast + how much edge structure survives
    downscaling to the smallest real render size
  - *Edge safety*: detail density in the outer 8% border vs. the center
  - *Aspect ratio*: distance from 16:9
- **Two top-level views** — a Feedback / Context switcher at the top-left.
  *Feedback* (the default) shows the score cards; *Context* shows the YouTube
  layout previews with all their tabs. The upload strip stays visible in both.
- **Side-by-side A/B compare** when you have more than one version.
- **AI critique (optional)** — a "Get AI critique" button per thumbnail that
  asks Claude for blunt, specific feedback: a 2–3 sentence "feed forecast"
  summary (what will make it stand out, what could make it fail), plus a
  score, verdict, problems, and fixes. Works only when an API key is
  configured server-side; without one the button shows a friendly "not set up
  yet" note and everything else works normally.

## Development

```bash
npm install
npm run dev      # start dev server at http://localhost:5173
npm run build    # production build to dist/
npm run lint     # oxlint
```

## Enabling the AI critique

The key lives **only** in a server-side environment variable — it is never in
the browser bundle (no `VITE_` prefix, no client code touches it).

- **Local dev**: copy `.env.example` to `.env`, set `ANTHROPIC_API_KEY`, and
  restart `npm run dev`. A Vite dev-server middleware serves `POST
  /api/critique` using the same handler as production.
- **Deployed**: `api/critique.js` is a standard Vercel-style serverless
  function — deploy the repo to Vercel and set `ANTHROPIC_API_KEY` in the
  project's environment settings. (`vite preview` serves only the static build,
  not `/api` — use `npm run dev` or a real deployment to exercise the critique.)

The exact instruction sent to the model lives in
`api/_lib/critique-core.js` (`CRITIQUE_PROMPT`).

## Stack

React + Vite + Tailwind CSS; `@anthropic-ai/sdk` server-side only.

Not affiliated with YouTube.
