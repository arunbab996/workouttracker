import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [sessions, setSessions] = useState([])
  const [weights, setWeights] = useState([])
  const [aiNote, setAiNoteState] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [{ data: s, error: se }, { data: w, error: we }, { data: a, error: ae }] =
          await Promise.all([
            supabase.from('sessions').select('*').order('date', { ascending: false }),
            supabase.from('weights').select('*').order('date', { ascending: false }),
            supabase.from('ai_notes').select('*').eq('id', 1).maybeSingle(),
          ])
        if (se) throw se
        if (we) throw we
        if (ae) throw ae
        setSessions(s ?? [])
        setWeights(w ?? [])
        setAiNoteState(a ?? null)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function addSession(session) {
    const { data, error } = await supabase
      .from('sessions')
      .insert(session)
      .select()
      .single()
    if (error) throw error
    setSessions((prev) => [data, ...prev])
    return data
  }

  async function addWeight(entry) {
    const { data, error } = await supabase
      .from('weights')
      .upsert(entry, { onConflict: 'date' })
      .select()
      .single()
    if (error) throw error
    setWeights((prev) => {
      const filtered = prev.filter((w) => w.date !== entry.date)
      return [data, ...filtered].sort((a, b) => b.date.localeCompare(a.date))
    })
    return data
  }

  async function saveAiNote(note) {
    const { data, error } = await supabase
      .from('ai_notes')
      .upsert({ id: 1, ...note })
      .select()
      .single()
    if (error) throw error
    setAiNoteState(data)
    return data
  }

  return (
    <DataContext.Provider value={{ sessions, weights, aiNote, loading, error, addSession, addWeight, saveAiNote }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside DataProvider')
  return ctx
}
