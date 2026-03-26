'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Geist } from 'next/font/google'
import './globals.css'
import useAuthStore from '@/store/authStore'

const geist = Geist({ subsets: ['latin'] })

const publicRoutes = ['/login', '/register']

export default function RootLayout({ children }) {
  const { user, fetchMe } = useAuthStore()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token && !user) {
      fetchMe()
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const isPublic = publicRoutes.includes(pathname)
    if (!token && !isPublic) {
      router.push('/login')
    }
    if (token && isPublic) {
      router.push('/dashboard')
    }
  }, [pathname])

  return (
    <html lang="ru">
      <body className={geist.className}>{children}</body>
    </html>
  )
}