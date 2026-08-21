type LogoProps = {
  inverse?: boolean
}

export function Logo({ inverse = false }: LogoProps) {
  return (
    <div className={`brand-lockup${inverse ? ' brand-lockup--inverse' : ''}`}>
      <svg aria-hidden="true" className="brand-mark" viewBox="0 0 64 64">
        <path d="M17 42V30M32 44V24M47 42V30" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M17 8C7 19 8 31 17 36c9-5 10-17 0-28Z" fill="#78bd55" />
        <path d="M32 3c-12 14-11 29 0 36 11-7 12-22 0-36Z" fill="#5ba944" />
        <path d="M47 10c-9 11-8 23 0 28 9-5 9-17 0-28Z" fill="#82c85f" />
        <path d="m12 23 5 5 5-6m4-2 6 7 6-9m4 7 5 5 5-7" fill="none" stroke="#3f753e" strokeWidth="1.5" />
      </svg>
      <div>
        <div className="brand-name">MeuBairro</div>
        <div className="brand-tagline">Sua voz na comunidade</div>
      </div>
    </div>
  )
}
