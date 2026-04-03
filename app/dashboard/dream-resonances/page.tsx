"use client"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useTheme } from "@/lib/theme-context"

interface DreamResonance {
  dreamId: string
  userId: string
  userName: string
  userAvatar: string | null
  userAvatarColor: string
  lifePath: number | null
  dreamTitle: string
  dreamDescription: string
  themes: string[]
  sharedAt: string
  resonanceScore: number
  matchedThemes: string[]
}

interface MySharedDream {
  id: string
  title: string
  description: string
  themes: string[]
  sharedAt: string
}

export default function DreamResonancesPage() {
  const { theme } = useTheme()
  const isSim = theme === "simulation"
  const [resonances, setResonances] = useState<DreamResonance[]>([])
  const [mySharedDreams, setMySharedDreams] = useState<MySharedDream[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<DreamResonance | null>(null)

  useEffect(() => {
    fetch("/api/dreams/resonances")
      .then(r => r.json())
      .then(data => {
        setResonances(data.resonances || [])
        setMySharedDreams(data.mySharedDreams || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  function formatDate(iso: string): string {
    if (!iso) return ''
    const d = new Date(iso)
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const styles = {
    page: { minHeight: "100vh", padding: "1.5rem", color: isSim ? "#00ff41" : "#e2d9f3" },
    header: { marginBottom: "1.5rem" },
    title: { fontSize: "1.8rem", fontWeight: 700, color: isSim ? "#00ff41" : "#f0c040", fontFamily: isSim ? "monospace" : "inherit", textShadow: isSim ? "0 0 10px #00ff41" : "none" },
    subtitle: { color: isSim ? "#00cc33" : "#b8a9d0", fontSize: "0.9rem", marginTop: "0.3rem", fontFamily: isSim ? "monospace" : "inherit" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" },
    card: { background: isSim ? "rgba(0,20,0,0.75)" : "rgba(20,10,50,0.85)", border: isSim ? "1px solid #00ff4140" : "1px solid rgba(240,192,64,0.2)", borderRadius: isSim ? "2px" : "12px", padding: "1.2rem", cursor: "pointer", transition: "border-color 0.2s" },
    userName: { fontWeight: 600, color: isSim ? "#00ff41" : "#f0c040", fontFamily: isSim ? "monospace" : "inherit", fontSize: "0.95rem" },
    dreamTitle: { color: isSim ? "#88ff88" : "#e2d9f3", fontWeight: 600, margin: "0.5rem 0 0.3rem", fontFamily: isSim ? "monospace" : "inherit" },
    dreamPreview: { color: isSim ? "#00cc33" : "#b8a9d0", fontSize: "0.85rem", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as const, overflow: "hidden" },
    scoreBar: { marginTop: "0.8rem", background: isSim ? "#001800" : "rgba(255,255,255,0.1)", borderRadius: "4px", height: "4px", overflow: "hidden" },
    scoreFill: (score: number) => ({ width: `${score}%`, height: "100%", background: isSim ? "#00ff41" : "linear-gradient(90deg,#9b59b6,#f0c040)", transition: "width 0.8s" }),
    themes: { display: "flex", flexWrap: "wrap" as const, gap: "0.3rem", marginTop: "0.6rem" },
    theme: { fontSize: "0.7rem", padding: "0.15rem 0.4rem", borderRadius: isSim ? "1px" : "999px", background: isSim ? "rgba(0,255,65,0.15)" : "rgba(155,89,182,0.3)", color: isSim ? "#00ff41" : "#d4aaff", fontFamily: isSim ? "monospace" : "inherit" },
    matchedTheme: { background: isSim ? "rgba(0,255,65,0.35)" : "rgba(240,192,64,0.3)", color: isSim ? "#ffffff" : "#f0c040" },
    connectBtn: { marginTop: "0.8rem", width: "100%", padding: "0.5rem", background: isSim ? "transparent" : "rgba(155,89,182,0.4)", border: isSim ? "1px solid #00ff41" : "1px solid rgba(155,89,182,0.6)", color: isSim ? "#00ff41" : "#d4aaff", borderRadius: isSim ? "2px" : "8px", cursor: "pointer", fontFamily: isSim ? "monospace" : "inherit", fontSize: "0.85rem", letterSpacing: isSim ? "0.05em" : "normal" },
    empty: { textAlign: "center" as const, padding: "3rem", color: isSim ? "#00cc33" : "#b8a9d0", fontFamily: isSim ? "monospace" : "inherit" },
    modal: { position: "fixed" as const, inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" },
    modalInner: { background: isSim ? "rgba(0,15,0,0.98)" : "rgba(20,10,50,0.98)", border: isSim ? "1px solid #00ff41" : "1px solid rgba(240,192,64,0.4)", borderRadius: isSim ? "2px" : "16px", padding: "1.5rem", maxWidth: "500px", width: "100%", maxHeight: "80vh", overflowY: "auto" as const },
    sectionTitle: { fontSize: "1.1rem", fontWeight: 600, color: isSim ? "#00ff41" : "#9b59b6", fontFamily: isSim ? "monospace" : "inherit", marginBottom: "0.8rem", marginTop: "0.5rem" },
    myDreamCard: { background: isSim ? "rgba(0,30,0,0.75)" : "rgba(155,89,182,0.12)", border: isSim ? "1px solid #00ff4130" : "1px solid rgba(155,89,182,0.25)", borderRadius: isSim ? "2px" : "10px", padding: "1rem" },
    myDreamTitle: { fontWeight: 600, color: isSim ? "#88ff88" : "#e2d9f3", fontFamily: isSim ? "monospace" : "inherit", fontSize: "0.95rem" },
    myDreamDesc: { color: isSim ? "#00cc33" : "#b8a9d0", fontSize: "0.82rem", marginTop: "0.3rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" },
    myDreamDate: { color: isSim ? "#007720" : "rgba(155,89,182,0.6)", fontSize: "0.72rem", marginTop: "0.4rem", fontFamily: isSim ? "monospace" : "inherit" },
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          {isSim ? ">> RESONANT MEMORY PATTERNS" : "🌙 Dream Resonances"}
        </h1>
        <p style={styles.subtitle}>
          {isSim
            ? "Subjects sharing overlapping memory fragment signatures"
            : "Others dreaming on the same frequency as you"}
        </p>
      </div>

      {/* Your Shared Dreams Section */}
      {!loading && mySharedDreams.length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={styles.sectionTitle}>
            {isSim ? ">> YOUR SHARED MEMORY FRAGMENTS" : "✦ Your Shared Dreams"}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0.75rem" }}>
            {mySharedDreams.map(d => (
              <div key={d.id} style={styles.myDreamCard}>
                <div style={styles.myDreamTitle}>
                  {isSim ? `> ${d.title.toUpperCase()}` : d.title}
                </div>
                {d.description && (
                  <div style={styles.myDreamDesc}>{d.description}</div>
                )}
                {d.themes.length > 0 && (
                  <div style={styles.themes}>
                    {d.themes.slice(0, 5).map(t => (
                      <span key={t} style={styles.theme}>
                        {isSim ? t.toUpperCase() : t}
                      </span>
                    ))}
                  </div>
                )}
                <div style={styles.myDreamDate}>
                  {isSim ? `SHARED: ${formatDate(d.sharedAt)}` : `Shared ${formatDate(d.sharedAt)}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resonances Section */}
      {!loading && mySharedDreams.length > 0 && resonances.length > 0 && (
        <h2 style={{ ...styles.sectionTitle, marginTop: "1rem" }}>
          {isSim ? ">> MATCHING PATTERNS FROM OTHER SUBJECTS" : "🌌 Dreams Resonating With Yours"}
        </h2>
      )}

      {loading ? (
        <div style={styles.empty}>
          {isSim ? "SCANNING MEMORY ARCHIVES..." : "✦ Scanning the dream field..."}
        </div>
      ) : resonances.length === 0 && mySharedDreams.length === 0 ? (
        <div style={styles.empty}>
          <div style={{ fontSize: "2rem", marginBottom: "0.8rem" }}>{isSim ? "//" : "🌌"}</div>
          <div>{isSim ? "NO MATCHING FRAGMENTS DETECTED" : "No resonances found yet"}</div>
          <div style={{ fontSize: "0.85rem", marginTop: "0.5rem", opacity: 0.7 }}>
            {isSim
              ? "Share a memory fragment from your archive to enable pattern matching"
              : "Share a dream from your journal to connect with other dreamers"}
          </div>
        </div>
      ) : resonances.length === 0 && mySharedDreams.length > 0 ? (
        <div style={styles.empty}>
          <div style={{ fontSize: "2rem", marginBottom: "0.8rem" }}>{isSim ? "//" : "🌌"}</div>
          <div>{isSim ? "NO EXTERNAL MATCHES YET" : "No resonances from others yet"}</div>
          <div style={{ fontSize: "0.85rem", marginTop: "0.5rem", opacity: 0.7 }}>
            {isSim
              ? "Your fragments are shared — awaiting pattern matches from other subjects"
              : "Your dreams are shared — other dreamers will resonate soon"}
          </div>
        </div>
      ) : (
        <div style={styles.grid}>
          {resonances.map(r => (
            <div key={r.dreamId} style={styles.card} onClick={() => setSelected(r)}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: r.userAvatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>
                  {r.userAvatar ? <img src={r.userAvatar} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} alt="" /> : r.userName[0]}
                </div>
                <div>
                  <div style={styles.userName}>{isSim ? `[${r.userName.toUpperCase()}]` : r.userName}</div>
                  {r.lifePath && <div style={{ fontSize: "0.7rem", color: isSim ? "#00aa22" : "#9b59b6" }}>{isSim ? `LIFE_PATH:${r.lifePath}` : `Life Path ${r.lifePath}`}</div>}
                </div>
                <div style={{ marginLeft: "auto", fontSize: "0.8rem", fontWeight: 700, color: isSim ? "#00ff41" : "#f0c040", fontFamily: isSim ? "monospace" : "inherit" }}>
                  {r.resonanceScore}%
                </div>
              </div>

              <div style={styles.dreamTitle}>{isSim ? `>> ${r.dreamTitle.toUpperCase()}` : r.dreamTitle}</div>
              <div style={styles.dreamPreview}>{r.dreamDescription}</div>

              <div style={styles.scoreBar}>
                <div style={styles.scoreFill(r.resonanceScore)} />
              </div>

              {r.themes.length > 0 && (
                <div style={styles.themes}>
                  {r.themes.slice(0, 6).map(t => (
                    <span key={t} style={{ ...styles.theme, ...(r.matchedThemes.includes(t) ? styles.matchedTheme : {}) }}>
                      {isSim ? t.toUpperCase() : t}
                    </span>
                  ))}
                </div>
              )}

              <button
                style={styles.connectBtn}
                onClick={e => { e.stopPropagation(); window.location.href = `/dashboard/messages?userId=${r.userId}` }}
              >
                {isSim ? "> ESTABLISH_LINK" : "💬 Connect"}
              </button>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div style={styles.modal} onClick={() => setSelected(null)}>
          <div style={styles.modalInner} onClick={e => e.stopPropagation()}>
            <h2 style={{ ...styles.title, fontSize: "1.2rem" }}>{isSim ? `>> ${selected.dreamTitle.toUpperCase()}` : selected.dreamTitle}</h2>
            <div style={{ color: isSim ? "#00cc33" : "#9b59b6", fontSize: "0.85rem", margin: "0.5rem 0" }}>
              {isSim ? `[SUBJECT: ${selected.userName.toUpperCase()}]` : `by ${selected.userName}`}
            </div>
            <p style={{ color: isSim ? "#88ff88" : "#e2d9f3", lineHeight: 1.6, margin: "0.8rem 0" }}>{selected.dreamDescription}</p>
            {selected.themes.length > 0 && (
              <div style={styles.themes}>
                {selected.themes.map(t => (
                  <span key={t} style={{ ...styles.theme, ...(selected.matchedThemes.includes(t) ? styles.matchedTheme : {}) }}>
                    {isSim ? t.toUpperCase() : t}
                  </span>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: "0.8rem", marginTop: "1rem" }}>
              <button style={{ ...styles.connectBtn, flex: 1 }} onClick={() => window.location.href = `/dashboard/messages?userId=${selected.userId}`}>
                {isSim ? "> ESTABLISH_LINK" : "💬 Connect"}
              </button>
              <button style={{ ...styles.connectBtn, flex: 0, padding: "0.5rem 1rem" }} onClick={() => setSelected(null)}>
                {isSim ? "[X]" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
