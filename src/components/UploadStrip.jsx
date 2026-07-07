import { useRef, useState } from 'react'

const MAX_THUMBS = 3

// Wide dropzone strip at the top of the page, with the example banner when the
// built-in example set is showing.
export default function UploadStrip({ thumbs, addFiles, clearExamples }) {
  const inputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)
  const hasExamples = thumbs.some((t) => t.isExample)
  // uploading always works while examples show — they get replaced
  const full = !hasExamples && thumbs.length >= MAX_THUMBS

  const onDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    if (!full) addFiles(e.dataTransfer.files)
  }

  return (
    <section>
      {hasExamples && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 dark:border-amber-500/40 dark:bg-amber-950/30">
          <p className="text-sm leading-5 text-amber-800 dark:text-amber-200">
            <span className="font-semibold">This is a built-in example</span> — a weak thumbnail
            next to a strong one, already scored. Upload your own to replace it.
          </p>
          <button
            type="button"
            onClick={clearExamples}
            className="shrink-0 rounded-full bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700"
          >
            Clear example — upload my own
          </button>
        </div>
      )}

      <div
        role="button"
        tabIndex={0}
        onClick={() => !full && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !full) inputRef.current?.click()
        }}
        onDragOver={(e) => {
          e.preventDefault()
          if (!full) setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={`flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-xl border-2 border-dashed px-6 py-5 text-center transition-colors ${
          full
            ? 'cursor-default border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900'
            : dragActive
              ? 'cursor-pointer border-red-500 bg-red-50 dark:bg-red-950/30'
              : 'cursor-pointer border-neutral-300 bg-white hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-500'
        }`}
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-red-50 text-[#ff0033] dark:bg-red-500/10 dark:text-red-400">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5" aria-hidden="true">
            <path d="M12 16V4m0 0 4 4m-4-4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" strokeLinecap="round" />
          </svg>
        </span>
        {full ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Maximum of {MAX_THUMBS} thumbnails — remove one to add another
          </p>
        ) : (
          <>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {hasExamples
                ? 'Drop your own thumbnails here'
                : `Drop up to ${MAX_THUMBS} thumbnails here`}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              or click to browse · PNG / JPG / WebP · 1280×720 works best
            </p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      <p className="mt-2 text-center text-xs text-neutral-500 dark:text-neutral-400">
        Images are cropped to 16:9, exactly like on YouTube. Your images stay in your browser
        (only an explicit AI critique sends one) — the surrounding feed shows real public
        thumbnails loaded straight from YouTube.
      </p>
    </section>
  )
}
