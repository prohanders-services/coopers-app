import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'
import { useApp } from '../context/AppContext.jsx'

const MONTH_SHORT = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

const CAT_COLORS = {
  'Restaurants': '#009B8D', 'Beauté': '#7B1FA2', 'Nautique': '#1565C0',
  'Nature': '#2E7D32', 'Shopping': '#F39C12', 'Bars & Sorties': '#F59E0B',
  'Sport': '#059669', 'Culture': '#8B5CF6', 'Gastronomie': '#E11D48',
}
const CAT_EMOJI = {
  'Restaurants': '🍽️', 'Beauté': '💆', 'Nautique': '🤿',
  'Nature': '🌿', 'Shopping': '🛍️', 'Bars & Sorties': '🎉',
  'Sport': '🏋️', 'Culture': '🎭', 'Gastronomie': '🍴',
}

function parseFrDate(str) {
  if (!str) return null
  const p = str.split('/')
  if (p.length < 3) return null
  return new Date(parseInt(p[2]), parseInt(p[1]) - 1, parseInt(p[0]))
}

function buildCatBreakdown(history) {
  const cats = {}
  let total = 0
  for (const e of history) {
    const cat = e.cat || e.category || 'Autre'
    cats[cat] = (cats[cat] || 0) + (e.saved || 0)
    total += e.saved || 0
  }
  if (total === 0) return []
  return Object.entries(cats)
    .map(([label, amount]) => ({
      label, amount,
      pct: Math.round((amount / total) * 100),
      color: CAT_COLORS[label] || C.gray500,
      emoji: CAT_EMOJI[label] || '🏷️',
    }))
    .sort((a, b) => b.amount - a.amount)
}

function buildTopCommerces(history) {
  const map = {}
  for (const e of history) {
    if (!e.commerce) continue
    if (!map[e.commerce]) {
      map[e.commerce] = { name: e.commerce, visits: 0, total: 0, emoji: e.emoji || '🏪', gradient: e.gradient || 'linear-gradient(135deg,#FFB39A,#FF5A5F)' }
    }
    map[e.commerce].visits++
    map[e.commerce].total += e.saved || 0
  }
  return Object.values(map)
    .sort((a, b) => b.total - a.total)
    .slice(0, 3)
    .map((tc, i) => ({ ...tc, rank: i + 1 }))
}

function buildMonthly(history) {
  const map = {}
  for (const e of history) {
    const d = parseFrDate(e.dateObtained)
    if (!d) continue
    const key = `${MONTH_SHORT[d.getMonth()]} ${d.getFullYear()}`
    if (!map[key]) map[key] = { month: key, coops: 0, savings: 0, ts: d.getTime() }
    map[key].coops++
    map[key].savings += e.saved || 0
  }
  return Object.values(map).sort((a, b) => b.ts - a.ts)
}

function EmptySection({ label }) {
  return (
    <div style={{ padding: '20px', textAlign: 'center', color: C.gray400, fontSize: 13, fontWeight: 500 }}>
      {label}
    </div>
  )
}

export default function Savings({ goBack }) {
  const { user } = useApp()

  const history    = Array.isArray(user.history) ? user.history : []
  const totalSaved = user.totalSaved || 0
  const coopsUsed  = user.coopsUsed  || 0

  const catBreakdown  = buildCatBreakdown(history)
  const topCommerces  = buildTopCommerces(history)
  const monthly       = buildMonthly(history)

  return (
    <div style={{ width: '100%', height: '100%', background: C.cream, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '0 20px 40px', paddingBottom: 120 }}>
        {/* Header */}
        <div style={{ paddingBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={goBack} style={{
            width: 38, height: 38, borderRadius: 19, background: '#fff',
            border: `1px solid ${C.gray200}`, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon d={ICONS.chevL} size={18} stroke={C.ink} sw={2} />
          </button>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.4 }}>Mes Économies</div>
        </div>

        {/* Hero total */}
        <div style={{
          borderRadius: 24, padding: '24px', marginBottom: 20,
          background: 'linear-gradient(160deg,#FFB39A 0%,#FF5A5F 100%)',
          color: '#fff', textAlign: 'center', position: 'relative', overflow: 'hidden',
          boxShadow: '0 12px 28px rgba(255,90,95,0.3)',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: 70, background: 'rgba(255,255,255,0.15)', pointerEvents: 'none' }} />
          <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.9, letterSpacing: 0.5, textTransform: 'uppercase' }}>Total économisé depuis le début</div>
          <div style={{
            marginTop: 8,
            fontFamily: '"Instrument Serif", Georgia, serif',
            fontSize: 58, fontStyle: 'italic', letterSpacing: -1.5, lineHeight: 1, fontWeight: 400,
          }}>
            {totalSaved.toFixed(2)} €
          </div>
          <div style={{ marginTop: 8, fontSize: 13, opacity: 0.9 }}>
            sur {coopsUsed} Coops utilisés
          </div>
        </div>

        {/* Motivational message — only when data exists */}
        {totalSaved > 0 && (
          <div style={{
            padding: '16px', borderRadius: 18, marginBottom: 20,
            background: 'rgba(14,140,126,0.08)', border: '1px solid rgba(14,140,126,0.15)',
          }}>
            <div style={{ fontSize: 16 }}>🎉</div>
            <div style={{ marginTop: 8, fontSize: 14, color: C.ocean, fontWeight: 600, lineHeight: 1.45 }}>
              En économisant <strong>{totalSaved.toFixed(0)} €</strong> avec Coopers, vous avancez vers votre prochain bon plan en Guadeloupe !
            </div>
          </div>
        )}

        {/* Empty state — full screen when no history at all */}
        {history.length === 0 && (
          <div style={{ padding: '32px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 52 }}>💰</div>
            <div style={{ marginTop: 16, fontSize: 17, fontWeight: 700, color: C.ink, letterSpacing: -0.3 }}>
              Pas encore d'économies
            </div>
            <div style={{ marginTop: 8, fontSize: 14, color: C.gray500, lineHeight: 1.5 }}>
              Utilisez vos Coops pour commencer à économiser !
            </div>
          </div>
        )}

        {/* By category */}
        {history.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 20, padding: '18px', marginBottom: 20, border: `1px solid ${C.gray200}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 14 }}>
              Par catégorie
            </div>
            {catBreakdown.length === 0 ? (
              <EmptySection label="Aucune donnée par catégorie" />
            ) : catBreakdown.map((cat, i) => (
              <div key={i} style={{ marginBottom: i < catBreakdown.length - 1 ? 12 : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 16 }}>{cat.emoji}</span>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{cat.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: cat.color }}>{cat.amount.toFixed(2)} €</span>
                  <span style={{ fontSize: 11, color: C.gray500, width: 30, textAlign: 'right' }}>{cat.pct}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: C.gray100, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 3, background: cat.color, width: `${cat.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Top 3 */}
        {history.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 20, padding: '18px', marginBottom: 20, border: `1px solid ${C.gray200}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 14 }}>
              Top 3 Commerces
            </div>
            {topCommerces.length === 0 ? (
              <EmptySection label="Aucun commerce pour l'instant" />
            ) : topCommerces.map((tc, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                paddingBottom: i < topCommerces.length - 1 ? 12 : 0,
                marginBottom: i < topCommerces.length - 1 ? 12 : 0,
                borderBottom: i < topCommerces.length - 1 ? `1px solid ${C.gray100}` : 'none',
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: tc.rank === 1 ? '#F4C24A' : tc.rank === 2 ? C.gray200 : C.gray100,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 900, color: tc.rank === 1 ? '#fff' : C.gray500,
                }}>
                  {tc.rank}
                </div>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: tc.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}>
                  {tc.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{tc.name}</div>
                  <div style={{ fontSize: 11, color: C.gray500 }}>{tc.visits} visite{tc.visits > 1 ? 's' : ''}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#F4A24A' }}>{tc.total.toFixed(2)} €</div>
              </div>
            ))}
          </div>
        )}

        {/* Monthly table */}
        {history.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 20, padding: '18px', border: `1px solid ${C.gray200}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 14 }}>
              Récapitulatif mensuel
            </div>
            {monthly.length === 0 ? (
              <EmptySection label="Aucune donnée mensuelle" />
            ) : (
              <>
                <div style={{ display: 'flex', paddingBottom: 10, borderBottom: `1px solid ${C.gray200}`, marginBottom: 10 }}>
                  <div style={{ flex: 2, fontSize: 11, fontWeight: 700, color: C.gray500 }}>Mois</div>
                  <div style={{ flex: 1, fontSize: 11, fontWeight: 700, color: C.gray500, textAlign: 'center' }}>Coops</div>
                  <div style={{ flex: 1.2, fontSize: 11, fontWeight: 700, color: C.gray500, textAlign: 'right' }}>Économies</div>
                </div>
                {monthly.map((m, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center',
                    paddingBottom: i < monthly.length - 1 ? 10 : 0,
                    marginBottom: i < monthly.length - 1 ? 10 : 0,
                    borderBottom: i < monthly.length - 1 ? `1px solid ${C.gray100}` : 'none',
                  }}>
                    <div style={{ flex: 2, fontSize: 13, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? C.ink : C.gray500 }}>{m.month}</div>
                    <div style={{ flex: 1, fontSize: 13, fontWeight: 600, textAlign: 'center', color: C.ink }}>{m.coops}</div>
                    <div style={{ flex: 1.2, fontSize: 14, fontWeight: 800, color: '#F4A24A', textAlign: 'right' }}>{m.savings.toFixed(2)} €</div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      <HomeIndicator />
    </div>
  )
}
