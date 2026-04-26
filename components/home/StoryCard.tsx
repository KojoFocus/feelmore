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
  REAL_TALK:   'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&h=500&fit=crop&q=80',
  WOMEN_SAY:   'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&h=500&fit=crop&q=80',
  FOR_COUPLES: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=600&h=500&fit=crop&q=80',
  TIPS:        'https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&h=500&fit=crop&q=80',
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
      {/* Full background image — brighter on right, shows texture */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})`, filter: 'brightness(0.65) saturate(1.1)' }}
      />
      {/* Dark left for text readability, fades right to reveal image */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to right, rgba(13,10,8,0.97) 0%, rgba(13,10,8,0.88) 35%, rgba(13,10,8,0.35) 65%, rgba(13,10,8,0.05) 100%)' }}
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
