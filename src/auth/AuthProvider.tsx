import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { fetchCurrentUser, loginRequest } from '../api/auth'
import { clearSession, loadSession, saveSession } from '../api/session'
import type { UserRead } from '../api/types'
import { AuthContext, type AuthStatus } from './authContext'

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [status, setStatus] = useState<AuthStatus>(() => (loadSession() ? 'loading' : 'anonymous'))
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<UserRead | null>(null)

  useEffect(() => {
    const stored = loadSession()
    if (!stored) {
      return
    }
    let cancelled = false
    fetchCurrentUser(stored)
      .then((me) => {
        if (cancelled) {
          return
        }
        setToken(stored)
        setUser(me)
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
    user,
    token,
    async login(email: string, password: string) {
      const next = await loginRequest(email, password)
      saveSession(next.token)
      setToken(next.token)
      setUser(next.user)
      setStatus('authenticated')
    },
    logout() {
      clearSession()
      setToken(null)
      setUser(null)
      setStatus('anonymous')
    },
  }), [status, user, token])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
