import { buildFeed } from '../../lib/placeholders'
import { ChipRow, MobileHeader, PhoneFrame } from './parts'
import { SearchRow } from './SearchView'
import { HomeCard, MobileFeed } from './HomeView'
import { CompactRow } from './SidebarView'

function Section({ title, children }) {
  return (
    <section>
      <h3 className="mb-3 text-[11px] font-bold tracking-widest text-neutral-400 uppercase dark:text-neutral-500">
        {title}
      </h3>
      {children}
    </section>
  )
}

// Every layout on one scrollable page. Uploads sit adjacent (gap 1) so the
// sections stay short.
export default function OverviewView({ thumbs }) {
  const n = Math.max(1, thumbs.length)
  const searchItems = buildFeed(thumbs, { count: n + 2, start: 1, gap: 1 })
  const gridItems = buildFeed(thumbs, { count: Math.max(6, n + 3), start: 1, gap: 1 })
  const sidebarItems = buildFeed(thumbs, { count: n + 3, start: 1, gap: 1 })
  const mobileItems = buildFeed(thumbs, { count: n + 1, start: 1, gap: 1 })

  return (
    <div className="flex flex-col gap-10">
      <Section title="Home grid">
        <ChipRow />
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
          {gridItems.map((item) => (
            <HomeCard key={item.key} item={item} />
          ))}
        </div>
      </Section>

      <Section title="Search results">
        <div className="flex max-w-[1100px] flex-col gap-4">
          {searchItems.map((item) => (
            <SearchRow key={item.key} item={item} />
          ))}
        </div>
      </Section>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Section title="Up next sidebar">
          <div className="flex max-w-[420px] flex-col gap-2">
            {sidebarItems.map((item) => (
              <CompactRow key={item.key} item={item} />
            ))}
          </div>
        </Section>

        <Section title="Mobile feed">
          <PhoneFrame height="h-[560px]">
            <MobileHeader />
            <MobileFeed items={mobileItems} />
          </PhoneFrame>
        </Section>
      </div>
    </div>
  )
}
