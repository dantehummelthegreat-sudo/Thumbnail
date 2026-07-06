// Client side of the AI critique. The image is downscaled to 1280px-wide JPEG
// on a canvas first (smaller payload, fewer tokens), then POSTed to the
// serverless endpoint — the only moment an image ever leaves the browser, and
// only when the user explicitly clicks the button.

async function toJpegBase64(url) {
  const img = await new Promise((resolve, reject) => {
    const el = new Image()
    el.onload = () => resolve(el)
    el.onerror = () => reject(new Error('image failed to load'))
    el.src = url
  })
  const scale = Math.min(1, 1280 / img.naturalWidth)
  const w = Math.max(1, Math.round(img.naturalWidth * scale))
  const h = Math.max(1, Math.round(img.naturalHeight * scale))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  canvas.getContext('2d').drawImage(img, 0, 0, w, h)
  return canvas.toDataURL('image/jpeg', 0.85).split(',')[1]
}

export async function requestCritique(thumb) {
  let imageBase64
  try {
    imageBase64 = await toJpegBase64(thumb.url)
  } catch {
    return { status: 'error', message: 'Could not read the image.' }
  }

  let res
  try {
    res = await fetch('/api/critique', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        imageBase64,
        mediaType: 'image/jpeg',
        title: thumb.title,
        channel: thumb.channel,
      }),
    })
  } catch {
    return { status: 'error', message: 'Network error — is the app running with its API?' }
  }

  if (res.status === 503) return { status: 'unconfigured' }

  let body
  try {
    body = await res.json()
  } catch {
    return { status: 'error', message: 'The AI service returned an unreadable response.' }
  }

  if (!res.ok) {
    return { status: 'error', message: body?.error || 'The AI critique failed.' }
  }
  return { status: 'ok', critique: body }
}
