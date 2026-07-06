import { useState } from 'react'
import { requestCritique } from '../lib/critique'
import { scoreBand } from '../lib/analyze'

// "Get AI critique" button + result panel for one thumbnail. State is local;
// onDone reports the critique up so the card can blend the AI score into the
// headline number.
export default function CritiquePanel({ thumb, onDone }) {
  const [state, setState] = useState({ phase: 'idle' })

  const run = async () => {
    setState({ phase: 'loading' })
    onDone?.(null)
    const result = await requestCritique(thumb)
    if (result.status === 'ok') {
      setState({ phase: 'done', critique: result.critique })
      onDone?.(result.critique)
    } else if (result.status === 'unconfigured') setState({ phase: 'unconfigured' })
    else setState({ phase: 'error', message: result.message })
  }

  return (
    <div className="mt-3 border-t border-neutral-200 pt-2 dark:border-neutral-800">
      {state.phase !== 'done' && (
        <button
          type="button"
          onClick={run}
          disabled={state.phase === 'loading'}
          className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-200 disabled:cursor-wait disabled:opacity-60 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={`size-3.5 ${state.phase === 'loading' ? 'animate-spin' : ''}`} aria-hidden="true">
            {state.phase === 'loading' ? (
              <path d="M21 12a9 9 0 1 1-9-9" strokeLinecap="round" />
            ) : (
              <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 15l.9 2.4L22 18.3l-2.1.9-.9 2.3-.9-2.3-2.1-.9 2.1-.9z" strokeLinejoin="round" />
            )}
          </svg>
          {state.phase === 'loading' ? 'Analyzing…' : 'Get AI critique'}
        </button>
      )}

      {state.phase === 'idle' && (
        <p className="mt-1.5 text-[11px] leading-4 text-neutral-400 dark:text-neutral-500">
          Sends this image to an AI vision model for feedback.
        </p>
      )}

      {state.phase === 'unconfigured' && (
        <p className="mt-2 rounded-lg bg-neutral-100 px-3 py-2 text-xs leading-5 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
          AI critique isn’t set up yet. Add an <code className="font-mono">ANTHROPIC_API_KEY</code>{' '}
          to the server environment (see <code className="font-mono">.env.example</code>) to enable
          it. Everything else works without it.
        </p>
      )}

      {state.phase === 'error' && (
        <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs leading-5 text-red-700 dark:bg-red-950/40 dark:text-red-400">
          {state.message}
        </p>
      )}

      {state.phase === 'done' && (
        <div className="rounded-lg bg-neutral-100 p-3 dark:bg-neutral-800">
          <div className="flex items-center gap-2">
            <span
              className={`rounded px-1.5 py-0.5 text-[11px] font-bold text-white ${scoreBand(state.critique.score * 10).chip}`}
            >
              {state.critique.score * 10}/100
            </span>
            <span className="text-[11px] font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
              AI critique · {scoreBand(state.critique.score * 10).label}
            </span>
          </div>
          <p className="mt-2 text-xs leading-5 font-medium text-neutral-800 dark:text-neutral-200">
            {state.critique.verdict}
          </p>
          {state.critique.problems?.length > 0 && (
            <ul className="mt-2 flex flex-col gap-1">
              {state.critique.problems.map((p, i) => (
                <li key={i} className="flex gap-1.5 text-xs leading-4 text-neutral-600 dark:text-neutral-400">
                  <span className="text-red-500">✕</span>
                  <span className="min-w-0">{p}</span>
                </li>
              ))}
            </ul>
          )}
          {state.critique.fixes?.length > 0 && (
            <ul className="mt-2 flex flex-col gap-1">
              {state.critique.fixes.map((f, i) => (
                <li key={i} className="flex gap-1.5 text-xs leading-4 text-neutral-600 dark:text-neutral-400">
                  <span className="text-emerald-500">→</span>
                  <span className="min-w-0">{f}</span>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={run}
            className="mt-2 text-[11px] font-medium text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
          >
            Run again
          </button>
        </div>
      )}
    </div>
  )
}
