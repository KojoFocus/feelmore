'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import AdminSidebar from './Sidebar'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  if (pathname === '/admin/login') {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 50, backgroundColor: '#0A080D' }}>
        {children}
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', backgroundColor: '#0A080D', overflow: 'hidden',
    }}>
      <AdminSidebar />
      <main style={{ flex: 1, minWidth: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
    </div>
  )
}
