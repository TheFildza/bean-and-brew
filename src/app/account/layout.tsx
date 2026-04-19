import { redirect } from 'next/navigation'
import { getUserFromSession } from '@/lib/userAuth'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserFromSession()
  if (!user) redirect('/login?next=/account')
  return <>{children}</>
}
