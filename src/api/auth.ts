import { apiGet, apiPost } from './client'
import type { ApiSession, TokenResponse, UserRead } from './types'

export async function loginRequest(email: string, password: string): Promise<ApiSession> {
  const data = await apiPost<TokenResponse>('/api/v1/auth/login', { email, password })
  return { token: data.access_token, user: data.user }
}

export function fetchCurrentUser(token: string): Promise<UserRead> {
  return apiGet<UserRead>('/api/v1/auth/me', { token })
}
