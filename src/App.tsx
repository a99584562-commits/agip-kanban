import { useMemo, useRef, useState } from 'react'
import { EVENTS } from './data'
import type { GroupBy } from './types'
import { Board } from './components/Board'
import {
  FiltersPanel,
  EMPTY_FILTERS,
  type Filters,
} from './components/FiltersPanel'
import { Gate, isAuthed } from './components/Gate'
import { TabSwitcher } from './components/TabSwitcher'
import { THEMES } from './theme'
import { exportElementToPdf } from './utils/pdf'

const FILE_NAMES: Record<GroupBy, string> = {
  speaker: 'agip-report-speakers.pdf',
  priority: 'agip-report-priorities.pdf',
  track: 'agip-report-goals.pdf',
}

export default function App() {
  const [authed, setAuthed] = useState(isAuthed())
  const [tab, setTab] = useState<GroupBy>('speaker')
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [collapsed, setCollapsed] = useState(false)
  const [exporting, setExporting] = useState(false)
  const boardRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    return EVENTS.filter((ev) => {
      if (ev.noExactDate) {
        if (!filters.includeNoDate) return false
      } else {
        if (filters.dateFrom && ev.date < filters.dateFrom) return false
        if (filters.dateTo && ev.date > filters.dateTo) return false
      }
      if (filters.speakers.length && !filters.speakers.includes(ev.speaker))
        return false
      if (filters.priorities.length && !filters.priorities.includes(ev.priority))
        return false
      if (filters.tracks.length && !filters.tracks.includes(ev.track))
        return false
      if (filters.formats.length && !filters.formats.includes(ev.format))
        return false
      if (filters.departments.length && !filters.departments.includes(ev.department))
        return false
      if (filters.authors.length && !filters.authors.includes(ev.author))
        return false
      return true
    })
  }, [filters])

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

  const theme = THEMES[tab]

  return (
    <div className="h-dvh flex flex-col">
      <div className="grain" aria-hidden />

      <header className="shrink-0 bg-white/60 backdrop-blur border-b border-ink-100">
        <div className="px-6 pt-5 pb-5 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-ink-900 text-white shadow-soft">
              <span className="font-display text-[13px] font-extrabold tracking-tight">А</span>
            </div>
            <div>
              <div className="eyebrow text-ink-500">АГИП · прототип</div>
              <h1 className="mt-0.5 font-display text-[18px] font-bold text-ink-900 tracking-[-0.01em]">
                Отчёты по мероприятиям
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="group inline-flex items-center gap-2 rounded-full bg-ink-900 pl-4 pr-1 py-1 text-[12.5px] font-semibold text-white transition-transform duration-300 ease-glide hover:shadow-lift active:scale-[.985] disabled:opacity-60 disabled:cursor-wait"
              title={`Скачать «${theme.label}» в PDF`}
            >
              {exporting ? 'Готовим PDF…' : (
                <>
                  Скачать PDF
                  <span className="text-white/60 text-[11px] font-normal hidden md:inline">
                    · {theme.short}
                  </span>
                </>
              )}
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-transform duration-500 ease-glide group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12M6 9l6 6 6-6M5 21h14"/></svg>
              </span>
            </button>
          </div>
        </div>

        <div className="px-6 pb-5">
          <TabSwitcher active={tab} onChange={setTab} />
        </div>
      </header>

      <div className="flex-1 min-h-0 flex">
        <FiltersPanel
          filters={filters}
          onChange={setFilters}
          total={EVENTS.length}
          visible={filtered.length}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
        />
        <Board ref={boardRef} events={filtered} groupBy={tab} />
      </div>
    </div>
  )
}
