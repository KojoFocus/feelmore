import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()
    if (!username?.trim() || !password) return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
    if (password.length < 6) return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })

    const clean = username.trim().toLowerCase()
    const existing = await prisma.user.findUnique({ where: { username: clean } })
    if (existing) return NextResponse.json({ error: 'Username already taken' }, { status: 409 })

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { username: clean, name: username.trim(), passwordHash },
    })

    const res = NextResponse.json({ id: user.id, username: user.username, name: user.name })
    res.cookies.set('fm_user', user.id, { httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 30, path: '/' })
    return res
  } catch (err) {
    console.error('[auth/signup]', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
