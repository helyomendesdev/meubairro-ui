import { afterEach, describe, expect, it } from 'vitest'
import { clearSession, loadSession, saveSession } from './session'

afterEach(() => {
  clearSession()
})

describe('session', () => {
  it('salva e recarrega o token', () => {
    saveSession('jwt-abc')
    expect(loadSession()).toBe('jwt-abc')
  })

  it('retorna null sem token salvo', () => {
    expect(loadSession()).toBeNull()
  })

  it('retorna null com valor em branco', () => {
    localStorage.setItem('meubairro.session', '   ')
    expect(loadSession()).toBeNull()
  })

  it('limpa a sessão', () => {
    saveSession('jwt-abc')
    clearSession()
    expect(loadSession()).toBeNull()
  })
})
