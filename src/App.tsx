import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { NewReportPage } from './pages/NewReportPage'
import { MapPage } from './pages/MapPage'
import { NewsPage, ReportsPage } from './pages/ResidentListsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/painel" element={<DashboardPage />} />
      <Route path="/denuncias/nova" element={<NewReportPage />} />
      <Route path="/mapa" element={<MapPage />} />
      <Route path="/denuncias" element={<ReportsPage />} />
      <Route path="/noticias" element={<NewsPage />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  )
}

export default App
