import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchCurrentUser, loginRequest } from './auth'
import { ApiError } from './client'
import type { UserRead } from './types'

const user: UserRead = {
  id: 1,
  name: 'João da Silva',
  email: 'morador@meubairro.com.br',
  role: 'MORADOR',
  neighborhood: 'Centro',
  organization: null,
  created_at: '2026-09-20T12:00:00Z',
}

afterEach(() => {
  vi.unstubAllGlobals()
})

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('loginRequest', () => {
  it('faz POST em /api/v1/auth/login e devolve a sessão', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({
      access_token: 'jwt-abc',
      token_type: 'bearer',
      user,
    }))
    vi.stubGlobal('fetch', fetchMock)
    const session = await loginRequest('morador@meubairro.com.br', 'senha-forte-1')
    expect(session.token).toBe('jwt-abc')
    expect(session.user.name).toBe('João da Silva')
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('http://localhost:8000/api/v1/auth/login')
    expect(init.method).toBe('POST')
    expect(init.body).toBe(JSON.stringify({ email: 'morador@meubairro.com.br', password: 'senha-forte-1' }))
  })

  it('propaga ApiError com detail da API em credenciais inválidas', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ detail: 'Credenciais inválidas' }, 401)))
    const error = await loginRequest('morador@meubairro.com.br', 'errada').catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).status).toBe(401)
    expect((error as ApiError).message).toBe('Credenciais inválidas')
  })
})

describe('fetchCurrentUser', () => {
  it('faz GET em /api/v1/auth/me com o token', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(user))
    vi.stubGlobal('fetch', fetchMock)
    const me = await fetchCurrentUser('jwt-abc')
    expect(me.email).toBe('morador@meubairro.com.br')
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('http://localhost:8000/api/v1/auth/me')
    expect(init.headers.Authorization).toBe('Bearer jwt-abc')
  })
})
