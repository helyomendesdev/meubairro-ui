import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { NewReportPage } from './pages/NewReportPage'
import { MapPage } from './pages/MapPage'
import { NewsPage, ReportsPage } from './pages/ResidentListsPage'
import { AuthProvider } from './auth/AuthProvider'
import { RequireAuth } from './auth/RequireAuth'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<RequireAuth />}>
          <Route path="/painel" element={<DashboardPage />} />
          <Route path="/denuncias/nova" element={<NewReportPage />} />
          <Route path="/mapa" element={<MapPage />} />
          <Route path="/denuncias" element={<ReportsPage />} />
          <Route path="/noticias" element={<NewsPage />} />
        </Route>
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
