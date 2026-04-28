'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Heart, MessageCircle } from 'lucide-react'

type Story = { id: string; title: string | null; body: string; category: string; isPublic: boolean; createdAt: string; likes: number; comments: number }

const CAT_LABEL: Record<string, string> = {
  REAL_TALK: 'Real Talk', WOMEN_SAY: 'Women Say',
  FOR_COUPLES: 'For Couples', TIPS: 'Tips',
}

export default function MyStoriesPage() {
  const router = useRouter()
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stories/mine')
      .then(r => r.ok ? r.json() : [])
      .then(d => { setStories(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div style={{ backgroundColor: '#0A080D', minHeight: '100dvh', paddingBottom: 100 }}>
      <div style={{ paddingTop: 'max(52px, env(safe-area-inset-top, 52px))', padding: 'max(52px, env(safe-area-inset-top, 52px)) 20px 0', marginBottom: 20 }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, padding: 0, fontSize: 13 }}>
          <ArrowLeft size={15} /> Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ color: '#ffffff', fontSize: 22, fontWeight: 700 }}>My Stories</h1>
          <Link href="/stories" style={{ color: '#A66A86', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Browse all</Link>
        </div>
        {!loading && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, marginTop: 4 }}>{stories.length} story{stories.length !== 1 ? 's' : ''}</p>}
      </div>

      <div style={{ padding: '0 20px' }}>
        {loading && <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', paddingTop: 60, fontSize: 13 }}>Loading…</p>}

        {!loading && stories.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: 80 }}>
            <BookOpen size={40} color="rgba(255,255,255,0.07)" />
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginTop: 14 }}>You haven't shared any stories yet</p>
            <button onClick={() => router.push('/stories')} style={{
              marginTop: 20, backgroundColor: '#A66A86', color: '#fff', border: 'none',
              padding: '12px 28px', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>Share a story</button>
          </div>
        )}

        {stories.map(s => (
          <Link key={s.id} href={`/stories/${s.id}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 12 }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#A66A86', backgroundColor: 'rgba(166,106,134,0.12)', padding: '2px 8px', borderRadius: 6 }}>
                  {CAT_LABEL[s.category] ?? s.category}
                </span>
                {!s.isPublic && (
                  <span style={{ fontSize: 10, fontWeight: 600, color: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.12)', padding: '2px 8px', borderRadius: 6 }}>Draft</span>
                )}
              </div>
              {s.title && <p style={{ color: '#ffffff', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{s.title}</p>}
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' } as React.CSSProperties}>
                {s.body}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 10 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
                  <Heart size={12} /> {s.likes}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
                  <MessageCircle size={12} /> {s.comments}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, marginLeft: 'auto' }}>
                  {new Date(s.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
