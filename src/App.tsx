import { Navigate, Route, Routes } from 'react-router-dom'
import type { ReactNode } from 'react'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { NewReportPage } from './pages/NewReportPage'
import { MapPage } from './pages/MapPage'
import { NewsPage, ReportsPage } from './pages/ResidentListsPage'
import { RegisterPage } from './pages/RegisterPage'

function Private({ children }: { children: ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />
      <Route path="/painel" element={<Private><DashboardPage /></Private>} />
      <Route path="/denuncias/nova" element={<Private><NewReportPage /></Private>} />
      <Route path="/mapa" element={<Private><MapPage /></Private>} />
      <Route path="/denuncias" element={<Private><ReportsPage /></Private>} />
      <Route path="/noticias" element={<Private><NewsPage /></Private>} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  )
}

export default App
