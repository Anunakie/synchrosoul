"use client";
import { useState, useRef, useEffect } from "react";
import { getSubscriptionStatus } from "@/lib/subscription";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tier, setTier] = useState<string>("free");
  const [tierLoading, setTierLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isSim = typeof window !== "undefined" && localStorage.getItem("synchrosoul_simulation") === "true";

  const accent = isSim ? "rgba(0,204,51" : "rgba(167,139,250";
  const textColor = isSim ? "#00cc33" : "rgba(220,200,255,0.9)";
  const mutedColor = isSim ? "rgba(0,204,51,0.5)" : "rgba(180,160,255,0.5)";
  const bgCard = isSim ? "rgba(0,20,0,0.8)" : "rgba(8,6,28,0.85)";

  useEffect(() => {
    getSubscriptionStatus().then((s) => {
      setTier(s?.tier || "free");
      setTierLoading(false);
    });
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, mode: isSim ? "simulation" : "spiritual" }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);
      } else if (data.error) {
        setMessages([...newMessages, { role: "assistant", content: `⚠️ ${data.error}` }]);
      }
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "The cosmic connection was interrupted. Please try again." }]);
    }
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  if (tierLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: mutedColor, fontSize: "0.9rem" }}>{isSim ? "ESTABLISHING SECURE CHANNEL..." : "✨ Connecting to your advisor..."}</p>
      </div>
    );
  }

  // Tier gate - Twin Flame only
  if (tier !== "twin-flame") {
    return (
      <div style={{ minHeight: "100vh", padding: "2rem 1rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>{isSim ? "📡" : "🔮"}</div>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: textColor, marginBottom: "0.5rem", fontFamily: isSim ? "monospace" : "Cormorant Garamond, serif" }}>
          {isSim ? "SIGNAL DECODER v2.0" : "AI Angel Advisor"}
        </h1>
        <p style={{ color: mutedColor, fontSize: "0.95rem", marginBottom: "1.5rem", maxWidth: "400px", lineHeight: 1.6 }}>
          {isSim
            ? "This channel requires Level 3 clearance. The Signal Decoder analyzes your anomaly codes and memory fragments to deliver real-time guidance from beyond the simulation."
            : "Your personal celestial guide who knows your angel number journey, dreams, and spiritual patterns. Get personalized guidance in real-time conversation."}
        </p>

        {/* Blurred preview */}
        <div style={{ position: "relative", width: "100%", maxWidth: "500px", marginBottom: "1.5rem" }}>
          <div style={{ filter: "blur(4px)", opacity: 0.5, pointerEvents: "none" }}>
            <div style={{ background: bgCard, borderRadius: "1rem", padding: "1rem", marginBottom: "0.5rem", textAlign: "left" }}>
              <p style={{ color: textColor, fontSize: "0.85rem" }}>I keep seeing 1111 this week...</p>
            </div>
            <div style={{ background: `${accent},0.08)`, borderRadius: "1rem", padding: "1rem", textAlign: "left" }}>
              <p style={{ color: textColor, fontSize: "0.85rem" }}>✨ The 1111 gateway is wide open for you. I can see you've logged it 4 times alongside thoughts about transformation. The universe is confirming your path is aligned...</p>
            </div>
          </div>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: "rgba(0,0,0,0.7)", borderRadius: "1rem", padding: "1rem 2rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>🔒</div>
              <p style={{ color: "#f472b6", fontSize: "0.8rem", fontWeight: 600 }}>Twin Flame Feature</p>
            </div>
          </div>
        </div>

        <Link href="/dashboard/upgrade" style={{
          display: "inline-block", padding: "0.75rem 2rem", borderRadius: "9999px",
          background: "linear-gradient(135deg, #f472b6, #a78bfa)", color: "#fff",
          fontWeight: 700, fontSize: "0.9rem", textDecoration: "none",
        }}>
          {isSim ? ">> UPGRADE CLEARANCE LEVEL" : "✦ Upgrade to Twin Flame"}
        </Link>
        <p style={{ color: mutedColor, fontSize: "0.7rem", marginTop: "0.5rem" }}>$9.99/mo · 7-day free trial · Cancel anytime</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", maxHeight: "100dvh" }}>
      {/* Header */}
      <div style={{ padding: "1rem 1rem 0.75rem", borderBottom: `1px solid ${accent},0.15)`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: "44px", height: "44px", borderRadius: "50%",
            background: `${accent},0.15)`, border: `1px solid ${accent},0.3)`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem",
          }}>
            {isSim ? "📡" : "🔮"}
          </div>
          <div>
            <h1 style={{ fontSize: "1.1rem", fontWeight: 700, color: textColor, margin: 0, fontFamily: isSim ? "monospace" : "Cormorant Garamond, serif" }}>
              {isSim ? "SIGNAL DECODER" : "Angel Advisor"}
            </h1>
            <p style={{ fontSize: "0.7rem", color: mutedColor, margin: 0 }}>
              {isSim ? "Secure channel · Level 3 clearance" : "Your personal celestial guide · Knows your journey"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem 1rem", color: mutedColor }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{isSim ? "📡" : "🔮"}</div>
            <p style={{ fontSize: "1rem", fontWeight: 600, color: textColor, marginBottom: "0.5rem" }}>
              {isSim ? "Channel open. Awaiting transmission." : "Your advisor is ready."}
            </p>
            <p style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>
              {isSim
                ? "I have access to your logged anomaly codes and memory fragments. Ask about patterns, signals, or request a protocol."
                : "I can see your angel number patterns, dreams, and spiritual journey. Ask me anything — guidance, interpretation, or just talk about what you’re experiencing."}
            </p>
            <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "center" }}>
              {(isSim
                ? ["Analyze my recent anomaly codes", "What patterns are emerging in my data?", "Run a signal diagnostic"]
                : ["What do my recent numbers mean together?", "I keep seeing 1111 — why now?", "What should I focus on this week?"]
              ).map((suggestion) => (
                <button key={suggestion} onClick={() => { setInput(suggestion); setTimeout(() => inputRef.current?.focus(), 50); }}
                  style={{
                    background: `${accent},0.08)`, border: `1px solid ${accent},0.2)`, borderRadius: "9999px",
                    padding: "0.4rem 1rem", color: textColor, fontSize: "0.75rem", cursor: "pointer",
                  }}>
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
            maxWidth: "85%",
            background: msg.role === "user" ? `${accent},0.15)` : bgCard,
            border: `1px solid ${msg.role === "user" ? `${accent},0.3)` : `${accent},0.1)`}`,
            borderRadius: msg.role === "user" ? "1.25rem 1.25rem 0.25rem 1.25rem" : "1.25rem 1.25rem 1.25rem 0.25rem",
            padding: "0.75rem 1rem",
          }}>
            <p style={{ color: textColor, fontSize: "0.88rem", lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>
              {msg.content}
            </p>
          </div>
        ))}

        {loading && (
          <div style={{
            alignSelf: "flex-start", maxWidth: "85%",
            background: bgCard, border: `1px solid ${accent},0.1)`,
            borderRadius: "1.25rem 1.25rem 1.25rem 0.25rem", padding: "0.75rem 1rem",
          }}>
            <p style={{ color: mutedColor, fontSize: "0.85rem", margin: 0 }}>
              {isSim ? "/// DECODING SIGNAL..." : "✨ Channeling guidance..."}
            </p>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: "0.75rem 1rem 1rem", borderTop: `1px solid ${accent},0.1)`, flexShrink: 0, background: bgCard }}>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isSim ? "Enter transmission..." : "Ask your advisor anything..."}
            rows={1}
            style={{
              flex: 1, resize: "none", background: `${accent},0.05)`,
              border: `1px solid ${accent},0.2)`, borderRadius: "1rem",
              padding: "0.75rem 1rem", color: textColor, fontSize: "0.9rem",
              fontFamily: "inherit", outline: "none", maxHeight: "120px",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            style={{
              width: "44px", height: "44px", borderRadius: "50%",
              background: input.trim() && !loading ? `${accent},0.3)` : `${accent},0.1)`,
              border: `1px solid ${accent},0.3)`,
              color: input.trim() && !loading ? textColor : mutedColor,
              fontSize: "1.2rem", cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
          >
            {isSim ? "⚡" : "✦"}
          </button>
        </div>
      </div>
    </div>
  );
}
