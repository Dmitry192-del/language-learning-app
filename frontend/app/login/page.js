'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import useAuthStore from '@/store/authStore'
import ThemeToggle from '@/components/ThemeToggle'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading, error, clearError } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e) => {
    clearError()
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const success = await login(form.email, form.password)
    if (success) router.push('/dashboard')
  }

  const inputStyle = {
    width: '100%',
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: 'var(--text)',
    outline: 'none',
    fontSize: '14px',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', position: 'relative' }}>

      {/* Переключатель темы — правый верхний угол */}
      <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
        <ThemeToggle />
      </div>

      <div style={{ width: '100%', maxWidth: '448px' }}>

        {/* Логотип */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.5px' }}>LinguaAI</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '14px' }}>Учи языки с искусственным интеллектом</p>
        </div>

        {/* Карточка */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '24px' }}>Войти в аккаунт</h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <div>
              <label style={{ color: 'var(--text-muted)', fontSize: '14px', display: 'block', marginBottom: '6px' }}>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <div>
              <label style={{ color: 'var(--text-muted)', fontSize: '14px', display: 'block', marginBottom: '6px' }}>Пароль</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Введи пароль"
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '12px 16px' }}>
                <p style={{ color: '#f87171', fontSize: '14px' }}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                background: 'var(--accent)',
                color: '#fff',
                fontWeight: 600,
                borderRadius: '12px',
                padding: '12px',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1,
                fontSize: '15px',
                transition: 'opacity 0.2s',
              }}
            >
              {isLoading ? 'Входим...' : 'Войти'}
            </button>

          </form>

          <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', marginTop: '24px' }}>
            Нет аккаунта?{' '}
            <Link href="/register" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
              Зарегистрироваться
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}
