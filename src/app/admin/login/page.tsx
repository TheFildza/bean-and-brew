import { loginAction } from '@/app/admin/actions'

interface Props {
  searchParams: Promise<{ error?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams

  return (
    <div className="min-h-screen bg-[#FDF8F3] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-3xl font-bold text-[#2C1810] text-center mb-2">
          B & B
        </h1>
        <p className="text-center text-[#3C2A21] mb-8">Admin Dashboard</p>

        <form action={loginAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2C1810] mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              autoFocus
              className="w-full border border-[#3C2A21]/30 rounded px-4 py-2 bg-white text-[#2C1810] focus:outline-none focus:border-[#2C1810]"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">Incorrect password.</p>
          )}

          <button
            type="submit"
            className="w-full bg-[#2C1810] text-[#FDF8F3] py-2 rounded hover:bg-[#3C2A21] transition-colors font-medium"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
