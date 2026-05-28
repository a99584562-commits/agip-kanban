import type { EventItem, GroupBy } from '../types'
import { SPEAKER_BY_ID, ru, getPriority, getTrack } from '../types'
import { Avatar, Pill, StatusBadge } from './primitives'

export function Card({
  ev,
  groupBy,
  dense = false,
}: {
  ev: EventItem
  groupBy: GroupBy
  dense?: boolean
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
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-card transition-shadow duration-300 hover:border-[var(--border-hi)]">
      <div className={dense ? 'p-3.5 space-y-2.5' : 'p-4 space-y-3'}>
        <div className="flex items-start justify-between gap-3">
          <h3 className="flex-1 text-[15px] font-bold leading-snug text-[var(--text)] tracking-[-0.012em]">
            {ev.title}
          </h3>
          <StatusBadge status={ev.status} dense />
        </div>

        <p className="text-[13px] leading-snug text-[var(--text-2)]">
          {ev.goal}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <Pill key={t} name={t} dense />
            ))}
          </div>
        )}

        <div className="border-t border-dashed border-[var(--border)] pt-2.5 grid grid-cols-[auto,1fr] gap-y-1 gap-x-4 text-[12px]">
          <span className="text-[var(--text-3)]">Дата</span>
          <span className="text-right text-[var(--text)] tabular-nums">
            {ru.formatDate(ev.date)}
          </span>

          {groupBy !== 'speaker' && (
            <>
              <span className="text-[var(--text-3)]">Спикер</span>
              <span className="text-right text-[var(--text)] font-medium truncate">
                {sp.short}
              </span>
            </>
          )}

          <span className="text-[var(--text-3)]">Ведомство</span>
          <span className="text-right text-[var(--text)] truncate">
            {ev.ministry}
          </span>

          <span className="text-[var(--text-3)]">Автор</span>
          <span className="text-right text-[var(--text)] truncate">
            {ev.author}
          </span>
        </div>
      </div>
    </article>
  )
}
