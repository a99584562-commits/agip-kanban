import { forwardRef } from 'react'
import type { EventItem, GroupBy } from '../types'
import {
  SPEAKERS,
  SPEAKER_BY_ID,
  PRIORITY_TAGS,
  TRACK_TAGS,
  TRACK_HINT,
  getPriority,
  getTrack,
} from '../types'
import { Card } from './Card'
import { Avatar } from './primitives'

function getColumnKeys(groupBy: GroupBy): readonly string[] {
  switch (groupBy) {
    case 'speaker':
      return SPEAKERS.map((s) => s.id)
    case 'priority':
      return PRIORITY_TAGS
    case 'track':
      return TRACK_TAGS
  }
}

function keyOf(ev: EventItem, groupBy: GroupBy): string | null {
  switch (groupBy) {
    case 'speaker':
      return ev.speakerId
    case 'priority':
      return getPriority(ev)
    case 'track':
      return getTrack(ev)
  }
}

function ColumnHeader({
  groupBy,
  colKey,
  count,
}: {
  groupBy: GroupBy
  colKey: string
  count: number
}) {
  if (groupBy === 'speaker') {
    const sp = SPEAKER_BY_ID[colKey as keyof typeof SPEAKER_BY_ID]
    return (
      <div className="flex items-center gap-2.5 px-1 py-1.5">
        <Avatar initials={sp.initials} size={38} />
        <div className="flex-1 min-w-0">
          <div className="text-[14.5px] font-bold tracking-[-0.01em] text-[var(--text)] truncate">
            {sp.short}
          </div>
          <div className="text-[12px] text-[var(--text-2)] truncate">{sp.role}</div>
        </div>
        <CountChip>{count}</CountChip>
      </div>
    )
  }
  const subtitle =
    groupBy === 'track' ? TRACK_HINT[colKey as keyof typeof TRACK_HINT] : null
  return (
    <div className="flex items-center gap-2.5 px-1 py-1.5">
      <div className="flex-1 min-w-0">
        <div className="text-[14.5px] font-bold tracking-[-0.01em] text-[var(--text)] truncate">
          {colKey}
        </div>
        {subtitle && (
          <div className="text-[12px] text-[var(--text-2)] truncate">{subtitle}</div>
        )}
      </div>
      <CountChip>{count}</CountChip>
    </div>
  )
}

function CountChip({ children }: { children: number }) {
  return (
    <div className="min-w-[28px] h-[24px] rounded-lg bg-[var(--surface)] border border-[var(--border-hi)] flex items-center justify-center px-2 text-[12px] font-bold text-[var(--text)] tabular-nums">
      {children}
    </div>
  )
}

export const Board = forwardRef<
  HTMLDivElement,
  { events: EventItem[]; groupBy: GroupBy; hideEmpty?: boolean }
>(function Board({ events, groupBy, hideEmpty = false }, ref) {
  const columnKeys = getColumnKeys(groupBy)
  const grouped = new Map<string, EventItem[]>()
  for (const k of columnKeys) grouped.set(k, [])
  for (const ev of events) {
    const k = keyOf(ev, groupBy)
    if (k && grouped.has(k)) grouped.get(k)!.push(ev)
  }
  const visible = hideEmpty
    ? columnKeys.filter((k) => (grouped.get(k)?.length ?? 0) > 0)
    : columnKeys

  if (visible.length === 0) {
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center p-10">
        <div className="text-center max-w-md animate-fade-up">
          <div className="eyebrow">Пусто</div>
          <h3 className="mt-2 text-[18px] font-bold text-[var(--text)]">
            Под текущий фильтр нет мероприятий
          </h3>
          <p className="mt-2 text-[13px] text-[var(--text-2)]">
            Снимите часть фильтров слева, чтобы увидеть данные.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-0 overflow-x-auto overflow-y-auto scrollbar-thin">
      <div
        ref={ref}
        data-pdf-root
        className="flex gap-4 p-6 min-w-max h-full"
      >
        {visible.map((colKey, idx) => {
          const items = grouped.get(colKey) ?? []
          return (
            <div
              key={colKey}
              data-pdf-column
              className="w-[300px] shrink-0 flex flex-col gap-3 rounded-2xl bg-[var(--surface-2)] p-3.5 animate-fade-up"
              style={{ animationDelay: `${idx * 35}ms` }}
            >
              <ColumnHeader groupBy={groupBy} colKey={colKey} count={items.length} />
              <div
                data-pdf-column-body
                className="flex flex-col gap-2.5"
              >
                {items.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[var(--border-hi)] py-8 text-center text-[12px] text-[var(--text-3)]">
                    нет мероприятий
                  </div>
                ) : (
                  items.map((ev) => <Card key={ev.id} ev={ev} groupBy={groupBy} />)
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
})
