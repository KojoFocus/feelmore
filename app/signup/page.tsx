'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'Something went wrong')
      setLoading(false)
    } else {
      router.push('/onboarding')
    }
  }

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#0A080D', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px' }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <p style={{ color: '#ffffff', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>
            feel<span style={{ color: '#A66A86' }}>more.</span>
          </p>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, marginTop: 6 }}>Create your account</p>
        </div>

        <form onSubmit={submit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Username</label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                placeholder="Choose a username"
                required
                autoFocus
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Min. 6 characters"
                  required
                  style={{ ...inputStyle, paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', display: 'flex' }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p style={{ color: '#ef4444', fontSize: 13, padding: '8px 12px', backgroundColor: 'rgba(239,68,68,0.08)', borderRadius: 8 }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !form.username || !form.password}
              style={{
                marginTop: 4, width: '100%', backgroundColor: '#A66A86', border: 'none',
                borderRadius: 12, padding: '14px 0', color: '#ffffff', fontSize: 15,
                fontWeight: 600, cursor: loading ? 'wait' : 'pointer',
                opacity: (!form.username || !form.password) ? 0.5 : 1,
              }}
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </div>
        </form>

        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center', marginTop: 24 }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#A66A86', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10,
  padding: '12px 14px',
  color: '#ffffff',
  fontSize: 15,
  outline: 'none',
  boxSizing: 'border-box',
}
