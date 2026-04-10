import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { askGemini } from './api/gemini'
import './App.css'

type ChatMessage = {
  role: 'user' | 'assistant'
  text: string
}

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: 'Hello. I am your demo assistant running from a React + Vite frontend.',
    },
  ])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')

  const canSend = useMemo(() => input.trim().length > 0 && !isSending, [input, isSending])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = input.trim()

    if (!trimmed || isSending) {
      return
    }

    const nextMessages = [...messages, { role: 'user' as const, text: trimmed }]
    setMessages(nextMessages)
    setInput('')
    setError('')
    setIsSending(true)

    try {
      const reply = await askGemini(nextMessages)
      setMessages((current) => [...current, { role: 'assistant', text: reply }])
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Unexpected request error.'
      setError(message)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <main className="app-shell">
      <section className="chat-panel" aria-label="Chatbot">
        <header className="chat-header">
          <p className="eyebrow">DevOps Demo</p>
          <h1>Chatbot With Google AI Studio</h1>
          <p className="subtext">
            This app calls Gemini directly from the frontend using VITE_GOOGLE_AI_API_KEY.
          </p>
        </header>

        <div className="conversation" role="log" aria-live="polite">
          {messages.map((message, index) => (
            <article key={`${message.role}-${index}`} className={`bubble ${message.role}`}>
              <p className="role">{message.role === 'user' ? 'You' : 'Assistant'}</p>
              <p>{message.text}</p>
            </article>
          ))}
          {isSending && (
            <article className="bubble assistant typing" aria-label="Assistant is typing">
              <p className="role">Assistant</p>
              <p>Thinking...</p>
            </article>
          )}
        </div>

        <form className="composer" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="chat-input">
            Message
          </label>
          <textarea
            id="chat-input"
            rows={3}
            placeholder="Ask anything..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={isSending}
          />
          <button type="submit" disabled={!canSend}>
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </form>

        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}
      </section>
    </main>
  )
}

export default App
