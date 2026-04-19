'use server'
import { hash, compare } from 'bcryptjs'
import { redirect } from 'next/navigation'
import { sql } from '@/lib/db'
import { setUserSession, clearUserSession } from '@/lib/userAuth'

export async function registerAction(formData: FormData) {
  const name = formData.get('name') as string
  const email = (formData.get('email') as string).toLowerCase().trim()
  const password = formData.get('password') as string

  if (!email || !password || password.length < 6)
    return redirect('/register?error=invalid')

  const existing = await sql`SELECT id FROM users WHERE email = ${email}`
  if (existing.length > 0) return redirect('/register?error=exists')

  const password_hash = await hash(password, 12)
  const rows = await sql`
    INSERT INTO users (email, password_hash, name)
    VALUES (${email}, ${password_hash}, ${name || null})
    RETURNING id
  `
  await setUserSession(rows[0].id as number)
  redirect('/')
}

export async function loginUserAction(formData: FormData) {
  const email = (formData.get('email') as string).toLowerCase().trim()
  const password = formData.get('password') as string
  const next = (formData.get('next') as string) || '/'

  const rows = await sql`SELECT id, password_hash FROM users WHERE email = ${email}`
  if (!rows[0]) return redirect(`/login?error=1&next=${encodeURIComponent(next)}`)

  const valid = await compare(password, rows[0].password_hash as string)
  if (!valid) return redirect(`/login?error=1&next=${encodeURIComponent(next)}`)

  await setUserSession(rows[0].id as number)
  redirect(next)
}

export async function logoutUserAction() {
  await clearUserSession()
  redirect('/')
}
