import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './useAuth'

export function RequireAuth() {
  const { status } = useAuth()
  if (status === 'loading') {
    return <main className="loading-screen" role="status">Carregando...</main>
  }
  if (status === 'anonymous') {
    return <Navigate replace to="/" />
  }
  return <Outlet />
}
