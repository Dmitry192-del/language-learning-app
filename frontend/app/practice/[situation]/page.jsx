'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import api from '@/services/api'

const SITUATION_TITLES = {
  coffee: '☕ Заказать кофе',
  airport: '✈️ В аэропорту',
  apartment: '🏠 Снять квартиру',
  interview: '💼 Собеседование',
  general: '💬 Свободный разговор',
}

export default function ChatPage() {
  const router = useRouter()
  const { situation } = useParams()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    // Приветственное сообщение
    setMessages([{
      role: 'assistant',
      content: getGreeting(situation),
    }])
  }, [situation])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getGreeting = (situation) => {
    const greetings = {
      coffee: 'Hello! Welcome to our coffee shop. What can I get for you today?',
      airport: 'Hello! How can I help you today?',
      apartment: 'Hello! Are you here to see the apartment?',
      interview: 'Good morning! Please have a seat. Can you tell me a little about yourself?',
      general: 'Hello! I\'m your language learning assistant. Let\'s have a conversation!',
    }
    return greetings[situation] || greetings.general
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = { role: 'user', content: input }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      const res = await api.post('/ai/chat/', {
        message: input,
        situation,
        history: messages,
      })
      setMessages([...newMessages, { role: 'assistant', content: res.data.reply }])
    } catch (err) {
      setMessages([...newMessages, {
        role: 'assistant',
        content: 'Извини, произошла ошибка. Попробуй ещё раз.'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col">

      {/* Шапка */}
      <div className="border-b border-[var(--color-border)] px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => router.push('/practice')}
          className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition text-sm"
        >
          ← Назад
        </button>
        <h1 className="font-semibold">{SITUATION_TITLES[situation]}</h1>
      </div>

      {/* Сообщения */}
      <div className="flex-1 overflow-y-auto px-6 py-6 max-w-3xl mx-auto w-full">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-lg px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[var(--color-accent)] text-white rounded-br-sm'
                    : 'bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-bl-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] px-4 py-3 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-[var(--color-text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-[var(--color-text-muted)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-[var(--color-text-muted)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Инпут */}
      <div className="border-t border-[var(--color-border)] px-6 py-4 max-w-3xl mx-auto w-full">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Напиши сообщение..."
            className="flex-1 bg-[var(--color-bg-input)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-5 transition"
          >
            →
          </button>
        </div>
        <p className="text-[var(--color-text-muted)] text-xs mt-2 text-center">
          Пиши на языке который учишь — AI исправит ошибки
        </p>
      </div>

    </div>
  )
}