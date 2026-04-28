export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const userId = cookies().get('fm_user')?.value
    if (!userId) return NextResponse.json([], { status: 401 })
    const stories = await prisma.story.findMany({
      where: { userId },
      select: {
        id: true, title: true, body: true, category: true,
        isPublic: true, createdAt: true,
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(stories.map(s => ({
      id: s.id, title: s.title, body: s.body, category: s.category,
      isPublic: s.isPublic, createdAt: s.createdAt.toISOString(),
      likes: s._count.likes, comments: s._count.comments,
    })))
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
