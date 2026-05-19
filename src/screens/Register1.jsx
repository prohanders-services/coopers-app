import { useState } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'
import { useApp } from '../context/AppContext.jsx'
import { FIREBASE_ENABLED } from '../firebase.js'

const inp = {
  width: '100%', padding: '14px 16px', borderRadius: 14,
  border: `1px solid ${C.gray200}`, background: '#fff',
  fontSize: 15, fontFamily: 'inherit', outline: 'none',
  boxSizing: 'border-box', color: C.ink,
}

function meetsRules(p) {
  return p.length >= 8 && /[A-Z]/.test(p) && /[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p)
}

function strengthOf(p) {
  if (!p) return 0
  let s = 0
  if (p.length >= 8) s++
  if (p.length >= 10) s++
  if (/[A-Z]/.test(p) && /[0-9]/.test(p)) s++
  if (/[^A-Za-z0-9]/.test(p)) s++
  return s
}

const strengthLabel = ['', 'Faible', 'Moyen', 'Fort', 'Très fort']
const strengthColor = ['', '#FF5A5F', '#F4A24A', '#0E8C7E', '#0E8C7E']

export default function Register1({ navigate, goBack }) {
  const { setPendingReg } = useApp()
  const [firstName,   setFirstName]   = useState('')
  const [lastName,    setLastName]    = useState('')
  const [email,       setEmail]       = useState('')
  const [pass,        setPass]        = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [showPass,    setShowPass]    = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [cgu,         setCgu]         = useState(false)
  const [error,       setError]       = useState('')
  const [referralCode, setReferralCode] = useState('')

  const strength = strengthOf(pass)
  const rulesOk  = meetsRules(pass)
  const matchOk  = !pass || !confirmPass || pass === confirmPass
  const showRulesMsg = pass.length > 0 && !rulesOk

  const canContinue = firstName.trim() && email.trim() && rulesOk && matchOk && confirmPass && cgu

  const handleContinue = () => {
    if (!canContinue) return
    if (pass !== confirmPass) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    setError('')
    setPendingReg({ email: email.trim().toLowerCase(), password: pass, firstName: firstName.trim(), lastName: lastName.trim(), referralCodeInput: referralCode.trim() })
    navigate('register2')
  }

  return (
    <div style={{ width: '100%', height: '100%', background: C.cream, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '0 24px', paddingBottom: 120 }}>
        {/* Header */}
        <div style={{ paddingTop: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={goBack} style={{
            width: 38, height: 38, borderRadius: 19, background: '#fff',
            border: `1px solid ${C.gray200}`, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon d={ICONS.chevL} size={18} stroke={C.ink} sw={2} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700 }}>Créer mon compte</div>
            <div style={{ fontSize: 12, color: C.gray500, marginTop: 1 }}>Étape 1 sur 2</div>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <div style={{ width: 20, height: 4, borderRadius: 2, background: C.coral }} />
            <div style={{ width: 20, height: 4, borderRadius: 2, background: C.gray200 }} />
          </div>
        </div>

        {/* Fields */}
        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <input placeholder="Prénom" value={firstName} onChange={e => setFirstName(e.target.value)} style={{ ...inp, flex: 1 }} />
            <input placeholder="Nom" value={lastName} onChange={e => setLastName(e.target.value)} style={{ ...inp, flex: 1 }} />
          </div>
          <input placeholder="Adresse e-mail" type="email" value={email} onChange={e => setEmail(e.target.value)} style={inp} />

          {/* Password */}
          <div>
            <div style={{ position: 'relative' }}>
              <input
                placeholder="Mot de passe"
                type={showPass ? 'text' : 'password'}
                value={pass}
                onChange={e => { setPass(e.target.value); setError('') }}
                style={{ ...inp, paddingRight: 60, borderColor: pass.length > 0 && !rulesOk ? C.coral : C.gray200 }}
              />
              <button onClick={() => setShowPass(p => !p)} style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                color: C.gray500, fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
              }}>
                {showPass ? 'Cacher' : 'Voir'}
              </button>
            </div>
            {pass.length > 0 && (
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', gap: 4, flex: 1 }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                      flex: 1, height: 3, borderRadius: 2,
                      background: i <= strength ? strengthColor[strength] : C.gray200,
                      transition: 'background 0.2s',
                    }} />
                  ))}
                </div>
                <div style={{ fontSize: 11, color: strengthColor[strength] || C.gray400, fontWeight: 600, minWidth: 55 }}>
                  {strengthLabel[strength]}
                </div>
              </div>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <input
              placeholder="Confirmer le mot de passe"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPass}
              onChange={e => { setConfirmPass(e.target.value); setError('') }}
              style={{ ...inp, paddingRight: 60, borderColor: confirmPass && !matchOk ? C.coral : C.gray200 }}
            />
            <button onClick={() => setShowConfirm(p => !p)} style={{
              position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: C.gray500, fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
            }}>
              {showConfirm ? 'Cacher' : 'Voir'}
            </button>
          </div>

          {/* Password rules message */}
          {showRulesMsg && (
            <div style={{ fontSize: 12, color: C.coral, fontWeight: 500, lineHeight: 1.45, padding: '8px 12px', background: 'rgba(255,90,95,0.06)', borderRadius: 10, border: '1px solid rgba(255,90,95,0.2)' }}>
              Votre mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.
            </div>
          )}

          {/* Passwords don't match */}
          {confirmPass && !matchOk && (
            <div style={{ fontSize: 12, color: C.coral, fontWeight: 500, padding: '8px 12px', background: 'rgba(255,90,95,0.06)', borderRadius: 10, border: '1px solid rgba(255,90,95,0.2)' }}>
              Les mots de passe ne correspondent pas.
            </div>
          )}

          {/* Referral */}
          <div style={{ marginTop: 4 }}>
            <div style={{ fontSize: 12, color: C.gray500, marginBottom: 6, fontWeight: 500 }}>
              Un ami vous a invité ?
            </div>
            <input
              placeholder="Code de parrainage (optionnel)"
              value={referralCode}
              onChange={e => setReferralCode(e.target.value.toUpperCase())}
              style={{ ...inp, textTransform: 'uppercase', letterSpacing: 1 }}
            />
          </div>
        </div>

        {error && (
          <div style={{
            marginTop: 12, padding: '10px 14px', borderRadius: 10,
            background: 'rgba(255,90,95,0.08)', border: '1px solid rgba(255,90,95,0.25)',
            fontSize: 13, fontWeight: 600, color: C.coral,
          }}>
            {error}
          </div>
        )}

        {/* CGU */}
        <div style={{ marginTop: 20, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <button
            onClick={() => setCgu(p => !p)}
            style={{
              width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
              border: cgu ? 'none' : `1.5px solid ${C.gray400}`,
              background: cgu ? C.coral : 'transparent',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {cgu && <Icon d={ICONS.check} size={12} stroke="#fff" sw={2.5} />}
          </button>
          <div style={{ fontSize: 13, color: C.gray500, lineHeight: 1.45 }}>
            J'accepte les{' '}
            <button
              onClick={() => navigate('cgu')}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: C.coral, fontWeight: 700, fontSize: 13, fontFamily: 'inherit' }}
            >
              Conditions Générales d'Utilisation
            </button>
            {' '}et la{' '}
            <button
              onClick={() => navigate('privacypolicy')}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: C.coral, fontWeight: 700, fontSize: 13, fontFamily: 'inherit' }}
            >
              Politique de confidentialité
            </button>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          style={{
            marginTop: 28, width: '100%', padding: '16px', borderRadius: 16,
            background: canContinue ? C.coral : C.gray200,
            color: canContinue ? '#fff' : C.gray400,
            border: 'none', cursor: canContinue ? 'pointer' : 'not-allowed',
            fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
            boxShadow: canContinue ? '0 6px 20px rgba(255,90,95,0.3)' : 'none',
          }}
        >
          Continuer
        </button>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: C.gray500 }}>
          Déjà un compte ?{' '}
          <button onClick={() => navigate('login')} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: C.coral, fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
          }}>
            Se connecter
          </button>
        </div>
      </div>

      <HomeIndicator />
    </div>
  )
}
