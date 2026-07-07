// Shared building blocks for the YouTube preview layouts.
import { useSquint } from './SquintContext'

export function PhoneFrame({ children, height = 'h-[700px]' }) {
  return (
    <div className="flex justify-center">
      <div className="w-[375px] max-w-full overflow-hidden rounded-[36px] border-8 border-neutral-900 bg-white shadow-2xl dark:border-neutral-700 dark:bg-[#0f0f0f]">
        <div className={`phone-scroll overflow-y-auto overscroll-contain ${height}`}>
          {children}
        </div>
      </div>
    </div>
  )
}

export function Thumb({ item, rounded = 'rounded-xl', className = '' }) {
  const squint = useSquint()
  if (item.kind === 'empty') {
    return (
      <div
        className={`relative flex aspect-video items-center justify-center ${rounded} border-2 border-dashed border-neutral-300 dark:border-neutral-700 ${className}`}
      >
        <span className="px-2 text-center text-xs text-neutral-400 dark:text-neutral-500">
          Your thumbnail
        </span>
      </div>
    )
  }
  return (
    <div
      className={`relative aspect-video overflow-hidden ${rounded} bg-neutral-200 dark:bg-neutral-800 ${className}`}
    >
      {item.url && (
        <img
          src={item.url}
          alt=""
          loading="lazy"
          onError={(e) => {
            // hot-linked thumbnail unavailable (offline / video gone) →
            // fall back to the bundled generated placeholder
            if (item.fallback && !e.currentTarget.src.endsWith(item.fallback)) {
              e.currentTarget.src = item.fallback
            }
          }}
          className={`absolute inset-0 h-full w-full object-cover ${
            squint ? 'scale-110 blur-[7px]' : ''
          }`}
        />
      )}
      {item.duration && (
        <span className="absolute right-1 bottom-1 rounded bg-black/80 px-1 py-px text-[11px] font-medium text-white">
          {item.duration}
        </span>
      )}
      {item.badge && (
        <span className="absolute top-1 left-1 rounded bg-black/80 px-1.5 py-px text-[10px] font-bold tracking-wide text-white">
          {item.badge}
        </span>
      )}
    </div>
  )
}

export function Avatar({ item, sizeClass = 'size-9' }) {
  if (item.kind === 'user' || item.kind === 'empty') {
    const color = item.avatarClass || 'bg-red-600'
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-full ${sizeClass} ${color}`}
      >
        <span className="text-xs font-medium text-white">
          {item.channel.trim().charAt(0).toUpperCase() || 'Y'}
        </span>
      </div>
    )
  }
  return (
    <div
      className={`shrink-0 rounded-full bg-neutral-300 dark:bg-neutral-700 ${sizeClass}`}
    />
  )
}

export function ChipRow() {
  const chips = ['All', 'Music', 'Gaming', 'Live', 'Podcasts', 'Cooking', 'Recently uploaded']
  return (
    <div className="mb-4 flex gap-2 overflow-hidden">
      {chips.map((c, i) => (
        <span
          key={c}
          className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap ${
            i === 0
              ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black'
              : 'bg-neutral-100 text-neutral-900 dark:bg-[#272727] dark:text-neutral-100'
          }`}
        >
          {c}
        </span>
      ))}
    </div>
  )
}

export function YtLogo() {
  return (
    <div className="flex items-center gap-1">
      <svg viewBox="0 0 28 20" className="h-5 w-auto" aria-hidden="true">
        <rect width="28" height="20" rx="4.5" fill="#FF0033" />
        <path d="M11.2 5.8 18.8 10l-7.6 4.2z" fill="#fff" />
      </svg>
      <span className="text-lg font-semibold tracking-tighter text-neutral-900 dark:text-neutral-50">
        YouTube
      </span>
    </div>
  )
}

function IconSearch({ className = 'size-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.8-3.8" strokeLinecap="round" />
    </svg>
  )
}

export function DesktopHeader({ query }) {
  return (
    <div className="flex h-14 items-center justify-between gap-4 border-b border-neutral-200 bg-white px-4 dark:border-neutral-800 dark:bg-[#0f0f0f]">
      <div className="flex shrink-0 items-center gap-4">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-6 text-neutral-900 dark:text-neutral-100" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
        </svg>
        <YtLogo />
      </div>
      <div className="hidden min-w-0 flex-1 items-center justify-center sm:flex">
        <div className="flex h-10 w-full max-w-[540px] min-w-0 items-center overflow-hidden rounded-full border border-neutral-300 dark:border-neutral-700">
          <span className="min-w-0 flex-1 truncate px-4 text-sm text-neutral-900 dark:text-neutral-100">
            {query || <span className="text-neutral-400 dark:text-neutral-500">Search</span>}
          </span>
          <span className="flex h-full w-14 shrink-0 items-center justify-center border-l border-neutral-300 bg-neutral-50 text-neutral-700 dark:border-neutral-700 dark:bg-[#222222] dark:text-neutral-200">
            <IconSearch />
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-6 text-neutral-900 dark:text-neutral-100" aria-hidden="true">
          <path d="M6 8a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7" />
          <path d="M10 19a2 2 0 0 0 4 0" strokeLinecap="round" />
        </svg>
        <div className="flex size-8 items-center justify-center rounded-full bg-purple-700">
          <span className="text-sm font-medium text-white">T</span>
        </div>
      </div>
    </div>
  )
}

export function MobileHeader() {
  return (
    <div className="flex h-12 items-center justify-between bg-white px-4 dark:bg-[#0f0f0f]">
      <YtLogo />
      <div className="flex items-center gap-5 text-neutral-900 dark:text-neutral-100">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-5" aria-hidden="true">
          <path d="M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-7" />
          <path d="M2 12a8 8 0 0 1 8 8M2 16a4 4 0 0 1 4 4M2 20h.01" strokeLinecap="round" />
        </svg>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-5" aria-hidden="true">
          <path d="M6 8a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7" />
          <path d="M10 19a2 2 0 0 0 4 0" strokeLinecap="round" />
        </svg>
        <IconSearch className="size-5" />
        <div className="flex size-6 items-center justify-center rounded-full bg-purple-700">
          <span className="text-[10px] font-medium text-white">T</span>
        </div>
      </div>
    </div>
  )
}
