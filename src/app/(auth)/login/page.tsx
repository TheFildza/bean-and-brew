import { loginUserAction } from '@/app/(auth)/actions'

interface Props {
  searchParams: Promise<{ error?: string; next?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { error, next } = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8">
        <h1 className="font-serif text-3xl font-bold text-[#2C1810] text-center mb-2">Welcome back</h1>
        <p className="text-center text-[#3C2A21] mb-8">Sign in to your account</p>

        <form action={loginUserAction} className="space-y-4">
          <input type="hidden" name="next" value={next ?? '/'} />
          <div>
            <label className="block text-sm font-medium text-[#2C1810] mb-1">Email</label>
            <input type="email" name="email" required autoFocus className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2C1810] mb-1">Password</label>
            <input type="password" name="password" required className="input" />
          </div>
          {error && <p className="text-sm text-red-600">Incorrect email or password.</p>}
          <button type="submit" className="w-full bg-[#2C1810] text-[#FDF8F3] py-2 rounded hover:bg-[#3C2A21] transition-colors font-medium">
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-[#3C2A21] mt-6">
          No account?{' '}
          <a href="/register" className="text-[#2C1810] font-medium hover:underline">Register</a>
        </p>
      </div>
    </div>
  )
}
