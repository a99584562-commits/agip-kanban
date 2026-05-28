import { forwardRef } from 'react'
import type { EventItem, GroupBy } from '../types'
import { SPEAKERS, PRIORITIES, TRACKS, SPEAKER_ROLES, TRACK_HINT } from '../types'
import { Card } from './Card'
import { THEMES } from '../theme'

function getColumns(groupBy: GroupBy): readonly string[] {
  switch (groupBy) {
    case 'speaker':
      return SPEAKERS
    case 'priority':
      return PRIORITIES
    case 'track':
      return TRACKS
  }
}

function getKey(ev: EventItem, groupBy: GroupBy): string {
  switch (groupBy) {
    case 'speaker':
      return ev.speaker
    case 'priority':
      return ev.priority
    case 'track':
      return ev.track
  }
}

function columnSubtitle(name: string, groupBy: GroupBy): string | null {
  if (groupBy === 'speaker')
    return SPEAKER_ROLES[name as keyof typeof SPEAKER_ROLES] ?? null
  if (groupBy === 'track') return TRACK_HINT[name as keyof typeof TRACK_HINT] ?? null
  return null
}

export const Board = forwardRef<
  HTMLDivElement,
  { events: EventItem[]; groupBy: GroupBy; hideEmpty?: boolean }
>(function Board({ events, groupBy, hideEmpty = false }, ref) {
  const columns = getColumns(groupBy)
  const theme = THEMES[groupBy]
  const grouped = new Map<string, EventItem[]>()
  for (const col of columns) grouped.set(col, [])
  for (const ev of events) {
    const k = getKey(ev, groupBy)
    grouped.get(k)?.push(ev)
  }
  const visibleColumns = hideEmpty
    ? columns.filter((c) => (grouped.get(c)?.length ?? 0) > 0)
    : columns

  return (
    <div className="flex-1 min-h-0 overflow-x-auto scrollbar-thin">
      {visibleColumns.length === 0 ? (
        <div className="h-full flex items-center justify-center p-10">
          <div className="text-center max-w-md animate-fade-up">
            <div className="eyebrow text-ink-400">Пусто</div>
            <h3 className="mt-2 font-display text-[18px] font-bold text-ink-900">
              Под текущий фильтр нет мероприятий
            </h3>
            <p className="mt-2 text-[13px] text-ink-500">
              Снимите часть фильтров слева, чтобы увидеть данные.
            </p>
          </div>
        </div>
      ) : (
      <div
        ref={ref}
        data-pdf-root
        className="flex gap-4 p-6 min-w-max h-full"
      >
        {visibleColumns.map((col, idx) => {
          const items = grouped.get(col) ?? []
          const subtitle = columnSubtitle(col, groupBy)
          return (
            <div
              key={col}
              data-pdf-column
              className="w-[300px] shrink-0 flex flex-col rounded-3xl bg-white/10 p-[5px] ring-1 ring-ink-200/60 shadow-soft animate-fade-up"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <div className="flex-1 min-h-0 flex flex-col rounded-[20px] bg-white/70 backdrop-blur-sm border border-white">
                <header
                  className={`relative rounded-t-[20px] bg-gradient-to-b ${theme.columnGradient} px-4 pt-4 pb-3 border-b border-ink-100/70`}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${theme.glowDot} shadow-[0_0_0_3px_rgba(255,255,255,.8),0_0_12px_rgba(0,0,0,.06)]`}
                      />
                      <h2 className="font-display text-[15px] font-bold text-ink-900 truncate tracking-[-0.01em]">
                        {col}
                      </h2>
                    </div>
                    <span
                      className={`inline-flex items-center justify-center min-w-[22px] h-[22px] rounded-full bg-white text-[11px] font-bold tabular-nums ${theme.textAccent} ring-1 ring-ink-200/70`}
                    >
                      {items.length}
                    </span>
                  </div>
                  {subtitle && (
                    <p className="mt-0.5 text-[11.5px] text-ink-500 truncate">
                      {subtitle}
                    </p>
                  )}
                </header>

                <div
                  data-pdf-column-body
                  className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-2.5"
                >
                  {items.length === 0 ? (
                    <div className="text-center text-[12px] text-ink-400 py-10 rounded-xl border border-dashed border-ink-200">
                      нет мероприятий
                    </div>
                  ) : (
                    items.map((ev) => <Card key={ev.id} ev={ev} groupBy={groupBy} />)
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      )}
    </div>
  )
})
