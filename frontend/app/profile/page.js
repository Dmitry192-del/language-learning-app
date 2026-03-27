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

const selectStyle = {
  width: '100%',
  background: 'var(--bg-input)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  padding: '12px 16px',
  color: 'var(--text)',
  outline: 'none',
  fontSize: '14px',
  cursor: 'pointer',
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
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>

      {/* Navbar */}
      <nav style={{ borderBottom: '1px solid var(--border)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => router.push('/dashboard')}
          style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          LinguaAI
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{user.email}</span>
          <ThemeToggle />
          <LogoutButton />
        </div>
      </nav>

      <main style={{ maxWidth: '672px', margin: '0 auto', padding: '40px 24px' }}>
        <h2 style={{ fontSize: '30px', fontWeight: 700, marginBottom: '32px' }}>Профиль</h2>

        {/* Аватар */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {user.username[0].toUpperCase()}
          </div>
          <div>
            <p style={{ fontSize: '20px', fontWeight: 600 }}>{user.username}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{user.email}</p>
          </div>
        </div>

        {/* Статистика */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
            <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent)' }}>{user.xp}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>XP</p>
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
            <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--orange)' }}>{user.streak}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>Серия дней</p>
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
            <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--green)' }}>{user.level}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>Уровень</p>
          </div>
        </div>

        {/* Настройки */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Настройки обучения</h3>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: 'var(--text-muted)', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Язык обучения</label>
            <select
              value={form.target_language}
              onChange={(e) => setForm({ ...form, target_language: e.target.value })}
              style={selectStyle}
            >
              {Object.entries(LANGUAGES).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ color: 'var(--text-muted)', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Уровень</label>
            <select
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
              style={selectStyle}
            >
              {['A1', 'A2', 'B1', 'B2', 'C1'].map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSave}
            style={{
              width: '100%',
              background: saved ? '#16a34a' : 'var(--accent)',
              color: '#fff',
              fontWeight: 600,
              borderRadius: '12px',
              padding: '12px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '15px',
              transition: 'background 0.2s',
            }}
          >
            {saved ? '✅ Сохранено!' : 'Сохранить'}
          </button>
        </div>

      </main>
    </div>
  )
}
