export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const series = await prisma.eroticaSeries.findMany({
    include: {
      author: { select: { name: true, email: true } },
      _count: { select: { episodes: true, likes: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(series.map(s => ({
    id: s.id, title: s.title, slug: s.slug, genre: s.genre,
    isPublic: s.isPublic, isComplete: s.isComplete,
    coverImage: s.coverImage,
    author: s.author.name ?? s.author.email,
    episodes: s._count.episodes,
    likes: s._count.likes,
    createdAt: s.createdAt.toISOString(),
  })))
}
