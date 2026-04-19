import Link from 'next/link'

export default function CancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-10">
        <h1 className="font-serif text-2xl font-bold text-[#2C1810] mb-3">Payment cancelled</h1>
        <p className="text-[#3C2A21] mb-8">Your cart is still saved. Come back whenever you're ready.</p>
        <Link href="/" className="bg-[#2C1810] text-[#FDF8F3] px-6 py-2 rounded hover:bg-[#3C2A21] transition-colors font-medium">
          Back to Shop
        </Link>
      </div>
    </div>
  )
}
