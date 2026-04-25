import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

async function getDemoUserId() {
  const u = await prisma.user.findFirst({ where: { email: 'ama@example.com' } })
  return u?.id ?? null
}

export async function POST(
  req: NextRequest,
  { params }: { params: { episodeId: string } }
) {
  try {
    const { body } = await req.json()
    if (!body?.trim()) {
      return NextResponse.json({ error: 'Comment body required' }, { status: 400 })
    }

    const userId = await getDemoUserId()
    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const comment = await prisma.eroticaComment.create({
      data: {
        episodeId: params.episodeId,
        userId,
        body: body.trim(),
      },
      include: { user: { select: { name: true } } },
    })

    return NextResponse.json({
      id: comment.id,
      body: comment.body,
      createdAt: comment.createdAt.toISOString(),
      user: comment.user,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
