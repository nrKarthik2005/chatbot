type ChatMessage = {
  role: 'user' | 'assistant'
  text: string
}

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>
    }
  }>
  error?: {
    message?: string
  }
}

const MODEL = 'gemini-2.0-flash'

export async function askGemini(messages: ChatMessage[]): Promise<string> {
  const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY

  if (!apiKey) {
    throw new Error('Missing VITE_GOOGLE_AI_API_KEY. Add it in frontend/.env file.')
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: messages.map((message) => ({
          role: message.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: message.text }],
        })),
      }),
    },
  )

  const payload = (await response.json()) as GeminiResponse

  if (!response.ok) {
    throw new Error(payload.error?.message || `Gemini request failed with status ${response.status}`)
  }

  const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim()

  if (!text) {
    throw new Error('Gemini returned an empty response.')
  }

  return text
}
