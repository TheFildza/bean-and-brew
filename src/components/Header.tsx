'use client'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { CartDrawer } from './CartDrawer'

interface Props {
  userNav?: React.ReactNode
}

export function Header({ userNav }: Props) {
  const itemCount = useCartStore((state) => state.itemCount)
  const isOpen = useCartStore((state) => state.isOpen)
  const openCart = useCartStore((state) => state.openCart)
  const closeCart = useCartStore((state) => state.closeCart)
  const count = itemCount()

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FDF8F3]/75 backdrop-blur-md border-b border-[#3C2A21]/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" className="font-serif font-bold text-xl text-[#2C1810]">B & B</a>
          <div className="flex items-center gap-4">
            {userNav}
            <button
              onClick={openCart}
              className="relative p-2 text-[#2C1810] hover:text-[#3C2A21] transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart size={24} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#B68D40] text-[#2C1810] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      <CartDrawer isOpen={isOpen} onClose={closeCart} />
    </>
  )
}
