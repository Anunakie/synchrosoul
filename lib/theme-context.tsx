'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type AppTheme = 'starfield' | 'angels-teal' | 'angels-ghost' | 'bright' | 'light'

interface ThemeContextType {
  theme: AppTheme
  setTheme: (t: AppTheme) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'starfield',
  setTheme: () => {},
})

const THEME_KEY = 'synchrosoul_theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>('starfield')

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY) as AppTheme | null
    if (saved) {
      setThemeState(saved)
      applyThemeClass(saved)
    }
  }, [])

  function applyThemeClass(t: AppTheme) {
    const html = document.documentElement
    html.classList.remove('theme-starfield', 'theme-angels-teal', 'theme-angels-ghost', 'theme-bright', 'theme-light')
    html.classList.add('theme-' + t)
  }

  function setTheme(t: AppTheme) {
    setThemeState(t)
    localStorage.setItem(THEME_KEY, t)
    applyThemeClass(t)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}

export const THEMES: { id: AppTheme; label: string; emoji: string; thumbnail: string; overlay: string; isLight?: boolean }[] = [
  {
    id: 'starfield',
    label: 'Cosmos',
    emoji: '🌌',
    thumbnail: '',
    overlay: 'transparent',
  },
  {
    id: 'angels-teal',
    label: 'Celestial',
    emoji: '✨',
    thumbnail: '/bg-angels-teal.png',
    overlay: 'rgba(2,8,20,0.52)',
  },
  {
    id: 'angels-ghost',
    label: 'Sacred',
    emoji: '🕊️',
    thumbnail: '/bg-angels-ghost.png',
    overlay: 'rgba(0,0,0,0.42)',
  },
  {
    id: 'bright',
    label: 'Bright',
    emoji: '☀️',
    thumbnail: '',
    overlay: 'transparent',
  },
  {
    id: 'light',
    label: 'Light Mode',
    emoji: '🌙',
    thumbnail: '',
    overlay: 'transparent',
    isLight: true,
  },
]
