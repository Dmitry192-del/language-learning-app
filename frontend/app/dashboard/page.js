'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'

const LANGUAGES = {
  en: 'Английский', de: 'Немецкий',
  fr: 'Французский', es: 'Испанский',
  it: 'Итальянский', zh: 'Китайский',
}

export default function DashboardPage() {
  const { user, fetchMe } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    fetchMe()
  }, [])

  if (!user) return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const dailyGoal = 50
  const progress = Math.min((user.xp % dailyGoal) / dailyGoal * 100, 100)

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] p-8">
      <div className="max-w-6xl mx-auto flex gap-8">

        {/* Левая часть */}
        <div className="flex-1">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Привет, {user.username}! 👋</h2>
            <p className="text-[var(--color-text-muted)] mt-1">
              Изучаешь {LANGUAGES[user.target_language]} · Уровень {user.level}
            </p>
          </div>

          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold">Дневная цель</p>
                <p className="text-[var(--color-text-muted)] text-sm mt-0.5">Заработай {dailyGoal} XP сегодня</p>
              </div>
              <span className="text-2xl font-bold text-[var(--color-accent)]">
                {user.xp % dailyGoal} / {dailyGoal} XP
              </span>
            </div>
            <div className="h-3 bg-[var(--color-bg-input)] rounded-full overflow-hidden">
              <div className="h-3 bg-[var(--color-accent)] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold text-[var(--color-accent)]">{user.xp}</p>
              <p className="text-[var(--color-text-muted)] text-sm mt-1">Всего XP</p>
            </div>
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold text-[var(--color-orange)]">{user.streak} 🔥</p>
              <p className="text-[var(--color-text-muted)] text-sm mt-1">Дней подряд</p>
            </div>
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold text-[var(--color-green)]">{user.level}</p>
              <p className="text-[var(--color-text-muted)] text-sm mt-1">Уровень</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-violet-600/20 to-violet-800/10 border border-violet-500/20 rounded-2xl p-6">
            <p className="text-lg font-semibold mb-1">
              {user.streak > 0
                ? `🔥 ${user.streak} ${user.streak === 1 ? 'день' : 'дней'} подряд — так держать!`
                : '🚀 Начни сегодня — первый шаг к новому языку!'}
            </p>
            <p className="text-[var(--color-text-muted)] text-sm">
              {user.xp === 0
                ? 'Пройди первый урок чтобы начать прогресс'
                : `Ты заработал уже ${user.xp} XP — продолжай в том же духе!`}
            </p>
          </div>
        </div>

        {/* Правая панель */}
        <div className="w-80 shrink-0">

          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5 mb-4">
            <h3 className="font-bold text-lg mb-4">Задания дня</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/20 flex items-center justify-center text-lg">⚡</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Заработай 50 XP</p>
                  <div className="h-2 bg-[var(--color-bg-input)] rounded-full mt-1.5">
                    <div className="h-2 bg-[var(--color-accent)] rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <span className="text-xs text-[var(--color-text-muted)]">{user.xp % dailyGoal}/50</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-orange)]/20 flex items-center justify-center text-lg">🔥</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Серия 7 дней</p>
                  <div className="h-2 bg-[var(--color-bg-input)] rounded-full mt-1.5">
                    <div className="h-2 bg-[var(--color-orange)] rounded-full transition-all" style={{ width: `${Math.min((user.streak / 7) * 100, 100)}%` }} />
                  </div>
                </div>
                <span className="text-xs text-[var(--color-text-muted)]">{user.streak}/7</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-green)]/20 flex items-center justify-center text-lg">📚</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Пройди урок</p>
                  <div className="h-2 bg-[var(--color-bg-input)] rounded-full mt-1.5">
                    <div className="h-2 bg-[var(--color-green)] rounded-full" style={{ width: user.xp > 0 ? '100%' : '0%' }} />
                  </div>
                </div>
                <span className="text-xs text-[var(--color-text-muted)]">{user.xp > 0 ? '1/1' : '0/1'}</span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5 mb-4">
            <h3 className="font-bold text-lg mb-3">Слово дня 💡</h3>
            <div className="bg-[var(--color-bg-input)] rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-[var(--color-accent)] mb-1">Serendipity</p>
              <p className="text-[var(--color-text-muted)] text-sm mb-2">Счастливая случайность</p>
              <p className="text-xs text-[var(--color-text-muted)] italic">"It was pure serendipity that we met"</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-600/20 to-violet-800/10 border border-violet-500/20 rounded-2xl p-5">
            <h3 className="font-bold text-lg mb-2">💬 Совет дня</h3>
            <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
              Занимайся хотя бы 15 минут в день — это эффективнее чем редкие долгие сессии. Регулярность важнее длительности!
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}