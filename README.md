# ThumbTest

A free YouTube thumbnail previewer. Upload your thumbnail designs and instantly
see how they'll look inside realistic YouTube layouts — before you publish.

Everything runs client-side in your browser. No backend, no database, no login.
Uploaded images never leave your machine.

## Features

- **Upload 1–3 thumbnails** via drag-and-drop or file picker, with an editable
  video title and channel name for each.
- **Three preview layouts**, styled to match YouTube's real proportions and
  spacing (surrounding videos are gray placeholders with fake titles — no real
  YouTube data is fetched):
  - Search results
  - Homepage grid
  - Watch-page "Up next" sidebar
- **Desktop / Mobile toggle** — see how readable your thumbnail is at phone size.
- **Dark / Light mode toggle** — YouTube has both, so preview against both.
- **Side-by-side A/B compare** when you upload more than one version.

## Development

```bash
npm install
npm run dev      # start dev server at http://localhost:5173
npm run build    # production build to dist/
npm run lint     # oxlint
```

## Stack

React + Vite + Tailwind CSS. No other runtime dependencies.

Not affiliated with YouTube.
