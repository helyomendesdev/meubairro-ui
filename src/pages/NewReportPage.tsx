import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { ErrorBanner } from '../components/AsyncState'
import { ApiError } from '../api/client'
import {
  createReport,
  REPORT_CATEGORY_LABELS,
  type ReportCategory,
} from '../api/reports'
import { useAuth } from '../auth/useAuth'

const CATEGORY_OPTIONS = Object.entries(REPORT_CATEGORY_LABELS) as [
  ReportCategory,
  string,
][]

export function NewReportPage() {
  const navigate = useNavigate()
  const { token, user } = useAuth()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<ReportCategory>('LIXO')
  const [recordedAt, setRecordedAt] = useState('')
  const [description, setDescription] = useState('')
  const [neighborhood, setNeighborhood] = useState(user?.neighborhood ?? '')
  const [address, setAddress] = useState('')
  const [coordinates, setCoordinates] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  interface ValidationFieldError {
    field: string
    message: string
  }

  function coordinatesError(pair: number[]): string | null {
    if (pair.length === 0) {
      return null
    }
    if (pair.length !== 2 || pair.some((value) => !Number.isFinite(value))) {
      return 'Informe latitude e longitude separadas por vírgula (ex.: -5.0892, -42.8019).'
    }
    const [latitude, longitude] = pair
    if (latitude < -90 || latitude > 90) {
      return 'A latitude deve estar entre -90 e 90.'
    }
    if (longitude < -180 || longitude > 180) {
      return 'A longitude deve estar entre -180 e 180.'
    }
    return null
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending || !token) {
      return
    }
    setError(null)
    setFieldErrors({})
    const coordinatePair = coordinates.trim()
      ? coordinates.trim().split(',').map((value) => Number(value.trim()))
      : []
    const coordinateValidation = coordinatesError(coordinatePair)
    if (coordinateValidation) {
      setFieldErrors({ coordinates: coordinateValidation })
      return
    }
    setPending(true)
    try {
      const hasCoordinates =
        coordinatePair.length === 2 && coordinatePair.every(Number.isFinite)
      await createReport(token, {
        title: title.trim(),
        description: description.trim(),
        category,
        recorded_at: recordedAt
          ? new Date(`${recordedAt}T12:00:00`).toISOString()
          : null,
        location: [neighborhood.trim(), address.trim()].filter(Boolean).join(' — '),
        latitude: hasCoordinates ? coordinatePair[0] : null,
        longitude: hasCoordinates ? coordinatePair[1] : null,
        image_url: null,
      })
      navigate('/painel')
    } catch (err) {
      if (err instanceof ApiError) {
        const fields = (err.detail as { fields?: ValidationFieldError[] } | undefined)?.fields
        if (Array.isArray(fields) && fields.length > 0) {
          const mapped: Record<string, string> = {}
          for (const item of fields) {
            const key = item.field === 'recorded_at' ? 'recordedAt' : item.field
            if (!mapped[key]) {
              mapped[key] = item.message
            }
          }
          setFieldErrors(mapped)
        }
        setError(err.message)
      } else {
        setError('Não foi possível registrar a denúncia. Tente novamente.')
      }
    } finally {
      setPending(false)
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
              <label className="field field--full"><span>Título</span><input required minLength={3} maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Resuma o problema em uma frase" />{fieldErrors.title ? <small role="alert">{fieldErrors.title}</small> : null}</label>
              <label className="field"><span>Categoria</span><select value={category} onChange={(event) => setCategory(event.target.value as ReportCategory)}>{CATEGORY_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
              <label className="field"><span>Data da ocorrência</span><input type="date" value={recordedAt} onChange={(event) => setRecordedAt(event.target.value)} /></label>
              <label className="field field--full"><span>Descrição</span><textarea aria-label="Descrição" required minLength={5} maxLength={5000} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Descreva pontos de referência e detalhes que ajudem na localização." />{fieldErrors.description ? <small role="alert">{fieldErrors.description}</small> : null}</label>
              <label className="field"><span>Bairro</span><input required value={neighborhood} onChange={(event) => setNeighborhood(event.target.value)} placeholder="Ex.: Parque Piauí" /></label>
              <label className="field"><span>Endereço aproximado</span><input required value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Rua, próximo à praça" /></label>
              <label className="field field--full"><span>Imagem da ocorrência</span><span className="upload-box">Arraste uma imagem ou clique para selecionar<strong>Anexar foto</strong><small>Funcionalidade disponível em breve</small></span><input className="sr-only" type="file" disabled /></label>
            </div>
          </section>

          <aside className="location-card">
            <h2>Localização aproximada</h2>
            <div aria-label="Mapa aproximado" className="map-preview"><span className="map-pin" /></div>
            <label className="field"><span>Coordenadas (opcional)</span><input value={coordinates} onChange={(event) => setCoordinates(event.target.value)} placeholder="-5.0892, -42.8019" />{fieldErrors.coordinates ? <small role="alert">{fieldErrors.coordinates}</small> : null}</label>
            <p>A localização exibida é aproximada e não será usada para divulgar dados pessoais do morador.</p>
            {error ? <ErrorBanner message={error} /> : null}
            <button className="primary-button" type="submit" disabled={pending}>{pending ? 'Registrando...' : 'Registrar denúncia'}</button>
            <button className="secondary-button" type="button">Salvar rascunho</button>
          </aside>
        </form>
      </main>
    </AppShell>
  )
}
