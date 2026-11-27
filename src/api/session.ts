const SESSION_KEY = 'meubairro.session'

export function saveSession(token: string): void {
  localStorage.setItem(SESSION_KEY, token)
}

export function loadSession(): string | null {
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw || raw.trim() === '') {
    return null
  }
  return raw
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
}
