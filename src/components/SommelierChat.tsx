'use client'
import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

interface Recommendation {
  id: number
  name: string
  origin: string
  price: number
  image_url: string | null
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  recommendation?: Recommendation
}

export function SommelierChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your B & B coffee sommelier. Tell me what flavors you enjoy or how you like your coffee, and I'll find your perfect match.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const addItem = useCartStore((s) => s.addItem)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { role: 'user', content: text }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/sommelier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map(m => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        recommendation: data.recommendation ?? undefined,
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I couldn't connect. Please try again.",
      }])
    } finally {
      setLoading(false)
    }
  }

  function handleAddToCart(rec: Recommendation) {
    addItem({ id: rec.id, name: rec.name, price: rec.price, image_url: rec.image_url, origin: rec.origin })
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-[#1A120B] text-[#FAF8F6] w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-[#3C2A21] transition-colors"
        aria-label="Open coffee sommelier"
      >
        <MessageCircle size={24} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-black/30" onClick={() => setIsOpen(false)} />
          <div className="fixed bottom-24 right-6 z-50 w-80 bg-[#FAF8F6] rounded-xl shadow-2xl flex flex-col overflow-hidden" style={{ maxHeight: '70vh' }}>
            <div className="bg-[#1A120B] text-[#FAF8F6] px-4 py-3 flex items-center justify-between shrink-0">
              <div>
                <p className="font-serif font-bold text-sm">Coffee Sommelier</p>
                <p className="text-xs text-[#FAF8F6]/60">Powered by Claude AI</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-[#FAF8F6]/70 hover:text-[#FAF8F6] transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-[#1A120B] text-[#FAF8F6]'
                      : 'bg-white border border-[#3C2A21]/10 text-[#1A120B]'
                  }`}>
                    <p className="leading-relaxed">{msg.content}</p>
                    {msg.recommendation && (
                      <button
                        onClick={() => handleAddToCart(msg.recommendation!)}
                        className="mt-2 flex items-center gap-1.5 text-xs bg-[#B68D40] text-[#1A120B] font-medium px-2 py-1 rounded hover:bg-[#B68D40]/80 transition-colors w-full justify-center"
                      >
                        <ShoppingCart size={12} />
                        Add {msg.recommendation.name} to cart
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[#3C2A21]/10 rounded-lg px-3 py-2">
                    <span className="text-[#3C2A21]/50 text-sm">Brewing a response...</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-[#3C2A21]/10 px-3 py-2 flex gap-2 shrink-0">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Describe your taste..."
                className="flex-1 text-sm bg-white border border-[#3C2A21]/20 rounded px-3 py-1.5 text-[#1A120B] placeholder-[#3C2A21]/40 focus:outline-none focus:border-[#1A120B]"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-[#1A120B] text-[#FAF8F6] p-1.5 rounded hover:bg-[#3C2A21] transition-colors disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
