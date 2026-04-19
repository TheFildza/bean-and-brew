export const dynamic = 'force-dynamic'
import { sql } from '@/lib/db'
import { AdminLocationControls } from './AdminLocationControls'

interface Location {
  id: number
  name: string
  address: string
  lat: number
  lng: number
  is_active: boolean
}

export default async function LocationsPage() {
  const rows = await sql`SELECT * FROM pickup_locations ORDER BY id`
  const locations = rows as unknown as Location[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-[#1A120B]">Pickup Locations</h1>
      </div>

      <AdminLocationControls locations={locations} />
    </div>
  )
}
