'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

type Category = { id: string; name: string }

export default function EditProduct() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [categories, setCategories] = useState<Category[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    name: '', slug: '', description: '', price: '', stock: '0',
    currency: 'GHS', categoryId: '', tagline: '', badge: '',
    isFeatured: false, isBestseller: false, isActive: true,
  })

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/products/${id}`).then(r => r.json()),
      fetch('/api/admin/categories').then(r => r.json()),
    ]).then(([product, cats]) => {
      setCategories(cats)
      setForm({
        name: product.name ?? '',
        slug: product.slug ?? '',
        description: product.description ?? '',
        price: String(product.price ?? ''),
        stock: String(product.stock ?? 0),
        currency: product.currency ?? 'GHS',
        categoryId: product.categoryId ?? '',
        tagline: product.tagline ?? '',
        badge: product.badge ?? '',
        isFeatured: product.isFeatured ?? false,
        isBestseller: product.isBestseller ?? false,
        isActive: product.isActive ?? true,
      })
      setLoading(false)
    })
  }, [id])

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))
  const autoSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
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

  if (loading) return <div style={{ padding: 40, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>Loading…</div>

  return (
    <div style={{ padding: '32px 28px', maxWidth: 640 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Link href="/admin/products" style={{ color: 'rgba(255,255,255,0.4)', display: 'flex' }}><ChevronLeft size={20} /></Link>
        <h1 style={{ color: '#ffffff', fontSize: 20, fontWeight: 700 }}>Edit Product</h1>
      </div>

      <form onSubmit={submit}>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 24, marginBottom: 16 }}>
          <p style={{ color: '#ffffff', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Basic Info</p>
          {field('Name', 'name')}
          {field('Slug', 'slug')}
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
            {field('Price', 'price', 'number')}
            {field('Currency', 'currency')}
            {field('Stock', 'stock', 'number')}
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 24, marginBottom: 16 }}>
          <p style={{ color: '#ffffff', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Category</p>
          <select value={form.categoryId} onChange={e => set('categoryId', e.target.value)}
            style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: '#ffffff', fontSize: 14, outline: 'none' }}>
            <option value="">Select category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <p style={{ color: '#ffffff', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Visibility</p>
          {([['isFeatured', 'Featured on home page'], ['isBestseller', 'Mark as bestseller'], ['isActive', 'Active (visible in shop)']] as const).map(([key, label]) => (
            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, cursor: 'pointer' }}>
              <input type="checkbox" checked={(form as any)[key]} onChange={e => set(key, e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#A66A86' }} />
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{label}</span>
            </label>
          ))}
        </div>

        <button type="submit" disabled={saving || !form.name || !form.price}
          style={{ width: '100%', backgroundColor: '#A66A86', border: 'none', borderRadius: 12, padding: '13px 0', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
