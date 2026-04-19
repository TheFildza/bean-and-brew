import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  const rows = await sql`
    SELECT id, name, address, lat, lng
    FROM pickup_locations
    WHERE is_active = true
    ORDER BY name
  `
  return NextResponse.json(rows)
}
