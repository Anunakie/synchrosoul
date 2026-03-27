'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type AppTheme = 'starfield' | 'angels-teal' | 'angels-ghost' | 'bright' | 'light' | 'simulation'

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
let simStyleTag: HTMLStyleElement | null = null

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
    .theme-light * { color: #1a0a3e !important; }
    .theme-light *[style*="color: rgba(255"],
    .theme-light *[style*="color:rgba(255"],
    .theme-light *[style*="color: white"],
    .theme-light *[style*="color: #fff"] { color: #1a0a3e !important; }
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
    .theme-light *[style*="background: rgba(3,"],
    .theme-light *[style*="background: rgba(4,"],
    .theme-light *[style*="background: rgba(5,"],
    .theme-light *[style*="background: rgba(6,"],
    .theme-light *[style*="background: rgba(7,"],
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
    .theme-light *[style*="background: linear-gradient(135deg,#0d0a"],
    .theme-light *[style*="background: linear-gradient(135deg,#050510"],
    .theme-light *[style*="background: linear-gradient(135deg,#0a0520"],
    .theme-light *[style*="background: linear-gradient(135deg,#0a0a"],
    .theme-light *[style*="background: linear-gradient(135deg, #0d0a"],
    .theme-light *[style*="background: linear-gradient(135deg, #050510"],
    .theme-light *[style*="background: linear-gradient(135deg, #0a0520"] {
      background: linear-gradient(135deg, #f0eeff 0%, #e8e4ff 50%, #ede8ff 100%) !important;
      border-color: rgba(109,40,217,0.25) !important;
    }
    .theme-light *[style*="background: rgba(6,0,0"],
    .theme-light *[style*="background: rgba(0,0,0"],
    .theme-light *[style*="background: black"],
    .theme-light *[style*="background: #000"] {
      background: rgba(255,240,240,0.95) !important;
      border-color: rgba(180,40,40,0.2) !important;
    }
    .theme-light input, .theme-light textarea, .theme-light select {
      background: rgba(255,255,255,0.95) !important;
      color: #1a0a3e !important;
      border-color: rgba(109,40,217,0.3) !important;
    }
    .theme-light input::placeholder, .theme-light textarea::placeholder { color: rgba(45,27,94,0.5) !important; }
    .theme-light button { color: #1a0a3e !important; }
    .theme-light button[style*="background: linear-gradient"],
    .theme-light button[style*="background:linear-gradient"] { color: white !important; }
    .theme-light nav, .theme-light header {
      background: rgba(240,238,255,0.95) !important;
      border-color: rgba(109,40,217,0.2) !important;
    }
    .theme-light button[style*="background: rgba"] {
      background: rgba(255,255,255,0.9) !important;
      border: 1px solid rgba(109,40,217,0.3) !important;
    }
    .theme-light ::-webkit-scrollbar-track { background: #e8e4ff; }
    .theme-light ::-webkit-scrollbar-thumb { background: rgba(109,40,217,0.4); }
  `
  document.head.appendChild(lightStyleTag)
}

function injectSimulationStyles() {
  if (simStyleTag) return
  simStyleTag = document.createElement('style')
  simStyleTag.id = 'synchrosoul-simulation-override'
  simStyleTag.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

    /* SIMULATION MODE - THE CODE IS EVERYWHERE */
    .theme-simulation,
    .theme-simulation body,
    .theme-simulation #__next,
    .theme-simulation main {
      background: #000800 !important;
      color: #00ff41 !important;
      font-family: 'Share Tech Mono', 'Courier New', monospace !important;
    }

    /* Force ALL text to matrix green */
    .theme-simulation * {
      color: #00ff41 !important;
      font-family: 'Share Tech Mono', 'Courier New', monospace !important;
      letter-spacing: 0.03em !important;
    }

    /* Override white/light text */
    .theme-simulation *[style*="color: rgba(255"],
    .theme-simulation *[style*="color:rgba(255"],
    .theme-simulation *[style*="color: white"],
    .theme-simulation *[style*="color: #fff"],
    .theme-simulation *[style*="color: rgb(255"] {
      color: #00ff41 !important;
    }

    /* Gold accents become bright green */
    .theme-simulation *[style*="color: #c9a84c"],
    .theme-simulation *[style*="color: #f0d080"],
    .theme-simulation *[style*="color: #ffd700"] {
      color: #00ff41 !important;
      text-shadow: 0 0 8px #00ff41 !important;
    }

    /* Purple accents become dim green */
    .theme-simulation *[style*="color: #a78bfa"],
    .theme-simulation *[style*="color: #9f7aea"],
    .theme-simulation *[style*="color: #6d28d9"] {
      color: #00cc33 !important;
    }

    /* All dark backgrounds -> deep black-green */
    .theme-simulation *[style*="background: rgba"] {
      background: rgba(0, 20, 0, 0.85) !important;
      border-color: rgba(0, 255, 65, 0.25) !important;
    }

    .theme-simulation *[style*="background: linear-gradient"] {
      background: linear-gradient(135deg, rgba(0,15,0,0.95) 0%, rgba(0,25,0,0.9) 100%) !important;
      border-color: rgba(0, 255, 65, 0.3) !important;
    }

    /* All cards get terminal style */
    .theme-simulation div[style*="border-radius"],
    .theme-simulation section[style*="border-radius"] {
      border-color: rgba(0, 255, 65, 0.2) !important;
      box-shadow: 0 0 12px rgba(0,255,65,0.08), inset 0 0 20px rgba(0,255,65,0.02) !important;
    }

    /* Inputs - terminal style */
    .theme-simulation input,
    .theme-simulation textarea,
    .theme-simulation select {
      background: rgba(0, 15, 0, 0.9) !important;
      color: #00ff41 !important;
      border: 1px solid rgba(0, 255, 65, 0.5) !important;
      caret-color: #00ff41 !important;
      outline: none !important;
    }

    .theme-simulation input:focus,
    .theme-simulation textarea:focus {
      border-color: #00ff41 !important;
      box-shadow: 0 0 8px rgba(0,255,65,0.4) !important;
    }

    .theme-simulation input::placeholder,
    .theme-simulation textarea::placeholder {
      color: rgba(0, 200, 50, 0.4) !important;
    }

    /* Buttons - terminal/CLI style */
    .theme-simulation button {
      color: #00ff41 !important;
      border-color: rgba(0, 255, 65, 0.4) !important;
      background: rgba(0, 20, 0, 0.8) !important;
      font-family: 'Share Tech Mono', monospace !important;
      text-transform: uppercase !important;
      letter-spacing: 0.08em !important;
      transition: all 0.15s ease !important;
    }

    .theme-simulation button:hover {
      background: rgba(0, 255, 65, 0.12) !important;
      border-color: #00ff41 !important;
      box-shadow: 0 0 12px rgba(0,255,65,0.3) !important;
    }

    /* Primary action buttons - bright green */
    .theme-simulation button[style*="background: linear-gradient"],
    .theme-simulation button[style*="background:linear-gradient"] {
      background: linear-gradient(135deg, #003300 0%, #004400 100%) !important;
      border: 1px solid #00ff41 !important;
      color: #00ff41 !important;
      box-shadow: 0 0 16px rgba(0,255,65,0.25) !important;
    }

    /* Nav bar */
    .theme-simulation nav,
    .theme-simulation header {
      background: rgba(0, 8, 0, 0.95) !important;
      border-color: rgba(0, 255, 65, 0.2) !important;
      backdrop-filter: blur(8px) !important;
    }

    /* Scrollbar */
    .theme-simulation ::-webkit-scrollbar-track { background: #000800; }
    .theme-simulation ::-webkit-scrollbar-thumb {
      background: rgba(0, 200, 50, 0.4);
      border-radius: 4px;
    }
    .theme-simulation ::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 255, 65, 0.6);
    }

    /* Glowing text effect for headings */
    .theme-simulation h1,
    .theme-simulation h2,
    .theme-simulation h3 {
      text-shadow: 0 0 10px rgba(0,255,65,0.6) !important;
    }

    /* Scanline overlay effect */
    .theme-simulation body::after {
      content: '';
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0, 0, 0, 0.03) 2px,
        rgba(0, 0, 0, 0.03) 4px
      );
      pointer-events: none;
      z-index: 9998;
    }

    /* Number/stat highlights */
    .theme-simulation *[style*="fontSize: '3rem'"],
    .theme-simulation *[style*="fontSize: '2rem'"],
    .theme-simulation *[style*="fontSize: '4rem'"] {
      color: #00ff41 !important;
      text-shadow: 0 0 20px rgba(0,255,65,0.8) !important;
    }

    /* Angel number quick-pick buttons */
    .theme-simulation button[style*="border-radius: '0.75rem'"],
    .theme-simulation button[style*="borderRadius: '0.75rem'"] {
      background: rgba(0, 20, 0, 0.9) !important;
      border: 1px solid rgba(0, 255, 65, 0.3) !important;
      color: #00cc33 !important;
    }

    /* Links */
    .theme-simulation a {
      color: #00ff41 !important;
      text-decoration: none !important;
    }
    .theme-simulation a:hover {
      color: #88ff88 !important;
      text-shadow: 0 0 8px rgba(0,255,65,0.5) !important;
    }

    /* Selection */
    .theme-simulation ::selection {
      background: rgba(0,255,65,0.25);
      color: #ffffff;
    }
  `
  document.head.appendChild(simStyleTag)
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

function removeSimulationStyles() {
  if (simStyleTag) {
    simStyleTag.remove()
    simStyleTag = null
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
    html.classList.remove('theme-starfield', 'theme-angels-teal', 'theme-angels-ghost', 'theme-bright', 'theme-light', 'theme-simulation')
    html.classList.add('theme-' + t)

    if (t === 'light') {
      injectLightModeStyles()
      removeSimulationStyles()
    } else if (t === 'simulation') {
      injectSimulationStyles()
      removeLightModeStyles()
    } else {
      removeLightModeStyles()
      removeSimulationStyles()
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

export const THEMES: { id: AppTheme; label: string; emoji: string; thumbnail: string; overlay: string; isLight?: boolean; isSim?: boolean }[] = [
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
  {
    id: 'simulation',
    label: 'Simulation',
    emoji: '🟢',
    thumbnail: '',
    overlay: 'transparent',
    isSim: true,
  },
]
