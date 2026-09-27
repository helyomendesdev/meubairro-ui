import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { reportsApi } from '../api/client'
import { categoryLabel } from '../api/presenters'
import type { ReportCategory } from '../api/types'
import { useAuth } from '../auth/useAuth'
import { AppShell } from '../components/AppShell'

const categories: ReportCategory[] = ['LIXO', 'ILUMINACAO', 'VIAS', 'SANEAMENTO', 'TERRENOS', 'OUTROS']

type ReportForm = {
  title: string
  category: ReportCategory
  recordedAt: string
  description: string
  neighborhood: string
  address: string
  coordinates: string
}

const initialForm: ReportForm = {
  title: '',
  category: 'LIXO',
  recordedAt: '',
  description: '',
  neighborhood: '',
  address: '',
  coordinates: '',
}

export function NewReportPage() {
  const navigate = useNavigate()
  const { isDemo, user } = useAuth()
  const [form, setForm] = useState<ReportForm>(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  function updateField<K extends keyof ReportForm>(field: K, value: ReportForm[K]) {
    setForm((current) => ({ ...current, [field]: value }))
    setError(null)
    setSuccess(null)
  }

  function handleTextChange(field: Exclude<keyof ReportForm, 'category'>) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateField(field, event.target.value)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    const location = [form.neighborhood, form.address].filter(Boolean).join(', ')
    const coordinates = form.coordinates.split(',').map((value) => Number(value.trim()))
    const hasCoordinates = coordinates.length === 2 && coordinates.every((value) => Number.isFinite(value))

    if (location.length < 3) {
      setError('Informe o bairro e o endereço aproximado da ocorrência.')
      return
    }
    if (form.coordinates && !hasCoordinates) {
      setError('Use coordenadas no formato latitude, longitude.')
      return
    }

    setIsSubmitting(true)
    try {
      if (isDemo) {
        setSuccess('Demonstração concluída. Ao entrar na API, a denúncia será persistida no banco.')
        return
      }

      await reportsApi.create({
        title: form.title,
        description: form.description,
        category: form.category,
        location,
        ...(form.recordedAt ? { recorded_at: new Date(`${form.recordedAt}T12:00:00`).toISOString() } : {}),
        ...(hasCoordinates ? { latitude: coordinates[0], longitude: coordinates[1] } : {}),
      })
      navigate('/denuncias')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível registrar a denúncia.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppShell pageTitle="Nova denúncia">
      <main className="content">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Registro de ocorrência</p>
            <h1>Informe o problema encontrado</h1>
            <p className="lead">Forneça os dados essenciais para facilitar a identificação e o atendimento.</p>
          </div>
        </div>

        <form className="report-layout" onSubmit={handleSubmit}>
          <section className="form-card">
            <h2>Dados da denúncia</h2>
            <div className="form-grid">
              <label className="field field--full" htmlFor="report-title"><span>Título</span><input id="report-title" minLength={3} onChange={handleTextChange('title')} required value={form.title} /></label>
              <label className="field" htmlFor="report-category"><span>Categoria</span><select id="report-category" onChange={(event) => updateField('category', event.target.value as ReportCategory)} value={form.category}>{categories.map((category) => <option key={category} value={category}>{categoryLabel(category)}</option>)}</select></label>
              <label className="field" htmlFor="report-date"><span>Data da ocorrência</span><input id="report-date" onChange={handleTextChange('recordedAt')} type="date" value={form.recordedAt} /></label>
              <label className="field field--full" htmlFor="report-description"><span>Descrição</span><textarea id="report-description" aria-label="Descrição" minLength={5} onChange={handleTextChange('description')} required value={form.description} /><small>Descreva pontos de referência e detalhes que ajudem na localização.</small></label>
              <label className="field" htmlFor="report-neighborhood"><span>Bairro</span><input id="report-neighborhood" onChange={handleTextChange('neighborhood')} required value={form.neighborhood} /></label>
              <label className="field" htmlFor="report-address"><span>Endereço aproximado</span><input id="report-address" onChange={handleTextChange('address')} required value={form.address} /></label>
              <label className="field field--full" htmlFor="report-image"><span>Imagem da ocorrência</span><span className="upload-box">Arraste uma imagem ou clique para selecionar<strong>Anexar foto</strong><small>PNG ou JPG, até 5 MB</small></span><input className="sr-only" id="report-image" type="file" /></label>
            </div>
          </section>

          <aside className="location-card">
            <h2>Localização aproximada</h2>
            <div aria-label="Mapa aproximado" className="map-preview"><span className="map-pin" /></div>
            <label className="field" htmlFor="report-coordinates"><span>Coordenadas</span><input id="report-coordinates" onChange={handleTextChange('coordinates')} placeholder="-5.0892, -42.8019" value={form.coordinates} /></label>
            <p>A localização exibida é aproximada e não será usada para divulgar dados pessoais do morador.</p>
            {user?.neighborhood && <p className="location-hint">Bairro da conta: {user.neighborhood}</p>}
            {error && <p aria-live="polite" className="form-error" role="alert">{error}</p>}
            {success && <p aria-live="polite" className="form-success" role="status">{success}</p>}
            <button className="primary-button" disabled={isSubmitting} type="submit">{isSubmitting ? 'Registrando...' : 'Registrar denúncia'}</button>
            <button className="secondary-button" onClick={() => setSuccess('Rascunho salvo apenas nesta tela.')} type="button">Salvar rascunho</button>
            <button className="secondary-button" onClick={() => navigate('/painel')} type="button">Cancelar</button>
          </aside>
        </form>
      </main>
    </AppShell>
  )
}