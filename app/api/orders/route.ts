export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const userId = cookies().get('fm_user')?.value
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { items, total, currency } = await req.json()
    if (!items?.length) return NextResponse.json({ error: 'No items' }, { status: 400 })

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        currency: currency ?? 'GHS',
        status: 'PENDING',
        items: {
          create: items.map((i: { productId: string; price: number; qty: number }) => ({
            productId: i.productId,
            price: i.price,
            quantity: i.qty,
          })),
        },
      },
    })
    return NextResponse.json({ id: order.id })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function GET() {
  try {
    const userId = cookies().get('fm_user')?.value
    if (!userId) return NextResponse.json([], { status: 401 })
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: { select: { name: true, slug: true, images: { orderBy: [{ isPrimary: 'desc' }], take: 1 } } } } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(orders.map(o => ({
      id: o.id, status: o.status, total: Number(o.total), currency: o.currency,
      createdAt: o.createdAt.toISOString(),
      items: o.items.map(i => ({
        name: i.product.name,
        slug: i.product.slug,
        image: i.product.images[0]?.url ?? null,
        qty: i.quantity,
        price: Number(i.price),
      })),
    })))
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
