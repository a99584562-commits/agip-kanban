import {
  SPEAKERS,
  PRIORITIES,
  FORMATS,
  DEPARTMENTS,
  AUTHORS,
  TRACKS,
} from '../types'

export type Filters = {
  dateFrom: string
  dateTo: string
  includeNoDate: boolean
  speakers: string[]
  priorities: string[]
  tracks: string[]
  formats: string[]
  departments: string[]
  authors: string[]
}

export const EMPTY_FILTERS: Filters = {
  dateFrom: '',
  dateTo: '',
  includeNoDate: true,
  speakers: [],
  priorities: [],
  tracks: [],
  formats: [],
  departments: [],
  authors: [],
}

function ChipGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string
  options: readonly string[]
  selected: string[]
  onToggle: (v: string) => void
}) {
  return (
    <div>
      <div className="eyebrow text-ink-500 mb-1.5">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const on = selected.includes(opt)
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className={`rounded-full border px-2.5 py-1 text-[11.5px] transition-all duration-300 ease-glide ${
                on
                  ? 'border-ink-900 bg-ink-900 text-white shadow-soft'
                  : 'border-ink-200 bg-white text-ink-700 hover:border-ink-400 hover:bg-ink-50'
              }`}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function FiltersPanel({
  filters,
  onChange,
  total,
  visible,
  collapsed,
  onToggleCollapse,
}: {
  filters: Filters
  onChange: (next: Filters) => void
  total: number
  visible: number
  collapsed: boolean
  onToggleCollapse: () => void
}) {
  function toggle(key: keyof Filters, v: string) {
    const arr = filters[key] as string[]
    const next = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]
    onChange({ ...filters, [key]: next })
  }

  function reset() {
    onChange(EMPTY_FILTERS)
  }

  const activeCount =
    (filters.dateFrom ? 1 : 0) +
    (filters.dateTo ? 1 : 0) +
    (!filters.includeNoDate ? 1 : 0) +
    filters.speakers.length +
    filters.priorities.length +
    filters.tracks.length +
    filters.formats.length +
    filters.departments.length +
    filters.authors.length

  return (
    <aside
      className={`relative shrink-0 transition-[width] duration-500 ease-glide ${
        collapsed ? 'w-[56px]' : 'w-[300px]'
      }`}
    >
      {/* Sticky collapse rail / full panel */}
      <div className="h-full bg-white/70 backdrop-blur border-r border-ink-100 overflow-hidden">
        {collapsed ? (
          <button
            onClick={onToggleCollapse}
            title="Раскрыть фильтр"
            className="w-full h-full flex flex-col items-center gap-3 pt-5 group"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-ink-900 text-white shadow-soft group-hover:shadow-lift transition-shadow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M6 12h12M10 18h4"/></svg>
            </span>
            <span
              className="eyebrow text-ink-500 group-hover:text-ink-900 transition"
              style={{
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
              }}
            >
              Фильтр {activeCount > 0 ? `· ${activeCount}` : ''}
            </span>
          </button>
        ) : (
          <div className="h-full flex flex-col">
            <div className="px-5 py-4 border-b border-ink-100 flex items-center justify-between gap-2">
              <div>
                <div className="eyebrow text-ink-500">Фильтр</div>
                <div className="mt-1 text-[12px] text-ink-700">
                  <span className="font-bold text-ink-900 tabular-nums">{visible}</span>
                  <span className="text-ink-400"> / {total}</span>
                  <span className="text-ink-500"> мероприятий</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {activeCount > 0 && (
                  <button
                    onClick={reset}
                    className="text-[11px] px-2 py-1 rounded-md text-ink-500 hover:text-ink-900 hover:bg-ink-100 transition"
                  >
                    сбросить
                  </button>
                )}
                <button
                  onClick={onToggleCollapse}
                  title="Свернуть фильтр"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-ink-500 hover:text-ink-900 hover:bg-ink-100 transition"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-5">
              <div>
                <div className="eyebrow text-ink-500 mb-1.5">Дата мероприятия</div>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
                    className="w-full rounded-lg border border-ink-200 bg-white px-2 py-1.5 text-[12px] outline-none transition focus:border-ink-900 focus:ring-2 focus:ring-ink-900/10"
                  />
                  <span className="text-ink-400 text-xs">—</span>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
                    className="w-full rounded-lg border border-ink-200 bg-white px-2 py-1.5 text-[12px] outline-none transition focus:border-ink-900 focus:ring-2 focus:ring-ink-900/10"
                  />
                </div>
                <label className="mt-2 flex items-center gap-2 text-[12px] text-ink-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={filters.includeNoDate}
                    onChange={(e) =>
                      onChange({ ...filters, includeNoDate: e.target.checked })
                    }
                    className="accent-ink-900"
                  />
                  Включая без точной даты
                </label>
              </div>

              <ChipGroup
                label="Спикер"
                options={SPEAKERS}
                selected={filters.speakers}
                onToggle={(v) => toggle('speakers', v)}
              />
              <ChipGroup
                label="Приоритет"
                options={PRIORITIES}
                selected={filters.priorities}
                onToggle={(v) => toggle('priorities', v)}
              />
              <ChipGroup
                label="Цель / трек"
                options={TRACKS}
                selected={filters.tracks}
                onToggle={(v) => toggle('tracks', v)}
              />
              <ChipGroup
                label="Формат"
                options={FORMATS}
                selected={filters.formats}
                onToggle={(v) => toggle('formats', v)}
              />
              <ChipGroup
                label="Ведомство"
                options={DEPARTMENTS}
                selected={filters.departments}
                onToggle={(v) => toggle('departments', v)}
              />
              <ChipGroup
                label="Автор"
                options={AUTHORS}
                selected={filters.authors}
                onToggle={(v) => toggle('authors', v)}
              />
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
