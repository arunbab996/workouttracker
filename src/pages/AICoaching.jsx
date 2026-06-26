import { useState } from 'react'
import { useData } from '../context/DataContext'
import { formatDate } from '../utils/helpers'

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

function buildPrompt(sessions, weights) {
  const last5 = [...sessions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)

  const weightHistory = [...weights]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10)

  return `You are a knowledgeable, calm fitness coach. Analyze this training data and give practical feedback.

Recent sessions (newest first):
${JSON.stringify(last5, null, 2)}

Weight history (kg, newest first):
${JSON.stringify(weightHistory, null, 2)}

Respond with exactly these four sections (use these headings):
1. Consistency — brief assessment of training frequency and patterns
2. Progressive Overload — specific suggestions for 2–3 exercises based on the actual logged numbers (suggest concrete next weights/reps)
3. Form Tip — one practical form cue for an exercise in the recent sessions
4. Recovery/Nutrition — one actionable reminder relevant to the goal of reducing skinny fat and building visible muscle

Keep the tone honest and grounded. No hype. Be specific — reference actual exercise names and numbers from the data.`
}

export default function AICoaching() {
  const { sessions, weights, aiNote, saveAiNote } = useData()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function generate() {
    if (!API_KEY) {
      setError('No API key found. Add VITE_ANTHROPIC_API_KEY to your .env file.')
      return
    }
    if (sessions.length === 0) {
      setError('Log at least one session before generating coaching.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/anthropic/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-allow-browser': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1024,
          messages: [{ role: 'user', content: buildPrompt(sessions, weights) }],
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error?.message || `API error ${res.status}`)
      }

      const data = await res.json()
      const text = data.content?.[0]?.text || ''
      const note = {
        text,
        summary: text.slice(0, 300),
        generated_at: new Date().toISOString(),
      }
      await saveAiNote(note)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-8 pb-28">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-semibold text-zinc-100">AI Coaching</h1>
      </div>
      <p className="text-zinc-500 text-sm mb-6">
        Sends your last 5 sessions + weight history to Claude and gets back personalised feedback.
      </p>

      <button
        onClick={generate}
        disabled={loading}
        className={`w-full py-4 rounded-xl font-semibold text-base transition-colors mb-6 ${
          loading
            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950'
        }`}
      >
        {loading ? 'Analysing your sessions…' : 'Generate coaching note'}
      </button>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 text-rose-400 text-sm mb-6">
          {error}
        </div>
      )}

      {!API_KEY && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-400 text-sm mb-6">
          <strong className="text-zinc-300">Setup:</strong> Create a <code className="text-emerald-400">.env</code> file in the project root with:<br />
          <code className="text-emerald-400 text-xs mt-1 block">VITE_ANTHROPIC_API_KEY=sk-ant-...</code>
        </div>
      )}

      {aiNote && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-zinc-500 uppercase tracking-wide font-medium">Coaching note</span>
            <span className="text-xs text-zinc-600">
              {formatDate((aiNote.generated_at ?? '').slice(0, 10))}
            </span>
          </div>
          <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{aiNote.text}</div>
        </div>
      )}

      {!aiNote && !loading && sessions.length === 0 && (
        <p className="text-zinc-600 text-sm text-center mt-8">Log some sessions first, then come back here.</p>
      )}
    </div>
  )
}
