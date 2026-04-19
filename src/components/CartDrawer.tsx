'use client'
import Image from 'next/image'
import { useState } from 'react'
import { X, Plus, Minus, Trash2, MapPin, Locate } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { CheckoutModal } from './CheckoutModal'

interface Props {
  isOpen: boolean
  onClose: () => void
}

interface DeliveryInfo {
  address: string
  lat?: number
  lng?: number
}

type Step = 'cart' | 'address'

export function CartDrawer({ isOpen, onClose }: Props) {
  const { items, removeItem, updateQuantity, clearCart, total } = useCartStore()
  const [step, setStep] = useState<Step>('cart')
  const [delivery, setDelivery] = useState<DeliveryInfo>({ address: '' })
  const [locating, setLocating] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

  function handleClose() {
    setStep('cart')
    onClose()
  }

  async function handleLocate() {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          )
          const data = await res.json()
          setDelivery({ address: data.display_name ?? `${lat}, ${lng}`, lat, lng })
        } catch {
          setDelivery({ address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`, lat, lng })
        }
        setLocating(false)
      },
      () => setLocating(false)
    )
  }

  function handleContinueToPayment() {
    setShowCheckout(true)
  }

  return (
    <>
      {showCheckout && (
        <CheckoutModal
          items={items.map(i => ({ id: i.id, quantity: i.quantity }))}
          delivery={delivery.address ? delivery : undefined}
          onClose={() => setShowCheckout(false)}
        />
      )}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={handleClose} />
      )}

      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md z-50 bg-[#FAF8F6] shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#3C2A21]/10">
          <div className="flex items-center gap-2">
            {step === 'address' && (
              <button onClick={() => setStep('cart')} className="text-[#3C2A21] hover:text-[#1A120B] transition-colors mr-1">
                ←
              </button>
            )}
            <h2 className="font-serif text-xl font-bold text-[#1A120B]">
              {step === 'cart' ? 'Your Cart' : 'Delivery Address'}
            </h2>
          </div>
          <button onClick={handleClose} className="text-[#3C2A21] hover:text-[#1A120B] transition-colors">
            <X size={22} />
          </button>
        </div>

        {step === 'cart' && (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <p className="text-center text-[#3C2A21] mt-16">Your cart is empty.</p>
              ) : (
                <ul className="space-y-5">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4 items-center">
                      <div className="w-16 h-16 rounded bg-[#3C2A21] shrink-0 overflow-hidden relative">
                        {item.image_url ? (
                          <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="64px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#FAF8F6] opacity-30 text-2xl">
                            &#9749;
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif font-bold text-[#1A120B] truncate">{item.name}</p>
                        <p className="text-xs text-[#3C2A21]">{item.origin}</p>
                        <p className="text-sm font-medium text-[#1A120B] mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded border border-[#3C2A21]/30 flex items-center justify-center hover:bg-[#3C2A21] hover:text-[#FAF8F6] transition-colors">
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded border border-[#3C2A21]/30 flex items-center justify-center hover:bg-[#3C2A21] hover:text-[#FAF8F6] transition-colors">
                          <Plus size={12} />
                        </button>
                        <button onClick={() => removeItem(item.id)} className="ml-2 text-[#3C2A21]/40 hover:text-red-600 transition-colors">
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
                  <span className="font-serif text-2xl font-bold text-[#1A120B]">${total().toFixed(2)}</span>
                </div>
                <button
                  onClick={() => setStep('address')}
                  className="w-full bg-[#1A120B] text-[#FAF8F6] py-3 rounded font-medium hover:bg-[#3C2A21] transition-colors"
                >
                  Proceed to Checkout
                </button>
                <button onClick={clearCart} className="w-full text-sm text-[#3C2A21]/50 hover:text-[#3C2A21] transition-colors">
                  Clear cart
                </button>
              </div>
            )}
          </>
        )}

        {step === 'address' && (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              <p className="text-sm text-[#3C2A21]">
                Enter your delivery address. We'll use it to arrange shipping.
              </p>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#1A120B]">Address</label>
                <textarea
                  value={delivery.address}
                  onChange={e => setDelivery(d => ({ ...d, address: e.target.value }))}
                  placeholder="Street, number, city, postal code..."
                  rows={3}
                  className="w-full border border-[#3C2A21]/30 rounded px-3 py-2 text-sm text-[#1A120B] bg-white placeholder-[#3C2A21]/40 focus:outline-none focus:border-[#1A120B] resize-none"
                />
              </div>

              <button
                onClick={handleLocate}
                disabled={locating}
                className="flex items-center gap-2 text-sm text-[#3C2A21] hover:text-[#1A120B] transition-colors disabled:opacity-50"
              >
                <Locate size={14} />
                {locating ? 'Locating...' : 'Use my current location'}
              </button>

              {delivery.lat && delivery.lng && (
                <div className="flex items-center gap-2 text-xs text-[#3C2A21]/60">
                  <MapPin size={12} />
                  {delivery.lat.toFixed(5)}, {delivery.lng.toFixed(5)}
                </div>
              )}
            </div>

            <div className="border-t border-[#3C2A21]/10 px-6 py-5 space-y-3">
              <button
                onClick={handleContinueToPayment}
                className="w-full bg-[#1A120B] text-[#FAF8F6] py-3 rounded font-medium hover:bg-[#3C2A21] transition-colors"
              >
                Continue to Payment
              </button>
              <button
                onClick={handleContinueToPayment}
                className="w-full text-sm text-[#3C2A21]/50 hover:text-[#3C2A21] transition-colors"
              >
                Skip — I'll arrange pickup
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
