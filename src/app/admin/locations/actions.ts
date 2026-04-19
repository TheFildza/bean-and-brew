'use server'
import { sql } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createLocationAction(formData: FormData) {
  const name = formData.get('name') as string
  const address = formData.get('address') as string
  const lat = parseFloat(formData.get('lat') as string)
  const lng = parseFloat(formData.get('lng') as string)

  if (!name || !address || isNaN(lat) || isNaN(lng)) return

  await sql`
    INSERT INTO pickup_locations (name, address, lat, lng)
    VALUES (${name}, ${address}, ${lat}, ${lng})
  `
  revalidatePath('/admin/locations')
}

export async function deleteLocationAction(id: number) {
  await sql`DELETE FROM pickup_locations WHERE id = ${id}`
  revalidatePath('/admin/locations')
}

export async function toggleLocationAction(id: number, isActive: boolean) {
  await sql`UPDATE pickup_locations SET is_active = ${isActive} WHERE id = ${id}`
  revalidatePath('/admin/locations')
}
