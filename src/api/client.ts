import type {
  AuthResponse,
  CreateReportInput,
  Report,
  ReportFilters,
  User,
} from './types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api/v1'
export const TOKEN_STORAGE_KEY = 'meubairro_token'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function authHeaders(): HeadersInit {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Accept', 'application/json')
  if (init.body) headers.set('Content-Type', 'application/json')
  Object.entries(authHeaders()).forEach(([key, value]) => headers.set(key, value))

  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers })
  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    const message = payload?.error ?? payload?.detail ?? 'Não foi possível concluir a operação.'
    throw new ApiError(message, response.status)
  }
  return payload as T
}

export const authApi = {
  login(email: string, password: string) {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },
  register(payload: {
    name: string
    email: string
    password: string
    neighborhood?: string
  }) {
    return request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  me() {
    return request<User>('/auth/me')
  },
}

function queryString(filters: ReportFilters = {}) {
  const params = new URLSearchParams()
  if (filters.category) params.set('category', filters.category)
  if (filters.status) params.set('status', filters.status)
  if (filters.query) params.set('query', filters.query)
  const query = params.toString()
  return query ? `?${query}` : ''
}

export const reportsApi = {
  listMine(filters?: ReportFilters) {
    return request<Report[]>(`/reports/mine${queryString(filters)}`)
  },
  list(filters?: ReportFilters) {
    return request<Report[]>(`/reports${queryString(filters)}`)
  },
  create(payload: CreateReportInput) {
    return request<Report>('/reports', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
}
