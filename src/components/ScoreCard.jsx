import { useEffect, useState } from 'react'
import { analyzeImage } from '../lib/analyze'

// Analysis results per thumbnail id, kept across re-renders and view changes.
const cache = new Map()

function useAnalysis(thumb) {
  const [result, setResult] = useState(() => cache.get(thumb.id) ?? null)

  useEffect(() => {
    if (cache.has(thumb.id)) {
      setResult(cache.get(thumb.id))
      return
    }
    let live = true
    analyzeImage(thumb.url)
      .then((r) => {
        cache.set(thumb.id, r)
        if (live) setResult(r)
      })
      .catch(() => {
        if (live) setResult({ error: true })
      })
    return () => {
      live = false
    }
  }, [thumb.id, thumb.url])

  return result
}

const DOT = {
  green: 'bg-emerald-500',
  yellow: 'bg-amber-400',
  red: 'bg-red-500',
}

export default function ScoreCard({ thumb }) {
  const result = useAnalysis(thumb)

  if (!result) {
    return (
      <div className="mt-2 text-xs text-neutral-400 dark:text-neutral-500">Analyzing…</div>
    )
  }
  if (result.error) {
    return (
      <div className="mt-2 text-xs text-neutral-400 dark:text-neutral-500">
        Couldn’t analyze this image.
      </div>
    )
  }

  return (
    <ul className="mt-2 flex flex-col gap-1.5">
      {result.checks.map((c) => (
        <li key={c.id} className="flex items-start gap-2">
          <span className={`mt-1 size-2 shrink-0 rounded-full ${DOT[c.level]}`} />
          <p className="min-w-0 text-xs leading-4 text-neutral-600 dark:text-neutral-400">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              {c.label}:
            </span>{' '}
            {c.note}
          </p>
        </li>
      ))}
    </ul>
  )
}
