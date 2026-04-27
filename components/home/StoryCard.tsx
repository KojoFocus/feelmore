'use client'

import Link from 'next/link'
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

const categoryBg: Record<string, string> = {
  REAL_TALK:   'https://images.unsplash.com/photo-1607690702277-ea1684b8aa89?w=600&h=500&fit=crop&q=80',
  WOMEN_SAY:   'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&h=500&fit=crop&q=80',
  FOR_COUPLES: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=500&fit=crop&q=80',
  TIPS:        'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&h=500&fit=crop&q=80',
}

function timeAgo(date: Date | string): string {
  const diff = Date.now() - new Date(date).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function truncate(text: string, max = 100): string {
  if (text.length <= max) return text
  return text.slice(0, max).replace(/\s\S+$/, '') + '…'
}

function Card({ story }: { story: Story }) {
  const label = categoryLabels[story.category] ?? story.category
  const bg = categoryBg[story.category] ?? categoryBg.REAL_TALK

  return (
    <div className="relative overflow-hidden h-full" style={{ borderRadius: 18, backgroundColor: '#100C0A' }}>
      {/* Background fabric texture — right half only */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})`, filter: 'brightness(0.55) saturate(0.7)' }}
      />
      {/* Dark overlay: solid left → transparent right */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to right, rgba(16,12,10,0.97) 0%, rgba(16,12,10,0.9) 38%, rgba(16,12,10,0.3) 68%, rgba(16,12,10,0.05) 100%)' }}
      />

      <div className="relative h-full flex flex-col px-5 py-4">
        {/* Top row */}
        <div className="flex items-center justify-between flex-shrink-0 mb-4">
          <div className="flex items-center gap-2">
            <span style={{ color: '#A66A86', fontSize: 13, fontWeight: 600 }}>{label}</span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{timeAgo(story.createdAt)}</span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 18, letterSpacing: 2, lineHeight: 1 }}>···</span>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <p style={{ color: '#ffffff', fontSize: 16, fontWeight: 600, lineHeight: 1.5, letterSpacing: '-0.02em', textAlign: 'left', maxWidth: '62%' }}>
            {truncate(story.body)}
          </p>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between flex-shrink-0 pt-4">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5">
              <Heart size={14} strokeWidth={1.5} color="rgba(255,255,255,0.45)" />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{story._count.likes}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageCircle size={14} strokeWidth={1.5} color="rgba(255,255,255,0.45)" />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{story._count.comments}</span>
            </div>
          </div>
          <Link href={`/stories/${story.id}`} className="flex items-center gap-1" style={{ color: '#A66A86', fontSize: 13, fontWeight: 500 }}>
            Read more <span style={{ fontSize: 15 }}>›</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function StoryCard({ stories }: { stories: Story[] }) {
  if (!stories.length) return null

  return (
    <div
      className="flex overflow-x-auto scrollbar-hide h-full"
      style={{
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
        gap: 10,
      }}
    >
      {stories.slice(0, 8).map(story => (
        <div
          key={story.id}
          className="flex-shrink-0 h-full"
          style={{ width: 'calc(100% - 28px)', scrollSnapAlign: 'start' }}
        >
          <Card story={story} />
        </div>
      ))}
    </div>
  )
}
