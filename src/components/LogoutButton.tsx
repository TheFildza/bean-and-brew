'use client'
import { logoutUserAction } from '@/app/(auth)/actions'

export function LogoutButton() {
  return (
    <form action={logoutUserAction} className="inline">
      <button type="submit" className="text-sm text-[#3C2A21]/70 hover:text-[#2C1810] transition-colors">
        Sign Out
      </button>
    </form>
  )
}
