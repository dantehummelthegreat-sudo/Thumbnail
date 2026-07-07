// Bundled library of ~100 generated placeholder thumbnails that fill the fake
// feed around the user's upload. All local assets — no network calls.
const modules = import.meta.glob('../assets/library/*.jpg', {
  eager: true,
  import: 'default',
})
const urls = Object.keys(modules)
  .sort()
  .map((k) => modules[k])

// Shuffled once per page load, so every visit shows a different busy feed but
// the layout stays stable while typing/re-rendering.
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
const shuffled = shuffle(urls)

export function libraryThumb(i) {
  return shuffled.length ? shuffled[i % shuffled.length] : null
}
