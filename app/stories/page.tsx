export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Heart, ChevronRight } from 'lucide-react'

const categoryLabels: Record<string, string> = {
  REAL_TALK:   'Real Talk',
  WOMEN_SAY:   'Women Say',
  FOR_COUPLES: 'For Couples',
  TIPS:        'Tips',
}

const categoryAccent: Record<string, string> = {
  REAL_TALK:   '#C2697A',
  WOMEN_SAY:   '#A66A86',
  FOR_COUPLES: '#9B72A8',
  TIPS:        '#7A8AB3',
}

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
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&q=80',
  ],
  FOR_COUPLES: [
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&h=600&fit=crop&q=80',
  ],
  TIPS: [
    'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=600&fit=crop&q=80',
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
    include: { _count: { select: { likes: true, comments: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const featured = stories.find(s => s.category !== 'TIPS') ?? stories[0] ?? null
  const byCategory = Object.fromEntries(
    categories.map(cat => [cat, stories.filter(s => s.category === cat)])
  )
  const featuredAccent = categoryAccent[featured?.category ?? 'REAL_TALK']

  return (
    <div style={{ backgroundColor: '#07050A', minHeight: '100dvh', paddingBottom: 110 }}>

      {/* ── Header ─────────────────────────────────────── */}
      <div className="px-5 pt-8 pb-6">
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>
          feelmore.
        </p>
        <h1 style={{ color: '#ffffff', fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>
          Stories
        </h1>
      </div>

      {/* ── Featured ────────────────────────────────────── */}
      {featured && (
        <Link href={`/stories/${featured.id}`} className="block mx-5 mb-10">
          <div className="relative overflow-hidden" style={{ borderRadius: 24, height: 400 }}>
            {/* Photo */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${getCover(featured.category, 0)})`,
                filter: 'brightness(0.38) saturate(0.55)',
              }}
            />
            {/* Colour wash */}
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(135deg, ${featuredAccent}2A 0%, transparent 55%)` }}
            />
            {/* Bottom fade */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(180deg, transparent 28%, rgba(7,5,10,0.97) 100%)' }}
            />

            {/* Featured badge */}
            <div className="absolute top-5 left-5">
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                color: featuredAccent,
                backgroundColor: `${featuredAccent}22`,
                border: `1px solid ${featuredAccent}55`,
                padding: '5px 12px', borderRadius: 9999,
              }}>
                ✦ Featured
              </span>
            </div>

            {/* Text */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p style={{ color: featuredAccent, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                {categoryLabels[featured.category]}
              </p>
              {featured.title && (
                <h2 style={{ color: '#ffffff', fontSize: 23, fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.02em', marginBottom: 10 }}>
                  {featured.title}
                </h2>
              )}
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, lineHeight: 1.65, marginBottom: 22 }}>
                {featured.body.slice(0, 105)}…
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Heart size={12} strokeWidth={1.5} color="rgba(255,255,255,0.25)" />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>{featured._count.likes}</span>
                </div>
                <div
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full"
                  style={{ backgroundColor: featuredAccent }}
                >
                  <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>Read now</span>
                  <ChevronRight size={12} color="#fff" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* ── Category shelves ─────────────────────────────── */}
      {categories.map(cat => {
        const catStories = byCategory[cat]
        if (!catStories?.length) return null
        const accent = categoryAccent[cat] ?? '#A66A86'

        return (
          <section key={cat} className="mb-10">
            {/* Section header */}
            <div className="flex items-center justify-between px-5 mb-4">
              <div className="flex items-center gap-2.5">
                <div style={{ width: 3, height: 15, borderRadius: 9999, backgroundColor: accent }} />
                <h2 style={{ color: '#ffffff', fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>
                  {categoryLabels[cat]}
                </h2>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: 11 }}>
                {catStories.length} stories
              </span>
            </div>

            {/* Cards */}
            <div className="flex gap-3 px-5 overflow-x-auto scrollbar-hide" style={{ paddingBottom: 4 }}>
              {catStories.map((story, idx) => (
                <Link key={story.id} href={`/stories/${story.id}`} className="flex-shrink-0" style={{ width: 130 }}>
                  <div className="relative overflow-hidden mb-2.5" style={{ borderRadius: 16, height: 190 }}>
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${getCover(story.category, idx)})`, filter: 'brightness(0.35) saturate(0.45)' }}
                    />
                    <div className="absolute inset-0" style={{ background: `${accent}2A` }} />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 42%, rgba(7,5,10,0.97) 100%)' }} />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      {story.title ? (
                        <p style={{ color: '#ffffff', fontSize: 11, fontWeight: 600, lineHeight: 1.35 }}>
                          {story.title.length > 36 ? story.title.slice(0, 36) + '…' : story.title}
                        </p>
                      ) : (
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, lineHeight: 1.4 }}>
                          {story.body.slice(0, 42)}…
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart size={9} strokeWidth={1.5} color="rgba(255,255,255,0.2)" />
                    <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>{story._count.likes}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )
      })}

      {/* ── Series invitation — feels organic, not like an ad ── */}
      <Link href="/series" className="block mx-5 mt-4">
        <div
          className="relative overflow-hidden"
          style={{ borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.055)' }}
        >
          <div className="flex items-center justify-between px-6 py-5">
            <div>
              <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>
                Erotica Series
              </p>
              <p style={{ color: '#ffffff', fontSize: 17, fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.01em' }}>
                Longer stories.{'\n'}Deeper worlds.
              </p>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: 'rgba(166,106,134,0.12)', border: '1px solid rgba(166,106,134,0.2)' }}
            >
              <span style={{ color: '#A66A86', fontSize: 12, fontWeight: 600 }}>Explore</span>
              <ChevronRight size={12} color="#A66A86" />
            </div>
          </div>
        </div>
      </Link>

    </div>
  )
}
