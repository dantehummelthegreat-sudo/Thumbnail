import { buildFeed } from '../../lib/placeholders'
import { Thumb, Avatar, ChipRow } from './parts'

// Stacked full-width cards, shared by the mobile home feed and mobile search.
export function MobileFeed({ items, chips = false }) {
  return (
    <div>
      {chips && (
        <div className="px-3 pt-2">
          <ChipRow />
        </div>
      )}
      <div className="flex flex-col gap-4 px-2 pb-4">
        {items.map((item) => (
          <div key={item.key}>
            <Thumb item={item} rounded="rounded-xl" />
            <div className="mt-2 flex gap-3 px-1">
              <Avatar item={item} sizeClass="size-9" />
              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 text-sm leading-5 font-medium text-neutral-900 dark:text-neutral-50">
                  {item.title}
                </h3>
                <div className="mt-0.5 truncate text-xs text-neutral-600 dark:text-neutral-400">
                  {item.channel} · {item.meta.replace(' • ', ' · ')}
                </div>
              </div>
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 shrink-0 text-neutral-600 dark:text-neutral-400" aria-hidden="true">
                <circle cx="12" cy="5" r="1.6" />
                <circle cx="12" cy="12" r="1.6" />
                <circle cx="12" cy="19" r="1.6" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function HomeCard({ item }) {
  return (
    <div>
      <Thumb item={item} rounded="rounded-xl" />
      <div className="mt-3 flex gap-3">
        <Avatar item={item} sizeClass="size-9" />
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-base leading-[22px] font-medium text-neutral-900 dark:text-neutral-50">
            {item.title}
          </h3>
          <div className="mt-1 truncate text-sm text-neutral-600 dark:text-neutral-400">
            {item.channel}
          </div>
          <div className="truncate text-sm text-neutral-600 dark:text-neutral-400">
            {item.meta}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomeView({ thumbs, mobile }) {
  const items = buildFeed(thumbs, { count: 12, start: 1, gap: 4 })

  if (mobile) return <MobileFeed items={items} chips />

  return (
    <div>
      <ChipRow />
      <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <HomeCard key={item.key} item={item} />
        ))}
      </div>
    </div>
  )
}
