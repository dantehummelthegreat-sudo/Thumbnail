import { buildFeed } from '../../lib/placeholders'
import { Thumb } from './parts'
import { useNiche } from './NicheContext'

function PlayerPlaceholder({ mobile }) {
  return (
    <div
      className={`relative flex aspect-video items-center justify-center bg-neutral-800 dark:bg-black ${
        mobile ? '' : 'overflow-hidden rounded-xl'
      }`}
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-white/15">
        <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 size-7 text-white" aria-hidden="true">
          <path d="M8 5.5v13l11-6.5z" />
        </svg>
      </div>
    </div>
  )
}

export function CompactRow({ item }) {
  return (
    <div className="flex gap-2">
      <div className="w-[168px] shrink-0">
        <Thumb item={item} rounded="rounded-lg" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-sm leading-5 font-medium text-neutral-900 dark:text-neutral-50">
          {item.title}
        </h3>
        <div className="mt-1 truncate text-xs text-neutral-600 dark:text-neutral-400">
          {item.channel}
        </div>
        <div className="truncate text-xs text-neutral-600 dark:text-neutral-400">
          {item.meta}
        </div>
      </div>
    </div>
  )
}

function WatchingInfo() {
  return (
    <div>
      <h2 className="mt-3 line-clamp-2 text-lg leading-6 font-bold text-neutral-900 sm:text-xl sm:leading-7 dark:text-neutral-50">
        The video your viewer is watching right now
      </h2>
      <div className="mt-3 flex items-center gap-3">
        <div className="size-10 shrink-0 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-50">
            Some Other Channel
          </div>
          <div className="text-xs text-neutral-600 dark:text-neutral-400">1.2M subscribers</div>
        </div>
        <span className="shrink-0 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-black">
          Subscribe
        </span>
      </div>
    </div>
  )
}

export default function SidebarView({ thumbs, mobile }) {
  const niche = useNiche()
  const items = buildFeed(thumbs, { count: 10, start: 1, gap: 3, niche })

  if (mobile) {
    return (
      <div>
        <PlayerPlaceholder mobile />
        <div className="px-3 pb-4">
          <WatchingInfo />
          <div className="mt-4 flex flex-col gap-2 border-t border-neutral-200 pt-3 dark:border-neutral-800">
            {items.map((item) => (
              <CompactRow key={item.key} item={item} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-[1280px] gap-6">
      <div className="min-w-0 flex-1">
        <PlayerPlaceholder />
        <WatchingInfo />
      </div>
      <div className="w-[300px] shrink-0 lg:w-[402px]">
        <div className="mb-2 text-base font-bold text-neutral-900 dark:text-neutral-50">Up next</div>
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <CompactRow key={item.key} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}
