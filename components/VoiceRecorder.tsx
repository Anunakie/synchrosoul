'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface VoiceRecorderProps {
  onTranscript: (text: string) => void
  onVoiceNote?: (dataUrl: string) => void
  placeholder?: string
  compact?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpeechRecognitionInstance = any

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor
    webkitSpeechRecognition: SpeechRecognitionConstructor
  }
}

export default function VoiceRecorder({ onTranscript, onVoiceNote, placeholder, compact }: VoiceRecorderProps) {
  const [isListening, setIsListening] = useState(false)
  const [isRecordingAudio, setIsRecordingAudio] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [supported, setSupported] = useState(true)
  const [pulse, setPulse] = useState(false)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Use a ref to track transcript so the onresult closure never goes stale
  const transcriptRef = useRef('')
  const onTranscriptRef = useRef(onTranscript)
  useEffect(() => { onTranscriptRef.current = onTranscript }, [onTranscript])

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { setSupported(false); return }
    const recognition = new SR()
    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = 'en-US'
    recognition.onresult = (e: any) => {
      let final = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          final += e.results[i][0].transcript
        }
      }
      if (final) {
        const combined = (transcriptRef.current + ' ' + final).trim()
        transcriptRef.current = combined
        setTranscript(combined)
        onTranscriptRef.current(combined)
      }
    }
    recognition.onerror = () => { setIsListening(false); setPulse(false) }
    recognition.onend = () => { setIsListening(false); setPulse(false) }
    recognitionRef.current = recognition
    // Only create recognition once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isListening) {
      interval = setInterval(() => setPulse(p => !p), 600)
    } else {
      setPulse(false)
    }
    return () => clearInterval(interval)
  }, [isListening])

  function toggleListening() {
    if (!recognitionRef.current) return
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      transcriptRef.current = ''
      setTranscript('')
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  async function toggleAudioRecording() {
    if (isRecordingAudio) {
      mediaRecorderRef.current?.stop()
      setIsRecordingAudio(false)
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      audioChunksRef.current = []
      mr.ondataavailable = e => audioChunksRef.current.push(e.data)
      mr.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const reader = new FileReader()
        reader.onload = ev => {
          if (onVoiceNote) onVoiceNote(ev.target?.result as string)
        }
        reader.readAsDataURL(blob)
        stream.getTracks().forEach(t => t.stop())
      }
      mr.start()
      mediaRecorderRef.current = mr
      setIsRecordingAudio(true)
    } catch {
      console.warn('Microphone access denied')
    }
  }

  if (!supported) return null

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggleListening}
        title={isListening ? 'Stop listening' : 'Speak your thought'}
        style={{
          width: '2.5rem', height: '2.5rem', borderRadius: '50%',
          background: isListening
            ? `rgba(255,80,120,${pulse ? '0.35' : '0.2'})`
            : 'rgba(200,150,255,0.12)',
          border: `1px solid ${isListening ? 'rgba(255,80,120,0.6)' : 'rgba(200,150,255,0.3)'}`,
          color: isListening ? '#ff5078' : 'rgba(200,150,255,0.7)',
          cursor: 'pointer', fontSize: '1rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.3s ease', flexShrink: 0,
          boxShadow: isListening ? '0 0 12px rgba(255,80,120,0.3)' : 'none',
        }}
      >
        {isListening ? '⏹' : '🎙️'}
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {/* Speech-to-text button */}
        <button
          type="button"
          onClick={toggleListening}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.5rem 0.875rem', borderRadius: '9999px',
            background: isListening
              ? `rgba(255,80,120,${pulse ? '0.25' : '0.15'})`
              : 'rgba(200,150,255,0.1)',
            border: `1px solid ${isListening ? 'rgba(255,80,120,0.5)' : 'rgba(200,150,255,0.25)'}`,
            color: isListening ? '#ff8099' : 'rgba(200,150,255,0.7)',
            cursor: 'pointer', fontSize: '0.75rem',
            transition: 'all 0.3s ease',
            boxShadow: isListening ? '0 0 16px rgba(255,80,120,0.2)' : 'none',
          }}
        >
          <span style={{ fontSize: '0.9rem' }}>{isListening ? '⏹' : '🎙️'}</span>
          <span>{isListening ? 'Stop' : 'Speak'}</span>
          {isListening && (
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#ff5078',
              boxShadow: `0 0 ${pulse ? '8px' : '3px'} #ff5078`,
              transition: 'box-shadow 0.3s',
            }} />
          )}
        </button>

        {/* Voice note record button */}
        {onVoiceNote && (
          <button
            type="button"
            onClick={toggleAudioRecording}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.5rem 0.875rem', borderRadius: '9999px',
              background: isRecordingAudio
                ? `rgba(255,160,50,${pulse ? '0.25' : '0.15'})`
                : 'rgba(200,150,255,0.1)',
              border: `1px solid ${isRecordingAudio ? 'rgba(255,160,50,0.5)' : 'rgba(200,150,255,0.25)'}`,
              color: isRecordingAudio ? '#ffb060' : 'rgba(200,150,255,0.7)',
              cursor: 'pointer', fontSize: '0.75rem',
              transition: 'all 0.3s ease',
            }}
          >
            <span style={{ fontSize: '0.9rem' }}>{isRecordingAudio ? '⏹' : '🔊'}</span>
            <span>{isRecordingAudio ? 'Save Note' : 'Voice Note'}</span>
          </button>
        )}
      </div>

      {isListening && (
        <p style={{
          fontSize: '0.7rem', color: 'rgba(255,120,150,0.7)',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          animation: 'none',
        }}>● Listening... speak your thought</p>
      )}
    </div>
  )
}

// ── Text-to-Speech utility ─────────────────────────────────────────────────
export function speakText(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 0.9
  utterance.pitch = 1.05
  utterance.volume = 1
  // prefer a calm female voice if available
  const voices = window.speechSynthesis.getVoices()
  const preferred = voices.find(v =>
    v.name.toLowerCase().includes('samantha') ||
    v.name.toLowerCase().includes('karen') ||
    v.name.toLowerCase().includes('female') ||
    (v.lang === 'en-US' && v.name.toLowerCase().includes('google'))
  )
  if (preferred) utterance.voice = preferred
  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
}
