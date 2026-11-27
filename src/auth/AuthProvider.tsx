import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { fetchCurrentUser, loginRequest } from '../api/auth'
import { ApiError } from '../api/client'
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
      .catch((err: unknown) => {
        if (cancelled) {
          return
        }
        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
          // sessão inválida confirmada pela API: limpa e volta ao login
          clearSession()
          setStatus('anonymous')
          setToken(null)
          setUser(null)
          return
        }
        // falha de rede ou 5xx: mantém a sessão salva para nova tentativa
        setToken(stored)
        setUser(null)
        setStatus('authenticated')
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
