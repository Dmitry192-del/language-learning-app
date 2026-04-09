'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'

const LANGUAGES = {
  en: 'Английский', de: 'Немецкий',
  fr: 'Французский', es: 'Испанский',
  it: 'Итальянский', zh: 'Китайский',
}

const WORDS_OF_DAY = [
  { word: 'Serendipity', translation: 'Счастливая случайность', example: 'It was pure serendipity that we met.' },
  { word: 'Eloquent', translation: 'Красноречивый', example: 'She gave an eloquent speech.' },
  { word: 'Resilience', translation: 'Стойкость', example: 'His resilience helped him recover.' },
  { word: 'Wanderlust', translation: 'Страсть к путешествиям', example: 'Wanderlust took her across the world.' },
  { word: 'Ephemeral', translation: 'Мимолётный', example: 'Fame can be ephemeral.' },
  { word: 'Melancholy', translation: 'Меланхолия', example: 'A sense of melancholy filled the room.' },
  { word: 'Tenacious', translation: 'Упорный', example: 'She was tenacious in her pursuit.' },
]

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
  const todayXP = user.xp % dailyGoal
  const progress = Math.min((todayXP / dailyGoal) * 100, 100)
  const wordOfDay = WORDS_OF_DAY[new Date().getDay() % WORDS_OF_DAY.length]

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] p-8">
      <div className="max-w-6xl mx-auto flex gap-8">

        {/* Левая часть */}
        <div className="flex-1">

          {/* Приветствие */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Привет, {user.username}! 👋</h2>
            <p className="text-[var(--color-text-muted)] mt-1">
              Изучаешь {LANGUAGES[user.target_language]} · Уровень {user.level}
            </p>
          </div>

          {/* Дневная цель */}
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold">Дневная цель</p>
                <p className="text-[var(--color-text-muted)] text-sm mt-0.5">
                  {todayXP >= dailyGoal ? '🎉 Цель выполнена!' : `Осталось ${dailyGoal - todayXP} XP`}
                </p>
              </div>
              <span className="text-xl font-bold text-[var(--color-accent)]">
                {todayXP} / {dailyGoal} XP
              </span>
            </div>
            <div className="h-3 bg-[var(--color-bg-input)] rounded-full overflow-hidden">
              <div
                className="h-3 bg-[var(--color-accent)] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Streak + кнопка продолжить */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5 flex items-center gap-4">
              <span className="text-4xl">🔥</span>
              <div>
                <p className="text-2xl font-bold text-[var(--color-orange)]">{user.streak}</p>
                <p className="text-[var(--color-text-muted)] text-sm">Дней подряд</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/lessons')}
              className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-bold rounded-2xl p-5 flex items-center justify-center gap-3 transition"
            >
              <span className="text-2xl">▶️</span>
              <span className="text-lg">Продолжить обучение</span>
            </button>
          </div>

          {/* Задания дня */}
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4">Задания дня</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/20 flex items-center justify-center">⚡</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Заработай 50 XP</p>
                  <div className="h-2 bg-[var(--color-bg-input)] rounded-full mt-1.5">
                    <div className="h-2 bg-[var(--color-accent)] rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <span className="text-xs text-[var(--color-text-muted)]">{todayXP}/50</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-orange)]/20 flex items-center justify-center">🔥</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Серия 7 дней</p>
                  <div className="h-2 bg-[var(--color-bg-input)] rounded-full mt-1.5">
                    <div className="h-2 bg-[var(--color-orange)] rounded-full transition-all" style={{ width: `${Math.min((user.streak / 7) * 100, 100)}%` }} />
                  </div>
                </div>
                <span className="text-xs text-[var(--color-text-muted)]">{user.streak}/7</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-green)]/20 flex items-center justify-center">📚</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Пройди урок</p>
                  <div className="h-2 bg-[var(--color-bg-input)] rounded-full mt-1.5">
                    <div className="h-2 bg-[var(--color-green)] rounded-full" style={{ width: todayXP > 0 ? '100%' : '0%' }} />
                  </div>
                </div>
                <span className="text-xs text-[var(--color-text-muted)]">{todayXP > 0 ? '✅' : '0/1'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Правая панель */}
        <div className="w-72 shrink-0">

          {/* Слово дня */}
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5 mb-4">
            <h3 className="font-bold mb-3">💡 Слово дня</h3>
            <div className="bg-[var(--color-bg-input)] rounded-xl p-4 mb-3">
              <p className="text-2xl font-bold text-[var(--color-accent)] mb-1">{wordOfDay.word}</p>
              <p className="text-[var(--color-text-muted)] text-sm mb-2">{wordOfDay.translation}</p>
              <p className="text-xs text-[var(--color-text-muted)] italic">"{wordOfDay.example}"</p>
            </div>
            <button
              onClick={() => router.push('/vocabulary')}
              className="w-full border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white rounded-xl py-2 text-sm font-medium transition"
            >
              + Добавить в карточки
            </button>
          </div>

          {/* Быстрый доступ */}
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5">
            <h3 className="font-bold mb-3">⚡ Быстрый доступ</h3>
            <div className="space-y-2">
              {[
                { href: '/review', icon: '🔄', label: 'Повторить карточки' },
                { href: '/practice', icon: '🤖', label: 'AI диалог' },
                { href: '/achievements', icon: '🏆', label: 'Достижения' },
              ].map((item) => (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--color-bg-input)] transition text-left"
                >
                  <span>{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}