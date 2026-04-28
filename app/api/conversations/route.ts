export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { guestId } = await req.json()
  if (!guestId) return NextResponse.json({ error: 'guestId required' }, { status: 400 })

  let conversation = await prisma.conversation.findFirst({ where: { guestId } })
  if (!conversation) {
    conversation = await prisma.conversation.create({ data: { guestId } })
  }
  return NextResponse.json({ id: conversation.id })
}
