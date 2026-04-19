import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getUserFromSession } from '@/lib/userAuth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  const user = await getUserFromSession()
  if (!user) {
    return NextResponse.json({ redirect: '/login?next=checkout' }, { status: 401 })
  }

  const { items } = await request.json() as { items: { id: number; quantity: number }[] }
  if (!items?.length) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
  }

  const ids = items.map(i => i.id)
  const coffees = await sql`
    SELECT id, name, price, stock_quantity
    FROM coffees
    WHERE id = ANY(${ids}) AND is_active = true
  `

  for (const item of items) {
    const coffee = coffees.find(c => Number(c.id) === item.id)
    if (!coffee || Number(coffee.stock_quantity) < item.quantity) {
      return NextResponse.json({ error: `"${coffee?.name ?? 'Item'}" is out of stock` }, { status: 400 })
    }
  }

  const lineItems = items.map(item => {
    const coffee = coffees.find(c => Number(c.id) === item.id)!
    return {
      price_data: {
        currency: 'usd',
        product_data: { name: coffee.name as string },
        unit_amount: Math.round(Number(coffee.price) * 100),
      },
      quantity: item.quantity,
    }
  })

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    ui_mode: 'embedded_page' as const,
    return_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    customer_email: user.email,
    metadata: {
      user_id: String(user.id),
      items: JSON.stringify(items),
    },
  })

  return NextResponse.json({ clientSecret: session.client_secret })
}
