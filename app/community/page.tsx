'use client'

import { useEffect, useState } from 'react'
import { Heart, MessageCircle, Plus, X, Shield } from 'lucide-react'

type Post = {
  id: string
  body: string
  createdAt: string
  _count: { likes: number; comments: number }
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [body, setBody] = useState('')
  const [anonymous, setAnonymous] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetch('/api/community')
      .then(r => r.json())
      .then(data => { setPosts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const submit = async () => {
    if (!body.trim()) return
    setSubmitting(true)
    try {
      await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body, anonymous }),
      })
      setSubmitted(true)
      setBody('')
      setShowForm(false)
      setTimeout(() => setSubmitted(false), 4000)
    } catch {
      // ignore
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#0A080D', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 0' }}>
        <p style={{ fontFamily: 'var(--font-playfair)', fontSize: 24, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
          Real Talk
        </p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>
          Honest conversations. No judgment. No names.
        </p>

        {/* Moderation note */}
        <div className="flex items-start gap-3 rounded-2xl px-4 py-3 mb-6"
          style={{ backgroundColor: 'rgba(166,106,134,0.06)', border: '1px solid rgba(166,106,134,0.1)' }}>
          <Shield size={14} color="#A66A86" strokeWidth={1.5} style={{ marginTop: 1, flexShrink: 0 }} />
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
            This is a safe space. All posts are reviewed before appearing. Only approved posts are visible.
          </p>
        </div>
      </div>

      {/* Submitted confirmation */}
      {submitted && (
        <div className="mx-5 mb-4 rounded-2xl px-4 py-3 flex items-center gap-3"
          style={{ backgroundColor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
          <span style={{ fontSize: 13, color: '#22c55e' }}>Your post is in review. We&apos;ll publish it shortly.</span>
        </div>
      )}

      {/* Feed */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading && [1, 2, 3].map(i => (
          <div key={i} className="rounded-2xl animate-pulse" style={{ height: 120, backgroundColor: 'rgba(255,255,255,0.03)' }} />
        ))}

        {!loading && posts.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: 60 }}>
            <p style={{ fontFamily: 'var(--font-playfair)', fontSize: 18, color: '#fff', marginBottom: 8 }}>Be the first to speak.</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Someone out there needs to hear what you have to say.</p>
          </div>
        )}

        {posts.map(post => (
          <div key={post.id} className="rounded-2xl p-4"
            style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span style={{ fontSize: 10, fontWeight: 600, color: '#A66A86', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Real Talk</span>
              <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 10 }}>·</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>{timeAgo(post.createdAt)}</span>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.65, marginBottom: 14 }}>
              {post.body}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Heart size={12} strokeWidth={1.5} color="rgba(255,255,255,0.25)" />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>{post._count.likes}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageCircle size={12} strokeWidth={1.5} color="rgba(255,255,255,0.25)" />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>{post._count.comments}</span>
              </div>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.15)', marginLeft: 'auto' }}>Anonymous</span>
            </div>
          </div>
        ))}
      </div>

      {/* Post form overlay */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-[430px] mx-auto rounded-t-3xl p-6"
            style={{ backgroundColor: '#0F0C0A', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-5">
              <p style={{ fontFamily: 'var(--font-playfair)', fontSize: 18, fontWeight: 600, color: '#fff' }}>Say something.</p>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', display: 'flex' }}>
                <X size={18} />
              </button>
            </div>

            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="What's on your mind? Be honest. Be kind."
              rows={5}
              style={{
                width: '100%', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14, padding: '14px', color: '#fff', fontSize: 14, lineHeight: 1.6,
                outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-inter)',
              }}
            />

            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => setAnonymous(a => !a)}
                className="flex items-center gap-2"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <div style={{
                  width: 36, height: 20, borderRadius: 999,
                  backgroundColor: anonymous ? '#A66A86' : 'rgba(255,255,255,0.1)',
                  position: 'relative', transition: 'background-color 0.2s',
                }}>
                  <div style={{
                    position: 'absolute', top: 2, left: anonymous ? 18 : 2,
                    width: 16, height: 16, borderRadius: '50%',
                    backgroundColor: '#fff', transition: 'left 0.2s',
                  }} />
                </div>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>Post anonymously</span>
              </button>

              <button
                onClick={submit}
                disabled={!body.trim() || submitting}
                style={{
                  backgroundColor: '#A66A86', border: 'none', borderRadius: 12,
                  padding: '10px 22px', color: '#fff', fontSize: 14, fontWeight: 600,
                  cursor: body.trim() && !submitting ? 'pointer' : 'default',
                  opacity: body.trim() && !submitting ? 1 : 0.4,
                }}
              >
                {submitting ? 'Sending…' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed z-40 flex items-center gap-2"
        style={{
          bottom: 88, right: 20, backgroundColor: '#A66A86', border: 'none',
          borderRadius: 999, padding: '12px 20px', cursor: 'pointer',
          boxShadow: '0 4px 24px rgba(166,106,134,0.35)',
        }}
      >
        <Plus size={16} color="#fff" strokeWidth={2.5} />
        <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>Share something</span>
      </button>
    </div>
  )
}
