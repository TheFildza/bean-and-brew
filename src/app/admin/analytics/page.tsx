export const dynamic = 'force-dynamic'
import { sql } from '@/lib/db'

async function getStats() {
  const [revenue, funnel, topCoffees, sommelier, deliveryBreakdown] = await Promise.all([
    // Revenue last 30 days vs previous 30 days
    sql`
      SELECT
        COALESCE(SUM(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN total_amount END), 0) AS current_revenue,
        COALESCE(SUM(CASE WHEN created_at < NOW() - INTERVAL '30 days' AND created_at >= NOW() - INTERVAL '60 days' THEN total_amount END), 0) AS prev_revenue,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) AS current_orders,
        COALESCE(AVG(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN total_amount END), 0) AS avg_order_value
      FROM orders WHERE status = 'paid'
    `,
    // Conversion funnel (last 30 days)
    sql`
      SELECT
        COUNT(CASE WHEN name = 'add_to_cart' THEN 1 END)                    AS add_to_cart,
        COUNT(CASE WHEN name = 'checkout_started' THEN 1 END)               AS checkout_started,
        COUNT(CASE WHEN name = 'order_completed' THEN 1 END)                AS order_completed
      FROM events
      WHERE created_at >= NOW() - INTERVAL '30 days'
    `,
    // Top 5 coffees by units sold (all time)
    sql`
      SELECT oi.name, SUM(oi.quantity) AS units, SUM(oi.price * oi.quantity) AS revenue
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      WHERE o.status = 'paid'
      GROUP BY oi.name
      ORDER BY units DESC
      LIMIT 5
    `,
    // AI Sommelier stats (last 30 days)
    sql`
      SELECT
        COUNT(CASE WHEN name = 'sommelier_opened' THEN 1 END)                   AS opened,
        COUNT(CASE WHEN name = 'sommelier_recommendation_shown' THEN 1 END)     AS recommendations_shown,
        COUNT(CASE WHEN name = 'sommelier_recommendation_added' THEN 1 END)     AS recommendations_added
      FROM events
      WHERE created_at >= NOW() - INTERVAL '30 days'
    `,
    // Delivery type breakdown
    sql`
      SELECT delivery_type, COUNT(*) AS count
      FROM orders
      WHERE status = 'paid' AND delivery_type IS NOT NULL
      GROUP BY delivery_type
    `,
  ])

  return {
    revenue: revenue[0],
    funnel: funnel[0],
    topCoffees,
    sommelier: sommelier[0],
    deliveryBreakdown,
  }
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white border border-[#3C2A21]/10 rounded-lg px-5 py-4">
      <p className="text-xs text-[#3C2A21]/50 uppercase tracking-wide mb-1">{label}</p>
      <p className="font-serif text-2xl font-bold text-[#1A120B]">{value}</p>
      {sub && <p className="text-xs text-[#3C2A21]/50 mt-1">{sub}</p>}
    </div>
  )
}

function FunnelBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-[#3C2A21]">{label}</span>
        <span className="font-medium text-[#1A120B]">{value} <span className="text-[#3C2A21]/50 font-normal">({pct}%)</span></span>
      </div>
      <div className="h-2 bg-[#3C2A21]/10 rounded-full overflow-hidden">
        <div className="h-full bg-[#1A120B] rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default async function AnalyticsPage() {
  const { revenue, funnel, topCoffees, sommelier, deliveryBreakdown } = await getStats()

  const revenueDiff = Number(revenue.prev_revenue) > 0
    ? Math.round(((Number(revenue.current_revenue) - Number(revenue.prev_revenue)) / Number(revenue.prev_revenue)) * 100)
    : null

  const sommelierConversion = Number(sommelier.recommendations_shown) > 0
    ? Math.round((Number(sommelier.recommendations_added) / Number(sommelier.recommendations_shown)) * 100)
    : 0

  const funnelMax = Number(funnel.add_to_cart) || 1

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-[#1A120B]">Analytics</h1>
        <span className="text-xs text-[#3C2A21]/50">Last 30 days</span>
      </div>

      {/* Revenue KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Revenue"
          value={`$${Number(revenue.current_revenue).toFixed(2)}`}
          sub={revenueDiff !== null ? `${revenueDiff >= 0 ? '+' : ''}${revenueDiff}% vs prev 30d` : undefined}
        />
        <StatCard label="Orders" value={String(revenue.current_orders)} />
        <StatCard
          label="Avg Order Value"
          value={`$${Number(revenue.avg_order_value).toFixed(2)}`}
        />
        <StatCard
          label="AI Sommelier CVR"
          value={`${sommelierConversion}%`}
          sub={`${sommelier.recommendations_added} / ${sommelier.recommendations_shown} rec.`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <div className="bg-white border border-[#3C2A21]/10 rounded-lg p-5 space-y-4">
          <h2 className="font-medium text-[#1A120B]">Conversion Funnel</h2>
          <div className="space-y-3">
            <FunnelBar label="Add to Cart" value={Number(funnel.add_to_cart)} max={funnelMax} />
            <FunnelBar label="Checkout Started" value={Number(funnel.checkout_started)} max={funnelMax} />
            <FunnelBar label="Order Completed" value={Number(funnel.order_completed)} max={funnelMax} />
          </div>
        </div>

        {/* Top Coffees */}
        <div className="bg-white border border-[#3C2A21]/10 rounded-lg p-5 space-y-4">
          <h2 className="font-medium text-[#1A120B]">Top Coffees (All Time)</h2>
          {topCoffees.length === 0 && <p className="text-sm text-[#3C2A21]/50">No sales yet.</p>}
          <div className="space-y-2">
            {topCoffees.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-[#1A120B]">
                  <span className="text-[#3C2A21]/40 mr-2">{i + 1}.</span>{c.name as string}
                </span>
                <span className="text-[#3C2A21]/70">
                  {c.units as number} units · ${Number(c.revenue).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Sommelier */}
        <div className="bg-white border border-[#3C2A21]/10 rounded-lg p-5 space-y-3">
          <h2 className="font-medium text-[#1A120B]">AI Sommelier</h2>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'Opened', value: sommelier.opened },
              { label: 'Recommendations', value: sommelier.recommendations_shown },
              { label: 'Added to Cart', value: sommelier.recommendations_added },
            ].map(s => (
              <div key={s.label} className="bg-[#FAF8F6] rounded-lg py-3">
                <p className="font-serif text-xl font-bold text-[#1A120B]">{String(s.value)}</p>
                <p className="text-xs text-[#3C2A21]/50 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Breakdown */}
        <div className="bg-white border border-[#3C2A21]/10 rounded-lg p-5 space-y-3">
          <h2 className="font-medium text-[#1A120B]">Delivery Breakdown</h2>
          {deliveryBreakdown.length === 0 && <p className="text-sm text-[#3C2A21]/50">No data yet.</p>}
          <div className="space-y-2">
            {deliveryBreakdown.map((d) => (
              <div key={d.delivery_type as string} className="flex items-center justify-between text-sm">
                <span className="text-[#1A120B] capitalize">{d.delivery_type as string}</span>
                <span className="font-medium text-[#1A120B]">{d.count as number} orders</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
