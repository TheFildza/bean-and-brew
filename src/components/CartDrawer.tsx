'use client'
import Image from 'next/image'
import { useState } from 'react'
import { X, Plus, Minus, Trash2 } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: Props) {
  const { items, removeItem, updateQuantity, clearCart, total } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  async function handleCheckout() {
    setLoading(true)
    setCheckoutError(null)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items.map(i => ({ id: i.id, quantity: i.quantity })) }),
      })
      const data = await res.json()
      if (res.status === 401) { window.location.href = data.redirect; return }
      if (!res.ok) { setCheckoutError(data.error ?? 'Checkout failed'); setLoading(false); return }
      window.location.href = data.url
    } catch {
      setCheckoutError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      )}

      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md z-50 bg-[#FAF8F6] shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#3C2A21]/10">
          <h2 className="font-serif text-xl font-bold text-[#1A120B]">Your Cart</h2>
          <button onClick={onClose} className="text-[#3C2A21] hover:text-[#1A120B] transition-colors">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <p className="text-center text-[#3C2A21] mt-16">Your cart is empty.</p>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded bg-[#3C2A21] shrink-0 overflow-hidden relative">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#FAF8F6] opacity-30 text-2xl">
                        &#9749;
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-bold text-[#1A120B] truncate">{item.name}</p>
                    <p className="text-xs text-[#3C2A21]">{item.origin}</p>
                    <p className="text-sm font-medium text-[#1A120B] mt-1">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded border border-[#3C2A21]/30 flex items-center justify-center hover:bg-[#3C2A21] hover:text-[#FAF8F6] transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded border border-[#3C2A21]/30 flex items-center justify-center hover:bg-[#3C2A21] hover:text-[#FAF8F6] transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-2 text-[#3C2A21]/40 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[#3C2A21]/10 px-6 py-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[#3C2A21]">Total</span>
              <span className="font-serif text-2xl font-bold text-[#1A120B]">
                ${total().toFixed(2)}
              </span>
            </div>
            {checkoutError && (
              <p className="text-sm text-red-600 text-center">{checkoutError}</p>
            )}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-[#1A120B] text-[#FAF8F6] py-3 rounded font-medium hover:bg-[#3C2A21] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Redirecting...' : 'Proceed to Checkout'}
            </button>
            <button
              onClick={clearCart}
              className="w-full text-sm text-[#3C2A21]/50 hover:text-[#3C2A21] transition-colors"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  )
}
