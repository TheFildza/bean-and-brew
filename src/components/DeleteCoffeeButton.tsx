'use client'
import { deleteCoffeeAction } from '@/app/admin/actions'

export function DeleteCoffeeButton({ id, name }: { id: number; name: string }) {
  async function handleDelete() {
    if (!confirm(`Delete "${name}"?`)) return
    await deleteCoffeeAction(id)
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 hover:text-red-700 transition-colors"
    >
      Delete
    </button>
  )
}
