export const dynamic = 'force-dynamic'
import { getUserFromSession } from '@/lib/userAuth'
import { sql } from '@/lib/db'
import { logoutUserAction } from '@/app/(auth)/actions'

interface Order {
  id: number
  created_at: string
  status: string
  total_amount: number
  items: { name: string; quantity: number; price: number }[]
}

async function getUserOrders(userId: number): Promise<Order[]> {
  const orders = await sql`
    SELECT o.id, o.created_at, o.status, o.total_amount
    FROM orders o
    WHERE o.user_id = ${userId}
    ORDER BY o.created_at DESC
  `
  const result: Order[] = []
  for (const order of orders) {
    const items = await sql`
      SELECT name, quantity, price FROM order_items WHERE order_id = ${order.id as number}
    `
    result.push({
      id: order.id as number,
      created_at: order.created_at as string,
      status: order.status as string,
      total_amount: order.total_amount as number,
      items: items as { name: string; quantity: number; price: number }[],
    })
  }
  return result
}

export default async function AccountPage() {
  const user = await getUserFromSession()
  const orders = await getUserOrders(user!.id)

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1A120B]">My Account</h1>
          <p className="text-[#3C2A21] text-sm mt-1">{user!.email}</p>
        </div>
        <form action={logoutUserAction}>
          <button type="submit" className="text-sm text-[#3C2A21]/60 hover:text-[#3C2A21] transition-colors">
            Sign Out
          </button>
        </form>
      </div>

      <h2 className="font-serif text-xl font-bold text-[#1A120B] mb-4">Order History</h2>

      {orders.length === 0 ? (
        <div className="text-center py-12 text-[#3C2A21]">
          <p className="mb-4">No orders yet.</p>
          <a href="/" className="bg-[#1A120B] text-[#FAF8F6] px-6 py-2 rounded hover:bg-[#3C2A21] transition-colors text-sm font-medium">
            Shop Now
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-xs text-[#3C2A21]/60">Order #{order.id}</span>
                  <p className="text-sm text-[#3C2A21]">
                    {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                    {order.status}
                  </span>
                  <p className="font-serif font-bold text-[#1A120B] mt-1">${Number(order.total_amount).toFixed(2)}</p>
                </div>
              </div>
              <ul className="border-t border-[#3C2A21]/10 pt-3 space-y-1">
                {order.items.map((item, i) => (
                  <li key={i} className="flex justify-between text-sm text-[#3C2A21]">
                    <span>{item.name} × {item.quantity}</span>
                    <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
