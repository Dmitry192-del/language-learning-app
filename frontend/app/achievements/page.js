'use client'

import { useEffect, useState } from 'react'
import api from '@/services/api'

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAchievements()
  }, [])

  const loadAchievements = async () => {
    try {
      const res = await api.get('/achievements/')
      setAchievements(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const earned = achievements.filter(a => a.earned)
  const locked = achievements.filter(a => !a.earned)

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] p-8">
      <div className="max-w-3xl mx-auto">

        <div className="mb-8">
          <h2 className="text-3xl font-bold">Достижения 🏆</h2>
          <p className="text-[var(--color-text-muted)] mt-1">
            {earned.length} из {achievements.length} получено
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Полученные */}
        {earned.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-[var(--color-green)]">✅ Получено</h3>
            <div className="grid grid-cols-1 gap-3">
              {earned.map((a) => (
                <div
                  key={a.code}
                  className="bg-[var(--color-bg-card)] border border-[var(--color-green)]/30 rounded-2xl p-5 flex items-center gap-4"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[var(--color-green)]/20 flex items-center justify-center text-3xl shrink-0">
                    {a.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{a.title}</p>
                    <p className="text-[var(--color-text-muted)] text-sm mt-0.5">{a.description}</p>
                  </div>
                  {a.xp_reward > 0 && (
                    <span className="text-[var(--color-accent)] font-bold text-sm shrink-0">
                      +{a.xp_reward} XP
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Заблокированные */}
        {locked.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-muted)]">🔒 Заблокировано</h3>
            <div className="grid grid-cols-1 gap-3">
              {locked.map((a) => (
                <div
                  key={a.code}
                  className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5 flex items-center gap-4 opacity-50"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[var(--color-bg-input)] flex items-center justify-center text-3xl shrink-0 grayscale">
                    {a.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{a.title}</p>
                    <p className="text-[var(--color-text-muted)] text-sm mt-0.5">{a.description}</p>
                  </div>
                  {a.xp_reward > 0 && (
                    <span className="text-[var(--color-text-muted)] font-bold text-sm shrink-0">
                      +{a.xp_reward} XP
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}