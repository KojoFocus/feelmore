export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        orders: {
          include: { items: { include: { product: { select: { name: true } } } } },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        stories: { select: { id: true, title: true, category: true, createdAt: true, isPublic: true }, orderBy: { createdAt: 'desc' } },
        _count: { select: { orders: true, stories: true, wishlist: true } },
      },
    })
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Find or create a direct conversation for this user
    const convId = `admin_user_${user.id}`
    let conv = await (prisma as any).conversation.findFirst({ where: { guestId: convId } })
    if (!conv) {
      conv = await (prisma as any).conversation.create({ data: { guestId: convId } })
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      verified: user.verified,
      createdAt: user.createdAt.toISOString(),
      counts: user._count,
      conversationId: conv.id,
      orders: user.orders.map(o => ({
        id: o.id, status: o.status, total: Number(o.total), currency: o.currency,
        createdAt: o.createdAt.toISOString(),
        items: o.items.map(i => ({ name: i.product.name, qty: i.quantity, price: Number(i.price) })),
      })),
      stories: user.stories.map(s => ({
        id: s.id, title: s.title, category: s.category,
        isPublic: s.isPublic, createdAt: s.createdAt.toISOString(),
      })),
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
