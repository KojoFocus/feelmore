'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { X, Heart, MessageCircle } from 'lucide-react'

type Story = {
  id: string
  category: string
  body: string
  title: string | null
  createdAt: string
  _count: { likes: number; comments: number }
  user: { name: string | null }
}

const DURATION = 5000

const categoryLabels: Record<string, string> = {
  REAL_TALK: 'Real talk',
  WOMEN_SAY: 'Women say',
  FOR_COUPLES: 'For couples',
  TIPS: 'Tips',
}

const categoryBg: Record<string, string> = {
  REAL_TALK:   'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&h=1000&fit=crop&q=80',
  WOMEN_SAY:   'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=1000&fit=crop&q=80',
  FOR_COUPLES: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=1000&fit=crop&q=80',
  TIPS:        'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&h=1000&fit=crop&q=80',
}

interface Props {
  stories: Story[]
  startIndex?: number
  onClose: () => void
}

export default function StoryViewer({ stories, startIndex = 0, onClose }: Props) {
  const [current, setCurrent] = useState(startIndex)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const progressRef = useRef(0)
  const pausedRef = useRef(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const STEP = (100 / DURATION) * 50

  const story = stories[current]

  const goNext = useCallback(() => {
    if (current < stories.length - 1) {
      setCurrent(c => c + 1)
      progressRef.current = 0
      setProgress(0)
    } else {
      onClose()
    }
  }, [current, stories.length, onClose])

  const goPrev = useCallback(() => {
    progressRef.current = 0
    setProgress(0)
    setCurrent(c => Math.max(0, c - 1))
  }, [])

  useEffect(() => {
    progressRef.current = 0
    setProgress(0)
    pausedRef.current = false

    intervalRef.current = setInterval(() => {
      if (pausedRef.current) return
      progressRef.current = Math.min(progressRef.current + STEP, 100)
      setProgress(progressRef.current)
      if (progressRef.current >= 100) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        goNext()
      }
    }, 50)

    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [current]) // eslint-disable-line react-hooks/exhaustive-deps

  const handlePressStart = () => { pausedRef.current = true; setPaused(true) }
  const handlePressEnd   = () => { pausedRef.current = false; setPaused(false) }

  if (!story) return null

  const bg    = categoryBg[story.category] ?? categoryBg.REAL_TALK
  const label = categoryLabels[story.category] ?? story.category

  return (
    /* Full-screen overlay — positioned relative to the 430px column */
    <div
      style={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        zIndex: 200,
        backgroundColor: '#08090D',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Atmospheric background */}
      <div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.3) saturate(0.45)',
        }}
      />
      {/* Gradient fade top/bottom */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.8) 100%)' }} />

      {/* ── Progress bars ── */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', gap: 3, padding: '48px 14px 8px', zIndex: 10 }}>
        {stories.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 2, borderRadius: 9999, backgroundColor: 'rgba(255,255,255,0.25)', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                borderRadius: 9999,
                backgroundColor: '#fff',
                width: i < current ? '100%' : i === current ? `${progress}%` : '0%',
              }}
            />
          </div>
        ))}
      </div>

      {/* ── Top bar: badge + close ── */}
      <div style={{ position: 'absolute', top: 52, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', zIndex: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#BF567D', backgroundColor: 'rgba(191,86,125,0.2)', padding: '5px 12px', borderRadius: 9999 }}>
          {label}
        </span>
        <button
          onPointerDown={e => { e.stopPropagation(); onClose() }}
          style={{ color: 'rgba(255,255,255,0.7)', padding: 4, background: 'none', border: 'none', cursor: 'pointer', lineHeight: 0 }}
        >
          <X size={20} strokeWidth={1.5} />
        </button>
      </div>

      {/* ── Tap zones ── */}
      <div
        style={{ position: 'absolute', inset: 0, display: 'flex', zIndex: 5 }}
        onPointerDown={handlePressStart}
        onPointerUp={handlePressEnd}
        onPointerCancel={handlePressEnd}
      >
        <div style={{ flex: 2 }} onClick={e => { e.stopPropagation(); goPrev() }} />
        <div style={{ flex: 3 }} onClick={e => { e.stopPropagation(); goNext() }} />
      </div>

      {/* ── Story content (bottom) ── */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 20px 60px', zIndex: 10, pointerEvents: 'none' }}>
        {story.title && (
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
            {story.title}
          </p>
        )}
        <p style={{ color: '#fff', fontSize: 22, fontWeight: 600, lineHeight: 1.35, letterSpacing: '-0.01em', marginBottom: 20 }}>
          {story.body}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Heart size={15} fill="#BF567D" color="#BF567D" />
            <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.55)' }}>{story._count.likes}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MessageCircle size={15} strokeWidth={1.5} color="rgba(255,255,255,0.4)" />
            <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.55)' }}>{story._count.comments}</span>
          </div>
        </div>
      </div>

      {/* ── Pause indicator ── */}
      {paused && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, pointerEvents: 'none' }}>
          <div style={{ width: 52, height: 52, borderRadius: 9999, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <div style={{ width: 4, height: 18, borderRadius: 9999, backgroundColor: '#fff' }} />
            <div style={{ width: 4, height: 18, borderRadius: 9999, backgroundColor: '#fff' }} />
          </div>
        </div>
      )}
    </div>
  )
}
