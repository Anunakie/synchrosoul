"use client"
import { useEffect, useState } from "react"
import { getMyReferralStats, getReferralLink, type ReferralStats } from "@/lib/referrals"

export default function ReferralsPage() {
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    getMyReferralStats().then(s => {
      setStats(s)
      setLoading(false)
    })
  }, [])

  const copyLink = () => {
    if (!stats) return
    navigator.clipboard.writeText(getReferralLink(stats.code))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const card = (style?: React.CSSProperties) => ({
    background: "rgba(8,6,28,0.88)",
    border: "1px solid rgba(201,168,76,0.2)",
    borderRadius: "16px",
    padding: "1.5rem",
    backdropFilter: "blur(12px)",
    ...style,
  })

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#c9a84c", fontSize: "2rem" }}>✨</div>
    </div>
  )

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "1.5rem 1rem 6rem" }}>
      <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "2rem", color: "#e8d5b7", marginBottom: "0.25rem" }}>🌟 Affiliate Portal</h1>
      <p style={{ color: "rgba(232,213,183,0.6)", marginBottom: "2rem", fontSize: "0.9rem" }}>Earn 25% recurring commission for every soul you guide to SynchroSoul</p>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Total Referrals", value: stats?.totalReferrals ?? 0, icon: "👥" },
          { label: "Active Subscribers", value: stats?.activeSubscribers ?? 0, icon: "💫" },
          { label: "Monthly Earnings", value: `$${(stats?.pendingPayout ?? 0).toFixed(2)}`, icon: "💰" },
          { label: "Total Earned", value: `$${(stats?.totalEarned ?? 0).toFixed(2)}`, icon: "✨" },
        ].map(s => (
          <div key={s.label} style={card()}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>{s.icon}</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#c9a84c" }}>{s.value}</div>
            <div style={{ fontSize: "0.8rem", color: "rgba(232,213,183,0.6)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Referral link */}
      <div style={card({ marginBottom: "1.5rem" })}>
        <h2 style={{ color: "#e8d5b7", fontSize: "1rem", marginBottom: "1rem", fontWeight: 600 }}>Your Referral Link</h2>
        <div style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: "10px", padding: "0.75rem 1rem", marginBottom: "0.75rem", wordBreak: "break-all", color: "rgba(232,213,183,0.8)", fontSize: "0.85rem", fontFamily: "monospace" }}>
          {stats ? getReferralLink(stats.code) : "Loading..."}
        </div>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button onClick={copyLink} style={{ background: copied ? "rgba(100,200,100,0.2)" : "linear-gradient(135deg, #c9a84c, #e8d5b7)", color: copied ? "#6dc86d" : "#050510", border: copied ? "1px solid #6dc86d" : "none", padding: "0.6rem 1.5rem", borderRadius: "50px", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}>
            {copied ? "Copied!" : "Copy Link"}
          </button>
          {stats && (
            <button onClick={() => {
              if (navigator.share) navigator.share({ title: "Join SynchroSoul", text: "Discover your angel number connections!", url: getReferralLink(stats.code) })
            }} style={{ background: "rgba(201,168,76,0.1)", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.3)", padding: "0.6rem 1.5rem", borderRadius: "50px", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem" }}>
              Share
            </button>
          )}
        </div>
      </div>

      {/* Commission info */}
      <div style={card({ marginBottom: "1.5rem", background: "rgba(201,168,76,0.06)" })}>
        <h2 style={{ color: "#c9a84c", fontSize: "1rem", marginBottom: "0.75rem", fontWeight: 600 }}>How It Works</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {[
            { step: "1", text: "Share your unique referral link with friends, followers, or your community" },
            { step: "2", text: "They sign up and subscribe to Mystic ($6.99) or Twin Flame ($9.99)" },
            { step: "3", text: "You earn 25% recurring commission every month they stay subscribed" },
            { step: "4", text: "Payouts processed monthly via Stripe to your bank account" },
          ].map(s => (
            <div key={s.step} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <div style={{ background: "rgba(201,168,76,0.2)", color: "#c9a84c", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0 }}>{s.step}</div>
              <p style={{ color: "rgba(232,213,183,0.75)", fontSize: "0.875rem", lineHeight: 1.5, margin: 0 }}>{s.text}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(201,168,76,0.1)", borderRadius: "8px", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ textAlign: "center" }}><div style={{ color: "#c9a84c", fontWeight: 700 }}>$1.75/mo</div><div style={{ color: "rgba(232,213,183,0.5)", fontSize: "0.75rem" }}>per Mystic</div></div>
          <div style={{ textAlign: "center" }}><div style={{ color: "#c9a84c", fontWeight: 700 }}>$2.50/mo</div><div style={{ color: "rgba(232,213,183,0.5)", fontSize: "0.75rem" }}>per Twin Flame</div></div>
          <div style={{ textAlign: "center" }}><div style={{ color: "#c9a84c", fontWeight: 700 }}>Recurring</div><div style={{ color: "rgba(232,213,183,0.5)", fontSize: "0.75rem" }}>every month</div></div>
        </div>
      </div>

      {/* Referrals list */}
      <div style={card()}>
        <h2 style={{ color: "#e8d5b7", fontSize: "1rem", marginBottom: "1rem", fontWeight: 600 }}>Your Referrals ({stats?.totalReferrals ?? 0})</h2>
        {!stats?.referrals?.length ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "rgba(232,213,183,0.4)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🌱</div>
            <p style={{ margin: 0, fontSize: "0.9rem" }}>No referrals yet. Share your link to start earning!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {stats.referrals.map(r => (
              <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem", background: "rgba(255,255,255,0.03)", borderRadius: "10px", flexWrap: "wrap", gap: "0.5rem" }}>
                <div>
                  <div style={{ color: "#e8d5b7", fontWeight: 600, fontSize: "0.9rem" }}>{r.referredName}</div>
                  <div style={{ color: "rgba(232,213,183,0.5)", fontSize: "0.75rem" }}>{new Date(r.joinedAt).toLocaleDateString()}</div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <span style={{ background: r.status === "subscribed" ? "rgba(100,200,100,0.15)" : "rgba(201,168,76,0.1)", color: r.status === "subscribed" ? "#6dc86d" : "#c9a84c", border: `1px solid ${r.status === "subscribed" ? "rgba(100,200,100,0.3)" : "rgba(201,168,76,0.3)"}`, borderRadius: "20px", padding: "0.2rem 0.6rem", fontSize: "0.75rem", fontWeight: 600 }}>
                    {r.status === "subscribed" ? "Subscribed" : "Signed Up"}
                  </span>
                  {r.monthlyCommission > 0 && (
                    <span style={{ color: "#c9a84c", fontWeight: 700, fontSize: "0.85rem" }}>${r.monthlyCommission.toFixed(2)}/mo</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
