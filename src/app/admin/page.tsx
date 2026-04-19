export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { sql } from '@/lib/db'
import { DeleteCoffeeButton } from '@/components/DeleteCoffeeButton'

interface Coffee {
  id: number
  name: string
  origin: string
  roast_level: string
  price: number
  stock_quantity: number
  is_active: boolean
}

async function getCoffees(): Promise<Coffee[]> {
  const rows = await sql`
    SELECT id, name, origin, roast_level, price,
           COALESCE(stock_quantity, 0) AS stock_quantity,
           COALESCE(is_active, true) AS is_active
    FROM coffees ORDER BY id
  `
  return rows as Coffee[]
}

export default async function AdminPage() {
  const coffees = await getCoffees()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-[#1A120B]">Inventory</h1>
        <Link
          href="/admin/new"
          className="bg-[#1A120B] text-[#FAF8F6] px-4 py-2 rounded hover:bg-[#3C2A21] transition-colors text-sm font-medium"
        >
          + Add Coffee
        </Link>
      </div>

      {coffees.length === 0 ? (
        <p className="text-[#3C2A21]">No coffees yet. Add your first one.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#3C2A21]/10 text-left">
                <th className="px-4 py-3 font-medium text-[#3C2A21]">Name</th>
                <th className="px-4 py-3 font-medium text-[#3C2A21]">Origin</th>
                <th className="px-4 py-3 font-medium text-[#3C2A21]">Roast</th>
                <th className="px-4 py-3 font-medium text-[#3C2A21]">Price</th>
                <th className="px-4 py-3 font-medium text-[#3C2A21]">Stock</th>
                <th className="px-4 py-3 font-medium text-[#3C2A21]">Active</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {coffees.map((coffee) => (
                <tr key={coffee.id} className="border-b border-[#3C2A21]/10 hover:bg-[#FAF8F6]">
                  <td className="px-4 py-3 font-medium text-[#1A120B]">{coffee.name}</td>
                  <td className="px-4 py-3 text-[#3C2A21]">{coffee.origin}</td>
                  <td className="px-4 py-3 text-[#3C2A21]">{coffee.roast_level}</td>
                  <td className="px-4 py-3 text-[#1A120B]">${Number(coffee.price).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${coffee.stock_quantity === 0 ? 'text-red-600' : 'text-green-700'}`}>
                      {coffee.stock_quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${coffee.is_active ? 'bg-green-100 text-green-800' : 'bg-[#3C2A21]/10 text-[#3C2A21]'}`}>
                      {coffee.is_active ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link
                      href={`/admin/${coffee.id}/edit`}
                      className="text-[#1A120B] hover:text-[#B68D40] transition-colors font-medium"
                    >
                      Edit
                    </Link>
                    <DeleteCoffeeButton id={coffee.id} name={coffee.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
