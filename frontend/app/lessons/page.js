'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import ThemeToggle from '@/components/ThemeToggle'
import LogoutButton from '@/components/LogoutButton'
import api from '@/services/api'

const LESSON_TYPE_LABELS = {
  vocabulary: 'Словарный запас',
  grammar: 'Грамматика',
  phrases: 'Фразы',
}

const LESSON_TYPE_COLORS = {
  vocabulary: 'var(--color-accent)',
  grammar: 'var(--color-green)',
  phrases: 'var(--color-orange)',
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

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">

      {/* Navbar */}
      <nav className="border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
        <button onClick={() => router.push('/dashboard')} className="text-xl font-bold">
          LinguaAI
        </button>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LogoutButton />
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">

        {/* Заголовок */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Уроки</h2>
          <p className="text-[var(--color-text-muted)] mt-1">
            {user?.target_language?.toUpperCase()} · Уровень {user?.level}
          </p>
        </div>

        {/* Загрузка */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Список уроков */}
        {!isLoading && lessons.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[var(--color-text-muted)]">Уроков пока нет</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {lessons.map((lesson, index) => (
            <button
              key={lesson.id}
              onClick={() => router.push(`/lessons/${lesson.id}`)}
              className="bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-accent)] rounded-2xl p-6 text-left transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-input)] flex items-center justify-center text-xl font-bold text-[var(--color-accent)]">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{lesson.title}</h3>
                    <p className="text-[var(--color-text-muted)] text-sm mt-1">{lesson.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs px-3 py-1 rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)]">
                    {LESSON_TYPE_LABELS[lesson.lesson_type]}
                  </span>
                  <span className="text-sm text-[var(--color-text-muted)]">
                    {lesson.word_count} слов
                  </span>
                  <span className="text-sm font-semibold text-[var(--color-accent)]">
                    +{lesson.xp_reward} XP
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

      </main>
    </div>
  )
}