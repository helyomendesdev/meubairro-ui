import { AppShell } from '../components/AppShell'
import { ErrorBanner, LoadingState } from '../components/AsyncState'
import {
  formatDate,
  REPORT_CATEGORY_LABELS,
  REPORT_STATUS_LABELS,
} from '../api/reports'
import { useMyReports } from '../hooks/useMyReports'

const news = [
  ['Mutirão de limpeza neste sábado', 'A comunidade realizará uma ação de limpeza nas principais ruas do bairro.'],
  ['Nova coleta seletiva começa no próximo mês', 'O calendário e os pontos de coleta serão divulgados em breve.'],
  ['Iluminação pública recebe manutenção', 'Equipes iniciaram a substituição de luminárias em vias prioritárias.'],
]

export function ReportsPage() {
  const { reports, loading, error, reload } = useMyReports()

  return (
    <AppShell pageTitle="Minhas denúncias">
      <main className="content">
        <div className="page-heading"><div><p className="eyebrow">Acompanhamento</p><h1>Minhas denúncias</h1><p className="lead">Consulte o andamento das ocorrências registradas.</p></div></div>
        {loading ? <LoadingState label="Carregando suas denúncias..." /> : null}
        {error ? <ErrorBanner message={error} onRetry={reload} /> : null}
        {!loading && !error && reports.length === 0 ? (
          <p className="async-loading" role="status">Você ainda não registrou nenhuma denúncia. Use "Nova denúncia" para começar.</p>
        ) : null}
        <section className="list-grid">
          {reports.map((report) => (
            <article className="list-card" key={report.id}>
              <div>
                <h2>{report.title}</h2>
                <p>{report.location} · {REPORT_CATEGORY_LABELS[report.category]} · {formatDate(report.recorded_at)}</p>
              </div>
              <span className={report.status === 'RESOLVIDA' ? 'status resolved' : report.status === 'ABERTA' ? 'status open' : 'status analysis'}>{REPORT_STATUS_LABELS[report.status]}</span>
            </article>
          ))}
        </section>
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
