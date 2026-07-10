// Built-in example thumbnails shown on first load, so a new visitor sees the
// whole tool working before uploading anything.
//
// Image resolution: if user-provided files named example-weak.* /
// example-strong.* exist in src/assets/examples/, they win automatically;
// otherwise the original generated weak.jpg / strong.jpg are used. Drop the
// new files in that folder and rebuild — no code change needed.
const assets = import.meta.glob('../assets/examples/*', {
  eager: true,
  import: 'default',
})

function findAsset(prefixes) {
  for (const prefix of prefixes) {
    for (const [path, url] of Object.entries(assets)) {
      const name = path.split('/').pop().toLowerCase()
      if (name.startsWith(prefix)) return url
    }
  }
  return null
}

const weakUrl = findAsset(['example-weak', 'weak'])
const strongUrl = findAsset(['example-strong', 'strong'])

export function exampleThumbs() {
  return [
    {
      id: 'example-weak',
      url: weakUrl,
      title: 'my vlog episode 24 (new)',
      channel: 'Example Channel',
      isExample: true,
      exampleKind: 'weak',
    },
    {
      id: 'example-strong',
      url: strongUrl,
      title: 'I Quit Sugar for 30 Days — Here’s What Happened',
      channel: 'Example Channel',
      isExample: true,
      exampleKind: 'strong',
    },
  ]
}
