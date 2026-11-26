export type UserRole = 'MORADOR' | 'ADMIN' | 'ORGAO'

export interface UserRead {
  id: number
  name: string
  email: string
  role: UserRole
  neighborhood: string | null
  organization: string | null
  created_at: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
  user: UserRead
}

export interface ApiSession {
  token: string
  user: UserRead
}
