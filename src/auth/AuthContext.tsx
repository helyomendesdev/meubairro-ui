import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { authApi, TOKEN_STORAGE_KEY } from '../api/client'
import type { User } from '../api/types'
import { AuthContext, type AuthContextValue } from './context'

const demoUser: User = {
  id: 0,
  name: 'João da Silva',
  email: 'demo@meubairro.local',
  role: 'MORADOR',
  neighborhood: 'Centro',
  organization: null,
  created_at: '2026-08-01T00:00:00Z',
}

type AuthProviderProps = {
  children: ReactNode
  demo?: boolean
}

export function AuthProvider({ children, demo = false }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(demo ? demoUser : null)
  const [isDemo, setIsDemo] = useState(demo)
  const [isLoading, setIsLoading] = useState(() => !demo && Boolean(localStorage.getItem(TOKEN_STORAGE_KEY)))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (demo) {
      return
    }

    const token = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (!token) {
      return
    }
    authApi.me()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY)
        setUser(null)
      })
      .finally(() => setIsLoading(false))
  }, [demo])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    isDemo,
    error,
    async login(email, password) {
      setError(null)
      setIsLoading(true)
      try {
        const session = await authApi.login(email, password)
        localStorage.setItem(TOKEN_STORAGE_KEY, session.access_token)
        setIsDemo(false)
        setUser(session.user)
      } catch (cause) {
        const message = cause instanceof Error ? cause.message : 'Falha ao entrar.'
        setError(message)
        throw cause
      } finally {
        setIsLoading(false)
      }
    },
    async register(payload) {
      setError(null)
      setIsLoading(true)
      try {
        await authApi.register(payload)
        const session = await authApi.login(payload.email, payload.password)
        localStorage.setItem(TOKEN_STORAGE_KEY, session.access_token)
        setIsDemo(false)
        setUser(session.user)
      } catch (cause) {
        const message = cause instanceof Error ? cause.message : 'Falha ao cadastrar.'
        setError(message)
        throw cause
      } finally {
        setIsLoading(false)
      }
    },
    logout() {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      setUser(null)
      setIsDemo(false)
      setError(null)
    },
  }), [error, isDemo, isLoading, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
