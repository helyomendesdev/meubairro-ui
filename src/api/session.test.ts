import { afterEach, describe, expect, it } from 'vitest'
import { clearSession, loadSession, saveSession } from './session'
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
  clearSession()
})

describe('session', () => {
  it('salva e recarrega a sessão', () => {
    saveSession({ token: 'jwt-abc', user })
    expect(loadSession()).toEqual({ token: 'jwt-abc', user })
  })

  it('retorna null sem sessão salva', () => {
    expect(loadSession()).toBeNull()
  })

  it('retorna null com JSON inválido', () => {
    localStorage.setItem('meubairro.session', '{não é json')
    expect(loadSession()).toBeNull()
  })

  it('retorna null com estrutura incompleta', () => {
    localStorage.setItem('meubairro.session', JSON.stringify({ token: 'jwt-abc' }))
    expect(loadSession()).toBeNull()
  })

  it('limpa a sessão', () => {
    saveSession({ token: 'jwt-abc', user })
    clearSession()
    expect(loadSession()).toBeNull()
  })
})
