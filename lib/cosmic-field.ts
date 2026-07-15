// lib/cosmic-field.ts
// Cosmic Field — live Earth space-weather + global consciousness snapshot.
// ADMIN-ONLY private beta. All external fetches happen server-side.

// ── Admin gate ──────────────────────────────────────────────────────────────
const COSMIC_FIELD_ADMINS = ['dezekiel@live.com']

export function isCosmicFieldAdmin(email: string | null | undefined): boolean {
  if (!email) return false
  return COSMIC_FIELD_ADMINS.includes(email.toLowerCase().trim())
}

// ── Types ───────────────────────────────────────────────────────────────────
export interface SolarData {
  windSpeed: number | null // km/s
  density: number | null // p/cm³
  bz: number | null // nT (GSM)
  bt: number | null // nT
  bzDirection: 'southward' | 'northward' | null
  kp: number | null // 0-9
  kpLabel: string | null // Quiet / Unsettled / Active / Storm
  flareClass: string | null // e.g. "B6.6"
}

export interface ConsciousnessData {
  available: boolean
  coherence?: 'Normal' | 'Elevated' | 'High' | 'Very High' | 'Extreme'
  value?: number | null // current network variance (netvar)
}

export interface MoonData {
  phase: string
  illumination: number // percent 0-100
  emoji: string
}

export interface CosmicSnapshot {
  timestamp: string
  solar: SolarData
  consciousness: ConsciousnessData
  moon: MoonData
}

// ── Moon phase (local computation, no API) ─────────────────────────────────
// Simple synodic-month calculation anchored to a known new moon.
const SYNODIC_MONTH = 29.530588853 // days
const KNOWN_NEW_MOON_UTC = Date.UTC(2000, 0, 6, 18, 14, 0) // 2000-01-06 18:14 UTC

export function computeMoonPhase(date: Date = new Date()): MoonData {
  const daysSince = (date.getTime() - KNOWN_NEW_MOON_UTC) / 86400000
  const age = ((daysSince % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH
  const frac = age / SYNODIC_MONTH // 0 = new, 0.5 = full
  const illumination = Math.round(((1 - Math.cos(2 * Math.PI * frac)) / 2) * 1000) / 10

  let phase: string
  let emoji: string
  if (frac < 0.0339 || frac >= 0.9661) { phase = 'New Moon'; emoji = '🌑' }
  else if (frac < 0.2161) { phase = 'Waxing Crescent'; emoji = '🌒' }
  else if (frac < 0.2839) { phase = 'First Quarter'; emoji = '🌓' }
  else if (frac < 0.4661) { phase = 'Waxing Gibbous'; emoji = '🌔' }
  else if (frac < 0.5339) { phase = 'Full Moon'; emoji = '🌕' }
  else if (frac < 0.7161) { phase = 'Waning Gibbous'; emoji = '🌖' }
  else if (frac < 0.7839) { phase = 'Last Quarter'; emoji = '🌗' }
  else { phase = 'Waning Crescent'; emoji = '🌘' }

  return { phase, illumination, emoji }
}

// ── NOAA SWPC fetchers ──────────────────────────────────────────────────────
const FETCH_TIMEOUT_MS = 8000

async function fetchJson(url: string): Promise<unknown> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
    return await res.json()
  } finally {
    clearTimeout(timer)
  }
}

function kpToLabel(kp: number): string {
  if (kp < 3) return 'Quiet'
  if (kp < 4) return 'Unsettled'
  if (kp < 5) return 'Active'
  return 'Storm'
}

// Convert GOES long-band X-ray flux (W/m²) to flare class, e.g. 6.6e-7 → "B6.6"
function fluxToFlareClass(flux: number): string | null {
  if (!Number.isFinite(flux) || flux <= 0) return null
  if (flux < 1e-7) return `A${(flux / 1e-8).toFixed(1)}`
  if (flux < 1e-6) return `B${(flux / 1e-7).toFixed(1)}`
  if (flux < 1e-5) return `C${(flux / 1e-6).toFixed(1)}`
  if (flux < 1e-4) return `M${(flux / 1e-5).toFixed(1)}`
  return `X${(flux / 1e-4).toFixed(1)}`
}

async function fetchSolar(): Promise<SolarData> {
  const solar: SolarData = {
    windSpeed: null, density: null, bz: null, bt: null,
    bzDirection: null, kp: null, kpLabel: null, flareClass: null,
  }

  // Solar wind speed + density (newest entry is index 0)
  try {
    const wind = await fetchJson('https://services.swpc.noaa.gov/json/rtsw/rtsw_wind_1m.json') as Array<{
      proton_speed?: number | null; proton_density?: number | null
    }>
    const latest = Array.isArray(wind)
      ? wind.find(w => typeof w?.proton_speed === 'number')
      : null
    if (latest) {
      solar.windSpeed = typeof latest.proton_speed === 'number' ? Math.round(latest.proton_speed) : null
      solar.density = typeof latest.proton_density === 'number' ? Math.round(latest.proton_density * 100) / 100 : null
    }
  } catch { /* partial data is fine */ }

  // Magnetic field Bz / Bt (newest entry is index 0)
  try {
    const mag = await fetchJson('https://services.swpc.noaa.gov/json/rtsw/rtsw_mag_1m.json') as Array<{
      bz_gsm?: number | null; bt?: number | null
    }>
    const latest = Array.isArray(mag)
      ? mag.find(m => typeof m?.bz_gsm === 'number')
      : null
    if (latest) {
      solar.bz = typeof latest.bz_gsm === 'number' ? Math.round(latest.bz_gsm * 10) / 10 : null
      solar.bt = typeof latest.bt === 'number' ? Math.round(latest.bt * 10) / 10 : null
      if (solar.bz !== null) solar.bzDirection = solar.bz < 0 ? 'southward' : 'northward'
    }
  } catch { /* partial data is fine */ }

  // Planetary Kp index (array of objects, oldest → newest)
  try {
    const kpData = await fetchJson('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json') as Array<{
      Kp?: number | string | null
    }>
    if (Array.isArray(kpData) && kpData.length > 0) {
      for (let i = kpData.length - 1; i >= 0; i--) {
        const raw = kpData[i]?.Kp
        const kp = typeof raw === 'number' ? raw : parseFloat(String(raw ?? ''))
        if (Number.isFinite(kp)) {
          solar.kp = Math.round(kp)
          solar.kpLabel = kpToLabel(kp)
          break
        }
      }
    }
  } catch { /* partial data is fine */ }

  // X-ray flux → current flare class (oldest → newest; use long band 0.1-0.8nm)
  try {
    const xray = await fetchJson('https://services.swpc.noaa.gov/json/goes/primary/xrays-6-hour.json') as Array<{
      flux?: number | null; energy?: string | null
    }>
    if (Array.isArray(xray)) {
      for (let i = xray.length - 1; i >= 0; i--) {
        const row = xray[i]
        if (row?.energy === '0.1-0.8nm' && typeof row.flux === 'number') {
          solar.flareClass = fluxToFlareClass(row.flux)
          break
        }
      }
    }
  } catch { /* partial data is fine */ }

  return solar
}

// ── GCP2 / Global Consciousness (rng.observer) ─────────────────────────────
// Endpoint discovered from the GCP 2.0 live-data app bundle: their SPA polls
// GET https://rng.observer/api/gcp2 every 10s. Structure:
//   currentNetvar.netvar[0].netvar        → current network variance (string)
//   netvarAggregate24H.aggregates[]       → 24h of per-minute aggregates
// No documented coherence label exists publicly, so we derive one from the
// percentile of the latest aggregate within its own 24h distribution.
function percentileToCoherence(p: number): ConsciousnessData['coherence'] {
  if (p >= 99) return 'Extreme'
  if (p >= 95) return 'Very High'
  if (p >= 85) return 'High'
  if (p >= 70) return 'Elevated'
  return 'Normal'
}

async function fetchConsciousness(): Promise<ConsciousnessData> {
  try {
    const data = await fetchJson('https://rng.observer/api/gcp2') as {
      currentNetvar?: { netvar?: Array<{ netvar?: string | number }> }
      netvarAggregate24H?: { aggregates?: Array<{ netvar_aggregate?: string | number }> }
    }

    const rawValue = data?.currentNetvar?.netvar?.[0]?.netvar
    const value = rawValue !== undefined ? parseFloat(String(rawValue)) : NaN

    const aggregates = (data?.netvarAggregate24H?.aggregates ?? [])
      .map(a => parseFloat(String(a?.netvar_aggregate)))
      .filter(n => Number.isFinite(n))

    if (!Number.isFinite(value) && aggregates.length === 0) {
      return { available: false }
    }

    let coherence: ConsciousnessData['coherence'] = 'Normal'
    if (aggregates.length >= 30) {
      const latest = aggregates[aggregates.length - 1]
      const below = aggregates.filter(a => a <= latest).length
      const percentile = (below / aggregates.length) * 100
      coherence = percentileToCoherence(percentile)
    }

    return {
      available: true,
      coherence,
      value: Number.isFinite(value) ? Math.round(value * 100) / 100 : null,
    }
  } catch {
    return { available: false }
  }
}

// ── Snapshot assembly with in-memory cache ──────────────────────────────────
const CACHE_TTL_MS = 5 * 60 * 1000 // ~5 minutes: be gentle with NOAA

let cachedSnapshot: CosmicSnapshot | null = null
let cachedAt = 0
let inflight: Promise<CosmicSnapshot> | null = null

async function buildSnapshot(): Promise<CosmicSnapshot> {
  const [solar, consciousness] = await Promise.all([
    fetchSolar().catch((): SolarData => ({
      windSpeed: null, density: null, bz: null, bt: null,
      bzDirection: null, kp: null, kpLabel: null, flareClass: null,
    })),
    fetchConsciousness().catch((): ConsciousnessData => ({ available: false })),
  ])

  return {
    timestamp: new Date().toISOString(),
    solar,
    consciousness,
    moon: computeMoonPhase(),
  }
}

export async function fetchCosmicSnapshot(): Promise<CosmicSnapshot> {
  const now = Date.now()
  if (cachedSnapshot && now - cachedAt < CACHE_TTL_MS) return cachedSnapshot
  if (inflight) return inflight

  inflight = buildSnapshot()
    .then(snapshot => {
      cachedSnapshot = snapshot
      cachedAt = Date.now()
      return snapshot
    })
    .finally(() => { inflight = null })

  return inflight
}
