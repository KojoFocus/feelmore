'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'

export default function AdminLogin() {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    })
    if (res.ok) {
      router.push('/admin')
    } else {
      setError('Incorrect PIN')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#0A080D', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        <div className="text-center mb-8">
          <p style={{ color: '#ffffff', fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' }}>
            feel<span style={{ color: '#A66A86' }}>more.</span>
          </p>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, marginTop: 6 }}>Admin Dashboard</p>
        </div>

        <form onSubmit={submit}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: 'rgba(166,106,134,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={18} color="#A66A86" />
              </div>
            </div>

            <input
              type="password"
              value={pin}
              onChange={e => setPin(e.target.value)}
              placeholder="Enter admin PIN"
              autoFocus
              style={{
                width: '100%', backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10,
                padding: '12px 16px', color: '#ffffff', fontSize: 15,
                outline: 'none', boxSizing: 'border-box', marginBottom: 12,
              }}
            />

            {error && <p style={{ color: '#ef4444', fontSize: 12, marginBottom: 10 }}>{error}</p>}

            <button
              type="submit"
              disabled={loading || !pin}
              style={{
                width: '100%', backgroundColor: '#A66A86', border: 'none',
                borderRadius: 10, padding: '12px 0', color: '#ffffff',
                fontSize: 14, fontWeight: 600, cursor: loading ? 'wait' : 'pointer',
                opacity: !pin ? 0.5 : 1,
              }}
            >
              {loading ? 'Checking…' : 'Enter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
