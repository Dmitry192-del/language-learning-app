'use client'

import { useEffect, useState } from 'react'
import useAuthStore from '@/store/authStore'
import api from '@/services/api'

const LANGUAGES = {
  en: 'Английский 🇬🇧',
  de: 'Немецкий 🇩🇪',
  fr: 'Французский 🇫🇷',
  es: 'Испанский 🇪🇸',
  it: 'Итальянский 🇮🇹',
  zh: 'Китайский 🇨🇳',
}

const glassCard = {
  background: 'rgba(255, 255, 255, 0.04)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '20px',
}

export default function ProfilePage() {
  const { user, fetchMe } = useAuthStore()
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({ target_language: '', level: '' })

  useEffect(() => { fetchMe() }, [])
  useEffect(() => {
    if (user) setForm({ target_language: user.target_language, level: user.level })
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
    <div className="min-h-screen text-[var(--color-text)] p-8 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0d0f1a 0%, #13162b 50%, #0d0f1a 100%)' }}
    >
      {/* Фоновые glow пятна */}
      <div className="absolute top-10 left-1/3 w-80 h-80 rounded-full opacity-[0.07] blur-3xl pointer-events-none"
        style={{ background: '#7c3aed' }} />
      <div className="absolute bottom-10 right-1/3 w-60 h-60 rounded-full opacity-[0.07] blur-3xl pointer-events-none"
        style={{ background: '#7c3aed' }} />

      <div className="max-w-xl mx-auto relative z-10">
        <h2 className="text-3xl font-bold mb-6">Профиль</h2>

        {/* Аватар */}
        <div style={glassCard} className="p-6 mb-4 flex items-center gap-5">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-violet-600 flex items-center justify-center text-2xl font-bold text-white">
              {user.username[0].toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-[#13162b]" />
          </div>
          <div>
            <p className="text-xl font-bold">{user.username}</p>
            <p className="text-[var(--color-text-muted)] text-sm mt-0.5">{user.email}</p>
            <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-violet-600/20 text-violet-400 border border-violet-600/30">
              {LANGUAGES[user.target_language]}
            </span>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { value: user.xp, label: 'XP', color: 'text-[var(--color-accent)]' },
            { value: user.streak + ' 🔥', label: 'Серия дней', color: 'text-[var(--color-orange)]' },
            { value: user.level, label: 'Уровень', color: 'text-[var(--color-green)]' },
          ].map((stat, i) => (
            <div key={i}
              style={glassCard}
              className="p-5 text-center hover:border-white/20 transition-all hover:shadow-lg hover:shadow-violet-500/10 cursor-default"
            >
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-[var(--color-text-muted)] text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Микро-достижения */}
        <div style={glassCard} className="p-5 mb-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Следующие достижения
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: '🎯', label: 'Первый шаг', done: user.xp >= 10 },
              { icon: '🔥', label: '3 дня подряд', done: user.streak >= 3 },
              { icon: '⭐', label: '100 XP', done: user.xp >= 100 },
            ].map((ach, i) => (
              <div key={i}
                className="rounded-2xl p-3 text-center transition-all"
                style={{
                  background: ach.done ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)',
                  border: ach.done ? '1px solid rgba(124,58,237,0.35)' : '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <p className="text-2xl mb-1" style={{ filter: ach.done ? 'none' : 'grayscale(0.6) opacity(0.6)' }}>
                  {ach.icon}
                </p>
                <p className="text-xs text-gray-400">{ach.label}</p>
                {ach.done && <p className="text-xs text-violet-400 mt-1 font-medium">✓</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Настройки */}
        <div style={glassCard} className="p-6">
          <h3 className="text-lg font-semibold mb-5">Настройки обучения</h3>

          <div className="mb-4">
            <label className="text-gray-400 text-sm block mb-2">Язык обучения</label>
            <select
              value={form.target_language}
              onChange={(e) => setForm({ ...form, target_language: e.target.value })}
              className="w-full rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none transition cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {Object.entries(LANGUAGES).map(([code, name]) => (
                <option key={code} value={code} style={{ background: '#13162b' }}>{name}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="text-gray-400 text-sm block mb-2">Уровень</label>
            <select
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
              className="w-full rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none transition cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {['A1', 'A2', 'B1', 'B2', 'C1'].map((l) => (
                <option key={l} value={l} style={{ background: '#13162b' }}>{l}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSave}
            className="w-full text-white font-semibold rounded-xl py-3 transition-all"
            style={{
              background: saved
                ? 'linear-gradient(135deg, #16a34a, #15803d)'
                : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              boxShadow: saved
                ? '0 0 20px rgba(34,197,94,0.3)'
                : '0 0 20px rgba(124,58,237,0.3)',
            }}
          >
            {saved ? '✅ Сохранено!' : 'Сохранить изменения'}
          </button>
        </div>

      </div>
    </div>
  )
}