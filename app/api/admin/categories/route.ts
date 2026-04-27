import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DEFAULT_CATEGORIES = [
  { name: 'Sex Toys', slug: 'sex-toys', description: 'Vibrators, dildos, massagers and more' },
  { name: 'Lingerie', slug: 'lingerie', description: 'Sexy lingerie and intimate wear' },
  { name: 'Lubricants', slug: 'lubricants', description: 'Water-based, silicone, and warming lubes' },
  { name: 'Couples Play', slug: 'couples-play', description: 'Games, toys and accessories for couples' },
  { name: 'Accessories', slug: 'accessories', description: 'Cleaners, pouches and care accessories' },
  { name: 'Wellness', slug: 'wellness', description: 'Self-care and intimate wellness products' },
]

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } },
  })
  return NextResponse.json(categories)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (body.seed) {
      let count = 0
      for (const cat of DEFAULT_CATEGORIES) {
        const existing = await prisma.category.findUnique({ where: { slug: cat.slug } })
        if (!existing) { await prisma.category.create({ data: cat }); count++ }
      }
      return NextResponse.json({ message: `Created ${count} new categories` })
    }

    const { name, slug, description } = body
    if (!name?.trim() || !slug?.trim()) return NextResponse.json({ error: 'Name and slug required' }, { status: 400 })
    const category = await prisma.category.create({ data: { name: name.trim(), slug: slug.trim(), description: description?.trim() || null } })
    return NextResponse.json(category)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
