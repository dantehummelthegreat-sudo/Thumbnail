import { useState } from 'react'
import { NICHES } from '../lib/nicheLibrary'

// Dropdown that picks which niche's images fill the surrounding feed.
function NicheSelect({ niche, setNiche }) {
  const [open, setOpen] = useState(false)
  const current = NICHES.find((n) => n.id === niche) ?? NICHES[0]

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        title="Fill the surrounding feed with thumbnails from a specific niche"
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
          niche !== 'mixed'
            ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-fuchsia-500/25'
            : 'bg-neutral-200/80 text-neutral-600 hover:text-neutral-900 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100'
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4" aria-hidden="true">
          <path d="M4 5h16M7 12h10m-7 7h4" strokeLinecap="round" />
        </svg>
        <span className="max-w-40 truncate">
          Niche: {niche === 'mixed' ? 'Mixed' : current.label}
        </span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`size-3.5 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true">
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close niche menu"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 z-20 mt-2 max-h-80 w-60 overflow-y-auto rounded-xl border border-neutral-200 bg-white p-1.5 shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
            {NICHES.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => {
                  setNiche(n.id)
                  setOpen(false)
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-sm ${
                  n.id === niche
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 font-semibold text-white'
                    : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                }`}
              >
                {n.label}
                {n.id === niche && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="size-4" aria-hidden="true">
                    <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const VIEWS = [
  { id: 'overview', label: 'Overview' },
  { id: 'home', label: 'Home' },
  { id: 'search', label: 'Search' },
  { id: 'sidebar', label: 'Up next' },
  { id: 'compare', label: 'Compare' },
]

function Segmented({ options, value, onChange, accent = false }) {
  const activeClass = accent
    ? 'bg-gradient-to-r from-[#ff0033] to-[#ff5f00] text-white shadow-md shadow-red-500/25'
    : 'bg-white text-neutral-900 shadow dark:bg-neutral-950 dark:text-neutral-50'
  return (
    <div className="flex rounded-full bg-neutral-200/80 p-1 dark:bg-neutral-800">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => !opt.disabled && onChange(opt.id)}
          disabled={opt.disabled}
          title={opt.hint}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            value === opt.id
              ? activeClass
              : opt.disabled
                ? 'cursor-not-allowed text-neutral-400 dark:text-neutral-600'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export default function Toolbar({
  view,
  setView,
  device,
  setDevice,
  theme,
  setTheme,
  squint,
  setSquint,
  niche,
  setNiche,
  compareEnabled,
}) {
  // Overview shows both devices at once; Compare is desktop-only.
  const deviceLocked = view === 'compare' || view === 'overview'

  return (
    <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-3">
      <Segmented
        accent
        value={view}
        onChange={setView}
        options={VIEWS.map((v) =>
          v.id === 'compare'
            ? {
                ...v,
                disabled: !compareEnabled,
                hint: compareEnabled ? undefined : 'Upload 2+ thumbnails to compare',
              }
            : v,
        )}
      />
      <NicheSelect niche={niche} setNiche={setNiche} />
      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          onClick={() => setSquint(!squint)}
          aria-pressed={squint}
          title="Blurs every thumbnail to simulate a split-second glance from the corner of the eye — if yours still reads, it's strong."
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            squint
              ? 'bg-gradient-to-r from-[#ff0033] to-[#ff5f00] text-white shadow-md shadow-red-500/25'
              : 'bg-neutral-200/80 text-neutral-600 hover:text-neutral-900 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100'
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4" aria-hidden="true">
            <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
            <circle cx="12" cy="12" r="2.5" />
          </svg>
          Squint test
        </button>
        <Segmented
          value={deviceLocked ? 'desktop' : device}
          onChange={setDevice}
          options={[
            { id: 'desktop', label: 'Desktop', disabled: deviceLocked },
            {
              id: 'mobile',
              label: 'Mobile',
              disabled: deviceLocked,
              hint: deviceLocked
                ? view === 'overview'
                  ? 'Overview already shows mobile'
                  : 'Compare is desktop-only'
                : undefined,
            },
          ]}
        />
        <button
          type="button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex size-9 items-center justify-center rounded-full bg-neutral-200 text-neutral-700 hover:text-neutral-900 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5" aria-hidden="true">
              <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
