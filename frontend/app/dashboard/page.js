'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import LogoutButton from '@/components/LogoutButton'
import ThemeToggle from '@/components/ThemeToggle'

export default function DashboardPage() {
  const { user, fetchMe } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    fetchMe()
  }, [])

  if (!user) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>

      {/* Navbar */}
      <nav style={{ borderBottom: '1px solid var(--border)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>LinguaAI</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{user.email}</span>
          <ThemeToggle />
          <LogoutButton />
        </div>
      </nav>

      {/* Контент */}
      <main style={{ maxWidth: '896px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Приветствие */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '30px', fontWeight: 700, color: 'var(--text)' }}>Привет, {user.username}! 👋</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Продолжай учиться каждый день</p>
        </div>

        {/* Статистика */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>Опыт</p>
            <p style={{ fontSize: '30px', fontWeight: 700, color: 'var(--accent)' }}>{user.xp} XP</p>
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>Серия дней</p>
            <p style={{ fontSize: '30px', fontWeight: 700, color: 'var(--orange)' }}>{user.streak} 🔥</p>
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>Уровень</p>
            <p style={{ fontSize: '30px', fontWeight: 700, color: 'var(--green)' }}>{user.level}</p>
          </div>
        </div>

        {/* Быстрые действия */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {[
            { href: '/lessons', icon: '📚', title: 'Уроки', desc: 'Изучай новые слова и грамматику' },
            { href: '/vocabulary', icon: '🃏', title: 'Карточки', desc: 'Повторяй слова с флэшкартами' },
            { href: '/practice', icon: '🤖', title: 'AI диалоги', desc: 'Практикуй язык с искусственным интеллектом' },
            { href: '/stats', icon: '📊', title: 'Статистика', desc: 'Смотри свой прогресс' },
          ].map((item) => (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
                color: 'var(--text)',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ fontSize: '30px', marginBottom: '12px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: 600 }}>{item.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>{item.desc}</p>
            </button>
          ))}
        </div>

      </main>
    </div>
  )
}
