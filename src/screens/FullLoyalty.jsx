import { useState, useRef } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import TabBar from '../components/TabBar.jsx'
import { C } from '../tokens.js'
import { useApp } from '../context/AppContext.jsx'

const LEVELS = [
  {
    id: 'sable', emoji: '🏖', name: 'Sable', range: '0 – 99 pts',
    gradient: 'linear-gradient(135deg,#E8E4DC,#C8C3B8)', textColor: C.ink,
    benefits: ['Accès aux Coops standard', 'Application gratuite', 'Support client'],
    prev: 0, next: 100,
  },
  {
    id: 'coral', emoji: '🪸', name: 'Coral', range: '100 – 499 pts',
    gradient: 'linear-gradient(135deg,#FFB39A,#FF5A5F)', textColor: '#fff',
    benefits: ['5€ offerts à chaque parrainage', 'Accès anticipé 24h avant', 'Coops "Tour de l\'archipel" exclusif'],
    prev: 100, next: 500,
  },
  {
    id: 'turquoise', emoji: '🌊', name: 'Turquoise', range: '500 – 999 pts',
    gradient: 'linear-gradient(135deg,#5BB8E2,#0E8C7E)', textColor: '#fff',
    benefits: ['Double points le week-end', 'Coops partenaires premium', 'Invitation événements Coopers'],
    prev: 500, next: 1000,
  },
  {
    id: 'lagon', emoji: '⛵', name: 'Lagon', range: '1 000+ pts',
    gradient: 'linear-gradient(135deg,#FFE9B0,#F4C24A)', textColor: C.ink,
    benefits: ['Coops offert chaque mois', 'Accès illimité tous niveaux', 'Statut VIP commerçants', 'Conciergerie Coopers'],
    prev: 1000, next: Infinity,
  },
]

const EARN = [
  { emoji: '🎫', action: 'Coops utilisé',            pts: '+10 pts' },
  { emoji: '⭐', action: 'Avis laissé',             pts: '+20 pts' },
  { emoji: '🤝', action: 'Parrainage accepté',       pts: '+50 pts' },
  { emoji: '🌅', action: 'Premier Coops du mois',    pts: '+15 pts' },
  { emoji: '🎂', action: 'Anniversaire',             pts: '+100 pts' },
]

const EXCHANGE = [
  { id: 1, title: 'Balade Catamaran -30%',           commerce: 'Catamaran Évasion', cost: 20,  emoji: '⛵', gradient: 'linear-gradient(135deg,#BAE6FD,#0284C7)', category: 'Nautique', zone: 'Grande-Terre' },
  { id: 2, title: 'Massage Spa Karukera -25%',        commerce: 'Spa Karukera',      cost: 50,  emoji: '💆', gradient: 'linear-gradient(135deg,#E8B4F8,#9B59B6)', category: 'Beauté',   zone: 'Grande-Terre' },
  { id: 3, title: 'Entrée Parc des Mamelles',        commerce: 'Parc des Mamelles', cost: 80,  emoji: '🌿', gradient: 'linear-gradient(135deg,#A8E6CF,#2E7D32)', category: 'Nature & Parcs', zone: 'Basse-Terre' },
  { id: 4, title: 'Dîner Le Tropicana -20%',          commerce: 'Le Tropicana',      cost: 120, emoji: '🍽️', gradient: 'linear-gradient(135deg,#FFE9B0,#F4C24A)', category: 'Restaurants', zone: 'Grande-Terre' },
  { id: 5, title: 'Cours de plongée Aqua Plongée',   commerce: 'Aqua Plongée',      cost: 200, emoji: '🤿', gradient: 'linear-gradient(135deg,#5BB8E2,#0E8C7E)', category: 'Nautique', zone: 'Grande-Terre' },
]

function getLevel(pts) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (pts >= LEVELS[i].prev) return { ...LEVELS[i], idx: i }
  }
  return { ...LEVELS[0], idx: 0 }
}

export default function FullLoyalty({ navigate, handleTab }) {
  const { user, deductPoints, activateCoops } = useApp()
  const scrollRef = useRef(null)
  const [phase, setPhase] = useState('list') // 'list' | 'confirm' | 'success' | 'cancelled'
  const [selectedOffer, setSelectedOffer] = useState(null)
  const [toast, setToast] = useState(false)

  const userPts = user.points
  const level = getLevel(userPts)
  const progress = level.next === Infinity ? 1 : (userPts - level.prev) / (level.next - level.prev)
  const toNext = level.next === Infinity ? 0 : level.next - userPts
  const nextLevel = LEVELS[Math.min(level.idx + 1, LEVELS.length - 1)]

  const handleUse = (ex) => {
    setSelectedOffer(ex)
    setPhase('confirm')
  }

  const handleConfirm = () => {
    if (!selectedOffer) return
    deductPoints(selectedOffer.cost)
    activateCoops({
      id: `loyalty-${selectedOffer.id}`,
      commerce: selectedOffer.commerce,
      title: selectedOffer.title,
      discount: 0,
      category: selectedOffer.category,
      zone: selectedOffer.zone,
      emoji: selectedOffer.emoji,
      gradient: selectedOffer.gradient,
    })
    setPhase('success')
  }

  const handleCancel = () => {
    setSelectedOffer(null)
    setPhase('list')
    setToast(true)
    setTimeout(() => setToast(false), 2500)
  }

  if (phase === 'confirm' && selectedOffer) {
    const remaining = userPts - selectedOffer.cost
    return (
      <div style={{ width: '100%', height: '100%', background: C.cream, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
        <StatusBar dark />
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '52px 24px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 120 }}>
          <div style={{
            width: 90, height: 90, borderRadius: 24, background: selectedOffer.gradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          }}>
            {selectedOffer.emoji}
          </div>

          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 16, textAlign: 'center', letterSpacing: -0.3 }}>
            {selectedOffer.title}
          </div>
          <div style={{ fontSize: 15, color: C.ocean, fontWeight: 600, marginTop: 6 }}>
            {selectedOffer.commerce}
          </div>

          <div style={{
            marginTop: 28, width: '100%', background: '#fff', borderRadius: 20,
            border: `1px solid ${C.gray200}`, overflow: 'hidden',
          }}>
            {[
              { label: 'Ton solde actuel', val: `${userPts} pts`, color: C.ink },
              { label: 'Coût de cet échange', val: `−${selectedOffer.cost} pts`, color: C.coral },
              { label: 'Il te restera', val: `${remaining} pts`, color: C.ocean, bold: true },
            ].map((row, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 18px',
                borderBottom: i < 2 ? `1px solid ${C.gray100}` : 'none',
              }}>
                <span style={{ fontSize: 14, color: C.gray500 }}>{row.label}</span>
                <span style={{ fontSize: 15, fontWeight: row.bold ? 800 : 700, color: row.color }}>{row.val}</span>
              </div>
            ))}
          </div>

          <div style={{ flex: 1 }} />

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, marginTop: 32 }}>
            <button
              onClick={handleConfirm}
              style={{
                width: '100%', padding: '16px', borderRadius: 16,
                background: C.ocean, border: 'none', cursor: 'pointer',
                color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
                boxShadow: '0 6px 20px rgba(14,140,126,0.3)',
              }}
            >
              ✓ Confirmer l'échange
            </button>
            <button
              onClick={handleCancel}
              style={{
                width: '100%', padding: '14px', borderRadius: 16,
                background: '#fff', border: `1px solid ${C.gray200}`, cursor: 'pointer',
                color: C.ink, fontSize: 15, fontWeight: 600, fontFamily: 'inherit',
              }}
            >
              ← Annuler
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'success' && selectedOffer) {
    return (
      <div style={{ width: '100%', height: '100%', background: C.cream, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
        <StatusBar dark />
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '52px 24px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingBottom: 120 }}>
          <div style={{ fontSize: 72 }}>🎉</div>
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 16, letterSpacing: -0.5 }}>Échange réussi !</div>

          <div style={{ marginTop: 20, width: '100%', background: '#fff', borderRadius: 20, padding: 20, border: `1px solid ${C.gray200}` }}>
            <div style={{ fontSize: 14, color: C.gray500 }}>Tu as obtenu :</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.ink, marginTop: 6, lineHeight: 1.3 }}>
              {selectedOffer.title}
            </div>
            <div style={{ fontSize: 14, color: C.ocean, fontWeight: 600, marginTop: 4 }}>
              chez {selectedOffer.commerce}
            </div>
          </div>

          <div style={{
            marginTop: 14, width: '100%', padding: '14px 18px',
            background: 'rgba(14,140,126,0.08)', borderRadius: 16,
            border: '1px solid rgba(14,140,126,0.2)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ fontSize: 24 }}>💎</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.ocean }}>Points restants : {user.points} pts</div>
              <div style={{ fontSize: 12, color: C.gray500, marginTop: 2 }}>Tu peux retrouver ce Coops dans ton portefeuille</div>
            </div>
          </div>

          <div style={{ flex: 1 }} />

          <button
            onClick={() => navigate('mycoops')}
            style={{
              marginTop: 32, width: '100%', padding: '16px', borderRadius: 16,
              background: C.ocean, border: 'none', cursor: 'pointer',
              color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
              boxShadow: '0 6px 20px rgba(14,140,126,0.3)',
            }}
          >
            Voir mon Coops
          </button>
          <button
            onClick={() => setPhase('list')}
            style={{
              marginTop: 10, width: '100%', padding: '14px', borderRadius: 16,
              background: '#fff', border: `1px solid ${C.gray200}`, cursor: 'pointer',
              color: C.ink, fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
            }}
          >
            Continuer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%', background: C.cream, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar dark />

      {/* Toast notification */}
      {toast && (
        <div style={{
          position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)',
          padding: '10px 20px', borderRadius: 999, zIndex: 100,
          background: C.ink, color: '#fff', fontSize: 13, fontWeight: 600,
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)', whiteSpace: 'nowrap',
        }}>
          Échange annulé
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 120 }}>

        {/* Immersive hero */}
        <div style={{
          background: level.id === 'coral' ? 'linear-gradient(160deg,#FFB39A 0%,#FF5A5F 50%,#C73843 100%)' :
                      level.id === 'turquoise' ? 'linear-gradient(160deg,#5BB8E2 0%,#0E8C7E 100%)' :
                      level.id === 'lagon' ? 'linear-gradient(160deg,#FFE9B0 0%,#F4C24A 100%)' :
                      'linear-gradient(160deg,#E8E4DC 0%,#C8C3B8 100%)',
          padding: '52px 22px 26px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: 100, background: 'rgba(255,255,255,0.1)', pointerEvents: 'none' }} />

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.2)', marginBottom: 12 }}>
            <span style={{ fontSize: 14 }}>{level.emoji}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: 0.5, textTransform: 'uppercase' }}>Niveau {level.name}</span>
          </div>

          <div style={{ color: '#fff' }}>
            <div style={{ fontSize: 13, fontWeight: 500, opacity: 0.9 }}>Bonjour, {user.firstName} 👋</div>
            <div style={{
              marginTop: 4,
              fontFamily: '"Instrument Serif", Georgia, serif',
              fontSize: 44, fontStyle: 'italic', letterSpacing: -1, lineHeight: 1,
            }}>
              {userPts.toLocaleString('fr-FR')} pts
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.85)', marginBottom: 8, fontWeight: 600 }}>
              <span>{level.name} {level.emoji}</span>
              {level.next !== Infinity && <span>{nextLevel.name} {nextLevel.emoji} — {level.next.toLocaleString('fr-FR')} pts</span>}
              {level.next === Infinity && <span>Niveau maximum !</span>}
            </div>
            <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.25)', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(progress * 100, 100)}%`, height: '100%', background: '#fff', borderRadius: 4 }} />
            </div>
            {level.next !== Infinity && (
              <div style={{ marginTop: 8, fontSize: 12, color: 'rgba(255,255,255,0.9)' }}>
                Encore <strong>{toNext} points</strong> pour atteindre {nextLevel.name}
              </div>
            )}
          </div>

          <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
            {[
              { label: 'Coops utilisés', val: String(user.coopsUsed || 0) },
              { label: 'Économisé',      val: `${(user.totalSaved || 0).toFixed(0)} €` },
              { label: 'Parrainages',    val: String(Array.isArray(user.referrals) ? user.referrals.length : 0) },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center', padding: '10px 4px', borderRadius: 12, background: 'rgba(255,255,255,0.15)' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{s.val}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', marginTop: 2, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Level cards */}
        <div style={{ paddingTop: 22, paddingBottom: 4 }}>
          <div style={{ padding: '0 20px 12px', fontSize: 17, fontWeight: 700, letterSpacing: -0.3 }}>
            Les niveaux Coopers
          </div>
          <div ref={scrollRef} style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '0 20px 8px' }}>
            {LEVELS.map((lv, i) => {
              const isCurrent = lv.id === level.id
              return (
                <div key={lv.id} style={{
                  flexShrink: 0, width: 200, borderRadius: 20, overflow: 'hidden',
                  background: lv.gradient,
                  boxShadow: isCurrent ? '0 8px 24px rgba(255,90,95,0.35)' : '0 4px 12px rgba(0,0,0,0.08)',
                  position: 'relative',
                }}>
                  {isCurrent && (
                    <div style={{
                      position: 'absolute', top: 10, right: 10,
                      padding: '3px 8px', borderRadius: 999,
                      background: 'rgba(255,255,255,0.9)',
                      fontSize: 9, fontWeight: 800, color: C.coral, letterSpacing: 0.4,
                    }}>
                      VOTRE NIVEAU
                    </div>
                  )}
                  <div style={{ padding: '18px 16px 16px' }}>
                    <div style={{ fontSize: 32 }}>{lv.emoji}</div>
                    <div style={{ marginTop: 8, fontSize: 20, fontWeight: 800, color: lv.textColor, letterSpacing: -0.3 }}>
                      {lv.name}
                    </div>
                    <div style={{ fontSize: 11, color: lv.textColor, opacity: 0.75, marginTop: 2, fontWeight: 600 }}>
                      {lv.range}
                    </div>
                    <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {lv.benefits.map((b, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                          <span style={{ fontSize: 10, color: lv.textColor, opacity: 0.9, marginTop: 1, flexShrink: 0 }}>✓</span>
                          <span style={{ fontSize: 11, color: lv.textColor, opacity: 0.9, lineHeight: 1.4 }}>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* How to earn points */}
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.3, marginBottom: 14 }}>
            Comment gagner des points
          </div>
          <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: `1px solid ${C.gray200}` }}>
            {EARN.map((e, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                borderBottom: i < EARN.length - 1 ? `1px solid ${C.gray100}` : 'none',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: C.gray100,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}>
                  {e.emoji}
                </div>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{e.action}</div>
                <div style={{
                  padding: '4px 10px', borderRadius: 999,
                  background: 'rgba(14,140,126,0.1)', color: C.ocean, fontSize: 12, fontWeight: 800,
                }}>
                  {e.pts}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exchange points */}
        <div style={{ padding: '22px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.3 }}>Échanger mes points</div>
            <div style={{ fontSize: 13, color: C.ocean, fontWeight: 700 }}>{userPts} pts disponibles</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {EXCHANGE.map(ex => {
              const canUse = userPts >= ex.cost
              const missing = ex.cost - userPts
              return (
                <div key={ex.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px', background: '#fff', borderRadius: 16,
                  border: `1px solid ${canUse ? C.gray200 : C.gray100}`,
                  opacity: canUse ? 1 : 0.55,
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                    background: ex.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                  }}>
                    {ex.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>{ex.title}</div>
                    <div style={{ fontSize: 12, color: C.gray500, marginTop: 1 }}>{ex.commerce}</div>
                    <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{
                        display: 'inline-block',
                        padding: '2px 8px', borderRadius: 999,
                        background: canUse ? 'rgba(14,140,126,0.1)' : C.gray100,
                        color: canUse ? C.ocean : C.gray500,
                        fontSize: 11, fontWeight: 800,
                      }}>
                        {ex.cost} pts
                      </div>
                      {!canUse && (
                        <span style={{ fontSize: 10, color: C.coral, fontWeight: 600 }}>
                          {missing} pts manquants
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => canUse && handleUse(ex)}
                    style={{
                      padding: '8px 12px', borderRadius: 12, flexShrink: 0,
                      background: canUse ? C.ocean : C.gray200,
                      border: 'none', cursor: canUse ? 'pointer' : 'not-allowed',
                      color: canUse ? '#fff' : C.gray400,
                      fontSize: 11, fontWeight: 700, fontFamily: 'inherit',
                      boxShadow: canUse ? '0 3px 10px rgba(14,140,126,0.25)' : 'none',
                    }}
                  >
                    {canUse ? `Utiliser ${ex.cost} pts` : '🔒'}
                  </button>
                </div>
              )
            })}
          </div>

          <button
            onClick={() => navigate('challenges')}
            style={{
              marginTop: 14, width: '100%', padding: '14px', borderRadius: 16,
              background: 'linear-gradient(135deg,rgba(155,89,182,0.08),rgba(155,89,182,0.15))',
              border: '1px solid rgba(155,89,182,0.2)',
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>🏆</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#7B1FA2' }}>Défis du moment</div>
                <div style={{ fontSize: 11, color: C.gray500, marginTop: 1 }}>Gagnez des points bonus</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#7B1FA2', fontWeight: 700 }}>Voir →</div>
          </button>
        </div>
      </div>

      <TabBar active="loyalty" onTab={handleTab} />
    </div>
  )
}
