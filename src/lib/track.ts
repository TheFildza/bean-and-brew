import { sql } from './db'
import { getUserFromSession } from './userAuth'

export async function track(name: string, properties?: Record<string, unknown>) {
  try {
    const user = await getUserFromSession()
    await sql`
      INSERT INTO events (name, properties, user_id)
      VALUES (${name}, ${JSON.stringify(properties ?? {})}::jsonb, ${user?.id ?? null})
    `
  } catch {
    // never block request flow on analytics failure
  }
}
