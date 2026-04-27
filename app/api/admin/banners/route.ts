import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const banners = await prisma.banner.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(banners)
}

export async function POST(req: Request) {
  const { title, subtitle, image, link, isActive, order } = await req.json()
  const banner = await prisma.banner.create({
    data: { title, subtitle, image, link, isActive: isActive ?? true, order: order ?? 0 },
  })
  return NextResponse.json(banner, { status: 201 })
}
