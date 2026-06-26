import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { WORKOUT_DAYS } from '../data/workouts'
import ExerciseTable from '../components/ExerciseTable'
import { today, uid } from '../utils/helpers'

const DAYS = ['A', 'B', 'C', 'Custom']

function defaultExercises(day) {
  if (day === 'Custom') return []
  return WORKOUT_DAYS[day].exercises.map((e) => ({ ...e }))
}

function blankExercise() {
  return { name: '', sets: 3, reps: '10', weight: 0 }
}

export default function LogWorkout() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initDay = searchParams.get('day') || 'A'

  const { addSession } = useData()
  const [day, setDay] = useState(initDay)
  const [date, setDate] = useState(today())
  const [exercises, setExercises] = useState(defaultExercises(initDay))
  const [bodyweight, setBodyweight] = useState('')
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  function handleDayChange(d) {
    setDay(d)
    setExercises(defaultExercises(d))
  }

  function addRow() {
    setExercises((prev) => [...prev, blankExercise()])
  }

  function removeRow(i) {
    setExercises((prev) => prev.filter((_, idx) => idx !== i))
  }

  async function handleSave() {
    setSaving(true)
    setSaveError(null)
    try {
      await addSession({
        id: uid(),
        day: day === 'Custom' ? null : day,
        date,
        type: 'full',
        label: day === 'Custom' ? 'Custom' : null,
        bodyweight: bodyweight ? parseFloat(bodyweight) : null,
        notes,
        exercises: exercises.map((e) => ({
          name: e.name,
          sets: Number(e.sets),
          reps: e.reps,
          weight: Number(e.weight),
        })),
      })
      setSaved(true)
      setTimeout(() => navigate('/'), 800)
    } catch (e) {
      setSaveError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const isCustom = day === 'Custom'

  return (
    <div className="max-w-lg mx-auto px-4 pt-8 pb-28">
      <h1 className="text-xl font-semibold text-zinc-100 mb-6">Log session</h1>

      {/* Day + date row */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1">
          <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wide">Day</label>
          <div className="flex gap-1.5">
            {DAYS.map((d) => (
              <button
                key={d}
                onClick={() => handleDayChange(d)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
                  day === d
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                {d === 'Custom' ? '＋' : d}
                <span className="block text-[10px] font-normal opacity-70">
                  {d === 'Custom' ? 'custom' : WORKOUT_DAYS[d].name}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wide">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-zinc-100 text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Exercises */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-4">
        <h2 className="text-sm font-medium text-zinc-400 mb-3">
          {isCustom ? 'Custom exercises' : `Day ${day} — ${WORKOUT_DAYS[day].name}`}
        </h2>

        {exercises.length > 0 ? (
          <ExerciseTable
            exercises={exercises}
            onChange={setExercises}
            removable={isCustom}
            onRemove={removeRow}
          />
        ) : (
          <p className="text-zinc-600 text-sm py-2">No exercises yet — add one below.</p>
        )}

        {isCustom && (
          <button
            onClick={addRow}
            className="mt-3 w-full py-2.5 rounded-lg border border-dashed border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 text-sm transition-colors"
          >
            + Add exercise
          </button>
        )}
      </div>

      {/* Bodyweight */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-4">
        <label className="block text-xs text-zinc-500 mb-2 uppercase tracking-wide">Bodyweight (kg) — optional</label>
        <input
          type="number"
          placeholder="e.g. 72.5"
          value={bodyweight}
          onChange={(e) => setBodyweight(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-zinc-100 text-sm focus:outline-none focus:border-emerald-500 placeholder:text-zinc-600"
        />
      </div>

      {/* Notes */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6">
        <label className="block text-xs text-zinc-500 mb-2 uppercase tracking-wide">Notes</label>
        <textarea
          rows={3}
          placeholder="How did it feel? Anything to note…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-zinc-100 text-sm focus:outline-none focus:border-emerald-500 placeholder:text-zinc-600 resize-none"
        />
      </div>

      {saveError && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 text-rose-400 text-sm mb-4">
          {saveError}
        </div>
      )}
      <button
        onClick={handleSave}
        disabled={saved || saving || exercises.length === 0}
        className={`w-full py-4 rounded-xl font-semibold text-base transition-colors ${
          saved
            ? 'bg-emerald-600 text-zinc-950'
            : saving || exercises.length === 0
            ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
            : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950'
        }`}
      >
        {saved ? 'Saved ✓' : saving ? 'Saving…' : 'Save session'}
      </button>
    </div>
  )
}
