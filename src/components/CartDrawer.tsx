'use client'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { X, Plus, Minus, Trash2, Locate, MapPin } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { CheckoutModal } from './CheckoutModal'

const Map = dynamic(() => import('./LocationPickerMap'), { ssr: false })

interface Props {
  isOpen: boolean
  onClose: () => void
}

interface PickupLocation {
  id: number
  name: string
  address: string
  lat: number
  lng: number
}

type Step = 'cart' | 'address'
type DeliveryTab = 'delivery' | 'pickup'

export function CartDrawer({ isOpen, onClose }: Props) {
  const { items, removeItem, updateQuantity, clearCart, total } = useCartStore()
  const [step, setStep] = useState<Step>('cart')
  const [tab, setTab] = useState<DeliveryTab>('delivery')
  const [address, setAddress] = useState('')
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [locating, setLocating] = useState(false)
  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>([])
  const [selectedPickup, setSelectedPickup] = useState<PickupLocation | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)

  useEffect(() => {
    if (step === 'address' && tab === 'pickup' && pickupLocations.length === 0) {
      fetch('/api/pickup-locations').then(r => r.json()).then(setPickupLocations)
    }
  }, [step, tab, pickupLocations.length])

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
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
          const data = await res.json()
          setAddress(data.display_name ?? `${lat}, ${lng}`)
        } catch {
          setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`)
        }
        setCoords({ lat, lng })
        setLocating(false)
      },
      () => setLocating(false)
    )
  }

  function getCheckoutDelivery() {
    if (tab === 'pickup' && selectedPickup) {
      return {
        address: `Pickup: ${selectedPickup.name} — ${selectedPickup.address}`,
        pickup_location_id: selectedPickup.id,
      }
    }
    if (tab === 'delivery' && address) {
      return { address, lat: coords?.lat, lng: coords?.lng }
    }
    return undefined
  }

  const canContinue = tab === 'delivery' ? !!address : !!selectedPickup

  return (
    <>
      {showCheckout && (
        <CheckoutModal
          items={items.map(i => ({ id: i.id, quantity: i.quantity }))}
          delivery={getCheckoutDelivery()}
          onClose={() => setShowCheckout(false)}
        />
      )}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/40" onClick={handleClose} />}

      <div className={`fixed right-0 top-0 h-full w-full max-w-md z-50 bg-[#FDF8F3] shadow-2xl flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#3C2A21]/10">
          <div className="flex items-center gap-2">
            {step === 'address' && (
              <button onClick={() => setStep('cart')} className="text-[#3C2A21] hover:text-[#2C1810] transition-colors mr-1">←</button>
            )}
            <h2 className="font-serif text-xl font-bold text-[#2C1810]">
              {step === 'cart' ? 'Your Cart' : 'Delivery Options'}
            </h2>
          </div>
          <button onClick={handleClose} className="text-[#3C2A21] hover:text-[#2C1810] transition-colors">
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
                          <div className="w-full h-full flex items-center justify-center text-[#FAF8F6] opacity-30 text-2xl">&#9749;</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif font-bold text-[#2C1810] truncate">{item.name}</p>
                        <p className="text-xs text-[#3C2A21]">{item.origin}</p>
                        <p className="text-sm font-medium text-[#2C1810] mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded border border-[#3C2A21]/30 flex items-center justify-center hover:bg-[#3C2A21] hover:text-[#FAF8F6] transition-colors"><Minus size={12} /></button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded border border-[#3C2A21]/30 flex items-center justify-center hover:bg-[#3C2A21] hover:text-[#FAF8F6] transition-colors"><Plus size={12} /></button>
                        <button onClick={() => removeItem(item.id)} className="ml-2 text-[#3C2A21]/40 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
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
                  <span className="font-serif text-2xl font-bold text-[#2C1810]">${total().toFixed(2)}</span>
                </div>
                <button onClick={() => setStep('address')} className="w-full bg-[#2C1810] text-[#FAF8F6] py-3 rounded font-medium hover:bg-[#3C2A21] transition-colors">
                  Proceed to Checkout
                </button>
                <button onClick={clearCart} className="w-full text-sm text-[#3C2A21]/50 hover:text-[#3C2A21] transition-colors">Clear cart</button>
              </div>
            )}
          </>
        )}

        {step === 'address' && (
          <>
            <div className="flex border-b border-[#3C2A21]/10 shrink-0">
              {(['delivery', 'pickup'] as DeliveryTab[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === t ? 'text-[#2C1810] border-b-2 border-[#2C1810]' : 'text-[#3C2A21]/50 hover:text-[#3C2A21]'}`}
                >
                  {t === 'delivery' ? 'Home Delivery' : 'Pickup Point'}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {tab === 'delivery' && (
                <>
                  <p className="text-sm text-[#3C2A21]">Enter your delivery address.</p>
                  <textarea
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Street, number, city, postal code..."
                    rows={3}
                    className="w-full border border-[#3C2A21]/30 rounded px-3 py-2 text-sm text-[#2C1810] bg-white placeholder-[#3C2A21]/40 focus:outline-none focus:border-[#2C1810] resize-none"
                  />
                  <button onClick={handleLocate} disabled={locating} className="flex items-center gap-2 text-sm text-[#3C2A21] hover:text-[#2C1810] transition-colors disabled:opacity-50">
                    <Locate size={14} />
                    {locating ? 'Locating...' : 'Use my current location'}
                  </button>
                  {coords && (
                    <p className="flex items-center gap-1 text-xs text-[#3C2A21]/50">
                      <MapPin size={11} />{coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                    </p>
                  )}
                </>
              )}

              {tab === 'pickup' && (
                <>
                  <p className="text-sm text-[#3C2A21]">Select a pickup point from the map.</p>
                  <div className="rounded-lg overflow-hidden border border-[#3C2A21]/10" style={{ height: 280 }}>
                    <Map
                      markers={pickupLocations.map(l => ({ id: l.id, name: l.name, lat: Number(l.lat), lng: Number(l.lng) }))}
                      onSelect={id => setSelectedPickup(pickupLocations.find(l => l.id === id) ?? null)}
                      selectedId={selectedPickup?.id}
                      readOnly
                    />
                  </div>
                  {pickupLocations.length === 0 && (
                    <p className="text-sm text-[#3C2A21]/50 text-center">No pickup locations available.</p>
                  )}
                  {selectedPickup && (
                    <div className="bg-[#B68D40]/10 border border-[#B68D40]/30 rounded-lg px-4 py-3">
                      <p className="font-medium text-sm text-[#2C1810]">{selectedPickup.name}</p>
                      <p className="text-xs text-[#3C2A21]/70 mt-0.5">{selectedPickup.address}</p>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="border-t border-[#3C2A21]/10 px-6 py-5 space-y-3">
              <button
                onClick={() => setShowCheckout(true)}
                disabled={!canContinue}
                className="w-full bg-[#2C1810] text-[#FAF8F6] py-3 rounded font-medium hover:bg-[#3C2A21] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue to Payment
              </button>
              <button onClick={() => setShowCheckout(true)} className="w-full text-sm text-[#3C2A21]/50 hover:text-[#3C2A21] transition-colors">
                Skip — pay now
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
