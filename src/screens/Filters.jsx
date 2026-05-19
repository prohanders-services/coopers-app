import { useState } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'
import { useApp } from '../context/AppContext.jsx'

const catOptions = ['Restaurants', 'Nautique', 'Nature & Parcs', 'Bars & Sorties', 'Beauté', 'Shopping']

const zones = ['Grande-Terre', 'Basse-Terre', 'Marie-Galante', 'Les Saintes', 'Toute la Guadeloupe']

const reductions = ['10%+', '20%+', '30%+', '40%+']
const sorts = ['Popularité', 'Plus récent', '% réduction', 'Distance']

function SectionTitle({ children }) {
  return (
    <div style={{ fontSize: 13, fontWeight: 700, color: C.gray500, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 10 }}>
      {children}
    </div>
  )
}

function Chip({ label, active, onPress }) {
  return (
    <button
      onClick={onPress}
      style={{
        padding: '8px 14px', borderRadius: 999,
        background: active ? C.coral : '#fff',
        border: `1px solid ${active ? C.coral : C.gray200}`,
        color: active ? '#fff' : C.ink,
        fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
        cursor: 'pointer', flexShrink: 0,
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  )
}

export default function Filters({ goBack }) {
  const { activeFilters, setActiveFilters } = useApp()

  const [selCats,  setSelCats]  = useState(new Set(activeFilters.categories))
  const [zone,     setZone]     = useState(activeFilters.zone || '')
  const [reduc,    setReduc]    = useState(activeFilters.minDiscount > 0 ? `${activeFilters.minDiscount}%+` : '10%+')
  const [sort,     setSort]     = useState(activeFilters.sort || 'Popularité')
  const [showZones, setShowZones] = useState(false)

  const toggleCat = id => setSelCats(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const reset = () => {
    setSelCats(new Set())
    setZone('')
    setReduc('10%+')
    setSort('Popularité')
  }

  const apply = () => {
    const minDiscount = parseInt(reduc) || 0
    setActiveFilters({
      categories: selCats,
      zone,
      minDiscount,
      sort,
    })
    goBack()
  }

  const activeCount = selCats.size + (zone ? 1 : 0) + (reduc !== '10%+' ? 1 : 0) + (sort !== 'Popularité' ? 1 : 0)

  return (
    <div style={{ width: '100%', height: '100%', background: C.cream, position: 'relative', overflow: 'hidden', color: C.ink }}>
      <StatusBar />

      {/* Handle + header */}
      <div style={{ padding: '14px 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={goBack} style={{
          width: 38, height: 38, borderRadius: 19, background: '#fff',
          border: `1px solid ${C.gray200}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon d={ICONS.close} size={16} stroke={C.ink} sw={2} />
        </button>
        <div style={{ flex: 1, fontSize: 17, fontWeight: 700 }}>Filtres</div>
        {activeCount > 0 && (
          <div style={{ padding: '4px 10px', borderRadius: 999, background: C.coral, color: '#fff', fontSize: 12, fontWeight: 700 }}>
            {activeCount} actif{activeCount > 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div style={{ height: 'calc(100% - 140px)', overflowY: 'auto', padding: '20px 20px 0' }}>

        {/* Catégorie */}
        <div style={{ marginBottom: 24 }}>
          <SectionTitle>Catégorie</SectionTitle>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {catOptions.map(c => (
              <Chip key={c} label={c} active={selCats.has(c)} onPress={() => toggleCat(c)} />
            ))}
          </div>
        </div>

        <div style={{ height: 1, background: C.gray200, marginBottom: 24 }} />

        {/* Zone */}
        <div style={{ marginBottom: 24 }}>
          <SectionTitle>Zone</SectionTitle>
          <button
            onClick={() => setShowZones(p => !p)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '13px 16px', borderRadius: 14,
              background: '#fff', border: `1px solid ${zone ? C.coral : C.gray200}`,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            <span style={{ fontSize: 14, color: zone ? C.ink : C.gray400, fontWeight: zone ? 600 : 400 }}>
              {zone || 'Toute la Guadeloupe'}
            </span>
            <Icon d={showZones ? ICONS.chevL : ICONS.chevR} size={16} stroke={C.gray500} sw={2} />
          </button>
          {showZones && (
            <div style={{ marginTop: 8, borderRadius: 14, border: `1px solid ${C.gray200}`, background: '#fff', overflow: 'hidden' }}>
              <button
                onClick={() => { setZone(''); setShowZones(false) }}
                style={{
                  width: '100%', padding: '12px 16px', textAlign: 'left',
                  background: !zone ? 'rgba(255,90,95,0.06)' : 'transparent',
                  border: 'none', borderBottom: `1px solid ${C.gray100}`,
                  cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: 14, color: !zone ? C.coral : C.gray500, fontWeight: !zone ? 600 : 400,
                }}
              >
                Toute la Guadeloupe
              </button>
              {zones.filter(z => z !== 'Toute la Guadeloupe').map(z => (
                <button
                  key={z}
                  onClick={() => { setZone(z); setShowZones(false) }}
                  style={{
                    width: '100%', padding: '12px 16px', textAlign: 'left',
                    background: zone === z ? 'rgba(255,90,95,0.06)' : 'transparent',
                    border: 'none', borderBottom: `1px solid ${C.gray100}`,
                    cursor: 'pointer', fontFamily: 'inherit',
                    fontSize: 14, color: zone === z ? C.coral : C.ink, fontWeight: zone === z ? 600 : 400,
                  }}
                >
                  {z}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ height: 1, background: C.gray200, marginBottom: 24 }} />

        {/* Réduction min */}
        <div style={{ marginBottom: 24 }}>
          <SectionTitle>Réduction minimum</SectionTitle>
          <div style={{ display: 'flex', gap: 8 }}>
            {reductions.map(r => (
              <button
                key={r}
                onClick={() => setReduc(r)}
                style={{
                  flex: 1, padding: '10px 6px', borderRadius: 12,
                  background: reduc === r ? C.coral : '#fff',
                  border: `1px solid ${reduc === r ? C.coral : C.gray200}`,
                  color: reduc === r ? '#fff' : C.ink,
                  fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
                  cursor: 'pointer',
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: 1, background: C.gray200, marginBottom: 24 }} />

        {/* Trier par */}
        <div style={{ marginBottom: 12 }}>
          <SectionTitle>Trier par</SectionTitle>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {sorts.map(s => (
              <Chip key={s} label={s} active={sort === s} onPress={() => setSort(s)} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer buttons */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '12px 20px 32px',
        background: C.cream,
        borderTop: `1px solid ${C.gray200}`,
        display: 'flex', gap: 10,
      }}>
        <button
          onClick={reset}
          style={{
            flex: 0, padding: '14px 20px', borderRadius: 14,
            background: '#fff', border: `1px solid ${C.gray200}`,
            color: C.ink, fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
            cursor: 'pointer', whiteSpace: 'nowrap',
          }}
        >
          Réinitialiser
        </button>
        <button
          onClick={apply}
          style={{
            flex: 1, padding: '14px', borderRadius: 14,
            background: C.coral, border: 'none',
            color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(255,90,95,0.3)',
          }}
        >
          Appliquer les filtres
        </button>
      </div>

      <HomeIndicator />
    </div>
  )
}
