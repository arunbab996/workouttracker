import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { getWeekBounds, today } from '../utils/helpers'
import { MOTIVATIONAL_LINES, WORKOUT_DAYS } from '../data/workouts'

export default function Home() {
  const { sessions, weights, aiNote, loading } = useData()
  const [quoteIdx, setQuoteIdx] = useState(() => Math.floor(Math.random() * MOTIVATIONAL_LINES.length))
  const navigate = useNavigate()

  useEffect(() => {
    const id = setInterval(() => {
      setQuoteIdx((i) => (i + 1) % MOTIVATIONAL_LINES.length)
    }, 8000)
    return () => clearInterval(id)
  }, [])

  const totalWorkouts = sessions.length
  const todayStr = today()
  const loggedToday = sessions.some((s) => s.date === todayStr)

  const { start, end } = getWeekBounds()
  const thisWeek = sessions.filter((s) => s.date >= start && s.date <= end)
  const weekDays = { A: false, B: false, C: false }
  thisWeek.forEach((s) => { if (s.day) weekDays[s.day] = true })
  const weekCount = thisWeek.length

  const latestWeight = weights.length ? [...weights].sort((a, b) => b.date.localeCompare(a.date))[0] : null
  const weightThisWeek = weights.some((w) => w.date >= start && w.date <= end)

  const totalWeeks = sessions.length
    ? Math.ceil((new Date(todayStr) - new Date(sessions.slice().sort((a, b) => a.date.localeCompare(b.date))[0].date)) / 604800000)
    : 0

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning.' : hour < 17 ? 'Good afternoon.' : 'Good evening.'

  return (
    <div className="max-w-lg mx-auto px-4 pt-8 pb-28">
      {/* Header */}
      <div className="mb-6">
        <p className="text-zinc-500 text-sm">{todayStr}</p>
        <h1 className="text-2xl font-semibold text-zinc-100 mt-0.5">{greeting}</h1>
      </div>

      {/* Total workouts */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-4 flex items-center gap-4">
        <div className="text-4xl font-bold text-emerald-400 tabular-nums leading-none">{totalWorkouts}</div>
        <div>
          <div className="text-zinc-200 font-medium">workout{totalWorkouts !== 1 ? 's' : ''} logged</div>
          <div className="text-zinc-500 text-sm">
            {totalWorkouts === 0 ? 'Start today.' : totalWorkouts < 5 ? 'Just getting started.' : totalWorkouts < 20 ? 'Building the habit.' : 'Showing up consistently.'}
          </div>
        </div>
      </div>

      {/* Motivational quote */}
      <div className="border border-zinc-800 rounded-xl px-5 py-4 mb-6">
        <p className="text-zinc-300 text-sm italic leading-relaxed transition-all">
          "{MOTIVATIONAL_LINES[quoteIdx]}"
        </p>
      </div>

      {/* CTAs */}
      {loggedToday ? (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 mb-6 text-center">
          <div className="text-emerald-400 font-medium text-lg">You showed up today.</div>
          <div className="text-zinc-400 text-sm mt-1">That's the whole point.</div>
          <button
            onClick={() => navigate('/log')}
            className="mt-3 text-sm text-emerald-400 underline underline-offset-2"
          >
            Log another session
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={() => navigate('/micro')}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-xl py-4 text-base transition-colors"
          >
            I'll do 5 minutes
          </button>
          <button
            onClick={() => navigate('/log')}
            className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-medium rounded-xl py-3 text-sm transition-colors"
          >
            Full session today
          </button>
        </div>
      )}

      {/* This week */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-zinc-400 text-sm font-medium">This week</span>
          <span className="text-zinc-500 text-xs">{weekCount}/3 sessions</span>
        </div>
        <div className="flex gap-2">
          {['A', 'B', 'C'].map((d) => (
            <div
              key={d}
              className={`flex-1 rounded-lg py-2.5 text-center text-sm font-semibold border ${
                weekDays[d]
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                  : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-600'
              }`}
            >
              <div>{d}</div>
              <div className="text-[10px] font-normal mt-0.5 text-current opacity-70">
                {WORKOUT_DAYS[d].name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
          <div className="text-xl font-bold text-zinc-100">{totalWeeks}</div>
          <div className="text-zinc-500 text-xs mt-0.5">weeks training</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
          <div className="text-xl font-bold text-zinc-100">
            {loading ? '…' : latestWeight ? Number(latestWeight.value) : '–'}
          </div>
          <div className="text-zinc-500 text-xs mt-0.5">kg bodyweight</div>
        </div>
      </div>

      {/* Weekly weight prompt */}
      {!loading && !weightThisWeek && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-zinc-200 text-sm font-medium">Log your weight this week</div>
            <div className="text-zinc-500 text-xs mt-0.5">
              {latestWeight ? `Last logged: ${Number(latestWeight.value)} kg` : 'No weight logged yet'}
            </div>
          </div>
          <button
            onClick={() => navigate('/weight')}
            className="shrink-0 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-xs font-medium rounded-lg px-3 py-2 transition-colors"
          >
            Log now →
          </button>
        </div>
      )}

      {/* AI note */}
      {aiNote && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Latest coaching note</span>
          </div>
          <p className="text-zinc-300 text-sm leading-relaxed line-clamp-4">{aiNote.summary ?? aiNote.text?.slice(0, 300)}</p>
          <button
            onClick={() => navigate('/coach')}
            className="text-emerald-400 text-xs mt-2 underline underline-offset-2"
          >
            View full note →
          </button>
        </div>
      )}
    </div>
  )
}
