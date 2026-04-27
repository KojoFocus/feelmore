import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const users = await prisma.user.findMany({
    include: { _count: { select: { orders: true, stories: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(users.map(u => ({
    id: u.id, name: u.name, email: u.email, role: u.role,
    verified: u.verified, createdAt: u.createdAt.toISOString(),
    orders: u._count.orders, stories: u._count.stories,
  })))
}
