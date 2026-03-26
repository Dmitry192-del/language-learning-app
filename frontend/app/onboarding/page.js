'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import api from '@/services/api'

const LANGUAGES = [
  { code: 'en', name: 'Английский', flag: '🇬🇧' },
  { code: 'de', name: 'Немецкий', flag: '🇩🇪' },
  { code: 'fr', name: 'Французский', flag: '🇫🇷' },
  { code: 'es', name: 'Испанский', flag: '🇪🇸' },
  { code: 'it', name: 'Итальянский', flag: '🇮🇹' },
  { code: 'zh', name: 'Китайский', flag: '🇨🇳' },
]

const LEVELS = [
  { code: 'A1', label: 'A1', desc: 'Начинающий' },
  { code: 'A2', label: 'A2', desc: 'Элементарный' },
  { code: 'B1', label: 'B1', desc: 'Средний' },
  { code: 'B2', label: 'B2', desc: 'Выше среднего' },
  { code: 'C1', label: 'C1', desc: 'Продвинутый' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState({
    target_language: '',
    level: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleFinish = async () => {
    setIsLoading(true)
    try {
      await api.post('/auth/onboarding/', {
        ...selected,
        native_language: 'ru',
      })
      router.push('/dashboard')
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-lg">

        {/* Прогресс */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-all ${
                s <= step ? 'bg-violet-500' : 'bg-zinc-800'
              }`}
            />
          ))}
        </div>

        {/* Шаг 1 — выбор языка */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Какой язык учим?</h2>
            <p className="text-zinc-400 text-sm mb-6">Выбери язык который хочешь освоить</p>

            <div className="grid grid-cols-2 gap-3">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelected({ ...selected, target_language: lang.code })}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition ${
                    selected.target_language === lang.code
                      ? 'border-violet-500 bg-violet-500/10 text-white'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!selected.target_language}
              className="w-full mt-6 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 transition"
            >
              Далее
            </button>
          </div>
        )}

        {/* Шаг 2 — уровень */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Какой у тебя уровень?</h2>
            <p className="text-zinc-400 text-sm mb-6">Честно оцени свои знания</p>

            <div className="space-y-3">
              {LEVELS.map((lvl) => (
                <button
                  key={lvl.code}
                  onClick={() => setSelected({ ...selected, level: lvl.code })}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition ${
                    selected.level === lvl.code
                      ? 'border-violet-500 bg-violet-500/10 text-white'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  <span className="font-bold text-lg">{lvl.label}</span>
                  <span className="text-sm">{lvl.desc}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border border-zinc-700 text-zinc-400 hover:text-white rounded-xl py-3 transition"
              >
                Назад
              </button>
              <button
                onClick={handleFinish}
                disabled={!selected.level || isLoading}
                className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 transition"
              >
                {isLoading ? 'Сохраняем...' : 'Начать обучение'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}