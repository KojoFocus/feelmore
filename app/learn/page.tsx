export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { BookOpen, Clock, Lock } from 'lucide-react'

const coverFallbacks: Record<string, string> = {
  'the-understanding': 'https://images.unsplash.com/photo-1607690702277-ea1684b8aa89?w=600&h=400&fit=crop&q=80',
  'her-education':     'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=400&fit=crop&q=80',
  'room-14':           'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=400&fit=crop&q=80',
}

export default async function LearnPage() {
  let series: Awaited<ReturnType<typeof fetchSeries>> = []
  try { series = await fetchSeries() } catch (e) { console.error(e) }

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#0A080D', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ padding: '28px 20px 20px' }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#A66A86', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
          The Pleasure Series
        </p>
        <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 28, fontWeight: 600, color: '#fff', lineHeight: 1.25, marginBottom: 8 }}>
          Learn at your<br />own pace.
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
          Structured like a course. Consumed like content.<br />No pressure. No timeline.
        </p>
      </div>

      {/* Topics strip */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-5 pb-4">
        {['All', 'Solo wellness', 'Couples', 'Body literacy', 'Communication'].map((t, i) => (
          <span key={t} style={{
            flexShrink: 0, padding: '6px 14px', borderRadius: 999,
            backgroundColor: i === 0 ? '#A66A86' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${i === 0 ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
            color: i === 0 ? '#fff' : 'rgba(255,255,255,0.4)',
            fontSize: 12, fontWeight: i === 0 ? 600 : 400, whiteSpace: 'nowrap',
          }}>
            {t}
          </span>
        ))}
      </div>

      {/* Series grid */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {series.map((s, idx) => {
          const cover = s.coverImage || coverFallbacks[s.slug] || coverFallbacks['the-understanding']
          const totalEps = s.episodes.length
          const readTime = s.episodes.reduce((acc, ep) => acc + ep.readTime, 0)
          const firstEp = s.episodes[0]

          return (
            <Link
              key={s.id}
              href={firstEp ? `/learn/${s.slug}/${firstEp.slug}` : `/learn/${s.slug}`}
              style={{ textDecoration: 'none', display: 'block' }}
            >
              <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#0F0C0A', border: '1px solid rgba(255,255,255,0.05)' }}>
                {/* Cover */}
                <div className="relative" style={{ height: 160, backgroundColor: '#0e0910' }}>
                  <img src={cover} alt={s.title} className="w-full h-full object-cover" style={{ opacity: 0.5, mixBlendMode: 'luminosity' }} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(15,12,10,0) 40%, rgba(15,12,10,1) 100%)' }} />
                  {idx > 0 && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-2.5 py-1"
                      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
                      <Lock size={9} color="rgba(255,255,255,0.4)" />
                      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Coming soon</span>
                    </div>
                  )}
                  {idx === 0 && (
                    <div className="absolute top-3 left-3 rounded-full px-2.5 py-1"
                      style={{ backgroundColor: '#A66A86', fontSize: 9, fontWeight: 700, color: '#fff', letterSpacing: '0.05em' }}>
                      START HERE
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: '14px 16px 16px' }}>
                  <p style={{ fontFamily: 'var(--font-playfair)', fontSize: 17, fontWeight: 600, color: '#fff', marginBottom: 4, lineHeight: 1.3 }}>
                    {s.title}
                  </p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.55, marginBottom: 12 }}>
                    {s.description.slice(0, 90)}{s.description.length > 90 ? '…' : ''}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <BookOpen size={11} color="rgba(255,255,255,0.25)" strokeWidth={1.5} />
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{totalEps} episode{totalEps !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={11} color="rgba(255,255,255,0.25)" strokeWidth={1.5} />
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{readTime} min total</span>
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 600, color: idx === 0 ? '#A66A86' : 'rgba(255,255,255,0.2)' }}>
                      {idx === 0 ? 'Begin →' : 'Soon'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function fetchSeries() {
  return prisma.eroticaSeries.findMany({
    where: { isPublic: true },
    include: {
      episodes: { orderBy: { episodeNum: 'asc' }, select: { slug: true, readTime: true, episodeNum: true } },
    },
    orderBy: { createdAt: 'asc' },
  })
}
