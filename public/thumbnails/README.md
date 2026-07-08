# Niche thumbnail folders

Drop feed images here, one folder per niche:

`gaming/ cooking/ vlog/ tech/ fitness/ beauty/ finance/ education/ travel/
entertainment/ comedy/ story/ truecrime/`

- Formats: `.jpg` `.jpeg` `.png` `.webp` `.gif` `.avif`
- Recommended: 16:9 JPEG or WebP, 480×270 or 640×360, under ~100 KB each
- Up to ~100 images per folder
- File names don't matter — everything matching an image extension is picked up

After adding or removing images run `npm run thumbs` (it also runs
automatically when you start `npm run dev` or `npm run build`). The app
shuffles each niche's images on every page load; empty folders fall back to
the built-in generated placeholders.
