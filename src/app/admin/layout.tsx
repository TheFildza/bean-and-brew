import { logoutAction } from '@/app/admin/actions'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF8F6]">
      <header className="bg-[#1A120B] text-[#FAF8F6] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <span className="font-serif font-bold text-lg">Bean & Brew</span>
            <span className="ml-3 text-[#FAF8F6]/50 text-sm">Admin</span>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm text-[#FAF8F6]/70 hover:text-[#FAF8F6] transition-colors"
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
