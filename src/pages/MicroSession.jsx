import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { MICRO_MOVEMENTS } from '../data/workouts'
import { today, uid } from '../utils/helpers'

const WORK_SECS = 40
const REST_SECS = 20
const TOTAL_ROUNDS = 5

export default function MicroSession() {
  const navigate = useNavigate()
  const { addSession } = useData()

  const [phase, setPhase] = useState('ready') // ready | work | rest | done
  const [round, setRound] = useState(0) // 0-indexed
  const [movIdx, setMovIdx] = useState(0)
  const [seconds, setSeconds] = useState(WORK_SECS)
  const intervalRef = useRef(null)

  function start() {
    setPhase('work')
    setRound(0)
    setMovIdx(0)
    setSeconds(WORK_SECS)
  }

  useEffect(() => {
    if (phase !== 'work' && phase !== 'rest') return
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current)
          if (phase === 'work') {
            // check if last round
            if (round >= TOTAL_ROUNDS - 1) {
              setPhase('done')
            } else {
              setPhase('rest')
              setSeconds(REST_SECS)
            }
          } else {
            // rest ended → next round
            const nextRound = round + 1
            const nextMov = nextRound % MICRO_MOVEMENTS.length
            setRound(nextRound)
            setMovIdx(nextMov)
            setPhase('work')
            setSeconds(WORK_SECS)
          }
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [phase, round])

  async function logAndLeave() {
    try {
      await addSession({
        id: uid(),
        date: today(),
        type: 'micro',
        day: null,
        label: null,
        bodyweight: null,
        notes: '5-min micro session',
        exercises: MICRO_MOVEMENTS.map((m) => ({
          name: m.name,
          sets: TOTAL_ROUNDS,
          reps: '40s',
          weight: 0,
        })),
      })
    } catch (e) {
      console.error('Failed to save micro session', e)
    }
    navigate('/')
  }

  const circumference = 2 * Math.PI * 44
  const max = phase === 'work' ? WORK_SECS : REST_SECS
  const progress = phase === 'done' || phase === 'ready' ? 1 : seconds / max
  const strokeDash = circumference * progress

  const mov = MICRO_MOVEMENTS[movIdx]

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-between px-6 py-10">
      {/* Top */}
      <div className="w-full flex items-center justify-between">
        <button onClick={() => navigate('/')} className="text-zinc-500 hover:text-zinc-300 text-sm">
          ← Back
        </button>
        <span className="text-zinc-500 text-sm">
          {phase === 'done' || phase === 'ready' ? '' : `Round ${round + 1} / ${TOTAL_ROUNDS}`}
        </span>
      </div>

      {/* Main */}
      {phase === 'ready' && (
        <div className="flex flex-col items-center text-center gap-6">
          <div>
            <h2 className="text-2xl font-semibold text-zinc-100">5-minute starter</h2>
            <p className="text-zinc-400 mt-2 text-sm max-w-xs">
              {TOTAL_ROUNDS} rounds · 40s on, 20s rest<br />
              {MICRO_MOVEMENTS.map((m) => m.name).join(' → ')}
            </p>
          </div>
          <button
            onClick={start}
            className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-full px-12 py-4 text-lg transition-colors"
          >
            Begin
          </button>
        </div>
      )}

      {(phase === 'work' || phase === 'rest') && (
        <div className="flex flex-col items-center gap-8">
          {/* Phase label */}
          <div className={`text-sm font-medium uppercase tracking-widest ${phase === 'work' ? 'text-emerald-400' : 'text-zinc-400'}`}>
            {phase === 'work' ? 'Move' : 'Rest'}
          </div>

          {/* Timer ring */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="#27272a" strokeWidth="4" />
              <circle
                cx="50" cy="50" r="44"
                fill="none"
                stroke={phase === 'work' ? '#10b981' : '#71717a'}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${strokeDash} ${circumference}`}
                style={{ transition: 'stroke-dasharray 0.9s linear' }}
              />
            </svg>
            <span className="text-6xl font-bold tabular-nums text-zinc-100">{seconds}</span>
          </div>

          {/* Movement */}
          {phase === 'work' && (
            <div className="text-center">
              <div className="text-2xl font-semibold text-zinc-100">{mov.name}</div>
              <div className="text-zinc-500 text-sm mt-1">{mov.detail}</div>
            </div>
          )}
        </div>
      )}

      {phase === 'done' && (
        <div className="flex flex-col items-center text-center gap-6">
          <div>
            <div className="text-5xl mb-3">✓</div>
            <h2 className="text-2xl font-semibold text-zinc-100">That's 5 minutes.</h2>
            <p className="text-zinc-400 mt-2 text-sm">Keep going or call it a win?</p>
          </div>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              onClick={() => navigate('/log')}
              className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 font-medium rounded-xl py-3.5 transition-colors"
            >
              Keep going →
            </button>
            <button
              onClick={logAndLeave}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-xl py-3.5 transition-colors"
            >
              I'm done — log it
            </button>
          </div>
        </div>
      )}

      {/* Progress dots */}
      {(phase === 'work' || phase === 'rest') && (
        <div className="flex gap-2">
          {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i < round ? 'bg-emerald-500' : i === round ? 'bg-emerald-400' : 'bg-zinc-700'
              }`}
            />
          ))}
        </div>
      )}

      {phase === 'ready' && <div />}
    </div>
  )
}
