const WEEKS = 13

function localDateStr(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function StreakCalendar({ logEntries }) {
  const activeDays = new Set(logEntries.map((e) => e.date))

  const cells = []
  const end = new Date()
  const totalDays = WEEKS * 7
  const start = new Date(end)
  start.setDate(end.getDate() - (totalDays - 1))

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const key = localDateStr(d)
    const isFuture = d > end
    cells.push({ key, active: activeDays.has(key), future: isFuture })
  }

  // Group into weeks
  const weeks = []
  for (let w = 0; w < WEEKS; w++) {
    weeks.push(cells.slice(w * 7, w * 7 + 7))
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1 min-w-max">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((cell) => (
              <div
                key={cell.key}
                title={cell.key}
                className={`w-3 h-3 rounded-sm ${
                  cell.future
                    ? 'bg-zinc-800/30'
                    : cell.active
                    ? 'bg-emerald-500'
                    : 'bg-zinc-800'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-2 text-[10px] text-zinc-500">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-zinc-800 inline-block" /> No session
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> Showed up
        </span>
      </div>
    </div>
  )
}
