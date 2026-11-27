import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './useAuth'

export function RequireAuth() {
  const { status } = useAuth()
  if (status === 'loading') {
    return <output className="loading-screen">Carregando...</output>
  }
  if (status === 'anonymous') {
    return <Navigate replace to="/" />
  }
  return <Outlet />
}
