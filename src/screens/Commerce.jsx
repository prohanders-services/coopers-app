import { useState } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import IOSGlassPill from '../components/IOSGlassPill.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'
import { useApp } from '../context/AppContext.jsx'

const TABS = ['Coops disponibles', 'Avis', 'Infos pratiques']

const coops = [
  {
    id: 1, title: 'Brunch dominical face à la mer',
    desc: 'Formule complète avec jus de fruits frais, viennoiseries et plat chaud',
    discount: 25, price: '18 €', isFidelite: false, expires: '31 mai',
  },
  {
    id: 2, title: 'Déjeuner créole en amoureux',
    desc: 'Menu 2 personnes : entrée, plat, dessert, boissons incluses',
    discount: 20, price: '45 €', isFidelite: true, expires: '15 juin',
  },
  {
    id: 3, title: '-15% sur toute la carte (midi)',
    desc: 'Valable du lundi au vendredi, 12h–14h30',
    discount: 15, price: 'Sur la carte', isFidelite: false, expires: '30 juin',
  },
]

const reviews = [
  { id: 1, name: 'Marie T.',  rating: 5, date: 'il y a 3 jours',  comment: 'Vue magnifique, cuisine délicieuse ! Le brunch était parfait, service attentionné. On reviendra sans hésiter.' },
  { id: 2, name: 'Luc B.',    rating: 4, date: 'il y a 1 semaine', comment: 'Très bonne expérience, les produits sont frais et locaux. Légèrement d\'attente mais ça vaut la peine.' },
  { id: 3, name: 'Nadia P.',  rating: 5, date: 'il y a 2 semaines',comment: 'Le meilleur brunch de Guadeloupe ! Cadre exceptionnel directement sur la plage. Réservation recommandée.' },
]

const hours = [
  { day: 'Lundi',    h: 'Fermé' },
  { day: 'Mardi',    h: '07h00 – 15h00' },
  { day: 'Mercredi', h: '07h00 – 15h00' },
  { day: 'Jeudi',    h: '07h00 – 15h00' },
  { day: 'Vendredi', h: '07h00 – 16h00' },
  { day: 'Samedi',   h: '07h00 – 17h00' },
  { day: 'Dimanche', h: '07h00 – 17h00' },
]

function Stars({ v, size = 13 }) {
  return <span style={{ color: '#F4C24A', fontSize: size }}>{'★'.repeat(v)}</span>
}

function CoopsTab({ navigate }) {
  const { activateCoops } = useApp()
  const [phase, setPhase] = useState('list') // 'list' | 'success' | 'duplicate'
  const [activatedData, setActivatedData] = useState(null)

  const handleGet = (c) => {
    const result = activateCoops({
      id: `karacoli-${c.id}`,
      commerce: 'Karacoli Beach',
      title: c.title,
      discount: c.discount,
      category: 'Restaurants',
      zone: 'Grande-Terre',
      emoji: '🥐',
      gradient: 'linear-gradient(160deg, #FFB39A 0%, #FF5A5F 60%, #C73843 100%)',
    })
    if (result.isDuplicate) {
      setPhase('duplicate')
    } else {
      setActivatedData({ title: c.title, expiry: result.expiryStr })
      setPhase('success')
    }
  }

  if (phase === 'success' && activatedData) {
    return (
      <div style={{ padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: 64 }}>🎟️</div>
        <div style={{ fontSize: 22, fontWeight: 800, marginTop: 12, letterSpacing: -0.3 }}>Coops activé !</div>
        <div style={{ fontSize: 15, color: C.ocean, fontWeight: 600, marginTop: 6 }}>Karacoli Beach</div>
        <div style={{ fontSize: 13, color: C.gray500, marginTop: 4, lineHeight: 1.4 }}>{activatedData.title}</div>
        <div style={{
          marginTop: 20, width: '100%', padding: '16px',
          background: C.cream, borderRadius: 16, border: `1px solid ${C.gray200}`,
          textAlign: 'left',
        }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>📍 Rendez-vous chez Karacoli Beach</div>
          <div style={{ fontSize: 12, color: C.gray500, marginTop: 4 }}>avant le {activatedData.expiry}</div>
          <div style={{ fontSize: 12, color: C.ocean, marginTop: 8, fontWeight: 600 }}>⭐ +10 pts crédités lors de l'utilisation</div>
        </div>
        <button
          onClick={() => navigate('mycoops')}
          style={{
            marginTop: 20, width: '100%', padding: '14px', borderRadius: 14,
            background: C.ocean, border: 'none', cursor: 'pointer',
            color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
          }}
        >
          Voir mon Coops
        </button>
        <button
          onClick={() => setPhase('list')}
          style={{
            marginTop: 10, width: '100%', padding: '13px', borderRadius: 14,
            background: '#fff', border: `1px solid ${C.gray200}`, cursor: 'pointer',
            color: C.ink, fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
          }}
        >
          Continuer à explorer
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14, position: 'relative' }}>
      {phase === 'duplicate' && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end',
        }}>
          <div style={{
            width: '100%', background: '#fff', borderRadius: '24px 24px 0 0',
            padding: '28px 24px 40px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🎟️</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.ink, marginBottom: 8 }}>
              Ce Coops est déjà dans ton portefeuille !
            </div>
            <div style={{ fontSize: 14, color: C.gray500, marginBottom: 24 }}>
              Tu as déjà activé cette offre. Retrouve-la dans Mes Coops.
            </div>
            <button
              onClick={() => { setPhase('list'); navigate('mycoops') }}
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
              onClick={() => setPhase('list')}
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
      {coops.map(c => (
        <div key={c.id} style={{
          background: C.cream, borderRadius: 16, padding: 16,
          border: `1px solid ${C.gray200}`, position: 'relative',
        }}>
          {c.isFidelite && (
            <div style={{
              position: 'absolute', top: 12, right: 12,
              padding: '3px 8px', borderRadius: 999,
              background: '#F4C24A', color: C.ink, fontSize: 10, fontWeight: 700, letterSpacing: 0.3,
            }}>
              COOPS EXCLUSIF ⭐
            </div>
          )}
          <div style={{ fontSize: 15, fontWeight: 700, color: C.ink, paddingRight: c.isFidelite ? 110 : 0, lineHeight: 1.3 }}>
            {c.title}
          </div>
          <div style={{ marginTop: 6, fontSize: 13, color: C.gray500, lineHeight: 1.4 }}>{c.desc}</div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <div style={{
                padding: '4px 10px', borderRadius: 999,
                background: C.coral, color: '#fff', fontSize: 13, fontWeight: 800,
              }}>
                -{c.discount}%
              </div>
              <div style={{ fontSize: 13, color: C.gray500 }}>à partir de {c.price}</div>
            </div>
            <div style={{ fontSize: 11, color: C.gray500 }}>⏳ {c.expires}</div>
          </div>
          <button
            onClick={() => handleGet(c)}
            style={{
              marginTop: 12, width: '100%', padding: '11px', borderRadius: 12,
              background: C.coral, border: 'none', cursor: 'pointer',
              color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
              boxShadow: '0 4px 12px rgba(255,90,95,0.25)',
            }}
          >
            Obtenir ce Coops
          </button>
        </div>
      ))}
    </div>
  )
}

function ReviewsTab() {
  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
  return (
    <div style={{ padding: '16px 20px' }}>
      {/* Summary */}
      <div style={{
        padding: '16px', borderRadius: 16, background: C.cream,
        border: `1px solid ${C.gray200}`, marginBottom: 16,
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>{avg}</div>
          <Stars v={5} size={14} />
          <div style={{ fontSize: 11, color: C.gray500, marginTop: 2 }}>{reviews.length} avis</div>
        </div>
        <div style={{ flex: 1 }}>
          {[5, 4, 3].map(n => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{ fontSize: 11, color: C.gray500, width: 8 }}>{n}</div>
              <div style={{ flex: 1, height: 4, borderRadius: 2, background: C.gray200, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 2, background: '#F4C24A',
                  width: n === 5 ? '70%' : n === 4 ? '20%' : '10%',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {reviews.map(r => (
        <div key={r.id} style={{
          padding: '14px', background: '#fff', borderRadius: 14,
          border: `1px solid ${C.gray200}`, marginBottom: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 16,
                background: `linear-gradient(135deg, ${C.coralLight}, ${C.coral})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 12, fontWeight: 700,
              }}>
                {r.name[0]}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{r.name}</div>
                <div style={{ fontSize: 11, color: C.gray500 }}>{r.date}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Stars v={r.rating} size={12} />
              <div style={{
                padding: '2px 7px', borderRadius: 999,
                background: 'rgba(14,140,126,0.1)', color: C.ocean,
                fontSize: 10, fontWeight: 700,
              }}>
                Via Coopers
              </div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: C.ink, lineHeight: 1.5 }}>{r.comment}</div>
        </div>
      ))}
    </div>
  )
}

function InfosTab() {
  return (
    <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Address */}
      <div style={{ padding: 16, background: '#fff', borderRadius: 16, border: `1px solid ${C.gray200}` }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.gray500, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 10 }}>Adresse</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div style={{ fontSize: 18, marginTop: 1 }}>📍</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Plage de la Grande Anse</div>
            <div style={{ fontSize: 13, color: C.gray500, marginTop: 2 }}>97190 Gosier, Guadeloupe</div>
          </div>
        </div>
      </div>

      {/* Phone */}
      <div style={{ padding: 16, background: '#fff', borderRadius: 16, border: `1px solid ${C.gray200}` }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.gray500, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 10 }}>Contact</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ fontSize: 18 }}>📞</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ocean }}>+590 (0)5 90 84 XX XX</div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 10 }}>
          <div style={{ fontSize: 18 }}>🌐</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ocean }}>www.karacoli-beach.gp</div>
        </div>
      </div>

      {/* Hours */}
      <div style={{ padding: 16, background: '#fff', borderRadius: 16, border: `1px solid ${C.gray200}` }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.gray500, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 10 }}>Horaires</div>
        {hours.map((h, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            paddingBottom: i < hours.length - 1 ? 8 : 0,
            marginBottom: i < hours.length - 1 ? 8 : 0,
            borderBottom: i < hours.length - 1 ? `1px solid ${C.gray100}` : 'none',
          }}>
            <div style={{ fontSize: 13, fontWeight: h.day === 'Dimanche' ? 700 : 500, color: C.ink }}>{h.day}</div>
            <div style={{ fontSize: 13, color: h.h === 'Fermé' ? C.coral : C.ocean, fontWeight: 600 }}>{h.h}</div>
          </div>
        ))}
      </div>

      {/* Payment */}
      <div style={{ padding: 16, background: '#fff', borderRadius: 16, border: `1px solid ${C.gray200}` }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.gray500, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 10 }}>Moyens de paiement</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['💳 Carte', '💵 Espèces', '📱 Sans contact'].map(p => (
            <div key={p} style={{
              padding: '6px 12px', borderRadius: 999,
              background: C.gray100, fontSize: 12, fontWeight: 600, color: C.ink,
            }}>
              {p}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Commerce({ navigate, goBack }) {
  const [tab, setTab] = useState(0)

  return (
    <div style={{ width: '100%', height: '100%', background: '#fff', position: 'relative', overflow: 'hidden', color: C.ink }}>
      <StatusBar dark />

      {/* Hero */}
      <div style={{ position: 'relative', height: 220 }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(160deg, #FFB39A 0%, #FF5A5F 60%, #C73843 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 72,
        }}>
          🥐
        </div>
        {/* Overlay gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,0.25) 0%,transparent 50%)' }} />

        {/* Back + share */}
        <div style={{
          position: 'absolute', top: 52, left: 16, right: 16,
          display: 'flex', justifyContent: 'space-between',
        }}>
          <IOSGlassPill dark style={{ width: 44 }}>
            <button onClick={goBack} style={{
              width: 44, height: 44, background: 'none', border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon d={ICONS.chevL} size={18} stroke="#fff" sw={2} />
            </button>
          </IOSGlassPill>
          <IOSGlassPill dark style={{ width: 44 }}>
            <button style={{
              width: 44, height: 44, background: 'none', border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon d={ICONS.share} size={17} stroke="#fff" sw={1.8} />
            </button>
          </IOSGlassPill>
        </div>

        {/* Logo medallion */}
        <div style={{
          position: 'absolute', bottom: -28, left: 20,
          width: 56, height: 56, borderRadius: 28,
          background: '#fff', border: '3px solid #fff',
          boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26,
        }}>
          🥐
        </div>
      </div>

      <div style={{ height: 'calc(100% - 220px)', overflowY: 'auto' }}>
        {/* Commerce info */}
        <div style={{ padding: '36px 20px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4, lineHeight: 1.1 }}>Karacoli Beach</div>
              <div style={{ marginTop: 3, fontSize: 13, color: C.ocean, fontWeight: 600 }}>Brunch · Restaurant</div>
            </div>
            <div style={{
              padding: '5px 11px', borderRadius: 999,
              background: 'rgba(14,140,126,0.1)', color: C.ocean,
              fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 2,
            }}>
              ● Ouvert
            </div>
          </div>

          {/* Rating row */}
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Stars v={5} size={14} />
            <span style={{ fontSize: 13, fontWeight: 700 }}>4.8</span>
            <span style={{ fontSize: 13, color: C.gray500 }}>(156 avis)</span>
          </div>

          {/* Quick chips */}
          <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['📍 Le Gosier', '📞 +590 5 90…', '⏰ Ferme à 17h'].map(chip => (
              <div key={chip} style={{
                padding: '6px 12px', borderRadius: 999,
                background: C.gray100, fontSize: 12, fontWeight: 500, color: C.ink,
              }}>
                {chip}
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', borderBottom: `2px solid ${C.gray200}`,
          padding: '0 20px', gap: 0,
        }}>
          {TABS.map((t, i) => (
            <button
              key={i}
              onClick={() => setTab(i)}
              style={{
                flex: 1, paddingBottom: 12, background: 'none', border: 'none',
                cursor: 'pointer', fontFamily: 'inherit',
                fontSize: 12, fontWeight: 700,
                color: tab === i ? C.coral : C.gray500,
                borderBottom: `2px solid ${tab === i ? C.coral : 'transparent'}`,
                marginBottom: -2, transition: 'color 0.15s',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 0 && <CoopsTab navigate={navigate} />}
        {tab === 1 && <ReviewsTab />}
        {tab === 2 && <InfosTab />}
      </div>

      <HomeIndicator />
    </div>
  )
}
