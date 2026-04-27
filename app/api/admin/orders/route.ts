import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: { select: { name: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(orders.map(o => ({
    id: o.id, status: o.status, total: Number(o.total), currency: o.currency,
    paymentMethod: o.paymentMethod, paymentRef: o.paymentRef, notes: o.notes,
    createdAt: o.createdAt.toISOString(),
    user: o.user.name ?? o.user.email,
    items: o.items.map(i => ({ product: i.product.name, quantity: i.quantity, price: Number(i.price) })),
  })))
}
