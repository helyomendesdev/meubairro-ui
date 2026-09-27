import type { ReportCategory, ReportStatus } from './types'

export const CATEGORY_LABELS: Record<ReportCategory, string> = {
  LIXO: 'Lixo e resíduos',
  ILUMINACAO: 'Iluminação',
  VIAS: 'Vias',
  SANEAMENTO: 'Saneamento',
  TERRENOS: 'Terrenos',
  OUTROS: 'Outros',
}

export const STATUS_LABELS: Record<ReportStatus, string> = {
  ABERTA: 'Aberta',
  EM_ANALISE: 'Em análise',
  RESOLVIDA: 'Resolvida',
}

export function categoryLabel(category: ReportCategory) {
  return CATEGORY_LABELS[category]
}

export function statusLabel(status: ReportStatus) {
  return STATUS_LABELS[status]
}

export function statusClass(status: ReportStatus) {
  if (status === 'ABERTA') return 'status open'
  if (status === 'RESOLVIDA') return 'status resolved'
  return 'status analysis'
}

export function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}
