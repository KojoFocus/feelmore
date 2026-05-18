export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()
    if (!username || !password) return NextResponse.json({ error: 'Username and password required' }, { status: 400 })

    const fakeEmail = `${username.trim().toLowerCase()}@feelmore.internal`
    const user = await prisma.user.findUnique({ where: { email: fakeEmail } })
    if (!user || !user.passwordHash) return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })

    const res = NextResponse.json({ id: user.id, username: username.trim().toLowerCase(), name: user.name, onboardingDone: user.onboardingDone })
    res.cookies.set('fm_user', user.id, { httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 30, path: '/' })
    return res
  } catch (err) {
    console.error('[auth/login]', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set('fm_user', '', { maxAge: 0, path: '/' })
  return res
}
