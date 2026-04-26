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
  REAL_TALK:   'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=400&fit=crop&q=80',
  WOMEN_SAY:   'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=400&fit=crop&q=80',
  FOR_COUPLES: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=400&fit=crop&q=80',
  TIPS:        'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&h=400&fit=crop&q=80',
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
  const initial = (story.user.name ?? 'A')[0].toUpperCase()

  return (
    <div className="relative overflow-hidden h-full" style={{ borderRadius: 18 }}>
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})`, filter: 'brightness(0.18) saturate(0.3)' }}
      />
      {/* Gradient */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(150deg, rgba(22,8,14,0.97) 0%, rgba(10,6,12,0.9) 100%)' }} />
      {/* Left accent */}
      <div className="absolute left-0 top-4 bottom-4 w-[2px] rounded-full" style={{ backgroundColor: 'rgba(201,146,58,0.35)' }} />

      <div className="relative h-full flex flex-col px-5 py-4">

        {/* Top row */}
        <div className="flex items-center gap-2.5 mb-3 flex-shrink-0">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
            style={{ backgroundColor: 'rgba(201,146,58,0.2)', color: '#C9923A' }}
          >
            {initial}
          </div>
          <span
            className="text-[10px] font-semibold px-2 py-[3px] rounded-full"
            style={{ color: '#C9923A', backgroundColor: 'rgba(201,146,58,0.1)' }}
          >
            {label}
          </span>
          <span className="text-[10px] text-gray-700 ml-auto">{timeAgo(story.createdAt)}</span>
        </div>

        {/* Title if present */}
        {story.title && (
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-2 flex-shrink-0" style={{ color: 'rgba(201,146,58,0.65)' }}>
            {story.title}
          </p>
        )}

        <div className="flex-1 min-h-0 overflow-hidden">
          <p className="text-white/80 text-[13px] font-normal leading-[1.65]" style={{ letterSpacing: '0.01em' }}>
            {story.body}
          </p>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between flex-shrink-0 pt-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Heart size={12} fill="#C9923A" color="#C9923A" />
              <span className="text-[11px] text-gray-600">{story._count.likes}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageCircle size={12} strokeWidth={1.5} color="rgba(255,255,255,0.18)" />
              <span className="text-[11px] text-gray-600">{story._count.comments}</span>
            </div>
          </div>
          <button className="text-[11px] text-gray-500 font-medium">
            Read more <span style={{ color: '#C9923A' }}>›</span>
          </button>
        </div>
      </div>
    </div>
  )
}
