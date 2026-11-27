import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../api/client'
import { listPublicReports, type ReportRead } from '../api/reports'

export interface PublicReportsState {
  reports: ReportRead[]
  loading: boolean
  error: string | null
  reload: () => void
}

export function usePublicReports(): PublicReportsState {
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
    listPublicReports()
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
  }, [reloadToken])

  return { reports, loading, error, reload }
}
