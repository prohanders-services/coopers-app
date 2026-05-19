import { useState } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'
import { auth, FIREBASE_ENABLED } from '../firebase.js'
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth'

const inp = {
  width: '100%', padding: '13px 16px', borderRadius: 12,
  border: `1px solid ${C.gray200}`, background: '#fff',
  fontSize: 15, fontFamily: 'inherit', outline: 'none',
  boxSizing: 'border-box', color: C.ink,
}

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: 48, height: 28, borderRadius: 14, flexShrink: 0,
        background: on ? C.ocean : C.gray200, border: 'none', cursor: 'pointer',
        position: 'relative', transition: 'background 0.2s', padding: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 3, width: 22, height: 22, borderRadius: 11, background: '#fff',
        left: on ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
      }} />
    </button>
  )
}

const deviceLabel = /Mobile|iPhone|Android/i.test(navigator.userAgent) ? '📱 Appareil mobile' : '💻 Navigateur web'

export default function Security({ goBack }) {
  const [oldPass,     setOldPass]     = useState('')
  const [newPass,     setNewPass]     = useState('')
  const [confPass,    setConfPass]    = useState('')
  const [showOld,     setShowOld]     = useState(false)
  const [showNew,     setShowNew]     = useState(false)
  const [showConf,    setShowConf]    = useState(false)
  const [twoFa,       setTwoFa]       = useState(false)
  const [twoFaMethod, setTwoFaMethod] = useState('sms')
  const [saved,       setSaved]       = useState(false)
  const [passError,   setPassError]   = useState('')
  const [loading,     setLoading]     = useState(false)

  const [activeSessions] = useState([
    { id: 'current', device: deviceLabel, time: 'Maintenant', current: true },
  ])

  const canSave = oldPass && newPass.length >= 6 && newPass === confPass

  const savePass = async () => {
    if (!canSave || loading) return
    setPassError('')
    setLoading(true)
    try {
      if (FIREBASE_ENABLED && auth?.currentUser) {
        const credential = EmailAuthProvider.credential(auth.currentUser.email, oldPass)
        await reauthenticateWithCredential(auth.currentUser, credential)
        await updatePassword(auth.currentUser, newPass)
      }
      setSaved(true)
      setOldPass(''); setNewPass(''); setConfPass('')
      setTimeout(() => setSaved(false), 2500)
    } catch (e) {
      const msgs = {
        'auth/wrong-password':     'Mot de passe actuel incorrect ❌',
        'auth/invalid-credential': 'Mot de passe actuel incorrect ❌',
        'auth/too-many-requests':  'Trop de tentatives. Réessayez plus tard.',
      }
      setPassError(msgs[e.code] || 'Erreur lors du changement de mot de passe')
    }
    setLoading(false)
  }

  const fields = [
    { label: 'Mot de passe actuel',  val: oldPass,  set: setOldPass,  show: showOld,  setShow: setShowOld  },
    { label: 'Nouveau mot de passe', val: newPass,  set: setNewPass,  show: showNew,  setShow: setShowNew  },
    { label: 'Confirmer le nouveau', val: confPass, set: setConfPass, show: showConf, setShow: setShowConf },
  ]

  return (
    <div style={{ width: '100%', height: '100%', background: C.cream, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '0 20px 48px', paddingBottom: 120 }}>
        {/* Header */}
        <div style={{ paddingBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={goBack} style={{
            width: 38, height: 38, borderRadius: 19, background: '#fff',
            border: `1px solid ${C.gray200}`, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon d={ICONS.chevL} size={18} stroke={C.ink} sw={2} />
          </button>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.3 }}>Sécurité</div>
        </div>

        {saved && (
          <div style={{
            padding: '12px 16px', borderRadius: 14, marginBottom: 16,
            background: 'rgba(14,140,126,0.1)', border: '1px solid rgba(14,140,126,0.2)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span>✓</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.ocean }}>Mot de passe modifié avec succès !</span>
          </div>
        )}

        {/* Change password */}
        <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 12 }}>
          Changer le mot de passe
        </div>
        <div style={{ background: '#fff', borderRadius: 18, padding: '16px', border: `1px solid ${C.gray200}`, marginBottom: 22 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {fields.map((f, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, marginBottom: 5 }}>{f.label}</div>
                <input
                  type={f.show ? 'text' : 'password'}
                  value={f.val}
                  onChange={e => { f.set(e.target.value); if (i === 0) setPassError('') }}
                  style={{ ...inp, paddingRight: 56, borderColor: i === 0 && passError ? 'rgba(255,90,95,0.4)' : C.gray200 }}
                />
                <button onClick={() => f.setShow(p => !p)} style={{
                  position: 'absolute', right: 12, bottom: 14,
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: C.gray500, fontSize: 11, fontWeight: 700, fontFamily: 'inherit',
                }}>
                  {f.show ? 'Cacher' : 'Voir'}
                </button>
              </div>
            ))}

            {newPass && confPass && newPass !== confPass && (
              <div style={{ fontSize: 12, color: C.coral, fontWeight: 600 }}>⚠️ Les mots de passe ne correspondent pas</div>
            )}

            {passError && (
              <div style={{
                padding: '10px 12px', borderRadius: 10,
                background: 'rgba(255,90,95,0.08)', border: '1px solid rgba(255,90,95,0.2)',
                fontSize: 13, fontWeight: 600, color: C.coral,
              }}>
                ⚠️ {passError}
              </div>
            )}
          </div>

          <button
            onClick={savePass}
            disabled={!canSave || loading}
            style={{
              marginTop: 16, width: '100%', padding: '13px', borderRadius: 12,
              background: canSave && !loading ? C.coral : C.gray200,
              color: canSave && !loading ? '#fff' : C.gray400,
              border: 'none', cursor: canSave && !loading ? 'pointer' : 'not-allowed',
              fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
              boxShadow: canSave && !loading ? '0 4px 14px rgba(255,90,95,0.25)' : 'none',
            }}
          >
            {loading ? 'Vérification…' : 'Enregistrer le nouveau mot de passe'}
          </button>
        </div>

        {/* 2FA */}
        <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 12 }}>
          Double authentification
        </div>
        <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: `1px solid ${C.gray200}`, marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', borderBottom: twoFa ? `1px solid ${C.gray100}` : 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: twoFa ? 'rgba(14,140,126,0.1)' : C.gray100, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginRight: 12 }}>🛡️</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Authentification à 2 facteurs</div>
              <div style={{ fontSize: 12, color: C.gray500, marginTop: 2 }}>{twoFa ? 'Activée — compte protégé' : 'Recommandé pour sécuriser votre compte'}</div>
            </div>
            <Toggle on={twoFa} onChange={setTwoFa} />
          </div>
          {twoFa && (
            <div style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.gray500, marginBottom: 10 }}>Méthode</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {[{ id: 'sms', label: '📱 SMS' }, { id: 'app', label: '🔐 Authenticator' }].map(m => (
                  <button key={m.id} onClick={() => setTwoFaMethod(m.id)} style={{
                    flex: 1, padding: '10px', borderRadius: 12,
                    background: twoFaMethod === m.id ? C.ocean : C.gray100, border: 'none', cursor: 'pointer',
                    color: twoFaMethod === m.id ? '#fff' : C.ink, fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
                  }}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Active sessions — real current session only */}
        <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 12 }}>
          Sessions actives ({activeSessions.length})
        </div>
        <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: `1px solid ${C.gray200}`, marginBottom: 22 }}>
          {activeSessions.map((s, i) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px' }}>
              <div style={{ fontSize: 22 }}>{s.device.includes('mobile') ? '📱' : '💻'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{s.device}</div>
                <div style={{ fontSize: 11, color: C.gray500, marginTop: 1 }}>{s.time}</div>
              </div>
              <div style={{ padding: '3px 8px', borderRadius: 999, background: 'rgba(14,140,126,0.1)', color: C.ocean, fontSize: 10, fontWeight: 700 }}>Actuel</div>
            </div>
          ))}
        </div>

        {/* Login history — empty state */}
        <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 12 }}>
          Historique des connexions
        </div>
        <div style={{ background: '#fff', borderRadius: 18, border: `1px solid ${C.gray200}` }}>
          <div style={{ padding: '32px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🔐</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>Aucun historique de connexion</div>
            <div style={{ marginTop: 6, fontSize: 12, color: C.gray500, lineHeight: 1.5 }}>
              Les prochaines connexions apparaîtront ici.
            </div>
          </div>
        </div>
      </div>

      <HomeIndicator />
    </div>
  )
}
