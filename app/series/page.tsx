export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import Header from '@/components/layout/Header'
import { BookOpen, Heart } from 'lucide-react'

const GENRE_COLORS: Record<string, string> = {
  Romance:  '#BF567D',
  Thriller: '#7C3D52',
  Fantasy:  '#593C44',
  Steamy:   '#A0455F',
}

const COVER_IMAGES: Record<string, string> = {
  Romance:  'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400&h=600&fit=crop&q=80',
  Thriller: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&q=80',
  Fantasy:  'https://images.unsplash.com/photo-1472653431158-6364773b2a56?w=400&h=600&fit=crop&q=80',
  Steamy:   'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop&q=80',
}

export default async function SeriesPage() {
  let seriesList: Awaited<ReturnType<typeof fetchSeries>> = []
  try { seriesList = await fetchSeries() } catch (e) { console.error(e) }

  return (
    <div className="pb-28">
      <Header />

      <div className="px-5">
        <div className="mb-7">
          <p className="text-[11px] font-medium text-gray-600 uppercase tracking-widest mb-1">Erotica Series</p>
          <p className="text-[13px] text-gray-600 font-normal">Intimate stories, beautifully told</p>
        </div>

        {seriesList.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 gap-4">
            <BookOpen size={36} color="rgba(255,255,255,0.06)" />
            <p className="text-gray-700 text-[12px]">No series yet. Check back soon.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {seriesList.map(series => {
              const likeCount = series._count.likes
              const episodeCount = series._count.episodes
              const coverImg = series.coverImage ?? COVER_IMAGES[series.genre] ?? COVER_IMAGES.Romance
              const accent = GENRE_COLORS[series.genre] ?? '#BF567D'

              return (
                <Link
                  key={series.id}
                  href={`/series/${series.slug}`}
                  className="flex gap-4 rounded-2xl overflow-hidden p-0"
                  style={{ backgroundColor: '#0e0810' }}
                >
                  {/* Cover thumbnail */}
                  <div className="relative w-[88px] flex-shrink-0 self-stretch">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${coverImg})`, filter: 'brightness(0.5) saturate(0.5)' }}
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent 50%, #0e0810 100%)' }} />
                    {series.isComplete && (
                      <div
                        className="absolute top-2 left-2 text-[8px] font-bold px-1.5 py-[2px] rounded-full"
                        style={{ backgroundColor: accent, color: '#fff' }}
                      >
                        DONE
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 py-4 pr-4">
                    <div
                      className="inline-block text-[9px] font-semibold px-2 py-[3px] rounded-full mb-2 uppercase tracking-wide"
                      style={{ backgroundColor: `${accent}18`, color: accent }}
                    >
                      {series.genre}
                    </div>
                    <h2 className="text-white/90 text-[14px] font-semibold leading-snug mb-1.5">
                      {series.title}
                    </h2>
                    <p className="text-gray-600 text-[11px] leading-relaxed mb-3 line-clamp-2">
                      {series.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <BookOpen size={11} color="rgba(255,255,255,0.2)" />
                        <span className="text-[10px] text-gray-600">{episodeCount} ep</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart size={11} fill="#BF567D" color="#BF567D" />
                        <span className="text-[10px] text-gray-600">{likeCount}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function fetchSeries() {
  return prisma.eroticaSeries.findMany({
    where: { isPublic: true },
    include: { _count: { select: { episodes: true, likes: true } } },
    orderBy: { createdAt: 'desc' },
  })
}
