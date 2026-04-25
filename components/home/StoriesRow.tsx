'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import StoryViewer from './StoryViewer'

type Story = {
  id: string
  category: string
  body: string
  title: string | null
  createdAt: string
  _count: { likes: number; comments: number }
  user: { name: string | null }
}

const CATEGORIES = [
  {
    key: 'REAL_TALK',
    label: 'Real talk',
    img: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=160&h=160&fit=crop&crop=face&q=80',
    badge: true,
  },
  {
    key: 'WOMEN_SAY',
    label: 'Women say',
    img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=160&h=160&fit=crop&crop=face&q=80',
  },
  {
    key: 'FOR_COUPLES',
    label: 'For couples',
    img: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=160&h=160&fit=crop&crop=faces&q=80',
  },
  {
    key: 'TIPS',
    label: 'Tips',
    img: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=160&h=160&fit=crop&q=80',
  },
]

function StoryCircle({
  label,
  img,
  badge,
  active,
  onClick,
}: {
  label: string
  img?: string
  badge?: boolean
  active: boolean
  onClick?: () => void
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2.5 flex-shrink-0">
      {/* Border lives on a wrapper so it never gets clipped by overflow:auto */}
      <div
        style={{
          padding: 3,
          borderRadius: 9999,
          border: `1.5px solid ${active ? '#BF567D' : 'rgba(255,255,255,0.08)'}`,
          backgroundColor: '#0f080c',
        }}
      >
        <div className="w-[66px] h-[66px] rounded-full overflow-hidden relative" style={{ backgroundColor: '#0f080c' }}>
          {img && (
            <img
              src={img}
              alt={label}
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.6) saturate(0.65)' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          )}
          {!img && (
            <div className="w-full h-full flex items-center justify-center">
              <Plus size={22} color="#BF567D" strokeWidth={1.5} />
            </div>
          )}
          {badge && active && (
            <div
              className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[18px] h-[18px] rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#BF567D' }}
            >
              <span className="text-white" style={{ fontSize: 8 }}>♥</span>
            </div>
          )}
        </div>
      </div>
      <span className="text-[9px] text-gray-600 font-medium text-center w-[72px] leading-tight">{label}</span>
    </button>
  )
}

export default function StoriesRow({ stories = [] }: { stories: Story[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const getStories = (key: string) => stories.filter(s => s.category === key)
  const activeStories = activeCategory ? getStories(activeCategory) : []

  return (
    <>
      <section className="mt-4 flex-shrink-0">
        <p className="text-[10px] font-semibold text-gray-700 uppercase tracking-[0.12em] mb-3 px-5">Stories</p>
        {/* px-5 on the scroll container so the border wrapper is never clipped */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide px-5 pb-1">
          <StoryCircle label="Your story" active={false} />
          {CATEGORIES.map(({ key, label, img, badge }) => {
            const hasStories = getStories(key).length > 0
            return (
              <StoryCircle
                key={key}
                label={label}
                img={img}
                badge={badge}
                active={hasStories}
                onClick={() => hasStories && setActiveCategory(key)}
              />
            )
          })}
        </div>
      </section>

      {activeCategory && activeStories.length > 0 && (
        <StoryViewer
          stories={activeStories}
          onClose={() => setActiveCategory(null)}
        />
      )}
    </>
  )
}
