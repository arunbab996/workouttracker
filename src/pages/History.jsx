import { useState } from 'react'
import { useData } from '../context/DataContext'
import { WORKOUT_DAYS } from '../data/workouts'
import { formatDate, computeStreak, computeLongestStreak } from '../utils/helpers'
import StreakCalendar from '../components/StreakCalendar'

export default function History() {
  const { sessions, loading } = useData()
  const [expanded, setExpanded] = useState(null)

  const sorted = [...sessions].sort((a, b) => b.date.localeCompare(a.date))
  const streak = computeStreak(sessions)
  const longest = computeLongestStreak(sessions)

  function toggle(id) {
    setExpanded((prev) => (prev === id ? null : id))
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-8 pb-28">
      <h1 className="text-xl font-semibold text-zinc-100 mb-6">History</h1>

      {/* Streak stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">{loading ? '…' : streak}</div>
          <div className="text-zinc-500 text-xs mt-0.5">streak</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-zinc-100">{loading ? '…' : longest}</div>
          <div className="text-zinc-500 text-xs mt-0.5">best streak</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-zinc-100">{loading ? '…' : sessions.length}</div>
          <div className="text-zinc-500 text-xs mt-0.5">total</div>
        </div>
      </div>

      {/* Heatmap */}
      {sessions.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6 overflow-hidden">
          <h2 className="text-sm font-medium text-zinc-400 mb-3">Activity</h2>
          <StreakCalendar logEntries={sessions} />
        </div>
      )}

      {/* Session list */}
      {loading ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 animate-pulse">
              <div className="h-3.5 bg-zinc-800 rounded w-2/5 mb-2" />
              <div className="h-2.5 bg-zinc-800 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <p className="text-zinc-600 text-sm text-center mt-8">No sessions logged yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {sorted.map((s) => {
            const isOpen = expanded === s.id
            const dayLabel = s.day
              ? `Day ${s.day} — ${WORKOUT_DAYS[s.day]?.name}`
              : s.label === 'Custom'
              ? 'Custom session'
              : 'Micro session'
            return (
              <div key={s.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggle(s.id)}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left"
                >
                  <div>
                    <div className="text-zinc-200 text-sm font-medium">{dayLabel}</div>
                    <div className="text-zinc-500 text-xs mt-0.5">{formatDate(s.date)}{s.bodyweight ? ` · ${s.bodyweight} kg` : ''}</div>
                  </div>
                  <span className="text-zinc-500 text-xs ml-4">{isOpen ? '▲' : '▼'}</span>
                </button>

                {isOpen && (
                  <div className="border-t border-zinc-800 px-4 py-3">
                    {s.exercises?.length > 0 && (
                      <div className="mb-3">
                        {s.exercises.map((ex, i) => (
                          <div key={i} className="flex items-center justify-between py-1.5 border-b border-zinc-800/50 last:border-0">
                            <span className="text-zinc-300 text-xs">{ex.name}</span>
                            <span className="text-zinc-500 text-xs">
                              {ex.sets}×{ex.reps}{ex.weight ? ` · ${ex.weight}kg` : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    {s.notes && (
                      <p className="text-zinc-400 text-xs italic mt-2">{s.notes}</p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
