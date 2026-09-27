import { useEffect, useState } from 'react'
import { reportsApi } from '../api/client'
import { categoryLabel, statusClass, statusLabel } from '../api/presenters'
import type { Report, ReportCategory, ReportStatus } from '../api/types'
import { useAuth } from '../auth/useAuth'
import { demoReports } from '../data/demoReports'
import { AppShell } from '../components/AppShell'

const statuses: Array<ReportStatus | ''> = ['', 'ABERTA', 'EM_ANALISE', 'RESOLVIDA']
const categories: Array<ReportCategory | ''> = ['', 'LIXO', 'ILUMINACAO', 'VIAS', 'SANEAMENTO', 'TERRENOS', 'OUTROS']

function filterDemoReports(reports: Report[], query: string, status: ReportStatus | '', category: ReportCategory | '') {
  const normalizedQuery = query.trim().toLocaleLowerCase()
  return reports.filter((report) => {
    const matchesStatus = !status || report.status === status
    const matchesCategory = !category || report.category === category
    const matchesQuery = !normalizedQuery || `${report.title} ${report.location}`.toLocaleLowerCase().includes(normalizedQuery)
    return matchesStatus && matchesCategory && matchesQuery
  })
}

export function MapPage() {
  const { isDemo } = useAuth()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<ReportStatus | ''>('')
  const [category, setCategory] = useState<ReportCategory | ''>('')
  const [reports, setReports] = useState<Report[]>(isDemo ? demoReports : [])
  const [isLoading, setIsLoading] = useState(!isDemo)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    if (isDemo) {
      return () => {
        active = false
      }
    }

    reportsApi.list({
      query: query || undefined,
      status: status || undefined,
      category: category || undefined,
    })
      .then((items) => {
        if (active) setReports(items)
      })
      .catch((cause) => {
        if (active) setError(cause instanceof Error ? cause.message : 'Não foi possível carregar o mapa.')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [category, isDemo, query, status])

  const displayedReports = isDemo ? filterDemoReports(demoReports, query, status, category) : reports

  return (
    <AppShell pageTitle="Mapa de denúncias">
      <main className="reports-map-layout">
        <aside className="map-filters">
          <h1>Ocorrências no bairro</h1>
          <p className="lead">{isLoading ? 'Carregando registros...' : `${displayedReports.length} registros encontrados`}</p>
          <label className="map-search">
            <span className="sr-only">Buscar por rua ou ocorrência</span>
            <input aria-label="Buscar por rua ou ocorrência" onChange={(event) => { setQuery(event.target.value); setError(null); if (!isDemo) setIsLoading(true) }} placeholder="Buscar por rua ou ocorrência" value={query} />
          </label>

          <fieldset><legend>Status</legend>
            {statuses.map((option) => (
              <label key={option || 'all-status'}>
                <span><input checked={status === option} name="status-filter" onChange={() => { setStatus(option); setError(null); if (!isDemo) setIsLoading(true) }} type="radio" /> {option ? statusLabel(option) : 'Todos'}</span>
                {!option && <small>{demoReports.length}</small>}
              </label>
            ))}
          </fieldset>

          <fieldset><legend>Categoria</legend>
            {categories.map((option) => (
              <label key={option || 'all-category'}>
                <span><input checked={category === option} name="category-filter" onChange={() => { setCategory(option); setError(null); if (!isDemo) setIsLoading(true) }} type="radio" /> {option ? categoryLabel(option) : 'Todas'}</span>
              </label>
            ))}
          </fieldset>

          {error && <p aria-live="polite" className="form-error" role="alert">{error}</p>}
          <div className="incident-list">
            {displayedReports.map((report, index) => (
              <article key={report.id}><strong>{report.title}</strong><p>{report.location}</p><span className={statusClass(report.status)}>{statusLabel(report.status)}</span><small className="incident-category">{categoryLabel(report.category)}</small><span className={`map-marker map-marker--inline marker-${(index % 4) + 1}`} /></article>
            ))}
            {!isLoading && displayedReports.length === 0 && <p className="empty-state">Nenhuma ocorrência corresponde aos filtros.</p>}
          </div>
        </aside>

        <section aria-label="Mapa de denúncias" className="map-canvas">
          <div className="map-location">Parque Piauí, Teresina</div>
          {displayedReports.slice(0, 12).map((report, index) => (
            <span className={`map-marker ${report.status === 'ABERTA' ? 'map-marker--red' : report.status === 'EM_ANALISE' ? 'map-marker--yellow' : ''} marker-${(index % 4) + 1}`} key={report.id} title={report.title} />
          ))}
          <div className="map-legend"><span><i className="dot red" />Aberta</span><span><i className="dot yellow" />Em análise</span><span><i className="dot green" />Resolvida</span></div>
        </section>
      </main>
    </AppShell>
  )
}