'use client'
import { useCartStore } from '@/store/cartStore'

interface Props {
  coffee: {
    id: number
    name: string
    origin: string
    price: number
    image_url: string | null
  }
}

export function AddToCartButton({ coffee }: Props) {
  const addItem = useCartStore((state) => state.addItem)
  return (
    <button
      onClick={() => addItem(coffee)}
      className="bg-[#2C1810] text-[#FDF8F3] px-6 py-2 rounded hover:bg-[#3C2A21] hover:scale-105 transition-all duration-200"
    >
      Add to Cart
    </button>
  )
}
