import { useState } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'
import { useApp } from '../context/AppContext.jsx'

const CAT_META = {
  'Restaurants':    { color: '#009B8D', emoji: '🍽️' },
  'Nautique':       { color: '#1565C0', emoji: '🤿'  },
  'Nature & Parcs': { color: '#2E7D32', emoji: '🌿'  },
  'Bars & Sorties': { color: '#9B59B6', emoji: '🍹'  },
  'Beauté':         { color: '#7B1FA2', emoji: '💆'  },
  'Shopping local': { color: '#F39C12', emoji: '🛍️'  },
}

const sorts = ['Populaires', '% réduction', 'Nouveaux', 'Distance']

function Stars({ v }) {
  return <span style={{ color: '#F4C24A', fontSize: 11 }}>{'★'.repeat(Math.floor(v))}</span>
}

export default function Category({ navigate, goBack }) {
  const { user, currentCategory, setCurrentOffer, activateCoops, offers: OFFERS } = useApp()
  const [activeSort, setActiveSort] = useState('Populaires')
  const [search, setSearch] = useState('')

  const cat = currentCategory || { id: 'restaurants', label: 'Restaurants', color: '#009B8D', emoji: '🍽️', count: 24 }
  const meta = CAT_META[cat.label] || { color: cat.color || '#009B8D', emoji: cat.emoji || '🍽️' }

  const catOffers = OFFERS.filter(o => o.category === cat.label || o.catId === cat.id)

  const filtered = catOffers.filter(o => {
    const q = search.toLowerCase()
    if (q && !o.commerce.toLowerCase().includes(q) && !o.title.toLowerCase().includes(q)) return false
    return true
  }).sort((a, b) => {
    const aMatch = a.zone === user.zone ? 0 : 1
    const bMatch = b.zone === user.zone ? 0 : 1
    if (aMatch !== bMatch) return aMatch - bMatch
    if (activeSort === '% réduction') return b.discount - a.discount
    if (activeSort === 'Distance') return a.dist - b.dist
    if (activeSort === 'Nouveaux') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
    return b.reviews - a.reviews
  })

  const goToOffer = (offer) => {
    setCurrentOffer(offer)
    navigate('offer')
  }

  return (
    <div style={{ width: '100%', height: '100%', background: C.cream, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar dark />

      {/* Colored header */}
      <div style={{
        background: meta.color, color: '#fff',
        padding: '54px 20px 20px', position: 'relative',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <button onClick={goBack} style={{
            width: 36, height: 36, borderRadius: 18,
            background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon d={ICONS.chevL} size={18} stroke="#fff" sw={2} />
          </button>
          <div style={{
            padding: '6px 12px', borderRadius: 999,
            background: 'rgba(255,255,255,0.2)', border: 'none',
            color: '#fff', fontSize: 12, fontWeight: 600,
          }}>
            {filtered.length} offre{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 36 }}>{meta.emoji}</div>
          <div>
            <div style={{
              fontFamily: '"Instrument Serif", Georgia, serif',
              fontSize: 30, fontStyle: 'italic', letterSpacing: -0.5, lineHeight: 1,
            }}>
              {cat.label}
            </div>
            <div style={{ marginTop: 4, fontSize: 13, opacity: 0.9, fontWeight: 500 }}>
              {filtered.length} offre{filtered.length !== 1 ? 's' : ''} active{filtered.length !== 1 ? 's' : ''} · Guadeloupe
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '0 0 16px', paddingBottom: 120 }}>
        {/* Search bar */}
        <div style={{ padding: '14px 20px 0' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: '#fff', borderRadius: 14, padding: '10px 14px',
            border: `1px solid ${C.gray200}`,
          }}>
            <Icon d={ICONS.search} size={15} stroke={C.gray400} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`Rechercher dans ${cat.label}...`}
              style={{
                flex: 1, border: 'none', outline: 'none', fontSize: 13,
                fontFamily: 'inherit', color: C.ink, background: 'transparent',
              }}
            />
          </div>
        </div>

        {/* Sort chips */}
        <div style={{ padding: '12px 20px 0', display: 'flex', gap: 8, overflowX: 'auto' }}>
          {sorts.map(s => (
            <button
              key={s}
              onClick={() => setActiveSort(s)}
              style={{
                padding: '7px 14px', borderRadius: 999, flexShrink: 0,
                background: activeSort === s ? meta.color : '#fff',
                border: `1px solid ${activeSort === s ? meta.color : C.gray200}`,
                color: activeSort === s ? '#fff' : C.ink,
                fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                cursor: 'pointer',
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Offer cards */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: C.gray400 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Aucune offre disponible</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>Revenez bientôt pour de nouvelles offres !</div>
          </div>
        ) : (
          <div style={{ padding: '14px 20px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filtered.map(o => (
              <div
                key={o.id}
                style={{
                  background: '#fff', borderRadius: 18,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.06)', overflow: 'hidden',
                }}
              >
                <div style={{ height: 130, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', background: o.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
                    <span>{o.emoji}</span>
                  </div>
                  {o.imageUrl && (
                    <img src={o.imageUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.currentTarget.style.display = 'none' }}
                    />
                  )}
                  <div style={{
                    position: 'absolute', top: 10, right: 10,
                    padding: '4px 10px', borderRadius: 999,
                    background: C.coral, color: '#fff', fontSize: 13, fontWeight: 800,
                  }}>
                    -{o.discount}%
                  </div>
                  {o.isNew && (
                    <div style={{
                      position: 'absolute', top: 10, left: 10,
                      padding: '4px 10px', borderRadius: 999,
                      background: C.ocean, color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
                    }}>
                      NOUVEAU
                    </div>
                  )}
                </div>

                <div style={{ padding: '14px 14px 16px' }}>
                  <div style={{ fontSize: 11, color: meta.color, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase' }}>
                    {o.commerce}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.ink, marginTop: 4, lineHeight: 1.3 }}>
                    {o.title}
                  </div>
                  <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Stars v={o.rating} />
                    <span style={{ fontSize: 12, color: C.gray500 }}>{o.rating} ({o.reviews} avis)</span>
                  </div>
                  <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <span style={{ fontSize: 12, color: C.gray500 }}>📍 {o.dist} km · {o.location}</span>
                    </div>
                    <span style={{ fontSize: 11, color: C.gray500 }}>⏳ {o.expiry}</span>
                  </div>
                  <button
                    onClick={() => goToOffer(o)}
                    style={{
                      marginTop: 12, width: '100%', padding: '11px', borderRadius: 12,
                      background: meta.color, border: 'none', cursor: 'pointer',
                      color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
                    }}
                  >
                    Voir ce Coops
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <HomeIndicator />
    </div>
  )
}
