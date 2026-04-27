'use client'

import { useEffect, useState } from 'react'
import { Plus, Sparkles, Package } from 'lucide-react'

type Category = { id: string; name: string; slug: string; description: string | null; _count: { products: number } }

const field: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 13, outline: 'none',
  fontFamily: 'inherit', boxSizing: 'border-box',
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [seedMsg, setSeedMsg] = useState('')
  const [form, setForm] = useState({ name: '', slug: '', description: '' })
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const load = () => {
    fetch('/api/admin/categories').then(r => r.json()).then(d => { setCategories(d); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  const seed = async () => {
    setSeeding(true)
    const res = await fetch('/api/admin/categories', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seed: true }),
    })
    const data = await res.json()
    setSeedMsg(data.message)
    load()
    setSeeding(false)
    setTimeout(() => setSeedMsg(''), 4000)
  }

  const create = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/admin/categories', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setForm({ name: '', slug: '', description: '' })
    setShowForm(false)
    load()
    setSaving(false)
  }

  const autoSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  return (
    <div style={{ padding: '24px 28px', maxWidth: 700 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ color: '#ffffff', fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>Categories</h1>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 3 }}>{categories.length} categories</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={seed} disabled={seeding}
            style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 9, padding: '8px 14px', color: 'rgba(255,255,255,0.7)', fontSize: 13, cursor: 'pointer' }}>
            <Sparkles size={13} /> {seeding ? 'Seeding…' : 'Seed defaults'}
          </button>
          <button onClick={() => setShowForm(v => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#A66A86', border: 'none', borderRadius: 9, padding: '8px 14px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={13} /> Add category
          </button>
        </div>
      </div>

      {seedMsg && (
        <div style={{ marginBottom: 16, padding: '10px 14px', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10 }}>
          <p style={{ color: '#22c55e', fontSize: 13 }}>{seedMsg}</p>
        </div>
      )}

      {showForm && (
        <form onSubmit={create} style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '18px 20px', marginBottom: 20 }}>
          <p style={{ color: '#fff', fontSize: 14, fontWeight: 600, marginBottom: 14 }}>New category</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, display: 'block', marginBottom: 5 }}>Name *</label>
              <input value={form.name} required placeholder="e.g. Lingerie"
                onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: autoSlug(e.target.value) }))}
                style={field} />
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, display: 'block', marginBottom: 5 }}>Slug *</label>
              <input value={form.slug} required placeholder="e.g. lingerie"
                onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                style={field} />
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, display: 'block', marginBottom: 5 }}>Description</label>
            <input value={form.description} placeholder="Short description (optional)"
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              style={field} />
          </div>
          <button type="submit" disabled={saving}
            style={{ backgroundColor: '#A66A86', border: 'none', borderRadius: 9, padding: '9px 20px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            {saving ? 'Creating…' : 'Create category'}
          </button>
        </form>
      )}

      <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
        {loading && <p style={{ color: 'rgba(255,255,255,0.3)', padding: 24, textAlign: 'center', fontSize: 13 }}>Loading…</p>}
        {!loading && categories.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>No categories yet.</p>
            <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: 12, marginTop: 6 }}>Click &quot;Seed defaults&quot; to add Sex Toys, Lingerie, Lubricants and more.</p>
          </div>
        )}
        {categories.map((cat, i) => (
          <div key={cat.id} style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '13px 20px',
            borderBottom: i < categories.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
          }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, backgroundColor: 'rgba(166,106,134,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Package size={15} color="#A66A86" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{cat.name}</p>
              {cat.description && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 2 }}>{cat.description}</p>}
              <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: 10, marginTop: 2 }}>/{cat.slug}</p>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{cat._count.products} products</span>
          </div>
        ))}
      </div>
    </div>
  )
}
