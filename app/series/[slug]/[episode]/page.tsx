export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ChevronLeft, Clock, BookOpen } from 'lucide-react'
import ReactionBar from '@/components/series/ReactionBar'
import CommentsSection from '@/components/series/CommentsSection'

type ReactionType = 'FIRE' | 'HEART' | 'SHOCKED' | 'CLAP'

export default async function EpisodePage({
  params,
}: {
  params: { slug: string; episode: string }
}) {
  let data: Awaited<ReturnType<typeof fetchEpisode>> | null = null
  try { data = await fetchEpisode(params.slug, params.episode) } catch (e) { console.error(e) }
  if (!data) return notFound()

  const { series, episode, prev, next } = data

  const reactionCounts: Record<ReactionType, number> = { FIRE: 0, HEART: 0, SHOCKED: 0, CLAP: 0 }
  for (const r of episode.reactions) {
    reactionCounts[r.type as ReactionType]++
  }

  const serializedComments = episode.comments.map(c => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
  }))

  const paragraphs = episode.body.split('\n').filter(Boolean)

  return (
    <div className="pb-32">
      {/* Sticky nav */}
      <div
        className="sticky top-0 z-30 flex items-center gap-3 px-5 py-3.5"
        style={{ backgroundColor: 'rgba(8,9,13,0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        <Link href={`/series/${series.slug}`} className="flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <ChevronLeft size={18} strokeWidth={1.5} />
          <span className="text-[12px] truncate max-w-[120px]">{series.title}</span>
        </Link>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
          <Clock size={11} strokeWidth={1.5} />
          <span className="text-[10px]">{episode.readTime} min</span>
        </div>
      </div>

      {/* Episode header */}
      <div className="px-5 pt-8 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-[9px] font-semibold uppercase tracking-widest"
            style={{ color: 'rgba(166,106,134,0.6)' }}
          >
            Episode {episode.episodeNum}
          </span>
        </div>
        <h1 className="text-white text-[20px] font-bold leading-tight tracking-tight">
          {episode.title}
        </h1>
      </div>

      {/* Body */}
      <div className="px-5 pt-8 pb-10">
        {paragraphs.map((para, i) => (
          <p
            key={i}
            className="text-gray-400 text-[15px] leading-[1.9] mb-6"
            style={{ fontWeight: 400 }}
          >
            {para}
          </p>
        ))}
      </div>

      {/* Reactions */}
      <div
        className="px-5 pb-8 pt-6"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <p className="text-[10px] font-medium text-gray-600 uppercase tracking-widest mb-4">How did this feel?</p>
        <ReactionBar episodeId={episode.id} counts={reactionCounts} />
      </div>

      {/* Prev / Next */}
      <div className="flex gap-2.5 mx-5 mb-10">
        {prev ? (
          <Link
            href={`/series/${series.slug}/${prev.slug}`}
            className="flex-1 flex items-center gap-2 py-3.5 px-4 rounded-2xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <ChevronLeft size={13} color="rgba(255,255,255,0.25)" />
            <div>
              <p className="text-[9px] text-gray-600 uppercase tracking-wide">Prev</p>
              <p className="text-[12px] text-white/70 font-medium truncate max-w-[90px]">{prev.title}</p>
            </div>
          </Link>
        ) : <div className="flex-1" />}

        {next ? (
          <Link
            href={`/series/${series.slug}/${next.slug}`}
            className="flex-1 flex items-center justify-end gap-2 py-3.5 px-4 rounded-2xl"
            style={{ backgroundColor: 'rgba(166,106,134,0.08)', border: '1px solid rgba(166,106,134,0.2)' }}
          >
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-wide" style={{ color: 'rgba(166,106,134,0.5)' }}>Next</p>
              <p className="text-[12px] font-semibold truncate max-w-[90px]" style={{ color: '#A66A86' }}>{next.title}</p>
            </div>
            <ChevronLeft size={13} color="#A66A86" style={{ transform: 'rotate(180deg)' }} />
          </Link>
        ) : (
          <Link
            href={`/series/${series.slug}`}
            className="flex-1 flex items-center justify-end gap-2 py-3.5 px-4 rounded-2xl"
            style={{ backgroundColor: 'rgba(166,106,134,0.08)', border: '1px solid rgba(166,106,134,0.2)' }}
          >
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-wide" style={{ color: 'rgba(166,106,134,0.5)' }}>Back to</p>
              <p className="text-[12px] font-semibold" style={{ color: '#A66A86' }}>Series</p>
            </div>
            <BookOpen size={13} color="#A66A86" />
          </Link>
        )}
      </div>

      {/* Comments */}
      <div
        className="px-5 pt-6"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <CommentsSection episodeId={episode.id} initial={serializedComments} />
      </div>
    </div>
  )
}

async function fetchEpisode(seriesSlug: string, episodeSlug: string) {
  const series = await prisma.eroticaSeries.findUnique({
    where: { slug: seriesSlug, isPublic: true },
    select: {
      id: true, slug: true, title: true,
      episodes: { orderBy: { episodeNum: 'asc' }, select: { id: true, slug: true, episodeNum: true, title: true } },
    },
  })
  if (!series) return null

  const episode = await prisma.eroticaEpisode.findFirst({
    where: { seriesId: series.id, slug: episodeSlug },
    include: {
      reactions: { select: { type: true } },
      comments: {
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: { user: { select: { name: true } } },
      },
    },
  })
  if (!episode) return null

  const idx = series.episodes.findIndex(e => e.id === episode.id)
  return {
    series,
    episode,
    prev: idx > 0 ? series.episodes[idx - 1] : null,
    next: idx < series.episodes.length - 1 ? series.episodes[idx + 1] : null,
  }
}
