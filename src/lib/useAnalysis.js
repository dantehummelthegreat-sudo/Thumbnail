import { useEffect, useState } from 'react'
import { analyzeImage } from './analyze'

// Analysis results per thumbnail id, kept across re-renders and view changes.
const cache = new Map()

export function useAnalysis(thumb) {
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
