import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json()
  const banner = await prisma.banner.update({ where: { id: params.id }, data })
  return NextResponse.json(banner)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.banner.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
