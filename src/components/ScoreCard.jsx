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
  )
}
