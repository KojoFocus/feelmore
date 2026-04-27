import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { images: true, variants: true, category: true },
  })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ...product, price: Number(product.price) })
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()
  const product = await prisma.product.update({
    where: { id: params.id },
    data: {
      name: body.name, slug: body.slug, description: body.description,
      price: body.price, stock: body.stock, currency: body.currency,
      tagline: body.tagline, badge: body.badge,
      isFeatured: body.isFeatured, isBestseller: body.isBestseller,
      isActive: body.isActive,
    },
  })
  return NextResponse.json({ ...product, price: Number(product.price) })
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.product.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
