export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json()
  const series = await prisma.eroticaSeries.update({ where: { id: params.id }, data })
  return NextResponse.json({ id: series.id, isPublic: series.isPublic, isComplete: series.isComplete })
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.eroticaSeries.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
