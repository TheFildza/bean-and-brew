'use server'
import { compare } from 'bcryptjs'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { sql } from '@/lib/db'
import { setSession, clearSession } from '@/lib/auth'

export async function loginAction(formData: FormData) {
  const password = formData.get('password') as string
  const hash = process.env.ADMIN_PASSWORD_HASH

  if (!hash || !password) return redirect('/admin/login?error=1')

  const valid = await compare(password, hash)
  if (!valid) return redirect('/admin/login?error=1')

  await setSession()
  redirect('/admin')
}

export async function logoutAction() {
  await clearSession()
  redirect('/admin/login')
}

export async function createCoffeeAction(formData: FormData) {
  const name = formData.get('name') as string
  const origin = formData.get('origin') as string
  const roast_level = formData.get('roast_level') as string
  const price = parseFloat(formData.get('price') as string)
  const stock_quantity = parseInt(formData.get('stock_quantity') as string, 10)
  const notes = formData.get('notes') as string
  const description = formData.get('description') as string
  const image_url = (formData.get('image_url') as string) || null
  const is_active = formData.get('is_active') === 'on'

  await sql`
    INSERT INTO coffees (name, origin, roast_level, price, stock_quantity, notes, description, image_url, is_active)
    VALUES (${name}, ${origin}, ${roast_level}, ${price}, ${stock_quantity}, ${notes}, ${description}, ${image_url}, ${is_active})
  `
  revalidatePath('/admin')
  revalidatePath('/')
  redirect('/admin')
}

export async function updateCoffeeAction(id: number, formData: FormData) {
  const name = formData.get('name') as string
  const origin = formData.get('origin') as string
  const roast_level = formData.get('roast_level') as string
  const price = parseFloat(formData.get('price') as string)
  const stock_quantity = parseInt(formData.get('stock_quantity') as string, 10)
  const notes = formData.get('notes') as string
  const description = formData.get('description') as string
  const image_url = (formData.get('image_url') as string) || null
  const is_active = formData.get('is_active') === 'on'

  await sql`
    UPDATE coffees
    SET name=${name}, origin=${origin}, roast_level=${roast_level}, price=${price},
        stock_quantity=${stock_quantity}, notes=${notes}, description=${description},
        image_url=${image_url}, is_active=${is_active}
    WHERE id=${id}
  `
  revalidatePath('/admin')
  revalidatePath('/')
  redirect('/admin')
}

export async function deleteCoffeeAction(id: number) {
  await sql`DELETE FROM coffees WHERE id=${id}`
  revalidatePath('/admin')
  revalidatePath('/')
}
