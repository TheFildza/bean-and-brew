import { cookies } from 'next/headers'
import { randomBytes } from 'crypto'
import { sql } from '@/lib/db'

const COOKIE_NAME = 'bb_user_session'
const SESSION_DAYS = 7

export interface SessionUser {
  id: number
  email: string
  name: string | null
}

export async function getUserFromSession(): Promise<SessionUser | null> {
  try {
    const store = await cookies()
    const token = store.get(COOKIE_NAME)?.value
    if (!token) return null

    const rows = await sql`
      SELECT id, email, name FROM users
      WHERE session_token = ${token}
      AND session_expires_at > NOW()
    `
    return (rows[0] as SessionUser) ?? null
  } catch {
    return null
  }
}

export async function setUserSession(userId: number) {
  const token = randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000)

  await sql`
    UPDATE users
    SET session_token = ${token}, session_expires_at = ${expires.toISOString()}
    WHERE id = ${userId}
  `

  ;(await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
    path: '/',
  })
}

export async function clearUserSession() {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  if (token) {
    await sql`UPDATE users SET session_token = NULL, session_expires_at = NULL WHERE session_token = ${token}`
  }
  store.delete(COOKIE_NAME)
}
