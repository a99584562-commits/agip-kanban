import type { EventItem, GroupBy } from '../types'
import { SPEAKER_BY_ID, ru, getPriority, getTrack } from '../types'
import { Pill, StatusBadge } from './primitives'

export function Card({
  ev,
  groupBy,
}: {
  ev: EventItem
  groupBy: GroupBy
}) {
  const sp = SPEAKER_BY_ID[ev.speakerId]
  const priority = getPriority(ev)
  const track = getTrack(ev)
  const tags = ev.tags.filter((t) => {
    if (groupBy === 'priority' && t === priority) return false
    if (groupBy === 'track' && t === track) return false
    return true
  })

  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-card transition-shadow duration-300 hover:border-[var(--border-hi)]">
      <div className="p-3 space-y-2">
        {/* meta row: date + status */}
        <div className="flex items-center justify-between gap-2">
          <div className="text-[11px] font-bold tracking-wider uppercase text-[var(--text-2)] tabular-nums">
            {ru.shortDate(ev.date)}
          </div>
          <StatusBadge status={ev.status} dense />
        </div>

        {/* title */}
        <h3 className="text-[13.5px] font-bold leading-snug text-[var(--text)] tracking-[-0.012em]">
          {ev.title}
        </h3>

        {/* tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((t) => (
              <Pill key={t} name={t} dense />
            ))}
          </div>
        )}

        {/* footer: ministry · author (· speaker for non-speaker tab) */}
        <div className="pt-1.5 border-t border-dashed border-[var(--border)] text-[11px] text-[var(--text-3)] flex items-center gap-1.5 leading-snug">
          <span className="truncate text-[var(--text-2)]">{ev.ministry}</span>
          <span className="opacity-50">·</span>
          <span className="truncate">{ev.author}</span>
          {groupBy !== 'speaker' && (
            <>
              <span className="opacity-50">·</span>
              <span className="truncate text-[var(--text-2)]">{sp.short}</span>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
