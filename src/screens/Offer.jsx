import { useState } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import IOSGlassPill from '../components/IOSGlassPill.jsx'
import StickyCTA from '../components/StickyCTA.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'
import { useApp } from '../context/AppContext.jsx'

export default function Offer({ navigate, goBack }) {
  const { currentOffer, favorites, toggleFavorite, activateCoops, offers, setCurrentOffer } = useApp()
  const [phase, setPhase] = useState('detail') // 'detail' | 'success' | 'duplicate'
  const [expiryStr, setExpiryStr] = useState('')
  const [toast, setToast] = useState(null)

  const o = currentOffer || {
    title: '-30% sur l\'addition',
    commerce: 'Le Lagon Bleu',
    location: 'Saint-François',
    gradient: 'linear-gradient(160deg, #FFC5C8 0%, #FF8A8E 100%)',
    emoji: '🌊',
    expiry: '31 mai 2026',
    points: 60,
    conditions: ['Valable du lundi au jeudi', 'Hors boissons alcoolisées', 'Une utilisation par personne'],
    code: 'LLB30',
    id: 1,
  }

  const isFav = favorites.has(o.id)

  // FIX 7: other offers from the same commerce
  const otherOffers = (offers || []).filter(x => x.commerce === o.commerce && x.id !== o.id)

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: o.title, text: `${o.commerce} — ${o.title}`, url: window.location.href })
    }
  }

  const handleFav = () => {
    toggleFavorite(o.id)
    setToast(isFav ? 'Retiré des favoris' : 'Ajouté aux favoris ❤️')
    setTimeout(() => setToast(null), 2000)
  }

  const handleActivate = async () => {
    const result = await activateCoops(o)
    if (result.isDuplicate) {
      setPhase('duplicate')
    } else {
      setExpiryStr(result.expiryStr)
      setPhase('success')
    }
  }

  const goToOtherOffer = (offer) => {
    setCurrentOffer(offer)
    navigate('offer')
  }

  return (
    <div style={{
      width: '100%', height: '100%',
      background: C.cream, position: 'relative', overflow: 'hidden',
      color: C.ink, display: 'flex', flexDirection: 'column',
    }}>
      <StatusBar dark />

      {toast && (
        <div style={{
          position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)',
          zIndex: 100, background: 'rgba(0,0,0,0.8)', color: '#fff',
          padding: '10px 18px', borderRadius: 24, fontSize: 13, fontWeight: 600,
          whiteSpace: 'nowrap', backdropFilter: 'blur(4px)',
        }}>
          {toast}
        </div>
      )}

      {/* Content area: hero behind + scrollable card on top */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Hero — fixed behind the scrollable layer */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 280, zIndex: 0 }}>
          <div style={{ position: 'absolute', inset: 0, background: o.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 56 }}>{o.emoji}</span>
          </div>
          {o.imageUrl && (
            <img src={o.imageUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.currentTarget.style.display = 'none' }}
            />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.4) 100%)' }} />
          {/* Nav buttons — above scrollable layer */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, padding: '16px 16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <IOSGlassPill>
              <button onClick={goBack} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer' }}>
                <Icon d={ICONS.chevL} size={20} stroke="#fff" sw={2} />
              </button>
            </IOSGlassPill>
            <div style={{ display: 'flex', gap: 8 }}>
              <IOSGlassPill>
                <button onClick={handleFav} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <span style={{ fontSize: 18, lineHeight: 1 }}>{isFav ? '❤️' : '🤍'}</span>
                </button>
              </IOSGlassPill>
              <IOSGlassPill>
                <button onClick={handleShare} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                    <polyline points="16 6 12 2 8 6"/>
                    <line x1="12" y1="2" x2="12" y2="15"/>
                  </svg>
                </button>
              </IOSGlassPill>
            </div>
          </div>
        </div>

        {/* Scrollable content — starts at 220px (overlaps bottom of hero) */}
        <div style={{
          position: 'absolute', top: 220, left: 0, right: 0, bottom: 0,
          overflowY: 'auto', WebkitOverflowScrolling: 'touch',
          zIndex: 10, paddingBottom: 100,
        }}>
          {/* Floating card */}
          <div style={{
            margin: '0 20px',
            background: '#fff', borderRadius: 24, padding: 22,
            boxShadow: '0 12px 24px rgba(0,0,0,0.06)',
          }}>
            <div style={{
              display: 'inline-block', padding: '5px 11px',
              background: C.ink, color: '#fff',
              fontSize: 10, fontWeight: 700, borderRadius: 999,
              letterSpacing: 0.5, textTransform: 'uppercase',
            }}>
              Coops exclusive
            </div>
            <div style={{
              fontFamily: '"Instrument Serif", Georgia, serif',
              fontSize: 34, fontStyle: 'italic',
              marginTop: 12, letterSpacing: -0.8, lineHeight: 1,
            }}>
              {o.title}
            </div>
            <div style={{ marginTop: 6, fontSize: 14, color: C.gray500 }}>{o.commerce} · {o.location}</div>

            <button onClick={() => navigate('commercepage')} style={{
              marginTop: 10, display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 12, background: C.gray100,
              border: 'none', cursor: 'pointer', fontFamily: 'inherit', width: '100%',
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: o.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{o.emoji}</div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{o.commerce}</div>
                <div style={{ fontSize: 11, color: C.gray500, marginTop: 1 }}>{'★'.repeat(Math.floor(o.rating || 4.5))} {o.rating} ({o.reviews} avis)</div>
              </div>
              <span style={{ fontSize: 18, color: C.gray400 }}>›</span>
            </button>

            <div style={{
              marginTop: 20, padding: '16px 0',
              borderTop: `1px solid ${C.gray200}`,
              borderBottom: `1px solid ${C.gray200}`,
              display: 'flex',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: C.gray500, fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase' }}>Valable</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>Jusqu'au {o.expiry}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: C.gray500, fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase' }}>+ Points</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4, color: C.ocean }}>+{o.points} pts</div>
              </div>
            </div>

            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: -0.2, marginTop: 18 }}>Conditions</div>
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 9 }}>
              {(o.conditions || []).map((cond, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: C.gray500 }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: 9,
                    background: C.ocean, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: 1,
                  }}>
                    <Icon d={ICONS.check} size={11} stroke="#fff" sw={3} />
                  </div>
                  <span>{cond}</span>
                </div>
              ))}
            </div>

            {/* FIX 7: Other offers from same commerce */}
            {otherOffers.length > 0 && (
              <div style={{ marginTop: 22, paddingTop: 18, borderTop: `1px solid ${C.gray200}` }}>
                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: -0.2, marginBottom: 12 }}>
                  Autres offres de {o.commerce}
                </div>
                <div style={{
                  display: 'flex', gap: 10,
                  overflowX: 'auto', scrollbarWidth: 'none',
                  marginLeft: -22, marginRight: -22,
                  paddingLeft: 22, paddingRight: 22, paddingBottom: 4,
                }}>
                  {otherOffers.map(offer => (
                    <button
                      key={offer.id}
                      onClick={() => goToOtherOffer(offer)}
                      style={{
                        flexShrink: 0, width: 120, background: C.gray100,
                        borderRadius: 14, border: 'none', cursor: 'pointer',
                        overflow: 'hidden', textAlign: 'left', fontFamily: 'inherit',
                      }}
                    >
                      <div style={{ height: 72, position: 'relative', overflow: 'hidden' }}>
                        <div style={{ width: '100%', height: '100%', background: offer.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{offer.emoji}</div>
                        {offer.imageUrl && (
                          <img src={offer.imageUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={e => { e.currentTarget.style.display = 'none' }}
                          />
                        )}
                        <div style={{ position: 'absolute', top: 6, right: 6, padding: '2px 7px', borderRadius: 999, background: C.coral, color: '#fff', fontSize: 10, fontWeight: 700 }}>
                          -{offer.discount}%
                        </div>
                      </div>
                      <div style={{ padding: '7px 9px 9px' }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: C.ink, lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{offer.title}</div>
                        <div style={{ marginTop: 4, fontSize: 10, fontWeight: 600, color: C.ocean }}>Voir →</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div style={{ height: 20 }} />
        </div>
      </div>

      <StickyCTA color={C.coral} sub="Gratuit · +10 pts crédités lors de l'utilisation" onClick={handleActivate}>
        Obtenir ce Coops
      </StickyCTA>
      <HomeIndicator />

      {/* Success overlay */}
      {phase === 'success' && (
        <div style={{
          position: 'absolute', inset: 0, background: C.cream, zIndex: 300,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '60px 24px 40px', overflowY: 'auto',
        }}>
          <div style={{ fontSize: 80, marginBottom: 8 }}>🎟️</div>
          <div style={{
            fontSize: 28, fontWeight: 800, letterSpacing: -0.5,
            textAlign: 'center', marginBottom: 6,
          }}>
            Coops activé !
          </div>
          <div style={{ fontSize: 16, color: C.ocean, fontWeight: 700, textAlign: 'center' }}>{o.commerce}</div>
          <div style={{ fontSize: 14, color: C.gray500, marginTop: 4, textAlign: 'center', lineHeight: 1.4 }}>{o.title}</div>

          <div style={{
            marginTop: 24, width: '100%', padding: '18px 20px',
            background: '#fff', borderRadius: 18,
            border: `1px solid ${C.gray200}`,
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 24 }}>📍</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>Rendez-vous chez {o.commerce}</div>
                <div style={{ fontSize: 13, color: C.gray500, marginTop: 3 }}>avant le {expiryStr}</div>
              </div>
            </div>
            <div style={{ marginTop: 12, height: 1, background: C.gray100 }} />
            <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 24 }}>⭐</div>
              <div style={{ fontSize: 13, color: C.gray500, lineHeight: 1.4 }}>
                <strong style={{ color: C.ocean }}>+10 points Coopers</strong> seront crédités lors de l'utilisation chez le commerçant
              </div>
            </div>
          </div>

          <div style={{ marginTop: 32, width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={() => navigate('mycoops')}
              style={{
                width: '100%', padding: '16px', borderRadius: 16,
                background: C.ocean, border: 'none', cursor: 'pointer',
                color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
                boxShadow: '0 6px 20px rgba(14,140,126,0.3)',
              }}
            >
              Voir mon Coops
            </button>
            <button
              onClick={() => { setPhase('detail'); goBack() }}
              style={{
                width: '100%', padding: '14px', borderRadius: 16,
                background: '#fff', border: `1px solid ${C.gray200}`, cursor: 'pointer',
                color: C.ink, fontSize: 15, fontWeight: 600, fontFamily: 'inherit',
              }}
            >
              Continuer à explorer
            </button>
          </div>
        </div>
      )}

      {/* Duplicate modal */}
      {phase === 'duplicate' && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
          zIndex: 300, display: 'flex', alignItems: 'flex-end',
        }}>
          <div style={{
            width: '100%', background: '#fff',
            borderRadius: '24px 24px 0 0',
            padding: '28px 24px 40px', textAlign: 'center',
          }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: C.gray200, margin: '0 auto 20px' }} />
            <div style={{ fontSize: 44, marginBottom: 12 }}>🎟️</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.ink, marginBottom: 8 }}>
              Ce Coops est déjà dans ton portefeuille !
            </div>
            <div style={{ fontSize: 14, color: C.gray500, marginBottom: 24, lineHeight: 1.5 }}>
              Tu as déjà activé cette offre. Retrouve-la dans Mes Coops.
            </div>
            <button
              onClick={() => navigate('mycoops')}
              style={{
                width: '100%', padding: '14px', borderRadius: 14,
                background: C.coral, border: 'none', cursor: 'pointer',
                color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
                marginBottom: 10,
              }}
            >
              Voir mes Coops
            </button>
            <button
              onClick={() => setPhase('detail')}
              style={{
                width: '100%', padding: '13px', borderRadius: 14,
                background: '#fff', border: `1px solid ${C.gray200}`, cursor: 'pointer',
                color: C.ink, fontSize: 15, fontWeight: 600, fontFamily: 'inherit',
              }}
            >
              Retour
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
