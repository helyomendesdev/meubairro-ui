interface LoadingStateProps {
  label: string
}

export function LoadingState({ label }: LoadingStateProps) {
  return (
    <p className="async-loading" role="status">
      {label}
    </p>
  )
}

interface ErrorBannerProps {
  message: string
  onRetry?: () => void
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className="form-error" role="alert">
      <span>{message}</span>
      {onRetry ? (
        <button type="button" className="retry-button" onClick={onRetry}>
          Tentar novamente
        </button>
      ) : null}
    </div>
  )
}
