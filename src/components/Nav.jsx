import { NavLink, useLocation } from 'react-router-dom'

const links = [
  {
    to: '/',
    label: 'Home',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21H3V9.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    to: '/log',
    label: 'Log',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" d="M12 8v8M8 12h8" />
      </svg>
    ),
  },
  {
    to: '/weight',
    label: 'Weight',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18" />
        <circle cx="12" cy="9" r="3" />
      </svg>
    ),
  },
  {
    to: '/history',
    label: 'History',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path strokeLinecap="round" d="M3 9h18" />
        <path strokeLinecap="round" d="M8 2v4M16 2v4" />
        <path strokeLinecap="round" d="M7 14h4M7 17h6" />
      </svg>
    ),
  },
  {
    to: '/progress',
    label: 'Progress',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <polyline strokeLinecap="round" strokeLinejoin="round" points="3,17 8,11 13,14 21,6" />
        <path strokeLinecap="round" d="M3 21h18" />
      </svg>
    ),
  },
  {
    to: '/coach',
    label: 'Coach',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.5 4.5H18l-3.75 2.7 1.5 4.5L12 12l-3.75 2.7 1.5-4.5L6 7.5h4.5z" />
        <path strokeLinecap="round" d="M12 17v4" />
        <path strokeLinecap="round" d="M9 21h6" />
      </svg>
    ),
  },
]

export default function Nav() {
  const { pathname } = useLocation()
  if (pathname === '/micro') return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 border-t border-zinc-800">
      <div className="flex items-stretch max-w-lg mx-auto">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-2.5 gap-0.5 text-[10px] font-medium transition-colors ${
                isActive ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
              }`
            }
          >
            {l.icon}
            {l.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
