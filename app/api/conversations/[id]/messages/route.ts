export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const messages = await prisma.message.findMany({
    where: { conversationId: params.id },
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json(messages.map(m => ({ ...m, createdAt: m.createdAt.toISOString() })))
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { type, body, mediaUrl, mimeType, duration } = await req.json()
  const message = await prisma.message.create({
    data: {
      conversationId: params.id,
      type: type ?? 'TEXT',
      body, mediaUrl, mimeType,
      duration: duration ? Number(duration) : null,
      isFromAdmin: false,
    },
  })
  await prisma.conversation.update({ where: { id: params.id }, data: { updatedAt: new Date() } })
  return NextResponse.json({ ...message, createdAt: message.createdAt.toISOString() })
}
