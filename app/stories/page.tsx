export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { Heart, MessageCircle } from 'lucide-react'

const categoryLabels: Record<string, string> = {
  REAL_TALK: 'Real talk',
  WOMEN_SAY: 'Women say',
  FOR_COUPLES: 'For couples',
  TIPS: 'Tips',
}

const categoryBg: Record<string, string> = {
  REAL_TALK:   'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=500&fit=crop&q=80',
  WOMEN_SAY:   'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=500&fit=crop&q=80',
  FOR_COUPLES: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=500&fit=crop&q=80',
  TIPS:        'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&h=500&fit=crop&q=80',
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default async function StoriesPage() {
  const stories = await prisma.story.findMany({
    where: { isPublic: true },
    include: {
      user: { select: { name: true } },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="pb-24 pt-4">
      {/* Header */}
      <div className="px-5 mb-5">
        <h1 style={{ color: '#ffffff', fontSize: 22, fontWeight: 700 }}>
          feel<span style={{ color: '#C9923A' }}>more.</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 }}>
          Real people. Real stories.
        </p>
      </div>

      {/* Stories feed */}
      <div className="flex flex-col gap-3 px-4">
        {stories.map(story => {
          const label = categoryLabels[story.category] ?? story.category
          const bg = categoryBg[story.category] ?? categoryBg.REAL_TALK
          const cardBg = '#100C0A'

          return (
            <div
              key={story.id}
              className="relative overflow-hidden rounded-[18px]"
              style={{ backgroundColor: cardBg, minHeight: 200 }}
            >
              <div
                className="absolute right-0 top-0 bottom-0 w-[45%] bg-cover bg-center"
                style={{ backgroundImage: `url(${bg})`, filter: 'brightness(0.45) saturate(0.5)' }}
              />
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(to right, ${cardBg} 40%, rgba(16,12,10,0.85) 62%, rgba(16,12,10,0.2) 100%)` }}
              />

              <div className="relative flex flex-col px-5 py-4" style={{ minHeight: 200 }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span style={{ color: '#C9923A', fontSize: 13, fontWeight: 500 }}>{label}</span>
                    <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{timeAgo(story.createdAt)}</span>
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 18, letterSpacing: 2 }}>···</span>
                </div>

                {story.title && (
                  <p style={{ color: '#C9923A', fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {story.title}
                  </p>
                )}

                <p style={{ color: '#ffffff', fontSize: 17, fontWeight: 400, lineHeight: 1.55, flex: 1 }}>
                  {story.body}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Heart size={14} strokeWidth={1.5} color="rgba(255,255,255,0.5)" />
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{story._count.likes}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageCircle size={14} strokeWidth={1.5} color="rgba(255,255,255,0.5)" />
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{story._count.comments}</span>
                    </div>
                  </div>
                  <button style={{ color: '#C9923A', fontSize: 13, fontWeight: 500 }}>
                    Read more ›
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
