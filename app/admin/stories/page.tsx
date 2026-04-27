'use client'

import { useEffect, useState } from 'react'
import { Eye, EyeOff, Trash2, Heart, MessageCircle, Plus, X } from 'lucide-react'

type Story = {
  id: string; title: string | null; body: string; category: string; image: string | null
  isPublic: boolean; createdAt: string; author: string; likes: number; comments: number
}

const CATEGORIES = ['REAL_TALK', 'WOMEN_SAY', 'FOR_COUPLES', 'TIPS'] as const
const CAT_LABEL: Record<string, string> = {
  REAL_TALK: 'Real Talk', WOMEN_SAY: 'Women Say', FOR_COUPLES: 'For Couples', TIPS: 'Tips',
}
const CAT_COLOR: Record<string, string> = {
  REAL_TALK: '#C2697A', WOMEN_SAY: '#A66A86', FOR_COUPLES: '#9B72A8', TIPS: '#7A8AB3',
}

const field: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 13, outline: 'none',
  fontFamily: 'inherit', boxSizing: 'border-box',
}

export default function AdminStories() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    title: '', body: '', category: 'TIPS' as string, image: '', isPublic: true,
  })

  useEffect(() => {
    fetch('/api/admin/stories').then(r => r.json()).then(d => { setStories(d); setLoading(false) })
  }, [])

  const toggle = async (id: string, isPublic: boolean) => {
    await fetch(`/api/admin/stories/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublic: !isPublic }),
    })
    setStories(prev => prev.map(s => s.id === id ? { ...s, isPublic: !isPublic } : s))
  }

  const del = async (id: string) => {
    if (!confirm('Delete this story?')) return
    await fetch(`/api/admin/stories/${id}`, { method: 'DELETE' })
    setStories(prev => prev.filter(s => s.id !== id))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.body.trim()) return
    setSaving(true)
    const res = await fetch('/api/admin/stories', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const newStory = await res.json()
      setStories(prev => [newStory, ...prev])
      setForm({ title: '', body: '', category: 'TIPS', image: '', isPublic: true })
      setShowForm(false)
    }
    setSaving(false)
  }

  return (
    <div style={{ padding: '24px 28px', maxWidth: 820 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ color: '#ffffff', fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>Stories</h1>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 3 }}>{stories.length} total</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            backgroundColor: showForm ? 'rgba(255,255,255,0.07)' : '#A66A86',
            border: 'none', borderRadius: 9, padding: '8px 14px',
            color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}
        >
          {showForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> New story</>}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={submit} style={{
          backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14, padding: '20px 22px', marginBottom: 24,
        }}>
          <p style={{ color: '#ffffff', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>New story</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            {/* Category */}
            <div>
              <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, display: 'block', marginBottom: 5 }}>Category</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                style={{ ...field }}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABEL[c]}</option>)}
              </select>
            </div>

            {/* Visibility */}
            <div>
              <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, display: 'block', marginBottom: 5 }}>Visibility</label>
              <select
                value={form.isPublic ? 'public' : 'private'}
                onChange={e => setForm(f => ({ ...f, isPublic: e.target.value === 'public' }))}
                style={{ ...field }}
              >
                <option value="public">Public</option>
                <option value="private">Private (draft)</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, display: 'block', marginBottom: 5 }}>Title (optional)</label>
            <input
              type="text" value={form.title} placeholder="e.g. The Luna Mini is waterproof…"
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              style={{ ...field }}
            />
          </div>

          {/* Body */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, display: 'block', marginBottom: 5 }}>Story body *</label>
            <textarea
              value={form.body} required placeholder="Write the story here…"
              onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
              rows={6}
              style={{ ...field, resize: 'vertical', lineHeight: 1.6 }}
            />
          </div>

          {/* Image URL */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, display: 'block', marginBottom: 5 }}>Cover image URL (optional)</label>
            <input
              type="url" value={form.image} placeholder="https://…"
              onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
              style={{ ...field }}
            />
          </div>

          <button
            type="submit" disabled={saving || !form.body.trim()}
            style={{
              backgroundColor: '#A66A86', border: 'none', borderRadius: 9,
              padding: '9px 20px', color: '#fff', fontSize: 13, fontWeight: 600,
              cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? 'Posting…' : 'Post story'}
          </button>
        </form>
      )}

      {/* Story list */}
      <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
        {loading && <p style={{ color: 'rgba(255,255,255,0.3)', padding: 24, textAlign: 'center', fontSize: 13 }}>Loading…</p>}
        {!loading && stories.length === 0 && (
          <p style={{ color: 'rgba(255,255,255,0.2)', padding: 32, textAlign: 'center', fontSize: 13 }}>No stories yet. Post the first one.</p>
        )}
        {stories.map((s, i) => (
          <div key={s.id} style={{
            padding: '14px 20px', borderBottom: i < stories.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            display: 'flex', alignItems: 'flex-start', gap: 12,
          }}>
            {s.image && (
              <img src={s.image} alt="" style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: CAT_COLOR[s.category] ?? '#A66A86', backgroundColor: `${CAT_COLOR[s.category] ?? '#A66A86'}22`, padding: '2px 8px', borderRadius: 6 }}>
                  {CAT_LABEL[s.category] ?? s.category}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>{s.author}</span>
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>{new Date(s.createdAt).toLocaleDateString()}</span>
                {!s.isPublic && <span style={{ fontSize: 10, color: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.12)', padding: '2px 7px', borderRadius: 5, fontWeight: 600 }}>DRAFT</span>}
              </div>
              {s.title && <p style={{ color: '#ffffff', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{s.title}</p>}
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {s.body}
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>
                  <Heart size={10} /> {s.likes}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>
                  <MessageCircle size={10} /> {s.comments}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
              <button onClick={() => toggle(s.id, s.isPublic)}
                title={s.isPublic ? 'Make private' : 'Make public'}
                style={{ padding: 7, borderRadius: 7, border: 'none', cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                {s.isPublic ? <Eye size={14} color="#22c55e" /> : <EyeOff size={14} color="rgba(255,255,255,0.3)" />}
              </button>
              <button onClick={() => del(s.id)}
                style={{ padding: 7, borderRadius: 7, border: 'none', cursor: 'pointer', backgroundColor: 'rgba(239,68,68,0.08)' }}>
                <Trash2 size={14} color="#ef4444" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
