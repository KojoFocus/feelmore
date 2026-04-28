'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Heart } from 'lucide-react'

type WishlistProduct = { id: string; name: string; slug: string; price: number; currency: string; category: string; image: string | null; isActive: boolean }
type WishlistItem = { id: string; product: WishlistProduct }

const slugImg: Record<string, string> = {
  'luna-mini':                   'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&h=600&fit=crop',
  'vibe-ring':                   'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&h=600&fit=crop',
  'rose-bullet':                 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=600&fit=crop',
  'g-spot-pro':                  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=600&fit=crop',
  'sienna-torso-doll':           'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=600&h=600&fit=crop',
  'noa-full-figure-doll':        'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=600&fit=crop',
  'silk-glide-water-based':      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop',
  'velvet-silicone-lube':        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=600&fit=crop',
  'ignite-warming-lube':         'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&h=600&fit=crop',
  'double-trouble-couples-vibe': 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=600&fit=crop',
  'magic-wand-massager':         'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=600&fit=crop',
  'naughty-dice':                'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&h=600&fit=crop',
  'cheeky-card-game':            'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=600&fit=crop',
  'pure-clean-toy-spray':        'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=600&fit=crop',
  'velvet-storage-pouch':        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop',
}

function getImage(slug: string, dbImage: string | null) {
  return dbImage ?? slugImg[slug] ?? null
}

export default function WishlistPage() {
  const router = useRouter()
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/wishlist')
      .then(r => r.ok ? r.json() : [])
      .then(d => { setItems(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const remove = async (productId: string) => {
    await fetch('/api/wishlist', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    })
    setItems(prev => prev.filter(i => i.product.id !== productId))
  }

  return (
    <div style={{ backgroundColor: '#0A080D', minHeight: '100dvh', paddingBottom: 100 }}>
      <div style={{ paddingTop: 'max(52px, env(safe-area-inset-top, 52px))', padding: 'max(52px, env(safe-area-inset-top, 52px)) 20px 0', marginBottom: 20 }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, padding: 0, fontSize: 13 }}>
          <ArrowLeft size={15} /> Back
        </button>
        <h1 style={{ color: '#ffffff', fontSize: 22, fontWeight: 700 }}>Wishlist</h1>
        {!loading && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, marginTop: 4 }}>{items.length} saved</p>}
      </div>

      <div style={{ padding: '0 20px' }}>
        {loading && <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', paddingTop: 60, fontSize: 13 }}>Loading…</p>}

        {!loading && items.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: 80 }}>
            <Heart size={40} color="rgba(255,255,255,0.07)" />
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginTop: 14 }}>Nothing saved yet</p>
            <button onClick={() => router.push('/shop')} style={{
              marginTop: 20, backgroundColor: '#A66A86', color: '#fff', border: 'none',
              padding: '12px 28px', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>Browse shop</button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {items.map(({ id, product: p }) => {
            const img = getImage(p.slug, p.image)
            return (
            <div key={id} style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden', position: 'relative' }}>
              <button
                onClick={() => remove(p.id)}
                style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', border: 'none', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 1 }}
              >
                <Heart size={13} color="#A66A86" fill="#A66A86" />
              </button>
              <Link href={`/shop/${p.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ height: 140, backgroundColor: '#1a1520', overflow: 'hidden' }}>
                  {img && <img src={img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />}
                </div>
                <div style={{ padding: '10px 12px 12px' }}>
                  <p style={{ color: '#ffffff', fontSize: 12, fontWeight: 600, lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' } as React.CSSProperties}>{p.name}</p>
                  <p style={{ color: '#A66A86', fontSize: 13, fontWeight: 700, marginTop: 6 }}>{p.currency} {p.price.toLocaleString()}</p>
                </div>
              </Link>
            </div>
          )})}
        </div>
      </div>
    </div>
  )
}
