'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/services/api'

const QUALITY_BUTTONS = [
  { value: 1, label: 'Не помню', color: 'bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30' },
  { value: 3, label: 'Сложно', color: 'bg-orange-500/20 border-orange-500/30 text-orange-400 hover:bg-orange-500/30' },
  { value: 4, label: 'Хорошо', color: 'bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30' },
  { value: 5, label: 'Легко', color: 'bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30' },
]

export default function ReviewPage() {
  const router = useRouter()
  const [cards, setCards] = useState([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [done, setDone] = useState(false)
  const [reviewed, setReviewed] = useState(0)

  useEffect(() => {
    loadDueCards()
  }, [])

  const loadDueCards = async () => {
    try {
      const res = await api.get('/flashcards/due/')
      setCards(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuality = async (quality) => {
    const card = cards[index]
    try {
      await api.post(`/flashcards/cards/${card.id}/review/`, { quality })
      setReviewed(reviewed + 1)
    } catch (err) {
      console.error(err)
    }

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

  if (done || cards.length === 0) return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-6">{cards.length === 0 ? '✅' : '🎉'}</div>
        <h2 className="text-3xl font-bold mb-2">
          {cards.length === 0 ? 'Нет карточек для повторения' : 'Повторение завершено!'}
        </h2>
        <p className="text-[var(--color-text-muted)] mb-8">
          {cards.length === 0
            ? 'Все карточки повторены на сегодня — возвращайся завтра!'
            : `Ты повторил ${reviewed} карточек`}
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold rounded-xl px-6 py-3 transition"
        >
          На главную
        </button>
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
            onClick={() => router.push('/dashboard')}
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

      <div className="max-w-lg mx-auto">

        {/* Карточка */}
        <div
          onClick={() => setFlipped(!flipped)}
          className="bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-accent)] rounded-2xl p-12 text-center cursor-pointer transition min-h-64 flex flex-col items-center justify-center mb-6"
          style={{ perspective: '1000px' }}
        >
          <div style={{
            transition: 'transform 0.4s',
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
            position: 'relative',
            width: '100%',
            minHeight: '120px',
          }}>
            <div style={{ backfaceVisibility: 'hidden', position: 'absolute', width: '100%', top: '50%', transform: 'translateY(-50%)' }}>
              <p className="text-4xl font-bold mb-3">{card.word}</p>
              <p className="text-[var(--color-text-muted)] text-sm">Нажми чтобы увидеть перевод</p>
            </div>
            <div style={{ backfaceVisibility: 'hidden', position: 'absolute', width: '100%', top: '50%', transform: 'translateY(-50%) rotateY(180deg)' }}>
              <p className="text-3xl font-bold text-[var(--color-accent)] mb-3">{card.translation}</p>
              {card.example && (
                <p className="text-[var(--color-text-muted)] text-sm italic mt-2">{card.example}</p>
              )}
            </div>
          </div>
        </div>

        {/* Кнопки оценки */}
        {flipped && (
          <div>
            <p className="text-[var(--color-text-muted)] text-sm text-center mb-3">Насколько хорошо ты знал это слово?</p>
            <div className="grid grid-cols-4 gap-2">
              {QUALITY_BUTTONS.map((btn) => (
                <button
                  key={btn.value}
                  onClick={() => handleQuality(btn.value)}
                  className={`border rounded-xl py-3 text-sm font-medium transition ${btn.color}`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {!flipped && (
          <p className="text-[var(--color-text-muted)] text-sm text-center">
            Нажми на карточку чтобы увидеть ответ
          </p>
        )}

      </div>
    </div>
  )
}