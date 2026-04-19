import { logoutAction } from '@/app/admin/actions'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <header className="bg-[#2C1810] text-[#FDF8F3] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <span className="font-serif font-bold text-lg">B & B</span>
              <span className="ml-3 text-[#FDF8F3]/50 text-sm">Admin</span>
            </div>
            <nav className="flex items-center gap-4 text-sm">
              <a href="/admin" className="text-[#FDF8F3]/70 hover:text-[#FDF8F3] transition-colors">Products</a>
              <a href="/admin/orders" className="text-[#FDF8F3]/70 hover:text-[#FDF8F3] transition-colors">Orders</a>
              <a href="/admin/locations" className="text-[#FDF8F3]/70 hover:text-[#FDF8F3] transition-colors">Locations</a>
              <a href="/admin/analytics" className="text-[#FDF8F3]/70 hover:text-[#FDF8F3] transition-colors">Analytics</a>
            </nav>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm text-[#FDF8F3]/70 hover:text-[#FDF8F3] transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
