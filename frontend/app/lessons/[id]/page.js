'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import api from '@/services/api'

export default function LessonPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id
  const [lesson, setLesson] = useState(null)
  const [step, setStep] = useState('words')
  const [wordIndex, setWordIndex] = useState(0)
  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [selected, setSelected] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [xpEarned, setXpEarned] = useState(0)
  const [levelUp, setLevelUp] = useState(false)
  const [newLevel, setNewLevel] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [hint, setHint] = useState('')

  useEffect(() => {
    loadLesson()
  }, [id])

  const loadLesson = async () => {
    try {
      const res = await api.get(`/lessons/${id}/`)
      setLesson(res.data)
    } catch {
      router.push('/lessons')
    }
  }

  const checkAnswer = (answer, correctAnswer) => {
    return answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
  }

  const handleMultipleChoice = (option) => {
    if (selected !== null) return
    const exercise = lesson.exercises[exerciseIndex]
    const correct = checkAnswer(option, exercise.correct_answer)
    setSelected(option)
    setIsCorrect(correct)

    if (correct) {
      setScore(score + 1)
      setTimeout(() => {
        setSelected(null)
        setIsCorrect(null)
        setAttempts(0)
        setShowHint(false)
        goNextExercise()
      }, 800)
    } else {
      setAttempts(attempts + 1)
      if (attempts >= 1) {
        setShowHint(true)
        setHint(`Правильный ответ: ${exercise.correct_answer}`)
      }
      setTimeout(() => {
        setSelected(null)
        setIsCorrect(null)
      }, 1000)
    }
  }

  const handleTranslate = async () => {
    if (!input.trim()) return
    const exercise = lesson.exercises[exerciseIndex]
    const correct = checkAnswer(input, exercise.correct_answer)
    setIsCorrect(correct)

    if (correct) {
      setScore(score + 1)
      setTimeout(() => {
        setIsCorrect(null)
        setInput('')
        setAttempts(0)
        setShowHint(false)
        goNextExercise()
      }, 800)
    } else {
      setAttempts(attempts + 1)
      if (attempts >= 1) {
        setShowHint(true)
        setHint(`Правильный ответ: ${exercise.correct_answer}`)
      }
      setTimeout(() => {
        setIsCorrect(null)
      }, 1000)
    }
  }

  const goNextExercise = async () => {
    if (exerciseIndex + 1 < lesson.exercises.length) {
      setExerciseIndex(exerciseIndex + 1)
    } else {
      try {
        const res = await api.post(`/lessons/${id}/complete/`, { score })
        setXpEarned(res.data.xp_earned)
        if (res.data.level_up) {
          setLevelUp(true)
          setNewLevel(res.data.level)
        }
      } catch (err) {
        console.error(err)
      }
      setStep('complete')
    }
  }

  if (!lesson) return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">

      {/* Navbar */}
      <nav className="border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
        <button onClick={() => router.push('/lessons')} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition text-sm">
          ← Назад
        </button>
        <h1 className="font-semibold">{lesson.title}</h1>
        <span className="text-[var(--color-accent)] text-sm font-semibold">+{lesson.xp_reward} XP</span>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-10">

        {/* Шаг 1 — Слова */}
        {step === 'words' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Изучи слова</h2>
              <span className="text-[var(--color-text-muted)] text-sm">{wordIndex + 1} / {lesson.words.length}</span>
            </div>

            <div className="h-1 bg-[var(--color-bg-input)] rounded-full mb-8">
              <div className="h-1 bg-[var(--color-accent)] rounded-full transition-all"
                style={{ width: `${((wordIndex + 1) / lesson.words.length) * 100}%` }} />
            </div>

            <div
              onClick={() => setFlipped(!flipped)}
              className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-10 text-center cursor-pointer hover:border-[var(--color-accent)] transition min-h-48 flex flex-col items-center justify-center mb-6"
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
                  <p className="text-4xl font-bold mb-3">{lesson.words[wordIndex].word}</p>
                  <p className="text-[var(--color-text-muted)] text-sm">Нажми чтобы увидеть перевод</p>
                </div>
                <div style={{ backfaceVisibility: 'hidden', position: 'absolute', width: '100%', top: '50%', transform: 'translateY(-50%) rotateY(180deg)' }}>
                  <p className="text-3xl font-bold text-[var(--color-accent)] mb-3">{lesson.words[wordIndex].translation}</p>
                  {lesson.words[wordIndex].example && (
                    <p className="text-[var(--color-text-muted)] text-sm italic mt-2">{lesson.words[wordIndex].example}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setWordIndex(Math.max(0, wordIndex - 1)); setFlipped(false) }}
                disabled={wordIndex === 0}
                className="flex-1 border border-[var(--color-border)] rounded-xl py-3 text-[var(--color-text-muted)] disabled:opacity-30 hover:border-[var(--color-accent)] transition"
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
              <div className="h-1 bg-[var(--color-accent)] rounded-full transition-all"
                style={{ width: `${((exerciseIndex + 1) / lesson.exercises.length) * 100}%` }} />
            </div>

            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-8">
              <p className="text-lg font-semibold mb-6">{lesson.exercises[exerciseIndex].question}</p>

              {/* Выбор варианта */}
              {lesson.exercises[exerciseIndex].exercise_type === 'multiple_choice' && (
                <div className="grid grid-cols-2 gap-3">
                  {lesson.exercises[exerciseIndex].options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleMultipleChoice(option)}
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
                    onKeyDown={(e) => e.key === 'Enter' && handleTranslate()}
                    placeholder="Введи перевод..."
                    className={`w-full bg-[var(--color-bg-input)] border rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none transition mb-4 ${
                      isCorrect === true ? 'border-green-500' :
                      isCorrect === false ? 'border-red-500' :
                      'border-[var(--color-border)] focus:border-[var(--color-accent)]'
                    }`}
                  />
                  <button
                    onClick={handleTranslate}
                    disabled={!input.trim()}
                    className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 text-white font-semibold rounded-xl py-3 transition"
                  >
                    Проверить
                  </button>
                </div>
              )}

              {/* Подсказка */}
              {showHint && (
                <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3">
                  <p className="text-yellow-400 text-sm">💡 {hint}</p>
                </div>
              )}

              {/* Попытки */}
              {attempts > 0 && !showHint && (
                <p className="text-[var(--color-text-muted)] text-sm mt-3 text-center">
                  Попробуй ещё раз — осталось {2 - attempts} попытки до подсказки
                </p>
              )}
            </div>
          </div>
        )}

        {/* Шаг 3 — Завершение */}
        {step === 'complete' && (
          <div className="text-center py-10">
            {levelUp ? (
              <div className="mb-6">
                <div className="text-6xl mb-3">🎊</div>
                <div className="bg-gradient-to-r from-violet-600/20 to-cyan-500/20 border border-violet-500/30 rounded-2xl p-6 mb-4">
                  <p className="text-2xl font-bold text-[var(--color-accent)]">Новый уровень!</p>
                  <p className="text-4xl font-bold mt-2">{newLevel}</p>
                  <p className="text-[var(--color-text-muted)] mt-2">Открыты новые уроки!</p>
                </div>
              </div>
            ) : (
              <div className="text-6xl mb-6">🎉</div>
            )}

            <h2 className="text-3xl font-bold mb-2">Урок завершён!</h2>
            <p className="text-[var(--color-text-muted)] mb-8">
              Правильных ответов: {score} / {lesson.exercises.length}
            </p>

            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 mb-8 inline-block">
              <p className="text-[var(--color-text-muted)] text-sm mb-1">Получено</p>
              <p className="text-4xl font-bold text-[var(--color-accent)]">
                {xpEarned > 0 ? `+${xpEarned} XP` : 'Уже пройдено'}
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="border border-[var(--color-border)] hover:border-[var(--color-accent)] text-[var(--color-text)] rounded-xl px-6 py-3 transition"
              >
                На главную
              </button>
              <button
                onClick={() => router.push(`/lessons/${parseInt(id) + 1}`)}
                className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold rounded-xl px-6 py-3 transition"
              >
                Следующий урок →
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}