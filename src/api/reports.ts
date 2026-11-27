import { apiGet, apiPost } from './client'

export type ReportCategory =
  | 'LIXO'
  | 'ILUMINACAO'
  | 'VIAS'
  | 'SANEAMENTO'
  | 'TERRENOS'
  | 'OUTROS'

export type ReportStatus = 'ABERTA' | 'EM_ANALISE' | 'RESOLVIDA'

export interface ReportRead {
  id: number
  user_id: number
  title: string
  description: string
  category: ReportCategory
  status: ReportStatus
  recorded_at: string
  location: string
  latitude: number | null
  longitude: number | null
  image_url: string | null
  created_at: string
  updated_at: string
  updated_by: string | null
}

export interface ReportCreatePayload {
  title: string
  description: string
  category: ReportCategory
  recorded_at: string | null
  location: string
  latitude: number | null
  longitude: number | null
  image_url: string | null
}

export const REPORT_CATEGORY_LABELS: Record<ReportCategory, string> = {
  LIXO: 'Lixo e resíduos',
  ILUMINACAO: 'Iluminação',
  VIAS: 'Vias',
  SANEAMENTO: 'Saneamento',
  TERRENOS: 'Terrenos',
  OUTROS: 'Outros',
}

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  ABERTA: 'Aberta',
  EM_ANALISE: 'Em análise',
  RESOLVIDA: 'Resolvida',
}

export function formatDate(iso: string): string {
  const date = new Date(iso)
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(date)
}

export function createReport(
  token: string,
  payload: ReportCreatePayload,
): Promise<ReportRead> {
  return apiPost<ReportRead>('/api/v1/reports', payload, { token })
}

export function listMyReports(token: string): Promise<ReportRead[]> {
  return apiGet<ReportRead[]>('/api/v1/reports/mine', { token })
}

export interface PublicReportParams {
  status?: ReportStatus | null
  category?: ReportCategory | null
}

export function listPublicReports(params: PublicReportParams = {}): Promise<ReportRead[]> {
  const search = new URLSearchParams()
  if (params.status) {
    search.set('status', params.status)
  }
  if (params.category) {
    search.set('category', params.category)
  }
  const query = search.toString()
  return apiGet<ReportRead[]>(query ? `/api/v1/reports?${query}` : '/api/v1/reports')
}

export interface ReportStats {
  total: number
  by_status: Array<{ status: ReportStatus; count: number }>
  by_category: Array<{ category: ReportCategory; count: number }>
}

export function fetchReportStats(): Promise<ReportStats> {
  return apiGet<ReportStats>('/api/v1/reports/stats')
}
