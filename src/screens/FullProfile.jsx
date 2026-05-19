import StatusBar from '../components/StatusBar.jsx'
import TabBar from '../components/TabBar.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'
import { useApp } from '../context/AppContext.jsx'

const SECTIONS = [
  {
    title: 'MON COMPTE',
    rows: [
      { emoji: '👤', label: 'Modifier mes informations', to: 'editprofile'    },
      { emoji: '📍', label: 'Modifier ma zone',          to: 'zone'           },
      { emoji: '❤️', label: 'Modifier mes catégories',   to: 'editcats', detailFn: (u) => `${u.categories?.size || 0} sélectionnées` },
      { emoji: '🔑', label: 'Changer mon mot de passe',  to: 'security'       },
      { emoji: '🔔', label: 'Gérer mes notifications',   to: 'notifsettings'  },
    ],
  },
  {
    title: 'MES ACTIVITÉS',
    rows: [
      { emoji: '📋', label: 'Mon historique complet',     to: 'history'     },
      { emoji: '💰', label: 'Mes économies détaillées',   to: 'savings'     },
      { emoji: '🏅', label: 'Programme fidélité',         to: 'fullloyalty' },
      { emoji: '🤝', label: 'Mes parrainages',            to: 'referral'    },
    ],
  },
  {
    title: 'AIDE & COMMUNAUTÉ',
    rows: [
      { emoji: '💡', label: 'Suggérer un commerce',       to: 'suggest'  },
      { emoji: '❓', label: 'FAQ & Aide',                 to: 'faq'      },
      { emoji: '💬', label: 'Nous contacter',             to: 'faq'      },
      { emoji: '📄', label: 'CGU & Confidentialité',      to: 'settings' },
    ],
  },
]

function Row({ emoji, label, detail, color, onPress }) {
  return (
    <button
      onClick={onPress}
      style={{
        display: 'flex', alignItems: 'center', padding: '13px 16px',
        background: 'none', border: 'none', cursor: 'pointer',
        width: '100%', fontFamily: 'inherit', textAlign: 'left',
      }}
    >
      <div style={{
        width: 34, height: 34, borderRadius: 9, flexShrink: 0,
        background: C.gray100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, marginRight: 13,
      }}>
        {emoji}
      </div>
      <div style={{ flex: 1, fontSize: 15, fontWeight: 500, color: color || C.ink }}>{label}</div>
      {detail && <div style={{ fontSize: 13, color: C.gray500, marginRight: 6 }}>{detail}</div>}
      <Icon d={ICONS.chevR} size={14} stroke={color || C.gray400} sw={2} />
    </button>
  )
}

export default function FullProfile({ navigate, resetTo, handleTab }) {
  const { user, logout, userCoops, favorites, setCurrentOffer, offers: OFFERS } = useApp()
  const favoriteOffers = OFFERS.filter(o => favorites.has(o.id))

  const goToOffer = (offer) => {
    setCurrentOffer(offer)
    navigate('offer')
  }

  const handleLogout = () => {
    logout()
    resetTo('login')
  }

  return (
    <div style={{ width: '100%', height: '100%', background: C.cream, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar dark />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 120 }}>
        {/* Gradient hero header */}
        <div style={{
          background: 'linear-gradient(160deg,#FFB39A 0%,#FF5A5F 50%,#C73843 100%)',
          padding: '52px 22px 26px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -50, right: -50, width: 160, height: 160, borderRadius: 80, background: 'rgba(255,255,255,0.1)', pointerEvents: 'none' }} />

          {/* Top row: title + edit + notifications */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: -0.4 }}>Profil</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => navigate('notifications')}
                style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Icon d={ICONS.bell} size={16} stroke="#fff" />
              </button>
              <button
                onClick={() => navigate('settings')}
                style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Profile photo + info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => navigate('editprofile')}
                style={{
                  width: 72, height: 72, borderRadius: 36,
                  background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)',
                  border: '2.5px solid rgba(255,255,255,0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 30, fontWeight: 700, color: '#fff',
                  fontFamily: '"Instrument Serif", serif', fontStyle: 'italic',
                  cursor: 'pointer',
                }}
              >
                {user.firstName?.charAt(0).toUpperCase() || '?'}
              </button>
              <div style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 22, height: 22, borderRadius: 11,
                background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11,
              }}>
                ✏️
              </div>
            </div>
            <div style={{ color: '#fff' }}>
              <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.3 }}>{user.firstName} {user.lastName}</div>
              <div style={{ fontSize: 13, opacity: 0.9, marginTop: 2 }}>{user.email}</div>
              <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                <div style={{ padding: '3px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.22)', fontSize: 11, fontWeight: 700 }}>
                  🪸 Coral
                </div>
                <div style={{ padding: '3px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.22)', fontSize: 11, fontWeight: 700 }}>
                  📍 {user.zone}
                </div>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div style={{ marginTop: 20, display: 'flex', background: 'rgba(255,255,255,0.15)', borderRadius: 14, overflow: 'hidden' }}>
            {[
              { v: String(userCoops.length),                        l: 'Coops activés' },
              { v: `${(user.totalSaved || 0)} €`,                   l: 'Économisé'     },
              { v: user.points.toLocaleString('fr'),                l: 'Points'        },
            ].map((s, i) => (
              <div key={i} style={{
                flex: 1, textAlign: 'center', padding: '12px 4px',
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.2)' : 'none',
              }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: -0.3 }}>{s.v}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', marginTop: 2, fontWeight: 600 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mes Favoris */}
        {favoriteOffers.length > 0 && (
          <div style={{ padding: '18px 20px 0' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>
              MES FAVORIS ❤️
            </div>
            <div style={{
              display: 'flex', gap: 10,
              overflowX: 'scroll', scrollbarWidth: 'none', msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              marginLeft: -20, marginRight: -20,
              paddingLeft: 20, paddingRight: 20, paddingBottom: 4,
            }}>
              {favoriteOffers.map(offer => (
                <button
                  key={offer.id}
                  onClick={() => goToOffer(offer)}
                  style={{
                    flexShrink: 0, width: 120, background: '#fff', borderRadius: 16,
                    border: 'none', cursor: 'pointer', overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', fontFamily: 'inherit',
                  }}
                >
                  <div style={{ height: 76, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '100%', background: offer.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{offer.emoji}</div>
                    {offer.imageUrl && (
                      <img src={offer.imageUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.currentTarget.style.display = 'none' }}
                      />
                    )}
                    <div style={{ position: 'absolute', top: 6, right: 6, padding: '2px 7px', borderRadius: 999, background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: 10, fontWeight: 700 }}>-{offer.discount}%</div>
                  </div>
                  <div style={{ padding: '8px 10px 10px', textAlign: 'left' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.ink, lineHeight: 1.2 }}>{offer.commerce}</div>
                    <div style={{ marginTop: 2, fontSize: 10, color: C.gray500 }}>{offer.category}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sections */}
        <div style={{ padding: '18px 20px 0' }}>
          {SECTIONS.map((section, si) => (
            <div key={si} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>
                {section.title}
              </div>
              <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: `1px solid ${C.gray200}` }}>
                {section.rows.map((row, ri) => (
                  <div key={ri} style={{ borderBottom: ri < section.rows.length - 1 ? `1px solid ${C.gray100}` : 'none' }}>
                    <Row
                      emoji={row.emoji}
                      label={row.label}
                      detail={row.detailFn ? row.detailFn(user) : undefined}
                      onPress={() => navigate(row.to)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Member since — above logout */}
          <div style={{ textAlign: 'center', fontSize: 12, color: C.gray400, marginBottom: 16 }}>
            {(() => {
              if (user.createdAt) {
                const d = new Date(user.createdAt)
                return `Membre depuis ${d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })} · v1.0.0`
              }
              return 'Membre depuis mars 2025 · v1.0.0'
            })()}
          </div>

          {/* Logout */}
          <button onClick={handleLogout} style={{
            width: '100%', padding: '15px', borderRadius: 16,
            background: 'rgba(255,90,95,0.08)', border: `1px solid rgba(255,90,95,0.2)`,
            color: C.coral, fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
            cursor: 'pointer', marginBottom: 8,
          }}>
            Se déconnecter
          </button>
        </div>
      </div>

      <TabBar active="profile" onTab={handleTab} />
    </div>
  )
}
