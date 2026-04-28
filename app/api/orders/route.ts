export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const userId = cookies().get('fm_user')?.value
    if (!userId) return NextResponse.json([], { status: 401 })
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: { select: { name: true, images: { where: { isPrimary: true }, take: 1 } } } } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(orders.map(o => ({
      id: o.id, status: o.status, total: Number(o.total), currency: o.currency,
      createdAt: o.createdAt.toISOString(),
      items: o.items.map(i => ({
        name: i.product.name,
        image: i.product.images[0]?.url ?? null,
        qty: i.quantity,
        price: Number(i.price),
      })),
    })))
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
