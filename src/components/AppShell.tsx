import type { ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Logo } from './Logo'

type IconName = 'home' | 'file' | 'map' | 'news' | 'bell'

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    home: <path d="m3 10 9-7 9 7v10H4V10m5 10v-6h6v6" />,
    file: <path d="M5 3h10l4 4v14H5zM14 3v5h5M8 13h8M8 17h6" />,
    map: <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3zm6-3v15m6-12v15" />,
    news: <path d="M4 5h14v15H4zM18 8h3v10a2 2 0 0 1-2 2M7 9h8M7 13h8M7 17h5" />,
    bell: <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />,
  }
  return <svg aria-hidden="true" className="ui-icon" viewBox="0 0 24 24">{paths[name]}</svg>
}

type AppShellProps = {
  children: ReactNode
  pageTitle: string
  showNotifications?: boolean
}

export function AppShell({ children, pageTitle, showNotifications = false }: AppShellProps) {
  const location = useLocation()
  const isNewReport = location.pathname === '/denuncias/nova'
  const navigation = [
    { label: 'Visão geral', to: '/painel', icon: 'home' as const },
    { label: isNewReport ? 'Nova denúncia' : 'Minhas denúncias', to: isNewReport ? '/denuncias/nova' : '/denuncias', icon: 'file' as const },
    { label: 'Mapa do bairro', to: '/mapa', icon: 'map' as const },
    { label: 'Notícias', to: '/noticias', icon: 'news' as const },
  ]

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Logo />
        <p className="nav-label">Morador</p>
        <nav aria-label="Menu do morador" className="side-nav">
          {navigation.map((item) => (
            <NavLink className={({ isActive }) => isActive ? 'active' : ''} end key={item.to} to={item.to}>
              <Icon name={item.icon} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-user">
          <span className="avatar">JS</span>
          <div><strong>João da Silva</strong><small>Morador · Centro</small></div>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <strong>{pageTitle}</strong>
          <div className="top-actions">
            {showNotifications && <button aria-label="Notificações" className="icon-button" type="button"><Icon name="bell" /></button>}
            <span className="role-chip">Morador</span>
          </div>
        </header>
        {children}
      </div>

      <nav aria-label="Navegação mobile" className="bottom-nav">
        {navigation.map((item) => (
          <NavLink className={({ isActive }) => isActive ? 'active' : ''} end key={item.to} to={item.to}>
            <Icon name={item.icon} />
            <small>{item.label === 'Visão geral' ? 'Início' : item.label.replace(' do bairro', '').replace('Nova denúncia', 'Denúncias')}</small>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
