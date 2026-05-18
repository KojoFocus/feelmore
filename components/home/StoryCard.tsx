'use client'

import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react'

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

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function Card({ story }: { story: Story }) {
  const label = categoryLabels[story.category] ?? story.category

  return (
    <div className="relative overflow-hidden h-full" style={{ borderRadius: 18, backgroundColor: '#100C0A' }}>
      {/* Background texture — right side */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${CARD_BG})`, filter: 'brightness(0.28) saturate(0.3)' }}
      />
      {/* Dark overlay: solid left → transparent right */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to right, rgba(16,12,10,0.98) 0%, rgba(16,12,10,0.92) 42%, rgba(16,12,10,0.4) 70%, rgba(16,12,10,0.05) 100%)' }}
      />

      <div className="relative h-full flex flex-col px-5 pt-3 pb-3">
        {/* Header row */}
        <div className="flex items-center justify-between flex-shrink-0 mb-3">
          <div className="flex items-center gap-2">
            <span style={{ color: '#A66A86', fontSize: 12, fontWeight: 600 }}>{label}</span>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>·</span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{timeAgo(story.createdAt)}</span>
          </div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <MoreHorizontal size={16} color="rgba(255,255,255,0.25)" />
          </button>
        </div>

        {/* Story body — big text */}
        <div className="flex-1 min-h-0 flex flex-col justify-center overflow-hidden">
          <p style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: 18,
            fontWeight: 500,
            lineHeight: 1.5,
            letterSpacing: '-0.01em',
            maxWidth: '70%',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 5,
            overflow: 'hidden',
          } as React.CSSProperties}>
            {story.body}
          </p>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between flex-shrink-0 mt-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Heart size={13} strokeWidth={1.5} color="rgba(255,255,255,0.3)" />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{story._count.likes}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageCircle size={13} strokeWidth={1.5} color="rgba(255,255,255,0.3)" />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{story._count.comments}</span>
            </div>
          </div>
          <Link href={`/stories/${story.id}`} style={{ color: '#A66A86', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
            Read more <span>›</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

const PLACEHOLDER: Story = {
  id: '',
  category: 'REAL_TALK',
  body: "I was nervous buying my first toy... didn't even know what I was doing tbh. Wish someone had told me these things.",
  title: null,
  createdAt: new Date().toISOString(),
  _count: { likes: 0, comments: 0 },
  user: { name: null },
}

export default function StoryCard({ stories }: { stories: Story[] }) {
  const displayStories = stories.slice(0, 8)
  const items = displayStories.length > 0 ? displayStories : [PLACEHOLDER]
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

  return (
    <div className="flex flex-col h-full">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide flex-1 min-h-0"
        style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
      >
        {items.map((story, i) => (
          <div key={story.id || i} className="flex-shrink-0 h-full" style={{ width: '100%', scrollSnapAlign: 'start' }}>
            <Card story={story} />
          </div>
        ))}
      </div>

      {/* Steppers */}
      <div className="flex justify-center items-center gap-1 flex-shrink-0 pt-2">
        {[0, 1, 2].map(i => {
          const activeLine = Math.min(2, Math.floor(active * 3 / items.length))
          return (
            <div key={i} style={{
              height: 3, width: 28, borderRadius: 9999,
              backgroundColor: i === activeLine ? '#A66A86' : 'rgba(255,255,255,0.15)',
              transition: 'background-color 0.25s ease',
            }} />
          )
        })}
      </div>
    </div>
  )
}
