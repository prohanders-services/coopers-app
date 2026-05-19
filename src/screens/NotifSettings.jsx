import { useState } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'

const NOTIFS = [
  { id: 'new_offers',    label: 'Nouvelles offres dans mes catégories', emoji: '🎁' },
  { id: 'nearby',        label: 'Offres près de moi',                   emoji: '📍' },
  { id: 'expiry',        label: 'Un Coops expire bientôt',               emoji: '⏰' },
  { id: 'points',        label: 'Points gagnés',                        emoji: '⭐' },
  { id: 'challenges',    label: 'Nouveau défi disponible',              emoji: '🏆' },
  { id: 'fidelite',      label: 'Offres exclusives fidélité',           emoji: '💎' },
  { id: 'info',          label: 'Informations Coopers',                 emoji: 'ℹ️' },
  { id: 'newsletter',    label: 'Newsletter',                           emoji: '📩' },
]

const FREQS = ['En temps réel', 'Résumé quotidien', 'Hebdomadaire']

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: 48, height: 28, borderRadius: 14, flexShrink: 0,
        background: on ? C.ocean : C.gray200,
        border: 'none', cursor: 'pointer', position: 'relative',
        transition: 'background 0.2s',
        padding: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 3, width: 22, height: 22, borderRadius: 11,
        background: '#fff',
        left: on ? 23 : 3,
        transition: 'left 0.2s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
      }} />
    </button>
  )
}

export default function NotifSettings({ goBack }) {
  const initState = Object.fromEntries(NOTIFS.map(n => [n.id, n.id !== 'newsletter']))
  const [state,  setState]  = useState(initState)
  const [freq,   setFreq]   = useState('En temps réel')
  const [saved,  setSaved]  = useState(false)

  const toggle = id => setState(s => ({ ...s, [id]: !s[id] }))

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

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
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.3 }}>Notifications</div>
        </div>

        {/* Saved banner */}
        {saved && (
          <div style={{
            padding: '12px 16px', borderRadius: 14, marginBottom: 16,
            background: 'rgba(14,140,126,0.1)', border: '1px solid rgba(14,140,126,0.2)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontSize: 16 }}>✓</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.ocean }}>Préférences enregistrées !</span>
          </div>
        )}

        {/* Toggle list */}
        <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10 }}>
          Types de notifications
        </div>
        <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: `1px solid ${C.gray200}`, marginBottom: 22 }}>
          {NOTIFS.map((n, i) => (
            <div
              key={n.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                borderBottom: i < NOTIFS.length - 1 ? `1px solid ${C.gray100}` : 'none',
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: state[n.id] ? 'rgba(14,140,126,0.1)' : C.gray100,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
              }}>
                {n.emoji}
              </div>
              <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: state[n.id] ? C.ink : C.gray500 }}>
                {n.label}
              </div>
              <Toggle on={state[n.id]} onChange={() => toggle(n.id)} />
            </div>
          ))}
        </div>

        {/* Frequency */}
        <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10 }}>
          Fréquence
        </div>
        <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: `1px solid ${C.gray200}`, marginBottom: 28 }}>
          {FREQS.map((f, i) => (
            <button
              key={f}
              onClick={() => setFreq(f)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', width: '100%', background: 'none', border: 'none',
                borderBottom: i < FREQS.length - 1 ? `1px solid ${C.gray100}` : 'none',
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 500, color: C.ink }}>{f}</span>
              {freq === f && <Icon d={ICONS.check} size={16} stroke={C.ocean} sw={2.5} />}
            </button>
          ))}
        </div>

        <button
          onClick={save}
          style={{
            width: '100%', padding: '16px', borderRadius: 16,
            background: C.coral, color: '#fff', border: 'none', cursor: 'pointer',
            fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
            boxShadow: '0 6px 20px rgba(255,90,95,0.3)',
          }}
        >
          Enregistrer mes préférences
        </button>
      </div>

      <HomeIndicator />
    </div>
  )
}
