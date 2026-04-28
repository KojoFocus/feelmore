'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Send, ShoppingCart, BookOpen, Heart, Shield, Package } from 'lucide-react'

type Order = {
  id: string; status: string; total: number; currency: string; createdAt: string
  items: { name: string; qty: number; price: number }[]
}
type Story = { id: string; title: string | null; category: string; isPublic: boolean; createdAt: string }
type UserDetail = {
  id: string; name: string | null; email: string; role: string
  verified: boolean; createdAt: string
  counts: { orders: number; stories: number; wishlist: number }
  conversationId: string; orders: Order[]; stories: Story[]
}
type Msg = { id: string; type: string; body: string | null; mediaUrl: string | null; isFromAdmin: boolean; createdAt: string }

const STATUS_COLOR: Record<string, string> = {
  PENDING: '#f59e0b', CONFIRMED: '#3b82f6', PROCESSING: '#8b5cf6',
  SHIPPED: '#06b6d4', DELIVERED: '#22c55e', CANCELLED: '#ef4444', REFUNDED: '#6b7280',
}

function fmtTime(iso: string) {
  const d = new Date(iso)
  return d.toDateString() === new Date().toDateString()
    ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

function Bubble({ msg }: { msg: Msg }) {
  const mine = msg.isFromAdmin
  const bg = mine ? 'rgba(166,106,134,0.2)' : 'rgba(255,255,255,0.06)'
  const radius = mine ? '16px 4px 16px 16px' : '4px 16px 16px 16px'
  if (msg.type === 'IMAGE' && msg.mediaUrl) return (
    <div style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', marginBottom: 6 }}>
      <img src={msg.mediaUrl} alt="" style={{ maxWidth: 200, borderRadius: 12 }} />
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

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [user, setUser] = useState<UserDetail | null>(null)
  const [tab, setTab] = useState<'orders' | 'stories' | 'chat'>('chat')
  const [messages, setMessages] = useState<Msg[]>([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    fetch(`/api/admin/users/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => setUser(d))
  }, [id])

  const loadMsgs = useCallback((convId: string) => {
    fetch(`/api/admin/messages/${convId}`)
      .then(r => r.ok ? r.json() : [])
      .then(d => { setMessages(d); setTimeout(() => bottomRef.current?.scrollIntoView(), 50) })
  }, [])

  useEffect(() => {
    if (!user) return
    loadMsgs(user.conversationId)
    pollRef.current = setInterval(() => loadMsgs(user.conversationId), 5000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [user, loadMsgs])

  const send = async () => {
    if (!text.trim() || !user || sending) return
    setSending(true)
    const res = await fetch('/api/admin/messages', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId: user.conversationId, body: text.trim(), type: 'TEXT' }),
    })
    if (res.ok) {
      const msg = await res.json()
      setMessages(prev => [...prev, msg])
      setText('')
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }
    setSending(false)
  }

  const username = user?.email.endsWith('@feelmore.internal')
    ? user.email.replace('@feelmore.internal', '')
    : user?.email ?? ''

  if (!user) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Loading…</p>
    </div>
  )

  const tabStyle = (t: typeof tab) => ({
    padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none',
    backgroundColor: tab === t ? 'rgba(166,106,134,0.2)' : 'transparent',
    color: tab === t ? '#A66A86' : 'rgba(255,255,255,0.4)',
  } as React.CSSProperties)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14, padding: 0, fontSize: 12 }}>
          <ArrowLeft size={14} /> Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'rgba(166,106,134,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: '#A66A86', fontSize: 18, fontWeight: 700 }}>{(user.name ?? username)[0]?.toUpperCase()}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <p style={{ color: '#ffffff', fontSize: 16, fontWeight: 700 }}>{user.name ?? username}</p>
              {user.role === 'ADMIN' && <Shield size={12} color="#A66A86" />}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 2 }}>@{username} · joined {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#ffffff', fontSize: 15, fontWeight: 700 }}>{user.counts.orders}</p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>Orders</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#ffffff', fontSize: 15, fontWeight: 700 }}>{user.counts.stories}</p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>Stories</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#ffffff', fontSize: 15, fontWeight: 700 }}>{user.counts.wishlist}</p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>Wishlist</p>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginTop: 16 }}>
          <button style={tabStyle('chat')} onClick={() => setTab('chat')}>Chat</button>
          <button style={tabStyle('orders')} onClick={() => setTab('orders')}>Orders ({user.counts.orders})</button>
          <button style={tabStyle('stories')} onClick={() => setTab('stories')}>Stories ({user.counts.stories})</button>
        </div>
      </div>

      {/* Tab content */}
      {tab === 'chat' && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px' }}>
            {messages.length === 0 && (
              <p style={{ color: 'rgba(255,255,255,0.2)', textAlign: 'center', fontSize: 12, marginTop: 20 }}>No messages yet — start the conversation</p>
            )}
            {messages.map(msg => <Bubble key={msg.id} msg={msg} />)}
            <div ref={bottomRef} />
          </div>
          <div style={{ padding: '10px 16px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8, alignItems: 'flex-end', flexShrink: 0 }}>
            <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '8px 12px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                placeholder={`Message @${username}…`}
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
      )}

      {tab === 'orders' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {user.orders.length === 0 && (
            <div style={{ textAlign: 'center', paddingTop: 40 }}>
              <Package size={28} color="rgba(255,255,255,0.08)" />
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, marginTop: 10 }}>No orders yet</p>
            </div>
          )}
          {user.orders.map(o => (
            <div key={o.id} style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 16px', marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div>
                  <p style={{ color: '#ffffff', fontSize: 13, fontWeight: 600 }}>#{o.id.slice(-8).toUpperCase()}</p>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 2 }}>{new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 6, backgroundColor: `${STATUS_COLOR[o.status]}20`, color: STATUS_COLOR[o.status] }}>{o.status}</span>
                  <p style={{ color: '#ffffff', fontSize: 14, fontWeight: 700 }}>{o.currency} {o.total.toLocaleString()}</p>
                </div>
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10 }}>
                {o.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{item.name} × {item.qty}</p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{o.currency} {(item.price * item.qty).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'stories' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {user.stories.length === 0 && (
            <div style={{ textAlign: 'center', paddingTop: 40 }}>
              <BookOpen size={28} color="rgba(255,255,255,0.08)" />
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, marginTop: 10 }}>No stories yet</p>
            </div>
          )}
          {user.stories.map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: '#ffffff', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title ?? '(untitled)'}</p>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 2 }}>{s.category.replace(/_/g, ' ')} · {new Date(s.createdAt).toLocaleDateString()}</p>
              </div>
              {!s.isPublic && <span style={{ fontSize: 10, backgroundColor: 'rgba(245,158,11,0.15)', color: '#f59e0b', padding: '2px 7px', borderRadius: 6, flexShrink: 0 }}>Draft</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
