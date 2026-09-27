import { Link } from 'react-router-dom'
import { categoryLabel, formatDate, statusClass, statusLabel } from '../api/presenters'
import { useMyReports } from '../hooks/useMyReports'
import { AppShell } from '../components/AppShell'

const news = [
  ['Mutirão de limpeza neste sábado', 'A comunidade realizará uma ação de limpeza nas principais ruas do bairro.'],
  ['Nova coleta seletiva começa no próximo mês', 'O calendário e os pontos de coleta serão divulgados em breve.'],
  ['Iluminação pública recebe manutenção', 'Equipes iniciaram a substituição de luminárias em vias prioritárias.'],
]

export function ReportsPage() {
  const { reports, isLoading, error } = useMyReports()

  return (
    <AppShell pageTitle="Minhas denúncias">
      <main className="content">
        <div className="page-heading">
          <div><p className="eyebrow">Acompanhamento</p><h1>Minhas denúncias</h1><p className="lead">Consulte o andamento das ocorrências registradas.</p></div>
          <Link className="primary-link-button" to="/denuncias/nova">+ <span>Nova denúncia</span></Link>
        </div>
        {error && <p aria-live="polite" className="form-error" role="alert">{error}</p>}
        {isLoading ? (
          <p className="empty-state">Carregando suas denúncias...</p>
        ) : reports.length === 0 ? (
          <section className="empty-state empty-state--card"><h2>Nenhuma denúncia registrada</h2><p>Quando você registrar uma ocorrência, ela aparecerá aqui.</p><Link className="primary-link-button" to="/denuncias/nova">Registrar denúncia</Link></section>
        ) : (
          <section className="list-grid">
            {reports.map((report) => (
              <article className="list-card" key={report.id}>
                <div><h2>{report.title}</h2><p>{report.location} · {categoryLabel(report.category)} · {formatDate(report.recorded_at)}</p></div>
                <span className={statusClass(report.status)}>{statusLabel(report.status)}</span>
              </article>
            ))}
          </section>
        )}
      </main>
    </AppShell>
  )
}

export function NewsPage() {
  return (
    <AppShell pageTitle="Notícias">
      <main className="content">
        <div className="page-heading"><div><p className="eyebrow">Comunidade</p><h1>Notícias do bairro</h1><p className="lead">Acompanhe avisos e iniciativas da sua região.</p></div></div>
        <section className="list-grid news-grid">
          {news.map(([title, description], index) => <article className="list-card news-card" key={title}><span className={`news-image news-image--${index + 1}`} /><div><h2>{title}</h2><p>{description}</p><small>Publicado recentemente</small></div></article>)}
        </section>
      </main>
    </AppShell>
  )
}