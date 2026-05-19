import { useState } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import AdminTabBar, { AB, ABKG } from '../components/AdminTabBar.jsx'
import { C } from '../tokens.js'
import { useApp } from '../context/AppContext.jsx'

const FILTERS = ["Aujourd'hui", 'Cette semaine', 'Ce mois', 'Tout']

const DEMO_HISTORY = [
  { id: 'CP-4821', time: '14:32', date: "Aujourd'hui", client: 'Sophie', offer: '-20% Plat du jour',    amount: '4,80 €', savings: 4.8  },
  { id: 'CP-4820', time: '13:15', date: "Aujourd'hui", client: 'Marc',   offer: 'Cocktail offert',       amount: '8,00 €', savings: 8.0  },
  { id: 'CP-4819', time: '11:48', date: "Aujourd'hui", client: 'Lucie',  offer: '-20% Plat du jour',     amount: '4,80 €', savings: 4.8  },
  { id: 'CP-4818', time: '10:20', date: 'Cette semaine',client: 'Jean',  offer: '-15% Menu dégustation', amount: '6,75 €', savings: 6.75 },
  { id: 'CP-4817', time: '09:05', date: 'Cette semaine',client: 'Élise', offer: 'Cocktail offert',       amount: '8,00 €', savings: 8.0  },
  { id: 'CP-4816', time: '20:14', date: 'Ce mois',     client: 'Paul',   offer: '-20% Plat du jour',     amount: '4,80 €', savings: 4.8  },
  { id: 'CP-4815', time: '19:30', date: 'Ce mois',     client: 'Nina',   offer: '-15% Menu dégustation', amount: '6,75 €', savings: 6.75 },
]

export default function AdminHistory({ handleAdminTab }) {
  const { adminStats } = useApp()
  const [filter,   setFilter]   = useState("Aujourd'hui")
  const [exported, setExported] = useState(false)

  // Merge live validations (from context) with demo seed data
  const liveHistory = adminStats.validationHistory.map(h => ({ ...h, date: "Aujourd'hui", isLive: true }))
  const allHistory = [...liveHistory, ...DEMO_HISTORY]

  const filteredHistory = filter === 'Tout' ? allHistory : allHistory.filter(h => h.date === filter)

  // Build bar chart from live data (last 7 periods) — fall back to demo bars
  const BAR_DATA = [
    { day: 'L', val: 8 }, { day: 'M', val: 14 }, { day: 'M', val: 11 },
    { day: 'J', val: 19 }, { day: 'V', val: 24 }, { day: 'S', val: 31 + adminStats.validations },
    { day: 'D', val: 17 },
  ]
  const maxBar = Math.max(...BAR_DATA.map(b => b.val))

  const totalValidations = 284 + adminStats.validations
  const totalClients = 198 + adminStats.clientsUniques.length
  const totalEconomies = 1240 + adminStats.economies

  const handleExport = () => {
    setExported(true)
    setTimeout(() => setExported(false), 2000)
  }

  return (
    <div style={{ width: '100%', height: '100%', background: ABKG, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '0 16px 100px', paddingBottom: 120 }}>
        {/* Header */}
        <div style={{ paddingBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.3 }}>Historique</div>
                <span style={{
                  padding: '2px 8px', borderRadius: 999, fontSize: 9, fontWeight: 800,
                  background: AB, color: '#fff', letterSpacing: 1, textTransform: 'uppercase',
                }}>Espace Pro</span>
              </div>
              <div style={{ fontSize: 12, color: C.gray500 }}>Validations des Coops</div>
            </div>
            <button
              onClick={handleExport}
              style={{
                padding: '8px 14px', borderRadius: 12,
                background: exported ? C.ocean : '#fff',
                border: `1px solid ${exported ? C.ocean : C.gray200}`,
                color: exported ? '#fff' : AB, fontSize: 12, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              {exported ? '✓ Exporté !' : '⬇ CSV'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[
            { label: 'Validations', val: String(totalValidations), emoji: '✅' },
            { label: 'Clients uniques', val: String(totalClients), emoji: '👥' },
            { label: 'Économies', val: `${totalEconomies}€`, emoji: '💰' },
            { label: 'Top offre', val: '-20%', emoji: '🏆' },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1, background: '#fff', borderRadius: 14, padding: '10px 8px',
              border: `1px solid ${C.gray200}`, textAlign: 'center',
            }}>
              <div style={{ fontSize: 18 }}>{s.emoji}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.ink, marginTop: 2 }}>{s.val}</div>
              <div style={{ fontSize: 9, color: C.gray400, marginTop: 1, lineHeight: 1.2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Period filters */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '7px 13px', borderRadius: 999, cursor: 'pointer',
                background: filter === f ? AB : '#fff',
                color: filter === f ? '#fff' : C.gray500,
                fontSize: 12, fontWeight: filter === f ? 700 : 500,
                fontFamily: 'inherit', flexShrink: 0,
                border: filter === f ? `1px solid ${AB}` : `1px solid ${C.gray200}`,
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div style={{ background: '#fff', borderRadius: 18, padding: '14px 14px 10px', border: `1px solid ${C.gray200}`, marginBottom: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.gray500, marginBottom: 10 }}>
            Activité sur la période
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 56 }}>
            {BAR_DATA.map((b, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div style={{
                  width: '100%', borderRadius: '3px 3px 0 0',
                  height: `${(b.val / maxBar) * 42}px`,
                  background: i === 6 ? `${AB}40` : i === 5 ? AB : `${AB}60`,
                  minHeight: 3,
                }} />
                <div style={{ fontSize: 9, color: C.gray400 }}>{b.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Validation list */}
        <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
          {filteredHistory.length} validation{filteredHistory.length !== 1 ? 's' : ''}
        </div>
        {filteredHistory.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 20px', color: C.gray400 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Aucune validation trouvée</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Essayez une autre période</div>
          </div>
        )}
        {filteredHistory.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: `1px solid ${C.gray200}` }}>
            {filteredHistory.map((h, i) => (
              <div key={h.id} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px',
                borderBottom: i < filteredHistory.length - 1 ? `1px solid ${C.gray100}` : 'none',
                background: h.isLive ? 'rgba(14,140,126,0.03)' : '#fff',
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 17,
                  background: h.isLive ? 'rgba(14,140,126,0.12)' : `${AB}12`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 800, color: h.isLive ? C.ocean : AB, flexShrink: 0,
                }}>
                  {h.client[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{h.client}</div>
                  <div style={{ fontSize: 11, color: C.gray500, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {h.offer}
                  </div>
                  <div style={{ fontSize: 10, color: C.gray400, marginTop: 1 }}>{h.date} · {h.time}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: C.ocean }}>-{h.amount}</div>
                  <div style={{ fontSize: 9, color: C.gray400, marginTop: 2, fontFamily: 'monospace' }}>{h.id}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AdminTabBar active="adminhistory" onTab={handleAdminTab} />
      <HomeIndicator />
    </div>
  )
}
