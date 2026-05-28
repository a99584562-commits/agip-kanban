import type { GroupBy } from '../types'
import { THEMES } from '../theme'

const ORDER: GroupBy[] = ['speaker', 'priority', 'track']

export function TabSwitcher({
  active,
  onChange,
}: {
  active: GroupBy
  onChange: (g: GroupBy) => void
}) {
  return (
    <div className="flex gap-2.5">
      {ORDER.map((id) => {
        const t = THEMES[id]
        const isActive = active === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`group relative rounded-2xl p-[3px] transition-all duration-500 ease-glide focus:outline-none ${
              isActive
                ? `ring-2 ${t.ringStrong} shadow-glow`
                : `ring-1 ${t.ringSoft} hover:ring-2 ${t.ringStrong} shadow-soft`
            }`}
            style={
              isActive
                ? { background: `linear-gradient(180deg, ${t.hex}33, ${t.hex}10)` }
                : undefined
            }
          >
            <div
              className={`rounded-[14px] px-4 py-2.5 text-left transition-colors duration-300 ${
                isActive ? `${t.surfaceActive} ${t.textOn}` : 'bg-white text-ink-900'
              }`}
              style={{ minWidth: 178 }}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div
                    className={`eyebrow ${
                      isActive ? 'text-white/70' : 'text-ink-400'
                    }`}
                  >
                    Отчёт · {t.num}
                  </div>
                  <div
                    className={`mt-0.5 font-display text-[14px] font-bold tracking-[-0.01em] ${
                      isActive ? 'text-white' : 'text-ink-900'
                    }`}
                  >
                    {t.label}
                  </div>
                </div>
                <span
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-500 ease-glide group-hover:-translate-y-[1px] group-hover:translate-x-[1px] ${
                    isActive
                      ? 'bg-white/15 text-white'
                      : `${t.surfaceSoft} ${t.textAccent}`
                  }`}
                  aria-hidden
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
