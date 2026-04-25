'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

type Product = {
  id: string
  name: string
  slug: string
  price: number
  currency: string
  tagline: string | null
  badge: string | null
  isBestseller: boolean
  images: { url: string; alt: string | null }[]
}

const slugBg: Record<string, string> = {
  'luna-mini':                   '#3d2030',
  'vibe-ring':                   '#0d0c10',
  'rose-bullet':                 '#4a2828',
  'g-spot-pro':                  '#2a2a1e',
  'sienna-torso-doll':           '#1e1510',
  'noa-full-figure-doll':        '#140e0c',
  'silk-glide-water-based':      '#101828',
  'velvet-silicone-lube':        '#140f1e',
  'ignite-warming-lube':         '#1e1208',
  'double-trouble-couples-vibe': '#160a20',
  'magic-wand-massager':         '#08161e',
  'naughty-dice':                '#16110a',
  'cheeky-card-game':            '#14140c',
  'pure-clean-toy-spray':        '#0a1018',
  'velvet-storage-pouch':        '#120e10',
}

const slugImg: Record<string, string> = {
  'luna-mini':                   'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=300&h=300&fit=crop',
  'vibe-ring':                   'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=300&h=300&fit=crop',
  'rose-bullet':                 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=300&fit=crop',
  'g-spot-pro':                  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=300&fit=crop',
  'sienna-torso-doll':           'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=300&h=300&fit=crop',
  'noa-full-figure-doll':        'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&h=300&fit=crop',
  'silk-glide-water-based':      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300&h=300&fit=crop',
  'velvet-silicone-lube':        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&h=300&fit=crop',
  'ignite-warming-lube':         'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop',
  'double-trouble-couples-vibe': 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=300&fit=crop',
  'magic-wand-massager':         'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&h=300&fit=crop',
  'naughty-dice':                'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=300&h=300&fit=crop',
  'cheeky-card-game':            'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&h=300&fit=crop',
  'pure-clean-toy-spray':        'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=300&h=300&fit=crop',
  'velvet-storage-pouch':        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=300&fit=crop',
}

function ProductCard({ product }: { product: Product }) {
  const badge = product.badge ?? (product.isBestseller ? 'Bestseller' : null)
  const bgColor = slugBg[product.slug] ?? '#1a0f14'
  const imgUrl = slugImg[product.slug] ?? product.images[0]?.url

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="flex-shrink-0 rounded-[16px] overflow-hidden block"
      style={{ backgroundColor: bgColor, width: 118 }}
    >
      <div className="relative w-full overflow-hidden" style={{ height: 96, backgroundColor: bgColor }}>
        {imgUrl && (
          <img
            src={imgUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            style={{ opacity: 0.72, mixBlendMode: 'luminosity' }}
          />
        )}
        <div className="absolute inset-x-0 bottom-0 h-8" style={{ background: `linear-gradient(to top, ${bgColor}, transparent)` }} />
        {badge && (
          <span
            className="absolute top-2 left-2 text-[7px] font-bold text-white px-1.5 py-[2px] rounded-full tracking-wider uppercase"
            style={{ backgroundColor: '#BF567D' }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Compact info */}
      <div style={{ padding: '8px 12px 12px' }}>
        <p className="text-white/85 font-semibold truncate leading-snug" style={{ fontSize: 11 }}>
          {product.name}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold" style={{ fontSize: 11, color: '#BF567D' }}>
            {product.currency} {Number(product.price).toLocaleString()}
          </span>
          <button
            onClick={(e) => e.preventDefault()}
            className="rounded-[6px]"
            style={{ padding: 5, backgroundColor: 'rgba(191,86,125,0.12)' }}
          >
            <ShoppingCart size={10} color="#BF567D" />
          </button>
        </div>
      </div>
    </Link>
  )
}

export default function ProductRow({ products }: { products: Product[] }) {
  return (
    <section className="flex-shrink-0" style={{ marginTop: 14 }}>
      <div className="flex items-center justify-between px-5 mb-3">
        <p className="text-[10px] font-semibold text-gray-700 uppercase tracking-[0.12em]">Explore quietly</p>
        <Link href="/shop" className="text-[11px] font-medium" style={{ color: '#BF567D' }}>
          See all ›
        </Link>
      </div>
      <div className="flex gap-2.5 overflow-x-auto scrollbar-hide px-5 pb-1">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
