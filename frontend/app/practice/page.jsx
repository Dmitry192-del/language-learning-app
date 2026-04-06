'use client'

import { useRouter } from 'next/navigation'

const SITUATIONS = [
  {
    id: 'coffee',
    icon: '☕',
    title: 'Заказать кофе',
    desc: 'Практикуй заказ в кофейне',
    color: 'from-amber-600/20 to-amber-800/10 border-amber-500/20',
  },
  {
    id: 'airport',
    icon: '✈️',
    title: 'В аэропорту',
    desc: 'Спроси про рейс, регистрацию, багаж',
    color: 'from-blue-600/20 to-blue-800/10 border-blue-500/20',
  },
  {
    id: 'apartment',
    icon: '🏠',
    title: 'Снять квартиру',
    desc: 'Обсуди условия аренды',
    color: 'from-green-600/20 to-green-800/10 border-green-500/20',
  },
  {
    id: 'interview',
    icon: '💼',
    title: 'Собеседование',
    desc: 'Расскажи о себе и своём опыте',
    color: 'from-violet-600/20 to-violet-800/10 border-violet-500/20',
  },
  {
    id: 'general',
    icon: '💬',
    title: 'Свободный разговор',
    desc: 'Просто пообщайся с AI на языке',
    color: 'from-zinc-600/20 to-zinc-800/10 border-zinc-500/20',
  },
]

export default function PracticePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] p-8">
      <div className="max-w-3xl mx-auto">

        <div className="mb-10">
          <h2 className="text-3xl font-bold">AI диалоги 🤖</h2>
          <p className="text-[var(--color-text-muted)] mt-1">
            Выбери ситуацию и практикуй язык в реальном диалоге
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {SITUATIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => router.push(`/practice/${s.id}`)}
              className={`bg-gradient-to-r ${s.color} border rounded-2xl p-6 text-left transition hover:scale-[1.01]`}
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{s.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="text-[var(--color-text-muted)] text-sm mt-1">{s.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}