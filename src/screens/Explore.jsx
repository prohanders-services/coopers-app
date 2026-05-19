import { useState, useRef } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import TabBar from '../components/TabBar.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'
import { useApp } from '../context/AppContext.jsx'

const CAT_DEFS = [
  { id: 'restaurants', emoji: '🍽️', label: 'Restaurants',    color: '#009B8D' },
  { id: 'nautique',    emoji: '🤿',  label: 'Nautique',       color: '#1565C0' },
  { id: 'nature',      emoji: '🌿',  label: 'Nature & Parcs', color: '#2E7D32' },
  { id: 'bars',        emoji: '🍹',  label: 'Bars & Sorties', color: '#9B59B6' },
  { id: 'beaute',      emoji: '💆',  label: 'Beauté',         color: '#7B1FA2' },
  { id: 'shopping',    emoji: '🛍️',  label: 'Shopping local', color: '#F39C12' },
]


const CHIPS = [
  { id: 'popular',    label: 'Populaires' },
  { id: 'discount',   label: '% réduction' },
  { id: 'new',        label: 'Nouveaux'    },
  { id: 'distance',   label: 'Distance'    },
]

function Stars({ v }) {
  return (
    <span style={{ color: '#F4C24A', fontSize: 11 }}>
      {'★'.repeat(Math.floor(v))}
      {v % 1 >= 0.5 ? '½' : ''}
    </span>
  )
}

export default function Explore({ navigate, handleTab }) {
  const { activeFilters, setActiveFilters, resetFilters, setCurrentOffer, setOfferListConfig, setCurrentCategory, offers: OFFERS } = useApp()
  // FIX 4: real counts from live offers instead of hardcoded values
  const cats = CAT_DEFS.map(cat => ({
    ...cat,
    count: OFFERS.filter(o => o.catId === cat.id || o.category === cat.label).length,
  }))
  const [search, setSearch] = useState('')
  const [activeChip, setActiveChip] = useState(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef(null)

  const toggleChip = (id) => setActiveChip(prev => prev === id ? null : id)

  const filterActiveCount = (activeFilters.categories?.size || 0)
    + (activeFilters.zone ? 1 : 0)
    + (activeFilters.minDiscount > 0 ? 1 : 0)
    + (activeFilters.sort && activeFilters.sort !== 'Popularité' ? 1 : 0)

  const suggestions = search.length >= 2
    ? OFFERS.filter(o =>
        o.commerce.toLowerCase().includes(search.toLowerCase()) ||
        o.title.toLowerCase().includes(search.toLowerCase()) ||
        o.category.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 5)
    : []

  const filtered = OFFERS.filter(o => {
    const q = search.toLowerCase()
    if (q && !o.commerce.toLowerCase().includes(q) && !o.title.toLowerCase().includes(q) && !o.category.toLowerCase().includes(q)) return false
    if (activeChip === 'new' && !o.isNew) return false
    if (activeFilters.categories?.size > 0 && !activeFilters.categories.has(o.catId) && !activeFilters.categories.has(o.category)) return false
    if (activeFilters.zone && o.zone !== activeFilters.zone) return false
    if (activeFilters.minDiscount > 0 && o.discount < activeFilters.minDiscount) return false
    return true
  }).sort((a, b) => {
    const sort = activeFilters.sort || 'Popularité'
    if (activeChip === 'discount' || sort === '% réduction') return b.discount - a.discount
    if (activeChip === 'distance' || sort === 'Distance') return a.dist - b.dist
    if (activeChip === 'popular' || sort === 'Popularité')  return b.reviews - a.reviews
    if (sort === 'Plus récent') return b.id - a.id
    return 0
  })

  const isFiltering = search || activeChip || filterActiveCount > 0

  const goToOffer = (offer) => {
    setCurrentOffer(offer)
    navigate('offer')
    setShowSuggestions(false)
  }

  const goToList = (title, type) => {
    setOfferListConfig({ title, type })
    navigate('offerlist')
  }

  return (
    <div style={{ width: '100%', height: '100%', background: C.cream, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 120 }}>
        {/* Top bar */}
        <div style={{ padding: '0 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.4 }}>Explorer</div>
        </div>

        {/* Search + Filtres */}
        <div style={{ padding: '0 20px', position: 'relative' }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 10,
              background: '#fff', borderRadius: 14, padding: '11px 14px',
              border: `1px solid ${C.gray200}`,
            }}>
              <Icon d={ICONS.search} size={16} stroke={C.gray400} />
              <input
                ref={inputRef}
                value={search}
                onChange={e => { setSearch(e.target.value); setShowSuggestions(true) }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder="Rechercher un commerce, une offre..."
                style={{
                  flex: 1, border: 'none', outline: 'none', fontSize: 14,
                  fontFamily: 'inherit', color: C.ink, background: 'transparent',
                }}
              />
              {search.length > 0 && (
                <button onClick={() => { setSearch(''); setShowSuggestions(false) }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: C.gray400, fontSize: 16, lineHeight: 1 }}>×</button>
              )}
            </div>
            <button
              onClick={() => navigate('filters')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '11px 14px', borderRadius: 14,
                background: filterActiveCount > 0 ? C.coral : C.ink, border: 'none', cursor: 'pointer',
                color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                flexShrink: 0, position: 'relative',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
              </svg>
              Filtres
              {filterActiveCount > 0 && (
                <span style={{
                  position: 'absolute', top: -6, right: -6,
                  width: 18, height: 18, borderRadius: 9,
                  background: '#fff', color: C.coral,
                  fontSize: 10, fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1.5px solid ${C.coral}`,
                }}>{filterActiveCount}</span>
              )}
            </button>
          </div>

          {/* Active filters chip */}
          {filterActiveCount > 0 && (
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '5px 12px', borderRadius: 999,
                background: 'rgba(255,90,95,0.1)', border: `1px solid rgba(255,90,95,0.25)`,
                fontSize: 12, fontWeight: 700, color: C.coral,
              }}>
                {filterActiveCount} filtre{filterActiveCount > 1 ? 's' : ''} actif{filterActiveCount > 1 ? 's' : ''}
                <button
                  onClick={resetFilters}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: C.coral, fontSize: 15, lineHeight: 1, marginLeft: 2 }}
                >×</button>
              </div>
            </div>
          )}

          {/* Autocomplete dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 20, right: filterActiveCount > 0 ? 0 : 72,
              background: '#fff', borderRadius: 14, border: `1px solid ${C.gray200}`,
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 50, overflow: 'hidden',
              marginTop: 6,
            }}>
              {suggestions.map((o, i) => (
                <button
                  key={o.id}
                  onMouseDown={() => goToOffer(o)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '11px 14px', background: 'none', border: 'none',
                    borderBottom: i < suggestions.length - 1 ? `1px solid ${C.gray100}` : 'none',
                    cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                  }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: o.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{o.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{o.commerce}</div>
                    <div style={{ fontSize: 11, color: C.gray500, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.title}</div>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.coral, flexShrink: 0 }}>-{o.discount}%</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chips */}
        <div style={{ padding: '12px 20px 0', display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {CHIPS.map(chip => (
            <button
              key={chip.id}
              onClick={() => toggleChip(chip.id)}
              style={{
                flexShrink: 0, padding: '7px 14px', borderRadius: 999,
                background: activeChip === chip.id ? C.ink : '#fff',
                border: `1px solid ${activeChip === chip.id ? C.ink : C.gray200}`,
                color: activeChip === chip.id ? '#fff' : C.ink,
                fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Categories grid */}
        {!isFiltering && (
          <div style={{ padding: '20px 20px 0' }}>
            <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.3, marginBottom: 12 }}>Catégories</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {cats.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setCurrentCategory(cat); navigate('category') }}
                  style={{
                    background: '#fff', borderRadius: 16, padding: '14px 14px 12px',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    fontFamily: 'inherit', overflow: 'hidden', position: 'relative',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    borderTop: `3px solid ${cat.color}`,
                  }}
                >
                  <div style={{ fontSize: 24 }}>{cat.emoji}</div>
                  <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: C.ink }}>{cat.label}</div>
                  <div style={{ marginTop: 2, fontSize: 11, color: cat.color, fontWeight: 600 }}>
                    {cat.count} offres actives
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results section */}
        <div style={{ padding: '22px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.3 }}>
              {isFiltering ? `Résultats (${filtered.length})` : 'Populaires près de toi'}
            </div>
          </div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 20px', color: C.gray400 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Aucun résultat trouvé</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Essayez un autre terme ou filtre</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map((o) => (
                <button
                  key={o.id}
                  onClick={() => goToOffer(o)}
                  style={{
                    display: 'flex', gap: 12, background: '#fff', borderRadius: 16,
                    padding: 10, border: 'none', cursor: 'pointer', textAlign: 'left',
                    width: '100%', fontFamily: 'inherit',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  <div style={{ width: 60, height: 60, borderRadius: 12, flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                    <div style={{ width: '100%', height: '100%', background: o.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{o.emoji}</div>
                    {o.imageUrl && (
                      <img src={o.imageUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.currentTarget.style.display = 'none' }}
                      />
                    )}
                    {o.isNew && (
                      <div style={{ position: 'absolute', top: 3, left: 3, padding: '1px 4px', borderRadius: 999, background: C.ocean, color: '#fff', fontSize: 7, fontWeight: 700 }}>NEW</div>
                    )}
                  </div>
                  <div style={{ flex: 1, paddingTop: 2 }}>
                    <div style={{ fontSize: 11, color: C.ocean, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase' }}>{o.category} · {o.location}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginTop: 3, color: C.ink }}>{o.commerce}</div>
                    <div style={{ fontSize: 12, color: C.gray500, marginTop: 2, lineHeight: 1.3, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{o.title}</div>
                    <div style={{ marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Stars v={o.rating} />
                      <span style={{ fontSize: 10, color: C.gray500 }}>{o.rating} · {o.dist} km</span>
                    </div>
                  </div>
                  <div style={{ alignSelf: 'flex-start', padding: '4px 8px', background: C.coral, color: '#fff', fontSize: 11, fontWeight: 700, borderRadius: 999, flexShrink: 0 }}>
                    -{o.discount}%
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* New partners */}
        {!isFiltering && (
          <div style={{ padding: '22px 20px 0' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.3 }}>Nouveaux partenaires</div>
              <button
                onClick={() => goToList('Nouveaux partenaires', 'new')}
                style={{ fontSize: 13, color: C.coral, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              >Voir tout</button>
            </div>
            <div style={{
              display: 'flex', gap: 10,
              overflowX: 'scroll',
              marginLeft: -20, marginRight: -20,
              paddingLeft: 20, paddingRight: 20,
              paddingBottom: 8,
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}>
              {OFFERS.filter(o => o.isNew).map(offer => (
                <button
                  key={offer.id}
                  onClick={() => goToOffer(offer)}
                  style={{
                    flexShrink: 0, width: 130, background: '#fff', borderRadius: 16,
                    border: 'none', cursor: 'pointer', fontFamily: 'inherit', overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  <div style={{ height: 90, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '100%', background: offer.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>{offer.emoji}</div>
                    {offer.imageUrl && (
                      <img src={offer.imageUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.currentTarget.style.display = 'none' }}
                      />
                    )}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.25) 100%)',
                    }} />
                    <div style={{
                      position: 'absolute', top: 8, left: 8,
                      padding: '2px 7px', borderRadius: 999,
                      background: C.ocean, color: '#fff', fontSize: 9, fontWeight: 700, letterSpacing: 0.3,
                    }}>
                      NOUVEAU
                    </div>
                    <div style={{
                      position: 'absolute', top: 8, right: 8,
                      padding: '2px 7px', borderRadius: 999,
                      background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 9, fontWeight: 700,
                    }}>
                      -{offer.discount}%
                    </div>
                  </div>
                  <div style={{ padding: '10px 10px 12px' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, lineHeight: 1.3 }}>{offer.commerce}</div>
                    <div style={{ marginTop: 3, fontSize: 11, color: C.gray500 }}>{offer.category}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <TabBar active="explore" onTab={handleTab} />
    </div>
  )
}
