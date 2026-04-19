import { CoffeeForm } from '@/components/CoffeeForm'
import { createCoffeeAction } from '@/app/admin/actions'

export default function NewCoffeePage() {
  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-[#1A120B] mb-6">Add Coffee</h1>
      <CoffeeForm action={createCoffeeAction} submitLabel="Create Coffee" />
    </div>
  )
}
