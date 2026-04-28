export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()
  const story = await prisma.story.update({
    where: { id: params.id },
    data: { isPublic: body.isPublic },
  })
  return NextResponse.json({ ok: true, isPublic: story.isPublic })
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.story.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
