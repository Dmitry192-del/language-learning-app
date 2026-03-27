'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import LogoutButton from '@/components/LogoutButton'
import ThemeToggle from '@/components/ThemeToggle'

export default function DashboardPage() {
  const { user, fetchMe } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    fetchMe()
  }, [])

  if (!user) return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">

      {/* Navbar */}
      <nav className="border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">LinguaAI</h1>
        <div className="flex items-center gap-3">
          <span className="text-[var(--color-text-muted)] text-sm">{user.email}</span>
          <ThemeToggle />
          <LogoutButton />
        </div>
      </nav>

      {/* Контент */}
      <main className="max-w-4xl mx-auto px-6 py-10">

        {/* Приветствие */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold">Привет, {user.username}! 👋</h2>
          <p className="text-[var(--color-text-muted)] mt-1">Продолжай учиться каждый день</p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6">
            <p className="text-[var(--color-text-muted)] text-sm mb-1">Опыт</p>
            <p className="text-3xl font-bold text-[var(--color-accent)]">{user.xp} XP</p>
          </div>
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6">
            <p className="text-[var(--color-text-muted)] text-sm mb-1">Серия дней</p>
            <p className="text-3xl font-bold text-[var(--color-orange)]">{user.streak} 🔥</p>
          </div>
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6">
            <p className="text-[var(--color-text-muted)] text-sm mb-1">Уровень</p>
            <p className="text-3xl font-bold text-[var(--color-green)]">{user.level}</p>
          </div>
        </div>

        {/* Быстрые действия */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { href: '/lessons', icon: '📚', title: 'Уроки', desc: 'Изучай новые слова и грамматику' },
            { href: '/vocabulary', icon: '🃏', title: 'Карточки', desc: 'Повторяй слова с флэшкартами' },
            { href: '/practice', icon: '🤖', title: 'AI диалоги', desc: 'Практикуй язык с искусственным интеллектом' },
            { href: '/stats', icon: '📊', title: 'Статистика', desc: 'Смотри свой прогресс' },
          ].map((item) => (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className="bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-accent)] rounded-2xl p-6 text-left transition cursor-pointer"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-[var(--color-text-muted)] text-sm mt-1">{item.desc}</p>
            </button>
          ))}
        </div>

      </main>
    </div>
  )
}