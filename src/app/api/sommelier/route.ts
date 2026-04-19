import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  const { messages } = await request.json() as {
    messages: { role: 'user' | 'assistant'; content: string }[]
  }

  const coffees = await sql`
    SELECT id, name, origin, roast_level, price, notes, description
    FROM coffees
    WHERE COALESCE(is_active, true) = true AND COALESCE(stock_quantity, 0) > 0
    ORDER BY id
  `

  const catalog = coffees.map(c =>
    `ID: ${c.id} | ${c.name} | Origin: ${c.origin} | Roast: ${c.roast_level} | Price: $${c.price} | Notes: ${c.notes ?? 'N/A'} | ${c.description}`
  ).join('\n')

  const systemPrompt = `You are the B & B coffee sommelier — a knowledgeable, warm, and concise virtual barista. Help customers find their perfect coffee based on taste preferences, brewing habits, or mood.

Available coffees in stock:
${catalog}

Rules:
- Keep responses short and conversational (2-4 sentences max).
- Ask follow-up questions to narrow down preferences if needed.
- When you have a clear recommendation, end your message with a JSON block on the last line in this exact format (nothing after it):
  {"recommend":{"id":<number>,"name":"<name>"}}
- Only recommend coffees from the list above. Never recommend out-of-stock items.
- If no coffee fits, say so honestly and suggest what to look for next time.
- Do not mention the JSON to the user — it is invisible to them.`

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    system: systemPrompt,
    messages,
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text : ''

  const jsonMatch = raw.match(/\{"recommend":\{.*?\}\}$/)
  let recommendation: { id: number; name: string; origin: string; price: number; image_url: string | null } | null = null
  let message = raw

  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0])
      const coffee = coffees.find(c => Number(c.id) === parsed.recommend.id)
      if (coffee) {
        recommendation = {
          id: Number(coffee.id),
          name: coffee.name as string,
          origin: coffee.origin as string,
          price: Number(coffee.price),
          image_url: coffee.image_url as string | null,
        }
      }
      message = raw.slice(0, raw.lastIndexOf(jsonMatch[0])).trimEnd()
    } catch {
      // ignore parse errors, return full message
    }
  }

  return NextResponse.json({ message, recommendation })
}
