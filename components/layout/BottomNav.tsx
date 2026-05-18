'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ShoppingBag, User } from 'lucide-react'

export default function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/shop', icon: ShoppingBag, label: 'Shop' },
    { href: '/profile', icon: User, label: 'Profile' },
  ]

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50">
      <nav className="flex border-t border-white/[0.05]" style={{ backgroundColor: '#0F0C09' }}>
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link key={href} href={href} className="flex-1 flex flex-col items-center justify-center gap-[4px] py-3.5" style={{ position: 'relative' }}>
              <span style={{ position: 'relative', display: 'inline-flex' }}>
                <Icon
                  size={20}
                  strokeWidth={active ? 0 : 1.5}
                  fill={active ? '#A66A86' : 'none'}
                  color={active ? '#A66A86' : undefined}
                  className={active ? '' : 'text-gray-700'}
                />
              </span>
              <span className="text-[9px] font-medium tracking-wide" style={{ color: active ? '#A66A86' : '#374151' }}>
                {label}
              </span>
            </Link>
          )
        })}
      </nav>
      <div className="flex justify-center pb-1.5 pt-0.5" style={{ backgroundColor: '#0F0C09' }}>
        <div className="w-20 h-[2.5px] rounded-full bg-white/10" />
      </div>
    </div>
  )
}
