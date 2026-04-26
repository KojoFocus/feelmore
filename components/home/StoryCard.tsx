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

function timeAgo(date: Date | string): string {
  const diff = Date.now() - new Date(date).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function StoryCard({ story }: { story: Story }) {
  const label = categoryLabels[story.category] ?? story.category
  const bg = categoryBg[story.category] ?? categoryBg.REAL_TALK
  const cardBg = '#100C0A'

  return (
    <div className="relative overflow-hidden h-full" style={{ borderRadius: 18, backgroundColor: cardBg }}>
      {/* Texture image on the right half */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[52%] bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})`, filter: 'brightness(0.45) saturate(0.5)' }}
      />
      {/* Gradient: solid left → fade right */}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(to right, ${cardBg} 40%, rgba(16,12,10,0.85) 60%, rgba(16,12,10,0.2) 100%)` }}
      />

      <div className="relative h-full flex flex-col px-5 py-4">

        {/* Top: category · time · ··· */}
        <div className="flex items-center justify-between flex-shrink-0 mb-3">
          <div className="flex items-center gap-2">
            <span style={{ color: '#A66A86', fontSize: 13, fontWeight: 500 }}>{label}</span>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{timeAgo(story.createdAt)}</span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 18, letterSpacing: 2, lineHeight: 1 }}>···</span>
        </div>

        {/* Body — large, fills space */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <p style={{ color: '#ffffff', fontSize: 20, fontWeight: 400, lineHeight: 1.5 }}>
            {story.body}
          </p>
        </div>

        {/* Bottom: likes · comments · Read more */}
        <div className="flex items-center justify-between flex-shrink-0 pt-3">
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
          <Link href={`/stories/${story.id}`} style={{ color: '#A66A86', fontSize: 13, fontWeight: 500 }}>
            Read more ›
          </Link>
        </div>
      </div>
    </div>
  )
}
