// lib/settings.ts

export interface UserSettings {
  displayName: string
  birthdate: string
  notifications: {
    dailyReminder: boolean
    reminderTime: string
    syncAlerts: boolean
    weeklyReport: boolean
  }
  privacy: {
    privacyMode: boolean
    showProfile: boolean
    showNumbers: boolean
    allowMatching: boolean
  }
  app: {
    defaultView: string
    soundEffects: boolean
    hapticFeedback: boolean
  }
}

const SETTINGS_KEY = 'synchrosoul_settings'

export const DEFAULT_SETTINGS: UserSettings = {
  displayName: '',
  birthdate: '',
  notifications: {
    dailyReminder: true,
    reminderTime: '09:00',
    syncAlerts: true,
    weeklyReport: true,
  },
  privacy: {
    privacyMode: false,
    showProfile: true,
    showNumbers: true,
    allowMatching: true,
  },
  app: {
    defaultView: 'home',
    soundEffects: false,
    hapticFeedback: true,
  },
}

export function getSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return DEFAULT_SETTINGS
    const saved = JSON.parse(raw)
    return {
      ...DEFAULT_SETTINGS,
      ...saved,
      privacy: { ...DEFAULT_SETTINGS.privacy, ...saved.privacy },
      notifications: { ...DEFAULT_SETTINGS.notifications, ...saved.notifications },
      app: { ...DEFAULT_SETTINGS.app, ...saved.app },
    }
  } catch { return DEFAULT_SETTINGS }
}

export function saveSettings(s: UserSettings): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s))
}
