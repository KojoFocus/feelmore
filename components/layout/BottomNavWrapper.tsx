'use client'

import { usePathname } from 'next/navigation'
import BottomNav from './BottomNav'

const FULLSCREEN = ['/messages', '/admin', '/login', '/signup']

export default function BottomNavWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isFullscreen = FULLSCREEN.some(p => pathname.startsWith(p))

  return (
    <>
      <main className={isFullscreen ? '' : 'pb-20'}>{children}</main>
      {!isFullscreen && <BottomNav />}
    </>
  )
}
