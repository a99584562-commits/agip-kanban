import { useMemo, useState } from 'react'
import { EVENTS } from './data'
import type { GroupBy } from './types'
import { Board } from './components/Board'
import { FiltersPanel, EMPTY_FILTERS, type Filters } from './components/FiltersPanel'
import { Gate, isAuthed } from './components/Gate'

const TABS: { id: GroupBy; label: string; sub: string }[] = [
  { id: 'speaker', label: 'По спикерам', sub: 'Отчёт №1' },
  { id: 'priority', label: 'По приоритетам', sub: 'Отчёт №2' },
  { id: 'track', label: 'По целям', sub: 'Отчёт №3' },
]

export default function App() {
  const [authed, setAuthed] = useState(isAuthed())
  const [tab, setTab] = useState<GroupBy>('speaker')
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)

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
      if (
        filters.departments.length &&
        !filters.departments.includes(ev.department)
      )
        return false
      if (filters.authors.length && !filters.authors.includes(ev.author))
        return false
      return true
    })
  }, [filters])

  if (!authed) return <Gate onPass={() => setAuthed(true)} />

  return (
    <div className="h-dvh flex flex-col bg-[#f6f7fb]">
      <header className="shrink-0 bg-white border-b border-ink-100">
        <div className="px-6 pt-5 pb-2 flex items-end justify-between gap-6">
          <div>
            <div className="text-[11px] font-semibold tracking-widest text-ink-500 uppercase">
              АГИП · прототип
            </div>
            <h1 className="mt-1 font-display text-xl font-semibold text-ink-900">
              Отчёты по мероприятиям
            </h1>
          </div>
          <div className="text-[11.5px] text-ink-500">
            демо · данные тестовые
          </div>
        </div>

        <nav className="px-6 flex gap-1 -mb-px">
          {TABS.map((t) => {
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`group relative px-4 pt-2 pb-3 text-sm transition ${
                  active
                    ? 'text-ink-900'
                    : 'text-ink-500 hover:text-ink-700'
                }`}
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-[10.5px] font-semibold tracking-wider uppercase text-ink-500/70">
                    {t.sub}
                  </span>
                  <span className="font-medium">{t.label}</span>
                </div>
                {active && (
                  <span className="absolute left-3 right-3 -bottom-px h-0.5 rounded-full bg-accent" />
                )}
              </button>
            )
          })}
        </nav>
      </header>

      <div className="flex-1 min-h-0 flex">
        <FiltersPanel
          filters={filters}
          onChange={setFilters}
          total={EVENTS.length}
          visible={filtered.length}
        />
        <Board events={filtered} groupBy={tab} />
      </div>
    </div>
  )
}
