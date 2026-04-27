'use client'

import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import { Heart, MessageCircle } from 'lucide-react'

type Story = {
  id: string
  category: string
  body: string
  title: string | null
  createdAt: string
  _count: { likes: number; comments: number }
  user: { name: string | null }
}

const categoryLabels: Record<string, string> = {
  REAL_TALK:   'Real talk',
  WOMEN_SAY:   'Women say',
  FOR_COUPLES: 'For couples',
  TIPS:        'Tips',
}

const CARD_BG = 'https://images.unsplash.com/photo-1607690702277-ea1684b8aa89?w=600&h=500&fit=crop&q=80'


function Card({ story }: { story: Story }) {
  const label = categoryLabels[story.category] ?? story.category
  const author = story.user.name ?? 'Anonymous'

  return (
    <div className="relative overflow-hidden h-full" style={{ borderRadius: 18, backgroundColor: '#100C0A' }}>
      {/* Background texture — right side */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${CARD_BG})`, filter: 'brightness(0.3) saturate(0.3)' }}
      />
      {/* Dark overlay: solid left → transparent right */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to right, rgba(16,12,10,0.97) 0%, rgba(16,12,10,0.9) 38%, rgba(16,12,10,0.3) 68%, rgba(16,12,10,0.05) 100%)' }}
      />

      <div className="relative h-full flex flex-col px-5 py-5">
        {/* Category + author — horizontal */}
        <div className="flex items-center gap-2 flex-shrink-0 mb-3">
          <span style={{ color: '#A66A86', fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {label}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>·</span>
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, fontWeight: 400 }}>{author}</span>
        </div>

        {/* Hook text */}
        <div className="flex-shrink-0">
          <p style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 4,
            overflow: 'hidden',
            color: 'rgba(255,255,255,0.88)',
            fontSize: 15,
            fontWeight: 400,
            lineHeight: 1.6,
            letterSpacing: '-0.01em',
            textAlign: 'left',
            maxWidth: '71%',
          }}>
            {story.body}
          </p>
        </div>
        <div className="flex-1" />

        {/* Bottom row */}
        <div className="flex items-center justify-between flex-shrink-0">
          <Link
            href={`/stories/${story.id}`}
            style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontWeight: 400 }}
          >
            Tap to read <span style={{ color: '#A66A86' }}>›</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Heart size={11} strokeWidth={1.5} color="rgba(255,255,255,0.2)" />
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>{story._count.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle size={11} strokeWidth={1.5} color="rgba(255,255,255,0.2)" />
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>{story._count.comments}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function StoryCard({ stories }: { stories: Story[] }) {
  const displayStories = stories.slice(0, 8)
  const [active, setActive] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth)
      setActive(idx)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  if (!displayStories.length) return null

  return (
    <div className="flex flex-col h-full">
      {/* Carousel — full width, no peek */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide flex-1 min-h-0"
        style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
      >
        {displayStories.map(story => (
          <div
            key={story.id}
            className="flex-shrink-0 h-full"
            style={{ width: '100%', scrollSnapAlign: 'start' }}
          >
            <Card story={story} />
          </div>
        ))}
      </div>

      {/* 3 line steppers */}
      {(() => {
        const activeLine = Math.min(2, Math.floor(active * 3 / displayStories.length))
        return (
          <div className="flex justify-center items-center gap-1 flex-shrink-0 pt-2.5">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                style={{
                  height: 3,
                  width: 28,
                  borderRadius: 9999,
                  backgroundColor: i === activeLine ? '#A66A86' : 'rgba(255,255,255,0.15)',
                  transition: 'background-color 0.25s ease',
                }}
              />
            ))}
          </div>
        )
      })()}
    </div>
  )
}
