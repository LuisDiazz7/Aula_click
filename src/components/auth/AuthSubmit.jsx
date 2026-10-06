import { IconArrowRight } from '../../utils/icons'

export default function AuthSubmit({ children, loading, loadingText }) {
  return (
    <button type="submit" className="auth-submit" disabled={loading}>
      <span>{loading ? loadingText : children}</span>
      {loading ? (
        <span className="auth-spinner" aria-hidden="true" />
      ) : (
        <IconArrowRight className="auth-submit-arrow" aria-hidden="true" />
      )}
    </button>
  )
}
