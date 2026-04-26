'use client'

import { useState } from 'react'

type ReactionType = 'FIRE' | 'HEART' | 'SHOCKED' | 'CLAP'

const REACTIONS: { type: ReactionType; emoji: string }[] = [
  { type: 'FIRE',    emoji: '🔥' },
  { type: 'HEART',   emoji: '❤️' },
  { type: 'SHOCKED', emoji: '😮' },
  { type: 'CLAP',    emoji: '👏' },
]

interface Props {
  episodeId: string
  counts: Record<ReactionType, number>
  userReactions?: ReactionType[]
}

export default function ReactionBar({ episodeId, counts, userReactions = [] }: Props) {
  const [localCounts, setLocalCounts] = useState(counts)
  const [active, setActive] = useState<Set<ReactionType>>(new Set(userReactions))
  const [loading, setLoading] = useState<ReactionType | null>(null)

  const toggle = async (type: ReactionType) => {
    if (loading) return
    setLoading(type)
    const isActive = active.has(type)
    const next = new Set(active)
    isActive ? next.delete(type) : next.add(type)
    setActive(next)
    setLocalCounts(prev => ({ ...prev, [type]: prev[type] + (isActive ? -1 : 1) }))

    try {
      await fetch(`/api/episodes/${episodeId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      })
    } catch {
      setActive(active)
      setLocalCounts(counts)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex gap-2.5">
      {REACTIONS.map(({ type, emoji }) => {
        const isActive = active.has(type)
        const count = localCounts[type]
        return (
          <button
            key={type}
            onClick={() => toggle(type)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full transition-all"
            style={{
              backgroundColor: isActive ? 'rgba(166,106,134,0.15)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${isActive ? 'rgba(166,106,134,0.4)' : 'rgba(255,255,255,0.06)'}`,
            }}
          >
            <span className="text-[15px] leading-none">{emoji}</span>
            {count > 0 && (
              <span
                className="text-[11px] font-medium"
                style={{ color: isActive ? '#A66A86' : 'rgba(255,255,255,0.3)' }}
              >
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
