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

export default function Register2({ navigate, goBack }) {
  const { registerUser } = useApp()
  const [hasPhoto, setHasPhoto] = useState(false)
  const [phone,    setPhone]    = useState('')
  const [dob,      setDob]      = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleCreate = async () => {
    setLoading(true)
    setError('')
    const result = await registerUser({ phone, dob, photo: hasPhoto })
    setLoading(false)
    if (result.success) {
      navigate('zone')
    } else {
      setError(result.error)
    }
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
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700 }}>Créer mon compte</div>
            <div style={{ fontSize: 12, color: C.gray500, marginTop: 1 }}>Étape 2 sur 2</div>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <div style={{ width: 20, height: 4, borderRadius: 2, background: C.coral }} />
            <div style={{ width: 20, height: 4, borderRadius: 2, background: C.coral }} />
          </div>
        </div>

        {/* Photo upload */}
        <div style={{ marginTop: 28, textAlign: 'center' }}>
          <button
            onClick={() => setHasPhoto(p => !p)}
            style={{
              width: 88, height: 88, borderRadius: 44,
              background: hasPhoto
                ? 'linear-gradient(140deg, #FFB39A, #FF5A5F)'
                : '#fff',
              border: `2px dashed ${hasPhoto ? 'transparent' : C.gray200}`,
              cursor: 'pointer', display: 'inline-flex',
              alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 4,
              position: 'relative',
            }}
          >
            {hasPhoto ? (
              <div style={{ fontSize: 32 }}>😊</div>
            ) : (
              <>
                <div style={{ fontSize: 24, color: C.gray400 }}>+</div>
                <div style={{ fontSize: 10, color: C.gray400, fontWeight: 600, fontFamily: 'inherit' }}>Photo</div>
              </>
            )}
          </button>
          <div style={{ marginTop: 8, fontSize: 12, color: C.gray500 }}>
            Photo de profil{' '}
            <span style={{ color: C.gray400 }}>(optionnelle)</span>
          </div>
        </div>

        {/* Fields */}
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <div style={{ fontSize: 12, color: C.gray500, marginBottom: 6, fontWeight: 600, letterSpacing: 0.3 }}>
              TÉLÉPHONE <span style={{ color: C.gray400, fontWeight: 400 }}>— optionnel</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{
                padding: '14px 12px', borderRadius: 14,
                border: `1px solid ${C.gray200}`, background: '#fff',
                fontSize: 15, color: C.gray500, fontWeight: 500, whiteSpace: 'nowrap',
              }}>
                🇬🇵 +590
              </div>
              <input placeholder="06 90 XX XX XX" type="tel" value={phone} onChange={e => setPhone(e.target.value)} style={{ ...inp, flex: 1 }} />
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, color: C.gray500, marginBottom: 6, fontWeight: 600, letterSpacing: 0.3 }}>
              DATE DE NAISSANCE <span style={{ color: C.gray400, fontWeight: 400 }}>— optionnelle</span>
            </div>
            <input placeholder="JJ/MM/AAAA" type="text" value={dob} onChange={e => setDob(e.target.value)} style={inp} />
            <div style={{ marginTop: 6, fontSize: 11, color: C.gray400, paddingLeft: 4 }}>
              Pour recevoir un bonus surprise le jour de votre anniversaire 🎁
            </div>
          </div>
        </div>

        {/* Info banner */}
        <div style={{
          marginTop: 24, padding: '14px 16px', borderRadius: 14,
          background: 'rgba(14,140,126,0.08)', border: `1px solid rgba(14,140,126,0.15)`,
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <div style={{ fontSize: 16, marginTop: 1 }}>ℹ️</div>
          <div style={{ fontSize: 13, color: C.ocean, lineHeight: 1.45, fontWeight: 500 }}>
            Ces informations sont optionnelles et peuvent être modifiées à tout moment depuis votre profil.
          </div>
        </div>

        {error && (
          <div style={{
            marginTop: 16, padding: '10px 14px', borderRadius: 10,
            background: 'rgba(255,90,95,0.08)', border: '1px solid rgba(255,90,95,0.25)',
            fontSize: 13, fontWeight: 600, color: C.coral,
          }}>
            {error}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleCreate}
          disabled={loading}
          style={{
            marginTop: 32, width: '100%', padding: '16px', borderRadius: 16,
            background: loading ? C.gray200 : C.coral,
            color: loading ? C.gray400 : '#fff',
            border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
            boxShadow: loading ? 'none' : '0 6px 20px rgba(255,90,95,0.3)',
          }}
        >
          {loading ? 'Création…' : 'Créer mon compte'}
        </button>

        <button
          onClick={handleCreate}
          disabled={loading}
          style={{
            marginTop: 12, width: '100%', padding: '14px', borderRadius: 16,
            background: 'transparent', color: C.gray500, border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
          }}
        >
          Passer cette étape
        </button>
      </div>

      <HomeIndicator />
    </div>
  )
}
