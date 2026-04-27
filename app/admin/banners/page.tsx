'use client'

import { useEffect, useState } from 'react'
import { Trash2, Plus, Eye, EyeOff } from 'lucide-react'

type Banner = {
  id: string; title: string; subtitle: string | null
  image: string | null; link: string | null
  isActive: boolean; order: number; createdAt: string
}

const EMPTY = { title: '', subtitle: '', image: '', link: '', isActive: true, order: 0 }

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/banners').then(r => r.json()).then(d => { setBanners(d); setLoading(false) })
  }, [])

  const toggleActive = async (id: string, isActive: boolean) => {
    await fetch(`/api/admin/banners/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    })
    setBanners(prev => prev.map(b => b.id === id ? { ...b, isActive: !isActive } : b))
  }

  const del = async (id: string) => {
    if (!confirm('Delete this banner?')) return
    await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' })
    setBanners(prev => prev.filter(b => b.id !== id))
  }

  const create = async () => {
    if (!form.title) return
    setSaving(true)
    const res = await fetch('/api/admin/banners', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, order: Number(form.order) }),
    })
    const banner = await res.json()
    setBanners(prev => [...prev, banner])
    setForm(EMPTY)
    setCreating(false)
    setSaving(false)
  }

  const field = (label: string, key: keyof typeof EMPTY, type = 'text') => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{label}</label>
      <input
        type={type}
        value={form[key] as string}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        style={{
          backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8, padding: '8px 12px', color: '#ffffff', fontSize: 13, outline: 'none',
        }}
      />
    </div>
  )

  return (
    <div style={{ padding: '32px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ color: '#ffffff', fontSize: 22, fontWeight: 700 }}>Banners</h1>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, marginTop: 4 }}>{banners.length} banners · homepage promotions</p>
        </div>
        <button
          onClick={() => setCreating(v => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
            backgroundColor: '#A66A86', borderRadius: 10, border: 'none', cursor: 'pointer',
            color: '#ffffff', fontSize: 13, fontWeight: 600,
          }}
        >
          <Plus size={15} /> New Banner
        </button>
      </div>

      {/* Create form */}
      {creating && (
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14, padding: 20, marginBottom: 20,
        }}>
          <p style={{ color: '#ffffff', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>New Banner</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {field('Title *', 'title')}
            {field('Subtitle', 'subtitle')}
            {field('Image URL', 'image')}
            {field('Link URL', 'link')}
            {field('Display Order', 'order', 'number')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
            <input
              type="checkbox"
              id="activeCheck"
              checked={form.isActive}
              onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
              style={{ accentColor: '#A66A86', width: 14, height: 14 }}
            />
            <label htmlFor="activeCheck" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer' }}>Active</label>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button
              onClick={create} disabled={saving || !form.title}
              style={{
                padding: '8px 18px', backgroundColor: '#A66A86', border: 'none',
                borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              {saving ? 'Saving…' : 'Create'}
            </button>
            <button
              onClick={() => { setCreating(false); setForm(EMPTY) }}
              style={{ padding: '8px 18px', backgroundColor: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 8, color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
        {loading && <p style={{ color: 'rgba(255,255,255,0.3)', padding: 24, textAlign: 'center' }}>Loading…</p>}
        {!loading && banners.length === 0 && !creating && (
          <p style={{ color: 'rgba(255,255,255,0.2)', padding: 32, textAlign: 'center', fontSize: 13 }}>No banners yet. Create one above.</p>
        )}
        {banners.map((b, i) => (
          <div key={b.id} style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px',
            borderBottom: i < banners.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
          }}>
            {/* Preview */}
            <div style={{
              width: 64, height: 40, borderRadius: 8, flexShrink: 0, overflow: 'hidden',
              backgroundColor: 'rgba(255,255,255,0.04)',
            }}>
              {b.image && <img src={b.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <p style={{ color: '#ffffff', fontSize: 13, fontWeight: 600 }}>{b.title}</p>
                <span style={{
                  fontSize: 9, padding: '1px 6px', borderRadius: 4, fontWeight: 600,
                  backgroundColor: b.isActive ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.06)',
                  color: b.isActive ? '#22c55e' : 'rgba(255,255,255,0.3)',
                }}>
                  {b.isActive ? 'ACTIVE' : 'HIDDEN'}
                </span>
              </div>
              {b.subtitle && <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 2 }}>{b.subtitle}</p>}
              {b.link && <p style={{ color: 'rgba(166,106,134,0.6)', fontSize: 11, marginTop: 2 }}>{b.link}</p>}
            </div>

            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, flexShrink: 0 }}>#{b.order}</span>

            <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
              <button
                onClick={() => toggleActive(b.id, b.isActive)}
                style={{ padding: 7, borderRadius: 7, border: 'none', cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.05)' }}
              >
                {b.isActive ? <Eye size={14} color="#22c55e" /> : <EyeOff size={14} color="rgba(255,255,255,0.3)" />}
              </button>
              <button
                onClick={() => del(b.id)}
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
