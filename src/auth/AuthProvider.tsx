import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { fetchCurrentUser, loginRequest } from '../api/auth'
import { clearSession, loadSession, saveSession } from '../api/session'
import type { ApiSession } from '../api/types'
import { AuthContext, type AuthStatus } from './authContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(() => (loadSession() ? 'loading' : 'anonymous'))
  const [session, setSession] = useState<ApiSession | null>(null)

  useEffect(() => {
    const stored = loadSession()
    if (!stored) {
      return
    }
    let cancelled = false
    fetchCurrentUser(stored.token)
      .then((user) => {
        if (cancelled) {
          return
        }
        const fresh: ApiSession = { token: stored.token, user }
        saveSession(fresh)
        setSession(fresh)
        setStatus('authenticated')
      })
      .catch(() => {
        if (cancelled) {
          return
        }
        clearSession()
        setStatus('anonymous')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(() => ({
    status,
    user: session?.user ?? null,
    token: session?.token ?? null,
    async login(email: string, password: string) {
      const next = await loginRequest(email, password)
      saveSession(next)
      setSession(next)
      setStatus('authenticated')
    },
    logout() {
      clearSession()
      setSession(null)
      setStatus('anonymous')
    },
  }), [status, session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
