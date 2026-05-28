import type { EventItem, GroupBy } from '../types'
import { SPEAKERS, PRIORITIES, TRACKS, SPEAKER_ROLES, TRACK_HINT } from '../types'
import { Card } from './Card'

const COLUMN_TONE: Record<GroupBy, string> = {
  speaker: 'from-indigo-50 to-transparent',
  priority: 'from-sky-50 to-transparent',
  track: 'from-emerald-50 to-transparent',
}

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
  if (groupBy === 'speaker') return SPEAKER_ROLES[name as keyof typeof SPEAKER_ROLES] ?? null
  if (groupBy === 'track') return TRACK_HINT[name as keyof typeof TRACK_HINT] ?? null
  return null
}

export function Board({
  events,
  groupBy,
}: {
  events: EventItem[]
  groupBy: GroupBy
}) {
  const columns = getColumns(groupBy)
  const grouped = new Map<string, EventItem[]>()
  for (const col of columns) grouped.set(col, [])
  for (const ev of events) {
    const k = getKey(ev, groupBy)
    grouped.get(k)?.push(ev)
  }

  return (
    <div className="flex-1 min-h-0 overflow-x-auto scrollbar-thin">
      <div className="flex gap-4 p-6 min-w-max h-full">
        {columns.map((col) => {
          const items = grouped.get(col) ?? []
          const subtitle = columnSubtitle(col, groupBy)
          return (
            <div
              key={col}
              className="w-[300px] shrink-0 flex flex-col rounded-2xl border border-ink-100 bg-white/60 backdrop-blur"
            >
              <header
                className={`rounded-t-2xl bg-gradient-to-b ${COLUMN_TONE[groupBy]} px-4 pt-4 pb-3 border-b border-ink-100`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="font-display text-[15px] font-semibold text-ink-900 truncate">
                    {col}
                  </h2>
                  <span className="text-[11px] font-semibold text-ink-500 tabular-nums">
                    {items.length}
                  </span>
                </div>
                {subtitle && (
                  <p className="mt-0.5 text-[11.5px] text-ink-500 truncate">
                    {subtitle}
                  </p>
                )}
              </header>

              <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-2.5">
                {items.length === 0 ? (
                  <div className="text-center text-[12px] text-ink-500/70 py-10 border border-dashed border-ink-300/60 rounded-lg">
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
}
