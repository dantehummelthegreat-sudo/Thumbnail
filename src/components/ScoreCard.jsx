import { summarizeChecks, fixesFor } from '../lib/analyze'

const DOT = {
  green: 'bg-emerald-500',
  yellow: 'bg-amber-400',
  red: 'bg-red-500',
}

// The four rule-based checks for one thumbnail. Presentational — the analysis
// is computed by useAnalysis in the parent card.
export default function ScoreCard({ result }) {
  if (!result) {
    return <div className="mt-3 text-sm text-neutral-400 dark:text-neutral-500">Analyzing…</div>
  }
  if (result.error) {
    return (
      <div className="mt-3 text-sm text-neutral-400 dark:text-neutral-500">
        Couldn’t analyze this image.
      </div>
    )
  }

  return (
    <>
      <div className="mt-3 rounded-r-lg border-l-4 border-sky-500 bg-sky-50/70 px-3 py-2 dark:bg-sky-500/10">
        <div className="text-[10px] font-bold tracking-widest text-sky-600 uppercase dark:text-sky-400">
          Quick verdict
        </div>
        <p className="mt-1 text-[13px] leading-5 text-neutral-800 dark:text-neutral-200">
          {summarizeChecks(result.checks)}
        </p>
      </div>
      <ul className="mt-3 flex flex-col gap-2.5">
      {result.checks.map((c) => (
        <li key={c.id} className="flex items-start gap-2.5">
          <span className={`mt-1 size-2.5 shrink-0 rounded-full ${DOT[c.level]}`} />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                {c.label}
              </span>
              <span className="text-xs font-medium text-neutral-400 tabular-nums dark:text-neutral-500">
                {c.score}
              </span>
            </div>
            <p className="text-[13px] leading-5 text-neutral-600 dark:text-neutral-400">{c.note}</p>
          </div>
        </li>
      ))}
      </ul>
      <FixItBox checks={result.checks} />
    </>
  )
}

// "How to fix it" — actionable bullets for low-scoring pillars, or a positive
// note when nothing needs work. Rule-based; works with no API key.
function FixItBox({ checks }) {
  const fixes = fixesFor(checks)
  const positive = fixes.length === 0
  return (
    <div
      className={`mt-3 rounded-xl border p-3 ${
        positive
          ? 'border-emerald-300/60 bg-emerald-50/60 dark:border-emerald-500/30 dark:bg-emerald-500/10'
          : 'border-amber-300/60 bg-amber-50/60 dark:border-amber-500/30 dark:bg-amber-500/10'
      }`}
    >
      <div
        className={`flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase ${
          positive
            ? 'text-emerald-700 dark:text-emerald-400'
            : 'text-amber-700 dark:text-amber-400'
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-3.5" aria-hidden="true">
          <path d="M14.7 6.3a4.5 4.5 0 0 0-6 5.6L3 17.6V21h3.4l5.7-5.7a4.5 4.5 0 0 0 5.6-6l-3 3-2.6-.7-.7-2.6z" strokeLinejoin="round" />
        </svg>
        How to fix it
      </div>
      {positive ? (
        <p className="mt-1.5 text-xs leading-5 text-neutral-700 dark:text-neutral-300">
          This thumbnail is strong — no major fixes needed.
        </p>
      ) : (
        <ul className="mt-1.5 flex flex-col gap-1.5">
          {fixes.map((f) => (
            <li key={f.id} className="flex gap-2 text-xs leading-5 text-neutral-700 dark:text-neutral-300">
              <span className="text-amber-500">•</span>
              <span className="min-w-0">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {f.label}:
                </span>{' '}
                {f.text}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
