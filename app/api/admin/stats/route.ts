import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [users, products, orders, stories, revenue] = await Promise.all([
      prisma.user.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.story.count({ where: { isPublic: true } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } },
      }),
    ])

    // conversation table may not exist until db:push is run
    const conversations: number = await (prisma as any).conversation?.count().catch(() => 0) ?? 0

    const pendingOrders = await prisma.order.count({ where: { status: 'PENDING' } })
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    })

    return NextResponse.json({
      users, products, orders, stories, conversations, pendingOrders,
      revenue: Number(revenue._sum.total ?? 0),
      recentOrders: recentOrders.map(o => ({
        id: o.id, status: o.status, total: Number(o.total),
        currency: o.currency, user: o.user.name ?? o.user.email,
        createdAt: o.createdAt.toISOString(),
      })),
    })
  } catch (err) {
    console.error('[admin/stats]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
