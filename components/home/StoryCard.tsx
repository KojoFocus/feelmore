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

const categoryAccent: Record<string, string> = {
  REAL_TALK:   'rgba(90,30,50,0.35)',
  WOMEN_SAY:   'rgba(60,20,70,0.35)',
  FOR_COUPLES: 'rgba(50,25,60,0.35)',
  TIPS:        'rgba(30,40,70,0.35)',
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
  const accent = categoryAccent[story.category] ?? categoryAccent.REAL_TALK

  return (
    <div className="relative overflow-hidden h-full" style={{ borderRadius: 18, backgroundColor: '#0E0B09' }}>
      {/* Subtle colour tint in the right corner — no image, no noise */}
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at 100% 50%, ${accent} 0%, transparent 70%)` }}
      />

      <div className="relative h-full flex flex-col px-5 py-4">

        {/* Top: category · time · ··· */}
        <div className="flex items-center justify-between flex-shrink-0 mb-4">
          <div className="flex items-center gap-2">
            <span style={{ color: '#A66A86', fontSize: 13, fontWeight: 600 }}>{label}</span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{timeAgo(story.createdAt)}</span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 18, letterSpacing: 2, lineHeight: 1 }}>···</span>
        </div>

        {/* Body — fills space */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <p style={{ color: '#ffffff', fontSize: 17, fontWeight: 400, lineHeight: 1.65 }}>
            {story.body}
          </p>
        </div>

        {/* Bottom: likes · comments · Read more */}
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
