import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react'

// Experience flow state machine — see PROJECT_BRIEF.md section 6.
export type SessionPhase = 'landing' | 'booting' | 'zooming-in' | 'desktop' | 'zooming-out'

interface SessionState {
  phase: SessionPhase
  isRestarting: boolean
}

type SessionAction =
  | { type: 'LOGIN' }
  | { type: 'BOOT_COMPLETE' }
  | { type: 'ZOOM_IN_COMPLETE' }
  | { type: 'LOGOUT' }
  | { type: 'ZOOM_OUT_COMPLETE' }
  | { type: 'RESTART' }

const initialState: SessionState = { phase: 'landing', isRestarting: false }

function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'LOGIN':
      return state.phase === 'landing' ? { phase: 'booting', isRestarting: false } : state
    case 'BOOT_COMPLETE':
      if (state.phase !== 'booting') return state
      return state.isRestarting ? { phase: 'desktop', isRestarting: false } : { ...state, phase: 'zooming-in' }
    case 'ZOOM_IN_COMPLETE':
      return state.phase === 'zooming-in' ? { ...state, phase: 'desktop' } : state
    case 'LOGOUT':
      return state.phase === 'desktop' ? { ...state, phase: 'zooming-out' } : state
    case 'ZOOM_OUT_COMPLETE':
      return state.phase === 'zooming-out' ? { phase: 'landing', isRestarting: false } : state
    case 'RESTART':
      return state.phase === 'desktop' ? { phase: 'booting', isRestarting: true } : state
    default:
      return state
  }
}

interface SessionContextValue extends SessionState {
  login: () => void
  bootComplete: () => void
  zoomInComplete: () => void
  logout: () => void
  zoomOutComplete: () => void
  restart: () => void
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sessionReducer, initialState)

  const value = useMemo<SessionContextValue>(
    () => ({
      ...state,
      login: () => dispatch({ type: 'LOGIN' }),
      bootComplete: () => dispatch({ type: 'BOOT_COMPLETE' }),
      zoomInComplete: () => dispatch({ type: 'ZOOM_IN_COMPLETE' }),
      logout: () => dispatch({ type: 'LOGOUT' }),
      zoomOutComplete: () => dispatch({ type: 'ZOOM_OUT_COMPLETE' }),
      restart: () => dispatch({ type: 'RESTART' }),
    }),
    [state],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- context + hook pattern
export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within a SessionProvider')
  return ctx
}
