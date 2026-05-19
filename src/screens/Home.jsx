import StatusBar from '../components/StatusBar.jsx'
import TabBar from '../components/TabBar.jsx'
import Photo from '../components/Photo.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'
import { useApp } from '../context/AppContext.jsx'
export default function Home({ navigate, handleTab }) {
  const { user, setCurrentOffer, setOfferListConfig, offerCounters, pendingValidation, setPendingValidation, offers: OFFERS } = useApp()
  const featuredOffer = OFFERS.find(o => o.isFeatured) || OFFERS[0]

  const goToOffer = (offer) => {
    setCurrentOffer(offer)
    navigate('offer')
  }

  const goToList = (title, type) => {
    setOfferListConfig({ title, type })
    navigate('offerlist')
  }

  // FIX 1: offers from context is already the merged single source of truth
  const allOffers = OFFERS

  const nearbyOffers = [...allOffers].sort((a, b) => {
    const aMatch = a.zone === user.zone ? 0 : 1
    const bMatch = b.zone === user.zone ? 0 : 1
    if (aMatch !== bMatch) return aMatch - bMatch
    return (a.dist || 99) - (b.dist || 99)
  }).slice(0, 2)

  const selectionOffers = [...allOffers].sort((a, b) => {
    const aMatch = a.zone === user.zone ? 0 : 1
    const bMatch = b.zone === user.zone ? 0 : 1
    if (aMatch !== bMatch) return aMatch - bMatch
    return b.discount - a.discount
  }).slice(0, 3)

  const newOffers = allOffers.filter(o => o.isNew)
  // FIX 5: top offers by discount (prioritizing isFeatured), always shows 4
  const coupDeCoeur = [...allOffers].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1
    if (!a.isFeatured && b.isFeatured) return 1
    return b.discount - a.discount
  }).slice(0, 4)

  return (
    <div style={{
      width: '100%', height: '100%',
      background: C.cream, position: 'relative', overflow: 'hidden',
      color: C.ink,
    }}>
      <StatusBar />

      <div style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Top bar — stays fixed */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 14px', flexShrink: 0 }}>
          <div style={{
            fontFamily: '"Instrument Serif", Georgia, serif',
            fontSize: 28, fontStyle: 'italic', letterSpacing: -0.5,
          }}>
            coopers<span style={{ color: C.coral }}>.</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => navigate('explore')} style={{ width: 38, height: 38, borderRadius: 19, background: C.gray100, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon d={ICONS.search} size={18} stroke={C.ink} />
            </button>
            <button onClick={() => navigate('notifications')} style={{ width: 38, height: 38, borderRadius: 19, background: C.gray100, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <Icon d={ICONS.bell} size={18} stroke={C.ink} />
              <div style={{ position: 'absolute', top: 8, right: 9, width: 8, height: 8, borderRadius: 4, background: C.coral, border: '1.5px solid #fff' }} />
            </button>
          </div>
        </div>

        {/* Everything else scrolls together */}
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 120 }}>

        {/* Hero */}
        <div style={{ padding: '0 20px' }}>
          <button onClick={() => goToOffer(featuredOffer)} style={{
            position: 'relative', borderRadius: 24, overflow: 'hidden',
            height: 200, width: '100%',
            boxShadow: '0 12px 24px rgba(0,0,0,0.06)',
            border: 'none', cursor: 'pointer', padding: 0, display: 'block',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #A7F3D0 0%, #059669 60%, #065F46 100%)' }} />
            {featuredOffer?.imageUrl && (
              <img
                src={featuredOffer.imageUrl} alt=""
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { e.currentTarget.style.display = 'none' }}
              />
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)' }} />
            <div style={{
              position: 'absolute', top: 16, left: 16,
              padding: '6px 12px', background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(8px)', borderRadius: 999,
              color: '#fff', fontSize: 11, fontWeight: 600,
              letterSpacing: 0.4, textTransform: 'uppercase',
            }}>
              Édition de la semaine
            </div>
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '40px 20px 16px',
              background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.5) 100%)',
              color: '#fff', textAlign: 'left',
            }}>
              <div style={{
                fontFamily: '"Instrument Serif", Georgia, serif',
                fontSize: 28, fontStyle: 'italic', lineHeight: 1.1, letterSpacing: -0.5,
              }}>
                3 jours sur la côte sous-le-vent
              </div>
              <div style={{ marginTop: 6, fontSize: 12, opacity: 0.9, fontWeight: 500 }}>
                {featuredOffer && featuredOffer.utilisationsMax != null
                  ? `${featuredOffer.utilisationsMax - (offerCounters[featuredOffer.id] ?? featuredOffer.compteurUtilisations)} Coops à utiliser · ${featuredOffer.zone}`
                  : featuredOffer?.zone}
              </div>
            </div>
          </button>
        </div>

        {/* Section header — scrolls with content */}
        <div style={{ padding: '20px 20px 8px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.4 }}>Près de toi</div>
          <button onClick={() => goToList('Offres près de toi', 'nearby')} style={{ fontSize: 13, color: C.coral, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Voir tout</button>
        </div>

        {/* Cards + extra sections */}
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {nearbyOffers.map(offer => (
            <button key={offer.id} onClick={() => goToOffer(offer)} style={{
              display: 'flex', gap: 12, background: '#fff', borderRadius: 16,
              padding: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
            }}>
              <div style={{ width: 84, height: 84, borderRadius: 12, flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                <div style={{ width: '100%', height: '100%', background: offer.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>{offer.emoji}</div>
                {offer.imageUrl && (
                  <img src={offer.imageUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.currentTarget.style.display = 'none' }}
                  />
                )}
              </div>
              <div style={{ flex: 1, paddingTop: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontSize: 11, color: C.ocean, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase' }}>{offer.category} · {offer.location}</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, marginTop: 4, lineHeight: 1.25, color: C.ink }}>{offer.commerce}</div>
                <div style={{ fontSize: 12, color: C.gray500, marginTop: 4, lineHeight: 1.3 }}>{offer.title}</div>
                <div style={{ fontSize: 12, color: C.gray500, marginTop: 2 }}>{offer.dist} km</div>
              </div>
              <div style={{ alignSelf: 'flex-start', padding: '4px 10px', background: C.coral, color: '#fff', fontSize: 12, fontWeight: 700, borderRadius: 999 }}>-{offer.discount}%</div>
            </button>
          ))}

          {/* Coups de cœur */}
          <div style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.3 }}>Coups de cœur ❤️</div>
              <button onClick={() => goToList('Coups de cœur', 'favorites')} style={{ fontSize: 13, color: C.coral, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Voir tout</button>
            </div>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', marginRight: -20, paddingRight: 20, scrollbarWidth: 'none' }}>
              {coupDeCoeur.map(offer => (
                <button key={offer.id} onClick={() => goToOffer(offer)} style={{
                  flexShrink: 0, width: 140, borderRadius: 18, border: 'none',
                  cursor: 'pointer', padding: 0, overflow: 'hidden', textAlign: 'left',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)', background: '#fff',
                }}>
                  <div style={{ height: 90, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '100%', background: offer.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>{offer.emoji}</div>
                    {offer.imageUrl && (
                      <img src={offer.imageUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.currentTarget.style.display = 'none' }}
                      />
                    )}
                    <div style={{ position: 'absolute', top: 8, right: 8, padding: '2px 8px', background: 'rgba(0,0,0,0.65)', borderRadius: 999, color: '#fff', fontSize: 10, fontWeight: 700 }}>-{offer.discount}%</div>
                  </div>
                  <div style={{ padding: '8px 10px 10px' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, lineHeight: 1.2 }}>{offer.commerce}</div>
                    <div style={{ fontSize: 10, color: C.gray500, marginTop: 3 }}>{offer.category} · {offer.location}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sélection Coopers */}
          <div style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.3 }}>🎯 Sélection Coopers</div>
              <button onClick={() => goToList('Sélection Coopers', 'selection')} style={{ fontSize: 13, color: C.coral, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Voir tout</button>
            </div>
            {selectionOffers.map((offer, i) => (
              <button key={offer.id} onClick={() => goToOffer(offer)} style={{
                display: 'flex', gap: 12, background: '#fff', borderRadius: 16,
                padding: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
                marginBottom: i < 2 ? 10 : 0,
              }}>
                <div style={{ width: 64, height: 64, borderRadius: 12, flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ width: '100%', height: '100%', background: offer.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{offer.emoji}</div>
                  {offer.imageUrl && (
                    <img src={offer.imageUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.currentTarget.style.display = 'none' }}
                    />
                  )}
                </div>
                <div style={{ flex: 1, paddingTop: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ fontSize: 11, color: C.ocean, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase' }}>{offer.category} · {offer.zone}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 3, color: C.ink }}>{offer.commerce}</div>
                  <div style={{ fontSize: 11, color: C.gray500, marginTop: 3, lineHeight: 1.3 }}>{offer.title}</div>
                </div>
                <div style={{ alignSelf: 'flex-start', padding: '4px 10px', background: C.coral, color: '#fff', fontSize: 11, fontWeight: 700, borderRadius: 999 }}>-{offer.discount}%</div>
              </button>
            ))}
          </div>

          {/* Ils rejoignent Coopers */}
          <div style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.3 }}>Ils rejoignent Coopers 🌟</div>
                <div style={{ fontSize: 12, color: C.gray500, marginTop: 3 }}>Nouveaux partenaires cette semaine</div>
              </div>
              <button onClick={() => goToList('Nouveaux partenaires', 'new')} style={{ fontSize: 13, color: C.coral, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>Voir tout</button>
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
              {newOffers.map(offer => (
                <button key={offer.id} onClick={() => goToOffer(offer)} style={{
                  flexShrink: 0, width: 130, background: '#fff', borderRadius: 18,
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  overflow: 'hidden', textAlign: 'left',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}>
                  <div style={{ height: 90, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '100%', background: offer.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>{offer.emoji}</div>
                    {offer.imageUrl && (
                      <img src={offer.imageUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.currentTarget.style.display = 'none' }}
                      />
                    )}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.3) 100%)',
                    }} />
                    <div style={{
                      position: 'absolute', top: 8, left: 8,
                      padding: '2px 7px', borderRadius: 999,
                      background: C.ocean, color: '#fff', fontSize: 9, fontWeight: 700, letterSpacing: 0.3,
                    }}>
                      NOUVEAU
                    </div>
                  </div>
                  <div style={{ padding: '8px 10px 10px' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, lineHeight: 1.2 }}>{offer.commerce}</div>
                    <div style={{ marginTop: 3, fontSize: 10, color: C.gray500 }}>{offer.category}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        </div>{/* end scrollable */}
      </div>

      <TabBar active="home" onTab={handleTab} />

      {/* Pending validation modal — shows after admin validates user's coop */}
      {pendingValidation && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px',
        }}>
          <div style={{ background: '#fff', borderRadius: 24, padding: '28px 22px', width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 52 }}>🎉</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: C.ink, marginTop: 12, letterSpacing: -0.4 }}>
                Votre Coops a été validé !
              </div>
              <div style={{ fontSize: 14, color: C.gray500, marginTop: 10, lineHeight: 1.6 }}>
                Vous avez économisé <strong style={{ color: C.ocean }}>~{pendingValidation.savings}€</strong> et gagné{' '}
                <strong style={{ color: C.ocean }}>+10 points</strong> chez{' '}
                <strong style={{ color: C.ink }}>{pendingValidation.commerce}</strong>.
              </div>
              <div style={{
                marginTop: 12, padding: '10px 16px', borderRadius: 12,
                background: 'rgba(14,140,126,0.08)', border: '1px solid rgba(14,140,126,0.2)',
                fontSize: 13, color: C.ocean, fontWeight: 700,
              }}>
                🎟️ {pendingValidation.offer}
              </div>
            </div>
            <button
              onClick={() => {
                const offer = allOffers.find(o => o.commerce === pendingValidation.commerce)
                if (offer) setCurrentOffer(offer)
                setPendingValidation(null)
                navigate('review')
              }}
              style={{
                width: '100%', padding: '15px', borderRadius: 14,
                background: C.coral, color: '#fff', border: 'none', cursor: 'pointer',
                fontSize: 15, fontWeight: 700, fontFamily: 'inherit', marginBottom: 10,
                boxShadow: '0 6px 20px rgba(255,90,95,0.3)',
              }}
            >
              ⭐ Laisser un avis
            </button>
            <button
              onClick={() => setPendingValidation(null)}
              style={{
                width: '100%', padding: '14px', borderRadius: 14,
                background: C.gray100, color: C.gray500,
                border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
              }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
