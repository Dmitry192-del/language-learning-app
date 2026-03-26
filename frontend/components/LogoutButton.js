'use client'

import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'

export default function LogoutButton() {
  const { logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="text-zinc-400 hover:text-white transition text-sm"
    >
      Выйти
    </button>
  )
}