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
      <div className="mb-1.5 text-[11px] font-semibold tracking-wide text-ink-500 uppercase">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const on = selected.includes(opt)
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className={`rounded-full border px-2.5 py-1 text-[11.5px] transition ${
                on
                  ? 'border-accent bg-accent text-white'
                  : 'border-ink-300 bg-white text-ink-700 hover:border-accent/50'
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
}: {
  filters: Filters
  onChange: (next: Filters) => void
  total: number
  visible: number
}) {
  function toggle(key: keyof Filters, v: string) {
    const arr = filters[key] as string[]
    const next = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]
    onChange({ ...filters, [key]: next })
  }

  function reset() {
    onChange(EMPTY_FILTERS)
  }

  const hasFilters =
    filters.dateFrom ||
    filters.dateTo ||
    !filters.includeNoDate ||
    filters.speakers.length ||
    filters.priorities.length ||
    filters.tracks.length ||
    filters.formats.length ||
    filters.departments.length ||
    filters.authors.length

  return (
    <aside className="w-[290px] shrink-0 border-r border-ink-100 bg-white overflow-y-auto scrollbar-thin">
      <div className="px-5 py-5 border-b border-ink-100">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold text-ink-900">
            Фильтр
          </h2>
          {hasFilters ? (
            <button
              onClick={reset}
              className="text-[11px] text-accent hover:underline"
            >
              сбросить
            </button>
          ) : null}
        </div>
        <div className="mt-2 text-[11.5px] text-ink-500">
          Показано{' '}
          <span className="font-semibold text-ink-900 tabular-nums">
            {visible}
          </span>{' '}
          из <span className="tabular-nums">{total}</span> мероприятий
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div>
          <div className="mb-1.5 text-[11px] font-semibold tracking-wide text-ink-500 uppercase">
            Дата мероприятия
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) =>
                onChange({ ...filters, dateFrom: e.target.value })
              }
              className="w-full rounded-md border border-ink-300 px-2 py-1.5 text-[12px] outline-none focus:border-accent"
            />
            <span className="text-ink-500 text-xs">—</span>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
              className="w-full rounded-md border border-ink-300 px-2 py-1.5 text-[12px] outline-none focus:border-accent"
            />
          </div>
          <label className="mt-2 flex items-center gap-2 text-[12px] text-ink-700 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.includeNoDate}
              onChange={(e) =>
                onChange({ ...filters, includeNoDate: e.target.checked })
              }
              className="accent-[#1e3a8a]"
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
    </aside>
  )
}
