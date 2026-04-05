'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import api from '@/services/api'

export default function ReviewPage() {
  const router = useRouter()
  const { id } = useParams()
  const [cards, setCards] = useState([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [done, setDone] = useState(false)

  useEffect(() => {
    loadCards()
  }, [id])

  const loadCards = async () => {
    try {
      const res = await api.get(`/flashcards/${id}/`)
      setCards(res.data.cards)
    } catch {
      router.push('/vocabulary')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    setFlipped(false)
    setTimeout(() => {
      if (index + 1 < cards.length) {
        setIndex(index + 1)
      } else {
        setDone(true)
      }
    }, 150)
  }

  if (isLoading) return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (done) return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-3xl font-bold mb-2">Все карточки пройдены!</h2>
        <p className="text-[var(--color-text-muted)] mb-8">Ты повторил {cards.length} слов</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => { setIndex(0); setDone(false); setFlipped(false) }}
            className="border border-[var(--color-border)] hover:border-[var(--color-accent)] text-[var(--color-text)] rounded-xl px-6 py-3 transition"
          >
            Повторить ещё раз
          </button>
          <button
            onClick={() => router.push(`/vocabulary/${id}`)}
            className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold rounded-xl px-6 py-3 transition"
          >
            К набору
          </button>
        </div>
      </div>
    </div>
  )

  const card = cards[index]

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] p-8">

      {/* Прогресс */}
      <div className="max-w-lg mx-auto mb-8">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => router.push(`/vocabulary/${id}`)}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition text-sm"
          >
            ← Назад
          </button>
          <span className="text-[var(--color-text-muted)] text-sm">{index + 1} / {cards.length}</span>
        </div>
        <div className="h-2 bg-[var(--color-bg-input)] rounded-full">
          <div
            className="h-2 bg-[var(--color-accent)] rounded-full transition-all"
            style={{ width: `${((index + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Карточка */}
      <div className="max-w-lg mx-auto">
        <div
          onClick={() => setFlipped(!flipped)}
          className="bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-accent)] rounded-2xl p-12 text-center cursor-pointer transition min-h-64 flex flex-col items-center justify-center mb-6"
          style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)', transition: 'transform 0.3s' }}
        >
          {!flipped ? (
            <>
              <p className="text-4xl font-bold mb-3">{card.word}</p>
              <p className="text-[var(--color-text-muted)] text-sm">Нажми чтобы увидеть перевод</p>
            </>
          ) : (
            <>
              <p className="text-3xl font-bold text-[var(--color-accent)] mb-3">{card.translation}</p>
              {card.example && (
                <p className="text-[var(--color-text-muted)] text-sm italic mt-2">{card.example}</p>
              )}
            </>
          )}
        </div>

        {/* Кнопки */}
        <div className="flex gap-3">
          <button
            onClick={() => { setFlipped(false); setIndex(Math.max(0, index - 1)) }}
            disabled={index === 0}
            className="flex-1 border border-[var(--color-border)] rounded-xl py-3 text-[var(--color-text-muted)] disabled:opacity-30 hover:border-[var(--color-accent)] transition"
          >
            ← Назад
          </button>
          <button
            onClick={handleNext}
            className="flex-1 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold rounded-xl py-3 transition"
          >
            {index + 1 === cards.length ? 'Завершить ✓' : 'Далее →'}
          </button>
        </div>
      </div>

    </div>
  )
}