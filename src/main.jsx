import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

window.onerror = (msg, src, line, col, err) => {
  console.error('[GlobalError]', msg, src, line, col, err)
}
window.onunhandledrejection = (e) => {
  console.error('[UnhandledRejection]', e.reason)
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: 24, fontFamily: 'monospace', background: '#fff1f2',
          minHeight: '100vh', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
        }}>
          <h2 style={{ color: '#e11d48', marginBottom: 12 }}>App Crash — Error Details</h2>
          <strong>{String(this.state.error)}</strong>
          <pre style={{ marginTop: 12, fontSize: 12, color: '#555' }}>
            {this.state.error?.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
