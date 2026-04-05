'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import api from '@/services/api'

export default function FlashcardSetPage() {
  const router = useRouter()
  const { id } = useParams()
  const [set, setSet] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newCard, setNewCard] = useState({ word: '', translation: '', example: '' })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSet()
  }, [id])

  const loadSet = async () => {
    try {
      const res = await api.get(`/flashcards/${id}/`)
      setSet(res.data)
    } catch {
      router.push('/vocabulary')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCard = async () => {
    if (!newCard.word || !newCard.translation) return
    try {
      const res = await api.post(`/flashcards/${id}/cards/`, newCard)
      setSet({ ...set, cards: [...set.cards, res.data] })
      setNewCard({ word: '', translation: '', example: '' })
      setShowAdd(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteCard = async (cardId) => {
    try {
      await api.delete(`/flashcards/cards/${cardId}/`)
      setSet({ ...set, cards: set.cards.filter(c => c.id !== cardId) })
    } catch (err) {
      console.error(err)
    }
  }

  if (isLoading) return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">

    
      <main className="max-w-4xl mx-auto px-6 py-10">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">{set?.title}</h2>
            <p className="text-[var(--color-text-muted)] mt-1">{set?.cards.length} карточек</p>
          </div>
          <div className="flex gap-3">
            {set?.cards.length > 0 && (
              <button
                onClick={() => router.push(`/vocabulary/${id}/review`)}
                className="border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white font-semibold rounded-xl px-5 py-2.5 transition"
              >
                Повторять
              </button>
            )}
            <button
              onClick={() => setShowAdd(true)}
              className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold rounded-xl px-5 py-2.5 transition"
            >
              + Карточка
            </button>
          </div>
        </div>

        {/* Форма добавления */}
        {showAdd && (
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Новая карточка</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={newCard.word}
                onChange={(e) => setNewCard({ ...newCard, word: e.target.value })}
                placeholder="Слово"
                className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)] transition"
              />
              <input
                type="text"
                value={newCard.translation}
                onChange={(e) => setNewCard({ ...newCard, translation: e.target.value })}
                placeholder="Перевод"
                className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)] transition"
              />
              <input
                type="text"
                value={newCard.example}
                onChange={(e) => setNewCard({ ...newCard, example: e.target.value })}
                placeholder="Пример (необязательно)"
                className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)] transition"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAdd(false)}
                  className="flex-1 border border-[var(--color-border)] rounded-xl py-3 text-[var(--color-text-muted)] hover:border-[var(--color-accent)] transition"
                >
                  Отмена
                </button>
                <button
                  onClick={handleAddCard}
                  className="flex-1 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold rounded-xl py-3 transition"
                >
                  Добавить
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Пусто */}
        {set?.cards.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🃏</p>
            <p className="text-[var(--color-text-muted)]">Карточек пока нет — добавь первую!</p>
          </div>
        )}

        {/* Список карточек */}
        <div className="grid grid-cols-2 gap-4">
          {set?.cards.map((card) => (
            <div
              key={card.id}
              className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-lg">{card.word}</p>
                  <p className="text-[var(--color-accent)] mt-1">{card.translation}</p>
                  {card.example && (
                    <p className="text-[var(--color-text-muted)] text-sm mt-2 italic">{card.example}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteCard(card.id)}
                  className="text-[var(--color-text-muted)] hover:text-red-400 transition text-sm shrink-0 ml-2"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}