import { useState } from 'react'

const KEY = 'thumbtest-intro-bubble-dismissed'

function isDismissed() {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

// One-time animated speech bubble pointing down at the replicated feed.
// Dismissed with the ×, it stays closed for the rest of the session.
export default function IntroBubble() {
  const [dismissed, setDismissed] = useState(isDismissed)

  if (dismissed) return null

  const close = () => {
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {
      /* storage blocked — dismiss for this render only */
    }
    setDismissed(true)
  }

  return (
    <div className="bubble-in relative z-10 mx-auto mb-4 w-fit max-w-md">
      <div className="relative rounded-2xl bg-gradient-to-r from-[#ff0033] to-[#ff5f00] py-3 pr-10 pl-4 text-sm leading-5 font-medium text-white shadow-lg shadow-red-500/30">
        Your thumbnails show up inside a replicated YouTube feed so you can see them in context.
        <button
          type="button"
          onClick={close}
          aria-label="Dismiss"
          className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/20 hover:text-white"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="size-3.5" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>
        {/* tail pointing down at the feed */}
        <div className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 bg-[#ff3d1a]" />
      </div>
    </div>
  )
}
