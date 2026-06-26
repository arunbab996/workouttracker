import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useData } from '../context/DataContext'
import { WORKOUT_DAYS } from '../data/workouts'
import { formatDate, calcVolume } from '../utils/helpers'

const ALL_EXERCISES = Object.values(WORKOUT_DAYS).flatMap((d) => d.exercises.map((e) => e.name))
const UNIQUE_EXERCISES = [...new Set(ALL_EXERCISES)]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm">
      <div className="text-zinc-400 text-xs">{label}</div>
      <div className="text-zinc-100 font-semibold">{payload[0].value.toFixed(0)} vol</div>
    </div>
  )
}

export default function Progress() {
  const { sessions } = useData()
  const [selected, setSelected] = useState(UNIQUE_EXERCISES[0])

  const chartData = useMemo(() => {
    const points = []
    const sorted = [...sessions].sort((a, b) => a.date.localeCompare(b.date))
    sorted.forEach((s) => {
      const ex = s.exercises?.find((e) => e.name === selected)
      if (!ex) return
      const vol = calcVolume(Number(ex.sets), ex.reps, Number(ex.weight))
      if (vol !== null) {
        points.push({ date: formatDate(s.date), volume: vol, rawDate: s.date, sets: ex.sets, reps: ex.reps, weight: ex.weight })
      }
    })
    return points
  }, [sessions, selected])

  const pctChange = useMemo(() => {
    if (chartData.length < 2) return null
    const first = chartData[0].volume
    const last = chartData[chartData.length - 1].volume
    return (((last - first) / first) * 100).toFixed(1)
  }, [chartData])

  const lastLogged = chartData.length ? chartData[chartData.length - 1] : null

  return (
    <div className="max-w-lg mx-auto px-4 pt-8 pb-28">
      <h1 className="text-xl font-semibold text-zinc-100 mb-6">Progress</h1>

      {/* Exercise picker */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-4">
        <label className="block text-xs text-zinc-500 mb-2 uppercase tracking-wide">Exercise</label>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-zinc-100 text-sm focus:outline-none focus:border-emerald-500"
        >
          {UNIQUE_EXERCISES.map((ex) => (
            <option key={ex} value={ex}>{ex}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      {lastLogged && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
            <div className="text-lg font-bold text-zinc-100">
              {lastLogged.weight ? `${lastLogged.weight}kg` : 'BW'}
            </div>
            <div className="text-zinc-500 text-xs mt-0.5">last weight</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
            <div className={`text-lg font-bold ${pctChange === null ? 'text-zinc-500' : Number(pctChange) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {pctChange !== null ? `${Number(pctChange) >= 0 ? '+' : ''}${pctChange}%` : '—'}
            </div>
            <div className="text-zinc-500 text-xs mt-0.5">volume change</div>
          </div>
        </div>
      )}

      {/* Chart */}
      {chartData.length >= 2 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <h2 className="text-sm font-medium text-zinc-400 mb-4">
            Volume over time <span className="text-zinc-600 font-normal">(sets × reps × kg)</span>
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#27272a" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} width={36} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="volume"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
          <p className="text-zinc-500 text-sm">
            {chartData.length === 0
              ? 'No data for this exercise yet.'
              : 'Need at least 2 sessions to show a trend.'}
          </p>
        </div>
      )}
    </div>
  )
}
