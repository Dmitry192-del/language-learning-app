'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import LogoutButton from '@/components/LogoutButton'
import ThemeToggle from '@/components/ThemeToggle'
import api from '@/services/api'

const LANGUAGES = {
  en: 'Английский 🇬🇧',
  de: 'Немецкий 🇩🇪',
  fr: 'Французский 🇫🇷',
  es: 'Испанский 🇪🇸',
  it: 'Итальянский 🇮🇹',
  zh: 'Китайский 🇨🇳',
}

export default function ProfilePage() {
  const { user, fetchMe } = useAuthStore()
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({ target_language: '', level: '' })

  useEffect(() => {
    fetchMe()
  }, [])

  useEffect(() => {
    if (user) {
      setForm({ target_language: user.target_language, level: user.level })
    }
  }, [user])

  const handleSave = async () => {
    await api.post('/auth/onboarding/', { ...form, native_language: 'ru' })
    await fetchMe()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!user) return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">

      {/* Navbar */}
      <nav className="border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => router.push('/dashboard')}
          className="text-xl font-bold text-[var(--color-text)] bg-transparent border-none cursor-pointer"
        >
          LinguaAI
        </button>
        <div className="flex items-center gap-3">
          <span className="text-[var(--color-text-muted)] text-sm">{user.email}</span>
          <ThemeToggle />
          <LogoutButton />
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-8">Профиль</h2>

        {/* Аватар */}
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 mb-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-2xl font-bold text-white shrink-0">
            {user.username[0].toUpperCase()}
          </div>
          <div>
            <p className="text-xl font-semibold">{user.username}</p>
            <p className="text-[var(--color-text-muted)] text-sm">{user.email}</p>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-[var(--color-accent)]">{user.xp}</p>
            <p className="text-[var(--color-text-muted)] text-xs mt-1">XP</p>
          </div>
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-[var(--color-orange)]">{user.streak}</p>
            <p className="text-[var(--color-text-muted)] text-xs mt-1">Серия дней</p>
          </div>
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-[var(--color-green)]">{user.level}</p>
            <p className="text-[var(--color-text-muted)] text-xs mt-1">Уровень</p>
          </div>
        </div>

        {/* Настройки */}
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Настройки обучения</h3>

          <div className="mb-4">
            <label className="text-[var(--color-text-muted)] text-sm block mb-2">Язык обучения</label>
            <select
              value={form.target_language}
              onChange={(e) => setForm({ ...form, target_language: e.target.value })}
              className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)] transition cursor-pointer"
            >
              {Object.entries(LANGUAGES).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="text-[var(--color-text-muted)] text-sm block mb-2">Уровень</label>
            <select
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
              className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)] transition cursor-pointer"
            >
              {['A1', 'A2', 'B1', 'B2', 'C1'].map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold rounded-xl py-3 transition"
          >
            {saved ? '✅ Сохранено!' : 'Сохранить'}
          </button>
        </div>

      </main>
    </div>
  )
}