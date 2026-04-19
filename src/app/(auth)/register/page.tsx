import { registerAction } from '@/app/(auth)/actions'

interface Props {
  searchParams: Promise<{ error?: string }>
}

export default async function RegisterPage({ searchParams }: Props) {
  const { error } = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8">
        <h1 className="font-serif text-3xl font-bold text-[#2C1810] text-center mb-2">Create account</h1>
        <p className="text-center text-[#3C2A21] mb-8">Join B & B</p>

        <form action={registerAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2C1810] mb-1">Name</label>
            <input type="text" name="name" className="input" placeholder="Optional" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2C1810] mb-1">Email *</label>
            <input type="email" name="email" required autoFocus className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2C1810] mb-1">Password *</label>
            <input type="password" name="password" required minLength={6} className="input" />
            <p className="text-xs text-[#3C2A21]/60 mt-1">Minimum 6 characters</p>
          </div>
          {error === 'exists' && <p className="text-sm text-red-600">Email already registered.</p>}
          {error === 'invalid' && <p className="text-sm text-red-600">Please check your details.</p>}
          <button type="submit" className="w-full bg-[#2C1810] text-[#FDF8F3] py-2 rounded hover:bg-[#3C2A21] transition-colors font-medium">
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-[#3C2A21] mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-[#2C1810] font-medium hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  )
}
