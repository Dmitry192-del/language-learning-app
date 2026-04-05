'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import api from '@/services/api'

const LANGUAGES = {
  en: 'Английский', de: 'Немецкий',
  fr: 'Французский', es: 'Испанский',
  it: 'Итальянский', zh: 'Китайский',
}

export default function VocabularyPage() {
  const { user, fetchMe } = useAuthStore()
  const router = useRouter()
  const [sets, setSets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newSet, setNewSet] = useState({ title: '', language: 'en' })

  useEffect(() => {
    fetchMe()
    loadSets()
  }, [])

  const loadSets = async () => {
    try {
      const res = await api.get('/flashcards/')
      setSets(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!newSet.title) return
    try {
      const res = await api.post('/flashcards/', newSet)
      setSets([...sets, res.data])
      setNewSet({ title: '', language: 'en' })
      setShowCreate(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/flashcards/${id}/`)
      setSets(sets.filter(s => s.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">

      

      <main className="max-w-4xl mx-auto px-6 py-10">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Карточки</h2>
            <p className="text-[var(--color-text-muted)] mt-1">Твои наборы для повторения</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold rounded-xl px-5 py-2.5 transition"
          >
            + Новый набор
          </button>
        </div>

        {/* Форма создания */}
        {showCreate && (
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Новый набор</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={newSet.title}
                onChange={(e) => setNewSet({ ...newSet, title: e.target.value })}
                placeholder="Название набора"
                className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)] transition"
              />
              <select
                value={newSet.language}
                onChange={(e) => setNewSet({ ...newSet, language: e.target.value })}
                className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)] transition cursor-pointer"
              >
                {Object.entries(LANGUAGES).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 border border-[var(--color-border)] rounded-xl py-3 text-[var(--color-text-muted)] hover:border-[var(--color-accent)] transition"
                >
                  Отмена
                </button>
                <button
                  onClick={handleCreate}
                  className="flex-1 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold rounded-xl py-3 transition"
                >
                  Создать
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Загрузка */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Пусто */}
        {!isLoading && sets.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🃏</p>
            <p className="text-[var(--color-text-muted)]">Наборов пока нет — создай первый!</p>
          </div>
        )}

        {/* Список наборов */}
        <div className="grid grid-cols-1 gap-4">
          {sets.map((set) => (
            <div
              key={set.id}
              className="bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-accent)] rounded-2xl p-6 transition flex items-center justify-between"
            >
              <button
                onClick={() => router.push(`/vocabulary/${set.id}`)}
                className="text-left flex-1"
              >
                <h3 className="text-lg font-semibold">{set.title}</h3>
                <p className="text-[var(--color-text-muted)] text-sm mt-1">
                  {LANGUAGES[set.language]} · {set.card_count} карточек
                </p>
              </button>
              <button
                onClick={() => handleDelete(set.id)}
                className="text-[var(--color-text-muted)] hover:text-red-400 transition text-sm ml-4"
              >
                Удалить
              </button>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}