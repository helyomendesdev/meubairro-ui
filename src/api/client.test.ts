import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, apiGet, apiPost, apiUrl, getApiBaseUrl } from './client'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('getApiBaseUrl', () => {
  it('usa VITE_API_URL quando definido, sem barra final', () => {
    vi.stubEnv('VITE_API_URL', 'https://api.meubairro.example/')
    expect(getApiBaseUrl()).toBe('https://api.meubairro.example')
  })

  it('cai no endereço local sem a variável', () => {
    expect(getApiBaseUrl()).toBe('http://localhost:8000')
  })
})

describe('apiUrl', () => {
  it('aceita path dentro de /api', () => {
    expect(apiUrl('/api/v1/health')).toBe('http://localhost:8000/api/v1/health')
  })

  it('recusa path fora de /api', () => {
    expect(() => apiUrl('/outra/rota')).toThrow()
  })
})

describe('request', () => {
  it('faz GET e retorna o corpo parseado', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: true }))
    vi.stubGlobal('fetch', fetchMock)
    await expect(apiGet('/api/v1/health')).resolves.toEqual({ ok: true })
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('http://localhost:8000/api/v1/health')
    expect(init.method).toBe('GET')
    expect(init.headers.Accept).toBe('application/json')
  })

  it('mapeia erro HTTP com detail do FastAPI', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ detail: 'Credenciais inválidas' }, 401)))
    const error = await apiGet('/api/v1/auth/me').catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).status).toBe(401)
    expect((error as ApiError).message).toBe('Credenciais inválidas')
  })

  it('lança ApiError 0 em falha de rede', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('network error')))
    const error = await apiGet('/api/v1/health').catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).status).toBe(0)
  })

  it('POST envia JSON, Content-Type e Authorization', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ id: 1 }, 201))
    vi.stubGlobal('fetch', fetchMock)
    await apiPost('/api/v1/reports', { title: 'Buraco na rua' }, { token: 'jwt-123' })
    const [, init] = fetchMock.mock.calls[0]
    expect(init.method).toBe('POST')
    expect(init.headers['Content-Type']).toBe('application/json')
    expect(init.headers.Authorization).toBe('Bearer jwt-123')
    expect(init.body).toBe(JSON.stringify({ title: 'Buraco na rua' }))
  })
})
