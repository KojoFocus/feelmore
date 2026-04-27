import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const userId = cookies().get('fm_user')?.value
    if (!userId) return NextResponse.json(null)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, avatar: true, role: true, createdAt: true },
    })
    return NextResponse.json(user)
  } catch {
    return NextResponse.json(null)
  }
}
