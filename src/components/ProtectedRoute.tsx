import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../auth/useAuth'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isDemo, isLoading } = useAuth()
  if (isDemo) return children
  if (isLoading) return <main className="loading-state">Carregando sua sessão...</main>
  return isAuthenticated ? children : <Navigate replace to="/" />
}
