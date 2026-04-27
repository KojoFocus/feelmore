'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  ChevronLeft, Paperclip, Camera, Mic, Send, X,
  Play, Pause, Image as ImgIcon, Video as VidIcon, Music,
  Phone, MoreVertical,
} from 'lucide-react'

type MsgType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'VOICE_NOTE'

type Msg = {
  id: string
  type: MsgType
  body?: string | null
  mediaUrl?: string | null
  mimeType?: string | null
  duration?: number | null
  createdAt: string
  isFromAdmin: boolean
}

function fmtDur(s: number) {
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function VoiceBubble({ msg }: { msg: Msg }) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audio = useRef<HTMLAudioElement | null>(null)
  const mine = !msg.isFromAdmin

  const toggle = () => {
    if (!audio.current) return
    if (playing) { audio.current.pause(); setPlaying(false) }
    else { audio.current.play(); setPlaying(true) }
  }

  return (
    <div style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', marginBottom: 4 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px',
        backgroundColor: mine ? 'rgba(166,106,134,0.22)' : '#1E1A26',
        borderRadius: mine ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
        maxWidth: '75%', minWidth: 200,
      }}>
        <audio
          ref={audio}
          src={msg.mediaUrl ?? undefined}
          onTimeUpdate={() => {
            if (audio.current)
              setProgress(audio.current.currentTime / (audio.current.duration || 1))
          }}
          onEnded={() => { setPlaying(false); setProgress(0) }}
        />
        <button
          onClick={toggle}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            backgroundColor: '#A66A86', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
        >
          {playing ? <Pause size={14} color="#fff" /> : <Play size={14} color="#fff" />}
        </button>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2, height: 28 }}>
          {Array.from({ length: 24 }).map((_, i) => {
            const h = 6 + Math.abs(Math.sin(i * 0.9 + 1) * 14)
            const filled = i / 24 <= progress
            return (
              <div key={i} style={{
                flex: 1, height: `${h}px`, borderRadius: 2,
                backgroundColor: filled ? '#A66A86' : 'rgba(255,255,255,0.18)',
                transition: 'background-color 0.1s',
              }} />
            )
          })}
        </div>

        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, flexShrink: 0 }}>
          {msg.duration ? fmtDur(msg.duration) : '0:00'}
        </span>
      </div>
    </div>
  )
}

function Bubble({ msg }: { msg: Msg }) {
  const mine = !msg.isFromAdmin
  const radius = mine ? '18px 4px 18px 18px' : '4px 18px 18px 18px'
  const bg = mine ? 'rgba(166,106,134,0.22)' : '#1E1A26'

  if (msg.type === 'VOICE_NOTE' || msg.type === 'AUDIO') return <VoiceBubble msg={msg} />

  if (msg.type === 'IMAGE') return (
    <div style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', marginBottom: 4 }}>
      <div style={{ maxWidth: '72%', borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
        <img src={msg.mediaUrl ?? undefined} alt="" style={{ width: '100%', maxHeight: 260, objectFit: 'cover', display: 'block' }} />
        <span style={{ position: 'absolute', bottom: 6, right: 8, color: 'rgba(255,255,255,0.7)', fontSize: 10, textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
          {fmtTime(msg.createdAt)}
        </span>
      </div>
    </div>
  )

  if (msg.type === 'VIDEO') return (
    <div style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', marginBottom: 4 }}>
      <div style={{ maxWidth: '72%', borderRadius: 16, overflow: 'hidden' }}>
        <video src={msg.mediaUrl ?? undefined} controls playsInline style={{ width: '100%', maxHeight: 260, display: 'block' }} />
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', marginBottom: 4 }}>
      <div style={{ maxWidth: '72%', padding: '9px 14px', backgroundColor: bg, borderRadius: radius }}>
        <p style={{ color: '#ffffff', fontSize: 15, lineHeight: 1.45, whiteSpace: 'pre-wrap' }}>{msg.body}</p>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, textAlign: 'right', marginTop: 4 }}>
          {fmtTime(msg.createdAt)}
        </p>
      </div>
    </div>
  )
}

const GUEST_KEY = 'fm_guest_id'
const CONV_KEY = 'fm_conv_id'
const SEEN_KEY = 'fm_chat_seen'

function getGuestId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem(GUEST_KEY)
  if (!id) {
    id = `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`
    localStorage.setItem(GUEST_KEY, id)
  }
  return id
}

const WELCOME: Msg = {
  id: 'welcome',
  type: 'TEXT',
  body: "Hey! 👋 Welcome to feelmore. How can we help you today?",
  createdAt: new Date().toISOString(),
  isFromAdmin: true,
}

export default function ChatThread({ id, name }: { id: string; name: string }) {
  const [convId, setConvId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Msg[]>([WELCOME])
  const [text, setText] = useState('')
  const [recording, setRecording] = useState(false)
  const [recSecs, setRecSecs] = useState(0)
  const [showAttach, setShowAttach] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const mr = useRef<MediaRecorder | null>(null)
  const chunks = useRef<Blob[]>([])
  const recTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)
  const audioFileRef = useRef<HTMLInputElement>(null)

  // Bootstrap conversation
  useEffect(() => {
    const guestId = getGuestId()
    fetch('/api/conversations', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestId }),
    })
      .then(r => r.json())
      .then(({ id: cid }) => {
        setConvId(cid)
        localStorage.setItem(CONV_KEY, cid)
        return fetch(`/api/conversations/${cid}/messages`).then(r => r.json())
      })
      .then((msgs: Msg[]) => {
        if (msgs.length > 0) {
          setMessages(msgs)
          // Mark all as seen on open
          localStorage.setItem(SEEN_KEY, new Date().toISOString())
        }
      })
      .catch(() => {})
  }, [id])

  // Poll for new messages (admin replies)
  useEffect(() => {
    if (!convId) return
    pollRef.current = setInterval(() => {
      fetch(`/api/conversations/${convId}/messages`)
        .then(r => r.json())
        .then((msgs: Msg[]) => {
          if (msgs.length > 0) {
            setMessages(msgs)
            localStorage.setItem(SEEN_KEY, new Date().toISOString())
          }
        })
        .catch(() => {})
    }, 6000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [convId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const postMessage = useCallback(async (payload: {
    type: MsgType; body?: string; mediaUrl?: string; mimeType?: string; duration?: number
  }) => {
    if (!convId) return
    const res = await fetch(`/api/conversations/${convId}/messages`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const msg = await res.json()
    setMessages(prev => [...prev, msg])

  }, [convId, id])

  const sendText = () => {
    if (!text.trim()) return
    postMessage({ type: 'TEXT', body: text.trim() })
    setText('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, forceType?: MsgType) => {
    const file = e.target.files?.[0]
    if (!file) return
    setShowAttach(false)
    const reader = new FileReader()
    reader.onload = () => {
      const type: MsgType = forceType
        ?? (file.type.startsWith('image/') ? 'IMAGE'
          : file.type.startsWith('video/') ? 'VIDEO'
          : 'AUDIO')
      postMessage({ type, mediaUrl: reader.result as string, mimeType: file.type })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      mr.current = recorder
      chunks.current = []
      let secs = 0

      recorder.ondataavailable = e => { if (e.data.size > 0) chunks.current.push(e.data) }
      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' })
        const reader = new FileReader()
        reader.onload = () => {
          postMessage({ type: 'VOICE_NOTE', mediaUrl: reader.result as string, mimeType: 'audio/webm', duration: secs })
        }
        reader.readAsDataURL(blob)
        stream.getTracks().forEach(t => t.stop())
        setRecSecs(0)
      }

      recorder.start(100)
      setRecording(true)
      recTimer.current = setInterval(() => setRecSecs(s => { secs = s + 1; return secs }), 1000)
    } catch {
      alert('Microphone access is required to send voice messages.')
    }
  }

  const stopAndSend = () => {
    mr.current?.stop()
    if (recTimer.current) clearInterval(recTimer.current)
    setRecording(false)
  }

  const cancelRecording = () => {
    if (mr.current) {
      mr.current.ondataavailable = null
      mr.current.onstop = null
      mr.current.stop()
    }
    if (recTimer.current) clearInterval(recTimer.current)
    setRecording(false)
    setRecSecs(0)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', backgroundColor: '#0C0A0E' }}>

      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        paddingTop: 'max(52px, env(safe-area-inset-top, 52px))',
        paddingBottom: 12, paddingLeft: 12, paddingRight: 16,
        backgroundColor: '#130F17', borderBottom: '1px solid rgba(255,255,255,0.05)',
        flexShrink: 0,
      }}>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.55)', display: 'flex', padding: 4 }}>
          <ChevronLeft size={24} strokeWidth={1.5} />
        </Link>
        <div style={{
          width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
          backgroundColor: 'rgba(166,106,134,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: '#A66A86', fontSize: 15, fontWeight: 700 }}>{name[0]}</span>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ color: '#ffffff', fontSize: 15, fontWeight: 600, lineHeight: 1.2 }}>{name}</p>
          <p style={{ color: '#4ade80', fontSize: 11, marginTop: 2 }}>Online</p>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button style={{ padding: 8, color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none' }}><Phone size={18} strokeWidth={1.5} /></button>
          <button style={{ padding: 8, color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none' }}><MoreVertical size={18} strokeWidth={1.5} /></button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px 8px' }}>
        {messages.map(msg => <Bubble key={msg.id} msg={msg} />)}
        <div ref={bottomRef} />
      </div>

      {/* ── Attach menu ── */}
      {showAttach && (
        <div style={{
          display: 'flex', gap: 10, padding: '10px 16px 6px',
          backgroundColor: '#130F17', borderTop: '1px solid rgba(255,255,255,0.04)',
        }}>
          {[
            { icon: ImgIcon, label: 'Gallery', action: () => { setShowAttach(false); fileRef.current?.click() } },
            { icon: Camera, label: 'Camera', action: () => { setShowAttach(false); cameraRef.current?.click() } },
            { icon: Music, label: 'Audio', action: () => { setShowAttach(false); audioFileRef.current?.click() } },
          ].map(({ icon: Icon, label, action }) => (
            <button key={label} onClick={action} style={{
              flex: 1, backgroundColor: '#1E1A26', borderRadius: 16, border: 'none',
              padding: '14px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer',
            }}>
              <Icon size={20} color="#A66A86" />
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>{label}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── Recording bar ── */}
      {recording ? (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 16px',
          paddingBottom: 'max(20px, env(safe-area-inset-bottom, 20px))',
          backgroundColor: '#130F17', borderTop: '1px solid rgba(255,255,255,0.05)',
          flexShrink: 0,
        }}>
          <button onClick={cancelRecording} style={{ color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={22} />
          </button>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ef4444', flexShrink: 0 }} />
            <span style={{ color: '#ffffff', fontSize: 14 }}>Recording — {fmtDur(recSecs)}</span>
          </div>
          <button onClick={stopAndSend} style={{
            width: 46, height: 46, borderRadius: '50%',
            backgroundColor: '#A66A86', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Send size={18} color="#fff" />
          </button>
        </div>
      ) : (
        /* ── Input bar ── */
        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: 8,
          padding: '10px 14px',
          paddingBottom: 'max(20px, env(safe-area-inset-bottom, 20px))',
          backgroundColor: '#130F17', borderTop: '1px solid rgba(255,255,255,0.05)',
          flexShrink: 0,
        }}>
          <button
            onClick={() => setShowAttach(v => !v)}
            style={{
              width: 42, height: 42, borderRadius: '50%', flexShrink: 0, border: 'none', cursor: 'pointer',
              backgroundColor: showAttach ? 'rgba(166,106,134,0.2)' : '#1E1A26',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Paperclip size={18} color={showAttach ? '#A66A86' : 'rgba(255,255,255,0.45)'} />
          </button>

          <div style={{
            flex: 1, backgroundColor: '#1E1A26', borderRadius: 22,
            padding: '10px 16px', display: 'flex', alignItems: 'center',
          }}>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={e => {
                setText(e.target.value)
                if (textareaRef.current) {
                  textareaRef.current.style.height = 'auto'
                  textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
                }
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendText() }
              }}
              placeholder="Message"
              rows={1}
              style={{
                width: '100%', background: 'none', border: 'none', outline: 'none',
                color: '#ffffff', fontSize: 15, resize: 'none', lineHeight: 1.45,
                maxHeight: 120, fontFamily: 'inherit',
              }}
            />
          </div>

          {text.trim() ? (
            <button onClick={sendText} style={{
              width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
              backgroundColor: '#A66A86', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Send size={18} color="#fff" />
            </button>
          ) : (
            <button onClick={startRecording} style={{
              width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
              backgroundColor: '#1E1A26', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Mic size={20} color="#A66A86" />
            </button>
          )}
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*,video/*" hidden onChange={handleFile} />
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" hidden onChange={e => handleFile(e, 'IMAGE')} />
      <input ref={audioFileRef} type="file" accept="audio/*" hidden onChange={e => handleFile(e, 'AUDIO')} />
    </div>
  )
}
