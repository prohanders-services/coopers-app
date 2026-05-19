import { useEffect } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import AdminTabBar, { AB, ABKG } from '../components/AdminTabBar.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'
import { useApp } from '../context/AppContext.jsx'

const DEMO_NOTIFS = [
  { id: 'd1', type: 'validation', msg: 'Joëlle F. a utilisé « -20% Plat du jour »', time: '14:32', date: "Aujourd'hui", read: true },
  { id: 'd2', type: 'validation', msg: 'Marc B. a utilisé « Cocktail offert »',       time: '13:15', date: "Aujourd'hui", read: true },
  { id: 'd3', type: 'alert',      msg: '« Cocktail offert » expire dans 3 jours',     time: '09:00', date: "Aujourd'hui", read: true },
  { id: 'd4', type: 'review',     msg: 'Nadia S. a laissé un avis 5 étoiles ⭐',      time: '11:30', date: 'Hier',         read: true },
  { id: 'd5', type: 'alert',      msg: '« Formule midi » : plus que 4 utilisations',  time: '08:00', date: 'Hier',         read: true },
]

const TYPE_CONFIG = {
  validation: { emoji: '✅', color: C.ocean, bg: 'rgba(14,140,126,0.1)' },
  alert:      { emoji: '⚠️', color: '#D97706', bg: 'rgba(217,119,6,0.1)' },
  review:     { emoji: '⭐', color: '#D4A800', bg: 'rgba(212,168,0,0.1)' },
}

export default function AdminNotifications({ goBack, navigate, handleAdminTab }) {
  const { adminNotifications, markAdminNotifRead, markAllAdminNotifsRead } = useApp()

  useEffect(() => {
    markAllAdminNotifsRead()
  }, [])

  const liveNotifs = adminNotifications.map(n => ({ ...n, isLive: true }))
  const allNotifs  = [...liveNotifs, ...DEMO_NOTIFS]
  const unread = adminNotifications.filter(n => !n.read).length

  return (
    <div style={{ width: '100%', height: '100%', background: ABKG, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '0 16px', paddingBottom: 120 }}>
        {/* Header */}
        <div style={{ paddingBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={goBack} style={{ width: 38, height: 38, borderRadius: 19, background: '#fff', border: `1px solid ${C.gray200}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon d={ICONS.chevL} size={18} stroke={C.ink} sw={2} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.3 }}>Notifications 🔔</div>
            <div style={{ fontSize: 12, color: C.gray500, marginTop: 1 }}>{unread > 0 ? `${unread} non lue${unread > 1 ? 's' : ''}` : 'Tout lu'}</div>
          </div>
        </div>

        {allNotifs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 48 }}>🔕</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.ink, marginTop: 16 }}>Aucune notification</div>
            <div style={{ fontSize: 13, color: C.gray500, marginTop: 8 }}>Vos alertes apparaîtront ici</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {allNotifs.map((n, i) => {
              const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.validation
              return (
                <div key={n.id || i} style={{
                  display: 'flex', gap: 12, padding: '12px 14px', borderRadius: 16,
                  background: (!n.read && n.isLive) ? 'rgba(37,99,235,0.04)' : '#fff',
                  border: `1px solid ${(!n.read && n.isLive) ? `${AB}30` : C.gray200}`,
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                    {cfg.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, lineHeight: 1.4 }}>{n.msg}</div>
                    <div style={{ fontSize: 11, color: C.gray400, marginTop: 4 }}>{n.date} · {n.time}</div>
                  </div>
                  {!n.read && n.isLive && (
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: AB, flexShrink: 0, marginTop: 6 }} />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <AdminTabBar active="admindashboard" onTab={handleAdminTab} />
      <HomeIndicator />
    </div>
  )
}
