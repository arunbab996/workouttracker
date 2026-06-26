import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useData } from '../context/DataContext'
import { today, formatDate, uid } from '../utils/helpers'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm">
      <div className="text-zinc-400 text-xs">{label}</div>
      <div className="text-zinc-100 font-semibold">{payload[0].value} kg</div>
    </div>
  )
}

export default function Weight() {
  const { weights, addWeight } = useData()
  const [date, setDate] = useState(today())
  const [value, setValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    if (!value) return
    setSaving(true)
    try {
      await addWeight({ id: uid(), date, value: parseFloat(value) })
      setValue('')
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const sorted = [...weights].sort((a, b) => a.date.localeCompare(b.date))
  const chartData = sorted.map((w) => ({ date: formatDate(w.date), value: Number(w.value) }))
  const recent = [...weights].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10)

  return (
    <div className="max-w-lg mx-auto px-4 pt-8 pb-28">
      <h1 className="text-xl font-semibold text-zinc-100 mb-6">Bodyweight</h1>

      {/* Log */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6">
        <h2 className="text-sm font-medium text-zinc-400 mb-3">Log weight</h2>
        <div className="flex gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-zinc-100 text-sm focus:outline-none focus:border-emerald-500"
          />
          <input
            type="number"
            step="0.1"
            placeholder="kg"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-zinc-100 text-sm focus:outline-none focus:border-emerald-500 placeholder:text-zinc-600"
          />
          <button
            onClick={handleSave}
            className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-lg px-4 text-sm transition-colors disabled:opacity-50"
            disabled={saving}
          >
            {saved ? '✓' : saving ? '…' : 'Add'}
          </button>
        </div>
      </div>

      {/* Chart */}
      {chartData.length >= 2 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6">
          <h2 className="text-sm font-medium text-zinc-400 mb-4">Trend</h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#27272a" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: '#71717a', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                domain={['auto', 'auto']}
                width={30}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent entries */}
      {recent.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <h2 className="text-sm font-medium text-zinc-400 px-4 pt-4 pb-3">Recent</h2>
          {recent.map((w, i) => (
            <div
              key={w.id || w.date}
              className={`flex items-center justify-between px-4 py-3 ${
                i < recent.length - 1 ? 'border-b border-zinc-800/60' : ''
              }`}
            >
              <span className="text-zinc-400 text-sm">{formatDate(w.date)}</span>
              <span className="text-zinc-100 font-semibold">{w.value} kg</span>
            </div>
          ))}
        </div>
      )}

      {weights.length === 0 && (
        <p className="text-zinc-600 text-sm text-center mt-8">No entries yet. Log your first weight above.</p>
      )}
    </div>
  )
}
