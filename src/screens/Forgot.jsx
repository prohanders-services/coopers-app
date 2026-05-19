import { useState } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'
import { auth, FIREBASE_ENABLED } from '../firebase.js'
import { sendPasswordResetEmail } from 'firebase/auth'

export default function Forgot({ navigate, goBack }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resending, setResending] = useState(false)
  const [resentOk, setResentOk] = useState(false)

  const validEmail = email.trim().includes('@') && email.trim().includes('.')

  const sendReset = async (isResend = false) => {
    if (!validEmail) return
    if (isResend) setResending(true)
    else setLoading(true)
    setError('')
    setResentOk(false)

    if (FIREBASE_ENABLED) {
      try {
        await sendPasswordResetEmail(auth, email.trim())
        if (isResend) setResentOk(true)
        else setSent(true)
      } catch (e) {
        const msgs = {
          'auth/user-not-found':    'Aucun compte associé à cet email.',
          'auth/invalid-email':     'Adresse email invalide.',
          'auth/too-many-requests': 'Trop de tentatives. Réessayez plus tard.',
        }
        setError(msgs[e.code] || 'Une erreur est survenue. Réessayez.')
      }
    } else {
      if (isResend) setResentOk(true)
      else setSent(true)
    }

    setLoading(false)
    setResending(false)
  }

  if (sent) {
    return (
      <div style={{ width: '100%', height: '100%', background: C.cream, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
        <StatusBar />
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '0 24px', paddingBottom: 120 }}>
          <div style={{ marginTop: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{
              width: 100, height: 100, borderRadius: 50,
              background: 'linear-gradient(135deg, #D1FAE5 0%, #059669 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 44, boxShadow: '0 8px 24px rgba(5,150,105,0.3)',
            }}>
              ✉️
            </div>
            <div style={{
              marginTop: 28, fontFamily: '"Instrument Serif", Georgia, serif',
              fontSize: 32, fontStyle: 'italic', letterSpacing: -0.6, lineHeight: 1.1,
            }}>
              Email envoyé !
            </div>
            <div style={{ marginTop: 12, fontSize: 15, color: C.gray500, lineHeight: 1.6, maxWidth: 300 }}>
              Un lien de réinitialisation a été envoyé à{' '}
              <strong style={{ color: C.ink }}>{email.trim()}</strong>.
            </div>
            <div style={{
              marginTop: 16, padding: '12px 16px', borderRadius: 14,
              background: 'rgba(14,140,126,0.08)', border: '1px solid rgba(14,140,126,0.15)',
              fontSize: 13, color: C.ocean, lineHeight: 1.5, maxWidth: 320,
            }}>
              Vérifiez votre boîte mail et cliquez sur le lien pour créer un nouveau mot de passe.
            </div>

            {resentOk && (
              <div style={{
                marginTop: 12, padding: '10px 14px', borderRadius: 12,
                background: 'rgba(14,140,126,0.1)', fontSize: 13, color: C.ocean, fontWeight: 600,
              }}>
                ✅ Lien renvoyé avec succès
              </div>
            )}

            <button
              onClick={() => sendReset(true)}
              disabled={resending}
              style={{
                marginTop: 24, width: '100%', maxWidth: 320,
                padding: '14px', borderRadius: 14,
                background: '#fff', border: `1.5px solid ${C.gray200}`,
                color: C.ink, fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
                cursor: resending ? 'not-allowed' : 'pointer',
                opacity: resending ? 0.6 : 1,
              }}
            >
              {resending ? '⏳ Envoi…' : '🔁 Renvoyer le lien'}
            </button>

            <button
              onClick={goBack}
              style={{
                marginTop: 12, width: '100%', maxWidth: 320,
                padding: '14px', borderRadius: 14,
                background: C.coral, color: '#fff',
                border: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
                boxShadow: '0 6px 20px rgba(255,90,95,0.3)',
              }}
            >
              Retour à la connexion
            </button>
          </div>
        </div>
        <HomeIndicator />
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%', background: C.cream, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '0 24px 48px', paddingBottom: 120 }}>
        {/* Header */}
        <div style={{ paddingTop: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={goBack} style={{
            width: 38, height: 38, borderRadius: 19, background: '#fff',
            border: `1px solid ${C.gray200}`, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon d={ICONS.chevL} size={18} stroke={C.ink} sw={2} />
          </button>
        </div>

        {/* Illustration */}
        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: 100, height: 100, borderRadius: 50,
            background: 'linear-gradient(135deg, #FFE9B0 0%, #F4C24A 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 44, boxShadow: '0 8px 24px rgba(244,194,74,0.3)',
          }}>
            🔑
          </div>
        </div>

        {/* Text */}
        <div style={{ marginTop: 28 }}>
          <div style={{
            fontFamily: '"Instrument Serif", Georgia, serif',
            fontSize: 34, fontStyle: 'italic', letterSpacing: -0.6, lineHeight: 1.1,
          }}>
            Mot de passe oublié ?
          </div>
          <div style={{ marginTop: 10, fontSize: 15, color: C.gray500, lineHeight: 1.55 }}>
            Saisissez votre adresse e-mail. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </div>
        </div>

        {/* Field */}
        <div style={{ marginTop: 32 }}>
          <input
            placeholder="Adresse e-mail"
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && sendReset()}
            style={{
              width: '100%', padding: '14px 16px', borderRadius: 14,
              border: `1px solid ${error ? C.coral : C.gray200}`, background: '#fff',
              fontSize: 15, fontFamily: 'inherit', outline: 'none',
              boxSizing: 'border-box', color: C.ink,
            }}
          />
          {error && (
            <div style={{ marginTop: 8, fontSize: 13, color: C.coral, fontWeight: 600 }}>
              {error}
            </div>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={() => sendReset()}
          disabled={!validEmail || loading}
          style={{
            marginTop: 20, width: '100%', padding: '16px', borderRadius: 16,
            background: validEmail ? C.coral : C.gray200,
            color: validEmail ? '#fff' : C.gray400,
            border: 'none', cursor: validEmail ? 'pointer' : 'not-allowed',
            fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
            boxShadow: validEmail ? '0 6px 20px rgba(255,90,95,0.3)' : 'none',
            opacity: loading ? 0.7 : 1,
            transition: 'all 0.2s',
          }}
        >
          {loading ? '⏳ Envoi en cours…' : 'Recevoir le lien de réinitialisation'}
        </button>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <button onClick={goBack} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: C.gray500, fontSize: 14, fontWeight: 500, fontFamily: 'inherit',
          }}>
            Retour à la connexion
          </button>
        </div>
      </div>

      <HomeIndicator />
    </div>
  )
}
