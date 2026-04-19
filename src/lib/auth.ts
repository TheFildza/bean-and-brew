import { cookies } from 'next/headers'

const COOKIE_NAME = 'bb_admin_session'

export async function setSession() {
  const token = process.env.ADMIN_SESSION_TOKEN
  if (!token) throw new Error('ADMIN_SESSION_TOKEN is not set')
  ;(await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

export async function clearSession() {
  ;(await cookies()).delete(COOKIE_NAME)
}
