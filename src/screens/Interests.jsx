import { useState } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'
import { useApp } from '../context/AppContext.jsx'

const cats = [
  { id: 'restaurants', emoji: '🍽️', label: 'Restaurants' },
  { id: 'nautique',    emoji: '🤿',  label: 'Nautique' },
  { id: 'nature',      emoji: '🌿',  label: 'Nature & Parcs' },
  { id: 'bars',        emoji: '🍹',  label: 'Bars & Sorties' },
  { id: 'beaute',      emoji: '💆',  label: 'Beauté' },
  { id: 'shopping',    emoji: '🛍️',  label: 'Shopping local' },
  { id: 'sport',       emoji: '🏄',  label: 'Sport & Bien-être' },
  { id: 'culture',     emoji: '🎭',  label: 'Culture & Loisirs' },
  { id: 'gastro',      emoji: '🥘',  label: 'Gastronomie' },
]

export default function Interests({ navigate, goBack }) {
  const { updateUser } = useApp()
  const [sel, setSel] = useState(new Set())

  const toggle = (id) => setSel(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const canContinue = sel.size >= 2

  const handleFinish = () => {
    if (!canContinue) return
    updateUser({ categories: new Set(sel) })
    navigate('confirm')
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
            Vos intérêts
          </div>
          <div style={{ marginTop: 8, fontSize: 15, color: C.gray500, lineHeight: 1.5 }}>
            Choisissez au moins 2 catégories pour personnaliser vos bons plans.
          </div>
        </div>

        {/* Counter */}
        {sel.size > 0 && (
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 12px', borderRadius: 999,
              background: canContinue ? 'rgba(14,140,126,0.1)' : 'rgba(255,90,95,0.1)',
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: canContinue ? C.ocean : C.coral }}>
                {sel.size} sélectionnée{sel.size > 1 ? 's' : ''}
              </div>
              {canContinue && <Icon d={ICONS.check} size={12} stroke={C.ocean} sw={2.5} />}
            </div>
          </div>
        )}

        {/* Grid */}
        <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {cats.map(c => {
            const active = sel.has(c.id)
            return (
              <button
                key={c.id}
                onClick={() => toggle(c.id)}
                style={{
                  padding: '16px 8px 14px', borderRadius: 18, textAlign: 'center',
                  background: active ? C.coral : '#fff',
                  border: active ? 'none' : `1px solid ${C.gray200}`,
                  cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: active ? '0 4px 14px rgba(255,90,95,0.25)' : 'none',
                  transition: 'all 0.15s', position: 'relative',
                }}
              >
                {active && (
                  <div style={{
                    position: 'absolute', top: 6, right: 6,
                    width: 16, height: 16, borderRadius: 8,
                    background: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon d={ICONS.check} size={9} stroke={C.coral} sw={2.5} />
                  </div>
                )}
                <div style={{ fontSize: 28, lineHeight: 1 }}>{c.emoji}</div>
                <div style={{
                  marginTop: 8, fontSize: 11, fontWeight: 700, lineHeight: 1.3,
                  color: active ? '#fff' : C.ink,
                }}>
                  {c.label}
                </div>
              </button>
            )
          })}
        </div>

        {/* CTA */}
        <button
          onClick={handleFinish}
          style={{
            marginTop: 28, width: '100%', padding: '16px', borderRadius: 16,
            background: canContinue ? C.coral : C.gray200,
            color: canContinue ? '#fff' : C.gray400,
            border: 'none', cursor: canContinue ? 'pointer' : 'not-allowed',
            fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
            boxShadow: canContinue ? '0 6px 20px rgba(255,90,95,0.3)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          Terminer la configuration
        </button>
      </div>

      <HomeIndicator />
    </div>
  )
}
