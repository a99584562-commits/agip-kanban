import type { GroupBy } from '../types'

type Tab = { id: GroupBy; n: string; label: string }
const TABS: Tab[] = [
  { id: 'speaker', n: 'Отчёт №1', label: 'По спикерам' },
  { id: 'priority', n: 'Отчёт №2', label: 'По приоритетам' },
  { id: 'track', n: 'Отчёт №3', label: 'По целям' },
]

export function TabSwitcher({
  active,
  onChange,
  variant = 'desktop',
}: {
  active: GroupBy
  onChange: (g: GroupBy) => void
  variant?: 'desktop' | 'mobile'
}) {
  if (variant === 'mobile') {
    return (
      <div className="flex border-b border-[var(--border)] bg-[var(--surface)]">
        {TABS.map((t) => {
          const isActive = active === t.id
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className="relative flex-1 px-1 py-3.5 text-[13px] transition-colors"
              style={{
                color: isActive ? 'var(--text)' : 'var(--text-2)',
                fontWeight: isActive ? 700 : 500,
              }}
            >
              {t.label}
              {isActive && (
                <span
                  className="absolute left-1/2 -translate-x-1/2 bottom-0 h-[2px] w-10 rounded-full"
                  style={{ background: 'var(--accent)' }}
                />
              )}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex gap-8">
      {TABS.map((t) => {
        const isActive = active === t.id
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className="group relative flex items-baseline gap-2 pb-3.5 transition-colors"
            style={{ marginBottom: -1 }}
          >
            <span className="eyebrow text-[var(--text-3)]">{t.n}</span>
            <span
              className="text-[15px] transition-colors"
              style={{
                color: isActive ? 'var(--text)' : 'var(--text-2)',
                fontWeight: isActive ? 700 : 500,
              }}
            >
              {t.label}
            </span>
            <span
              className="absolute left-0 right-0 -bottom-px h-[2px] rounded-full transition-opacity"
              style={{
                background: 'var(--accent)',
                opacity: isActive ? 1 : 0,
              }}
            />
          </button>
        )
      })}
    </div>
  )
}
