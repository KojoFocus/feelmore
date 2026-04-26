import Link from 'next/link'
import { Heart } from 'lucide-react'

const BG = 'https://images.unsplash.com/photo-1603905491269-7ff6d5d4c6e6?w=600&h=200&fit=crop&q=80'

export default function CommunityBanner() {
  return (
    <section className="flex-shrink-0" style={{ margin: '12px 20px 0' }}>
      <div className="relative rounded-2xl overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${BG})`, filter: 'brightness(0.18) saturate(0.3)' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(100deg, rgba(10,4,8,0.98) 50%, rgba(18,8,14,0.8) 100%)' }} />

        <div className="relative flex items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(201,146,58,0.12)' }}>
              <Heart size={12} fill="#C9923A" color="#C9923A" />
            </div>
            <div>
              <p className="text-white/75 font-medium leading-tight" style={{ fontSize: 12 }}>You&apos;re not alone.</p>
              <p className="font-normal mt-0.5" style={{ fontSize: 10, color: '#374151' }}>Real people. Real stories.</p>
            </div>
          </div>
          <Link
            href="/stories"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full"
            style={{ backgroundColor: 'rgba(201,146,58,0.12)', color: '#C9923A', fontSize: 11, fontWeight: 600 }}
          >
            Read ›
          </Link>
        </div>
      </div>
    </section>
  )
}
