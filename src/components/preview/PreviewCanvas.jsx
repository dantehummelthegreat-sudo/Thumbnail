import { DesktopHeader, MobileHeader, PhoneFrame } from './parts'
import { SquintContext } from './SquintContext'
import { NicheContext } from './NicheContext'
import SearchView from './SearchView'
import HomeView from './HomeView'
import SidebarView from './SidebarView'
import CompareView from './CompareView'
import OverviewView from './OverviewView'

export default function PreviewCanvas({ view, device, thumbs, squint, niche = 'mixed' }) {
  // Compare and Overview render their own fixed layouts; the device toggle
  // only applies to the single-layout views.
  const mobile = device === 'mobile' && view !== 'compare' && view !== 'overview'
  const searchQuery =
    view === 'search' || view === 'overview'
      ? thumbs[0]?.title.trim() || 'your video topic'
      : ''

  const content =
    view === 'overview' ? (
      <OverviewView thumbs={thumbs} />
    ) : view === 'search' ? (
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
      <NicheContext.Provider value={niche}>
        <SquintContext.Provider value={squint}>
          <div className="py-6">
            <PhoneFrame>
              <MobileHeader />
              {content}
            </PhoneFrame>
          </div>
        </SquintContext.Provider>
      </NicheContext.Provider>
    )
  }

  return (
    <NicheContext.Provider value={niche}>
      <SquintContext.Provider value={squint}>
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-[#0f0f0f]">
          {view !== 'compare' && <DesktopHeader query={searchQuery} />}
          <div className="p-4 sm:p-6">{content}</div>
        </div>
      </SquintContext.Provider>
    </NicheContext.Provider>
  )
}
