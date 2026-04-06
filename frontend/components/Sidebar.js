'use client'

import { useRouter, usePathname } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import ThemeToggle from '@/components/ThemeToggle'

const navItems = [
  { href: '/dashboard', icon: '🏠', label: 'Главная' },
  { href: '/lessons', icon: '📚', label: 'Уроки' },
  { href: '/vocabulary', icon: '🃏', label: 'Карточки' },
  { href: '/review', icon: '🔄', label: 'Повторение' },
  { href: '/practice', icon: '🤖', label: 'AI диалоги' },
  { href: '/stats', icon: '📊', label: 'Статистика' },
  { href: '/profile', icon: '👤', label: 'Профиль' },
]

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <aside className="w-64 min-h-screen bg-[var(--color-bg-card)] border-r border-[var(--color-border)] flex flex-col fixed left-0 top-0">

      {/* Логотип */}
      <div className="px-6 py-6 border-b border-[var(--color-border)]">
        <h1 className="text-xl font-bold text-[var(--color-text)]">LinguaAI</h1>
        <p className="text-[var(--color-text-muted)] text-xs mt-1">Учи языки с AI</p>
      </div>

      {/* Навигация */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
                isActive
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-input)] hover:text-[var(--color-text)]'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Нижняя часть */}
      <div className="px-4 py-4 border-t border-[var(--color-border)]">

        {/* Статистика пользователя */}
        {user && (
          <div className="bg-[var(--color-bg-input)] rounded-xl p-3 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white text-sm font-bold">
                {user.username[0].toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-[var(--color-text)] truncate">{user.username}</p>
                <p className="text-xs text-[var(--color-text-muted)] truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--color-accent)] font-semibold">{user.xp} XP</span>
              <span className="text-[var(--color-orange)]">{user.streak} 🔥</span>
              <span className="text-[var(--color-green)]">{user.level}</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="text-[var(--color-text-muted)] hover:text-red-400 transition text-sm"
          >
            Выйти
          </button>
        </div>
      </div>

    </aside>
  )
}