import { useEffect, useState } from 'react'
import { reportsApi } from '../api/client'
import type { Report } from '../api/types'
import { demoReports } from '../data/demoReports'
import { useAuth } from '../auth/useAuth'

export function useMyReports() {
  const { isDemo } = useAuth()
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

    reportsApi.listMine()
      .then((items) => {
        if (active) setReports(items)
      })
      .catch((cause) => {
        if (active) setError(cause instanceof Error ? cause.message : 'Não foi possível carregar as denúncias.')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [isDemo])

  return { reports: isDemo ? demoReports : reports, isLoading, error }
}
