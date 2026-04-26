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

const categoryTint: Record<string, string> = {
  REAL_TALK:   'rgba(90,20,40,0.55)',
  WOMEN_SAY:   'rgba(60,10,60,0.55)',
  FOR_COUPLES: 'rgba(40,10,50,0.5)',
  TIPS:        'rgba(20,20,60,0.5)',
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

  return (
    <div style={{ backgroundColor: '#080608', minHeight: '100dvh', paddingBottom: 110 }}>

      {/* Header — just the logo, no subtitle clutter */}
      <div className="px-5 pt-6 pb-5">
        <h1 style={{ color: '#ffffff', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>
          feel<span style={{ color: '#A66A86' }}>more.</span>
        </h1>
      </div>

      {/* Series banner */}
      <Link href="/series" className="block mx-5 mb-6">
        <div className="relative overflow-hidden rounded-[20px]" style={{ height: 120 }}>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=600&h=300&fit=crop&q=80)`,
              filter: 'brightness(0.18) saturate(0.3)',
            }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(120deg, rgba(166,106,134,0.12) 0%, rgba(8,6,8,0.7) 100%)' }} />
          <div className="absolute inset-0 flex items-center justify-between px-5">
            <div>
              <p style={{ color: '#A66A86', fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>
                ✦ Erotica Series
              </p>
              <p style={{ color: '#ffffff', fontSize: 17, fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
                Longer stories.{'\n'}Deeper worlds.
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#A66A86' }}>
              <span style={{ color: '#080608', fontSize: 11, fontWeight: 700 }}>Read</span>
              <BookOpen size={11} color="#080608" />
            </div>
          </div>
        </div>
      </Link>

      {/* Featured story — cinematic */}
      {featured && (
        <Link href={`/stories/${featured.id}`} className="block mx-5 mb-8">
          <div className="relative overflow-hidden rounded-[20px]" style={{ height: 310 }}>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${getCover(featured.category, 0)})`,
                filter: 'brightness(0.28) saturate(0.6)',
              }}
            />
            {/* Category colour wash */}
            <div className="absolute inset-0" style={{ background: categoryTint[featured.category] ?? categoryTint.REAL_TALK }} />
            {/* Bottom fade */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 20%, rgba(8,6,8,0.99) 100%)' }} />

            <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(166,106,134,0.18)', border: '1px solid rgba(166,106,134,0.25)' }}>
              <span style={{ color: '#A66A86', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>✦ Featured</span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5">
              <span style={{ color: '#A66A86', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {categoryLabels[featured.category]}
              </span>
              {featured.title && (
                <h2 style={{ color: '#ffffff', fontSize: 21, fontWeight: 700, lineHeight: 1.25, marginTop: 6, marginBottom: 10, letterSpacing: '-0.01em' }}>
                  {featured.title}
                </h2>
              )}
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, lineHeight: 1.7, marginBottom: 14 }}>
                {featured.body.slice(0, 110)}…
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Heart size={11} strokeWidth={1.5} color="rgba(255,255,255,0.25)" />
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>{featured._count.likes}</span>
                </div>
                <div className="flex items-center gap-1 px-3.5 py-1.5 rounded-full" style={{ backgroundColor: '#A66A86' }}>
                  <span style={{ color: '#080608', fontSize: 11, fontWeight: 700 }}>Read now</span>
                  <ChevronRight size={11} color="#080608" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Category shelves */}
      {categories.map(cat => {
        const catStories = byCategory[cat]
        if (!catStories || catStories.length === 0) return null
        const tint = categoryTint[cat] ?? categoryTint.REAL_TALK
        return (
          <section key={cat} className="mb-8">
            <div className="flex items-center justify-between px-5 mb-3">
              <h2 style={{ color: '#ffffff', fontSize: 14, fontWeight: 600, letterSpacing: '0.01em' }}>
                {categoryLabels[cat]}
              </h2>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>{catStories.length} stories</span>
            </div>

            <div className="flex gap-3 px-5 overflow-x-auto scrollbar-hide" style={{ paddingBottom: 4 }}>
              {catStories.map((story, idx) => (
                <Link key={story.id} href={`/stories/${story.id}`} className="flex-shrink-0" style={{ width: 125 }}>
                  <div className="relative overflow-hidden rounded-[14px] mb-2" style={{ height: 180 }}>
                    {/* Base photo */}
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${getCover(story.category, idx)})`, filter: 'brightness(0.35) saturate(0.5)' }}
                    />
                    {/* Category colour wash for editorial feel */}
                    <div className="absolute inset-0" style={{ background: tint }} />
                    {/* Bottom fade for title */}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 45%, rgba(8,6,8,0.97) 100%)' }} />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      {story.title && (
                        <p style={{ color: '#ffffff', fontSize: 11, fontWeight: 600, lineHeight: 1.35 }}>
                          {story.title.length > 32 ? story.title.slice(0, 32) + '…' : story.title}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Heart size={10} strokeWidth={1.5} color="rgba(255,255,255,0.2)" />
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>{story._count.likes}</span>
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
