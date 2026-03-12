"use client"
import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { storeReferralCode } from "@/lib/referrals"
import StarField from "@/components/StarField"
import Link from "next/link"

function JoinContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [refCode, setRefCode] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const ref = searchParams.get("ref")
    if (ref) {
      setRefCode(ref)
      storeReferralCode(ref)
    }
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timer)
          router.push("/auth/signup")
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [searchParams, router])

  return (
    <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "2rem", maxWidth: "480px" }}>
      <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✨</div>
      <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "2.5rem", color: "#e8d5b7", marginBottom: "0.5rem" }}>
        You Were Guided Here
      </h1>
      {refCode && (
        <div style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.4)", borderRadius: "12px", padding: "0.75rem 1.5rem", marginBottom: "1.5rem", display: "inline-block" }}>
          <span style={{ color: "#c9a84c", fontSize: "0.85rem", letterSpacing: "0.1em" }}>INVITED BY</span>
          <div style={{ color: "#e8d5b7", fontWeight: 600, fontSize: "1.1rem" }}>{refCode}</div>
        </div>
      )}
      <p style={{ color: "rgba(232,213,183,0.7)", lineHeight: 1.7, marginBottom: "2rem" }}>
        The universe conspired to bring you to SynchroSoul &mdash; where angel numbers reveal your cosmic connections.
        Log the numbers you see, discover your numerology, and find souls vibrating at the same frequency.
      </p>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2rem" }}>
        {["1111", "333", "777", "555", "444"].map(n => (
          <span key={n} style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "8px", padding: "0.4rem 0.8rem", color: "#c9a84c", fontSize: "0.9rem", fontWeight: 600 }}>{n}</span>
        ))}
      </div>
      <Link href="/auth/signup" style={{ display: "inline-block", background: "linear-gradient(135deg, #c9a84c, #e8d5b7)", color: "#050510", padding: "0.9rem 2.5rem", borderRadius: "50px", fontWeight: 700, fontSize: "1rem", textDecoration: "none", marginBottom: "1rem" }}>
        Begin Your Journey
      </Link>
      <p style={{ color: "rgba(232,213,183,0.4)", fontSize: "0.8rem" }}>
        Redirecting in {countdown}s...
      </p>
      <p style={{ color: "rgba(232,213,183,0.5)", fontSize: "0.85rem", marginTop: "1rem" }}>
        Already have an account?{" "}
        <Link href="/auth/login" style={{ color: "#c9a84c" }}>Sign in</Link>
      </p>
    </div>
  )
}

export default function JoinPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#050510", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <StarField />
      <Suspense fallback={
        <div style={{ color: "#c9a84c", fontSize: "2rem", position: "relative", zIndex: 10 }}>✨</div>
      }>
        <JoinContent />
      </Suspense>
    </div>
  )
}
