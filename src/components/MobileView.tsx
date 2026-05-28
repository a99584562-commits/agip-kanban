import { useMemo, useState } from 'react'
import type { EventItem, GroupBy, SpeakerId } from '../types'
import {
  SPEAKERS,
  SPEAKER_BY_ID,
  PRIORITY_TAGS,
  TRACK_TAGS,
  TRACK_HINT,
  getPriority,
  getTrack,
} from '../types'
import { Avatar, Pill, StatusBadge } from './primitives'
import { TabSwitcher } from './TabSwitcher'
import { ThemeToggle } from './Topbar'
import {
  CalendarIcon,
  DownloadIcon,
  FilterIcon,
  HomeIcon,
  PeopleIcon,
  UserIcon,
} from './icons'
import {
  type Filters,
  FiltersBody,
  countActiveFilters,
  EMPTY_FILTERS,
} from './FiltersPanel'
import { ru } from '../types'

function chipKeysFor(group: GroupBy): { value: string; label: string; initials?: string }[] {
  if (group === 'speaker')
    return SPEAKERS.map((s) => ({ value: s.id, label: s.short, initials: s.initials }))
  if (group === 'priority')
    return PRIORITY_TAGS.map((p) => ({ value: p, label: p }))
  return TRACK_TAGS.map((t) => ({ value: t, label: t }))
}

function keyOf(ev: EventItem, group: GroupBy): string | null {
  switch (group) {
    case 'speaker':
      return ev.speakerId
    case 'priority':
      return getPriority(ev)
    case 'track':
      return getTrack(ev)
  }
}

function MobileCard({ ev }: { ev: EventItem }) {
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3.5 space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className="text-[11px] font-bold tracking-wider uppercase text-[var(--text-2)] tabular-nums">
          {ru.shortDate(ev.date)}
        </div>
        <div className="text-[11px] text-[var(--text-3)] truncate">{ev.ministry}</div>
      </div>
      <h3 className="text-[15.5px] font-bold leading-snug text-[var(--text)] tracking-[-0.01em]">
        {ev.title}
      </h3>
      <p className="text-[13px] leading-snug text-[var(--text-2)]">{ev.goal}</p>
      <div className="flex flex-wrap gap-1.5">
        {ev.tags.map((t) => (
          <Pill key={t} name={t} dense />
        ))}
        <StatusBadge status={ev.status} dense />
      </div>
    </article>
  )
}

function ActiveGroupHeader({
  group,
  value,
  count,
}: {
  group: GroupBy
  value: string
  count: number
}) {
  if (group === 'speaker') {
    const sp = SPEAKER_BY_ID[value as SpeakerId]
    return (
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <Avatar initials={sp.initials} size={44} />
        <div className="flex-1">
          <div className="text-[16.5px] font-bold tracking-[-0.01em] text-[var(--text)]">
            {sp.short}
          </div>
          <div className="text-[12px] text-[var(--text-2)]">
            {sp.role} · {count} мероприятий
          </div>
        </div>
      </div>
    )
  }
  const subtitle =
    group === 'track' ? TRACK_HINT[value as keyof typeof TRACK_HINT] : ''
  return (
    <div className="px-4 pt-4 pb-2">
      <div className="text-[16.5px] font-bold tracking-[-0.01em] text-[var(--text)]">
        {value}
      </div>
      <div className="text-[12px] text-[var(--text-2)]">
        {subtitle ? `${subtitle} · ` : ''}{count} мероприятий
      </div>
    </div>
  )
}

export function MobileView({
  tab,
  setTab,
  events,
  filters,
  setFilters,
  onExport,
  exporting,
  pdfShort,
}: {
  tab: GroupBy
  setTab: (g: GroupBy) => void
  events: EventItem[]
  filters: Filters
  setFilters: (f: Filters) => void
  onExport: () => void
  exporting: boolean
  pdfShort: string
}) {
  const chips = chipKeysFor(tab)
  // Pick first chip that has items, fallback to first
  const grouped = useMemo(() => {
    const m = new Map<string, EventItem[]>()
    for (const c of chips) m.set(c.value, [])
    for (const ev of events) {
      const k = keyOf(ev, tab)
      if (k && m.has(k)) m.get(k)!.push(ev)
    }
    return m
  }, [events, tab, chips])

  const firstWithItems = chips.find((c) => (grouped.get(c.value)?.length ?? 0) > 0)
  const [selected, setSelected] = useState<string>(firstWithItems?.value ?? chips[0].value)

  // If current selection has no items (e.g. filter changed), auto-jump to first with items
  const selectedHasItems = (grouped.get(selected)?.length ?? 0) > 0
  const activeKey = selectedHasItems
    ? selected
    : firstWithItems?.value ?? selected

  const activeEvents = grouped.get(activeKey) ?? []

  const [showFilters, setShowFilters] = useState(false)
  const activeFiltersCount = countActiveFilters(filters)

  return (
    <div className="min-h-dvh flex flex-col bg-[var(--bg)]">
      {/* Header */}
      <header className="shrink-0 bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="px-4 pt-5 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-[11px] font-extrabold tracking-wider"
              style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
            >
              АГ
            </div>
            <div className="eyebrow">АГИП</div>
          </div>
          <div className="flex items-center gap-1.5">
            <ThemeToggle compact />
          </div>
        </div>
        <div className="px-4 pb-4">
          <h1 className="text-[22px] font-extrabold leading-[1.15] tracking-[-0.02em] text-[var(--text)]">
            Отчёты по&nbsp;мероприятиям
          </h1>
          <div className="mt-1.5 text-[12.5px] text-[var(--text-2)]">
            Июнь 2026 · <b className="text-[var(--text)] tabular-nums">{events.length}</b> мероприятий
          </div>
        </div>
        <TabSwitcher active={tab} onChange={setTab} variant="mobile" />
      </header>

      {/* Chip row */}
      <div className="shrink-0 bg-[var(--surface)] border-b border-[var(--border)] flex items-center gap-2 overflow-x-auto no-scrollbar px-3 py-3">
        {chips.map((c) => {
          const isActive = c.value === activeKey
          const count = grouped.get(c.value)?.length ?? 0
          return (
            <button
              key={c.value}
              onClick={() => setSelected(c.value)}
              className="shrink-0 inline-flex items-center gap-2 rounded-full px-3 py-1.5 border transition-colors"
              style={{
                background: isActive ? 'var(--primary)' : 'var(--surface)',
                borderColor: isActive ? 'var(--primary)' : 'var(--border-hi)',
                color: isActive ? 'var(--on-primary)' : 'var(--text-2)',
              }}
            >
              {c.initials && (
                <span
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[9.5px] font-extrabold"
                  style={{
                    background: isActive ? 'rgba(255,255,255,0.18)' : undefined,
                    backgroundImage: isActive ? undefined : 'var(--avatar-gradient)',
                    color: isActive ? 'inherit' : '#fff',
                  }}
                >
                  {c.initials}
                </span>
              )}
              <span className="text-[12.5px] font-bold whitespace-nowrap">
                {c.label}
              </span>
              <span
                className="text-[10.5px] tabular-nums font-bold"
                style={{ opacity: 0.6 }}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Active group header */}
      <div className="bg-[var(--surface)] border-b border-[var(--border)]">
        <ActiveGroupHeader group={tab} value={activeKey} count={activeEvents.length} />
      </div>

      {/* Card list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-3 py-3 pb-32">
        {activeEvents.length === 0 ? (
          <div className="mt-12 text-center px-6">
            <div className="eyebrow">Пусто</div>
            <h3 className="mt-2 text-[16px] font-bold text-[var(--text)]">
              Под текущий фильтр нет мероприятий
            </h3>
          </div>
        ) : (
          <div className="space-y-2.5">
            {activeEvents.map((ev) => (
              <MobileCard key={ev.id} ev={ev} />
            ))}
          </div>
        )}
      </div>

      {/* Floating action buttons */}
      <div className="fixed bottom-[84px] right-4 flex flex-col gap-3 z-30">
        <button
          onClick={onExport}
          disabled={exporting}
          title={`Скачать «${pdfShort}» в PDF`}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full shadow-lg disabled:opacity-60"
          style={{ background: 'var(--primary)', color: 'var(--on-primary)' }}
        >
          <DownloadIcon size={18} />
        </button>
        <button
          onClick={() => setShowFilters(true)}
          className="relative inline-flex h-12 w-12 items-center justify-center rounded-full shadow-lg border border-[var(--border-hi)]"
          style={{ background: 'var(--surface)', color: 'var(--text)' }}
        >
          <FilterIcon size={18} />
          {activeFiltersCount > 0 && (
            <span
              className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 px-1 items-center justify-center rounded-full text-[10px] font-bold"
              style={{
                background: 'var(--accent)',
                color: 'var(--on-accent)',
              }}
            >
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Bottom nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-20 border-t border-[var(--border)] bg-[var(--surface)] px-2 pt-2"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 8px) + 8px)' }}
      >
        <div className="flex">
          {[
            { label: 'Отчёты', icon: HomeIcon, active: true },
            { label: 'Календарь', icon: CalendarIcon },
            { label: 'Спикеры', icon: PeopleIcon },
            { label: 'Профиль', icon: UserIcon },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className="flex-1 flex flex-col items-center gap-1 py-1"
                style={{
                  color: item.active ? 'var(--accent)' : 'var(--text-3)',
                }}
              >
                <Icon size={20} />
                <span className="text-[10.5px] font-semibold">{item.label}</span>
              </div>
            )
          })}
        </div>
      </nav>

      {/* Filters overlay */}
      {showFilters && (
        <div
          className="fixed inset-0 z-40 flex items-end animate-fade-up"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setShowFilters(false)}
        >
          <div
            className="w-full max-h-[85vh] flex flex-col rounded-t-3xl bg-[var(--surface)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="shrink-0 flex items-center justify-between px-5 pt-4 pb-3 border-b border-[var(--border)]">
              <div>
                <div className="text-[17px] font-bold text-[var(--text)]">Фильтр</div>
                <div className="text-[12px] text-[var(--text-2)]">
                  {activeFiltersCount > 0
                    ? `${activeFiltersCount} активных`
                    : 'все мероприятия'}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {activeFiltersCount > 0 && (
                  <button
                    onClick={() => setFilters(EMPTY_FILTERS)}
                    className="text-[12px] px-3 py-1.5 rounded-full text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
                  >
                    сбросить
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-[12px] px-3 py-1.5 rounded-full font-bold"
                  style={{ background: 'var(--primary)', color: 'var(--on-primary)' }}
                >
                  Готово
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
              <FiltersBody filters={filters} onChange={setFilters} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

