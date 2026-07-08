// Scans public/thumbnails/<niche>/ folders and writes public/thumbnails/manifest.json.
// Runs automatically before `npm run dev` and `npm run build` (see package.json),
// or on demand with `npm run thumbs` — drop images into a niche folder and re-run.
import { readdirSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const NICHE_FOLDERS = [
  'gaming',
  'cooking',
  'vlog',
  'tech',
  'fitness',
  'beauty',
  'finance',
  'education',
  'travel',
  'entertainment',
  'comedy',
  'story',
  'truecrime',
]

const IMAGE_RE = /\.(jpe?g|png|webp|gif|avif)$/i

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'thumbnails')

const manifest = {}
let total = 0
for (const niche of NICHE_FOLDERS) {
  const dir = path.join(root, niche)
  mkdirSync(dir, { recursive: true })
  const files = readdirSync(dir)
    .filter((f) => IMAGE_RE.test(f))
    .sort()
  manifest[niche] = files
  total += files.length
}

writeFileSync(path.join(root, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
console.log(
  `thumbnail manifest: ${total} image(s) across ${NICHE_FOLDERS.length} niche folders`,
)
