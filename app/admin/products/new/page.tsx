'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

type Category = { id: string; name: string }

export default function NewProduct() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '', slug: '', description: '', price: '', stock: '0',
    currency: 'GHS', categoryId: '', tagline: '', badge: '',
    isFeatured: false, isBestseller: false, isActive: true, imageUrl: '',
  })

  useEffect(() => {
    fetch('/api/admin/categories').then(r => r.json()).then(setCategories).catch(() => {})
  }, [])

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const autoSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/admin/products', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: parseFloat(form.price), stock: parseInt(form.stock) }),
    })
    if (res.ok) router.push('/admin/products')
    else setSaving(false)
  }

  const field = (label: string, key: string, type = 'text', placeholder = '') => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{label}</label>
      <input
        type={type}
        value={(form as any)[key]}
        onChange={e => {
          set(key, e.target.value)
          if (key === 'name') set('slug', autoSlug(e.target.value))
        }}
        placeholder={placeholder}
        style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: '#ffffff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
      />
    </div>
  )

  return (
    <div style={{ padding: '32px 28px', maxWidth: 640 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Link href="/admin/products" style={{ color: 'rgba(255,255,255,0.4)', display: 'flex' }}><ChevronLeft size={20} /></Link>
        <h1 style={{ color: '#ffffff', fontSize: 20, fontWeight: 700 }}>New Product</h1>
      </div>

      <form onSubmit={submit}>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 24, marginBottom: 16 }}>
          <p style={{ color: '#ffffff', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Basic Info</p>
          {field('Name', 'name', 'text', 'Luna Mini')}
          {field('Slug', 'slug', 'text', 'luna-mini')}
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4}
              style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: '#ffffff', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
          {field('Tagline', 'tagline', 'text', 'Beginner friendly')}
          {field('Badge', 'badge', 'text', 'New')}
        </div>

        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 24, marginBottom: 16 }}>
          <p style={{ color: '#ffffff', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Pricing & Stock</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {field('Price', 'price', 'number', '250')}
            {field('Currency', 'currency', 'text', 'GHS')}
            {field('Stock', 'stock', 'number', '10')}
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 24, marginBottom: 16 }}>
          <p style={{ color: '#ffffff', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Category & Image</p>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Category</label>
            <select value={form.categoryId} onChange={e => set('categoryId', e.target.value)}
              style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: '#ffffff', fontSize: 14, outline: 'none' }}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          {field('Image URL', 'imageUrl', 'url', 'https://...')}
        </div>

        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <p style={{ color: '#ffffff', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Visibility</p>
          {[['isFeatured', 'Featured on home page'], ['isBestseller', 'Mark as bestseller'], ['isActive', 'Active (visible in shop)']].map(([key, label]) => (
            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, cursor: 'pointer' }}>
              <input type="checkbox" checked={(form as any)[key]} onChange={e => set(key, e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#A66A86' }} />
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{label}</span>
            </label>
          ))}
        </div>

        <button type="submit" disabled={saving || !form.name || !form.price}
          style={{ width: '100%', backgroundColor: '#A66A86', border: 'none', borderRadius: 12, padding: '13px 0', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Creating…' : 'Create Product'}
        </button>
      </form>
    </div>
  )
}
