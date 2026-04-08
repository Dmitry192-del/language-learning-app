'use client'

import { useEffect, useState } from 'react'
import useAuthStore from '@/store/authStore'
import api from '@/services/api'

export default function StatsPage() {
  const { user, fetchMe } = useAuthStore()
  const [achievements, setAchievements] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMe()
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const res = await api.get('/achievements/')
      setAchievements(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || isLoading) return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const earnedAchievements = achievements.filter(a => a.earned)
  const dailyGoal = 50
  const progress = Math.min((user.xp % dailyGoal) / dailyGoal * 100, 100)

  const levels = [
    { level: 'A1', min: 0, max: 100 },
    { level: 'A2', min: 100, max: 300 },
    { level: 'B1', min: 300, max: 600 },
    { level: 'B2', min: 600, max: 1000 },
    { level: 'C1', min: 1000, max: 1500 },
  ]
  const currentLevel = levels.find(l => l.level === user.level) || levels[0]
  const levelProgress = Math.min(
    ((user.xp - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100, 100
  )

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] p-8">
      <div className="max-w-4xl mx-auto">

        <div className="mb-8">
          <h2 className="text-3xl font-bold">Статистика 📊</h2>
          <p className="text-[var(--color-text-muted)] mt-1">Твой прогресс в обучении</p>
        </div>

        {/* Основные метрики */}
        <div className="grid grid-cols-4 gap-4 mb-6">
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
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-yellow-400">{earnedAchievements.length}</p>
            <p className="text-[var(--color-text-muted)] text-sm mt-1">Достижений</p>
          </div>
        </div>

        {/* Прогресс уровня */}
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-semibold">Прогресс уровня</p>
              <p className="text-[var(--color-text-muted)] text-sm mt-0.5">
                {user.level} → {levels[levels.findIndex(l => l.level === user.level) + 1]?.level || 'Максимум'}
              </p>
            </div>
            <span className="text-[var(--color-accent)] font-bold">
              {user.xp} / {currentLevel.max} XP
            </span>
          </div>
          <div className="h-3 bg-[var(--color-bg-input)] rounded-full overflow-hidden">
            <div
              className="h-3 bg-[var(--color-accent)] rounded-full transition-all duration-500"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
        </div>

        {/* Дневная цель */}
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-semibold">Дневная цель</p>
              <p className="text-[var(--color-text-muted)] text-sm mt-0.5">Заработай {dailyGoal} XP сегодня</p>
            </div>
            <span className="text-[var(--color-accent)] font-bold">
              {user.xp % dailyGoal} / {dailyGoal} XP
            </span>
          </div>
          <div className="h-3 bg-[var(--color-bg-input)] rounded-full overflow-hidden">
            <div
              className="h-3 bg-[var(--color-green)] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Достижения */}
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4">
            Последние достижения
          </h3>
          {earnedAchievements.length === 0 ? (
            <p className="text-[var(--color-text-muted)] text-sm">
              Пройди первый урок чтобы получить достижение!
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {earnedAchievements.map((a) => (
                <div
                  key={a.code}
                  className="flex items-center gap-3 bg-[var(--color-bg-input)] rounded-xl p-3"
                >
                  <span className="text-2xl">{a.icon}</span>
                  <div>
                    <p className="font-medium text-sm">{a.title}</p>
                    <p className="text-[var(--color-text-muted)] text-xs">{a.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}