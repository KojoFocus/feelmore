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
  'luna-mini':                   '#251608',
  'vibe-ring':                   '#0E0C09',
  'rose-bullet':                 '#221408',
  'g-spot-pro':                  '#1A1A0E',
  'sienna-torso-doll':           '#1E1510',
  'noa-full-figure-doll':        '#160E0A',
  'silk-glide-water-based':      '#0E1620',
  'velvet-silicone-lube':        '#14100A',
  'ignite-warming-lube':         '#1E1208',
  'double-trouble-couples-vibe': '#1A1008',
  'magic-wand-massager':         '#0A1418',
  'naughty-dice':                '#16110A',
  'cheeky-card-game':            '#14120A',
  'pure-clean-toy-spray':        '#0A1018',
  'velvet-storage-pouch':        '#120E0A',
}

const slugImg: Record<string, string> = {
  'luna-mini':                   'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=300&h=300&fit=crop',
  'vibe-ring':                   'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=300&h=300&fit=crop',
  'rose-bullet':                 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=300&h=300&fit=crop',
  'g-spot-pro':                  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300&h=300&fit=crop',
  'sienna-torso-doll':           'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&h=300&fit=crop',
  'noa-full-figure-doll':        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=300&fit=crop',
  'silk-glide-water-based':      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300&h=300&fit=crop',
  'velvet-silicone-lube':        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&h=300&fit=crop',
  'ignite-warming-lube':         'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop',
  'double-trouble-couples-vibe': 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=300&h=300&fit=crop',
  'magic-wand-massager':         'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&h=300&fit=crop',
  'naughty-dice':                'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=300&h=300&fit=crop',
  'cheeky-card-game':            'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=300&h=300&fit=crop',
  'pure-clean-toy-spray':        'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=300&h=300&fit=crop',
  'velvet-storage-pouch':        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=300&fit=crop',
}

function ProductCard({ product }: { product: Product }) {
  const badge = product.badge ?? (product.isBestseller ? 'Bestseller' : null)
  const imgUrl = slugImg[product.slug] ?? product.images[0]?.url

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="flex-shrink-0 rounded-[16px] overflow-hidden block"
      style={{ backgroundColor: '#F0EDE9', width: 105 }}
    >
      <div className="relative w-full overflow-hidden" style={{ height: 100, backgroundColor: '#F0EDE9' }}>
        {imgUrl && (
          <img src={imgUrl} alt={product.name} className="w-full h-full object-cover" />
        )}
        {badge && (
          <span
            className="absolute top-1.5 left-1.5 text-[7px] font-bold text-white px-1.5 py-[3px] rounded-full tracking-wider uppercase"
            style={{ backgroundColor: '#A66A86' }}
          >
            {badge}
          </span>
        )}
      </div>

      <div style={{ padding: '7px 9px 9px' }}>
        <p className="font-semibold truncate leading-snug" style={{ fontSize: 11, color: '#1A1A1A' }}>
          {product.name}
        </p>
        {product.tagline && (
          <p className="truncate mt-0.5" style={{ fontSize: 9, color: '#9CA3AF' }}>
            {product.tagline}
          </p>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold" style={{ fontSize: 10, color: '#A66A86' }}>
            {product.currency} {Number(product.price).toLocaleString()}
          </span>
          <button
            onClick={(e) => e.preventDefault()}
            className="rounded-[6px]"
            style={{ padding: 5, backgroundColor: 'rgba(166,106,134,0.15)' }}
          >
            <ShoppingCart size={10} color="#A66A86" />
          </button>
        </div>
      </div>
    </Link>
  )
}

export default function ProductRow({ products }: { products: Product[] }) {
  return (
    <section className="flex-shrink-0" style={{ marginTop: 16, marginBottom: 8 }}>
      <div className="flex items-center justify-between px-5 mb-2">
        <p style={{ color: '#ffffff', fontSize: 13, fontWeight: 600 }}>Explore quietly</p>
        <Link href="/shop" style={{ color: '#A66A86', fontSize: 12, fontWeight: 500 }}>
          See all ›
        </Link>
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-5 pb-1">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
