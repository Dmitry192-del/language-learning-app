'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import api from '@/services/api'

const MODULE_TITLES = {
  1: 'Модуль 1 — Основы',
  2: 'Модуль 2 — Мой мир',
  3: 'Модуль 3 — Выживание в городе',
  4: 'Модуль 4 — Возможности и планы',
}

const LESSON_TYPE_LABELS = {
  vocabulary: 'Словарный запас',
  grammar: 'Грамматика',
  phrases: 'Фразы',
}

export default function LessonsPage() {
  const { user, fetchMe } = useAuthStore()
  const router = useRouter()
  const [lessons, setLessons] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMe()
    loadLessons()
  }, [])

  const loadLessons = async () => {
    try {
      const res = await api.get('/lessons/')
      setLessons(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Группируем уроки по модулям
  const modules = lessons.reduce((acc, lesson) => {
    const mod = lesson.module || 1
    if (!acc[mod]) acc[mod] = []
    acc[mod].push(lesson)
    return acc
  }, {})

  const completedCount = lessons.filter(l => l.completed).length

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] p-8">
      <div className="max-w-3xl mx-auto">

        {/* Заголовок */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Уроки</h2>
          <p className="text-[var(--color-text-muted)] mt-1">
            {user?.target_language?.toUpperCase()} · Уровень {user?.level} · {completedCount}/{lessons.length} пройдено
          </p>
          {/* Общий прогресс */}
          {lessons.length > 0 && (
            <div className="h-2 bg-[var(--color-bg-input)] rounded-full mt-3">
              <div
                className="h-2 bg-[var(--color-accent)] rounded-full transition-all"
                style={{ width: `${(completedCount / lessons.length) * 100}%` }}
              />
            </div>
          )}
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Модули */}
        {Object.entries(modules).map(([moduleNum, moduleLessons]) => (
          <div key={moduleNum} className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-[var(--color-text-muted)]">
              {MODULE_TITLES[moduleNum] || `Модуль ${moduleNum}`}
            </h3>
            <div className="space-y-3">
              {moduleLessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => !lesson.locked && router.push(`/lessons/${lesson.id}`)}
                  disabled={lesson.locked}
                  className={`w-full rounded-2xl p-5 text-left transition ${
                    lesson.locked
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:border-[var(--color-accent)] cursor-pointer'
                  }`}
                  style={{
                    background: lesson.completed
                      ? 'rgba(34,197,94,0.08)'
                      : 'var(--color-bg-card)',
                    border: lesson.completed
                      ? '1px solid rgba(34,197,94,0.3)'
                      : '1px solid var(--color-border)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Номер/иконка */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${
                        lesson.completed
                          ? 'bg-green-500/20 text-green-400'
                          : lesson.locked
                          ? 'bg-[var(--color-bg-input)] text-[var(--color-text-muted)]'
                          : 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]'
                      }`}>
                        {lesson.completed ? '✓' : lesson.locked ? '🔒' : lesson.order}
                      </div>
                      <div>
                        <h3 className="font-semibold">{lesson.title}</h3>
                        <p className="text-[var(--color-text-muted)] text-sm mt-0.5">{lesson.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <span className="text-xs px-2 py-1 rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)]">
                        {LESSON_TYPE_LABELS[lesson.lesson_type]}
                      </span>
                      <span className="text-sm text-[var(--color-text-muted)]">
                        {lesson.word_count} слов
                      </span>
                      <span className={`text-sm font-semibold ${lesson.completed ? 'text-green-400' : 'text-[var(--color-accent)]'}`}>
                        {lesson.completed ? '✅' : `+${lesson.xp_reward} XP`}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  )
}