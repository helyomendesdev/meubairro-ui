import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'

export function LoginPage() {
  const navigate = useNavigate()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate('/painel')
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
            <input defaultValue="morador@meubairro.com.br" name="email" type="email" />
          </label>

          <label className="field">
            <span>Senha</span>
            <input defaultValue="123456789" name="password" type="password" />
          </label>

          <div className="password-row">
            <Link to="/recuperar-senha">Esqueci minha senha</Link>
          </div>

          <button className="primary-button" type="submit">Entrar</button>

          <div className="divider"><span>ou</span></div>
          <p className="login-foot">Ainda não possui conta? <Link to="/cadastro">Cadastre-se</Link></p>
        </form>
      </section>
    </main>
  )
}
