import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    if (session.payment_status !== 'paid') return NextResponse.json({ received: true })

    const userId = parseInt(session.metadata!.user_id)
    const items: { id: number; quantity: number }[] = JSON.parse(session.metadata!.items)
    const totalAmount = (session.amount_total ?? 0) / 100

    const existing = await sql`SELECT id FROM orders WHERE stripe_session_id = ${session.id}`
    if (existing.length > 0) return NextResponse.json({ received: true })

    const orderRows = await sql`
      INSERT INTO orders (user_id, stripe_session_id, stripe_payment_intent, status, total_amount)
      VALUES (${userId}, ${session.id}, ${session.payment_intent as string ?? null}, 'paid', ${totalAmount})
      RETURNING id
    `
    const orderId = orderRows[0].id as number

    for (const item of items) {
      const rows = await sql`SELECT id, name, price FROM coffees WHERE id = ${item.id}`
      const coffee = rows[0]
      if (!coffee) continue

      await sql`
        INSERT INTO order_items (order_id, coffee_id, name, price, quantity)
        VALUES (${orderId}, ${item.id}, ${coffee.name as string}, ${coffee.price as number}, ${item.quantity})
      `
      await sql`
        UPDATE coffees
        SET stock_quantity = GREATEST(0, stock_quantity - ${item.quantity})
        WHERE id = ${item.id}
      `
    }
  }

  return NextResponse.json({ received: true })
}
