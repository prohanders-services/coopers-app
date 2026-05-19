import { useState } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'
import { useApp } from '../context/AppContext.jsx'

const FILTERS = ['Ce mois', '3 mois', '6 mois', 'Tout', 'Par catégorie']
const MONTH_SHORT = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

function parseFrDate(str) {
  if (!str) return null
  const p = str.split('/')
  if (p.length < 3) return null
  return new Date(parseInt(p[2]), parseInt(p[1]) - 1, parseInt(p[0]))
}

function buildBarData(history) {
  const now = new Date()
  const bars = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    bars.push({ month: MONTH_SHORT[d.getMonth()], year: d.getFullYear(), monthIdx: d.getMonth(), val: 0 })
  }
  for (const e of history) {
    const d = parseFrDate(e.dateObtained)
    if (!d) continue
    const bar = bars.find(b => b.year === d.getFullYear() && b.monthIdx === d.getMonth())
    if (bar) bar.val += e.saved || 0
  }
  return bars
}

function filterByPeriod(entries, filter) {
  const now = new Date()
  if (filter === 'Ce mois') {
    return entries.filter(e => {
      const d = parseFrDate(e.dateObtained)
      return d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }
  if (filter === '3 mois') {
    const cutoff = new Date(now.getFullYear(), now.getMonth() - 3, 1)
    return entries.filter(e => { const d = parseFrDate(e.dateObtained); return d && d >= cutoff })
  }
  if (filter === '6 mois') {
    const cutoff = new Date(now.getFullYear(), now.getMonth() - 6, 1)
    return entries.filter(e => { const d = parseFrDate(e.dateObtained); return d && d >= cutoff })
  }
  return entries
}

export default function History({ navigate, goBack }) {
  const { user } = useApp()
  const [filter, setFilter] = useState('Tout')

  const history  = Array.isArray(user.history) ? user.history : []
  const coopsUsed  = user.coopsUsed  || 0
  const totalSaved = user.totalSaved || 0

  const barData    = buildBarData(history)
  const maxVal     = Math.max(...barData.map(b => b.val), 1)
  const hasBarData = barData.some(b => b.val > 0)

  const bestBar = hasBarData ? barData.reduce((a, b) => b.val > a.val ? b : a) : null

  const commerceCounts = {}
  for (const e of history) {
    if (e.commerce) commerceCounts[e.commerce] = (commerceCounts[e.commerce] || 0) + 1
  }
  const topCommerce = Object.keys(commerceCounts).length > 0
    ? Object.keys(commerceCounts).reduce((a, b) => commerceCounts[b] > commerceCounts[a] ? b : a)
    : null

  const filtered = filterByPeriod(history, filter)

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
          <div style={{ flex: 1, fontSize: 22, fontWeight: 700, letterSpacing: -0.4 }}>Mon Historique</div>
          <button onClick={() => navigate('savings')} style={{
            fontSize: 13, color: C.coral, fontWeight: 700,
            background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
          }}>
            Économies →
          </button>
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Coops utilisés',   val: String(coopsUsed),             unit: '',                                           color: C.ocean,   bg: 'rgba(14,140,126,0.08)' },
            { label: 'Total économisé',  val: `${totalSaved.toFixed(0)} €`,  unit: '',                                           color: '#F4A24A', bg: 'rgba(244,162,74,0.1)'  },
            { label: 'Meilleur mois',    val: bestBar ? bestBar.month : '–', unit: bestBar ? `${bestBar.val.toFixed(0)} €` : '', color: C.coral,   bg: 'rgba(255,90,95,0.07)'  },
            { label: 'Commerce préféré', val: topCommerce || '–',            unit: '',                                           color: C.ink,     bg: '#fff'                  },
          ].map((s, i) => (
            <div key={i} style={{
              padding: '14px', borderRadius: 16, background: s.bg,
              border: `1px solid ${s.bg === '#fff' ? C.gray200 : 'transparent'}`,
            }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: s.color, lineHeight: 1.1 }}>{s.val}</div>
              {s.unit && <div style={{ fontSize: 11, color: s.color, opacity: 0.8 }}>{s.unit}</div>}
              <div style={{ marginTop: 4, fontSize: 11, color: C.gray500, fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '18px 16px', marginBottom: 20, border: `1px solid ${C.gray200}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, marginBottom: 14, letterSpacing: 0.3, textTransform: 'uppercase' }}>
            Économies · 6 derniers mois
          </div>
          {hasBarData ? (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80 }}>
              {barData.map((b, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ fontSize: 9, color: C.gray500, fontWeight: 600 }}>{b.val > 0 ? `${b.val.toFixed(0)}€` : ''}</div>
                  <div style={{
                    width: '100%', borderRadius: '6px 6px 0 0',
                    background: i === barData.length - 1 ? C.coral : C.ocean,
                    height: `${(b.val / maxVal) * 56}px`,
                    opacity: i === barData.length - 1 ? 1 : 0.65,
                    minHeight: 4,
                  }} />
                  <div style={{ fontSize: 9, color: C.gray500, fontWeight: 600 }}>{b.month}</div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                {barData.map((b, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: '100%', height: 40, borderRadius: 4, background: C.gray100 }} />
                    <div style={{ fontSize: 9, color: C.gray400, fontWeight: 600 }}>{b.month}</div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: C.gray400, fontWeight: 600 }}>
                Aucune transaction ce mois
              </div>
            </>
          )}
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 16, paddingBottom: 2 }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '7px 14px', borderRadius: 999, flexShrink: 0,
                background: filter === f ? C.ink : '#fff',
                border: `1px solid ${filter === f ? C.ink : C.gray200}`,
                color: filter === f ? '#fff' : C.ink,
                fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                cursor: 'pointer',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Entries or empty state */}
        {filtered.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 52 }}>🧾</div>
            <div style={{ marginTop: 16, fontSize: 17, fontWeight: 700, color: C.ink, letterSpacing: -0.3 }}>
              Ton historique est vide pour l'instant
            </div>
            <div style={{ marginTop: 8, fontSize: 14, color: C.gray500, lineHeight: 1.5 }}>
              Active ton premier Coops pour commencer !
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(e => (
              <div key={e.id} style={{
                background: '#fff', borderRadius: 16, padding: 14,
                display: 'flex', gap: 12, alignItems: 'center',
                border: `1px solid ${C.gray100}`,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: e.gradient || 'linear-gradient(135deg,#FFB39A,#FF5A5F)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20,
                }}>
                  {e.emoji || '🎫'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, lineHeight: 1.2 }}>{e.commerce}</div>
                  <div style={{ fontSize: 11, color: C.gray500, marginTop: 2, lineHeight: 1.3, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {e.title || e.offer}
                  </div>
                  <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10, color: C.gray500 }}>
                      {e.dateObtained}{e.time ? ` · ${e.time}` : ''}
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, color: C.ocean,
                      padding: '1px 6px', borderRadius: 999, background: 'rgba(14,140,126,0.08)',
                    }}>
                      +{e.points || e.pointsGained || 0} pts
                    </span>
                  </div>
                </div>
                <div style={{ flexShrink: 0, textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#F4A24A' }}>
                    -{(e.saved || 0).toFixed(2)} €
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {history.length > 0 && (
          <button style={{
            marginTop: 24, width: '100%', padding: '14px', borderRadius: 14,
            background: '#fff', border: `1px solid ${C.gray200}`,
            color: C.ink, fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Exporter mon historique
          </button>
        )}
      </div>

      <HomeIndicator />
    </div>
  )
}
