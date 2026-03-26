'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import useAuthStore from '@/store/authStore'

export default function RegisterPage() {
  const router = useRouter()
  const { register, isLoading, error, clearError } = useAuthStore()
  const [form, setForm] = useState({ email: '', username: '', password: '' })

  const handleChange = (e) => {
    clearError()
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const success = await register(form.email, form.username, form.password)
    if (success) router.push('/onboarding')
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Логотип */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white tracking-tight">LinguaAI</h1>
          <p className="text-zinc-400 mt-2 text-sm">Учи языки с искусственным интеллектом</p>
        </div>

        {/* Карточка */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Создать аккаунт</h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="text-zinc-400 text-sm mb-1 block">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition"
              />
            </div>

            <div>
              <label className="text-zinc-400 text-sm mb-1 block">Имя пользователя</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="username"
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition"
              />
            </div>

            <div>
              <label className="text-zinc-400 text-sm mb-1 block">Пароль</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Минимум 6 символов"
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition"
              />
            </div>

            {/* Ошибка */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm">
                  {typeof error === 'object' ? Object.values(error).flat().join(' ') : error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 transition"
            >
              {isLoading ? 'Создаём аккаунт...' : 'Зарегистрироваться'}
            </button>

          </form>

          <p className="text-zinc-500 text-sm text-center mt-6">
            Уже есть аккаунт?{' '}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 transition">
              Войти
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}