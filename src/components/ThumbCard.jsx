import { useState } from 'react'
import { useAnalysis } from '../lib/useAnalysis'
import { scoreBand } from '../lib/analyze'
import { versionLetter } from '../lib/placeholders'
import ScoreRing from './ScoreRing'
import ScoreCard from './ScoreCard'
import CritiquePanel from './CritiquePanel'

// The centerpiece: one card per thumbnail with the big score up top, then the
// image, its title/channel, the four checks, and the optional AI critique.
export default function ThumbCard({ thumb, index, count, updateThumb, removeThumb }) {
  const analysis = useAnalysis(thumb)
  const [critique, setCritique] = useState(null)

  const ruleScore = analysis && !analysis.error ? analysis.score : null
  const aiScore = critique ? Math.max(0, Math.min(100, critique.score * 10)) : null
  // headline = rule-based score, blended 50/50 with the AI score once it exists
  const headline =
    ruleScore == null ? null : aiScore == null ? ruleScore : Math.round((ruleScore + aiScore) / 2)
  const band = headline != null ? scoreBand(headline) : null

  return (
    <div className="w-full max-w-[440px] min-w-0 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {count > 1 && (
            <span className="rounded bg-neutral-900 px-1.5 py-0.5 text-[11px] font-bold tracking-wide text-white dark:bg-neutral-100 dark:text-black">
              VERSION {versionLetter(index)}
            </span>
          )}
          {thumb.isExample && (
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase ${
                thumb.exampleKind === 'weak' ? 'bg-red-600/90' : 'bg-emerald-600/90'
              }`}
            >
              {thumb.exampleKind === 'weak' ? 'Weak example' : 'Strong example'}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => removeThumb(thumb.id)}
          title="Remove thumbnail"
          className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-red-600 dark:hover:bg-neutral-800"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4" aria-hidden="true">
            <path d="M4 7h16M10 11v6m4-6v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="mt-1 flex flex-col items-center">
        <ScoreRing score={headline} />
        <div className={`mt-2 text-xl font-bold ${band ? band.text : 'text-neutral-400'}`}>
          {band ? band.label : 'Scoring…'}
        </div>
        {aiScore != null && ruleScore != null && (
          <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 dark:bg-neutral-800">
              Checks {ruleScore}
            </span>
            <span>·</span>
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 dark:bg-neutral-800">
              AI {aiScore}
            </span>
            <span>·</span>
            <span>blended 50/50</span>
          </div>
        )}
      </div>

      <img
        src={thumb.url}
        alt={`Thumbnail version ${versionLetter(index)}`}
        className="mt-4 aspect-video w-full rounded-xl object-cover"
      />

      <div className="mt-3 flex flex-col gap-2">
        <input
          type="text"
          value={thumb.title}
          maxLength={100}
          onChange={(e) => updateThumb(thumb.id, { title: e.target.value })}
          placeholder="Video title"
          className="w-full rounded-md border border-neutral-200 bg-transparent px-2.5 py-1.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none dark:border-neutral-700 dark:text-neutral-100 dark:focus:border-neutral-500"
        />
        <input
          type="text"
          value={thumb.channel}
          maxLength={50}
          onChange={(e) => updateThumb(thumb.id, { channel: e.target.value })}
          placeholder="Channel name"
          className="w-full rounded-md border border-neutral-200 bg-transparent px-2.5 py-1.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none dark:border-neutral-700 dark:text-neutral-100 dark:focus:border-neutral-500"
        />
      </div>

      <ScoreCard result={analysis} />
      <CritiquePanel thumb={thumb} onDone={setCritique} />
    </div>
  )
}
