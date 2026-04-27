'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogOut, ShoppingBag, BookOpen, Heart, ChevronRight } from 'lucide-react'

type User = { id: string; name: string | null; email: string; avatar: string | null; role: string; createdAt: string }

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null | 'loading'>('loading')

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(setUser)
      .catch(() => setUser(null))
  }, [])

  const logout = async () => {
    await fetch('/api/auth/login', { method: 'DELETE' })
    router.push('/login')
  }

  if (user === 'loading') return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#0A080D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Loading…</p>
    </div>
  )

  if (!user) return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#0A080D', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 }}>
      <p style={{ color: '#ffffff', fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>
        feel<span style={{ color: '#A66A86' }}>more.</span>
      </p>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Sign in to view your profile</p>
      <Link href="/login" style={{
        backgroundColor: '#A66A86', color: '#fff', textDecoration: 'none',
        padding: '13px 40px', borderRadius: 12, fontWeight: 600, fontSize: 15,
      }}>
        Sign in
      </Link>
      <Link href="/signup" style={{ color: '#A66A86', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>
        Create an account
      </Link>
    </div>
  )

  const initials = (user.name ?? user.email).slice(0, 2).toUpperCase()
  const joined = new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  return (
    <div style={{ backgroundColor: '#0A080D', minHeight: '100dvh', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{
        paddingTop: 'max(52px, env(safe-area-inset-top, 52px))',
        paddingBottom: 20, paddingLeft: 20, paddingRight: 20,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 18 }}>Profile</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 62, height: 62, borderRadius: '50%',
            backgroundColor: 'rgba(166,106,134,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {user.avatar
              ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              : <span style={{ color: '#A66A86', fontSize: 22, fontWeight: 700 }}>{initials}</span>
            }
          </div>
          <div>
            <p style={{ color: '#ffffff', fontSize: 18, fontWeight: 700 }}>{user.name ?? 'Anonymous'}</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 3 }}>{user.email}</p>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, marginTop: 2 }}>Member since {joined}</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { icon: ShoppingBag, label: 'My Orders', sub: 'Track your purchases', href: '/orders' },
          { icon: Heart, label: 'Wishlist', sub: 'Saved products', href: '/wishlist' },
          { icon: BookOpen, label: 'My Stories', sub: "Stories you've shared", href: '/stories/mine' },
        ].map(({ icon: Icon, label, sub, href }) => (
          <Link key={href} href={href} style={{
            display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none',
            padding: '14px 16px', borderRadius: 14,
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: 'rgba(166,106,134,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={17} color="#A66A86" strokeWidth={1.5} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#ffffff', fontSize: 14, fontWeight: 600 }}>{label}</p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 2 }}>{sub}</p>
            </div>
            <ChevronRight size={16} color="rgba(255,255,255,0.2)" />
          </Link>
        ))}
      </div>

      {/* Logout */}
      <div style={{ padding: '8px 20px' }}>
        <button
          onClick={logout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '14px 0', borderRadius: 14, border: '1px solid rgba(239,68,68,0.15)',
            backgroundColor: 'rgba(239,68,68,0.06)', cursor: 'pointer',
          }}
        >
          <LogOut size={16} color="#ef4444" strokeWidth={1.5} />
          <span style={{ color: '#ef4444', fontSize: 14, fontWeight: 600 }}>Sign out</span>
        </button>
      </div>
    </div>
  )
}
