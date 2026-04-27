import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const stories = await prisma.story.findMany({
    include: { user: { select: { name: true, email: true } }, _count: { select: { likes: true, comments: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(stories.map(s => ({
    id: s.id, title: s.title, body: s.body, category: s.category, image: s.image,
    isPublic: s.isPublic, createdAt: s.createdAt.toISOString(),
    author: s.user.name ?? s.user.email,
    likes: s._count.likes, comments: s._count.comments,
  })))
}

export async function POST(req: Request) {
  try {
    const { title, body, category, image, isPublic } = await req.json()
    if (!body?.trim()) return NextResponse.json({ error: 'Body required' }, { status: 400 })

    // Find or create a system admin user for Feelmore-authored content
    let adminUser = await prisma.user.findFirst({ where: { email: 'admin@feelmore.app' } })
    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: { email: 'admin@feelmore.app', name: 'Feelmore', password: '' },
      })
    }

    const story = await prisma.story.create({
      data: {
        userId: adminUser.id,
        title: title?.trim() || null,
        body: body.trim(),
        category: category ?? 'TIPS',
        image: image?.trim() || null,
        isPublic: isPublic ?? true,
      },
      include: { user: { select: { name: true, email: true } }, _count: { select: { likes: true, comments: true } } },
    })

    return NextResponse.json({
      id: story.id, title: story.title, body: story.body, category: story.category, image: story.image,
      isPublic: story.isPublic, createdAt: story.createdAt.toISOString(),
      author: story.user.name ?? story.user.email,
      likes: 0, comments: 0,
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
