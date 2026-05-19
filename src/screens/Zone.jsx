import { useState } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'
import { useApp } from '../context/AppContext.jsx'

const zones = [
  {
    id: 'grande-terre',
    emoji: '🌺',
    name: 'Grande-Terre',
    desc: 'Pointe-à-Pitre, Gosier, Sainte-Anne, Saint-François…',
  },
  {
    id: 'basse-terre',
    emoji: '🌿',
    name: 'Basse-Terre',
    desc: 'Bouillante, Deshaies, Trois-Rivières, Basse-Terre…',
  },
  {
    id: 'marie-galante',
    emoji: '🌾',
    name: 'Marie-Galante',
    desc: 'Grand-Bourg, Capesterre, Saint-Louis…',
  },
  {
    id: 'les-saintes',
    emoji: '⛵',
    name: 'Les Saintes',
    desc: 'Terre-de-Haut, Terre-de-Bas…',
  },
  {
    id: 'all',
    emoji: '🗺️',
    name: 'Toute la Guadeloupe',
    desc: 'Voir les bons plans de tout l\'archipel',
    all: true,
  },
]

export default function Zone({ navigate, goBack }) {
  const { updateUser } = useApp()
  const [selected, setSelected] = useState(null)

  const handleContinue = () => {
    if (!selected) return
    const zone = zones.find(z => z.id === selected)
    if (zone) updateUser({ zone: zone.name })
    navigate('interests')
  }

  return (
    <div style={{ width: '100%', height: '100%', background: C.cream, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '0 20px 48px', paddingBottom: 120 }}>
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

        {/* Title */}
        <div style={{ marginTop: 24 }}>
          <div style={{
            fontFamily: '"Instrument Serif", Georgia, serif',
            fontSize: 34, fontStyle: 'italic', letterSpacing: -0.6, lineHeight: 1.1,
          }}>
            Votre zone
          </div>
          <div style={{ marginTop: 8, fontSize: 15, color: C.gray500, lineHeight: 1.5 }}>
            Choisissez la zone géographique qui vous correspond le mieux.
          </div>
        </div>

        {/* Zones */}
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {zones.map(z => {
            const active = selected === z.id
            return (
              <button
                key={z.id}
                onClick={() => setSelected(z.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '16px', borderRadius: 18, textAlign: 'left',
                  background: active ? C.coral : '#fff',
                  border: active ? 'none' : `1px solid ${C.gray200}`,
                  cursor: 'pointer', width: '100%', fontFamily: 'inherit',
                  marginTop: z.all ? 8 : 0,
                  boxShadow: active ? '0 6px 20px rgba(255,90,95,0.25)' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                  background: active ? 'rgba(255,255,255,0.2)' : C.gray100,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22,
                }}>
                  {z.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: active ? '#fff' : C.ink }}>
                    {z.name}
                  </div>
                  <div style={{ fontSize: 12, marginTop: 2, color: active ? 'rgba(255,255,255,0.8)' : C.gray500, lineHeight: 1.4 }}>
                    {z.desc}
                  </div>
                </div>
                {active && (
                  <div style={{
                    width: 22, height: 22, borderRadius: 11, flexShrink: 0,
                    background: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon d={ICONS.check} size={12} stroke={C.coral} sw={2.5} />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* CTA */}
        <button
          onClick={handleContinue}
          style={{
            marginTop: 28, width: '100%', padding: '16px', borderRadius: 16,
            background: selected ? C.coral : C.gray200,
            color: selected ? '#fff' : C.gray400,
            border: 'none', cursor: selected ? 'pointer' : 'not-allowed',
            fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
            boxShadow: selected ? '0 6px 20px rgba(255,90,95,0.3)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          Continuer
        </button>
      </div>

      <HomeIndicator />
    </div>
  )
}
