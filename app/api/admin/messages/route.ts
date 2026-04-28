export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const conversations = await (prisma as any).conversation.findMany({
      include: {
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
        _count: { select: { messages: true } },
      },
      orderBy: { updatedAt: 'desc' },
    })
    return NextResponse.json(conversations.map((c: any) => ({
      id: c.id, guestId: c.guestId,
      lastMessage: c.messages[0] ? {
        body: c.messages[0].body,
        type: c.messages[0].type,
        isFromAdmin: c.messages[0].isFromAdmin,
        createdAt: c.messages[0].createdAt.toISOString(),
      } : null,
      messageCount: c._count.messages,
      updatedAt: c.updatedAt.toISOString(),
    })))
  } catch (err) {
    console.error('[admin/messages]', err)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: Request) {
  try {
    const { conversationId, body, type, mediaUrl, mimeType, duration } = await req.json()
    const message = await (prisma as any).message.create({
      data: { conversationId, body, type: type ?? 'TEXT', mediaUrl, mimeType, duration, isFromAdmin: true },
    })
    await (prisma as any).conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } })
    return NextResponse.json({ ...message, createdAt: message.createdAt.toISOString() })
  } catch (err) {
    console.error('[admin/messages POST]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
