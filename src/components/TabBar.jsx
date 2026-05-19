import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'

const tabs = [
  { id: 'home',    label: 'Accueil',   icon: ICONS.home },
  { id: 'explore', label: 'Explorer',  icon: ICONS.compass },
  { id: 'coops',   label: 'Mes Coops', icon: ICONS.ticket },
  { id: 'loyalty', label: 'Fidélité',  icon: ICONS.trophy },
  { id: 'profile', label: 'Profil',    icon: ICONS.user },
]

export default function TabBar({ active = 'home', dark = false, onTab }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 40,
      paddingBottom: 28, paddingTop: 8,
      background: dark ? 'rgba(20,20,22,0.85)' : 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderTop: dark ? '0.5px solid rgba(255,255,255,0.12)' : '0.5px solid rgba(0,0,0,0.06)',
      display: 'flex', justifyContent: 'space-around',
    }}>
      {tabs.map(t => {
        const isActive = t.id === active
        const color = isActive ? C.coral : (dark ? 'rgba(255,255,255,0.5)' : C.gray500)
        return (
          <button key={t.id} onClick={() => onTab && onTab(t.id)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, width: 60,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}>
            <Icon d={t.icon} size={24} stroke={color} sw={isActive ? 2 : 1.75} />
            <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 500, color, letterSpacing: 0.1 }}>
              {t.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
