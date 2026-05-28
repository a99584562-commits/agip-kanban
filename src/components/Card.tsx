import type { EventItem, GroupBy } from '../types'
import { SPEAKER_ROLES } from '../types'

const PRIORITY_TONE: Record<string, string> = {
  'Глава': 'bg-indigo-50 text-indigo-700 ring-indigo-100',
  'Премьер и зампреды': 'bg-sky-50 text-sky-700 ring-sky-100',
  'Фон': 'bg-slate-100 text-slate-600 ring-slate-200',
}

const FORMAT_TONE: Record<string, string> = {
  'Брифинг': 'bg-amber-50 text-amber-700',
  'Интервью': 'bg-violet-50 text-violet-700',
  'Совещание': 'bg-slate-100 text-slate-700',
  'Пресс-конференция': 'bg-rose-50 text-rose-700',
  'Выезд': 'bg-emerald-50 text-emerald-700',
  'Публикация': 'bg-blue-50 text-blue-700',
  'Прямой эфир': 'bg-pink-50 text-pink-700',
}

function formatDate(iso: string): string {
  if (!iso) return 'без точной даты'
  const d = new Date(iso)
  return d.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function Card({ ev, groupBy }: { ev: EventItem; groupBy: GroupBy }) {
  return (
    <article className="group rounded-2xl bg-white/5 p-[3px] ring-1 ring-ink-200/70 shadow-soft hover:shadow-lift transition-all duration-500 ease-glide">
      <div className="rounded-[14px] bg-white px-4 py-3.5">
        <h3 className="font-display text-[14px] leading-snug font-semibold text-ink-900 tracking-[-0.005em]">
          {ev.infopovod}
        </h3>

        <p className="mt-2 text-[12.5px] leading-relaxed text-ink-500 line-clamp-2">
          {ev.goalText}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span
            className={`inline-flex items-center rounded-full ring-1 px-2 py-0.5 text-[10.5px] font-semibold tracking-wide ${
              PRIORITY_TONE[ev.priority] ?? ''
            }`}
          >
            {ev.priority}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-semibold tracking-wide ${
              FORMAT_TONE[ev.format] ?? 'bg-slate-100 text-slate-700'
            }`}
          >
            {ev.format}
          </span>
          {groupBy !== 'track' && (
            <span className="inline-flex items-center rounded-full bg-ink-100 px-2 py-0.5 text-[10.5px] font-semibold tracking-wide text-ink-700">
              {ev.track}
            </span>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-dashed border-ink-200 grid grid-cols-[auto,1fr] gap-y-1.5 gap-x-4 text-[11.5px]">
          <div className="text-ink-400">Дата</div>
          <div className="text-right text-ink-900 font-medium tabular-nums">
            {formatDate(ev.date)}
          </div>

          {groupBy !== 'speaker' && (
            <>
              <div className="text-ink-400">Спикер</div>
              <div className="text-right text-ink-900 font-medium truncate">
                {ev.speaker}
                <div className="text-[10.5px] text-ink-400 font-normal truncate">
                  {SPEAKER_ROLES[ev.speaker]}
                </div>
              </div>
            </>
          )}

          <div className="text-ink-400">Ведомство</div>
          <div className="text-right text-ink-700 truncate">{ev.department}</div>

          <div className="text-ink-400">Автор</div>
          <div className="text-right text-ink-700 truncate">{ev.author}</div>
        </div>
      </div>
    </article>
  )
}
