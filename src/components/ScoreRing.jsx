import { scoreBand } from '../lib/analyze'

// Big circular score display — the first thing the eye should land on.
// Pass score = null while the analysis is still running.
export default function ScoreRing({ score, size = 136, stroke = 10 }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const band = score != null ? scoreBand(score) : null
  const filled = score != null ? (c * score) / 100 : 0

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="stroke-neutral-200 dark:stroke-neutral-800"
        />
        {band && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            stroke={band.hex}
            strokeLinecap="round"
            strokeDasharray={`${filled} ${c}`}
            className="transition-[stroke-dasharray] duration-700 ease-out"
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {score != null ? (
          <>
            <span className="text-4xl leading-none font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
              {score}
            </span>
            <span className="mt-0.5 text-[10px] font-medium tracking-widest text-neutral-400 uppercase dark:text-neutral-500">
              / 100
            </span>
          </>
        ) : (
          <span className="text-sm text-neutral-400 dark:text-neutral-500">…</span>
        )}
      </div>
    </div>
  )
}
