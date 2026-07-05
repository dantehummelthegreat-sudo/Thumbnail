import { useRef, useState } from 'react'
import { versionLetter } from '../lib/placeholders'

const MAX_THUMBS = 3

export default function UploadPanel({ thumbs, addFiles, updateThumb, removeThumb }) {
  const inputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)
  const full = thumbs.length >= MAX_THUMBS

  const onDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    if (!full) addFiles(e.dataTransfer.files)
  }

  return (
    <aside className="self-start lg:sticky lg:top-6">
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
        className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          full
            ? 'cursor-default border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900'
            : dragActive
              ? 'cursor-pointer border-red-500 bg-red-50 dark:bg-red-950/30'
              : 'cursor-pointer border-neutral-300 bg-white hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-500'
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-8 text-neutral-400" aria-hidden="true">
          <path d="M12 16V4m0 0 4 4m-4-4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" strokeLinecap="round" />
        </svg>
        {full ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Maximum of {MAX_THUMBS} thumbnails — remove one to add another
          </p>
        ) : (
          <>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              Drop up to {MAX_THUMBS} thumbnails here
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

      {thumbs.length > 0 && (
        <div className="mt-4 flex flex-col gap-3">
          {thumbs.map((t, i) => (
            <div
              key={t.id}
              className="flex gap-3 rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="relative w-24 shrink-0 self-start sm:w-28">
                <img
                  src={t.url}
                  alt={`Thumbnail version ${versionLetter(i)}`}
                  className="aspect-video w-full rounded-lg object-cover"
                />
                {thumbs.length > 1 && (
                  <span className="absolute top-1 left-1 rounded bg-black/80 px-1.5 py-px text-[10px] font-bold text-white">
                    {versionLetter(i)}
                  </span>
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <input
                  type="text"
                  value={t.title}
                  maxLength={100}
                  onChange={(e) => updateThumb(t.id, { title: e.target.value })}
                  placeholder="Video title"
                  className="w-full rounded-md border border-neutral-200 bg-transparent px-2 py-1.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none dark:border-neutral-700 dark:text-neutral-100 dark:focus:border-neutral-500"
                />
                <input
                  type="text"
                  value={t.channel}
                  maxLength={50}
                  onChange={(e) => updateThumb(t.id, { channel: e.target.value })}
                  placeholder="Channel name"
                  className="w-full rounded-md border border-neutral-200 bg-transparent px-2 py-1.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none dark:border-neutral-700 dark:text-neutral-100 dark:focus:border-neutral-500"
                />
              </div>
              <button
                type="button"
                onClick={() => removeThumb(t.id)}
                title="Remove thumbnail"
                className="self-start rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-red-600 dark:hover:bg-neutral-800"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4" aria-hidden="true">
                  <path d="M4 7h16M10 11v6m4-6v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
        Images are cropped to 16:9, exactly like on YouTube. Everything stays in
        your browser — nothing is uploaded to any server.
      </p>
    </aside>
  )
}
