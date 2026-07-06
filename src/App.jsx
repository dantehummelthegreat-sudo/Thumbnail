import { useState } from 'react'
import UploadStrip from './components/UploadStrip'
import ThumbCard from './components/ThumbCard'
import Toolbar from './components/Toolbar'
import PreviewCanvas from './components/preview/PreviewCanvas'
import { exampleThumbs } from './lib/examples'

const MAX_THUMBS = 3

export default function App() {
  // First load shows a built-in weak-vs-strong example, already scored.
  const [thumbs, setThumbs] = useState(exampleThumbs)
  const [view, setView] = useState('overview')
  const [device, setDevice] = useState('desktop')
  const [theme, setTheme] = useState('dark')
  const [squint, setSquint] = useState(false)
  const [contextOpen, setContextOpen] = useState(true)

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
      <div className="min-h-screen bg-neutral-100 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <header className="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 28 28" className="size-7" aria-hidden="true">
                <rect width="28" height="28" rx="7" fill="#FF0033" />
                <path d="M11.5 8.5 20 14l-8.5 5.5z" fill="#fff" />
              </svg>
              <span className="text-xl font-bold tracking-tight">ThumbTest</span>
            </div>
            <p className="hidden text-sm text-neutral-500 sm:block dark:text-neutral-400">
              Score your YouTube thumbnails before you publish
            </p>
            <span className="ml-auto flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-3.5" aria-hidden="true">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
              Private — images stay in your browser
            </span>
          </div>
        </header>

        <main className="mx-auto flex max-w-[1320px] flex-col gap-8 px-4 py-6 sm:px-6">
          <UploadStrip thumbs={thumbs} addFiles={addFiles} clearExamples={clearExamples} />

          {thumbs.length > 0 ? (
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
                Contrast, mobile readability, edge safety, and aspect ratio — measured right here
                in your browser.
              </p>
            </section>
          )}

          <section>
            <button
              type="button"
              onClick={() => setContextOpen(!contextOpen)}
              aria-expanded={contextOpen}
              className="flex w-full items-center gap-2 text-left"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`size-4 text-neutral-400 transition-transform ${contextOpen ? 'rotate-90' : ''}`}
                aria-hidden="true"
              >
                <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-sm font-bold tracking-widest text-neutral-400 uppercase dark:text-neutral-500">
                See it in context
              </span>
              <span className="hidden text-xs text-neutral-400 sm:block dark:text-neutral-600">
                — how it looks inside YouTube: home, search, up next, mobile
              </span>
            </button>

            {contextOpen && (
              <div className="mx-auto mt-4 w-full max-w-[1080px]">
                <Toolbar
                  view={view}
                  setView={setView}
                  device={device}
                  setDevice={setDevice}
                  theme={theme}
                  setTheme={setTheme}
                  squint={squint}
                  setSquint={setSquint}
                  compareEnabled={thumbs.length >= 2}
                />
                <PreviewCanvas view={view} device={device} thumbs={thumbs} squint={squint} />
              </div>
            )}
          </section>
        </main>

        <footer className="pb-6 text-center text-xs text-neutral-500 dark:text-neutral-500">
          ThumbTest runs in your browser — images are only sent anywhere if you explicitly request
          an AI critique. Not affiliated with YouTube.
        </footer>
      </div>
    </div>
  )
}
