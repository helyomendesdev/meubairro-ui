import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { saveSession } from './api/session'
import type { UserRead } from './api/types'

const user: UserRead = {
  id: 1,
  name: 'João da Silva',
  email: 'morador@meubairro.com.br',
  role: 'MORADOR',
  neighborhood: 'Centro',
  organization: null,
  created_at: '2026-09-20T12:00:00Z',
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function stubApi(handler: (url: string) => Response | undefined) {
  vi.stubGlobal('fetch', vi.fn(async (url: string | URL | Request) => {
    const response = handler(String(url))
    if (response) return response
    throw new TypeError(`fetch não tratado: ${String(url)}`)
  }))
}

function stubAuthenticatedApi() {
  stubApi((url) => (url.includes('/api/v1/auth/me') ? jsonResponse(user) : undefined))
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  localStorage.clear()
})

describe('MeuBairro routes', () => {
  it('renders the Entrega 1 login at the public entry point', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { name: 'Um bairro melhor começa com a sua participação.' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Acesse sua conta' })).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
  })

  it('redirects an unauthenticated visit from /painel to the login', async () => {
    renderAt('/painel')
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Acesse sua conta' })).toBeInTheDocument()
    })
  })

  it('renders the resident dashboard from Entrega 1', async () => {
    saveSession({ token: 'jwt-test', user })
    stubAuthenticatedApi()
    renderAt('/painel')
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Acompanhe seu bairro' })).toBeInTheDocument()
    })
    const residentNav = screen.getByRole('navigation', { name: 'Menu do morador' })
    expect(within(residentNav).getByRole('link', { name: 'Minhas denúncias' })).toBeInTheDocument()
    expect(screen.getByText('Denúncias recentes')).toBeInTheDocument()
    expect(screen.getByText('Notícias do bairro')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Notificações' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sair' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Nova denúncia/ })).toHaveAttribute('href', '/denuncias/nova')
    expect(screen.getByText('João da Silva')).toBeInTheDocument()
  })

  it('returns to the public login when the resident signs out', async () => {
    saveSession({ token: 'jwt-test', user })
    stubAuthenticatedApi()
    renderAt('/painel')
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Sair' })).toBeInTheDocument()
    })
    fireEvent.click(screen.getByRole('button', { name: 'Sair' }))
    expect(screen.getByRole('heading', { name: 'Acesse sua conta' })).toBeInTheDocument()
  })

  it('renders the Entrega 1 new report form', async () => {
    saveSession({ token: 'jwt-test', user })
    stubAuthenticatedApi()
    renderAt('/denuncias/nova')
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Informe o problema encontrado' })).toBeInTheDocument()
    })
    expect(screen.getByLabelText('Título')).toBeInTheDocument()
    expect(screen.getByLabelText('Categoria')).toBeInTheDocument()
    expect(screen.getByLabelText('Descrição')).toBeInTheDocument()
    expect(screen.getByLabelText('Bairro')).toBeInTheDocument()
    expect(screen.getByText('Localização aproximada')).toBeInTheDocument()
    const reportNav = screen.getByRole('navigation', { name: 'Menu do morador' })
    expect(within(reportNav).getByRole('link', { name: 'Nova denúncia', current: 'page' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Registrar denúncia' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Salvar rascunho' })).toBeInTheDocument()
  })

  it('keeps every resident navigation destination inside the authenticated shell', async () => {
    saveSession({ token: 'jwt-test', user })
    stubAuthenticatedApi()
    renderAt('/denuncias')
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Minhas denúncias' })).toBeInTheDocument()
    })
    cleanup()
    renderAt('/noticias')
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Notícias do bairro' })).toBeInTheDocument()
    })
  })

  it('renders the Entrega 1 reports map and its filters', async () => {
    saveSession({ token: 'jwt-test', user })
    stubAuthenticatedApi()
    renderAt('/mapa')
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Ocorrências no bairro' })).toBeInTheDocument()
    })
    expect(screen.getByLabelText('Buscar por rua ou ocorrência')).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Status' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Categoria' })).toBeInTheDocument()
    expect(screen.getByLabelText('Mapa de denúncias')).toBeInTheDocument()
  })
})

describe('MeuBairro login flow', () => {
  it('logs in via the API and lands on the dashboard', async () => {
    stubApi((url) => {
      if (url.includes('/api/v1/auth/login')) {
        return jsonResponse({ access_token: 'jwt-novo', token_type: 'bearer', user })
      }
      return undefined
    })
    renderAt('/')
    await userEvent.type(screen.getByLabelText('E-mail'), 'morador@meubairro.com.br')
    await userEvent.type(screen.getByLabelText('Senha'), 'senha-forte-1')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Acompanhe seu bairro' })).toBeInTheDocument()
    })
    expect(JSON.parse(localStorage.getItem('meubairro.session') ?? 'null')).toMatchObject({
      token: 'jwt-novo',
      user: { email: 'morador@meubairro.com.br' },
    })
  })

  it('shows the API error message on invalid credentials', async () => {
    stubApi((url) => {
      if (url.includes('/api/v1/auth/login')) {
        return jsonResponse({ detail: 'Credenciais inválidas' }, 401)
      }
      return undefined
    })
    renderAt('/')
    await userEvent.type(screen.getByLabelText('E-mail'), 'morador@meubairro.com.br')
    await userEvent.type(screen.getByLabelText('Senha'), 'senha-errada')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Credenciais inválidas')
    })
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeEnabled()
    expect(screen.queryByRole('heading', { name: 'Acompanhe seu bairro' })).not.toBeInTheDocument()
  })
})
