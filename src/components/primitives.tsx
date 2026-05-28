import { TAG_STYLES, STATUSES, type EventStatus } from '../types'

export function Avatar({
  initials,
  size = 36,
  className = '',
}: {
  initials: string
  size?: number
  className?: string
}) {
  return (
    <div
      className={`shrink-0 inline-flex items-center justify-center rounded-full font-bold tracking-tight text-white dark:text-[var(--on-accent)] ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.38),
        background: 'var(--avatar-gradient)',
        letterSpacing: '-0.02em',
      }}
    >
      {initials}
    </div>
  )
}

export function Pill({
  name,
  dense = false,
  withDot = false,
}: {
  name: string
  dense?: boolean
  withDot?: boolean
}) {
  const s = TAG_STYLES[name] ?? TAG_STYLES['Фон']
  return (
    <span
      data-theme-pill={name}
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap ${
        dense ? 'px-2 py-[3px] text-[10.5px]' : 'px-2.5 py-1 text-[11.5px]'
      }`}
      style={{
        background: s.bg,
        color: s.fg,
        letterSpacing: '-0.005em',
      }}
    >
      {withDot && (
        <span
          className="inline-block rounded-full"
          style={{ width: 6, height: 6, background: s.dot }}
        />
      )}
      {name}
    </span>
  )
}

export function StatusBadge({
  status,
  dense = false,
}: {
  status: EventStatus
  dense?: boolean
}) {
  const s = STATUSES[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap ${
        dense ? 'px-2 py-[3px] text-[10.5px]' : 'px-2.5 py-1 text-[11.5px]'
      }`}
      style={{ background: s.bg, color: s.fg }}
    >
      <span
        className="inline-block rounded-full"
        style={{ width: 6, height: 6, background: s.dot }}
      />
      {s.label}
    </span>
  )
}

export function IconButton({
  title,
  onClick,
  children,
  active = false,
}: {
  title: string
  onClick: () => void
  children: React.ReactNode
  active?: boolean
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
        active
          ? 'bg-[var(--primary)] text-[var(--on-primary)]'
          : 'text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
      }`}
    >
      {children}
    </button>
  )
}
