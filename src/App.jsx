import { useEffect, useState } from 'react'
import UploadStrip from './components/UploadStrip'
import ThumbCard from './components/ThumbCard'
import Toolbar from './components/Toolbar'
import PreviewCanvas from './components/preview/PreviewCanvas'
import { exampleThumbs } from './lib/examples'
import { manifestReady } from './lib/nicheLibrary'

const MAX_THUMBS = 3

// Primary view switcher — big, obvious, top-left.
function MainTab({ active, onClick, label, sub, icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
        active
          ? 'border-transparent bg-gradient-to-r from-[#ff0033] to-[#ff5f00] text-white shadow-lg shadow-red-500/25'
          : 'border-neutral-200 bg-white text-neutral-600 hover:-translate-y-px hover:border-red-300 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-red-500/50 dark:hover:text-neutral-100'
      }`}
    >
      {icon}
      <span>{label}</span>
      <span
        className={`hidden text-xs font-normal sm:block ${
          active ? 'text-red-100' : 'text-neutral-400 dark:text-neutral-600'
        }`}
      >
        {sub}
      </span>
    </button>
  )
}

export default function App() {
  // First load shows a built-in weak-vs-strong example, already scored.
  const [thumbs, setThumbs] = useState(exampleThumbs)
  // top-level view: scores front and center, or the YouTube context previews
  const [mainView, setMainView] = useState('feedback')
  const [view, setView] = useState('overview')
  const [device, setDevice] = useState('desktop')
  const [theme, setTheme] = useState('dark')
  const [squint, setSquint] = useState(false)
  const [niche, setNiche] = useState('mixed')
  // bump a render once the niche-image manifest has loaded
  const [, setManifestLoaded] = useState(false)
  useEffect(() => {
    manifestReady.then(() => setManifestLoaded(true))
  }, [])

  const addFiles = (fileList) => {
    const images = Array.from(fileList).filter((f) => f.type.startsWith('image/'))
    // A real upload replaces the example set entirely.
    const base = thumbs.some((t) => t.isExample) ? [] : thumbs
    const room = MAX_THUMBS - base.length
    const added = images.slice(0, room).map((f) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(f),
      title: '',
      channel: '',
    }))
    if (!added.length) return
    const next = [...base, ...added]
    setThumbs(next)
    if (view === 'compare' && next.length < 2) setView('overview')
  }

  const updateThumb = (id, patch) =>
    setThumbs((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))

  const removeThumb = (id) => {
    const t = thumbs.find((x) => x.id === id)
    if (t && !t.isExample) URL.revokeObjectURL(t.url)
    const next = thumbs.filter((x) => x.id !== id)
    setThumbs(next)
    if (view === 'compare' && next.length < 2) setView('overview')
  }

  const clearExamples = () => {
    setThumbs([])
    if (view === 'compare') setView('overview')
  }

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="relative min-h-screen bg-[#faf6f3] text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        {/* ambient color wash */}
        <div
          className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-40"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(600px 320px at 8% -4%, rgba(255,0,51,0.10), transparent 70%), radial-gradient(700px 380px at 96% 12%, rgba(255,95,0,0.08), transparent 70%), radial-gradient(800px 500px at 50% 110%, rgba(147,51,234,0.08), transparent 70%)',
          }}
        />
        <div className="relative">
        <div className="h-1 bg-gradient-to-r from-[#ff0033] via-[#ff5f00] to-[#ffb800]" />
        <header className="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 28 28" className="size-8 drop-shadow-[0_2px_6px_rgba(255,0,51,0.4)]" aria-hidden="true">
                <defs>
                  <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#ff0033" />
                    <stop offset="1" stopColor="#ff5f00" />
                  </linearGradient>
                </defs>
                <rect width="28" height="28" rx="7" fill="url(#logo-g)" />
                <path d="M11.5 8.5 20 14l-8.5 5.5z" fill="#fff" />
              </svg>
              <span className="bg-gradient-to-r from-[#ff0033] to-[#ff5f00] bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
                ThumbTest
              </span>
            </div>
            <p className="hidden text-sm text-neutral-500 sm:block dark:text-neutral-400">
              Score your YouTube thumbnails before you publish
            </p>
            <span className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-500/30">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-3.5" aria-hidden="true">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
              Private — images stay in your browser
            </span>
          </div>
        </header>

        <main className="mx-auto flex max-w-[1320px] flex-col gap-6 px-4 py-6 sm:px-6">
          <nav className="flex flex-wrap items-center gap-2" aria-label="Main view">
            <MainTab
              active={mainView === 'feedback'}
              onClick={() => setMainView('feedback')}
              label="Feedback"
              sub="scores & checks"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4.5" aria-hidden="true">
                  <path d="M12 21a9 9 0 1 1 9-9" strokeLinecap="round" />
                  <path d="m12 12 4.5-4.5" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
                </svg>
              }
            />
            <MainTab
              active={mainView === 'context'}
              onClick={() => setMainView('context')}
              label="Context"
              sub="inside YouTube"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4.5" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="3" />
                  <path d="m10.5 9.5 4 2.5-4 2.5z" fill="currentColor" stroke="none" />
                </svg>
              }
            />
          </nav>

          <UploadStrip thumbs={thumbs} addFiles={addFiles} clearExamples={clearExamples} />

          {mainView === 'feedback' ? (
            thumbs.length > 0 ? (
              <section className="flex flex-wrap items-start justify-center gap-6">
                {thumbs.map((t, i) => (
                  <ThumbCard
                    key={t.id}
                    thumb={t}
                    index={i}
                    count={thumbs.length}
                    updateThumb={updateThumb}
                    removeThumb={removeThumb}
                  />
                ))}
              </section>
            ) : (
              <section className="rounded-2xl border-2 border-dashed border-neutral-200 py-16 text-center dark:border-neutral-800">
                <p className="text-lg font-semibold text-neutral-500 dark:text-neutral-400">
                  Upload a thumbnail to get its score
                </p>
                <p className="mt-1 text-sm text-neutral-400 dark:text-neutral-500">
                  Contrast, mobile readability, edge safety, and aspect ratio — measured right
                  here in your browser.
                </p>
              </section>
            )
          ) : (
            <section className="mx-auto w-full max-w-[1160px]">
              <Toolbar
                view={view}
                setView={setView}
                device={device}
                setDevice={setDevice}
                theme={theme}
                setTheme={setTheme}
                squint={squint}
                setSquint={setSquint}
                niche={niche}
                setNiche={setNiche}
                compareEnabled={thumbs.length >= 2}
              />
              <PreviewCanvas
                view={view}
                device={device}
                thumbs={thumbs}
                squint={squint}
                niche={niche}
              />
            </section>
          )}
        </main>

        <footer className="pb-6 text-center text-xs text-neutral-500 dark:text-neutral-500">
          ThumbTest runs fully in your browser with local images — yours are only sent anywhere
          if you explicitly request an AI critique. Not affiliated with YouTube.
        </footer>
        </div>
      </div>
    </div>
  )
}
