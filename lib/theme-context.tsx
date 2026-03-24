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

let observer: MutationObserver | null = null
let lightStyleTag: HTMLStyleElement | null = null

function injectLightModeStyles() {
  if (lightStyleTag) return
  lightStyleTag = document.createElement('style')
  lightStyleTag.id = 'synchrosoul-light-override'
  lightStyleTag.textContent = `
    /* NUCLEAR LIGHT MODE OVERRIDE */
    .theme-light,
    .theme-light body,
    .theme-light #__next,
    .theme-light main {
      background: #f0eeff !important;
      color: #1a0a3e !important;
    }

    /* Force ALL text dark */
    .theme-light * {
      color: #1a0a3e !important;
    }

    /* Override specific light-colored text */
    .theme-light *[style*="color: rgba(255"],
    .theme-light *[style*="color:rgba(255"],
    .theme-light *[style*="color: white"],
    .theme-light *[style*="color: #fff"] {
      color: #1a0a3e !important;
    }

    /* Make all dark glass cards white */
    .theme-light *[style*="background: rgba(255, 255, 255, 0.0"],
    .theme-light *[style*="background: rgba(255,255,255,0.0"],
    .theme-light *[style*="background: rgba(255, 255, 255, 0.1"],
    .theme-light *[style*="background: rgba(255,255,255,0.1"],
    .theme-light *[style*="background: rgba(255, 255, 255, 0.05"],
    .theme-light *[style*="background: rgba(255, 255, 255, 0.08"],
    .theme-light *[style*="background: rgba(255, 255, 255, 0.03"],
    .theme-light *[style*="background: rgba(255, 255, 255, 0.06"],
    .theme-light *[style*="background: rgba(255, 255, 255, 0.12"],
    .theme-light *[style*="background: rgba(255, 255, 255, 0.15"] {
      background: rgba(255,255,255,0.92) !important;
      border-color: rgba(109,40,217,0.25) !important;
    }

    /* Dark purple/navy backgrounds -> white cards */
    .theme-light *[style*="background: rgba(5,"],
    .theme-light *[style*="background: rgba(8,"],
    .theme-light *[style*="background: rgba(10,"],
    .theme-light *[style*="background: rgba(12,"],
    .theme-light *[style*="background: rgba(15,"],
    .theme-light *[style*="background: rgba(20,"],
    .theme-light *[style*="background: rgba(26,"],
    .theme-light *[style*="background: rgba(30,"] {
      background: rgba(255,255,255,0.88) !important;
      border-color: rgba(109,40,217,0.2) !important;
    }

    /* Inputs */
    .theme-light input,
    .theme-light textarea,
    .theme-light select {
      background: rgba(255,255,255,0.95) !important;
      color: #1a0a3e !important;
      border-color: rgba(109,40,217,0.3) !important;
    }

    .theme-light input::placeholder,
    .theme-light textarea::placeholder {
      color: rgba(45,27,94,0.5) !important;
    }

    /* Buttons - keep purple accent buttons readable */
    .theme-light button {
      color: #1a0a3e !important;
    }

    /* Purple/violet gradient buttons should keep white text */
    .theme-light button[style*="background: linear-gradient"],
    .theme-light button[style*="background:linear-gradient"] {
      color: white !important;
    }

    /* Nav */
    .theme-light nav,
    .theme-light header {
      background: rgba(240,238,255,0.95) !important;
      border-color: rgba(109,40,217,0.2) !important;
    }

    /* Number grid buttons */
    .theme-light button[style*="background: rgba"] {
      background: rgba(255,255,255,0.9) !important;
      border: 1px solid rgba(109,40,217,0.3) !important;
    }

    /* Scrollbar */
    .theme-light ::-webkit-scrollbar-track {
      background: #e8e4ff;
    }
    .theme-light ::-webkit-scrollbar-thumb {
      background: rgba(109,40,217,0.4);
    }
  `
  document.head.appendChild(lightStyleTag)
}

function removeLightModeStyles() {
  if (lightStyleTag) {
    lightStyleTag.remove()
    lightStyleTag = null
  }
  if (observer) {
    observer.disconnect()
    observer = null
  }
}

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

    if (t === 'light') {
      injectLightModeStyles()
    } else {
      removeLightModeStyles()
    }
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
