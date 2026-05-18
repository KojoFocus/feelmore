export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const userId = cookies().get('fm_user')?.value
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { preferences } = await req.json()

    await prisma.user.update({
      where: { id: userId },
      data: { preferences: preferences ?? [], onboardingDone: true },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[api/onboarding]', err)
    return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 })
  }
}
