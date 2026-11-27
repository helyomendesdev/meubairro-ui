import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../auth/useAuth'
import { ApiError } from '../api/client'
import { listMyReports, type ReportRead } from '../api/reports'

export interface MyReportsState {
  reports: ReportRead[]
  loading: boolean
  error: string | null
  reload: () => void
}

export function useMyReports(): MyReportsState {
  const { status, token, logout } = useAuth()
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
    if (status !== 'authenticated' || !token) {
      return
    }
    let cancelled = false
    listMyReports(token)
      .then((items) => {
        if (!cancelled) {
          setReports(items)
        }
      })
      .catch((err: unknown) => {
        if (cancelled) {
          return
        }
        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
          logout()
          return
        }
        setError(
          err instanceof ApiError
            ? err.message
            : 'Não foi possível carregar suas denúncias.',
        )
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [status, token, reloadToken, logout])

  return { reports, loading, error, reload }
}
