import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'
import { useApp } from '../context/AppContext.jsx'

function Stars({ v }) {
  return (
    <span style={{ color: '#F4C24A', fontSize: 11 }}>
      {'★'.repeat(Math.floor(v))}
      {v % 1 >= 0.5 ? '½' : ''}
    </span>
  )
}

export default function OfferList({ navigate, goBack }) {
  const { user, offerListConfig, setCurrentOffer, offers: OFFERS } = useApp()
  const { title = 'Offres', type = 'all' } = offerListConfig || {}

  const goToOffer = (offer) => {
    setCurrentOffer(offer)
    navigate('offer')
  }

  const getOffers = () => {
    switch (type) {
      case 'favorites':
        return OFFERS.filter(o => o.rating >= 4.7).sort((a, b) => b.rating - a.rating)
      case 'selection':
        return [...OFFERS].sort((a, b) => {
          const aMatch = a.zone === user.zone ? 0 : 1
          const bMatch = b.zone === user.zone ? 0 : 1
          if (aMatch !== bMatch) return aMatch - bMatch
          return b.discount - a.discount
        })
      case 'nearby':
        return [...OFFERS].sort((a, b) => {
          const aMatch = a.zone === user.zone ? 0 : 1
          const bMatch = b.zone === user.zone ? 0 : 1
          if (aMatch !== bMatch) return aMatch - bMatch
          return a.dist - b.dist
        })
      case 'new':
        return OFFERS.filter(o => o.isNew)
      default:
        return OFFERS
    }
  }

  const offers = getOffers()

  return (
    <div style={{ width: '100%', height: '100%', background: C.cream, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 120 }}>
        {/* Header */}
        <div style={{ padding: '0 20px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={goBack}
            style={{
              width: 38, height: 38, borderRadius: 19, background: '#fff',
              border: `1px solid ${C.gray200}`, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <Icon d={ICONS.chevL} size={18} stroke={C.ink} sw={2} />
          </button>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.4 }}>{title}</div>
            <div style={{ fontSize: 12, color: C.gray500, marginTop: 2 }}>
              {offers.length} offre{offers.length !== 1 ? 's' : ''} disponible{offers.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        <div style={{ padding: '0 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {offers.map((o) => (
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
                <div style={{ width: 72, height: 72, borderRadius: 12, flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ width: '100%', height: '100%', background: o.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{o.emoji}</div>
                  {o.imageUrl && (
                    <img src={o.imageUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.currentTarget.style.display = 'none' }}
                    />
                  )}
                  {o.isNew && (
                    <div style={{ position: 'absolute', top: 4, left: 4, padding: '1px 5px', borderRadius: 999, background: C.ocean, color: '#fff', fontSize: 8, fontWeight: 700 }}>NEW</div>
                  )}
                </div>
                <div style={{ flex: 1, paddingTop: 2 }}>
                  <div style={{ fontSize: 11, color: C.ocean, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase' }}>{o.category} · {o.location}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginTop: 3, color: C.ink }}>{o.commerce}</div>
                  <div style={{ fontSize: 12, color: C.gray500, marginTop: 2, lineHeight: 1.3 }}>{o.title}</div>
                  <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Stars v={o.rating} />
                    <span style={{ fontSize: 11, color: C.gray500 }}>{o.rating} ({o.reviews})</span>
                  </div>
                </div>
                <div style={{ alignSelf: 'flex-start', padding: '4px 8px', background: C.coral, color: '#fff', fontSize: 11, fontWeight: 700, borderRadius: 999, flexShrink: 0 }}>
                  -{o.discount}%
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <HomeIndicator />
    </div>
  )
}
