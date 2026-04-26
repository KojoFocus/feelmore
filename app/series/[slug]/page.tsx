export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ChevronLeft, BookOpen, Clock, Heart, Check } from 'lucide-react'

const COVER_IMAGES: Record<string, string> = {
  Romance:  'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=600&h=900&fit=crop&q=80',
  Thriller: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=900&fit=crop&q=80',
  Fantasy:  'https://images.unsplash.com/photo-1472653431158-6364773b2a56?w=600&h=900&fit=crop&q=80',
  Steamy:   'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=900&fit=crop&q=80',
}

const GENRE_COLORS: Record<string, string> = {
  Romance:  '#A66A86',
  Thriller: '#A66A86',
  Fantasy:  '#A66A86',
  Steamy:   '#A66A86',
}

export default async function SeriesDetailPage({ params }: { params: { slug: string } }) {
  let series: Awaited<ReturnType<typeof fetchSeries>> | null = null
  try { series = await fetchSeries(params.slug) } catch (e) { console.error(e) }
  if (!series) return notFound()

  const coverImg = series.coverImage ?? COVER_IMAGES[series.genre] ?? COVER_IMAGES.Romance
  const accent = GENRE_COLORS[series.genre] ?? '#A66A86'

  return (
    <div className="pb-28">
      {/* Hero */}
      <div className="relative h-[300px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${coverImg})`, filter: 'brightness(0.3) saturate(0.4)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(8,9,13,0.2) 0%, rgba(8,9,13,1) 100%)' }} />

        <Link
          href="/series"
          className="absolute top-12 left-5 flex items-center gap-1 z-10"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          <ChevronLeft size={18} strokeWidth={1.5} />
          <span className="text-[12px]">Series</span>
        </Link>

        <div className="absolute bottom-6 left-5 right-5 z-10">
          <div
            className="inline-block text-[9px] font-bold px-2 py-[3px] rounded-full mb-3 uppercase tracking-wide"
            style={{ backgroundColor: `${accent}25`, color: accent }}
          >
            {series.genre}
          </div>
          <h1 className="text-white text-[22px] font-bold leading-tight tracking-tight mb-1">
            {series.title}
          </h1>
          <p className="text-[12px] text-gray-500">by {series.author.name ?? 'Anonymous'}</p>
        </div>
      </div>

      {/* Stats */}
      <div
        className="flex items-center gap-5 px-5 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="flex items-center gap-1.5">
          <BookOpen size={13} color={accent} strokeWidth={1.5} />
          <span className="text-[12px] text-gray-500">{series._count.episodes} episodes</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Heart size={13} fill={accent} color={accent} />
          <span className="text-[12px] text-gray-500">{series._count.likes} likes</span>
        </div>
        {series.isComplete && (
          <div className="flex items-center gap-1.5">
            <Check size={13} color="#4ade80" strokeWidth={1.5} />
            <span className="text-[12px] text-gray-500">Complete</span>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="px-5 py-6">
        <p className="text-[13px] text-gray-500 leading-relaxed">{series.description}</p>
      </div>

      {/* Episodes */}
      <div className="px-5">
        <p className="text-[11px] font-medium text-gray-600 uppercase tracking-widest mb-4">Episodes</p>
        <div className="flex flex-col gap-2">
          {series.episodes.map((ep, i) => (
            <Link
              key={ep.id}
              href={`/series/${series!.slug}/${ep.slug}`}
              className="flex items-center gap-4 p-4 rounded-2xl"
              style={{ backgroundColor: '#0e0810' }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-[12px] font-semibold"
                style={{
                  backgroundColor: i === 0 ? accent : 'rgba(255,255,255,0.04)',
                  color: i === 0 ? '#fff' : 'rgba(255,255,255,0.3)',
                }}
              >
                {ep.episodeNum}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white/85 text-[13px] font-medium truncate">{ep.title}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <div className="flex items-center gap-1">
                    <Clock size={10} color="rgba(255,255,255,0.2)" />
                    <span className="text-[10px] text-gray-600">{ep.readTime} min</span>
                  </div>
                  {ep._count.reactions > 0 && (
                    <span className="text-[10px] text-gray-600">{ep._count.reactions} reactions</span>
                  )}
                </div>
              </div>

              <ChevronLeft size={14} color="rgba(255,255,255,0.15)" style={{ transform: 'rotate(180deg)' }} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

async function fetchSeries(slug: string) {
  return prisma.eroticaSeries.findUnique({
    where: { slug, isPublic: true },
    include: {
      author: { select: { name: true } },
      _count: { select: { likes: true, episodes: true } },
      episodes: {
        orderBy: { episodeNum: 'asc' },
        include: { _count: { select: { reactions: true, comments: true } } },
      },
    },
  })
}
