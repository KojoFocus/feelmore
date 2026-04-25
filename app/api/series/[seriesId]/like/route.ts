import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

async function getDemoUserId() {
  const u = await prisma.user.findFirst({ where: { email: 'ama@example.com' } })
  return u?.id ?? null
}

export async function POST(
  req: NextRequest,
  { params }: { params: { seriesId: string } }
) {
  try {
    const userId = await getDemoUserId()
    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const seriesId = params.seriesId

    const existing = await prisma.eroticaSeriesLike.findUnique({
      where: { seriesId_userId: { seriesId, userId } },
    })

    if (existing) {
      await prisma.eroticaSeriesLike.delete({
        where: { seriesId_userId: { seriesId, userId } },
      })
      return NextResponse.json({ action: 'unliked' })
    } else {
      await prisma.eroticaSeriesLike.create({
        data: { seriesId, userId },
      })
      return NextResponse.json({ action: 'liked' })
    }
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
