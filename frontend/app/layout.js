'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import useAuthStore from '@/store/authStore'
import { ThemeProvider } from '@/components/ThemeProvider'
import Sidebar from '@/components/Sidebar'

const font = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'] 
})

const publicRoutes = ['/login', '/register']

export default function RootLayout({ children }) {
  const { user, fetchMe } = useAuthStore()
  const pathname = usePathname()
  const router = useRouter()

  const isPublic = publicRoutes.includes(pathname)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token && !user) fetchMe()
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token && !isPublic) router.push('/login')
    if (token && isPublic) router.push('/dashboard')
  }, [pathname])

  return (
    <html lang="ru" data-theme="dark">
      <body className={font.className}>
        <ThemeProvider>
          {isPublic ? (
            children
          ) : (
            <div className="flex">
              <Sidebar />
              <main className="ml-64 flex-1 min-h-screen bg-[var(--color-bg)]">
                {children}
              </main>
            </div>
          )}
        </ThemeProvider>
      </body>
    </html>
  )
}