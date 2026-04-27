'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Send, MessageSquare, ArrowLeft } from 'lucide-react'

type ConvSummary = {
  id: string; guestId: string; messageCount: number; updatedAt: string
  lastMessage: { body: string | null; type: string; isFromAdmin: boolean; createdAt: string } | null
}
type Msg = { id: string; type: string; body: string | null; mediaUrl: string | null; isFromAdmin: boolean; createdAt: string }

function fmtTime(iso: string) {
  const d = new Date(iso)
  const isToday = d.toDateString() === new Date().toDateString()
  return isToday
    ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

function Bubble({ msg }: { msg: Msg }) {
  const mine = msg.isFromAdmin
  const bg = mine ? 'rgba(166,106,134,0.2)' : 'rgba(255,255,255,0.06)'
  const radius = mine ? '16px 4px 16px 16px' : '4px 16px 16px 16px'

  if (msg.type === 'IMAGE' && msg.mediaUrl) return (
    <div style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', marginBottom: 6 }}>
      <img src={msg.mediaUrl} alt="" style={{ maxWidth: 200, borderRadius: 12, display: 'block' }} />
    </div>
  )
  if ((msg.type === 'VOICE_NOTE' || msg.type === 'AUDIO') && msg.mediaUrl) return (
    <div style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', marginBottom: 6 }}>
      <div style={{ backgroundColor: bg, borderRadius: radius, padding: '8px 12px' }}>
        <audio src={msg.mediaUrl} controls style={{ height: 30, maxWidth: 200 }} />
      </div>
    </div>
  )
  return (
    <div style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', marginBottom: 6 }}>
      <div style={{ maxWidth: '72%', padding: '8px 12px', backgroundColor: bg, borderRadius: radius }}>
        <p style={{ color: '#ffffff', fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{msg.body}</p>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, textAlign: 'right', marginTop: 3 }}>{fmtTime(msg.createdAt)}</p>
      </div>
    </div>
  )
}

export default function AdminMessages() {
  const [convs, setConvs] = useState<ConvSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)
  const [messages, setMessages] = useState<Msg[]>([])
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    fetch('/api/admin/messages')
      .then(r => r.ok ? r.json() : [])
      .then(d => { setConvs(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const loadThread = useCallback((id: string) => {
    setLoadingMsgs(true)
    fetch(`/api/admin/messages/${id}`)
      .then(r => r.ok ? r.json() : [])
      .then(d => { setMessages(d); setLoadingMsgs(false); setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50) })
      .catch(() => setLoadingMsgs(false))
  }, [])

  useEffect(() => {
    if (!selected) return
    loadThread(selected)
    pollRef.current = setInterval(() => loadThread(selected), 5000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [selected, loadThread])

  const send = async () => {
    if (!text.trim() || !selected || sending) return
    setSending(true)
    const res = await fetch('/api/admin/messages', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId: selected, body: text.trim(), type: 'TEXT' }),
    })
    if (res.ok) {
      const msg = await res.json()
      setMessages(prev => [...prev, msg])
      setText('')
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }
    setSending(false)
  }

  const shortId = (guestId: string) => `User ···${guestId.slice(-5).toUpperCase()}`
  const selectedConv = convs.find(c => c.id === selected)

  const listPanel = (
    <div style={{ width: 260, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
      <div style={{ padding: '0 16px', height: 52, display: 'flex', flexDirection: 'column', justifyContent: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        <p style={{ color: '#ffffff', fontSize: 14, fontWeight: 700 }}>Messages</p>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{convs.length} conversation{convs.length !== 1 ? 's' : ''}</p>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading && <p style={{ color: 'rgba(255,255,255,0.25)', padding: '16px', fontSize: 12, textAlign: 'center' }}>Loading…</p>}
        {!loading && convs.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <MessageSquare size={24} color="rgba(255,255,255,0.08)" />
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, marginTop: 10 }}>No messages yet</p>
          </div>
        )}
        {convs.map(c => (
          <div key={c.id} onClick={() => setSelected(c.id)} style={{
            padding: '10px 14px', cursor: 'pointer',
            backgroundColor: selected === c.id ? 'rgba(166,106,134,0.1)' : 'transparent',
            borderBottom: '1px solid rgba(255,255,255,0.03)',
            borderLeft: selected === c.id ? '2px solid #A66A86' : '2px solid transparent',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ color: '#ffffff', fontSize: 12, fontWeight: 600 }}>{shortId(c.guestId)}</p>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10 }}>{fmtTime(c.updatedAt)}</span>
            </div>
            {c.lastMessage && (
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 3, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {c.lastMessage.isFromAdmin ? 'You: ' : ''}{c.lastMessage.body ?? `[${c.lastMessage.type.toLowerCase()}]`}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const threadPanel = (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0 }}>
      {/* Thread header */}
      <div style={{ padding: '0 16px', height: 52, display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <button
          onClick={() => setSelected(null)}
          className="msgs-back"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex', padding: 4, marginLeft: -4 }}
        >
          <ArrowLeft size={18} />
        </button>
        <div style={{ width: 30, height: 30, borderRadius: '50%', backgroundColor: 'rgba(166,106,134,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: '#A66A86', fontSize: 11, fontWeight: 700 }}>
            {selectedConv ? selectedConv.guestId.slice(-2).toUpperCase() : '??'}
          </span>
        </div>
        <div>
          <p style={{ color: '#ffffff', fontSize: 13, fontWeight: 600 }}>{selectedConv ? shortId(selectedConv.guestId) : ''}</p>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10 }}>{selectedConv?.messageCount ?? 0} messages</p>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', minHeight: 0 }}>
        {loadingMsgs && <p style={{ color: 'rgba(255,255,255,0.25)', textAlign: 'center', fontSize: 12 }}>Loading…</p>}
        {!loadingMsgs && messages.length === 0 && (
          <p style={{ color: 'rgba(255,255,255,0.2)', textAlign: 'center', fontSize: 12, marginTop: 20 }}>No messages yet</p>
        )}
        {messages.map(msg => <Bubble key={msg.id} msg={msg} />)}
        <div ref={bottomRef} />
      </div>

      {/* Reply */}
      <div style={{ padding: '10px 14px 12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8, alignItems: 'flex-end', flexShrink: 0 }}>
        <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '8px 12px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder="Reply…"
            rows={1}
            style={{ width: '100%', background: 'none', border: 'none', outline: 'none', color: '#ffffff', fontSize: 13, resize: 'none', lineHeight: 1.4, fontFamily: 'inherit', maxHeight: 80 }}
          />
        </div>
        <button
          onClick={send} disabled={!text.trim() || sending}
          style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            backgroundColor: text.trim() ? '#A66A86' : 'rgba(255,255,255,0.05)',
            border: 'none', cursor: text.trim() ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Send size={14} color={text.trim() ? '#fff' : 'rgba(255,255,255,0.2)'} />
        </button>
      </div>
    </div>
  )

  return (
    <>
      <style>{`
        .msgs-list { display: flex; flex: 1; }
        .msgs-list-hidden { display: none; }
        .msgs-placeholder { display: none; }
        @media (min-width: 640px) {
          .msgs-list { flex: 0 0 260px; }
          .msgs-list-hidden { display: flex !important; flex: 0 0 260px; }
          .msgs-back { display: none !important; }
          .msgs-placeholder { display: flex; }
        }
      `}</style>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
        <div className={`msgs-list${selected ? ' msgs-list-hidden' : ''}`}>
          {listPanel}
        </div>
        {selected ? threadPanel : (
          <div className="msgs-placeholder" style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
            <MessageSquare size={32} color="rgba(255,255,255,0.07)" />
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>Select a conversation</p>
          </div>
        )}
      </div>
    </>
  )
}
