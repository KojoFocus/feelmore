'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Users, Package, ShoppingCart, BookOpen, MessageSquare, TrendingUp, Clock, ArrowUpRight } from 'lucide-react'

type Stats = {
  users: number; products: number; orders: number; stories: number
  conversations: number; pendingOrders: number; revenue: number
  recentOrders: { id: string; status: string; total: number; currency: string; user: string; createdAt: string }[]
}

const STATUS_COLOR: Record<string, string> = {
  PENDING: '#f59e0b', CONFIRMED: '#3b82f6', PROCESSING: '#8b5cf6',
  SHIPPED: '#06b6d4', DELIVERED: '#22c55e', CANCELLED: '#ef4444', REFUNDED: '#6b7280',
}

function KPI({ icon: Icon, label, value, sub, href, accent }: {
  icon: any; label: string; value: string | number; sub?: string; href: string; accent?: boolean
}) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{
        backgroundColor: accent ? 'rgba(166,106,134,0.1)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${accent ? 'rgba(166,106,134,0.25)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 12, padding: '16px 18px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            backgroundColor: accent ? 'rgba(166,106,134,0.2)' : 'rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={14} color={accent ? '#A66A86' : 'rgba(255,255,255,0.5)'} />
          </div>
          <ArrowUpRight size={12} color="rgba(255,255,255,0.15)" />
        </div>
        <p style={{ color: '#ffffff', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 5 }}>{label}</p>
        {sub && <p style={{ color: '#A66A86', fontSize: 10, marginTop: 3 }}>{sub}</p>}
      </div>
    </Link>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d && !d.error) setStats(d) })
      .catch(() => {})
  }, [])

  const fmtMoney = (n: number) => `GHS ${(n ?? 0).toLocaleString()}`
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

  return (
    <div style={{ padding: '24px 28px', maxWidth: 900 }}>

      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: '#ffffff', fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>Dashboard</h1>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 3 }}>
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* KPI grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
        <KPI icon={TrendingUp} label="Total revenue" value={stats ? fmtMoney(stats.revenue) : '—'} href="/admin/orders" accent />
        <KPI icon={ShoppingCart} label="Orders" value={stats?.orders ?? '—'} sub={stats?.pendingOrders ? `${stats.pendingOrders} pending` : undefined} href="/admin/orders" />
        <KPI icon={Users} label="Users" value={stats?.users ?? '—'} href="/admin/users" />
        <KPI icon={Package} label="Active products" value={stats?.products ?? '—'} href="/admin/products" />
        <KPI icon={BookOpen} label="Stories" value={stats?.stories ?? '—'} href="/admin/stories" />
        <KPI icon={MessageSquare} label="Conversations" value={stats?.conversations ?? '—'} href="/admin/messages" />
      </div>

      {/* Recent orders */}
      <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={13} color="rgba(255,255,255,0.3)" />
            <p style={{ color: '#ffffff', fontSize: 13, fontWeight: 600 }}>Recent Orders</p>
          </div>
          <Link href="/admin/orders" style={{ color: '#A66A86', fontSize: 11, textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
        </div>

        {!stats && (
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13, padding: '20px 18px', textAlign: 'center' }}>Loading…</p>
        )}
        {stats?.recentOrders.length === 0 && (
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13, padding: '20px 18px', textAlign: 'center' }}>No orders yet</p>
        )}
        {stats?.recentOrders.map((o, i) => (
          <div key={o.id} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '11px 18px',
            borderBottom: i < (stats.recentOrders.length - 1) ? '1px solid rgba(255,255,255,0.04)' : 'none',
          }}>
            <div>
              <p style={{ color: '#ffffff', fontSize: 13, fontWeight: 500 }}>{o.user}</p>
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, marginTop: 2 }}>{fmtDate(o.createdAt)}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <p style={{ color: '#ffffff', fontSize: 13, fontWeight: 600 }}>{o.currency} {o.total.toLocaleString()}</p>
              <span style={{
                fontSize: 10, fontWeight: 600,
                color: STATUS_COLOR[o.status] ?? '#fff',
                backgroundColor: `${STATUS_COLOR[o.status] ?? '#fff'}18`,
                padding: '3px 8px', borderRadius: 5,
              }}>
                {o.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
