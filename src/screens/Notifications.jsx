// HOW NOTIFICATIONS CURRENTLY WORK (before this fix):
// ─────────────────────────────────────────────────────
// A hardcoded INIT array of 7 static notifications was defined at module level.
// Every user — new or veteran, regardless of their categories, zone, coops, or
// activity — saw the exact same fictional notifications:
//   • A fake "Aqua Tour -20%" new coop (Aqua Tour doesn't exist in OFFERS)
//   • A fake "+20 points from Karacoli Beach review" (even for new users with 0 reviews)
//   • A fake "Défi Explorateur" completion (even with no coop history)
//   • A fake expiring "Aqua Tour" coop (even if the user had no coops)
//   • A fake new partner "Ti'Kaz Créole" message
//   • A fake "+50 referral points from Jean-Paul" (same fictional person for everyone)
//   • A generic CGU update (the only one that could be real for anyone)
// None of these read from useApp() — no user context, no userCoops, no categories.
//
// FIX: Notifications are now generated dynamically from real user data:
//   • New offers in user's favorite categories (from OFFERS where isNew && catId matches)
//   • Coops expiring within 3 days (from userCoops, parsed DD/MM/YYYY expiry)
//   • Points earned notification (if user.coopsUsed > 0)
//   • Welcome message with real user name (always shown)

import { useState, useMemo } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'
import { useApp } from '../context/AppContext.jsx'

const TYPE = {
  coop:   { icon: '🎁', color: C.ocean,    bg: 'rgba(14,140,126,0.1)'  },
  points: { icon: '⭐', color: '#D4A800',   bg: 'rgba(244,194,74,0.12)' },
  defi:   { icon: '🏆', color: '#7B1FA2',   bg: 'rgba(155,89,182,0.1)'  },
  expiry: { icon: '⏰', color: C.coral,     bg: 'rgba(255,90,95,0.08)'  },
  system: { icon: 'ℹ️', color: C.gray500,  bg: C.gray100               },
}

function relativeTime(ts) {
  const diff = Date.now() - ts
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins  <  1) return "À l'instant"
  if (mins  < 60) return `Il y a ${mins} min`
  if (hours < 24) return `Il y a ${hours}h`
  if (days  <  7) return `Il y a ${days} jour${days > 1 ? 's' : ''}`
  const weeks = Math.floor(days / 7)
  return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`
}

function parseFrDate(str) {
  if (!str) return null
  const p = str.split('/')
  if (p.length < 3) return null
  return new Date(parseInt(p[2]), parseInt(p[1]) - 1, parseInt(p[0]))
}

function buildNotifications(user, userCoops, OFFERS = []) {
  const notifs = []
  let id = 1

  const userCatIds = user.categories instanceof Set
    ? [...user.categories]
    : (Array.isArray(user.categories) ? user.categories : [])

  const now = Date.now()

  // New offers in user's favorite categories
  const relevantNew = OFFERS.filter(o => o.isNew && userCatIds.includes(o.catId))
  for (const offer of relevantNew.slice(0, 2)) {
    notifs.push({
      id: id++, type: 'coop', read: false,
      title: 'Nouveau Coops disponible',
      msg: `${offer.commerce} lance une offre "${offer.title}". Valable jusqu'au ${offer.expiry}.`,
      ts: now - 5 * 60 * 1000,
    })
  }

  // Coops expiring within 3 days
  const nowDate = new Date()
  for (const coop of userCoops) {
    if (coop.status !== 'actif') continue
    const expiry = parseFrDate(coop.expiry)
    if (!expiry) continue
    const diffDays = (expiry - nowDate) / (1000 * 60 * 60 * 24)
    if (diffDays >= 0 && diffDays <= 3) {
      notifs.push({
        id: id++, type: 'expiry', read: false,
        title: 'Coops expire bientôt ⚠️',
        msg: `Votre Coops chez ${coop.commerce} expire dans moins de 3 jours. Ne le laissez pas expirer !`,
        ts: now,
      })
    }
  }

  // Points earned if user has used coops
  if (user.coopsUsed > 0) {
    notifs.push({
      id: id++, type: 'points', read: true,
      title: `+${user.coopsUsed * 10} points gagnés`,
      msg: `Bravo ! Vous avez utilisé ${user.coopsUsed} Coop${user.coopsUsed > 1 ? 's' : ''} et accumulé des points Coopers.`,
      ts: now - 2 * 60 * 60 * 1000,
    })
  }

  // Referral bonus if user has referrals
  const refCount = Array.isArray(user.referrals) ? user.referrals.length : 0
  if (refCount > 0) {
    notifs.push({
      id: id++, type: 'points', read: false,
      title: `+${refCount * 50} points de parrainage`,
      msg: `Vous avez parrainé ${refCount} ami${refCount > 1 ? 's' : ''}. Merci de faire grandir la communauté Coopers !`,
      ts: now,
    })
  }

  // Welcome message (always shown)
  notifs.push({
    id: id++, type: 'system', read: notifs.length > 0,
    title: `Bienvenue sur Coopers${user.firstName ? `, ${user.firstName}` : ''} 🏝️`,
    msg: "Découvrez les meilleurs bons plans de Guadeloupe et commencez à économiser dès aujourd'hui !",
    ts: now - 7 * 24 * 60 * 60 * 1000,
  })

  return notifs
}

export default function Notifications({ goBack }) {
  const { user, userCoops, offers } = useApp()

  const initialNotifs = useMemo(
    () => buildNotifications(user, userCoops, offers),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  const [notifs, setNotifs] = useState(initialNotifs)

  const unread      = notifs.filter(n => !n.read).length
  const markAllRead = () => setNotifs(ns => ns.map(n => ({ ...n, read: true })))
  const markRead    = id => setNotifs(ns => ns.map(n => n.id === id ? { ...n, read: true } : n))

  return (
    <div style={{ width: '100%', height: '100%', background: C.cream, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 120 }}>
        {/* Header */}
        <div style={{ padding: '0 20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={goBack} style={{
            width: 38, height: 38, borderRadius: 19, background: '#fff',
            border: `1px solid ${C.gray200}`, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon d={ICONS.chevL} size={18} stroke={C.ink} sw={2} />
          </button>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.4 }}>Notifications</div>
            {unread > 0 && (
              <div style={{
                minWidth: 22, height: 22, borderRadius: 11, padding: '0 6px',
                background: C.coral, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 11, fontWeight: 800,
              }}>
                {unread}
              </div>
            )}
          </div>
          {unread > 0 && (
            <button onClick={markAllRead} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: C.ocean, fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
            }}>
              Tout marquer lu
            </button>
          )}
        </div>

        {/* Empty state */}
        {notifs.length === 0 && (
          <div style={{ padding: '48px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 48 }}>🔔</div>
            <div style={{ marginTop: 16, fontSize: 17, fontWeight: 700, color: C.ink }}>Tout est à jour</div>
            <div style={{ marginTop: 8, fontSize: 14, color: C.gray500, lineHeight: 1.5 }}>
              Vos notifications apparaîtront ici dès qu'il y a du nouveau.
            </div>
          </div>
        )}

        {/* List */}
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {notifs.map(n => {
            const t = TYPE[n.type]
            return (
              <button
                key={n.id}
                onClick={() => markRead(n.id)}
                style={{
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  padding: '14px', borderRadius: 16, textAlign: 'left', width: '100%',
                  background: n.read ? '#fff' : 'rgba(14,140,126,0.05)',
                  border: `1px solid ${n.read ? C.gray200 : 'rgba(14,140,126,0.18)'}`,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                  background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19,
                }}>
                  {t.icon}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, lineHeight: 1.3 }}>
                      {n.title}
                    </div>
                    {!n.read && (
                      <div style={{
                        width: 8, height: 8, borderRadius: 4, flexShrink: 0,
                        background: C.ocean, marginTop: 3,
                      }} />
                    )}
                  </div>
                  <div style={{ marginTop: 4, fontSize: 12, color: C.gray500, lineHeight: 1.45 }}>
                    {n.msg}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 11, color: C.gray400, fontWeight: 500 }}>
                    {relativeTime(n.ts)}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div style={{ padding: '28px 20px 8px', textAlign: 'center' }}>
          <button style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: C.gray500, fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
          }}>
            Gérer mes préférences de notification →
          </button>
        </div>
      </div>

      <HomeIndicator />
    </div>
  )
}
