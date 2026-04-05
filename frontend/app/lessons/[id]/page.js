'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import api from '@/services/api'

export default function LessonPage() {
  const [xpEarned, setXpEarned] = useState(0)
  const router = useRouter()
  const { id } = useParams()
  const [lesson, setLesson] = useState(null)
  const [step, setStep] = useState('words') // words | exercises | complete
  const [wordIndex, setWordIndex] = useState(0)
  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [selected, setSelected] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [score, setScore] = useState(0)
  const [input, setInput] = useState('')

  useEffect(() => {
    loadLesson()
  }, [id])

  const loadLesson = async () => {
    try {
      const res = await api.get(`/lessons/${id}/`)
      setLesson(res.data)
    } catch (err) {
      router.push('/lessons')
    }
  }

  const handleAnswer = async (answer) => {
    const exercise = lesson.exercises[exerciseIndex]
    const correct = answer.trim().toLowerCase() === exercise.correct_answer.trim().toLowerCase()
    setSelected(answer)
    setIsCorrect(correct)
    if (correct) setScore(score + 1)
    setTimeout(async () => {
      setSelected(null)
      setIsCorrect(null)
      setInput('')
      if (exerciseIndex + 1 < lesson.exercises.length) {
        setExerciseIndex(exerciseIndex + 1)
      } else {
        // Начисляем XP
        try {
          const res = await api.post(`/lessons/${id}/complete/`)
          setXpEarned(res.data.xp_earned)
        } catch (err) {
          console.error(err)
        }
        setStep('complete')
      }
    }, 1000)
  }

  if (!lesson) return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">

      

      <main className="max-w-2xl mx-auto px-6 py-10">

        {/* Шаг 1 — Слова */}
        {step === 'words' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Изучи слова</h2>
              <span className="text-[var(--color-text-muted)] text-sm">{wordIndex + 1} / {lesson.words.length}</span>
            </div>

            {/* Прогресс бар */}
            <div className="h-1 bg-[var(--color-bg-input)] rounded-full mb-8">
              <div
                className="h-1 bg-[var(--color-accent)] rounded-full transition-all"
                style={{ width: `${((wordIndex + 1) / lesson.words.length) * 100}%` }}
              />
            </div>

            {/* Карточка слова */}
            <div
              onClick={() => setFlipped(!flipped)}
              className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-10 text-center cursor-pointer hover:border-[var(--color-accent)] transition min-h-48 flex flex-col items-center justify-center"
            >
              {!flipped ? (
                <>
                  <p className="text-4xl font-bold mb-3">{lesson.words[wordIndex].word}</p>
                  <p className="text-[var(--color-text-muted)] text-sm">Нажми чтобы увидеть перевод</p>
                </>
              ) : (
                <>
                  <p className="text-3xl font-bold text-[var(--color-accent)] mb-3">{lesson.words[wordIndex].translation}</p>
                  {lesson.words[wordIndex].example && (
                    <p className="text-[var(--color-text-muted)] text-sm italic mt-2">{lesson.words[wordIndex].example}</p>
                  )}
                </>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setWordIndex(Math.max(0, wordIndex - 1)); setFlipped(false) }}
                disabled={wordIndex === 0}
                className="flex-1 border border-[var(--color-border)] rounded-xl py-3 text-[var(--color-text-muted)] disabled:opacity-30 transition hover:border-[var(--color-accent)]"
              >
                ← Назад
              </button>
              {wordIndex + 1 < lesson.words.length ? (
                <button
                  onClick={() => { setWordIndex(wordIndex + 1); setFlipped(false) }}
                  className="flex-1 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold rounded-xl py-3 transition"
                >
                  Далее →
                </button>
              ) : (
                <button
                  onClick={() => setStep('exercises')}
                  className="flex-1 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold rounded-xl py-3 transition"
                >
                  К упражнениям →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Шаг 2 — Упражнения */}
        {step === 'exercises' && lesson.exercises.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Упражнения</h2>
              <span className="text-[var(--color-text-muted)] text-sm">{exerciseIndex + 1} / {lesson.exercises.length}</span>
            </div>

            <div className="h-1 bg-[var(--color-bg-input)] rounded-full mb-8">
              <div
                className="h-1 bg-[var(--color-accent)] rounded-full transition-all"
                style={{ width: `${((exerciseIndex + 1) / lesson.exercises.length) * 100}%` }}
              />
            </div>

            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-8">
              <p className="text-lg font-semibold mb-6">{lesson.exercises[exerciseIndex].question}</p>

              {/* Выбор варианта */}
              {lesson.exercises[exerciseIndex].exercise_type === 'multiple_choice' && (
                <div className="grid grid-cols-2 gap-3">
                  {lesson.exercises[exerciseIndex].options.map((option) => (
                    <button
                      key={option}
                      onClick={() => selected === null && handleAnswer(option)}
                      className={`p-4 rounded-xl border transition text-left font-medium ${
                        selected === option
                          ? isCorrect
                            ? 'border-green-500 bg-green-500/10 text-green-400'
                            : 'border-red-500 bg-red-500/10 text-red-400'
                          : 'border-[var(--color-border)] hover:border-[var(--color-accent)]'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {/* Перевод */}
              {lesson.exercises[exerciseIndex].exercise_type === 'translate' && (
                <div>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && input && handleAnswer(input)}
                    placeholder="Введи перевод..."
                    className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)] transition mb-4"
                  />
                  <button
                    onClick={() => input && handleAnswer(input)}
                    className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold rounded-xl py-3 transition"
                  >
                    Проверить
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Шаг 3 — Завершение */}
        {step === 'complete' && (
          <div className="text-center py-10">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold mb-2">Урок завершён!</h2>
            <p className="text-[var(--color-text-muted)] mb-8">
              Правильных ответов: {score} / {lesson.exercises.length}
            </p>
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 mb-8 inline-block">
              <p className="text-[var(--color-text-muted)] text-sm mb-1">Получено</p>
              <p className="text-4xl font-bold text-[var(--color-accent)]">+{xpEarned} XP</p>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => router.push('/lessons')}
                className="border border-[var(--color-border)] hover:border-[var(--color-accent)] text-[var(--color-text)] rounded-xl px-6 py-3 transition"
              >
                К урокам
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold rounded-xl px-6 py-3 transition"
              >
                На главную
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}