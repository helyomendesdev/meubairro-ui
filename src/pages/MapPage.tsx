import { AppShell } from '../components/AppShell'

const incidents = [
  ['Buraco no asfaltamento', 'Rua das Palmeiras · há 2 dias', 'Aberta'],
  ['Lixo acumulado na rua', 'Rua Principal · há 4 dias', 'Em análise'],
  ['Iluminação pública', 'Av. Industrial · há 6 dias', 'Resolvida'],
]

export function MapPage() {
  return (
    <AppShell pageTitle="Mapa de denúncias">
      <main className="reports-map-layout">
        <aside className="map-filters">
          <h1>Ocorrências no bairro</h1>
          <p className="lead">47 registros encontrados</p>
          <label className="map-search">
            <span className="sr-only">Buscar por rua ou ocorrência</span>
            <input aria-label="Buscar por rua ou ocorrência" placeholder="Buscar por rua ou ocorrência" />
          </label>

          <fieldset><legend>Status</legend>
            <label><span><input defaultChecked type="checkbox" /> Abertas</span><small>12</small></label>
            <label><span><input defaultChecked type="checkbox" /> Em análise</span><small>7</small></label>
            <label><span><input defaultChecked type="checkbox" /> Resolvidas</span><small>28</small></label>
          </fieldset>

          <fieldset><legend>Categoria</legend>
            <label><span><input defaultChecked type="checkbox" /> Lixo</span><small>16</small></label>
            <label><span><input defaultChecked type="checkbox" /> Iluminação</span><small>11</small></label>
            <label><span><input defaultChecked type="checkbox" /> Vias</span><small>9</small></label>
            <label><span><input defaultChecked type="checkbox" /> Outros</span><small>11</small></label>
          </fieldset>

          <div className="incident-list">
            {incidents.map(([title, meta, status]) => (
              <article key={title}><strong>{title}</strong><p>{meta}</p><span className={status === 'Resolvida' ? 'status resolved' : status === 'Aberta' ? 'status open' : 'status analysis'}>{status}</span></article>
            ))}
          </div>
        </aside>

        <section aria-label="Mapa de denúncias" className="map-canvas">
          <div className="map-location">Parque Piauí, Teresina</div>
          <span className="map-marker map-marker--red marker-1" />
          <span className="map-marker marker-2" />
          <span className="map-marker map-marker--yellow marker-3" />
          <span className="map-marker map-marker--red marker-4" />
          <div className="map-legend"><span><i className="dot red" />Aberta</span><span><i className="dot yellow" />Em análise</span><span><i className="dot green" />Resolvida</span></div>
        </section>
      </main>
    </AppShell>
  )
}
