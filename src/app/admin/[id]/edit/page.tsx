export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { sql } from '@/lib/db'
import { CoffeeForm } from '@/components/CoffeeForm'
import { updateCoffeeAction } from '@/app/admin/actions'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditCoffeePage({ params }: Props) {
  const { id } = await params
  const rows = await sql`
    SELECT id, name, origin, roast_level, price,
           COALESCE(stock_quantity, 0) AS stock_quantity,
           notes, description, image_url,
           COALESCE(is_active, true) AS is_active
    FROM coffees WHERE id = ${parseInt(id, 10)}
  `
  const coffee = rows[0]
  if (!coffee) notFound()

  const action = updateCoffeeAction.bind(null, coffee.id as number)

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-[#2C1810] mb-6">
        Edit: {coffee.name as string}
      </h1>
      <CoffeeForm
        action={action}
        defaultValues={{
          name: coffee.name as string,
          origin: coffee.origin as string,
          roast_level: coffee.roast_level as string,
          price: coffee.price as number,
          stock_quantity: coffee.stock_quantity as number,
          notes: coffee.notes as string,
          description: coffee.description as string,
          image_url: coffee.image_url as string | null,
          is_active: coffee.is_active as boolean,
        }}
        submitLabel="Save Changes"
      />
    </div>
  )
}
