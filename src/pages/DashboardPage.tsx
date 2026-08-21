import { Link } from 'react-router-dom'
import { AppShell } from '../components/AppShell'

const stats = [
  ['Minhas denúncias', '5', 'Total registrado', 'green'],
  ['Em análise', '1', 'Aguardando atualização', 'yellow'],
  ['Resolvidas', '4', 'Ocorrências concluídas', 'green'],
  ['Notícias novas', '3', 'Desde seu último acesso', 'blue'],
]

const reports = [
  ['Lixo acumulado na rua', 'Rua Principal, Parque Piauí', 'Lixo', '12/08/2026', 'Resolvida'],
  ['Vazamento de água e esgoto', 'Av. Marechal Castelo Branco', 'Saneamento', '08/08/2026', 'Em análise'],
  ['Buraco no asfaltamento', 'Rua das Palmeiras', 'Vias', '03/08/2026', 'Resolvida'],
  ['Alagamento de rua', 'Av. Industrial', 'Drenagem', '29/07/2026', 'Resolvida'],
]

const news = [
  'Mutirão de limpeza neste sábado',
  'Nova coleta seletiva começa no próximo mês',
  'Iluminação pública recebe manutenção',
]

export function DashboardPage() {
  return (
    <AppShell pageTitle="Visão geral" showNotifications>
      <main className="content">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Bom dia, João</p>
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
            <div className="table-scroll">
              <table>
                <thead><tr><th>Ocorrência</th><th>Categoria</th><th>Data</th><th>Status</th></tr></thead>
                <tbody>
                  {reports.map(([title, address, category, date, status]) => (
                    <tr key={title}>
                      <td><strong>{title}</strong><small>{address}</small></td>
                      <td><span className="neutral-badge">{category}</span></td>
                      <td>{date}</td>
                      <td><span className={status === 'Resolvida' ? 'status resolved' : 'status analysis'}>{status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
