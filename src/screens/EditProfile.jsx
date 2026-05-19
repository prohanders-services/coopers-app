import { useState } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'
import { useApp } from '../context/AppContext.jsx'

const ZONES = ['Grande-Terre', 'Basse-Terre', 'Marie-Galante', 'Les Saintes', 'Toute la Guadeloupe']

// Stored format is DD/MM/YYYY; <input type="date"> needs YYYY-MM-DD
function toInputDate(fr) {
  if (!fr) return ''
  const p = fr.split('/')
  if (p.length < 3) return ''
  return `${p[2]}-${p[1].padStart(2, '0')}-${p[0].padStart(2, '0')}`
}
function toFrDate(iso) {
  if (!iso) return ''
  const p = iso.split('-')
  if (p.length < 3) return ''
  return `${p[2]}/${p[1]}/${p[0]}`
}

const inp = {
  width: '100%', padding: '13px 16px', borderRadius: 12,
  border: `1px solid ${C.gray200}`, background: '#fff',
  fontSize: 15, fontFamily: 'inherit', outline: 'none',
  boxSizing: 'border-box', color: C.ink,
}

function Field({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.gray500, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 6 }}>
        {label}
      </div>
      {children}
    </div>
  )
}

export default function EditProfile({ goBack }) {
  const { user, updateUser } = useApp()
  const [prenom,  setPrenom]  = useState(user.firstName)
  const [nom,     setNom]     = useState(user.lastName)
  const [email,   setEmail]   = useState(user.email)
  const [tel,     setTel]     = useState(user.phone)
  const [dob,     setDob]     = useState(toInputDate(user.dob))
  const [zone,    setZone]    = useState(user.zone)
  const [photo,   setPhoto]   = useState(user.photo || false)
  const [saved,   setSaved]   = useState(false)
  const [showPhotoMenu, setShowPhotoMenu] = useState(false)

  const save = () => {
    updateUser({ firstName: prenom, lastName: nom, email, phone: tel, dob: toFrDate(dob), zone, photo })
    setSaved(true)
    setTimeout(() => { setSaved(false); goBack() }, 1800)
  }

  return (
    <div style={{ width: '100%', height: '100%', background: C.cream, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      {/* Success overlay */}
      {saved && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 50,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(14,140,126,0.96)', color: '#fff',
        }}>
          <div style={{ fontSize: 56 }}>✓</div>
          <div style={{ marginTop: 16, fontSize: 20, fontWeight: 700 }}>Modifications enregistrées !</div>
          <div style={{ marginTop: 8, fontSize: 14, opacity: 0.85 }}>Votre profil a été mis à jour.</div>
        </div>
      )}

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
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.3 }}>Modifier le profil</div>
        </div>

        {/* Photo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              onClick={() => setShowPhotoMenu(p => !p)}
              style={{
                width: 88, height: 88, borderRadius: 44,
                background: photo ? 'linear-gradient(135deg,#FFB39A,#FF5A5F)' : C.gray100,
                border: `3px solid #fff`, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: photo ? 36 : 30, fontWeight: 800,
                color: photo ? '#fff' : C.gray400,
                fontFamily: '"Instrument Serif", serif', fontStyle: 'italic',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              }}
            >
              {photo ? '😊' : 'M'}
            </button>
            <div style={{
              position: 'absolute', bottom: 2, right: 2,
              width: 26, height: 26, borderRadius: 13, background: C.coral,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
            }}>
              📷
            </div>
          </div>

          {showPhotoMenu && (
            <div style={{
              marginTop: 10, display: 'inline-flex', flexDirection: 'column',
              background: '#fff', borderRadius: 14, overflow: 'hidden',
              border: `1px solid ${C.gray200}`, boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              textAlign: 'left', minWidth: 200,
            }}>
              {[
                { label: '🖼️  Choisir dans la galerie',   action: () => { setPhoto(true);  setShowPhotoMenu(false) } },
                { label: '📷  Prendre une photo',          action: () => { setPhoto(true);  setShowPhotoMenu(false) } },
                { label: '🗑️  Supprimer la photo',         action: () => { setPhoto(false); setShowPhotoMenu(false) }, red: true },
              ].map((o, i, arr) => (
                <button
                  key={i}
                  onClick={o.action}
                  style={{
                    padding: '13px 18px', background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
                    color: o.red ? C.coral : C.ink, textAlign: 'left',
                    borderBottom: i < arr.length - 1 ? `1px solid ${C.gray100}` : 'none',
                  }}
                >
                  {o.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <Field label="Prénom">
              <input value={prenom} onChange={e => setPrenom(e.target.value)} style={{ ...inp, width: '100%' }} />
            </Field>
            <Field label="Nom">
              <input value={nom} onChange={e => setNom(e.target.value)} style={{ ...inp, width: '100%' }} />
            </Field>
          </div>

          <Field label="Adresse e-mail">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inp} />
          </Field>

          <Field label="Téléphone">
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ padding: '13px 12px', borderRadius: 12, border: `1px solid ${C.gray200}`, background: '#fff', fontSize: 14, color: C.gray500, whiteSpace: 'nowrap' }}>
                🇬🇵 +590
              </div>
              <input type="tel" value={tel} onChange={e => setTel(e.target.value)} style={{ ...inp, flex: 1 }} />
            </div>
          </Field>

          <Field label="Date de naissance">
            <input
              type="date"
              value={dob}
              onChange={e => setDob(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              style={{ ...inp, colorScheme: 'light' }}
            />
            {dob && (
              <div style={{ marginTop: 5, fontSize: 12, color: C.ocean, paddingLeft: 2, fontWeight: 600 }}>
                {toFrDate(dob)} · Pour votre cadeau d'anniversaire 🎁
              </div>
            )}
            {!dob && (
              <div style={{ marginTop: 5, fontSize: 11, color: C.gray400, paddingLeft: 2 }}>
                Pour recevoir votre cadeau d'anniversaire 🎁
              </div>
            )}
          </Field>

          <Field label="Zone géographique">
            <div style={{ position: 'relative' }}>
              <select
                value={zone}
                onChange={e => setZone(e.target.value)}
                style={{
                  ...inp, appearance: 'none', WebkitAppearance: 'none',
                  paddingRight: 40, cursor: 'pointer',
                }}
              >
                {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
              <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <Icon d={ICONS.chevR} size={14} stroke={C.gray500} sw={2} style={{ transform: 'rotate(90deg)' }} />
              </div>
            </div>
          </Field>
        </div>

        {/* Save */}
        <button
          onClick={save}
          style={{
            marginTop: 32, width: '100%', padding: '16px', borderRadius: 16,
            background: C.coral, color: '#fff', border: 'none', cursor: 'pointer',
            fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
            boxShadow: '0 6px 20px rgba(255,90,95,0.3)',
          }}
        >
          Enregistrer les modifications
        </button>
      </div>

      <HomeIndicator />
    </div>
  )
}
