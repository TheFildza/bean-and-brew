import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { trackClient } from '@/lib/trackClient'

export interface CartItem {
  id: number
  name: string
  origin: string
  price: number
  image_url: string | null
  quantity: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) => {
        trackClient('add_to_cart', { coffee_id: item.id, coffee_name: item.name, price: item.price })
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id)
          return {
            items: existing
              ? state.items.map((i) =>
                  i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                )
              : [...state.items, { ...item, quantity: 1 }],
            isOpen: true,
          }
        })
      },
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'bean-and-brew-cart',
      skipHydration: true,
      partialize: (state) => ({ items: state.items }),
    }
  )
)
