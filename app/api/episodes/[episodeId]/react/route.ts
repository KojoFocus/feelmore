export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const VALID_TYPES = ['FIRE', 'HEART', 'SHOCKED', 'CLAP']

async function getDemoUserId() {
  const u = await prisma.user.findFirst({ where: { email: 'ama@example.com' } })
  return u?.id ?? null
}

export async function POST(
  req: NextRequest,
  { params }: { params: { episodeId: string } }
) {
  try {
    const { type } = await req.json()
    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: 'Invalid reaction type' }, { status: 400 })
    }

    const userId = await getDemoUserId()
    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const episodeId = params.episodeId

    const existing = await prisma.eroticaReaction.findUnique({
      where: { episodeId_userId_type: { episodeId, userId, type } },
    })

    if (existing) {
      await prisma.eroticaReaction.delete({
        where: { episodeId_userId_type: { episodeId, userId, type } },
      })
      return NextResponse.json({ action: 'removed', type })
    } else {
      await prisma.eroticaReaction.create({
        data: { episodeId, userId, type },
      })
      return NextResponse.json({ action: 'added', type })
    }
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
