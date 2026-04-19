export const dynamic = 'force-dynamic'
import { sql } from '@/lib/db'
import { MapPin, Truck } from 'lucide-react'

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface Order {
  id: number
  created_at: string
  status: string
  total_amount: number
  delivery_type: string | null
  delivery_address: string | null
  delivery_lat: number | null
  delivery_lng: number | null
  pickup_location_name: string | null
  pickup_location_address: string | null
  user_name: string | null
  user_email: string
  items: OrderItem[]
}

async function getOrders(): Promise<Order[]> {
  const rows = await sql`
    SELECT
      o.id,
      o.created_at,
      o.status,
      o.total_amount,
      o.delivery_type,
      o.delivery_address,
      o.delivery_lat,
      o.delivery_lng,
      pl.name    AS pickup_location_name,
      pl.address AS pickup_location_address,
      u.name     AS user_name,
      u.email    AS user_email,
      JSON_AGG(
        JSON_BUILD_OBJECT('name', oi.name, 'quantity', oi.quantity, 'price', oi.price)
        ORDER BY oi.id
      ) AS items
    FROM orders o
    JOIN users u ON u.id = o.user_id
    LEFT JOIN order_items oi ON oi.order_id = o.id
    LEFT JOIN pickup_locations pl ON pl.id = o.pickup_location_id
    GROUP BY o.id, u.name, u.email, pl.name, pl.address
    ORDER BY o.created_at DESC
  `
  return rows as unknown as Order[]
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-[#1A120B]">Orders</h1>
        <span className="text-sm text-[#3C2A21]/60">{orders.length} total</span>
      </div>

      {orders.length === 0 && (
        <p className="text-[#3C2A21]/50 text-sm">No orders yet.</p>
      )}

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white border border-[#3C2A21]/10 rounded-lg overflow-hidden">

            {/* Header */}
            <div className="px-5 py-4 flex flex-wrap items-start justify-between gap-3 border-b border-[#3C2A21]/10">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-serif font-bold text-[#1A120B]">#{order.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    order.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status}
                  </span>
                  {order.delivery_type && (
                    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[#3C2A21]/8 text-[#3C2A21] font-medium">
                      {order.delivery_type === 'pickup'
                        ? <><MapPin size={10} /> Pickup</>
                        : <><Truck size={10} /> Delivery</>}
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#3C2A21] mt-1">
                  <span className="font-medium">{order.user_name ?? order.user_email}</span>
                  {order.user_name && <span className="text-[#3C2A21]/60"> · {order.user_email}</span>}
                </p>
                <p className="text-xs text-[#3C2A21]/50 mt-0.5">
                  {new Date(order.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
              <span className="font-serif text-xl font-bold text-[#1A120B]">
                ${Number(order.total_amount).toFixed(2)}
              </span>
            </div>

            {/* Items */}
            <div className="px-5 py-3 space-y-1.5">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-[#1A120B]">
                    <span className="font-medium">{item.quantity}×</span> {item.name}
                  </span>
                  <span className="text-[#3C2A21]/70">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Destination */}
            {(order.delivery_address || order.pickup_location_name) && (
              <div className="px-5 py-3 border-t border-[#3C2A21]/10 bg-[#FAF8F6] space-y-1">
                <p className="text-xs font-medium text-[#3C2A21]/50 uppercase tracking-wide">Destination</p>
                {order.delivery_type === 'pickup' ? (
                  <div className="flex items-start gap-1.5">
                    <MapPin size={13} className="text-[#B68D40] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-[#1A120B]">{order.pickup_location_name}</p>
                      {order.pickup_location_address && (
                        <p className="text-xs text-[#3C2A21]/60">{order.pickup_location_address}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-1.5">
                    <Truck size={13} className="text-[#3C2A21]/50 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-[#1A120B]">{order.delivery_address}</p>
                      {order.delivery_lat && order.delivery_lng && (
                        <p className="text-xs text-[#3C2A21]/40 mt-0.5">
                          {Number(order.delivery_lat).toFixed(5)}, {Number(order.delivery_lng).toFixed(5)}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  )
}
