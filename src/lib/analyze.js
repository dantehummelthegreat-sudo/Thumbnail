// Rule-based thumbnail analysis. Runs entirely in the browser on a canvas —
// real pixel measurements, no AI, no network.
//
// Levels: 'green' (good) | 'yellow' (borderline) | 'red' (problem).

// sRGB channel → linear light
function lin(c) {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('image failed to load'))
    img.src = url
  })
}

function makeCanvas(w, h) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

// Draw with the same center-crop the previews use (object-cover to 16:9),
// so we measure what the viewer actually sees.
function drawCovered(ctx, img, w, h) {
  const target = 16 / 9
  const ar = img.naturalWidth / img.naturalHeight
  let sx = 0
  let sy = 0
  let sw = img.naturalWidth
  let sh = img.naturalHeight
  if (ar > target) {
    sw = sh * target
    sx = (img.naturalWidth - sw) / 2
  } else {
    sh = sw / target
    sy = (img.naturalHeight - sh) / 2
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h)
}

function luminances(canvas) {
  const w = canvas.width
  const h = canvas.height
  const { data } = canvas.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, w, h)
  const lum = new Float32Array(w * h)
  for (let i = 0; i < w * h; i++) {
    lum[i] =
      0.2126 * lin(data[i * 4] / 255) +
      0.7152 * lin(data[i * 4 + 1] / 255) +
      0.0722 * lin(data[i * 4 + 2] / 255)
  }
  return lum
}

// Mean |dx|+|dy| gradient, plus the split between the outer 8% border margin
// and the center region.
function gradientStats(lum, w, h) {
  const mx = Math.round(w * 0.08)
  const my = Math.round(h * 0.08)
  let all = 0
  let allN = 0
  let margin = 0
  let marginN = 0
  let center = 0
  let centerN = 0
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x
      const g = Math.abs(lum[i + 1] - lum[i - 1]) + Math.abs(lum[i + w] - lum[i - w])
      all += g
      allN++
      if (x < mx || x >= w - mx || y < my || y >= h - my) {
        margin += g
        marginN++
      } else {
        center += g
        centerN++
      }
    }
  }
  return { mean: all / allN, margin: margin / marginN, center: center / centerN }
}

export async function analyzeImage(url) {
  const img = await loadImage(url)

  // Downscale in halving steps for box-filter-quality resampling:
  // source → 640×360 → 320×180 → 160×90.
  const c640 = makeCanvas(640, 360)
  drawCovered(c640.getContext('2d'), img, 640, 360)
  const c320 = makeCanvas(320, 180)
  c320.getContext('2d').drawImage(c640, 0, 0, 320, 180)
  const c160 = makeCanvas(160, 90)
  c160.getContext('2d').drawImage(c320, 0, 0, 160, 90)

  const lum160 = luminances(c160)
  const g160 = gradientStats(lum160, 160, 90)
  const g320 = gradientStats(luminances(c320), 320, 180)

  // luminance spread at thumbnail size: P95 − P5
  const sorted = Float32Array.from(lum160).sort()
  const pct = (q) => sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))]
  const range = pct(0.95) - pct(0.05)

  // Detail survival across the shrink from desktop size (~320px wide render)
  // to the smallest real render (~160px). For scale-stable bold structure,
  // mean gradient exactly doubles when resolution halves, so survival ≈ 1.
  // Detail finer than the small grid is averaged away, so survival < 1.
  const survival = g320.mean > 0.002 ? Math.min(1, g160.mean / (2 * g320.mean)) : 1

  const busy = g160.mean
  const marginBusy = g160.margin
  const centerBusy = g160.center

  // ---- the four checks ----

  const contrast =
    range >= 0.5
      ? { level: 'green', note: 'Strong light–dark separation — it will pop in the feed.' }
      : range >= 0.22
        ? { level: 'yellow', note: 'Moderate contrast — could stand out more against busy feeds.' }
        : { level: 'red', note: 'Very low contrast — it will fade into the page around it.' }

  const mobile =
    range < 0.22 || survival < 0.45
      ? { level: 'red', note: 'Weak contrast or fine detail — it will turn to mush at phone size.' }
      : range >= 0.4 && survival >= 0.62
        ? { level: 'green', note: 'Bold shapes and strong contrast should survive phone size.' }
        : { level: 'yellow', note: 'Some detail may get lost when shrunk to a phone screen.' }

  const edges =
    marginBusy > 0.09 || (marginBusy > centerBusy * 1.3 && marginBusy > 0.035)
      ? { level: 'red', note: 'Busy detail sits right at the borders — crops and corner rounding will eat it.' }
      : marginBusy <= 0.035
        ? { level: 'green', note: 'Borders are clean — safe from crops and rounded corners.' }
        : { level: 'yellow', note: 'Some content sits close to the borders — keep key elements away from edges.' }

  const target = 16 / 9
  const ar = img.naturalWidth / img.naturalHeight
  const dev = Math.abs(ar - target) / target
  const dims = `${img.naturalWidth}×${img.naturalHeight}`
  const aspect =
    dev <= 0.02
      ? { level: 'green', note: `16:9 (${dims}) — displays without cropping.` }
      : dev <= 0.1
        ? { level: 'yellow', note: `Slightly off 16:9 (${dims}) — minor cropping at the edges.` }
        : { level: 'red', note: `Not 16:9 (${dims}) — YouTube will crop it significantly.` }

  return {
    checks: [
      { id: 'contrast', label: 'Contrast', ...contrast },
      { id: 'mobile', label: 'Mobile readability', ...mobile },
      { id: 'edges', label: 'Edge safety', ...edges },
      { id: 'aspect', label: 'Aspect ratio', ...aspect },
    ],
    // raw metrics, useful for debugging/calibration
    metrics: { range, busy, marginBusy, centerBusy, survival, ar },
  }
}
