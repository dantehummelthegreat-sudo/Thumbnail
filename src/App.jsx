import { useState } from 'react'
import UploadPanel from './components/UploadPanel'
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
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 28 28" className="size-7" aria-hidden="true">
                <rect width="28" height="28" rx="7" fill="#FF0033" />
                <path d="M11.5 8.5 20 14l-8.5 5.5z" fill="#fff" />
              </svg>
              <span className="text-xl font-bold tracking-tight">ThumbTest</span>
            </div>
            <p className="hidden text-sm text-neutral-500 sm:block dark:text-neutral-400">
              Preview your YouTube thumbnails before you publish
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

        <main className="mx-auto grid max-w-[1440px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <UploadPanel
            thumbs={thumbs}
            addFiles={addFiles}
            updateThumb={updateThumb}
            removeThumb={removeThumb}
            clearExamples={clearExamples}
          />
          <section className="min-w-0">
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
