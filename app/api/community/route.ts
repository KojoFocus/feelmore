export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const posts = await prisma.story.findMany({
    where: { isPublic: true, category: 'REAL_TALK' },
    include: {
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 30,
  })
  return NextResponse.json(posts)
}

export async function POST(req: Request) {
  try {
    const userId = cookies().get('fm_user')?.value
    const { body, anonymous } = await req.json()

    if (!body?.trim()) return NextResponse.json({ error: 'Post cannot be empty' }, { status: 400 })

    const guestId = `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`

    let authorId = userId
    if (!authorId || anonymous) {
      const guest = await prisma.user.create({
        data: { email: `${guestId}@feelmore.internal`, name: 'Anonymous' },
      })
      authorId = guest.id
    }

    const post = await prisma.story.create({
      data: {
        userId: authorId,
        category: 'REAL_TALK',
        body: body.trim(),
        isPublic: false, // goes to moderation queue
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (err) {
    console.error('[api/community]', err)
    return NextResponse.json({ error: 'Failed to post' }, { status: 500 })
  }
}
