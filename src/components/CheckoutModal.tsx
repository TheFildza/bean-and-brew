'use client'
import { useCallback } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'
import { X } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface Props {
  items: { id: number; quantity: number }[]
  delivery?: { address: string; lat?: number; lng?: number }
  onClose: () => void
}

export function CheckoutModal({ items, delivery, onClose }: Props) {
  const fetchClientSecret = useCallback(async () => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, delivery }),
    })
    if (res.status === 401) {
      const data = await res.json()
      window.location.href = data.redirect
      return ''
    }
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? 'Checkout failed')
    return data.clientSecret
  }, [items])

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4">
      <div className="relative bg-white rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        <div className="p-2">
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    </div>
  )
}
