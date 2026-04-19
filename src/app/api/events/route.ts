import { NextRequest, NextResponse } from 'next/server'
import { track } from '@/lib/track'

const ALLOWED = new Set([
  'add_to_cart',
  'checkout_started',
  'sommelier_opened',
  'sommelier_recommendation_added',
])

export async function POST(request: NextRequest) {
  const { name, properties } = await request.json()
  if (!ALLOWED.has(name)) return NextResponse.json({ ok: false }, { status: 400 })
  await track(name, properties)
  return NextResponse.json({ ok: true })
}
