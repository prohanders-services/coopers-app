import { useState } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { C } from '../tokens.js'
import { useApp } from '../context/AppContext.jsx'
import { FIREBASE_ENABLED } from '../firebase.js'

const inp = {
  width: '100%', padding: '14px 16px', borderRadius: 14,
  border: `1px solid ${C.gray200}`, background: '#fff',
  fontSize: 15, fontFamily: 'inherit', outline: 'none',
  boxSizing: 'border-box', color: C.ink,
}

export default function Login({ navigate }) {
  const { loginWithEmail, loginWithGoogle } = useApp()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const canLogin = email.trim() && password.trim() && !loading

  const handleLogin = async () => {
    if (!canLogin) return
    setLoading(true)
    setError('')
    const result = await loginWithEmail(email.trim().toLowerCase(), password)
    setLoading(false)
    if (result.success) {
      navigate(result.admin ? 'admindashboard' : 'home')
    } else {
      setError(result.error)
    }
  }

  const handleGoogle = async () => {
    setLoading(true)
    setError('')
    const result = await loginWithGoogle()
    setLoading(false)
    if (result.success) {
      navigate('home')
    } else {
      setError(result.error)
    }
  }

  return (
    <div style={{ width: '100%', height: '100%', background: C.cream, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '0 24px 48px', paddingBottom: 120 }}>
        <div style={{ paddingTop: 72, marginBottom: 36 }}>
          <div style={{
            fontFamily: '"Instrument Serif", Georgia, serif',
            fontSize: 46, fontStyle: 'italic', letterSpacing: -1.2, lineHeight: 1,
          }}>
            coopers<span style={{ color: C.coral }}>.</span>
          </div>
          <div style={{ marginTop: 8, fontSize: 15, color: C.gray500, fontWeight: 400 }}>
            Content de vous revoir 👋
          </div>
        </div>

        {error && (
          <div style={{
            padding: '12px 16px', borderRadius: 12, marginBottom: 16,
            background: 'rgba(255,90,95,0.08)', border: '1px solid rgba(255,90,95,0.25)',
            fontSize: 13, fontWeight: 600, color: C.coral,
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            placeholder="Adresse e-mail"
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ ...inp, borderColor: error ? 'rgba(255,90,95,0.4)' : C.gray200 }}
          />
          <div style={{ position: 'relative' }}>
            <input
              placeholder="Mot de passe"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ ...inp, paddingRight: 60, borderColor: error ? 'rgba(255,90,95,0.4)' : C.gray200 }}
            />
            <button onClick={() => setShowPass(p => !p)} style={{
              position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: C.gray500, fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
            }}>
              {showPass ? 'Cacher' : 'Voir'}
            </button>
          </div>
        </div>

        <div style={{ marginTop: 8, textAlign: 'right' }}>
          <button onClick={() => navigate('forgot')} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: C.coral, fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
          }}>
            Mot de passe oublié ?
          </button>
        </div>

        <button
          onClick={handleLogin}
          disabled={!canLogin}
          style={{
            marginTop: 24, width: '100%', padding: '16px', borderRadius: 16,
            background: canLogin ? C.coral : C.gray200,
            color: canLogin ? '#fff' : C.gray400,
            border: 'none', cursor: canLogin ? 'pointer' : 'not-allowed',
            fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
            boxShadow: canLogin ? '0 6px 20px rgba(255,90,95,0.3)' : 'none',
          }}
        >
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>

        {!FIREBASE_ENABLED && (
          <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 12, background: C.gray100, fontSize: 12, color: C.gray500 }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Comptes de démonstration :</div>
            <div>👤 user@coopers.gp / demo1234</div>
            <div>🏪 admin@coopers.gp / admin1234</div>
          </div>
        )}

        <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: C.gray200 }} />
          <div style={{ fontSize: 12, color: C.gray400, fontWeight: 500 }}>ou</div>
          <div style={{ flex: 1, height: 1, background: C.gray200 }} />
        </div>

        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={handleGoogle}
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              width: '100%', padding: '14px', borderRadius: 16,
              background: '#fff', border: `1px solid ${C.gray200}`, cursor: 'pointer',
              fontSize: 15, fontWeight: 600, fontFamily: 'inherit', color: C.ink,
              opacity: loading ? 0.6 : 1,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuer avec Google
          </button>
          <button style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            width: '100%', padding: '14px', borderRadius: 16,
            background: C.ink, border: 'none', cursor: 'pointer',
            fontSize: 15, fontWeight: 600, fontFamily: 'inherit', color: '#fff',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Continuer avec Apple
          </button>
        </div>

        <div style={{ marginTop: 36, textAlign: 'center', fontSize: 14, color: C.gray500 }}>
          Pas encore de compte ?{' '}
          <button onClick={() => navigate('register1')} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: C.coral, fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
          }}>
            Créer mon compte
          </button>
        </div>
      </div>

      <HomeIndicator />
    </div>
  )
}
