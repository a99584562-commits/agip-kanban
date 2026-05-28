import type { GroupBy } from './types'

export type Theme = {
  num: string
  label: string
  short: string
  // tailwind tokens
  ringSoft: string
  ringStrong: string
  surfaceSoft: string
  surfaceActive: string
  textOn: string
  textAccent: string
  hex: string
  hexSoft: string
  columnGradient: string
  glowDot: string
}

export const THEMES: Record<GroupBy, Theme> = {
  speaker: {
    num: '01',
    label: 'По спикерам',
    short: 'Спикеры',
    ringSoft: 'ring-indigo-200/70',
    ringStrong: 'ring-indigo-500/40',
    surfaceSoft: 'bg-indigo-50/60',
    surfaceActive: 'bg-indigo-600',
    textOn: 'text-white',
    textAccent: 'text-indigo-700',
    hex: '#4f46e5',
    hexSoft: '#eef2ff',
    columnGradient: 'from-indigo-100/80 via-indigo-50/40 to-transparent',
    glowDot: 'bg-indigo-500',
  },
  priority: {
    num: '02',
    label: 'По приоритетам',
    short: 'Приоритеты',
    ringSoft: 'ring-sky-200/70',
    ringStrong: 'ring-sky-500/40',
    surfaceSoft: 'bg-sky-50/60',
    surfaceActive: 'bg-sky-600',
    textOn: 'text-white',
    textAccent: 'text-sky-700',
    hex: '#0284c7',
    hexSoft: '#e0f2fe',
    columnGradient: 'from-sky-100/80 via-sky-50/40 to-transparent',
    glowDot: 'bg-sky-500',
  },
  track: {
    num: '03',
    label: 'По целям',
    short: 'Цели',
    ringSoft: 'ring-emerald-200/70',
    ringStrong: 'ring-emerald-500/40',
    surfaceSoft: 'bg-emerald-50/60',
    surfaceActive: 'bg-emerald-600',
    textOn: 'text-white',
    textAccent: 'text-emerald-700',
    hex: '#059669',
    hexSoft: '#ecfdf5',
    columnGradient: 'from-emerald-100/80 via-emerald-50/40 to-transparent',
    glowDot: 'bg-emerald-500',
  },
}
