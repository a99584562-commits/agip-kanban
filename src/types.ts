export type SpeakerId =
  | 'ivanov'
  | 'petrov'
  | 'sidorova'
  | 'kuznetsov'
  | 'morozov'

export type Speaker = {
  id: SpeakerId
  short: string
  full: string
  role: string
  initials: string
}

export const SPEAKERS: Speaker[] = [
  { id: 'ivanov', short: 'Иванов А.С.', full: 'Иванов Алексей Сергеевич', role: 'Глава региона', initials: 'ИА' },
  { id: 'petrov', short: 'Петров В.П.', full: 'Петров Виктор Павлович', role: 'Председатель Правительства', initials: 'ПВ' },
  { id: 'sidorova', short: 'Сидорова Е.К.', full: 'Сидорова Елена Константиновна', role: 'Заместитель Председателя', initials: 'СЕ' },
  { id: 'kuznetsov', short: 'Кузнецов М.Н.', full: 'Кузнецов Михаил Николаевич', role: 'Заместитель Председателя', initials: 'КМ' },
  { id: 'morozov', short: 'Морозов О.Д.', full: 'Морозов Олег Дмитриевич', role: 'Заместитель Председателя', initials: 'МО' },
]

export const SPEAKER_BY_ID: Record<SpeakerId, Speaker> = SPEAKERS.reduce(
  (acc, s) => {
    acc[s.id] = s
    return acc
  },
  {} as Record<SpeakerId, Speaker>,
)

export const PRIORITY_TAGS = ['Глава', 'Премьер и зампреды', 'Фон'] as const
export const TRACK_TAGS = [
  'Трек 1',
  'Трек 2',
  'Трек 3',
  'Отработка рисков',
  'Нац проект',
] as const
export const FORMAT_TAGS = [
  'Выезд',
  'Пресс-конференция',
  'Совещание',
  'Интервью',
  'Брифинг',
  'Прямой эфир',
  'Публикация',
] as const

export type Priority = (typeof PRIORITY_TAGS)[number]
export type Track = (typeof TRACK_TAGS)[number]
export type Format = (typeof FORMAT_TAGS)[number]
export type EventStatus = 'plan' | 'done' | 'review' | 'attention'

export const TRACK_HINT: Record<Track, string> = {
  'Трек 1': 'Экономика и инвестиции',
  'Трек 2': 'Социальная политика',
  'Трек 3': 'Инфраструктура и ЖКХ',
  'Отработка рисков': 'Реагирование на повестку',
  'Нац проект': 'Национальные проекты',
}

export type EventItem = {
  id: number
  speakerId: SpeakerId
  title: string
  goal: string
  tags: string[]
  date: string | null
  ministry: string
  author: string
  status: EventStatus
}

export type GroupBy = 'speaker' | 'priority' | 'track'

// Tag palette (light theme base; dark theme derives via opacity)
export type TagStyle = { bg: string; fg: string; dot: string }
export const TAG_STYLES: Record<string, TagStyle> = {
  'Глава': { bg: '#ECE7FB', fg: '#5742B8', dot: '#7B68E8' },
  'Премьер и зампреды': { bg: '#DCE7FB', fg: '#2E55B5', dot: '#4577E0' },
  'Фон': { bg: '#EEF0F4', fg: '#525A6C', dot: '#8892A8' },
  'Выезд': { bg: '#D8EFDF', fg: '#2A7553', dot: '#3FA76F' },
  'Пресс-конференция': { bg: '#FBE0E0', fg: '#A8383A', dot: '#D45C5E' },
  'Совещание': { bg: '#DCE9FB', fg: '#2E5BB5', dot: '#4577E0' },
  'Интервью': { bg: '#EADAFB', fg: '#6E3AC0', dot: '#9968D6' },
  'Брифинг': { bg: '#FBE7CC', fg: '#A26318', dot: '#D08A35' },
  'Прямой эфир': { bg: '#FCE0EC', fg: '#A03062', dot: '#D44C8C' },
  'Публикация': { bg: '#DCE7FB', fg: '#2E55B5', dot: '#4577E0' },
  'Трек 1': { bg: '#EEF0F4', fg: '#525A6C', dot: '#8892A8' },
  'Трек 2': { bg: '#EEF0F4', fg: '#525A6C', dot: '#8892A8' },
  'Трек 3': { bg: '#EEF0F4', fg: '#525A6C', dot: '#8892A8' },
  'Нац проект': { bg: '#EEF0F4', fg: '#525A6C', dot: '#8892A8' },
  'Отработка рисков': { bg: '#EEF0F4', fg: '#525A6C', dot: '#8892A8' },
}

export const STATUSES: Record<EventStatus, { label: string; bg: string; fg: string; dot: string }> = {
  plan: { label: 'План', bg: '#FEF2D8', fg: '#7C5410', dot: '#D9A33A' },
  done: { label: 'Отчёт сдан', bg: '#E1F1E5', fg: '#1E6B43', dot: '#3FA76F' },
  review: { label: 'На согласовании', bg: '#E3E9F8', fg: '#274C9B', dot: '#4577E0' },
  attention: { label: 'Внимание', bg: '#FBE0E0', fg: '#A8383A', dot: '#D45C5E' },
}

export function getPriority(ev: EventItem): Priority | null {
  for (const t of ev.tags) if ((PRIORITY_TAGS as readonly string[]).includes(t)) return t as Priority
  return null
}
export function getTrack(ev: EventItem): Track | null {
  for (const t of ev.tags) if ((TRACK_TAGS as readonly string[]).includes(t)) return t as Track
  return null
}
export function getFormat(ev: EventItem): Format | null {
  for (const t of ev.tags) if ((FORMAT_TAGS as readonly string[]).includes(t)) return t as Format
  return null
}

export const ru = {
  formatDate(iso: string | null): string {
    if (!iso) return 'без точной даты'
    const months = ['янв.', 'фев.', 'мар.', 'апр.', 'мая', 'июн.', 'июл.', 'авг.', 'сен.', 'окт.', 'ноя.', 'дек.']
    const d = new Date(iso)
    return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()} г.`
  },
  shortDate(iso: string | null): string {
    if (!iso) return '—'
    const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
    const d = new Date(iso)
    return `${d.getDate()} ${months[d.getMonth()]}`
  },
}
