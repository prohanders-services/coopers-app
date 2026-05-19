import { C } from '../tokens.js'

export const AB = '#2563EB'   // admin blue
export const ABKG = '#F0F5FF' // admin bg tint

const tabs = [
  { id: 'admindashboard', label: 'Dashboard', emoji: '📊' },
  { id: 'admincoops',     label: 'Mes Coops', emoji: '🎁' },
  { id: 'adminscanner',   label: 'Scanner',   emoji: '📷', fab: true },
  { id: 'adminhistory',   label: 'Historique', emoji: '📋' },
  { id: 'admincommerce',  label: 'Commerce',  emoji: '🏪' },
]

export default function AdminTabBar({ active = 'admindashboard', onTab }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 40,
      paddingBottom: 24, paddingTop: 10,
      background: 'rgba(255,255,255,0.94)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderTop: `1px solid rgba(37,99,235,0.12)`,
      display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end',
    }}>
      {tabs.map(t => {
        const isActive = t.id === active
        if (t.fab) {
          return (
            <button key={t.id} onClick={() => onTab && onTab(t.id)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 2,
              }}>
              <div style={{
                width: 52, height: 52, borderRadius: 26,
                background: AB, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, boxShadow: `0 4px 16px rgba(37,99,235,0.45)`,
              }}>
                {t.emoji}
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: isActive ? AB : C.gray400 }}>
                {t.label}
              </span>
            </button>
          )
        }
        const color = isActive ? AB : C.gray400
        return (
          <button key={t.id} onClick={() => onTab && onTab(t.id)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, width: 64,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}>
            <span style={{ fontSize: 22, opacity: isActive ? 1 : 0.6 }}>{t.emoji}</span>
            <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, color }}>
              {t.label}
            </span>
            {isActive && <div style={{ width: 4, height: 4, borderRadius: 2, background: AB }} />}
          </button>
        )
      })}
    </div>
  )
}
