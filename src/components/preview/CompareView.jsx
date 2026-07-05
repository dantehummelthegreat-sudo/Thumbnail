import { userItem, versionLetter } from '../../lib/placeholders'
import { Thumb, Avatar } from './parts'

// Side-by-side A/B of every uploaded version, at feed size and up-next size.
export default function CompareView({ thumbs }) {
  const cols = thumbs.length === 3 ? 'lg:grid-cols-3' : ''

  return (
    <div className={`grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 ${cols}`}>
      {thumbs.map((t, i) => {
        const item = userItem(t, i, false)
        return (
          <div key={t.id} className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded bg-neutral-900 px-1.5 py-0.5 text-[11px] font-bold tracking-wide text-white dark:bg-neutral-100 dark:text-black">
                VERSION {versionLetter(i)}
              </span>
            </div>
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
            <div className="mt-5 border-t border-neutral-200 pt-3 dark:border-neutral-800">
              <div className="mb-2 text-[11px] font-medium tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
                Up-next size
              </div>
              <div className="flex max-w-[360px] gap-2">
                <div className="w-[168px] shrink-0">
                  <Thumb item={item} rounded="rounded-lg" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="line-clamp-2 text-sm leading-5 font-medium text-neutral-900 dark:text-neutral-50">
                    {item.title}
                  </h4>
                  <div className="mt-1 truncate text-xs text-neutral-600 dark:text-neutral-400">
                    {item.channel}
                  </div>
                  <div className="truncate text-xs text-neutral-600 dark:text-neutral-400">
                    {item.meta}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
