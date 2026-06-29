import { useState, useEffect } from 'react'
import { useData } from '../context/DataContext'
import { WORKOUT_DAYS } from '../data/workouts'
import { formatDate, computeStreak, computeLongestStreak } from '../utils/helpers'
import StreakCalendar from '../components/StreakCalendar'

function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm px-4 py-2.5 rounded-xl shadow-lg animate-fade-in">
      {message}
    </div>
  )
}

export default function History() {
  const { sessions, loading, deleteSession } = useData()
  const [expanded, setExpanded] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [deleteInput, setDeleteInput] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState(null)

  const sorted = [...sessions].sort((a, b) => b.date.localeCompare(a.date))
  const streak = computeStreak(sessions)
  const longest = computeLongestStreak(sessions)

  function toggle(id) {
    if (expanded === id) {
      setExpanded(null)
      cancelDelete()
    } else {
      setExpanded(id)
      cancelDelete()
    }
  }

  function startDelete(id) {
    setDeletingId(id)
    setDeleteInput('')
  }

  function cancelDelete() {
    setDeletingId(null)
    setDeleteInput('')
  }

  async function confirmDelete(id) {
    setDeleting(true)
    try {
      await deleteSession(id)
      setExpanded(null)
      setDeletingId(null)
      setDeleteInput('')
      setToast('Session removed')
    } catch (e) {
      setToast('Failed to delete — try again')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-8 pb-28">
      <h1 className="text-xl font-semibold text-zinc-100 mb-6">History</h1>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* Stats */}
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
            const isConfirming = deletingId === s.id
            const dayLabel = s.day
              ? `Day ${s.day} — ${WORKOUT_DAYS[s.day]?.name}`
              : s.label === 'Custom'
              ? 'Custom session'
              : 'Micro session'

            return (
              <div key={s.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                {/* Header row */}
                <button
                  onClick={() => toggle(s.id)}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left"
                >
                  <div>
                    <div className="text-zinc-200 text-sm font-medium">{dayLabel}</div>
                    <div className="text-zinc-500 text-xs mt-0.5">
                      {formatDate(s.date)}{s.bodyweight ? ` · ${s.bodyweight} kg` : ''}
                    </div>
                  </div>
                  <span className="text-zinc-500 text-xs ml-4">{isOpen ? '▲' : '▼'}</span>
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div className="border-t border-zinc-800 px-4 py-3">
                    {/* Exercises */}
                    {s.exercises?.length > 0 && (
                      <div className="mb-3">
                        {s.exercises.map((ex, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between py-1.5 border-b border-zinc-800/50 last:border-0"
                          >
                            <span className="text-zinc-300 text-xs">{ex.name}</span>
                            <span className="text-zinc-500 text-xs">
                              {ex.sets}×{ex.reps}{ex.weight ? ` · ${ex.weight}kg` : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {s.notes && (
                      <p className="text-zinc-400 text-xs italic mb-3">{s.notes}</p>
                    )}

                    {/* Delete flow */}
                    {!isConfirming ? (
                      <button
                        onClick={() => startDelete(s.id)}
                        className="text-zinc-600 hover:text-zinc-400 text-xs underline underline-offset-2 transition-colors mt-1"
                      >
                        Delete session
                      </button>
                    ) : (
                      <div className="mt-3 border-t border-zinc-800 pt-3">
                        <p className="text-zinc-400 text-xs mb-2">
                          Are you sure? This can't be undone.
                        </p>
                        <input
                          type="text"
                          placeholder='Type "delete" to confirm'
                          value={deleteInput}
                          onChange={(e) => setDeleteInput(e.target.value)}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500 placeholder:text-zinc-600 mb-2"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => confirmDelete(s.id)}
                            disabled={deleteInput !== 'delete' || deleting}
                            className="text-xs px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-rose-500/40 text-rose-400 hover:bg-rose-500/10 disabled:hover:bg-transparent"
                          >
                            {deleting ? 'Deleting…' : 'Yes, delete'}
                          </button>
                          <button
                            onClick={cancelDelete}
                            className="text-xs px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
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
