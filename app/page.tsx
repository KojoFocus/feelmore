export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Header from '@/components/layout/Header'
import StoriesRow from '@/components/home/StoriesRow'
import StoryCard from '@/components/home/StoryCard'
import ProductRow from '@/components/home/ProductRow'
import CommunityBanner from '@/components/home/CommunityBanner'

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

  const featuredStory = serializedStories[0] ?? null

  return (
    <div
      style={{
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        paddingBottom: 78,
      }}
    >
      <Header />
      <StoriesRow stories={serializedStories} />

      {/* Story card grows to fill remaining space */}
      <div style={{ flex: 1, minHeight: 0, padding: '8px 16px 0' }}>
        {featuredStory
          ? <StoryCard story={featuredStory} />
          : <div style={{ height: '100%', borderRadius: 18, backgroundColor: '#0E0B08' }} />
        }
      </div>

      <ProductRow
        products={featuredProducts.map(p => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: Number(p.price),
          currency: p.currency,
          tagline: p.tagline,
          badge: p.badge,
          isBestseller: p.isBestseller,
          images: p.images,
        }))}
      />
      <CommunityBanner />
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
