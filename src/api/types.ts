export type UserRole = 'MORADOR' | 'ADMIN' | 'ORGAO'
export type ReportStatus = 'ABERTA' | 'EM_ANALISE' | 'RESOLVIDA'
export type ReportCategory =
  | 'LIXO'
  | 'ILUMINACAO'
  | 'VIAS'
  | 'SANEAMENTO'
  | 'TERRENOS'
  | 'OUTROS'

export type User = {
  id: number
  name: string
  email: string
  role: UserRole
  neighborhood: string | null
  organization: string | null
  created_at: string
}

export type AuthResponse = {
  access_token: string
  token_type: string
  user: User
}

export type Report = {
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

export type CreateReportInput = {
  title: string
  description: string
  category: ReportCategory
  recorded_at?: string
  location: string
  latitude?: number
  longitude?: number
  image_url?: string
}

export type ReportFilters = {
  category?: ReportCategory
  status?: ReportStatus
  query?: string
}
