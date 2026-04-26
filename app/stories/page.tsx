export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Heart, BookOpen, ChevronRight } from 'lucide-react'

const categoryLabels: Record<string, string> = {
  REAL_TALK:   'Real Talk',
  WOMEN_SAY:   'Women Say',
  FOR_COUPLES: 'For Couples',
  TIPS:        'Tips',
}

// Pool of cover images — each story gets its own unique cover by index
const coverPool: Record<string, string[]> = {
  REAL_TALK: [
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=600&fit=crop&q=80',
  ],
  WOMEN_SAY: [
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=400&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&q=80',
  ],
  FOR_COUPLES: [
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1464863979621-258859e62245?w=400&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&h=600&fit=crop&q=80',
  ],
  TIPS: [
    'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=400&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&h=600&fit=crop&q=80',
  ],
}

function getCover(category: string, index: number): string {
  const pool = coverPool[category] ?? coverPool.REAL_TALK
  return pool[index % pool.length]
}

const categories = ['REAL_TALK', 'WOMEN_SAY', 'FOR_COUPLES', 'TIPS'] as const

export default async function StoriesPage() {
  const stories = await prisma.story.findMany({
    where: { isPublic: true },
    include: {
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Featured: prefer a narrative story (not TIPS)
  const featured = stories.find(s => s.category !== 'TIPS') ?? stories[0] ?? null
  const rest = stories.filter(s => s.id !== featured?.id)

  const byCategory = Object.fromEntries(
    categories.map(cat => [cat, stories.filter(s => s.category === cat)])
  )

  return (
    <div style={{ backgroundColor: '#0D0A08', minHeight: '100dvh', paddingBottom: 110 }}>

      {/* ── Header ── */}
      <div className="px-5 pt-5 pb-4">
        <h1 style={{ color: '#ffffff', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>
          feel<span style={{ color: '#A66A86' }}>more.</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 2 }}>Stories · Series · Real experiences</p>
      </div>

      {/* ── Series banner ── */}
      <Link href="/series" className="block mx-5 mb-6">
        <div
          className="relative overflow-hidden rounded-[20px]"
          style={{ height: 130 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=300&fit=crop&q=80)`,
              filter: 'brightness(0.2) saturate(0.3)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(166,106,134,0.15) 0%, rgba(13,10,8,0.6) 100%)' }}
          />
          <div className="absolute inset-0 flex items-center justify-between px-5">
            <div>
              <p style={{ color: '#A66A86', fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
                ✦ Erotica Series
              </p>
              <p style={{ color: '#ffffff', fontSize: 18, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                Longer stories.{'\n'}Deeper worlds.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 5 }}>Multi-episode immersive reads</p>
            </div>
            <div
              className="flex items-center gap-1.5 px-4 py-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: '#A66A86' }}
            >
              <span style={{ color: '#0D0A08', fontSize: 11, fontWeight: 700 }}>Read</span>
              <BookOpen size={11} color="#0D0A08" />
            </div>
          </div>
        </div>
      </Link>

      {/* ── Featured story ── */}
      {featured && (
        <Link href={`/stories/${featured.id}`} className="block mx-5 mb-7">
          <div
            className="relative overflow-hidden rounded-[20px]"
            style={{ height: 260 }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${getCover(featured.category, 0)})`,
                filter: 'brightness(0.45) saturate(0.5)',
              }}
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(180deg, rgba(13,10,8,0.1) 0%, rgba(13,10,8,0.98) 100%)' }}
            />

            <div
              className="absolute top-3 left-3 px-2.5 py-1 rounded-full"
              style={{ backgroundColor: 'rgba(166,106,134,0.2)' }}
            >
              <span style={{ color: '#A66A86', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                ✦ Featured
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5">
              <span style={{ color: '#A66A86', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {categoryLabels[featured.category]}
              </span>
              {featured.title && (
                <h2 style={{ color: '#ffffff', fontSize: 20, fontWeight: 700, lineHeight: 1.2, marginTop: 5, marginBottom: 8 }}>
                  {featured.title}
                </h2>
              )}
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, lineHeight: 1.6, marginBottom: 12 }}>
                {featured.body.slice(0, 100)}…
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Heart size={11} strokeWidth={1.5} color="rgba(255,255,255,0.3)" />
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{featured._count.likes}</span>
                  </div>
                </div>
                <div
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: '#A66A86' }}
                >
                  <span style={{ color: '#0D0A08', fontSize: 11, fontWeight: 700 }}>Read now</span>
                  <ChevronRight size={11} color="#0D0A08" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* ── Category sections ── */}
      {categories.map(cat => {
        const catStories = byCategory[cat]
        if (catStories.length === 0) return null
        return (
          <section key={cat} className="mb-7">
            <div className="flex items-center justify-between px-5 mb-3">
              <h2 style={{ color: '#ffffff', fontSize: 15, fontWeight: 600 }}>
                {categoryLabels[cat]}
              </h2>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{catStories.length} stories</span>
            </div>

            {/* Horizontal scroll of book-cover cards */}
            <div
              className="flex gap-3 px-5 overflow-x-auto scrollbar-hide"
              style={{ paddingBottom: 4 }}
            >
              {catStories.map((story, idx) => (
                <Link
                  key={story.id}
                  href={`/stories/${story.id}`}
                  className="flex-shrink-0"
                  style={{ width: 130 }}
                >
                  {/* Book cover */}
                  <div
                    className="relative overflow-hidden rounded-[14px] mb-2"
                    style={{ height: 185 }}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${getCover(story.category, idx)})`,
                        filter: 'brightness(0.5) saturate(0.5)',
                      }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(13,10,8,0.95) 100%)' }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      {story.title && (
                        <p style={{ color: '#ffffff', fontSize: 11, fontWeight: 600, lineHeight: 1.3 }}>
                          {story.title.length > 35 ? story.title.slice(0, 35) + '…' : story.title}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Below cover */}
                  {!story.title && (
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 500, lineHeight: 1.3, marginBottom: 3 }}>
                      {story.body.slice(0, 40)}…
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <Heart size={10} strokeWidth={1.5} color="rgba(255,255,255,0.25)" />
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>{story._count.likes}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )
      })}

    </div>
  )
}
