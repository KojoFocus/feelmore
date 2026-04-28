export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const userId = cookies().get('fm_user')?.value
    if (!userId) return NextResponse.json([], { status: 401 })
    const items = await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: { images: { orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }], take: 1 }, category: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(items.map(i => ({
      id: i.id,
      product: {
        id: i.product.id, name: i.product.name, slug: i.product.slug,
        price: Number(i.product.price), currency: i.product.currency,
        category: i.product.category.name,
        image: i.product.images[0]?.url ?? null,
        isActive: i.product.isActive,
      },
    })))
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const userId = cookies().get('fm_user')?.value
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { productId } = await req.json()
    const existing = await prisma.wishlistItem.findUnique({ where: { userId_productId: { userId, productId } } })
    if (existing) {
      await prisma.wishlistItem.delete({ where: { userId_productId: { userId, productId } } })
      return NextResponse.json({ wishlisted: false })
    }
    await prisma.wishlistItem.create({ data: { userId, productId } })
    return NextResponse.json({ wishlisted: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
