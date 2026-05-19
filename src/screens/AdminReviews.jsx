import { useState } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import AdminTabBar, { AB, ABKG } from '../components/AdminTabBar.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'
import { useApp } from '../context/AppContext.jsx'

const DEMO_REVIEWS = {
  'Le Rocher de Malendure': [
    { id: 'd1', name: 'Joëlle F.',    rating: 5, comment: 'Vue imprenable sur la mer, poissons ultra frais. Le boudin créole en entrée était divin. On reviendra !',       date: 'il y a 3 jours'   },
    { id: 'd2', name: 'Bertrand M.', rating: 4, comment: 'Très bonne cuisine locale, prix raisonnables. Service un peu lent le samedi mais qualité au rendez-vous.',         date: 'il y a 1 semaine' },
    { id: 'd3', name: 'Nadia S.',    rating: 5, comment: 'Meilleur restaurant de Bouillante ! La langouste grillée et le rhum arrangé maison sont incontournables.',         date: 'il y a 2 semaines' },
    { id: 'd4', name: 'Paul R.',     rating: 3, comment: 'Cadre magnifique mais attente longue. La vivaneau était bien préparée. À retenter un jour de semaine.',              date: 'il y a 1 mois'    },
  ],
}

function Stars({ rating, size = 14 }) {
  return (
    <span style={{ color: '#F4C24A', fontSize: size }}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  )
}

function RatingBar({ label, pct }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
      <span style={{ fontSize: 11, color: C.gray500, width: 8, textAlign: 'right' }}>{label}</span>
      <div style={{ flex: 1, height: 5, borderRadius: 3, background: C.gray200, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: '#F4C24A', borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 10, color: C.gray400, width: 28 }}>{pct}%</span>
    </div>
  )
}

export default function AdminReviews({ navigate, handleAdminTab }) {
  const { adminCommerce, userReviews } = useApp()
  const [filter, setFilter] = useState('all')

  const commerceName = adminCommerce.name
  const demoRevs = DEMO_REVIEWS[commerceName] || DEMO_REVIEWS['Le Rocher de Malendure']
  const liveRevs = (userReviews[commerceName] || []).map(r => ({
    ...r,
    isLive: true,
    date: r.date || "à l'instant",
  }))

  const allReviews = [...liveRevs, ...demoRevs]

  const filtered = filter === 'all' ? allReviews
    : allReviews.filter(r => r.rating === parseInt(filter))

  const avgRating = allReviews.length
    ? (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1)
    : '—'

  // Rating distribution
  const dist = [5, 4, 3, 2, 1].map(star => {
    const count = allReviews.filter(r => r.rating === star).length
    return { star, pct: allReviews.length ? Math.round((count / allReviews.length) * 100) : 0 }
  })

  return (
    <div style={{ width: '100%', height: '100%', background: ABKG, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '0 16px', paddingBottom: 120 }}>
        {/* Header */}
        <div style={{ paddingBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('admindashboard')} style={{
            width: 38, height: 38, borderRadius: 19, background: '#fff',
            border: `1px solid ${C.gray200}`, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon d={ICONS.chevL} size={18} stroke={C.ink} sw={2} />
          </button>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.3 }}>Avis clients ⭐</div>
            <div style={{ fontSize: 12, color: C.gray500, marginTop: 1 }}>{commerceName}</div>
          </div>
        </div>

        {/* Summary card */}
        <div style={{
          background: '#fff', borderRadius: 18, padding: '18px', marginBottom: 16,
          border: `1px solid ${C.gray200}`,
          display: 'flex', gap: 16, alignItems: 'center',
        }}>
          <div style={{ textAlign: 'center', minWidth: 64 }}>
            <div style={{ fontSize: 40, fontWeight: 900, color: C.ink, letterSpacing: -2, lineHeight: 1 }}>{avgRating}</div>
            <div style={{ fontSize: 18, color: '#F4C24A', marginTop: 2 }}>{'★'.repeat(Math.round(parseFloat(avgRating) || 0))}</div>
            <div style={{ fontSize: 11, color: C.gray500, marginTop: 2 }}>{allReviews.length} avis</div>
          </div>
          <div style={{ flex: 1 }}>
            {dist.map(d => <RatingBar key={d.star} label={d.star} pct={d.pct} />)}
          </div>
        </div>

        {/* Info banner */}
        <div style={{
          padding: '10px 14px', borderRadius: 12, marginBottom: 16,
          background: `rgba(37,99,235,0.06)`, border: `1px solid rgba(37,99,235,0.15)`,
          fontSize: 12, color: AB, fontWeight: 600,
        }}>
          ℹ️ Les avis sont en lecture seule. Répondez à vos clients en les contactant directement.
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {['all', '5', '4', '3', '2', '1'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 14px', borderRadius: 999, flexShrink: 0,
                background: filter === f ? AB : '#fff',
                color: filter === f ? '#fff' : C.gray500,
                border: `1px solid ${filter === f ? AB : C.gray200}`,
                fontSize: 12, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
              }}
            >
              {f === 'all' ? 'Tous' : `${f}★`}
            </button>
          ))}
        </div>

        {/* Review cards */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 40 }}>💬</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.ink, marginTop: 12 }}>Aucun avis pour ce filtre</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(review => (
              <div key={review.id} style={{
                background: review.isLive ? 'rgba(14,140,126,0.04)' : '#fff',
                borderRadius: 16, padding: '14px',
                border: `1px solid ${review.isLive ? 'rgba(14,140,126,0.2)' : C.gray200}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 19, flexShrink: 0,
                    background: review.isLive ? 'rgba(14,140,126,0.12)' : `${AB}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 15, fontWeight: 800, color: review.isLive ? C.ocean : AB,
                  }}>
                    {(review.name || '?')[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{review.name}</div>
                      <div style={{ fontSize: 10, color: C.gray400 }}>{review.date}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      <Stars rating={review.rating} size={12} />
                      <span style={{
                        fontSize: 9, fontWeight: 800, padding: '1px 6px', borderRadius: 999,
                        background: review.isLive ? 'rgba(14,140,126,0.1)' : C.gray100,
                        color: review.isLive ? C.ocean : C.gray500,
                      }}>
                        Via Coopers
                      </span>
                    </div>
                    {review.comment ? (
                      <div style={{ marginTop: 8, fontSize: 13, color: C.gray500, lineHeight: 1.5 }}>
                        {review.comment}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AdminTabBar active="admincommerce" onTab={handleAdminTab} />
      <HomeIndicator />
    </div>
  )
}
