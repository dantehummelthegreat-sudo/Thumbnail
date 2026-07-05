import { buildFeed } from '../../lib/placeholders'
import { Thumb, Avatar } from './parts'
import { MobileFeed } from './HomeView'

export default function SearchView({ thumbs, mobile }) {
  const items = buildFeed(thumbs, { count: 8, start: 1, gap: 3 })

  if (mobile) return <MobileFeed items={items} />

  return (
    <div className="mx-auto flex max-w-[1100px] flex-col gap-4">
      {items.map((item) => (
        <div key={item.key} className="flex gap-4">
          <div className="w-[42%] max-w-[500px] min-w-[200px] shrink-0">
            <Thumb item={item} rounded="rounded-xl" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-lg leading-6 font-normal text-neutral-900 dark:text-neutral-50">
              {item.title}
            </h3>
            <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
              {item.meta}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Avatar item={item} sizeClass="size-6" />
              <span className="truncate text-xs text-neutral-600 dark:text-neutral-400">
                {item.channel}
              </span>
            </div>
            <p className="mt-2 hidden text-xs text-neutral-600 sm:line-clamp-2 dark:text-neutral-400">
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
