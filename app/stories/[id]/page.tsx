export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ChevronLeft, Heart, MessageCircle } from 'lucide-react'

const categoryLabels: Record<string, string> = {
  REAL_TALK: 'Real talk',
  WOMEN_SAY: 'Women say',
  FOR_COUPLES: 'For couples',
  TIPS: 'Tips',
}

const categoryBg: Record<string, string> = {
  REAL_TALK:   'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=400&fit=crop&q=80',
  WOMEN_SAY:   'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=400&fit=crop&q=80',
  FOR_COUPLES: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=400&fit=crop&q=80',
  TIPS:        'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&h=400&fit=crop&q=80',
}

export default async function StoryReaderPage({
  params,
}: {
  params: { id: string }
}) {
  const data = await fetchStoryWithNeighbors(params.id).catch(() => null)
  if (!data) return notFound()

  const { story, prev, next } = data
  const label = categoryLabels[story.category] ?? story.category
  const bg = categoryBg[story.category] ?? categoryBg.REAL_TALK
  const paragraphs = story.body.split('\n').filter(Boolean)

  return (
    <div style={{ backgroundColor: '#0D0A08', minHeight: '100dvh', paddingBottom: 120 }}>
      {/* Hero image */}
      <div className="relative" style={{ height: 220 }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bg})`, filter: 'brightness(0.35) saturate(0.5)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(13,10,8,0.5) 0%, rgba(13,10,8,0.0) 40%, rgba(13,10,8,1) 100%)' }}
        />

        {/* Sticky nav inside hero */}
        <div className="absolute top-0 left-0 right-0 flex items-center gap-3 px-4 pt-3 pb-3" style={{ paddingTop: 'max(14px, env(safe-area-inset-top, 14px))' }}>
          <Link
            href="/stories"
            className="flex items-center gap-1"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
            <span style={{ fontSize: 13 }}>Stories</span>
          </Link>
        </div>
      </div>

      {/* Category + title */}
      <div className="px-5 pb-6" style={{ marginTop: -20 }}>
        <span
          style={{
            display: 'inline-block',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#A66A86',
            backgroundColor: 'rgba(166,106,134,0.15)',
            padding: '4px 10px',
            borderRadius: 9999,
            marginBottom: 14,
          }}
        >
          {label}
        </span>

        {story.title && (
          <h1 style={{ color: '#ffffff', fontSize: 22, fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.01em', marginBottom: 6 }}>
            {story.title}
          </h1>
        )}

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Heart size={13} strokeWidth={1.5} color="rgba(255,255,255,0.35)" />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{story._count.likes}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageCircle size={13} strokeWidth={1.5} color="rgba(255,255,255,0.35)" />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{story._count.comments}</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.04)', marginBottom: 32 }} />

      {/* Body */}
      <div className="px-5">
        {paragraphs.map((para, i) => (
          <p
            key={i}
            style={{
              color: '#D1C9C1',
              fontSize: 16,
              lineHeight: 1.85,
              fontWeight: 400,
              marginBottom: 22,
            }}
          >
            {para}
          </p>
        ))}
      </div>

      {/* Reaction strip */}
      <div
        className="mx-5 mt-8 rounded-2xl flex items-center justify-around py-4"
        style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
      >
        {[
          { emoji: '🔥', label: 'Hot' },
          { emoji: '❤️', label: 'Love' },
          { emoji: '😮', label: 'Wow' },
          { emoji: '👏', label: 'Yes' },
        ].map(({ emoji, label: rl }) => (
          <button key={rl} className="flex flex-col items-center gap-1.5">
            <span style={{ fontSize: 22 }}>{emoji}</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>{rl}</span>
          </button>
        ))}
      </div>

      {/* Prev / Next */}
      <div className="flex gap-2.5 mx-5 mt-6">
        {prev ? (
          <Link
            href={`/stories/${prev.id}`}
            className="flex-1 flex items-center gap-2 py-3.5 px-4 rounded-2xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <ChevronLeft size={13} color="rgba(255,255,255,0.25)" />
            <div>
              <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Prev</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 500, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {prev.title ?? categoryLabels[prev.category] ?? prev.category}
              </p>
            </div>
          </Link>
        ) : <div className="flex-1" />}

        {next ? (
          <Link
            href={`/stories/${next.id}`}
            className="flex-1 flex items-center justify-end gap-2 py-3.5 px-4 rounded-2xl"
            style={{ backgroundColor: 'rgba(166,106,134,0.08)', border: '1px solid rgba(166,106,134,0.2)' }}
          >
            <div className="text-right">
              <p style={{ fontSize: 9, color: 'rgba(166,106,134,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Next</p>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#A66A86', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {next.title ?? categoryLabels[next.category] ?? next.category}
              </p>
            </div>
            <ChevronLeft size={13} color="#A66A86" style={{ transform: 'rotate(180deg)' }} />
          </Link>
        ) : (
          <Link
            href="/stories"
            className="flex-1 flex items-center justify-end gap-2 py-3.5 px-4 rounded-2xl"
            style={{ backgroundColor: 'rgba(166,106,134,0.08)', border: '1px solid rgba(166,106,134,0.2)' }}
          >
            <div className="text-right">
              <p style={{ fontSize: 9, color: 'rgba(166,106,134,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Back to</p>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#A66A86' }}>All stories</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}

async function fetchStoryWithNeighbors(id: string) {
  const all = await prisma.story.findMany({
    where: { isPublic: true },
    select: { id: true, category: true, title: true },
    orderBy: { createdAt: 'desc' },
  })

  const idx = all.findIndex(s => s.id === id)
  if (idx === -1) return null

  const story = await prisma.story.findUnique({
    where: { id },
    include: {
      user: { select: { name: true } },
      _count: { select: { likes: true, comments: true } },
    },
  })
  if (!story) return null

  return {
    story,
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  }
}
