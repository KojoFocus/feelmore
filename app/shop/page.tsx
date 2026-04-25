export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Header from '@/components/layout/Header'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

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
  'luna-mini':                   'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400&h=400&fit=crop',
  'vibe-ring':                   'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=400&fit=crop',
  'rose-bullet':                 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop',
  'g-spot-pro':                  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop',
  'sienna-torso-doll':           'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400&h=400&fit=crop',
  'noa-full-figure-doll':        'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=400&fit=crop',
  'silk-glide-water-based':      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop',
  'velvet-silicone-lube':        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop',
  'ignite-warming-lube':         'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=400&fit=crop',
  'double-trouble-couples-vibe': 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop',
  'magic-wand-massager':         'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=400&fit=crop',
  'naughty-dice':                'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=400&fit=crop',
  'cheeky-card-game':            'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=400&fit=crop',
  'pure-clean-toy-spray':        'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=400&h=400&fit=crop',
  'velvet-storage-pouch':        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
}

export default async function ShopPage() {
  let products: Awaited<ReturnType<typeof fetchProducts>> = []
  let categories: Awaited<ReturnType<typeof fetchCategories>> = []

  try {
    ;[products, categories] = await Promise.all([fetchProducts(), fetchCategories()])
  } catch (e) {
    console.error('DB error:', e)
  }

  return (
    <div className="pb-28">
      <Header />

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-5 pt-1 pb-5">
        <button
          className="flex-shrink-0 text-[10px] font-semibold text-white px-3.5 py-1.5 rounded-full"
          style={{ backgroundColor: '#BF567D' }}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className="flex-shrink-0 text-[10px] font-medium text-gray-500 px-3.5 py-1.5 rounded-full whitespace-nowrap"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 gap-3 px-5 mt-1">
        {products.map((product) => {
          const badge = product.badge ?? (product.isBestseller ? 'Bestseller' : null)
          const price = Number(product.price)
          const bg = slugBg[product.slug] ?? '#1a0f14'
          const img = slugImg[product.slug] ?? product.images[0]?.url

          return (
            <Link
              key={product.id}
              href={`/shop/${product.slug}`}
              className="rounded-[18px] overflow-hidden block"
              style={{ backgroundColor: bg }}
            >
              <div className="relative w-full h-[170px]" style={{ backgroundColor: bg }}>
                {img && (
                  <img
                    src={img}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    style={{ opacity: 0.7, mixBlendMode: 'luminosity' }}
                  />
                )}
                {/* Fade into card background */}
                <div className="absolute inset-x-0 bottom-0 h-16" style={{ background: `linear-gradient(to top, ${bg}, transparent)` }} />
                {badge && (
                  <span
                    className="absolute top-3 left-3 text-[8px] font-bold text-white px-2 py-[3px] rounded-full tracking-wider uppercase"
                    style={{ backgroundColor: '#BF567D' }}
                  >
                    {badge}
                  </span>
                )}
              </div>
              <div className="px-3.5 pb-4 pt-2">
                <p className="text-[9px] text-gray-700 mb-1 uppercase tracking-wider">{product.category.name}</p>
                <p className="text-white/85 text-[12px] font-semibold truncate leading-snug">{product.name}</p>
                {product.tagline && (
                  <p className="text-[10px] truncate mt-0.5" style={{ color: 'rgba(191,147,143,0.5)' }}>{product.tagline}</p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[12px] font-bold" style={{ color: '#BF567D' }}>
                    GHS {price.toLocaleString()}
                  </span>
                  <span className="rounded-[8px] p-1.5" style={{ backgroundColor: 'rgba(191,86,125,0.12)' }}>
                    <ShoppingCart size={12} color="#BF567D" />
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function fetchProducts() {
  return prisma.product.findMany({
    where: { isActive: true },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      category: { select: { name: true, slug: true } },
    },
    orderBy: [{ isBestseller: 'desc' }, { createdAt: 'desc' }],
  })
}

function fetchCategories() {
  return prisma.category.findMany({ orderBy: { name: 'asc' } })
}
