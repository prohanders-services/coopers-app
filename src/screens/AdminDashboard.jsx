import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import AdminTabBar, { AB, ABKG } from '../components/AdminTabBar.jsx'
import { C } from '../tokens.js'
import { useApp } from '../context/AppContext.jsx'

const BAR_DATA = [
  { day: 'L', val: 8 },
  { day: 'M', val: 14 },
  { day: 'M', val: 11 },
  { day: 'J', val: 19 },
  { day: 'V', val: 24 },
  { day: 'S', val: 31 },
  { day: 'D', val: 17 },
]

const RECENT = [
  { time: '14:32', client: 'Sophie', offer: '-20% Plat du jour', pts: 50 },
  { time: '13:15', client: 'Marc',   offer: 'Cocktail offert',  pts: 30 },
  { time: '11:48', client: 'Lucie',  offer: '-20% Plat du jour', pts: 50 },
  { time: '10:20', client: 'Jean',   offer: '-15% Menu dégustation', pts: 40 },
  { time: '09:05', client: 'Élise',  offer: 'Dessert offert',   pts: 25 },
]

const ALERTS = [
  { type: 'urgent',  msg: '« Cocktail offert » expire dans 3 jours', emoji: '⏰', dot: '🔴' },
  { type: 'warning', msg: '« Formule midi » : plus que 4 utilisations', emoji: '⚡', dot: '🟠' },
]

function StatCard({ emoji, label, value, sub, trend, trendVal }) {
  const up = trend === 'up'
  const down = trend === 'down'
  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: '14px 14px 12px',
      border: `1px solid ${C.gray200}`, flex: 1,
    }}>
      <div style={{ fontSize: 20, marginBottom: 6 }}>{emoji}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, letterSpacing: -0.5 }}>{value}</div>
      <div style={{ fontSize: 11, color: C.gray500, marginTop: 2, lineHeight: 1.3 }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: C.gray400, marginTop: 3 }}>{sub}</div>}
      {trendVal && (
        <div style={{
          marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 3,
          padding: '2px 7px', borderRadius: 999,
          background: up ? 'rgba(14,140,126,0.1)' : down ? 'rgba(255,90,95,0.1)' : C.gray100,
          fontSize: 10, fontWeight: 700,
          color: up ? C.ocean : down ? C.coral : C.gray500,
        }}>
          {up ? '↑' : down ? '↓' : '→'} {trendVal}
        </div>
      )}
    </div>
  )
}

export default function AdminDashboard({ navigate, handleAdminTab, resetTo }) {
  const { adminCommerce, logout, adminStats, adminNotifications } = useApp()
  const unreadCount = adminNotifications.filter(n => !n.read).length

  // Merge live data with demo bars
  const chartData = BAR_DATA.map((b, i) => i === 5 ? { ...b, val: b.val + adminStats.validations } : b)
  const maxBar = Math.max(...chartData.map(b => b.val))

  const totalValidations = 12 + adminStats.validations
  const totalMonthly = 284 + adminStats.validations
  const totalClients = 198 + adminStats.clientsUniques.length
  const totalEconomies = 1240 + adminStats.economies

  const recentActivity = adminStats.validationHistory.length > 0
    ? [...adminStats.validationHistory.map(h => ({ time: h.time, client: h.client, offer: h.offer, pts: 10, isLive: true })), ...RECENT].slice(0, 5)
    : RECENT

  const handleLogout = () => {
    logout()
    resetTo('login')
  }

  return (
    <div style={{ width: '100%', height: '100%', background: ABKG, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '0 16px 100px', paddingBottom: 120 }}>
        {/* Header */}
        <div style={{
          background: AB, margin: '0 -16px', padding: '14px 16px 18px',
          marginBottom: 18,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 18, fontWeight: 900, color: '#fff', fontFamily: '"Instrument Serif", serif', fontStyle: 'italic' }}>Coopers</span>
                <span style={{
                  padding: '2px 8px', borderRadius: 999, fontSize: 9, fontWeight: 800,
                  background: 'rgba(255,255,255,0.2)', color: '#fff', letterSpacing: 1,
                  textTransform: 'uppercase',
                }}>Espace Pro</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{adminCommerce.name}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{adminCommerce.category} · {adminCommerce.zone}</div>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, border: '2px solid rgba(255,255,255,0.3)' }}>🏔️</div>
                <button
                  onClick={() => navigate('adminnotifications')}
                  style={{ position: 'relative', width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  🔔
                  {unreadCount > 0 && (
                    <div style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: 8, background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: '#fff', border: '2px solid ' + AB }}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </div>
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  title="Se déconnecter"
                  style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >🚪</button>
              </div>
              <div style={{
                padding: '3px 8px', borderRadius: 999, background: '#22C55E',
                fontSize: 9, fontWeight: 800, color: '#fff', letterSpacing: 0.5,
              }}>● STANDARD</div>
            </div>
          </div>
        </div>

        {/* Stat cards 2x2 */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <StatCard emoji="✅" label="Coops validés aujourd'hui" value={String(totalValidations)} trendVal="+4 vs hier" trend="up" />
          <StatCard emoji="📅" label="Coops validés ce mois" value={String(totalMonthly)} trendVal="+18%" trend="up" />
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <StatCard emoji="👥" label="Clients uniques ce mois" value={String(totalClients)} sub="42 nouveaux · 156 fidèles" />
          <StatCard emoji="💰" label="Économies clients ce mois" value={`${totalEconomies.toLocaleString('fr-FR')} €`} sub="Argument marketing fort !" />
        </div>

        {/* 7-day bar chart */}
        <div style={{ background: '#fff', borderRadius: 18, padding: '16px', border: `1px solid ${C.gray200}`, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>Activité 7 derniers jours</div>
            <div style={{ fontSize: 11, color: C.gray500 }}>Coops validés</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 64 }}>
            {chartData.map((b, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: i === 5 ? AB : 'transparent' }}>{b.val}</div>
                <div style={{
                  width: '100%', borderRadius: '4px 4px 0 0',
                  height: `${(b.val / maxBar) * 48}px`,
                  background: i === 5 ? AB : `${AB}40`,
                  minHeight: 4,
                }} />
                <div style={{ fontSize: 9, color: C.gray400 }}>{b.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick access */}
        <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
          Accès rapide
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {[
            { emoji: '📷', label: 'Scanner\nun Coops',   to: 'adminscanner',  color: AB },
            { emoji: '✨', label: 'Créer\nune offre',    to: 'createoffer',   color: '#8B5CF6' },
            { emoji: '📋', label: 'Voir\nl\'historique', to: 'adminhistory',  color: C.ocean },
            { emoji: '⭐', label: 'Avis\nclients',       to: 'adminreviews',  color: '#D4A800' },
          ].map(b => (
            <button
              key={b.to}
              onClick={() => navigate(b.to)}
              style={{
                flex: 1, padding: '14px 8px', borderRadius: 16,
                background: '#fff', cursor: 'pointer', fontFamily: 'inherit',
                border: `1px solid ${C.gray200}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: 12, margin: '0 auto 8px',
                background: `${b.color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              }}>{b.emoji}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.ink, whiteSpace: 'pre-line', lineHeight: 1.4 }}>{b.label}</div>
            </button>
          ))}
        </div>

        {/* Alerts */}
        {ALERTS.length > 0 && (
          <>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
              Alertes ({ALERTS.length})
            </div>
            <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ALERTS.map((a, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 14px', borderRadius: 14,
                  background: a.type === 'urgent' ? 'rgba(255,90,95,0.06)' : '#FFF7ED',
                  border: `1px solid ${a.type === 'urgent' ? 'rgba(255,90,95,0.2)' : '#FED7AA'}`,
                }}>
                  <span style={{ fontSize: 14 }}>{a.dot}</span>
                  <span style={{ fontSize: 18 }}>{a.emoji}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: a.type === 'urgent' ? C.coral : '#92400E', flex: 1 }}>{a.msg}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Recent activity */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Activité récente
          </div>
          <button onClick={() => navigate('adminhistory')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: AB }}>
            Tout voir
          </button>
        </div>
        <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: `1px solid ${C.gray200}` }}>
          {recentActivity.map((r, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
              borderBottom: i < recentActivity.length - 1 ? `1px solid ${C.gray100}` : 'none',
              background: r.isLive ? 'rgba(14,140,126,0.03)' : '#fff',
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 17,
                background: r.isLive ? 'rgba(14,140,126,0.12)' : `${AB}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 800, color: r.isLive ? C.ocean : AB, flexShrink: 0,
              }}>
                {r.client[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{r.client}</div>
                <div style={{ fontSize: 11, color: C.gray500, marginTop: 1 }}>{r.offer}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: C.gray400 }}>{r.time}</div>
                <div style={{ fontSize: 10, color: C.ocean, fontWeight: 700, marginTop: 1 }}>+{r.pts} pts</div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats link */}
        <button
          onClick={() => navigate('adminstats')}
          style={{
            marginTop: 16, width: '100%', padding: '14px', borderRadius: 14,
            background: `${AB}10`, border: `1px solid ${AB}30`,
            cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <span style={{ fontSize: 16 }}>📈</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: AB }}>Statistiques avancées</span>
        </button>
      </div>

      <AdminTabBar active="admindashboard" onTab={handleAdminTab} />
      <HomeIndicator />
    </div>
  )
}
