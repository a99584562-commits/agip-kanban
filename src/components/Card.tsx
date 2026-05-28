import type { EventItem, GroupBy } from '../types'
import { SPEAKER_ROLES } from '../types'

const PRIORITY_TONE: Record<string, string> = {
  'Глава': 'bg-indigo-50 text-indigo-700 border-indigo-100',
  'Премьер и зампреды': 'bg-sky-50 text-sky-700 border-sky-100',
  'Фон': 'bg-slate-100 text-slate-600 border-slate-200',
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
    <article className="group rounded-xl bg-white border border-ink-100 card-shadow p-4 hover:border-accent/40 transition cursor-default">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold leading-snug text-ink-900">
          {ev.infopovod}
        </h3>
      </div>

      <p className="mt-2 text-[12.5px] leading-relaxed text-ink-500 line-clamp-2">
        {ev.goalText}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span
          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${
            PRIORITY_TONE[ev.priority] ?? ''
          }`}
        >
          {ev.priority}
        </span>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
            FORMAT_TONE[ev.format] ?? 'bg-slate-100 text-slate-700'
          }`}
        >
          {ev.format}
        </span>
        {groupBy !== 'track' && (
          <span className="inline-flex items-center rounded-full bg-ink-100 px-2 py-0.5 text-[11px] font-medium text-ink-700">
            {ev.track}
          </span>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-ink-100 grid grid-cols-2 gap-y-1.5 gap-x-3 text-[11.5px]">
        <div className="text-ink-500">Дата</div>
        <div className="text-right text-ink-900 font-medium">
          {formatDate(ev.date)}
        </div>

        {groupBy !== 'speaker' && (
          <>
            <div className="text-ink-500">Спикер</div>
            <div className="text-right text-ink-900 font-medium truncate">
              {ev.speaker}
              <div className="text-[10.5px] text-ink-500 font-normal truncate">
                {SPEAKER_ROLES[ev.speaker]}
              </div>
            </div>
          </>
        )}

        <div className="text-ink-500">Ведомство</div>
        <div className="text-right text-ink-700 truncate">{ev.department}</div>

        <div className="text-ink-500">Автор</div>
        <div className="text-right text-ink-700 truncate">{ev.author}</div>
      </div>
    </article>
  )
}
