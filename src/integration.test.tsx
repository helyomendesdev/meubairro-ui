import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { saveSession } from './api/session'
import type { UserRead } from './api/types'
import type { ReportRead } from './api/reports'

const user: UserRead = {
  id: 1,
  name: 'João da Silva',
  email: 'morador@meubairro.com.br',
  role: 'MORADOR',
  neighborhood: 'Centro',
  organization: null,
  created_at: '2026-09-20T12:00:00Z',
}

const baseReport: ReportRead = {
  id: 1,
  user_id: 1,
  title: 'Lixo acumulado na rua',
  description: 'Há acúmulo de lixo próximo à esquina.',
  category: 'LIXO',
  status: 'ABERTA',
  recorded_at: '2026-11-20T12:00:00Z',
  location: 'Centro — Rua Principal',
  latitude: -5.0892,
  longitude: -42.8019,
  image_url: null,
  created_at: '2026-11-20T12:00:00Z',
  updated_at: '2026-11-20T12:00:00Z',
  updated_by: null,
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

type FetchCall = { url: string; method: string; body: unknown }

function stubApi(handler: (url: string, init: RequestInit) => Response | undefined) {
  const calls: FetchCall[] = []
  const fetchMock = vi.fn(async (input: string | URL | Request, init: RequestInit = {}) => {
    const url = String(input)
    calls.push({
      url,
      method: init.method ?? 'GET',
      body: init.body ? JSON.parse(String(init.body)) : null,
    })
    const response = handler(url, init)
    if (response) return response
    throw new TypeError(`fetch não tratado: ${url}`)
  })
  vi.stubGlobal('fetch', fetchMock)
  return { calls, fetchMock }
}

function stubAuthed(handler?: (url: string, init: RequestInit) => Response | undefined) {
  saveSession('jwt-test')
  return stubApi((url, init) => {
    if (url.includes('/api/v1/auth/me')) return jsonResponse(user)
    return handler?.(url, init)
  })
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

describe('MeuBairro integration with the API (Entrega 4)', () => {
  it('loads the resident dashboard from /reports/mine', async () => {
    stubAuthed((url) => {
      const mine = [
        baseReport,
        { ...baseReport, id: 2, title: 'Vazamento de água', category: 'SANEAMENTO', status: 'RESOLVIDA' },
      ]
      return url.includes('/api/v1/reports/mine') ? jsonResponse(mine) : undefined
    })
    renderAt('/painel')
    await waitFor(() => {
      expect(screen.getByText('Lixo acumulado na rua')).toBeInTheDocument()
    })
    expect(screen.getByText('Vazamento de água')).toBeInTheDocument()
    const resumo = screen.getByRole('region', { name: 'Resumo' })
    expect(resumo).toHaveTextContent('Minhas denúncias')
    expect(resumo).toHaveTextContent('2')
    expect(screen.getByText('Aberta')).toBeInTheDocument()
    expect(screen.getByText('Resolvida')).toBeInTheDocument()
  })

  it('shows an error banner on the dashboard and recovers on retry', async () => {
    let failing = true
    stubAuthed((url) =>
      url.includes('/api/v1/reports/mine')
        ? failing
          ? jsonResponse({ detail: 'Banco indisponível' }, 500)
          : jsonResponse([baseReport])
        : undefined,
    )
    renderAt('/painel')
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Banco indisponível')
    })
    failing = false
    await userEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    await waitFor(() => {
      expect(screen.getByText('Lixo acumulado na rua')).toBeInTheDocument()
    })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('registers a new report through the form and redirects to the dashboard', async () => {
    const { calls } = stubAuthed((url, init) => {
      if (url.includes('/api/v1/reports/mine')) return jsonResponse([])
      if (url.includes('/api/v1/reports') && init.method === 'POST') {
        return jsonResponse({ ...baseReport, title: 'Buraco na rua' }, 201)
      }
      return undefined
    })
    renderAt('/denuncias/nova')
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Informe o problema encontrado' })).toBeInTheDocument()
    })
    await userEvent.type(screen.getByLabelText('Título'), 'Buraco na rua')
    await userEvent.selectOptions(screen.getByLabelText('Categoria'), 'VIAS')
    await userEvent.type(screen.getByLabelText('Descrição'), 'Buraco grande atrapalha o trânsito.')
    await userEvent.clear(screen.getByLabelText('Bairro'))
    await userEvent.type(screen.getByLabelText('Bairro'), 'Parque Piauí')
    await userEvent.type(screen.getByLabelText('Endereço aproximado'), 'Rua das Palmeiras')
    await userEvent.type(screen.getByLabelText('Coordenadas (opcional)'), '-5.1, -42.8')
    await userEvent.click(screen.getByRole('button', { name: 'Registrar denúncia' }))
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Acompanhe seu bairro' })).toBeInTheDocument()
    })
    const createCall = calls.find((call) => call.url.includes('/api/v1/reports') && call.method === 'POST')
    expect(createCall).toBeDefined()
    expect(createCall?.body).toMatchObject({
      title: 'Buraco na rua',
      category: 'VIAS',
      description: 'Buraco grande atrapalha o trânsito.',
      location: 'Parque Piauí — Rua das Palmeiras',
      latitude: -5.1,
      longitude: -42.8,
      image_url: null,
    })
  })

  it('shows the API error on the new report form without leaving the page', async () => {
    stubAuthed((url) => {
      if (url.includes('/api/v1/reports/mine')) return jsonResponse([])
      if (url.includes('/api/v1/reports')) return jsonResponse({ detail: 'Categoria inválida' }, 400)
      return undefined
    })
    renderAt('/denuncias/nova')
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Informe o problema encontrado' })).toBeInTheDocument()
    })
    await userEvent.type(screen.getByLabelText('Título'), 'Buraco na rua')
    await userEvent.type(screen.getByLabelText('Descrição'), 'Buraco grande atrapalha o trânsito.')
    await userEvent.type(screen.getByLabelText('Bairro'), 'Parque Piauí')
    await userEvent.type(screen.getByLabelText('Endereço aproximado'), 'Rua das Palmeiras')
    await userEvent.click(screen.getByRole('button', { name: 'Registrar denúncia' }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Categoria inválida')
    })
    expect(screen.getByRole('heading', { name: 'Informe o problema encontrado' })).toBeInTheDocument()
  })

  it('loads the reports map from the public endpoint and applies filters', async () => {
    const { calls } = stubAuthed((url) => {
      if (url.includes('/api/v1/reports/mine')) return jsonResponse([])
      if (url.includes('/api/v1/reports/stats')) {
        return jsonResponse({
          total: 3,
          by_status: [
            { status: 'ABERTA', count: 1 },
            { status: 'EM_ANALISE', count: 1 },
            { status: 'RESOLVIDA', count: 1 },
          ],
          by_category: [
            { category: 'LIXO', count: 1 },
            { category: 'ILUMINACAO', count: 1 },
            { category: 'TERRENOS', count: 1 },
          ],
        })
      }
      if (url.includes('/api/v1/reports')) {
        return jsonResponse([
          baseReport,
          { ...baseReport, id: 2, title: 'Lâmpada queimada', category: 'ILUMINACAO', status: 'RESOLVIDA' },
          { ...baseReport, id: 3, title: 'Lixo no terreno', category: 'TERRENOS', status: 'EM_ANALISE', latitude: null, longitude: null },
        ])
      }
      return undefined
    })
    renderAt('/mapa')
    await waitFor(() => {
      expect(screen.getByText('Lixo acumulado na rua')).toBeInTheDocument()
    })
    expect(screen.getByText('3 registros encontrados')).toBeInTheDocument()
    expect(screen.getByText('Lâmpada queimada')).toBeInTheDocument()
    expect(screen.getByText('Lixo no terreno')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('checkbox', { name: /Abertas/ }))
    await waitFor(() => {
      expect(screen.getByText('2 registros encontrados')).toBeInTheDocument()
    })
    expect(screen.queryByText('Lixo acumulado na rua')).not.toBeInTheDocument()

    // isolando um único status, o filtro vai para a API (?status=)
    await userEvent.click(screen.getByRole('checkbox', { name: /Em análise/ }))
    await waitFor(() => {
      expect(
        calls.some((call) => call.url.includes('/api/v1/reports?status=RESOLVIDA')),
      ).toBe(true)
    })
    expect(screen.getByText('Lâmpada queimada')).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText('Buscar por rua ou ocorrência'), 'lâmpada')
    await waitFor(() => {
      expect(screen.getByText('1 registro encontrado')).toBeInTheDocument()
    })
    expect(screen.getByText('Lâmpada queimada')).toBeInTheDocument()
  })

  it('shows an error banner on the map when the public endpoint fails', async () => {
    stubAuthed((url) => {
      if (url.includes('/api/v1/reports/mine')) return jsonResponse([])
      if (url.includes('/api/v1/reports')) return jsonResponse({ detail: 'Erro HTTP 500' }, 500)
      return undefined
    })
    renderAt('/mapa')
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Erro HTTP 500')
    })
  })
})
