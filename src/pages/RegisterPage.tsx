import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { Logo } from '../components/Logo'

export function RegisterPage() {
  const navigate = useNavigate()
  const { error, isLoading, register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      await register({ name, email, neighborhood, password })
      navigate('/painel')
    } catch {
      // AuthContext exposes the API error in the form.
    }
  }

  return (
    <main className="login-page">
      <section className="login-hero">
        <Logo inverse />
        <div className="login-hero-copy">
          <p className="eyebrow eyebrow--light">Participe da comunidade</p>
          <h1>Registre ocorrências e acompanhe as soluções.</h1>
          <p>Crie sua conta para registrar problemas urbanos e acompanhar cada atualização do seu bairro.</p>
        </div>
        <small>MeuBairro · Projeto Integrador II</small>
      </section>

      <section className="login-form-wrap">
        <form className="login-form" onSubmit={handleSubmit}>
          <p className="eyebrow">Primeiro acesso</p>
          <h2>Crie sua conta</h2>
          <p className="lead">Use seus dados para começar a participar.</p>

          <label className="field" htmlFor="register-name"><span>Nome</span><input autoComplete="name" id="register-name" onChange={(event) => setName(event.target.value)} required value={name} /></label>
          <label className="field" htmlFor="register-email"><span>E-mail</span><input autoComplete="email" id="register-email" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} /></label>
          <label className="field" htmlFor="register-neighborhood"><span>Bairro</span><input id="register-neighborhood" onChange={(event) => setNeighborhood(event.target.value)} value={neighborhood} /></label>
          <label className="field" htmlFor="register-password"><span>Senha</span><input autoComplete="new-password" id="register-password" minLength={8} onChange={(event) => setPassword(event.target.value)} required type="password" value={password} /></label>

          {error && <p aria-live="polite" className="form-error" role="alert">{error}</p>}
          <button className="primary-button" disabled={isLoading} type="submit">{isLoading ? 'Cadastrando...' : 'Cadastrar'}</button>
          <div className="divider"><span>ou</span></div>
          <p className="login-foot">Já possui conta? <Link to="/">Entrar</Link></p>
        </form>
      </section>
    </main>
  )
}