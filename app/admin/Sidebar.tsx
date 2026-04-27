'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard, Package, ShoppingCart, BookOpen,
  BookMarked, Users, Megaphone, MessageSquare, LogOut, ChevronRight, Tag,
} from 'lucide-react'

const NAV = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/messages', icon: MessageSquare, label: 'Messages' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/categories', icon: Tag, label: 'Categories' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/admin/stories', icon: BookOpen, label: 'Stories' },
  { href: '/admin/series', icon: BookMarked, label: 'Series' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/banners', icon: Megaphone, label: 'Banners' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('admin_sidebar_collapsed') === 'true') setCollapsed(true)
  }, [])

  const toggle = () => setCollapsed(v => {
    localStorage.setItem('admin_sidebar_collapsed', String(!v))
    return !v
  })

  const logout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' })
    router.push('/admin/login')
  }

  const W = collapsed ? 52 : 200

  return (
    <aside style={{
      width: W, flexShrink: 0,
      backgroundColor: '#0D0B12',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column',
      height: '100%', overflowY: 'auto', overflowX: 'hidden',
      transition: 'width 0.2s ease',
    }}>

      {/* Top: logo + toggle */}
      <div style={{
        height: 52, flexShrink: 0,
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        padding: collapsed ? '0 10px' : '0 14px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        {!collapsed && (
          <span style={{ color: '#fff', fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
            feel<span style={{ color: '#A66A86' }}>more.</span>
          </span>
        )}
        <button onClick={toggle} style={{
          width: 26, height: 26, borderRadius: 7, border: 'none', cursor: 'pointer', flexShrink: 0,
          backgroundColor: 'rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <ChevronRight size={13} color="rgba(255,255,255,0.45)"
            style={{ transform: collapsed ? 'none' : 'rotate(180deg)', transition: 'transform 0.2s' }} />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 6px' }}>
        {NAV.map(({ href, icon: Icon, label }) => {
          const exact = href === '/admin'
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link key={href} href={href} title={collapsed ? label : undefined} style={{
              display: 'flex', alignItems: 'center',
              gap: collapsed ? 0 : 9,
              justifyContent: collapsed ? 'center' : 'flex-start',
              padding: collapsed ? '9px 0' : '8px 10px',
              borderRadius: 8, marginBottom: 1,
              backgroundColor: active ? 'rgba(166,106,134,0.14)' : 'transparent',
              textDecoration: 'none',
            }}>
              <Icon size={16}
                color={active ? '#A66A86' : 'rgba(255,255,255,0.32)'}
                strokeWidth={active ? 2.2 : 1.5}
                style={{ flexShrink: 0 }} />
              {!collapsed && (
                <span style={{
                  fontSize: 13, whiteSpace: 'nowrap',
                  fontWeight: active ? 600 : 400,
                  color: active ? '#ffffff' : 'rgba(255,255,255,0.4)',
                }}>
                  {label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '6px 6px 10px', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        <button onClick={logout} title={collapsed ? 'Logout' : undefined} style={{
          width: '100%', display: 'flex', alignItems: 'center',
          gap: collapsed ? 0 : 9,
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '9px 0' : '8px 10px',
          borderRadius: 8, border: 'none', cursor: 'pointer',
          backgroundColor: 'transparent',
        }}>
          <LogOut size={15} color="rgba(255,255,255,0.22)" strokeWidth={1.5} style={{ flexShrink: 0 }} />
          {!collapsed && <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.22)', whiteSpace: 'nowrap' }}>Logout</span>}
        </button>
      </div>
    </aside>
  )
}
