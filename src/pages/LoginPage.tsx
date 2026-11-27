import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ApiError } from '../api/client'
import { useAuth } from '../auth/useAuth'
import { Logo } from '../components/Logo'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, status } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (status === 'authenticated') {
    return <Navigate replace to="/painel" />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) {
      return
    }
    setError(null)
    setPending(true)
    try {
      await login(email.trim(), password)
      navigate('/painel')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível entrar. Tente novamente.')
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-hero">
        <Logo inverse />

        <div className="login-hero-copy">
          <p className="eyebrow eyebrow--light">Plataforma comunitária</p>
          <h1>Um bairro melhor começa com a sua participação.</h1>
          <p>
            Registre problemas urbanos, acompanhe o andamento das ocorrências e fique por dentro das notícias da sua comunidade.
          </p>
          <ul className="hero-points">
            <li>Denúncias acompanháveis</li>
            <li>Informações centralizadas</li>
            <li>Comunidade ativa</li>
          </ul>
        </div>

        <small>MeuBairro · Projeto Integrador II</small>
      </section>

      <section className="login-form-wrap">
        <form className="login-form" onSubmit={handleSubmit}>
          <p className="eyebrow">Bem-vindo</p>
          <h2>Acesse sua conta</h2>
          <p className="lead">Entre para acompanhar o que acontece no seu bairro.</p>

          <label className="field">
            <span>E-mail</span>
            <input
              autoComplete="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="morador@meubairro.com.br"
              required
              type="email"
              value={email}
            />
          </label>

          <label className="field">
            <span>Senha</span>
            <input
              autoComplete="current-password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha de acesso"
              required
              type="password"
              value={password}
            />
          </label>

          <div className="password-row">
            <Link to="/recuperar-senha">Esqueci minha senha</Link>
          </div>

          <button className="primary-button" disabled={pending} type="submit">
            {pending ? 'Entrando...' : 'Entrar'}
          </button>

          {error && <p className="form-error" role="alert">{error}</p>}

          <div className="divider"><span>ou</span></div>
          <p className="login-foot">Ainda não possui conta? <Link to="/cadastro">Cadastre-se</Link></p>
        </form>
      </section>
    </main>
  )
}
