'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import LogoutButton from '@/components/LogoutButton'

export default function DashboardPage() {
  const { user, fetchMe } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    fetchMe()
  }, [])

  if (!user) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Navbar */}
      <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">LinguaAI</h1>
        <div className="flex items-center gap-4">
          <span className="text-zinc-400 text-sm">{user.email}</span>
          <LogoutButton />
        </div>
      </nav>

      {/* Контент */}
      <main className="max-w-4xl mx-auto px-6 py-10">

        {/* Приветствие */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold">Привет, {user.username}! 👋</h2>
          <p className="text-zinc-400 mt-1">Продолжай учиться каждый день</p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-400 text-sm mb-1">Опыт</p>
            <p className="text-3xl font-bold text-violet-400">{user.xp} XP</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-400 text-sm mb-1">Серия дней</p>
            <p className="text-3xl font-bold text-orange-400">{user.streak} 🔥</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-400 text-sm mb-1">Уровень</p>
            <p className="text-3xl font-bold text-green-400">{user.level}</p>
          </div>
        </div>

        {/* Быстрые действия */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => router.push('/lessons')}
            className="bg-zinc-900 border border-zinc-800 hover:border-violet-500 rounded-2xl p-6 text-left transition group"
          >
            <div className="text-3xl mb-3">📚</div>
            <h3 className="text-lg font-semibold text-white group-hover:text-violet-400 transition">Уроки</h3>
            <p className="text-zinc-400 text-sm mt-1">Изучай новые слова и грамматику</p>
          </button>

          <button
            onClick={() => router.push('/vocabulary')}
            className="bg-zinc-900 border border-zinc-800 hover:border-violet-500 rounded-2xl p-6 text-left transition group"
          >
            <div className="text-3xl mb-3">🃏</div>
            <h3 className="text-lg font-semibold text-white group-hover:text-violet-400 transition">Карточки</h3>
            <p className="text-zinc-400 text-sm mt-1">Повторяй слова с флэшкартами</p>
          </button>

          <button
            onClick={() => router.push('/practice')}
            className="bg-zinc-900 border border-zinc-800 hover:border-violet-500 rounded-2xl p-6 text-left transition group"
          >
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="text-lg font-semibold text-white group-hover:text-violet-400 transition">AI диалоги</h3>
            <p className="text-zinc-400 text-sm mt-1">Практикуй язык с искусственным интеллектом</p>
          </button>

          <button
            onClick={() => router.push('/stats')}
            className="bg-zinc-900 border border-zinc-800 hover:border-violet-500 rounded-2xl p-6 text-left transition group"
          >
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-white group-hover:text-violet-400 transition">Статистика</h3>
            <p className="text-zinc-400 text-sm mt-1">Смотри свой прогресс</p>
          </button>
        </div>

      </main>
    </div>
  )
}