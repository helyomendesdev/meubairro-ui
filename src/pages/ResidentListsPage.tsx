import { AppShell } from '../components/AppShell'

const reports = [
  ['Lixo acumulado na rua', 'Rua Principal, Parque Piauí', 'Resolvida'],
  ['Vazamento de água e esgoto', 'Av. Marechal Castelo Branco', 'Em análise'],
  ['Buraco no asfaltamento', 'Rua das Palmeiras', 'Resolvida'],
  ['Alagamento de rua', 'Av. Industrial', 'Resolvida'],
]

const news = [
  ['Mutirão de limpeza neste sábado', 'A comunidade realizará uma ação de limpeza nas principais ruas do bairro.'],
  ['Nova coleta seletiva começa no próximo mês', 'O calendário e os pontos de coleta serão divulgados em breve.'],
  ['Iluminação pública recebe manutenção', 'Equipes iniciaram a substituição de luminárias em vias prioritárias.'],
]

export function ReportsPage() {
  return (
    <AppShell pageTitle="Minhas denúncias">
      <main className="content">
        <div className="page-heading"><div><p className="eyebrow">Acompanhamento</p><h1>Minhas denúncias</h1><p className="lead">Consulte o andamento das ocorrências registradas.</p></div></div>
        <section className="list-grid">
          {reports.map(([title, address, status]) => <article className="list-card" key={title}><div><h2>{title}</h2><p>{address}</p></div><span className={status === 'Resolvida' ? 'status resolved' : 'status analysis'}>{status}</span></article>)}
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
