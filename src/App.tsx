import { useEffect, useMemo, useRef, useState } from 'react'
import { EVENTS } from './data'
import {
  type GroupBy,
  getFormat,
  getPriority,
  getTrack,
} from './types'
import { Board } from './components/Board'
import {
  FiltersPanel,
  EMPTY_FILTERS,
  hasActiveFilters,
  type Filters,
} from './components/FiltersPanel'
import { TabSwitcher } from './components/TabSwitcher'
import { Gate, isAuthed } from './components/Gate'
import { DesktopTopbar } from './components/Topbar'
import { MobileView } from './components/MobileView'
import { exportElementToPdf } from './utils/pdf'

const FILE_NAMES: Record<GroupBy, string> = {
  speaker: 'agip-report-speakers.pdf',
  priority: 'agip-report-priorities.pdf',
  track: 'agip-report-goals.pdf',
}
const PDF_LABEL: Record<GroupBy, string> = {
  speaker: 'По спикерам',
  priority: 'По приоритетам',
  track: 'По целям',
}
const PDF_SHORT: Record<GroupBy, string> = {
  speaker: 'Спикеры',
  priority: 'Приоритеты',
  track: 'Цели',
}

function useIsMobile(): boolean {
  const get = () => (typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  const [isMobile, setIsMobile] = useState(get)
  useEffect(() => {
    const handler = () => setIsMobile(get())
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

export default function App() {
  const [authed, setAuthed] = useState(isAuthed())
  const [tab, setTab] = useState<GroupBy>('speaker')
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [collapsed, setCollapsed] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [search, setSearch] = useState('')
  const boardRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return EVENTS.filter((ev) => {
      if (ev.date === null) {
        if (!filters.includeNoDate) return false
      } else {
        if (filters.dateFrom && ev.date < filters.dateFrom) return false
        if (filters.dateTo && ev.date > filters.dateTo) return false
      }
      if (filters.speakers.length && !filters.speakers.includes(ev.speakerId))
        return false
      const priority = getPriority(ev)
      if (filters.priorities.length && (!priority || !filters.priorities.includes(priority)))
        return false
      const track = getTrack(ev)
      if (filters.tracks.length && (!track || !filters.tracks.includes(track)))
        return false
      const format = getFormat(ev)
      if (filters.formats.length && (!format || !filters.formats.includes(format)))
        return false
      if (filters.ministries.length && !filters.ministries.includes(ev.ministry))
        return false
      if (filters.authors.length && !filters.authors.includes(ev.author))
        return false
      if (q) {
        const hay = `${ev.title} ${ev.goal} ${ev.ministry} ${ev.author}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [filters, search])

  async function handleExport() {
    if (!boardRef.current || exporting) return
    setExporting(true)
    try {
      await exportElementToPdf(boardRef.current, FILE_NAMES[tab])
    } catch (err) {
      console.error('PDF export failed', err)
      alert('Не удалось сформировать PDF. Попробуйте ещё раз.')
    } finally {
      setExporting(false)
    }
  }

  if (!authed) return <Gate onPass={() => setAuthed(true)} />

  if (isMobile) {
    return (
      <>
        <MobileView
          tab={tab}
          setTab={setTab}
          events={filtered}
          filters={filters}
          setFilters={setFilters}
          onExport={handleExport}
          exporting={exporting}
          pdfShort={PDF_SHORT[tab]}
        />
        {/* Hidden board for PDF capture on mobile */}
        <div
          className="fixed -left-[10000px] top-0 pointer-events-none"
          aria-hidden
        >
          <div className="bg-[var(--bg)]" style={{ width: 1400 }}>
            <Board
              ref={boardRef}
              events={filtered}
              groupBy={tab}
              hideEmpty={hasActiveFilters(filters)}
            />
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="h-dvh flex flex-col bg-[var(--bg)]">
      <DesktopTopbar
        onExport={handleExport}
        exporting={exporting}
        pdfLabel={PDF_LABEL[tab]}
        pdfShort={PDF_SHORT[tab]}
        search={search}
        onSearch={setSearch}
        count={filtered.length}
        total={EVENTS.length}
      />

      <div className="shrink-0 px-6 pt-3 border-b border-[var(--border)]">
        <TabSwitcher active={tab} onChange={setTab} />
      </div>

      <div className="flex-1 min-h-0 flex">
        <FiltersPanel
          filters={filters}
          onChange={setFilters}
          total={EVENTS.length}
          visible={filtered.length}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
        />
        <Board
          ref={boardRef}
          events={filtered}
          groupBy={tab}
          hideEmpty={hasActiveFilters(filters) || !!search}
        />
      </div>
    </div>
  )
}
