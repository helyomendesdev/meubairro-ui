const API_PREFIX = '/api'
const DEFAULT_API_URL = 'http://localhost:8000'
const DEFAULT_TIMEOUT_MS = 10_000

export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL
  if (typeof raw === 'string' && raw.trim() !== '') {
    return raw.trim().replace(/\/+$/, '')
  }
  return DEFAULT_API_URL
}

export function apiUrl(path: string): string {
  if (!path.startsWith(`${API_PREFIX}/`)) {
    throw new Error(`apiUrl: path deve começar com ${API_PREFIX}/: "${path}"`)
  }
  return `${getApiBaseUrl()}${path}`
}

export class ApiError extends Error {
  status: number
  detail: unknown

  constructor(status: number, message: string, detail?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
  }
}

export type ApiMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export interface ApiRequestOptions {
  method?: ApiMethod
  body?: unknown
  token?: string
  signal?: AbortSignal
  timeoutMs?: number
}

async function errorPayload(response: Response): Promise<unknown> {
  try {
    return await response.json()
  } catch {
    return undefined
  }
}

function messageFromPayload(payload: unknown, status: number): string {
  if (payload !== null && typeof payload === 'object') {
    const record = payload as { detail?: unknown; error?: unknown }
    if (typeof record.detail === 'string' && record.detail.trim() !== '') {
      return record.detail
    }
    if (typeof record.error === 'string' && record.error.trim() !== '') {
      return record.error
    }
  }
  return `Erro HTTP ${status}`
}

export async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token, signal, timeoutMs = DEFAULT_TIMEOUT_MS } = options
  const timeout = AbortSignal.timeout(timeoutMs)
  const abortSignal = signal ? AbortSignal.any([signal, timeout]) : timeout
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  let response: Response
  try {
    response = await fetch(apiUrl(path), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: abortSignal,
    })
  } catch (error) {
    throw new ApiError(0, 'A API não respondeu (falha de rede ou timeout).', error)
  }
  if (!response.ok) {
    const payload = await errorPayload(response)
    throw new ApiError(response.status, messageFromPayload(payload, response.status), payload)
  }
  if (response.status === 204) {
    return undefined as T
  }
  return (await response.json()) as T
}

export function apiGet<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  return request<T>(path, { ...options, method: 'GET' })
}

export function apiPost<T>(path: string, body: unknown, options: ApiRequestOptions = {}): Promise<T> {
  return request<T>(path, { ...options, method: 'POST', body })
}
