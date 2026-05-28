import { useTheme } from '../theme'
import { DownloadIcon, MoonIcon, SearchIcon, SunIcon } from './icons'

function Avatar({ initials }: { initials: string }) {
  return (
    <div
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-bold tracking-tight text-white"
      style={{ background: 'var(--avatar-gradient)' }}
    >
      {initials}
    </div>
  )
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, , toggle] = useTheme()
  return (
    <button
      onClick={toggle}
      title={theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
      className={`inline-flex items-center justify-center rounded-full border transition-colors ${
        compact ? 'h-9 w-9' : 'h-9 px-3 gap-2'
      }`}
      style={{
        background: 'var(--segment-bg)',
        borderColor: 'var(--segment-border)',
        color: 'var(--text-2)',
        backdropFilter: 'blur(10px)',
        boxShadow: 'var(--segment-shadow)',
      }}
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
      {!compact && (
        <span className="text-[12.5px] font-semibold text-[var(--text)]">
          {theme === 'light' ? 'Тёмная' : 'Светлая'}
        </span>
      )}
    </button>
  )
}

export function PdfButton({
  onClick,
  disabled,
  label,
  short,
}: {
  onClick: () => void
  disabled?: boolean
  label?: string
  short?: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="group inline-flex items-center gap-2 rounded-full pl-4 pr-1 py-1 text-[12.5px] font-semibold transition-transform duration-300 ease-glide active:scale-[.985] disabled:opacity-60 disabled:cursor-wait"
      style={{ background: 'var(--primary)', color: 'var(--on-primary)' }}
      title={label}
    >
      {disabled ? (
        'Готовим PDF…'
      ) : (
        <>
          Скачать PDF
          {short && (
            <span className="opacity-60 text-[11px] font-normal hidden md:inline">
              · {short}
            </span>
          )}
        </>
      )}
      <span
        className="inline-flex h-7 w-7 items-center justify-center rounded-full"
        style={{ background: 'rgba(255,255,255,0.18)' }}
      >
        <DownloadIcon size={12} />
      </span>
    </button>
  )
}

export function DesktopTopbar({
  onExport,
  exporting,
  pdfLabel,
  pdfShort,
  search,
  onSearch,
  count,
  total,
}: {
  onExport: () => void
  exporting: boolean
  pdfLabel: string
  pdfShort: string
  search: string
  onSearch: (v: string) => void
  count: number
  total: number
}) {
  return (
    <div
      className="shrink-0 border-b border-[var(--border)] bg-[var(--surface)] px-6 py-2.5 flex items-center justify-between gap-6"
      style={{ boxShadow: 'var(--topbar-shadow)' }}
    >
      <div className="flex items-center gap-3 shrink-0">
        <div
          className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] text-[13px] font-extrabold tracking-wider"
          style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
        >
          АГ
        </div>
        <div className="leading-tight">
          <div className="text-[14px] font-extrabold tracking-[-0.01em] text-[var(--text)]">
            Отчёты по&nbsp;мероприятиям
          </div>
          <div className="text-[11px] text-[var(--text-3)]">
            АГИП · Июнь 2026 ·{' '}
            <b className="text-[var(--text-2)] tabular-nums">{count}</b>
            {count !== total && (
              <span className="text-[var(--text-3)]"> / {total}</span>
            )}{' '}
            мероприятий
          </div>
        </div>
      </div>

      <label className="flex items-center gap-2.5 rounded-xl border bg-[var(--surface-2)] border-[var(--border)] px-3.5 py-2.5 transition-colors focus-within:border-[var(--primary)] flex-1 max-w-[420px]">
        <SearchIcon className="text-[var(--text-3)]" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Поиск по мероприятиям…"
          className="w-full bg-transparent text-[13px] text-[var(--text)] placeholder:text-[var(--text-3)] outline-none"
        />
        {search && (
          <button
            onClick={() => onSearch('')}
            className="text-[11px] text-[var(--text-3)] hover:text-[var(--text)]"
          >
            сброс
          </button>
        )}
      </label>

      <div className="flex items-center gap-3 shrink-0">
        <ThemeToggle compact />
        <PdfButton
          onClick={onExport}
          disabled={exporting}
          label={`Скачать «${pdfLabel}» в PDF`}
          short={pdfShort}
        />
        <Avatar initials="РА" />
      </div>
    </div>
  )
}

