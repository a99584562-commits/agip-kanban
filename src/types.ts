export const SPEAKERS = [
  'Иванов А.С.',
  'Петров В.П.',
  'Сидорова Е.К.',
  'Кузнецов М.Н.',
  'Морозов О.Д.',
] as const

export const SPEAKER_ROLES: Record<Speaker, string> = {
  'Иванов А.С.': 'Глава региона',
  'Петров В.П.': 'Председатель Правительства',
  'Сидорова Е.К.': 'Заместитель Председателя',
  'Кузнецов М.Н.': 'Заместитель Председателя',
  'Морозов О.Д.': 'Министр экономики',
}

export const PRIORITIES = ['Глава', 'Премьер и зампреды', 'Фон'] as const

export const TRACKS = [
  'Трек 1',
  'Трек 2',
  'Трек 3',
  'Отработка рисков',
  'Нац проект',
] as const

export const TRACK_HINT: Record<Track, string> = {
  'Трек 1': 'Экономика и инвестиции',
  'Трек 2': 'Социальная политика',
  'Трек 3': 'Инфраструктура и ЖКХ',
  'Отработка рисков': 'Реагирование на повестку',
  'Нац проект': 'Национальные проекты',
}

export const FORMATS = [
  'Брифинг',
  'Интервью',
  'Совещание',
  'Пресс-конференция',
  'Выезд',
  'Публикация',
  'Прямой эфир',
] as const

export const DEPARTMENTS = [
  'Минэкономики',
  'Минздрав',
  'Минобр',
  'Минстрой',
  'Минсельхоз',
  'Минкульт',
  'Минцифры',
  'Минсоцполитики',
] as const

export const AUTHORS = [
  'Андреева М.',
  'Белова О.',
  'Григорьев П.',
  'Дмитриев К.',
  'Егорова Л.',
] as const

export type Speaker = typeof SPEAKERS[number]
export type Priority = typeof PRIORITIES[number]
export type Track = typeof TRACKS[number]
export type Format = typeof FORMATS[number]
export type Department = typeof DEPARTMENTS[number]
export type Author = typeof AUTHORS[number]

export type EventItem = {
  id: string
  infopovod: string
  speaker: Speaker
  priority: Priority
  track: Track
  format: Format
  department: Department
  author: Author
  date: string // ISO yyyy-mm-dd
  noExactDate: boolean
  goalText: string
}

export type GroupBy = 'speaker' | 'priority' | 'track'
