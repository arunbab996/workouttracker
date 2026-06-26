// Use local date parts everywhere — toISOString() returns UTC which breaks
// timezones ahead of UTC (e.g. IST = UTC+5:30, midnight local = yesterday UTC)
function localDateStr(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function today() {
  return localDateStr(new Date())
}

export function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

export function parseReps(repsStr) {
  if (!repsStr) return null
  const s = String(repsStr).trim()
  if (/^\d+s$/.test(s)) return null
  const eachMatch = s.match(/^(\d+)\s*each/i)
  if (eachMatch) return parseInt(eachMatch[1]) * 2
  const rangeMatch = s.match(/^(\d+)[–\-](\d+)$/)
  if (rangeMatch) return (parseInt(rangeMatch[1]) + parseInt(rangeMatch[2])) / 2
  const numMatch = s.match(/^(\d+)/)
  if (numMatch) return parseInt(numMatch[1])
  return null
}

export function calcVolume(sets, reps, weight) {
  const r = parseReps(reps)
  if (r === null) return null
  return sets * r * (weight || 1)
}

export function getWeekBounds() {
  const d = new Date()
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const mon = new Date(d)
  mon.setDate(d.getDate() + diff)
  const sun = new Date(mon)
  sun.setDate(mon.getDate() + 6)
  return {
    start: localDateStr(mon),
    end: localDateStr(sun),
  }
}

export function computeStreak(logEntries) {
  if (!logEntries.length) return 0
  const days = new Set(logEntries.map((e) => e.date))
  let streak = 0
  const d = new Date()
  const todayStr = localDateStr(d)
  if (!days.has(todayStr)) d.setDate(d.getDate() - 1)
  while (true) {
    const s = localDateStr(d)
    if (!days.has(s)) break
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
}

export function computeLongestStreak(logEntries) {
  if (!logEntries.length) return 0
  const days = [...new Set(logEntries.map((e) => e.date))].sort()
  let longest = 1
  let current = 1
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1])
    const curr = new Date(days[i])
    const diff = (curr - prev) / 86400000
    if (diff === 1) {
      current++
      longest = Math.max(longest, current)
    } else {
      current = 1
    }
  }
  return longest
}

export function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}
