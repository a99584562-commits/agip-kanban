import { useEffect, useState } from 'react'

export type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'agip-theme'

function read(): ThemeMode {
  if (typeof document === 'undefined') return 'light'
  const attr = document.documentElement.dataset.theme as ThemeMode | undefined
  return attr === 'dark' ? 'dark' : 'light'
}

export function useTheme(): [ThemeMode, (m: ThemeMode) => void, () => void] {
  const [theme, setThemeState] = useState<ThemeMode>(read)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {}
  }, [theme])

  function setTheme(m: ThemeMode) {
    setThemeState(m)
  }
  function toggle() {
    setThemeState((t) => (t === 'light' ? 'dark' : 'light'))
  }

  return [theme, setTheme, toggle]
}
