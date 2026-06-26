export function today() {
  return new Date().toISOString().slice(0, 10)
}

export function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

export function parseReps(repsStr) {
  if (!repsStr) return null
  const s = String(repsStr).trim()
  // time-based like "45s"
  if (/^\d+s$/.test(s)) return null
  // "10 each" → 20
  const eachMatch = s.match(/^(\d+)\s*each/i)
  if (eachMatch) return parseInt(eachMatch[1]) * 2
  // "10–15" or "10-15" → average
  const rangeMatch = s.match(/^(\d+)[–\-](\d+)$/)
  if (rangeMatch) return (parseInt(rangeMatch[1]) + parseInt(rangeMatch[2])) / 2
  // plain number
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
  d.setHours(0, 0, 0, 0)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const mon = new Date(d)
  mon.setDate(d.getDate() + diff)
  const sun = new Date(mon)
  sun.setDate(mon.getDate() + 6)
  return {
    start: mon.toISOString().slice(0, 10),
    end: sun.toISOString().slice(0, 10),
  }
}

export function computeStreak(logEntries) {
  if (!logEntries.length) return 0
  const days = new Set(logEntries.map((e) => e.date))
  let streak = 0
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  const todayStr = d.toISOString().slice(0, 10)
  if (!days.has(todayStr)) d.setDate(d.getDate() - 1)
  while (true) {
    const s = d.toISOString().slice(0, 10)
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
