'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Star, Eye, EyeOff } from 'lucide-react'

type Product = {
  id: string; name: string; slug: string; price: number; currency: string
  stock: number; isActive: boolean; isFeatured: boolean; isBestseller: boolean
  badge: string | null; tagline: string | null; category: string; image: string | null
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/products').then(r => r.json()).then(data => { setProducts(data); setLoading(false) })
  }, [])

  const toggle = async (id: string, field: 'isActive' | 'isFeatured', current: boolean) => {
    await fetch(`/api/admin/products/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: !current }),
    })
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: !current } : p))
  }

  const del = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div style={{ padding: '32px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ color: '#ffffff', fontSize: 22, fontWeight: 700 }}>Products</h1>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, marginTop: 4 }}>{products.length} total</p>
        </div>
        <Link href="/admin/products/new" style={{
          display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#A66A86',
          color: '#fff', padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: 'none',
        }}>
          <Plus size={14} /> New product
        </Link>
      </div>

      <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
        {loading && <p style={{ color: 'rgba(255,255,255,0.3)', padding: '24px', textAlign: 'center' }}>Loading…</p>}
        {products.map((p, i) => (
          <div key={p.id} style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px',
            borderBottom: i < products.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
          }}>
            {/* Image */}
            <div style={{ width: 44, height: 44, borderRadius: 8, backgroundColor: '#1a1520', overflow: 'hidden', flexShrink: 0 }}>
              {p.image && <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: '#ffffff', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 2 }}>{p.category} · {p.currency} {p.price.toLocaleString()} · {p.stock} in stock</p>
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              {p.isFeatured && <span style={{ fontSize: 10, backgroundColor: 'rgba(166,106,134,0.2)', color: '#A66A86', padding: '2px 7px', borderRadius: 6 }}>Featured</span>}
              {p.isBestseller && <span style={{ fontSize: 10, backgroundColor: 'rgba(34,197,94,0.15)', color: '#22c55e', padding: '2px 7px', borderRadius: 6 }}>Bestseller</span>}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
              <button onClick={() => toggle(p.id, 'isActive', p.isActive)} title={p.isActive ? 'Deactivate' : 'Activate'}
                style={{ padding: 7, borderRadius: 7, border: 'none', cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                {p.isActive ? <Eye size={14} color="#22c55e" /> : <EyeOff size={14} color="rgba(255,255,255,0.3)" />}
              </button>
              <button onClick={() => toggle(p.id, 'isFeatured', p.isFeatured)} title="Toggle featured"
                style={{ padding: 7, borderRadius: 7, border: 'none', cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                <Star size={14} color={p.isFeatured ? '#A66A86' : 'rgba(255,255,255,0.3)'} fill={p.isFeatured ? '#A66A86' : 'none'} />
              </button>
              <Link href={`/admin/products/${p.id}`}
                style={{ padding: 7, borderRadius: 7, backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center' }}>
                <Pencil size={14} color="rgba(255,255,255,0.5)" />
              </Link>
              <button onClick={() => del(p.id, p.name)}
                style={{ padding: 7, borderRadius: 7, border: 'none', cursor: 'pointer', backgroundColor: 'rgba(239,68,68,0.1)' }}>
                <Trash2 size={14} color="#ef4444" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
