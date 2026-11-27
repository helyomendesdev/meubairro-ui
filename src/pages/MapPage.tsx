import { useMemo, useState } from 'react'
import { AppShell } from '../components/AppShell'
import { ErrorBanner, LoadingState } from '../components/AsyncState'
import {
  formatDate,
  REPORT_CATEGORY_LABELS,
  REPORT_STATUS_LABELS,
  type ReportCategory,
  type ReportStatus,
} from '../api/reports'
import { usePublicReports, useReportStats } from '../hooks/usePublicReports'

const STATUSES = Object.keys(REPORT_STATUS_LABELS) as ReportStatus[]
const CATEGORIES = Object.keys(REPORT_CATEGORY_LABELS) as ReportCategory[]

const MARKER_CLASSES: Record<ReportStatus, string> = {
  ABERTA: 'map-marker map-marker--red',
  EM_ANALISE: 'map-marker map-marker--yellow',
  RESOLVIDA: 'map-marker map-marker--green',
}

const STATUS_FILTER_LABELS: Record<ReportStatus, string> = {
  ABERTA: 'Abertas',
  EM_ANALISE: 'Em análise',
  RESOLVIDA: 'Resolvidas',
}

export function MapPage() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<Record<ReportStatus, boolean>>({
    ABERTA: true,
    EM_ANALISE: true,
    RESOLVIDA: true,
  })
  const [categoryFilter, setCategoryFilter] = useState<Record<ReportCategory, boolean>>(
    () => Object.fromEntries(CATEGORIES.map((category) => [category, true])) as Record<ReportCategory, boolean>,
  )

  // filtro server-side quando o usuário isola um único valor; caso contrário
  // busca tudo e filtra localmente (busca textual e combinações)
  const activeStatuses = STATUSES.filter((status) => statusFilter[status])
  const activeCategories = CATEGORIES.filter((category) => categoryFilter[category])
  const serverParams = {
    status: activeStatuses.length === 1 ? activeStatuses[0] : null,
    category: activeCategories.length === 1 ? activeCategories[0] : null,
  }
  const { reports, loading, error, reload } = usePublicReports(serverParams)

  const { stats } = useReportStats()

  const statusCounts = useMemo(
    () =>
      Object.fromEntries(
        STATUSES.map((status) => [
          status,
          stats?.by_status.find((item) => item.status === status)?.count ?? 0,
        ]),
      ) as Record<ReportStatus, number>,
    [stats],
  )
  const categoryCounts = useMemo(
    () =>
      Object.fromEntries(
        CATEGORIES.map((category) => [
          category,
          stats?.by_category.find((item) => item.category === category)?.count ?? 0,
        ]),
      ) as Record<ReportCategory, number>,
    [stats],
  )

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return reports.filter((report) => {
      if (!statusFilter[report.status] || !categoryFilter[report.category]) {
        return false
      }
      if (!normalizedQuery) {
        return true
      }
      return (
        report.title.toLowerCase().includes(normalizedQuery) ||
        report.location.toLowerCase().includes(normalizedQuery)
      )
    })
  }, [reports, query, statusFilter, categoryFilter])

  function toggle<K extends string>(
    setter: (value: Record<K, boolean>) => void,
    current: Record<K, boolean>,
    key: K,
  ) {
    setter({ ...current, [key]: !current[key] })
  }

  return (
    <AppShell pageTitle="Mapa de denúncias">
      <main className="reports-map-layout">
        <aside className="map-filters">
          <h1>Ocorrências no bairro</h1>
          <p className="lead">{filtered.length === 1 ? '1 registro encontrado' : `${filtered.length} registros encontrados`}</p>
          <label className="map-search">
            <span className="sr-only">Buscar por rua ou ocorrência</span>
            <input aria-label="Buscar por rua ou ocorrência" placeholder="Buscar por rua ou ocorrência" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>

          {loading ? <LoadingState label="Carregando ocorrências..." /> : null}
          {error ? <ErrorBanner message={error} onRetry={reload} /> : null}

          <fieldset><legend>Status</legend>
            {STATUSES.map((status) => (
              <label key={status}>
                <span><input checked={statusFilter[status]} type="checkbox" onChange={() => toggle(setStatusFilter, statusFilter, status)} /> {STATUS_FILTER_LABELS[status]}</span>
                <small>{statusCounts[status]}</small>
              </label>
            ))}
          </fieldset>

          <fieldset><legend>Categoria</legend>
            {CATEGORIES.map((category) => (
              <label key={category}>
                <span><input checked={categoryFilter[category]} type="checkbox" onChange={() => toggle(setCategoryFilter, categoryFilter, category)} /> {REPORT_CATEGORY_LABELS[category]}</span>
                <small>{categoryCounts[category]}</small>
              </label>
            ))}
          </fieldset>

          <div className="incident-list">
            {filtered.map((report) => (
              <article key={report.id}>
                <strong>{report.title}</strong>
                <p>{report.location} · {formatDate(report.recorded_at)}</p>
                <span className={report.status === 'RESOLVIDA' ? 'status resolved' : report.status === 'ABERTA' ? 'status open' : 'status analysis'}>{REPORT_STATUS_LABELS[report.status]}</span>
              </article>
            ))}
            {!loading && !error && filtered.length === 0 ? (
              (stats?.total ?? reports.length) === 0 ? (
                <p className="async-loading" role="status">Nenhuma ocorrência registrada ainda no bairro.</p>
              ) : (
                <p className="async-loading" role="status">Nenhuma ocorrência corresponde aos filtros selecionados.</p>
              )
            ) : null}
          </div>
        </aside>

        <section aria-label="Mapa de denúncias" className="map-canvas">
          <div className="map-location">Parque Piauí, Teresina</div>
          {filtered.slice(0, 4).map((report, index) => (
            <span key={report.id} className={`${MARKER_CLASSES[report.status]} marker-${index + 1}`} />
          ))}
          <div className="map-legend"><span><i className="dot red" />Aberta</span><span><i className="dot yellow" />Em análise</span><span><i className="dot green" />Resolvida</span></div>
        </section>
      </main>
    </AppShell>
  )
}
