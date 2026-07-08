// Per-niche feed images, served from local folders under /public/thumbnails.
// The manifest (written by `npm run thumbs`) lists whatever images exist in
// each folder; everything stays on-origin — no external network calls.

export const NICHES = [
  { id: 'mixed', label: 'Mixed (all niches)' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'cooking', label: 'Cooking / Food' },
  { id: 'vlog', label: 'Vlog / Lifestyle' },
  { id: 'tech', label: 'Tech / Reviews' },
  { id: 'fitness', label: 'Fitness / Health' },
  { id: 'beauty', label: 'Beauty / Fashion' },
  { id: 'finance', label: 'Finance / Business' },
  { id: 'education', label: 'Education / Explainer' },
  { id: 'travel', label: 'Travel / Outdoors' },
  { id: 'entertainment', label: 'Entertainment / Reaction' },
  { id: 'comedy', label: 'Comedy / Skits' },
  { id: 'story', label: 'Story / Narration' },
  { id: 'truecrime', label: 'True Crime / Mystery' },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// nicheId -> shuffled array of full URLs ('' key = the mixed pool)
let pools = { '': [] }

function buildPools(manifest) {
  const next = {}
  const mixed = []
  for (const { id } of NICHES) {
    if (id === 'mixed') continue
    const files = Array.isArray(manifest[id]) ? manifest[id] : []
    const urls = files.map((f) => `/thumbnails/${id}/${encodeURIComponent(f)}`)
    next[id] = shuffle(urls)
    mixed.push(...urls)
  }
  next.mixed = shuffle(mixed)
  pools = next
}

// Kicked off at module load; App re-renders once it resolves. Any failure
// (missing manifest, bad JSON) just leaves the pools empty → generated
// placeholders take over.
export const manifestReady = fetch('/thumbnails/manifest.json')
  .then((r) => (r.ok ? r.json() : {}))
  .then(buildPools)
  .catch(() => {})

// The i-th image for a niche, or null when that niche has no images yet.
export function nicheThumb(nicheId, i) {
  const pool = pools[nicheId] ?? pools.mixed ?? []
  return pool.length ? pool[i % pool.length] : null
}
