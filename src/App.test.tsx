import { cleanup, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'

afterEach(cleanup)

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('MeuBairro routes', () => {
  it('renders the Entrega 1 login at the public entry point', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { name: 'Um bairro melhor começa com a sua participação.' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Acesse sua conta' })).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
  })

  it('renders the resident dashboard from Entrega 1', () => {
    renderAt('/painel')
    expect(screen.getByRole('heading', { name: 'Acompanhe seu bairro' })).toBeInTheDocument()
    const residentNav = screen.getByRole('navigation', { name: 'Menu do morador' })
    expect(within(residentNav).getByRole('link', { name: 'Minhas denúncias' })).toBeInTheDocument()
    expect(screen.getByText('Denúncias recentes')).toBeInTheDocument()
    expect(screen.getByText('Notícias do bairro')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Notificações' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Nova denúncia/ })).toHaveAttribute('href', '/denuncias/nova')
  })

  it('renders the Entrega 1 new report form', () => {
    renderAt('/denuncias/nova')
    expect(screen.getByRole('heading', { name: 'Informe o problema encontrado' })).toBeInTheDocument()
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

  it('keeps every resident navigation destination inside the authenticated shell', () => {
    renderAt('/denuncias')
    expect(screen.getByRole('heading', { name: 'Minhas denúncias' })).toBeInTheDocument()
    cleanup()
    renderAt('/noticias')
    expect(screen.getByRole('heading', { name: 'Notícias do bairro' })).toBeInTheDocument()
  })

  it('renders the Entrega 1 reports map and its filters', () => {
    renderAt('/mapa')
    expect(screen.getByRole('heading', { name: 'Ocorrências no bairro' })).toBeInTheDocument()
    expect(screen.getByLabelText('Buscar por rua ou ocorrência')).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Status' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Categoria' })).toBeInTheDocument()
    expect(screen.getByLabelText('Mapa de denúncias')).toBeInTheDocument()
  })
})
