import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../api/client'
import {
  listPublicReports,
  fetchReportStats,
  type PublicReportParams,
  type ReportRead,
  type ReportStats,
} from '../api/reports'

export interface PublicReportsState {
  reports: ReportRead[]
  loading: boolean
  error: string | null
  reload: () => void
}

export function usePublicReports(params: PublicReportParams = {}): PublicReportsState {
  const statusParam = params.status ?? null
  const categoryParam = params.category ?? null
  const [reports, setReports] = useState<ReportRead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    setReloadToken((value) => value + 1)
  }, [])

  useEffect(() => {
    let cancelled = false
    listPublicReports({ status: statusParam, category: categoryParam })
      .then((items) => {
        if (!cancelled) {
          setReports(items)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : 'Não foi possível carregar as ocorrências do bairro.',
          )
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [statusParam, categoryParam, reloadToken])

  return { reports, loading, error, reload }
}

export function useReportStats(): {
  stats: ReportStats | null
  loading: boolean
  error: string | null
} {
  const [stats, setStats] = useState<ReportStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchReportStats()
      .then((data) => {
        if (!cancelled) {
          setStats(data)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : 'Não foi possível carregar os dados do bairro.',
          )
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { stats, loading, error }
}
