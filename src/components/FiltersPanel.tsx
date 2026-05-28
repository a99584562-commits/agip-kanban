import {
  SPEAKERS,
  PRIORITY_TAGS,
  FORMAT_TAGS,
  TRACK_TAGS,
} from '../types'
import { MINISTRIES, AUTHORS } from '../data'
import { CheckIcon, ChevronLeftIcon, FilterIcon } from './icons'

export type Filters = {
  dateFrom: string
  dateTo: string
  includeNoDate: boolean
  speakers: string[]
  priorities: string[]
  tracks: string[]
  formats: string[]
  ministries: string[]
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
  ministries: [],
  authors: [],
}

export function hasActiveFilters(f: Filters): boolean {
  return (
    !!f.dateFrom ||
    !!f.dateTo ||
    !f.includeNoDate ||
    f.speakers.length > 0 ||
    f.priorities.length > 0 ||
    f.tracks.length > 0 ||
    f.formats.length > 0 ||
    f.ministries.length > 0 ||
    f.authors.length > 0
  )
}

export function countActiveFilters(f: Filters): number {
  return (
    (f.dateFrom ? 1 : 0) +
    (f.dateTo ? 1 : 0) +
    (!f.includeNoDate ? 1 : 0) +
    f.speakers.length +
    f.priorities.length +
    f.tracks.length +
    f.formats.length +
    f.ministries.length +
    f.authors.length
  )
}

function ChipGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string
  options: readonly { value: string; label: string }[]
  selected: string[]
  onToggle: (v: string) => void
}) {
  return (
    <div className="space-y-2.5">
      <div className="eyebrow">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const on = selected.includes(opt.value)
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onToggle(opt.value)}
              className="rounded-full px-3 py-1.5 text-[12px] font-semibold border transition-colors"
              style={{
                borderColor: on ? 'var(--primary)' : 'var(--border-hi)',
                background: on ? 'var(--primary)' : 'var(--surface)',
                color: on ? 'var(--on-primary)' : 'var(--text-2)',
              }}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

const SPEAKER_OPTIONS = SPEAKERS.map((s) => ({ value: s.id, label: s.short }))
const TAG_OPTIONS = (arr: readonly string[]) =>
  arr.map((v) => ({ value: v, label: v }))

export function FiltersBody({
  filters,
  onChange,
}: {
  filters: Filters
  onChange: (f: Filters) => void
}) {
  function toggle(key: keyof Filters, v: string) {
    const arr = filters[key] as string[]
    const next = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]
    onChange({ ...filters, [key]: next })
  }
  return (
    <div className="space-y-6">
      <div className="space-y-2.5">
        <div className="eyebrow">Дата мероприятия</div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
            className="w-full rounded-lg border border-[var(--border-hi)] bg-[var(--surface)] px-2.5 py-2 text-[12.5px] text-[var(--text)] outline-none transition focus:border-[var(--primary)]"
          />
          <span className="text-[var(--text-3)] text-xs">—</span>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
            className="w-full rounded-lg border border-[var(--border-hi)] bg-[var(--surface)] px-2.5 py-2 text-[12.5px] text-[var(--text)] outline-none transition focus:border-[var(--primary)]"
          />
        </div>
        <label className="flex items-center gap-2 text-[13px] text-[var(--text-2)] cursor-pointer select-none">
          <span
            className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-[5px] transition-colors"
            style={{
              background: filters.includeNoDate ? 'var(--primary)' : 'transparent',
              border: filters.includeNoDate
                ? '1px solid var(--primary)'
                : '1px solid var(--border-hi)',
              color: 'var(--on-primary)',
            }}
          >
            {filters.includeNoDate && <CheckIcon size={11} />}
          </span>
          <input
            type="checkbox"
            checked={filters.includeNoDate}
            onChange={(e) => onChange({ ...filters, includeNoDate: e.target.checked })}
            className="sr-only"
          />
          Включая без точной даты
        </label>
      </div>

      <ChipGroup
        label="Спикер"
        options={SPEAKER_OPTIONS}
        selected={filters.speakers}
        onToggle={(v) => toggle('speakers', v)}
      />
      <ChipGroup
        label="Приоритет"
        options={TAG_OPTIONS(PRIORITY_TAGS)}
        selected={filters.priorities}
        onToggle={(v) => toggle('priorities', v)}
      />
      <ChipGroup
        label="Цель / трек"
        options={TAG_OPTIONS(TRACK_TAGS)}
        selected={filters.tracks}
        onToggle={(v) => toggle('tracks', v)}
      />
      <ChipGroup
        label="Формат"
        options={TAG_OPTIONS(FORMAT_TAGS)}
        selected={filters.formats}
        onToggle={(v) => toggle('formats', v)}
      />
      <ChipGroup
        label="Ведомство"
        options={MINISTRIES.map((m) => ({ value: m, label: m }))}
        selected={filters.ministries}
        onToggle={(v) => toggle('ministries', v)}
      />
      <ChipGroup
        label="Автор"
        options={AUTHORS.map((a) => ({ value: a, label: a }))}
        selected={filters.authors}
        onToggle={(v) => toggle('authors', v)}
      />
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
  const active = countActiveFilters(filters)
  return (
    <aside
      className="relative shrink-0 transition-[width] duration-500 ease-glide border-r border-[var(--border)] bg-[var(--surface)]"
      style={{ width: collapsed ? 56 : 290 }}
    >
      {collapsed ? (
        <button
          onClick={onToggleCollapse}
          title="Раскрыть фильтр"
          className="w-full h-full flex flex-col items-center gap-3 pt-5 text-[var(--text-2)] hover:text-[var(--text)] transition-colors"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--on-primary)] shadow-card">
            <FilterIcon size={16} />
          </span>
          <span
            className="eyebrow"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Фильтр {active > 0 ? `· ${active}` : ''}
          </span>
        </button>
      ) : (
        <div className="h-full flex flex-col">
          <div className="px-5 py-4 border-b border-[var(--border)] flex items-start justify-between gap-2">
            <div>
              <div className="text-[18px] font-bold tracking-[-0.01em] text-[var(--text)]">
                Фильтр
              </div>
              <div className="mt-0.5 text-[12.5px] text-[var(--text-2)]">
                Показано{' '}
                <b className="text-[var(--text)] tabular-nums">{visible}</b>
                <span className="text-[var(--text-3)]"> / {total}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {active > 0 && (
                <button
                  onClick={() => onChange(EMPTY_FILTERS)}
                  className="text-[11px] px-2 py-1 rounded-md text-[var(--text-3)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition"
                >
                  сбросить
                </button>
              )}
              <button
                onClick={onToggleCollapse}
                title="Свернуть фильтр"
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-3)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition"
              >
                <ChevronLeftIcon />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
            <FiltersBody filters={filters} onChange={onChange} />
          </div>
        </div>
      )}
    </aside>
  )
}
