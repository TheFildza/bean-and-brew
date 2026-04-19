interface CoffeeFormData {
  name?: string
  origin?: string
  roast_level?: string
  price?: number
  stock_quantity?: number
  notes?: string
  description?: string
  image_url?: string | null
  is_active?: boolean
}

interface Props {
  action: (formData: FormData) => Promise<void>
  defaultValues?: CoffeeFormData
  submitLabel: string
}

export function CoffeeForm({ action, defaultValues = {}, submitLabel }: Props) {
  const d = defaultValues
  return (
    <form action={action} className="space-y-5 max-w-2xl">
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-[#2C1810] mb-1">Name *</label>
          <input name="name" required defaultValue={d.name} className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#2C1810] mb-1">Origin *</label>
          <input name="origin" required defaultValue={d.origin} className="input" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-medium text-[#2C1810] mb-1">Roast Level *</label>
          <select name="roast_level" required defaultValue={d.roast_level ?? 'Medium'} className="input">
            <option value="Light">Light</option>
            <option value="Medium">Medium</option>
            <option value="Dark">Dark</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#2C1810] mb-1">Price ($) *</label>
          <input name="price" type="number" step="0.01" min="0" required defaultValue={d.price} className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#2C1810] mb-1">Stock Qty *</label>
          <input name="stock_quantity" type="number" min="0" required defaultValue={d.stock_quantity ?? 0} className="input" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#2C1810] mb-1">Flavor Notes</label>
        <input name="notes" defaultValue={d.notes ?? ''} placeholder="Citrus, Chocolate, Floral" className="input" />
        <p className="text-xs text-[#3C2A21]/60 mt-1">Comma-separated values</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#2C1810] mb-1">Description</label>
        <textarea name="description" rows={3} defaultValue={d.description} className="input resize-none" />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#2C1810] mb-1">Image URL</label>
        <input name="image_url" type="url" defaultValue={d.image_url ?? ''} placeholder="https://..." className="input" />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_active"
          id="is_active"
          defaultChecked={d.is_active ?? true}
          className="w-4 h-4 accent-[#2C1810]"
        />
        <label htmlFor="is_active" className="text-sm font-medium text-[#2C1810]">
          Active (visible in catalog)
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="bg-[#2C1810] text-[#FDF8F3] px-6 py-2 rounded hover:bg-[#3C2A21] transition-colors font-medium">
          {submitLabel}
        </button>
        <a href="/admin" className="px-6 py-2 rounded border border-[#3C2A21]/30 text-[#3C2A21] hover:bg-[#3C2A21]/5 transition-colors">
          Cancel
        </a>
      </div>
    </form>
  )
}
