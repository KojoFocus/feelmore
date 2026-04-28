export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const products = await prisma.product.findMany({
    include: { images: { where: { isPrimary: true }, take: 1 }, category: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(products.map(p => ({
    id: p.id, name: p.name, slug: p.slug,
    price: Number(p.price), currency: p.currency,
    stock: p.stock, isActive: p.isActive, isFeatured: p.isFeatured,
    isBestseller: p.isBestseller, badge: p.badge, tagline: p.tagline,
    category: p.category.name,
    image: p.images[0]?.url ?? null,
  })))
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name, slug, description, price, stock, currency, categoryId,
    tagline, badge, isFeatured, isBestseller, isActive, imageUrl } = body

  const product = await prisma.product.create({
    data: {
      name, slug, description, price, stock: stock ?? 0,
      currency: currency ?? 'GHS', categoryId,
      tagline, badge,
      isFeatured: isFeatured ?? false,
      isBestseller: isBestseller ?? false,
      isActive: isActive ?? true,
      ...(imageUrl ? { images: { create: { url: imageUrl, isPrimary: true } } } : {}),
    },
  })
  return NextResponse.json(product)
}
