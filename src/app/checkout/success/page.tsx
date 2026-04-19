'use client'
import { useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import Link from 'next/link'

export default function SuccessPage() {
  const clearCart = useCartStore(s => s.clearCart)

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-10">
        <div className="text-6xl mb-6">&#9749;</div>
        <h1 className="font-serif text-3xl font-bold text-[#2C1810] mb-3">Order confirmed!</h1>
        <p className="text-[#3C2A21] mb-8">
          Thank you for your purchase. You'll receive a confirmation email shortly.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/account" className="bg-[#2C1810] text-[#FDF8F3] px-6 py-2 rounded hover:bg-[#3C2A21] transition-colors font-medium">
            View Orders
          </Link>
          <Link href="/" className="border border-[#3C2A21]/30 text-[#3C2A21] px-6 py-2 rounded hover:bg-[#3C2A21]/5 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
