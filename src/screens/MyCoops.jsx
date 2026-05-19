import { useState } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import TabBar from '../components/TabBar.jsx'
import { C } from '../tokens.js'
import { useApp } from '../context/AppContext.jsx'

const TABS = ['Actifs', 'Utilisés', 'Expirés']


function DeleteModal({ item, onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'flex-end', zIndex: 100,
    }}>
      <div style={{
        width: '100%', background: '#fff', borderRadius: '24px 24px 0 0',
        padding: '24px 20px 40px',
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: C.gray200, margin: '0 auto 20px' }} />
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Supprimer ce Coops ?</div>
        <div style={{ fontSize: 14, color: C.gray500, marginBottom: 24, lineHeight: 1.5 }}>
          <strong style={{ color: C.ink }}>{item.commerce}</strong> — {item.title}
          <br />Cette action est irréversible.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '14px', borderRadius: 14,
              background: '#fff', border: `1px solid ${C.gray200}`,
              color: C.ink, fontSize: 15, fontWeight: 600, fontFamily: 'inherit',
              cursor: 'pointer',
            }}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: '14px', borderRadius: 14,
              background: '#EF4444', border: 'none',
              color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
              cursor: 'pointer',
            }}
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}

function TicketCard({ item, navigate, type = 'active', onDelete }) {
  const isUsed    = type === 'used'
  const isExpired = type === 'expired'

  return (
    <div style={{
      position: 'relative', display: 'flex', alignItems: 'stretch',
      borderRadius: 18, overflow: 'visible',
      boxShadow: isUsed || isExpired
        ? '0 2px 8px rgba(0,0,0,0.05)'
        : '0 4px 16px rgba(0,0,0,0.09)',
      marginBottom: 14,
    }}>
      {/* Left colored panel */}
      <div style={{
        width: 82, flexShrink: 0,
        background: isUsed || isExpired ? C.gray200 : item.gradient,
        borderRadius: '18px 0 0 18px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '16px 6px', position: 'relative',
      }}>
        {isUsed ? (
          <>
            <div style={{ fontSize: 22 }}>✓</div>
            <div style={{ fontSize: 9, fontWeight: 800, color: C.gray500, letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 4, textAlign: 'center' }}>UTILISÉ</div>
          </>
        ) : isExpired ? (
          <>
            <div style={{ fontSize: 18, color: C.gray500 }}>⏱</div>
            <div style={{ fontSize: 9, fontWeight: 800, color: C.gray500, letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 4, textAlign: 'center' }}>EXPIRÉ</div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1 }}>-{item.discount}%</div>
            <div style={{ fontSize: 8, fontWeight: 800, color: 'rgba(255,255,255,0.8)', letterSpacing: 0.6, textTransform: 'uppercase', marginTop: 4 }}>RÉDUCTION</div>
          </>
        )}
      </div>

      {/* Cutout top */}
      <div style={{
        position: 'absolute', left: 70, top: -10,
        width: 22, height: 22, borderRadius: 11,
        background: C.cream, zIndex: 5,
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
      }} />
      {/* Cutout bottom */}
      <div style={{
        position: 'absolute', left: 70, bottom: -10,
        width: 22, height: 22, borderRadius: 11,
        background: C.cream, zIndex: 5,
        boxShadow: 'inset 0 -1px 3px rgba(0,0,0,0.1)',
      }} />

      {/* Dashed separator */}
      <div style={{
        width: 0, borderLeft: '2px dashed rgba(0,0,0,0.08)',
        margin: '14px 0', flexShrink: 0, zIndex: 1,
      }} />

      {/* Right content */}
      <div style={{
        flex: 1, padding: '13px 13px 13px 10px',
        background: isUsed || isExpired ? '#fafafa' : '#fff',
        borderRadius: '0 18px 18px 0',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: isUsed || isExpired ? C.gray500 : C.ink, lineHeight: 1.2 }}>
            {item.commerce}
          </div>
          {type === 'active' && onDelete && (
            <button
              onClick={() => onDelete(item)}
              style={{
                flexShrink: 0, width: 24, height: 24, borderRadius: 12,
                background: 'rgba(239,68,68,0.1)', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, color: '#EF4444',
              }}
            >🗑</button>
          )}
        </div>
        <div style={{ fontSize: 11, color: C.ocean, fontWeight: 600, marginTop: 3, lineHeight: 1.3 }}>
          {item.title}
        </div>

        {type === 'active' && (
          <>
            <div style={{ marginTop: 8, fontSize: 11, color: item.urgent ? C.coral : C.gray500, fontWeight: item.urgent ? 700 : 500 }}>
              {item.urgent ? '⚠️ ' : ''}Expire le {item.expires}
            </div>
            {/* Promo code */}
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '5px 10px', borderRadius: 8,
                background: C.gray100, border: `1px dashed ${C.gray400}`,
              }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: C.ink, fontFamily: 'monospace' }}>
                  {item.code}
                </span>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(item.code)}
                style={{
                  padding: '5px 10px', borderRadius: 8,
                  background: C.ink, border: 'none', cursor: 'pointer',
                  fontSize: 10, fontWeight: 700, color: '#fff', fontFamily: 'inherit',
                }}>
                Copier
              </button>
            </div>
            <button
              onClick={() => navigate('qrfullscreen')}
              style={{
                marginTop: 10, width: '100%', padding: '9px', borderRadius: 10,
                background: 'transparent', border: `1.5px solid ${C.ocean}`,
                color: C.ocean, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Voir le QR code
            </button>
          </>
        )}

        {type === 'used' && (
          <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, color: C.gray500 }}>
              {item.date} · {item.time}
            </div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#F4A24A' }}>
              -{item.savings?.toFixed(2)} €
            </div>
          </div>
        )}

        {type === 'expired' && (
          <div style={{ marginTop: 6, fontSize: 11, color: C.gray500 }}>
            Expiré le {item.date}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyCoops() {
  return (
    <div style={{ padding: '48px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: 48 }}>🌴</div>
      <div style={{ marginTop: 16, fontSize: 17, fontWeight: 700, letterSpacing: -0.3 }}>Pas encore de Coops ici</div>
      <div style={{ marginTop: 8, fontSize: 14, color: C.gray500, lineHeight: 1.5 }}>
        Explorez les offres autour de vous et activez votre premier Coops !
      </div>
    </div>
  )
}

export default function MyCoops({ navigate, handleTab }) {
  const { userCoops, removeUserCoop, user } = useApp()
  const [tab, setTab] = useState(0)
  const [toDelete, setToDelete] = useState(null)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const isExpiredDate = (expiry) => {
    if (!expiry) return false
    const p = expiry.split('/')
    if (p.length !== 3) return false
    return new Date(parseInt(p[2]), parseInt(p[1]) - 1, parseInt(p[0])) < today
  }

  const activeItems = userCoops
    .filter(c => !(c.status === 'utilisé' || c.used) && !isExpiredDate(c.expiry))
    .map(c => ({
      id: c.id, commerce: c.commerce, title: c.offer, discount: c.discount || 25,
      expires: c.expiry, code: c.coopCode || c.promoCode || 'COOPS',
      gradient: c.gradient || 'linear-gradient(140deg,#FFB39A,#FF5A5F)',
      emoji: c.emoji || '🎫', urgent: c.urgent || false,
    }))

  const usedItems = userCoops
    .filter(c => c.status === 'utilisé' || c.used)
    .map(c => ({
      id: c.id, commerce: c.commerce, title: c.offer, discount: c.discount || 25,
      date: c.dateUtilisation || '', time: c.heureUtilisation || '',
      savings: Math.round((c.discount / 100) * 25),
      gradient: c.gradient, emoji: c.emoji,
    }))

  const expiredItems = userCoops
    .filter(c => !(c.status === 'utilisé' || c.used) && isExpiredDate(c.expiry))
    .map(c => ({
      id: c.id, commerce: c.commerce, title: c.offer, discount: c.discount || 25,
      date: c.expiry, gradient: c.gradient, emoji: c.emoji,
    }))

  const lists   = [activeItems, usedItems, expiredItems]
  const types   = ['active', 'used', 'expired']
  const counts  = [activeItems.length, usedItems.length, expiredItems.length]
  const current = lists[tab]

  const totalSaved = usedItems.reduce((s, u) => s + (u.savings || 0), 0)

  const handleDelete = (item) => {
    setToDelete(item)
  }

  const confirmDelete = () => {
    if (toDelete) {
      removeUserCoop(toDelete.id)
      setToDelete(null)
    }
  }

  return (
    <div style={{ width: '100%', height: '100%', background: C.cream, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 120 }}>
        {/* Header */}
        <div style={{ padding: '0 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.4 }}>Mes Coops</div>
          <button onClick={() => navigate('history')} style={{
            fontSize: 13, color: C.gray500, fontWeight: 500,
            background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
          }}>
            Historique
          </button>
        </div>

        {/* Stat pills */}
        <div style={{ padding: '0 20px 20px', display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, padding: '10px 12px', borderRadius: 14, background: 'rgba(14,140,126,0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.ocean }}>{activeItems.length}</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: C.ocean, marginTop: 2 }}>Actifs</div>
          </div>
          <div style={{ flex: 1.4, padding: '10px 12px', borderRadius: 14, background: 'rgba(244,162,74,0.12)', textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#F4A24A' }}>{totalSaved.toFixed(2)} €</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#F4A24A', marginTop: 2 }}>Total économisé</div>
          </div>
          <div style={{ flex: 1, padding: '10px 12px', borderRadius: 14, background: 'rgba(14,140,126,0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.ocean }}>{user?.points ?? 0}</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: C.ocean, marginTop: 2 }}>Points</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ padding: '0 20px', display: 'flex', gap: 8, marginBottom: 16 }}>
          {TABS.map((t, i) => (
            <button
              key={i}
              onClick={() => setTab(i)}
              style={{
                padding: '8px 16px', borderRadius: 999,
                background: tab === i ? C.ink : '#fff',
                border: `1px solid ${tab === i ? C.ink : C.gray200}`,
                color: tab === i ? '#fff' : C.ink,
                fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
                cursor: 'pointer',
              }}
            >
              {t} <span style={{ opacity: 0.7, fontSize: 11 }}>({counts[i]})</span>
            </button>
          ))}
        </div>

        {/* Cards */}
        <div style={{ padding: '0 20px' }}>
          {current.length === 0
            ? <EmptyCoops />
            : current.map(item => (
              <TicketCard
                key={item.id}
                item={item}
                navigate={navigate}
                type={types[tab]}
                onDelete={tab === 0 ? handleDelete : null}
              />
            ))
          }
        </div>
      </div>

      {toDelete && (
        <DeleteModal
          item={toDelete}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}

      <TabBar active="coops" onTab={handleTab} />
    </div>
  )
}
