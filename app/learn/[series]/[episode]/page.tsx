export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ChevronLeft, Clock, ChevronRight } from 'lucide-react'
import EpisodeReader from './EpisodeReader'

export default async function EpisodePage({
  params,
}: {
  params: { series: string; episode: string }
}) {
  let data: Awaited<ReturnType<typeof fetchEpisode>> | null = null
  try { data = await fetchEpisode(params.series, params.episode) } catch (e) { console.error(e) }
  if (!data) return notFound()

  const { series, episode, allEpisodes, featuredProducts } = data
  const currentIdx = allEpisodes.findIndex(e => e.slug === episode.slug)
  const prev = currentIdx > 0 ? allEpisodes[currentIdx - 1] : null
  const next = currentIdx < allEpisodes.length - 1 ? allEpisodes[currentIdx + 1] : null

  return (
    <div style={{ backgroundColor: '#0A080D', minHeight: '100dvh', paddingBottom: 100 }}>
      {/* Nav */}
      <div className="sticky top-0 z-30 flex items-center gap-3 px-5 py-3.5"
        style={{ backgroundColor: 'rgba(10,8,13,0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <Link href="/learn" className="flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <ChevronLeft size={18} strokeWidth={1.5} />
          <span style={{ fontSize: 12 }}>Series</span>
        </Link>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
            {currentIdx + 1} of {allEpisodes.length}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={11} color="rgba(255,255,255,0.3)" strokeWidth={1.5} />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{episode.readTime} min</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, backgroundColor: 'rgba(255,255,255,0.04)' }}>
        <div style={{
          height: '100%',
          width: `${((currentIdx + 1) / allEpisodes.length) * 100}%`,
          backgroundColor: '#A66A86',
          transition: 'width 0.3s ease',
        }} />
      </div>

      <div style={{ padding: '28px 24px 0' }}>
        {/* Series label */}
        <p style={{ fontSize: 10, fontWeight: 600, color: '#A66A86', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
          {series.title} — Episode {episode.episodeNum}
        </p>

        {/* Title */}
        <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 26, fontWeight: 600, color: '#fff', lineHeight: 1.3, marginBottom: 24 }}>
          {episode.title}
        </h1>

        {/* Episode dots */}
        <div className="flex gap-1.5 mb-8">
          {allEpisodes.map((ep, i) => (
            <Link key={ep.slug} href={`/learn/${series.slug}/${ep.slug}`}>
              <div style={{
                width: i === currentIdx ? 20 : 6,
                height: 6,
                borderRadius: 999,
                backgroundColor: i === currentIdx ? '#A66A86' : i < currentIdx ? 'rgba(166,106,134,0.4)' : 'rgba(255,255,255,0.1)',
                transition: 'all 0.2s ease',
              }} />
            </Link>
          ))}
        </div>

        {/* Body */}
        <EpisodeReader body={episode.body} />

        {/* Tools for this chapter */}
        {featuredProducts.length > 0 && (
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: '#A66A86', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
              Tools for this chapter
            </p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 20 }}>
              What this episode pairs well with.
            </p>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {featuredProducts.map(p => (
                <Link key={p.id} href={`/shop/${p.slug}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
                  <div style={{ width: 130, backgroundColor: '#F0EDE9', borderRadius: 16, overflow: 'hidden' }}>
                    <div style={{ height: 100, backgroundColor: '#e8e4e0' }} />
                    <div style={{ padding: '8px 10px 10px' }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: '#1A1A1A', marginBottom: 2 }}>{p.name}</p>
                      <p style={{ fontSize: 10, color: '#A66A86', fontWeight: 700 }}>{p.currency} {Number(p.price).toLocaleString()}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Prev / Next */}
        <div className="flex gap-3 mt-10 pb-8">
          {prev ? (
            <Link href={`/learn/${series.slug}/${prev.slug}`} style={{ flex: 1, textDecoration: 'none' }}>
              <div className="rounded-2xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>Previous</p>
                <p style={{ fontSize: 12, color: '#fff', lineHeight: 1.4 }}>{prev.title}</p>
              </div>
            </Link>
          ) : <div style={{ flex: 1 }} />}

          {next && (
            <Link href={`/learn/${series.slug}/${next.slug}`} style={{ flex: 1, textDecoration: 'none' }}>
              <div className="rounded-2xl p-4 text-right" style={{ backgroundColor: 'rgba(166,106,134,0.08)', border: '1px solid rgba(166,106,134,0.15)' }}>
                <p style={{ fontSize: 9, color: '#A66A86', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>Next</p>
                <p style={{ fontSize: 12, color: '#fff', lineHeight: 1.4 }}>{next.title}</p>
                <ChevronRight size={14} color="#A66A86" style={{ marginLeft: 'auto', marginTop: 4 }} />
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

async function fetchEpisode(seriesSlug: string, episodeSlug: string) {
  const series = await prisma.eroticaSeries.findUnique({
    where: { slug: seriesSlug, isPublic: true },
    include: {
      episodes: { orderBy: { episodeNum: 'asc' }, select: { slug: true, title: true, episodeNum: true } },
    },
  })
  if (!series) return null

  const episode = await prisma.eroticaEpisode.findUnique({
    where: { seriesId_slug: { seriesId: series.id, slug: episodeSlug } },
  })
  if (!episode) return null

  const featuredProducts = await prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    take: 3,
    select: { id: true, name: true, slug: true, price: true, currency: true },
  })

  return { series, episode, allEpisodes: series.episodes, featuredProducts }
}
