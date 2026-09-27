import { createContext } from 'react'
import type { User } from '../api/types'

export type AuthContextValue = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isDemo: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (payload: { name: string; email: string; password: string; neighborhood?: string }) => Promise<void>
  logout: () => void
}

const unauthenticatedContext: AuthContextValue = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  isDemo: false,
  error: null,
  login: async () => undefined,
  register: async () => undefined,
  logout: () => undefined,
}

export const AuthContext = createContext<AuthContextValue>(unauthenticatedContext)
