'use client'

import { useEffect, useState } from 'react'
import { ShoppingCart, BookOpen, Shield } from 'lucide-react'

type User = {
  id: string; name: string | null; email: string; role: string
  verified: boolean; createdAt: string; orders: number; stories: number
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/admin/users').then(r => r.json()).then(d => { setUsers(d); setLoading(false) })
  }, [])

  const filtered = users.filter(u =>
    (u.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: '32px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ color: '#ffffff', fontSize: 22, fontWeight: 700 }}>Users</h1>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, marginTop: 4 }}>{users.length} registered</p>
        </div>
        <input
          value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 14px', color: '#ffffff', fontSize: 13, outline: 'none', width: 200 }}
        />
      </div>

      <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
        {loading && <p style={{ color: 'rgba(255,255,255,0.3)', padding: 24, textAlign: 'center' }}>Loading…</p>}
        {filtered.map((u, i) => (
          <div key={u.id} style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px',
            borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
          }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', backgroundColor: 'rgba(166,106,134,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#A66A86', fontSize: 14, fontWeight: 700 }}>{(u.name ?? u.email)[0].toUpperCase()}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <p style={{ color: '#ffffff', fontSize: 13, fontWeight: 600 }}>{u.name ?? '—'}</p>
                {u.role === 'ADMIN' && <Shield size={11} color="#A66A86" />}
                {u.verified && <span style={{ fontSize: 9, backgroundColor: 'rgba(34,197,94,0.15)', color: '#22c55e', padding: '1px 6px', borderRadius: 4 }}>Verified</span>}
              </div>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 2 }}>{u.email}</p>
            </div>
            <div style={{ display: 'flex', gap: 14, flexShrink: 0 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>
                <ShoppingCart size={11} /> {u.orders}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>
                <BookOpen size={11} /> {u.stories}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>{new Date(u.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
