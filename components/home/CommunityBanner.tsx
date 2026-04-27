'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react'

type Banner = { id: string; title: string; subtitle: string | null; image: string | null; link: string | null }

const DEFAULT: Banner = {
  id: 'default',
  title: "You're not alone.",
  subtitle: 'Real people. Real stories.',
  image: null,
  link: '/stories',
}

export default function CommunityBanner() {
  const [banners, setBanners] = useState<Banner[]>([DEFAULT])

  useEffect(() => {
    fetch('/api/banners')
      .then(r => r.ok ? r.json() : [])
      .then((d: Banner[]) => { if (d.length > 0) setBanners(d) })
      .catch(() => {})
  }, [])

  const b = banners[0]

  return (
    <section className="flex-shrink-0" style={{ margin: '4px 20px 0' }}>
      <div className="relative rounded-2xl overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: b.image ? `url(${b.image})` : undefined,
            backgroundColor: b.image ? undefined : 'transparent',
            filter: 'brightness(0.18) saturate(0.3)',
          }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(100deg, rgba(10,4,8,0.98) 50%, rgba(18,8,14,0.8) 100%)' }} />

        <div className="relative flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(166,106,134,0.12)' }}>
              <Heart size={12} strokeWidth={1.5} color="#A66A86" />
            </div>
            <div>
              <p className="text-white/75 font-medium leading-tight" style={{ fontSize: 12 }}>{b.title}</p>
              {b.subtitle && <p className="font-normal mt-0.5" style={{ fontSize: 10, color: '#374151' }}>{b.subtitle}</p>}
            </div>
          </div>
          <Link
            href={b.link ?? '/stories'}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full"
            style={{ backgroundColor: 'rgba(166,106,134,0.12)', color: '#A66A86', fontSize: 11, fontWeight: 600 }}
          >
            Read ›
          </Link>
        </div>
      </div>
    </section>
  )
}
