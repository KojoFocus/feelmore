'use client'

import { useEffect, useState } from 'react'

type Order = {
  id: string; status: string; total: number; currency: string
  user: string; createdAt: string; paymentMethod: string | null
  items: { product: string; quantity: number; price: number }[]
}

const STATUSES = ['PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED','REFUNDED']
const STATUS_COLOR: Record<string, string> = {
  PENDING: '#f59e0b', CONFIRMED: '#3b82f6', PROCESSING: '#8b5cf6',
  SHIPPED: '#06b6d4', DELIVERED: '#22c55e', CANCELLED: '#ef4444', REFUNDED: '#6b7280',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/orders').then(r => r.json()).then(d => { setOrders(d); setLoading(false) })
  }, [])

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  return (
    <div style={{ padding: '32px 28px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: '#ffffff', fontSize: 22, fontWeight: 700 }}>Orders</h1>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, marginTop: 4 }}>{orders.length} total</p>
      </div>

      <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
        {loading && <p style={{ color: 'rgba(255,255,255,0.3)', padding: 24, textAlign: 'center' }}>Loading…</p>}
        {orders.length === 0 && !loading && <p style={{ color: 'rgba(255,255,255,0.2)', padding: 24, textAlign: 'center' }}>No orders yet</p>}
        {orders.map((o, i) => (
          <div key={o.id} style={{ borderBottom: i < orders.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
            <div
              onClick={() => setExpanded(expanded === o.id ? null : o.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', cursor: 'pointer' }}
            >
              <div style={{ flex: 1 }}>
                <p style={{ color: '#ffffff', fontSize: 13, fontWeight: 600 }}>{o.user}</p>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 2 }}>
                  {new Date(o.createdAt).toLocaleDateString()} · {o.paymentMethod ?? 'N/A'}
                </p>
              </div>
              <p style={{ color: '#ffffff', fontSize: 13, fontWeight: 600 }}>{o.currency} {o.total.toLocaleString()}</p>
              <select
                value={o.status}
                onChange={e => { e.stopPropagation(); updateStatus(o.id, e.target.value) }}
                onClick={e => e.stopPropagation()}
                style={{
                  backgroundColor: `${STATUS_COLOR[o.status]}22`, border: `1px solid ${STATUS_COLOR[o.status]}44`,
                  color: STATUS_COLOR[o.status], borderRadius: 8, padding: '4px 8px', fontSize: 11, fontWeight: 600, cursor: 'pointer', outline: 'none',
                }}
              >
                {STATUSES.map(s => <option key={s} value={s} style={{ backgroundColor: '#1a1520', color: '#fff' }}>{s}</option>)}
              </select>
            </div>
            {expanded === o.id && (
              <div style={{ padding: '0 20px 16px', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                {o.items.map((item, j) => (
                  <div key={j} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: j < o.items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{item.product} × {item.quantity}</p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{o.currency} {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
