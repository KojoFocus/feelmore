export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AddToCartButton from './AddToCartButton'
import Link from 'next/link'
import { ChevronLeft, Star, Package } from 'lucide-react'

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

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  let product: Awaited<ReturnType<typeof fetchProduct>> | null = null
  try { product = await fetchProduct(params.slug) } catch (e) { console.error(e) }
  if (!product) return notFound()

  const price = Number(product.price)
  const comparePrice = product.comparePrice ? Number(product.comparePrice) : null
  const imgUrl = slugImg[product.slug] ?? product.images[0]?.url
  const badge = product.badge ?? (product.isBestseller ? 'Bestseller' : null)
  const avgRating = product.reviews.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : null

  return (
    <div style={{ backgroundColor: '#08090D', minHeight: '100dvh', paddingBottom: 120 }}>
      {/* Sticky nav */}
      <div
        className="sticky top-0 z-30 flex items-center gap-3 px-5 py-3.5"
        style={{ backgroundColor: 'rgba(8,9,13,0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        <Link href="/shop" className="flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <ChevronLeft size={18} strokeWidth={1.5} />
          <span className="text-[12px]">Shop</span>
        </Link>
        <div className="flex-1" />
        {badge && (
          <span
            className="text-[8px] font-bold px-2 py-[3px] rounded-full uppercase tracking-wider"
            style={{ backgroundColor: 'rgba(166,106,134,0.15)', color: '#A66A86' }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Hero image */}
      <div className="relative" style={{ height: 320, backgroundColor: '#0e0910' }}>
        {imgUrl && (
          <img src={imgUrl} alt={product.name} className="w-full h-full object-cover" style={{ opacity: 0.55, mixBlendMode: 'luminosity' }} />
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(8,9,13,0.1) 0%, rgba(8,9,13,1) 100%)' }} />
      </div>

      {/* Info */}
      <div className="px-5" style={{ marginTop: -24 }}>
        <p className="text-[9px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(166,106,134,0.5)' }}>
          {product.category.name}
        </p>
        <h1 className="text-white text-[22px] font-bold leading-tight tracking-tight mb-1">{product.name}</h1>
        {product.tagline && (
          <p className="text-[13px] mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>{product.tagline}</p>
        )}

        {/* Price row */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[22px] font-bold" style={{ color: '#A66A86' }}>
            {product.currency} {price.toLocaleString()}
          </span>
          {comparePrice && comparePrice > price && (
            <span className="text-[14px] line-through" style={{ color: 'rgba(255,255,255,0.2)' }}>
              {product.currency} {comparePrice.toLocaleString()}
            </span>
          )}
          {avgRating && (
            <div className="flex items-center gap-1 ml-auto">
              <Star size={11} fill="#A66A86" color="#A66A86" />
              <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {avgRating.toFixed(1)} ({product.reviews.length})
              </span>
            </div>
          )}
        </div>

        {/* Add to cart */}
        <AddToCartButton
          productId={product.id}
          name={product.name}
          price={price}
          currency={product.currency}
          image={imgUrl ?? null}
        />

        {/* Stock */}
        {product.stock > 0 && (
          <div className="flex items-center gap-2 mb-6">
            <Package size={12} color="rgba(255,255,255,0.2)" />
            <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.2)' }}>{product.stock} in stock</span>
          </div>
        )}

        <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginBottom: 24 }} />

        <p className="text-[13px] leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>{product.description}</p>

        {/* Variants */}
        {product.variants.length > 0 && (
          <div className="mb-8">
            <p className="text-[10px] font-medium uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.2)' }}>Options</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <span key={v.id} className="text-[11px] px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {v.name}: {v.value}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        {product.reviews.length > 0 && (
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.2)' }}>Reviews</p>
            <div className="flex flex-col gap-3">
              {product.reviews.slice(0, 5).map((review) => (
                <div key={review.id} className="p-4 rounded-2xl"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={9} fill={i < review.rating ? '#A66A86' : 'transparent'} color={i < review.rating ? '#A66A86' : 'rgba(255,255,255,0.15)'} />
                      ))}
                    </div>
                    <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>{review.user.name ?? 'Anonymous'}</span>
                  </div>
                  {review.title && <p className="text-[12px] font-medium text-white/70 mb-1">{review.title}</p>}
                  <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>{review.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function fetchProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: { select: { name: true } },
      images: { orderBy: { order: 'asc' } },
      variants: true,
      reviews: { orderBy: { createdAt: 'desc' }, take: 5, include: { user: { select: { name: true } } } },
    },
  })
}
