import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { AuthProvider } from './auth/AuthContext'
import { TOKEN_STORAGE_KEY } from './api/client'

const user = {
  id: 1,
  name: 'Ana Moradora',
  email: 'ana@example.com',
  role: 'MORADOR',
  neighborhood: 'Centro',
  organization: null,
  created_at: '2026-09-26T20:00:00Z',
}

const report = {
  id: 10,
  user_id: 1,
  title: 'Buraco na rua principal',
  description: 'Buraco grande próximo à praça.',
  category: 'VIAS',
  status: 'ABERTA',
  recorded_at: '2026-09-26T12:00:00Z',
  location: 'Centro, Rua Principal',
  latitude: null,
  longitude: null,
  image_url: null,
  created_at: '2026-09-26T12:00:00Z',
  updated_at: '2026-09-26T12:00:00Z',
  updated_by: null,
}

function ok(payload: unknown) {
  return { ok: true, status: 200, json: async () => payload }
}

function renderAuthenticated(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>,
  )
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  localStorage.clear()
})

describe('UI and API integration', () => {
  it('hydrates a persisted session and loads the resident dashboard', async () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, 'token-123')
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(ok(user))
      .mockResolvedValueOnce(ok([report]))
    vi.stubGlobal('fetch', fetchMock)

    renderAuthenticated('/painel')

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Acompanhe seu bairro' })).toBeInTheDocument())
    expect(fetchMock).toHaveBeenCalledTimes(2)
    const [, requestInit] = fetchMock.mock.calls[0]
    expect(new Headers(requestInit?.headers).get('Authorization')).toBe('Bearer token-123')
    await waitFor(() => expect(screen.getByText('Buraco na rua principal')).toBeInTheDocument())
  })

  it('submits a new report to the API and returns to the report list', async () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, 'token-123')
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(ok(user))
      .mockResolvedValueOnce(ok(report))
      .mockResolvedValueOnce(ok([]))
    vi.stubGlobal('fetch', fetchMock)

    renderAuthenticated('/denuncias/nova')
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Informe o problema encontrado' })).toBeInTheDocument())

    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Buraco na rua principal' } })
    fireEvent.change(screen.getByLabelText('Descrição'), { target: { value: 'Buraco grande próximo à praça.' } })
    fireEvent.change(screen.getByLabelText('Bairro'), { target: { value: 'Centro' } })
    fireEvent.change(screen.getByLabelText('Endereço aproximado'), { target: { value: 'Rua Principal' } })
    fireEvent.click(screen.getByRole('button', { name: 'Registrar denúncia' }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3))
    expect(fetchMock.mock.calls[1][0]).toBe('http://127.0.0.1:8000/api/v1/reports')
    const createInit = fetchMock.mock.calls[1][1]
    expect(JSON.parse(String(createInit?.body))).toMatchObject({
      title: 'Buraco na rua principal',
      description: 'Buraco grande próximo à praça.',
      category: 'LIXO',
      location: 'Centro, Rua Principal',
    })
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Minhas denúncias' })).toBeInTheDocument())
  })

  it('translates map filters into API query parameters', async () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, 'token-123')
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(ok(user))
      .mockResolvedValueOnce(ok([report]))
      .mockResolvedValueOnce(ok([]))
    vi.stubGlobal('fetch', fetchMock)

    renderAuthenticated('/mapa')
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
    fireEvent.click(screen.getByRole('radio', { name: 'Em análise' }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3))
    expect(fetchMock.mock.calls[2][0]).toBe('http://127.0.0.1:8000/api/v1/reports?status=EM_ANALISE')
  })
})
