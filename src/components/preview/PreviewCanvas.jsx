import { DesktopHeader, MobileHeader } from './parts'
import SearchView from './SearchView'
import HomeView from './HomeView'
import SidebarView from './SidebarView'
import CompareView from './CompareView'

export default function PreviewCanvas({ view, device, thumbs }) {
  const mobile = device === 'mobile' && view !== 'compare'
  const searchQuery =
    view === 'search' ? thumbs[0]?.title.trim() || 'your video topic' : ''

  const content =
    view === 'search' ? (
      <SearchView thumbs={thumbs} mobile={mobile} />
    ) : view === 'sidebar' ? (
      <SidebarView thumbs={thumbs} mobile={mobile} />
    ) : view === 'compare' ? (
      <CompareView thumbs={thumbs} />
    ) : (
      <HomeView thumbs={thumbs} mobile={mobile} />
    )

  if (mobile) {
    return (
      <div className="flex justify-center py-6">
        <div className="w-[375px] max-w-full overflow-hidden rounded-[36px] border-8 border-neutral-900 bg-white shadow-2xl dark:border-neutral-700 dark:bg-[#0f0f0f]">
          <div className="phone-scroll h-[700px] overflow-y-auto overscroll-contain">
            <MobileHeader />
            {content}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-[#0f0f0f]">
      {view !== 'compare' && <DesktopHeader query={searchQuery} />}
      <div className="p-4 sm:p-6">{content}</div>
    </div>
  )
}
