import { useState } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'

const CATEGORIES = [
  '🍽️  Restaurants',
  '🤿  Nautique',
  '🌿  Nature & Parcs',
  '🍹  Bars & Sorties',
  '💆  Beauté',
  '🛍️  Shopping local',
  '🏄  Sport & Bien-être',
  '🎭  Culture & Loisirs',
  '🥘  Gastronomie',
  '🏨  Hébergement',
  '🚗  Transport',
  '🏥  Santé & Bien-être',
]

const ZONES = ['Grande-Terre', 'Basse-Terre', 'Marie-Galante', 'Les Saintes', 'La Désirade']

const inp = {
  width: '100%', padding: '13px 16px', borderRadius: 12,
  border: `1px solid ${C.gray200}`, background: '#fff',
  fontSize: 14, fontFamily: 'inherit', outline: 'none',
  boxSizing: 'border-box', color: C.ink,
}

function Field({ label, required, children }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 6 }}>
        {label}{required && <span style={{ color: C.coral, marginLeft: 3 }}>*</span>}
      </div>
      {children}
    </div>
  )
}

export default function Suggest({ goBack }) {
  const [name,    setName]    = useState('')
  const [cat,     setCat]     = useState('')
  const [zone,    setZone]    = useState('')
  const [ville,   setVille]   = useState('')
  const [message, setMessage] = useState('')
  const [sent,    setSent]    = useState(false)

  const canSend = name.trim() && cat && zone && message.trim().length >= 10

  const send = () => {
    if (!canSend) return
    setSent(true)
  }

  if (sent) {
    return (
      <div style={{ width: '100%', height: '100%', background: C.cream, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
        <StatusBar />
        <div style={{
          height: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', padding: '0 32px',
        }}>
          <div style={{
            width: 96, height: 96, borderRadius: 48,
            background: 'rgba(14,140,126,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 44, marginBottom: 24,
          }}>
            🏪
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.3, marginBottom: 10, textAlign: 'center' }}>
            Suggestion envoyée !
          </div>
          <div style={{ fontSize: 14, color: C.gray500, lineHeight: 1.6, textAlign: 'center', marginBottom: 28 }}>
            Merci pour votre contribution. Notre équipe examine chaque suggestion et contacte les commerces locaux.
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px',
            borderRadius: 16, background: 'rgba(14,140,126,0.1)',
            border: '1px solid rgba(14,140,126,0.2)', marginBottom: 32,
          }}>
            <span style={{ fontSize: 22 }}>⭐</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.ocean }}>+10 points offerts</div>
              <div style={{ fontSize: 12, color: C.gray500 }}>si votre suggestion est acceptée</div>
            </div>
          </div>
          <button
            onClick={goBack}
            style={{
              width: '100%', padding: '16px', borderRadius: 16,
              background: C.coral, color: '#fff', border: 'none', cursor: 'pointer',
              fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
              boxShadow: '0 6px 20px rgba(255,90,95,0.3)',
            }}
          >
            Retour au profil
          </button>
        </div>
        <HomeIndicator />
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%', background: C.cream, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '0 20px 48px', paddingBottom: 120 }}>
        {/* Header */}
        <div style={{ paddingBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={goBack} style={{
            width: 38, height: 38, borderRadius: 19, background: '#fff',
            border: `1px solid ${C.gray200}`, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon d={ICONS.chevL} size={18} stroke={C.ink} sw={2} />
          </button>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.3 }}>Suggérer un commerce</div>
        </div>

        {/* Incentive banner */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
          borderRadius: 16, marginBottom: 24,
          background: 'rgba(14,140,126,0.08)', border: '1px solid rgba(14,140,126,0.18)',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: 'rgba(14,140,126,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
          }}>
            🎁
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.ocean }}>
              +10 points offerts si votre suggestion est acceptée !
            </div>
            <div style={{ fontSize: 12, color: C.gray500, marginTop: 2, lineHeight: 1.4 }}>
              Aidez-nous à enrichir l'offre Coopers en Guadeloupe.
            </div>
          </div>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Nom du commerce" required>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex : Le Rocher de Malendure"
              style={inp}
            />
          </Field>

          <Field label="Catégorie" required>
            <div style={{ position: 'relative' }}>
              <select
                value={cat}
                onChange={e => setCat(e.target.value)}
                style={{
                  ...inp, appearance: 'none', WebkitAppearance: 'none',
                  paddingRight: 40, cursor: 'pointer',
                  color: cat ? C.ink : C.gray400,
                }}
              >
                <option value="" disabled>Choisir une catégorie</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <Icon d={ICONS.chevR} size={14} stroke={C.gray500} sw={2} style={{ transform: 'rotate(90deg)' }} />
              </div>
            </div>
          </Field>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <Field label="Zone" required>
                <div style={{ position: 'relative' }}>
                  <select
                    value={zone}
                    onChange={e => setZone(e.target.value)}
                    style={{
                      ...inp, appearance: 'none', WebkitAppearance: 'none',
                      paddingRight: 36, cursor: 'pointer',
                      color: zone ? C.ink : C.gray400, fontSize: 13,
                    }}
                  >
                    <option value="" disabled>Zone</option>
                    {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                  </select>
                  <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <Icon d={ICONS.chevR} size={12} stroke={C.gray500} sw={2} style={{ transform: 'rotate(90deg)' }} />
                  </div>
                </div>
              </Field>
            </div>
            <div style={{ flex: 1 }}>
              <Field label="Ville">
                <input
                  value={ville}
                  onChange={e => setVille(e.target.value)}
                  placeholder="Ex : Bouillante"
                  style={{ ...inp, fontSize: 13 }}
                />
              </Field>
            </div>
          </div>

          <Field label="Message" required>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Décrivez le commerce, pourquoi vous le recommandez, les offres potentielles… (min. 10 caractères)"
              rows={4}
              style={{
                ...inp, resize: 'none', lineHeight: 1.6,
                minHeight: 100,
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, paddingLeft: 2 }}>
              <div style={{ fontSize: 11, color: C.gray400 }}>Minimum 10 caractères</div>
              <div style={{ fontSize: 11, color: message.length > 500 ? C.coral : C.gray400 }}>
                {message.length}/500
              </div>
            </div>
          </Field>
        </div>

        {/* Required note */}
        <div style={{ marginTop: 8, fontSize: 12, color: C.gray400 }}>
          <span style={{ color: C.coral }}>*</span> Champs obligatoires
        </div>

        {/* Submit */}
        <button
          onClick={send}
          style={{
            marginTop: 24, width: '100%', padding: '16px', borderRadius: 16,
            background: canSend ? C.coral : C.gray200,
            color: canSend ? '#fff' : C.gray400,
            border: 'none', cursor: canSend ? 'pointer' : 'not-allowed',
            fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
            boxShadow: canSend ? '0 6px 20px rgba(255,90,95,0.3)' : 'none',
            transition: 'background 0.2s, box-shadow 0.2s',
          }}
        >
          Envoyer ma suggestion
        </button>
      </div>

      <HomeIndicator />
    </div>
  )
}
