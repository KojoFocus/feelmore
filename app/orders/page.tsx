'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Package } from 'lucide-react'

type OrderItem = { name: string; slug: string; image: string | null; qty: number; price: number }

const slugImg: Record<string, string> = {
  'luna-mini':                   'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=200&h=200&fit=crop',
  'vibe-ring':                   'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=200&h=200&fit=crop',
  'rose-bullet':                 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop',
  'g-spot-pro':                  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop',
  'silk-glide-water-based':      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=200&h=200&fit=crop',
  'velvet-silicone-lube':        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&h=200&fit=crop',
  'double-trouble-couples-vibe': 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop',
  'magic-wand-massager':         'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200&h=200&fit=crop',
}
type Order = { id: string; status: string; total: number; currency: string; createdAt: string; items: OrderItem[] }

const STATUS_COLOR: Record<string, string> = {
  PENDING: '#f59e0b', CONFIRMED: '#3b82f6', PROCESSING: '#8b5cf6',
  SHIPPED: '#06b6d4', DELIVERED: '#22c55e', CANCELLED: '#ef4444', REFUNDED: '#6b7280',
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.ok ? r.json() : [])
      .then(d => { setOrders(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div style={{ backgroundColor: '#0A080D', minHeight: '100dvh', paddingBottom: 100 }}>
      <div style={{
        paddingTop: 'max(52px, env(safe-area-inset-top, 52px))',
        padding: 'max(52px, env(safe-area-inset-top, 52px)) 20px 0',
        marginBottom: 20,
      }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, padding: 0, fontSize: 13 }}>
          <ArrowLeft size={15} /> Back
        </button>
        <h1 style={{ color: '#ffffff', fontSize: 22, fontWeight: 700 }}>My Orders</h1>
      </div>

      <div style={{ padding: '0 20px' }}>
        {loading && <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', paddingTop: 60, fontSize: 13 }}>Loading…</p>}

        {!loading && orders.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: 80 }}>
            <Package size={40} color="rgba(255,255,255,0.07)" />
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginTop: 14 }}>No orders yet</p>
            <button onClick={() => router.push('/shop')} style={{
              marginTop: 20, backgroundColor: '#A66A86', color: '#fff', border: 'none',
              padding: '12px 28px', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>Browse shop</button>
          </div>
        )}

        {orders.map(o => (
          <div key={o.id} style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px 16px', marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ color: '#ffffff', fontSize: 13, fontWeight: 600 }}>#{o.id.slice(-8).toUpperCase()}</p>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 2 }}>{new Date(o.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 6, backgroundColor: `${STATUS_COLOR[o.status] ?? '#888'}22`, color: STATUS_COLOR[o.status] ?? '#888' }}>{o.status}</span>
                <p style={{ color: '#ffffff', fontSize: 15, fontWeight: 700, marginTop: 4 }}>{o.currency} {o.total.toLocaleString()}</p>
              </div>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {o.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#1a1520', flexShrink: 0, overflow: 'hidden' }}>
                    {(() => { const img = (!item.image || item.image.startsWith('/images/')) ? slugImg[item.slug] : item.image; return img ? <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null })()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>× {item.qty} · {o.currency} {(item.price * item.qty).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
