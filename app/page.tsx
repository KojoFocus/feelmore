export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Header from '@/components/layout/Header'
import StoriesRow from '@/components/home/StoriesRow'
import StoryCard from '@/components/home/StoryCard'
import ProductRow from '@/components/home/ProductRow'
import Link from 'next/link'
import { Heart } from 'lucide-react'

export default async function Home() {
  let stories: Awaited<ReturnType<typeof fetchStories>> = []
  let featuredProducts: Awaited<ReturnType<typeof fetchProducts>> = []

  try {
    ;[stories, featuredProducts] = await Promise.all([fetchStories(), fetchProducts()])
  } catch (e) {
    console.error('DB error:', e)
  }

  const serializedStories = stories.map(s => ({
    ...s,
    createdAt: s.createdAt.toISOString(),
  }))

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        paddingBottom: 'calc(62px + env(safe-area-inset-bottom, 8px))',
        backgroundColor: '#0A080D',
      }}
    >
      <Header />
      <StoriesRow stories={serializedStories} />

      {/* Swipeable story cards — snap one at a time, peek next */}
      <div style={{ flex: 1, minHeight: 0, paddingTop: 6, paddingLeft: 16, paddingRight: 16, overflow: 'hidden' }}>
        <StoryCard stories={serializedStories} />
      </div>

      <ProductRow products={featuredProducts.map(p => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: Number(p.price),
          currency: p.currency,
          tagline: p.tagline,
          badge: p.badge,
          isBestseller: p.isBestseller,
          images: p.images,
        }))} />

      {/* "You're not alone" strip */}
      <Link href="/stories" style={{ textDecoration: 'none', flexShrink: 0 }}>
        <div style={{ margin: '4px 16px 0', padding: '8px 14px', borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Heart size={16} color="#A66A86" strokeWidth={1.5} />
            <div>
              <p style={{ color: '#ffffff', fontSize: 13, fontWeight: 600 }}>You&apos;re not alone.</p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 1 }}>Real people. Real stories.</p>
            </div>
          </div>
          <span style={{ color: '#A66A86', fontSize: 12, fontWeight: 600 }}>Read more ›</span>
        </div>
      </Link>
    </div>
  )
}

function fetchStories() {
  return prisma.story.findMany({
    where: { isPublic: true },
    include: {
      user: { select: { name: true } },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })
}

function fetchProducts() {
  return prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    include: { images: { where: { isPrimary: true }, take: 1 } },
    orderBy: { isBestseller: 'desc' },
  })
}
