import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import MicroSession from './pages/MicroSession'
import LogWorkout from './pages/LogWorkout'
import Weight from './pages/Weight'
import History from './pages/History'
import Progress from './pages/Progress'
import AICoaching from './pages/AICoaching'

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/micro" element={<MicroSession />} />
        <Route path="/log" element={<LogWorkout />} />
        <Route path="/weight" element={<Weight />} />
        <Route path="/history" element={<History />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/coach" element={<AICoaching />} />
      </Routes>
      <Nav />
    </div>
  )
}
