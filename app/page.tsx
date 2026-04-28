export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Header from '@/components/layout/Header'
import StoriesRow from '@/components/home/StoriesRow'
import StoryCard from '@/components/home/StoryCard'
import ProductRow from '@/components/home/ProductRow'

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
        paddingBottom: 'calc(62px + 8dvh)',
        backgroundColor: '#0A080D',
      }}
    >
      <Header />
      <StoriesRow stories={serializedStories} />

      {/* Swipeable story cards — snap one at a time, peek next */}
      <div style={{ flex: 1, minHeight: 0, paddingTop: 10, paddingLeft: 16, paddingRight: 16, overflow: 'hidden' }}>
        <StoryCard stories={serializedStories} />
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
