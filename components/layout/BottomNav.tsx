'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Home, ShoppingBag, BookOpen, User, ShoppingCart } from 'lucide-react'
import { getCart } from '@/lib/cart'

export default function BottomNav() {
  const pathname = usePathname()
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const update = () => setCartCount(getCart().reduce((s, i) => s + i.qty, 0))
    update()
    window.addEventListener('fm_cart_update', update)
    return () => window.removeEventListener('fm_cart_update', update)
  }, [])

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/shop', icon: ShoppingBag, label: 'Shop' },
    { href: '/cart', icon: ShoppingCart, label: 'Cart', badge: cartCount > 0 ? cartCount : null },
    { href: '/stories', icon: BookOpen, label: 'Stories' },
    { href: '/profile', icon: User, label: 'Profile' },
  ]

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50">
      <nav className="flex border-t border-white/[0.05]" style={{ backgroundColor: '#0F0C09' }}>
        {navItems.map(({ href, icon: Icon, label, badge }) => {
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
                {badge && (
                  <span style={{
                    position: 'absolute', top: -5, right: -7,
                    backgroundColor: '#A66A86', borderRadius: '50%',
                    width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 8, fontWeight: 700, color: '#fff',
                  }}>
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
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
