import { afterEach, describe, expect, it, vi } from 'vitest'
import { authApi, reportsApi } from './client'

const tokenResponse = {
  access_token: 'token-123',
  token_type: 'bearer',
  user: {
    id: 1,
    name: 'Ana Moradora',
    email: 'ana@example.com',
    role: 'MORADOR',
    neighborhood: 'Centro',
    organization: null,
    created_at: '2026-09-26T20:00:00Z',
  },
}

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
})

describe('API client', () => {
  it('logs in against the versioned API and returns the token', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => tokenResponse,
    }))

    const response = await authApi.login('ana@example.com', 'senha-segura-123')

    expect(response.access_token).toBe('token-123')
    expect(fetch).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/api/v1/auth/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email: 'ana@example.com',
          password: 'senha-segura-123',
        }),
      }),
    )
  })

  it('sends the persisted token when listing the resident reports', async () => {
    localStorage.setItem('meubairro_token', 'token-123')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [],
    }))

    await reportsApi.listMine()

    const [, requestInit] = vi.mocked(fetch).mock.calls[0]
    expect(new Headers(requestInit?.headers).get('Authorization')).toBe('Bearer token-123')
  })
})
