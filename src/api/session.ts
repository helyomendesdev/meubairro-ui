import type { ApiSession } from './types'

const SESSION_KEY = 'meubairro.session'

export function saveSession(session: ApiSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function loadSession(): ApiSession | null {
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) {
    return null
  }
  try {
    const parsed = JSON.parse(raw) as Partial<ApiSession> | null
    if (parsed && typeof parsed.token === 'string' && parsed.user && typeof parsed.user === 'object') {
      return parsed as ApiSession
    }
  } catch {
    // JSON inválido: trata como sessão inexistente
  }
  return null
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
}
