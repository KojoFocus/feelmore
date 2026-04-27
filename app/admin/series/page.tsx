'use client'

import { useEffect, useState } from 'react'
import { Eye, EyeOff, Trash2, BookOpen, CheckCircle } from 'lucide-react'

type Series = {
  id: string; title: string; slug: string; genre: string
  isPublic: boolean; isComplete: boolean; author: string
  episodes: number; likes: number; createdAt: string
  coverImage: string | null
}

export default function AdminSeries() {
  const [series, setSeries] = useState<Series[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/series').then(r => r.json()).then(d => { setSeries(d); setLoading(false) })
  }, [])

  const togglePublic = async (id: string, isPublic: boolean) => {
    await fetch(`/api/admin/series/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublic: !isPublic }),
    })
    setSeries(prev => prev.map(s => s.id === id ? { ...s, isPublic: !isPublic } : s))
  }

  const toggleComplete = async (id: string, isComplete: boolean) => {
    await fetch(`/api/admin/series/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isComplete: !isComplete }),
    })
    setSeries(prev => prev.map(s => s.id === id ? { ...s, isComplete: !isComplete } : s))
  }

  const del = async (id: string) => {
    if (!confirm('Delete this series and all its episodes?')) return
    await fetch(`/api/admin/series/${id}`, { method: 'DELETE' })
    setSeries(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div style={{ padding: '32px 28px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: '#ffffff', fontSize: 22, fontWeight: 700 }}>Series</h1>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, marginTop: 4 }}>{series.length} series · erotica library</p>
      </div>

      <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
        {loading && <p style={{ color: 'rgba(255,255,255,0.3)', padding: 24, textAlign: 'center' }}>Loading…</p>}
        {!loading && series.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <BookOpen size={32} color="rgba(255,255,255,0.08)" />
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 14, marginTop: 12 }}>No series yet</p>
          </div>
        )}
        {series.map((s, i) => (
          <div key={s.id} style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px',
            borderBottom: i < series.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
          }}>
            {/* Cover thumbnail */}
            <div style={{
              width: 44, height: 60, borderRadius: 6, flexShrink: 0, overflow: 'hidden',
              backgroundColor: 'rgba(166,106,134,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {s.coverImage
                ? <img src={s.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <BookOpen size={16} color="rgba(166,106,134,0.5)" />
              }
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <p style={{ color: '#ffffff', fontSize: 13, fontWeight: 600 }}>{s.title}</p>
                {s.isComplete && (
                  <span style={{ fontSize: 9, backgroundColor: 'rgba(34,197,94,0.12)', color: '#22c55e', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>
                    COMPLETE
                  </span>
                )}
              </div>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>
                {s.author} · {s.genre} · {s.episodes} ep · {s.likes} likes
              </p>
            </div>

            <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
              <button
                onClick={() => toggleComplete(s.id, s.isComplete)}
                title={s.isComplete ? 'Mark ongoing' : 'Mark complete'}
                style={{ padding: 7, borderRadius: 7, border: 'none', cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.05)' }}
              >
                <CheckCircle size={14} color={s.isComplete ? '#22c55e' : 'rgba(255,255,255,0.25)'} />
              </button>
              <button
                onClick={() => togglePublic(s.id, s.isPublic)}
                style={{ padding: 7, borderRadius: 7, border: 'none', cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.05)' }}
              >
                {s.isPublic ? <Eye size={14} color="#22c55e" /> : <EyeOff size={14} color="rgba(255,255,255,0.3)" />}
              </button>
              <button
                onClick={() => del(s.id)}
                style={{ padding: 7, borderRadius: 7, border: 'none', cursor: 'pointer', backgroundColor: 'rgba(239,68,68,0.1)' }}
              >
                <Trash2 size={14} color="#ef4444" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
