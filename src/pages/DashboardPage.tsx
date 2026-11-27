import { Link } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { ErrorBanner, LoadingState } from '../components/AsyncState'
import {
  formatDate,
  REPORT_CATEGORY_LABELS,
  REPORT_STATUS_LABELS,
} from '../api/reports'
import { useMyReports } from '../hooks/useMyReports'
import { useReportStats } from '../hooks/usePublicReports'
import { useAuth } from '../auth/useAuth'

const news = [
  'Mutirão de limpeza neste sábado',
  'Nova coleta seletiva começa no próximo mês',
  'Iluminação pública recebe manutenção',
]

export function DashboardPage() {
  const { user } = useAuth()
  const { reports, loading, error, reload } = useMyReports()
  const { stats: bairroStats } = useReportStats()

  const stats: Array<[string, string, string, string]> = [
    ['Minhas denúncias', String(reports.length), 'Total registrado', 'green'],
    [
      'Em análise',
      String(reports.filter((report) => report.status === 'EM_ANALISE').length),
      'Aguardando atualização',
      'yellow',
    ],
    [
      'Resolvidas',
      String(reports.filter((report) => report.status === 'RESOLVIDA').length),
      'Ocorrências concluídas',
      'green',
    ],
    [
      'Denúncias no bairro',
      bairroStats ? String(bairroStats.total) : '—',
      'Registradas pela comunidade',
      'blue',
    ],
  ]

  const firstName = user?.name.trim().split(/\s+/)[0] ?? 'morador'

  return (
    <AppShell pageTitle="Visão geral" showNotifications>
      <main className="content">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Bom dia, {firstName}</p>
            <h1>Acompanhe seu bairro</h1>
            <p className="lead">Veja suas denúncias e as atualizações mais recentes da comunidade.</p>
          </div>
          <Link className="primary-link-button" to="/denuncias/nova">+ <span>Nova denúncia</span></Link>
        </div>

        <section aria-label="Resumo" className="stats-grid">
          {stats.map(([label, value, note, tone]) => (
            <article className="stat-card" key={label}>
              <div className="stat-head"><span>{label}</span><span className={`stat-symbol ${tone}`}>✓</span></div>
              <strong>{value}</strong>
              <small>{note}</small>
            </article>
          ))}
        </section>

        <div className="dashboard-grid">
          <section className="panel">
            <header className="panel-head"><h2>Denúncias recentes</h2><Link to="/denuncias">Ver todas</Link></header>
            {loading ? <LoadingState label="Carregando suas denúncias..." /> : null}
            {error ? <ErrorBanner message={error} onRetry={reload} /> : null}
            {!loading && !error ? (
              reports.length === 0 ? (
                <p className="async-loading" role="status">Você ainda não registrou denúncias. Use o botão Nova denúncia.</p>
              ) : (
                <div className="table-scroll">
                  <table>
                    <thead><tr><th>Ocorrência</th><th>Categoria</th><th>Data</th><th>Status</th></tr></thead>
                    <tbody>
                      {reports.slice(0, 5).map((report) => (
                        <tr key={report.id}>
                          <td><strong>{report.title}</strong><small>{report.location}</small></td>
                          <td><span className="neutral-badge">{REPORT_CATEGORY_LABELS[report.category]}</span></td>
                          <td>{formatDate(report.recorded_at)}</td>
                          <td><span className={report.status === 'RESOLVIDA' ? 'status resolved' : report.status === 'ABERTA' ? 'status open' : 'status analysis'}>{REPORT_STATUS_LABELS[report.status]}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : null}
          </section>

          <section className="panel">
            <header className="panel-head"><h2>Notícias do bairro</h2><Link to="/noticias">Ver feed</Link></header>
            <div className="news-list">
              {news.map((title, index) => (
                <article className="news-item" key={title}>
                  <span className={`news-image news-image--${index + 1}`} />
                  <div><strong>{title}</strong><small>Publicado há {index === 0 ? '1 dia' : `${index * 2 + 2} dias`}</small></div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </AppShell>
  )
}
