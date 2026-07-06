// Rule-based thumbnail analysis. Runs entirely in the browser on a canvas —
// real pixel measurements, no AI, no network.
//
// Each check produces a continuous 0–100 score via piecewise-linear ramps over
// the raw metrics; its traffic-light level is derived from that score
// (>=75 green, >=50 yellow, else red), so number and color never disagree.
// The overall score is a weighted blend — contrast and mobile readability
// matter most in the feed, so they carry the most weight.

const WEIGHTS = { contrast: 0.35, mobile: 0.35, edges: 0.2, aspect: 0.1 }

// Piecewise-linear interpolation through [x, y] anchor points (ascending x).
function ramp(v, pts) {
  if (v <= pts[0][0]) return pts[0][1]
  for (let i = 1; i < pts.length; i++) {
    if (v <= pts[i][0]) {
      const [x0, y0] = pts[i - 1]
      const [x1, y1] = pts[i]
      return y0 + ((v - x0) / (x1 - x0)) * (y1 - y0)
    }
  }
  return pts[pts.length - 1][1]
}

function levelOf(score) {
  return score >= 75 ? 'green' : score >= 50 ? 'yellow' : 'red'
}

// The 0–100 → band mapping used everywhere a score is displayed.
export function scoreBand(score) {
  if (score >= 90)
    return { label: 'Excellent', hex: '#047857', text: 'text-emerald-700 dark:text-emerald-500', chip: 'bg-emerald-700' }
  if (score >= 75)
    return { label: 'Good', hex: '#22c55e', text: 'text-green-600 dark:text-green-400', chip: 'bg-green-500' }
  if (score >= 60)
    return { label: 'Okay', hex: '#f59e0b', text: 'text-amber-600 dark:text-amber-400', chip: 'bg-amber-500' }
  if (score >= 40)
    return { label: 'Weak', hex: '#f97316', text: 'text-orange-600 dark:text-orange-400', chip: 'bg-orange-500' }
  return { label: 'Poor', hex: '#dc2626', text: 'text-red-600 dark:text-red-500', chip: 'bg-red-600' }
}

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

  // ---- the four checks, scored 0–100 ----
  // Ramp anchors are pinned to the calibrated traffic-light thresholds:
  // the old red/yellow boundary maps to 50, yellow/green to 75.

  const contrastScore = ramp(range, [
    [0.05, 10],
    [0.22, 50],
    [0.5, 75],
    [0.8, 100],
  ])

  // weakest link of contrast and structure survival at small size
  const mobileScore = Math.min(
    ramp(range, [
      [0.05, 5],
      [0.22, 50],
      [0.4, 75],
      [0.7, 100],
    ]),
    ramp(survival, [
      [0.2, 10],
      [0.45, 50],
      [0.62, 75],
      [0.95, 100],
    ]),
  )

  let edgeScore = ramp(marginBusy, [
    [0, 100],
    [0.035, 75],
    [0.09, 50],
    [0.15, 20],
  ])
  // borders busier than the interior → content is jammed against the edges
  if (marginBusy > centerBusy * 1.3 && marginBusy > 0.035) edgeScore = Math.min(edgeScore, 45)

  const target = 16 / 9
  const ar = img.naturalWidth / img.naturalHeight
  const dev = Math.abs(ar - target) / target
  const aspectScore = ramp(dev, [
    [0, 100],
    [0.02, 76],
    [0.1, 50],
    [0.3, 10],
  ])

  const dims = `${img.naturalWidth}×${img.naturalHeight}`
  const NOTES = {
    contrast: {
      green: 'Strong light–dark separation — it will pop in the feed.',
      yellow: 'Moderate contrast — could stand out more against busy feeds.',
      red: 'Very low contrast — it will fade into the page around it.',
    },
    mobile: {
      green: 'Bold shapes and strong contrast should survive phone size.',
      yellow: 'Some detail may get lost when shrunk to a phone screen.',
      red: 'Weak contrast or fine detail — it will turn to mush at phone size.',
    },
    edges: {
      green: 'Borders are clean — safe from crops and rounded corners.',
      yellow: 'Some content sits close to the borders — keep key elements away from edges.',
      red: 'Busy detail sits right at the borders — crops and corner rounding will eat it.',
    },
    aspect: {
      green: `16:9 (${dims}) — displays without cropping.`,
      yellow: `Slightly off 16:9 (${dims}) — minor cropping at the edges.`,
      red: `Not 16:9 (${dims}) — YouTube will crop it significantly.`,
    },
  }

  const check = (id, label, score) => {
    const s = Math.round(score)
    const level = levelOf(s)
    return { id, label, score: s, level, note: NOTES[id][level] }
  }

  const checks = [
    check('contrast', 'Contrast', contrastScore),
    check('mobile', 'Mobile readability', mobileScore),
    check('edges', 'Edge safety', edgeScore),
    check('aspect', 'Aspect ratio', aspectScore),
  ]

  const score = Math.round(
    contrastScore * WEIGHTS.contrast +
      mobileScore * WEIGHTS.mobile +
      edgeScore * WEIGHTS.edges +
      aspectScore * WEIGHTS.aspect,
  )

  return {
    score,
    checks,
    // raw metrics, useful for debugging/calibration
    metrics: { range, busy, marginBusy, centerBusy, survival, ar },
  }
}
