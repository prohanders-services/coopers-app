import { useState } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import AdminTabBar, { AB, ABKG } from '../components/AdminTabBar.jsx'
import { C } from '../tokens.js'
import { useApp } from '../context/AppContext.jsx'

const CATEGORIES = ['🍽️ Restaurants', '🌊 Nautique', '🌿 Nature & Parcs', '🎉 Bars & Sorties', '✂️ Beauté', '🛍️ Shopping local']
const ZONES = ['Grande-Terre', 'Basse-Terre', 'Marie-Galante', 'Les Saintes', 'La Désirade']
const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

const PLANS = [
  {
    id: 'free', label: 'Gratuit', price: '0€', color: C.gray500,
    benefits: ["Jusqu'à 2 offres actives", 'Accès aux statistiques de base', 'Support par email'],
  },
  {
    id: 'standard', label: 'Standard', price: '19€/mois', color: AB, current: true,
    benefits: ["Jusqu'à 10 offres actives", 'Statistiques avancées', 'Mise en avant mensuelle', 'Support prioritaire'],
  },
  {
    id: 'premium', label: 'Premium', price: '39€/mois', color: '#8B5CF6',
    benefits: ['Offres illimitées', 'Analytics temps réel', 'Mise en avant permanente', 'Account manager dédié', 'Badge partenaire Premium'],
  },
]

const inp = {
  width: '100%', padding: '12px 14px', borderRadius: 12,
  border: `1px solid ${C.gray200}`, background: '#fff',
  fontSize: 14, fontFamily: 'inherit', outline: 'none',
  boxSizing: 'border-box', color: C.ink,
}

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: 40, height: 24, borderRadius: 12, flexShrink: 0,
        background: on ? AB : C.gray200, border: 'none', cursor: 'pointer',
        position: 'relative', padding: 0, transition: 'background 0.2s',
      }}
    >
      <div style={{
        position: 'absolute', top: 2, width: 20, height: 20, borderRadius: 10, background: '#fff',
        left: on ? 18 : 2, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
      }} />
    </button>
  )
}

export default function AdminCommerce({ navigate, resetTo, handleAdminTab }) {
  const { adminCommerce, setAdminCommerce, logout } = useApp()
  const [photo,    setPhoto]    = useState(true)
  const [name,     setName]     = useState(adminCommerce.name)
  const [cat,      setCat]      = useState(adminCommerce.category)
  const [desc,     setDesc]     = useState(adminCommerce.description)
  const [address,  setAddress]  = useState(adminCommerce.address)
  const [phone,    setPhone]    = useState(adminCommerce.phone)
  const [website,  setWebsite]  = useState(adminCommerce.website)
  const [insta,    setInsta]    = useState(adminCommerce.insta)
  const [facebook, setFacebook] = useState(adminCommerce.facebook)
  const [zone,     setZone]     = useState(adminCommerce.zone)
  const [hours,    setHours]    = useState(
    DAYS.map((d, i) => ({
      open: i < 5, from: '11:30', to: '22:00',
    }))
  )
  const [gallery,  setGallery]  = useState([true, true, true])
  const [saved,    setSaved]    = useState(false)

  const toggleHourOpen = i => setHours(prev => prev.map((h, j) => j === i ? { ...h, open: !h.open } : h))
  const updateHour = (i, field, val) => setHours(prev => prev.map((h, j) => j === i ? { ...h, [field]: val } : h))

  const save = () => {
    setAdminCommerce({ name, category: cat, description: desc, address, phone, website, insta, facebook, zone })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = () => {
    logout()
    resetTo('login')
  }

  return (
    <div style={{ width: '100%', height: '100%', background: ABKG, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      {saved && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 50,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: AB, color: '#fff',
        }}>
          <div style={{ fontSize: 52 }}>✅</div>
          <div style={{ marginTop: 16, fontSize: 20, fontWeight: 800 }}>Profil mis à jour !</div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '0 16px 100px', paddingBottom: 120 }}>
        {/* Header */}
        <div style={{ paddingBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.3 }}>Mon commerce</div>
                <span style={{
                  padding: '2px 8px', borderRadius: 999, fontSize: 9, fontWeight: 800,
                  background: AB, color: '#fff', letterSpacing: 1, textTransform: 'uppercase',
                }}>Espace Pro</span>
              </div>
              <div style={{ fontSize: 12, color: C.gray500 }}>Profil visible par les clients</div>
            </div>
          </div>
        </div>

        {/* Photo */}
        <button
          onClick={() => setPhoto(p => !p)}
          style={{
            width: '100%', height: 130, borderRadius: 18, border: 'none', cursor: 'pointer',
            background: photo
              ? `linear-gradient(160deg, ${AB}40, ${AB}80)`
              : C.gray100,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 8, marginBottom: 20, position: 'relative', overflow: 'hidden',
            fontFamily: 'inherit',
          }}
        >
          {photo && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60, opacity: 0.4 }}>🏔️</div>
          )}
          <div style={{
            position: 'absolute', bottom: 10, right: 10,
            background: 'rgba(0,0,0,0.5)', borderRadius: 999, padding: '5px 10px',
            color: '#fff', fontSize: 11, fontWeight: 700,
          }}>📷 Changer la photo</div>
        </button>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, marginBottom: 5 }}>Nom du commerce *</div>
            <input value={name} onChange={e => setName(e.target.value)} style={inp} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, marginBottom: 5 }}>Catégorie</div>
            <select value={cat} onChange={e => setCat(e.target.value)} style={{ ...inp, appearance: 'none', cursor: 'pointer' }}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, marginBottom: 5 }}>Zone géographique</div>
            <select value={zone} onChange={e => setZone(e.target.value)} style={{ ...inp, appearance: 'none', cursor: 'pointer' }}>
              {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, marginBottom: 5 }}>Description</div>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3}
              style={{ ...inp, resize: 'none', lineHeight: 1.5 }} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, marginBottom: 5 }}>Adresse</div>
            <input value={address} onChange={e => setAddress(e.target.value)} style={inp} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, marginBottom: 5 }}>Téléphone</div>
            <input value={phone} onChange={e => setPhone(e.target.value)} style={inp} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, marginBottom: 5 }}>Site web</div>
              <input value={website} onChange={e => setWebsite(e.target.value)} style={inp} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, marginBottom: 5 }}>Instagram</div>
              <input value={insta} onChange={e => setInsta(e.target.value)} style={inp} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, marginBottom: 5 }}>Facebook</div>
            <input value={facebook} onChange={e => setFacebook(e.target.value)} style={inp} />
          </div>
        </div>

        {/* Hours */}
        <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
          Horaires d'ouverture
        </div>
        <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: `1px solid ${C.gray200}`, marginBottom: 20 }}>
          {DAYS.map((day, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px',
              borderBottom: i < DAYS.length - 1 ? `1px solid ${C.gray100}` : 'none',
            }}>
              <Toggle on={hours[i].open} onChange={() => toggleHourOpen(i)} />
              <div style={{ width: 58, fontSize: 13, fontWeight: 600, color: hours[i].open ? C.ink : C.gray400 }}>
                {day.slice(0, 3)}.
              </div>
              {hours[i].open ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                  <input
                    type="time" value={hours[i].from}
                    onChange={e => updateHour(i, 'from', e.target.value)}
                    style={{ ...inp, padding: '6px 10px', flex: 1, fontSize: 13 }}
                  />
                  <span style={{ fontSize: 12, color: C.gray400 }}>–</span>
                  <input
                    type="time" value={hours[i].to}
                    onChange={e => updateHour(i, 'to', e.target.value)}
                    style={{ ...inp, padding: '6px 10px', flex: 1, fontSize: 13 }}
                  />
                </div>
              ) : (
                <div style={{ flex: 1, fontSize: 13, color: C.gray400 }}>Fermé</div>
              )}
            </div>
          ))}
        </div>

        {/* Gallery */}
        <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
          Galerie photos ({gallery.filter(Boolean).length})
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto' }}>
          {gallery.map((g, i) => (
            <div key={i} style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: 80, height: 80, borderRadius: 12,
                background: g ? `linear-gradient(135deg, ${AB}30, ${AB}60)` : C.gray100,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24,
              }}>
                {g ? '🏔️' : '📷'}
              </div>
              {g && (
                <button
                  onClick={() => setGallery(prev => prev.map((p, j) => j === i ? false : p))}
                  style={{
                    position: 'absolute', top: -6, right: -6,
                    width: 20, height: 20, borderRadius: 10, background: C.coral,
                    border: 'none', cursor: 'pointer', color: '#fff',
                    fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >×</button>
              )}
            </div>
          ))}
          <button
            onClick={() => setGallery(prev => [...prev, true])}
            style={{
              width: 80, height: 80, borderRadius: 12, flexShrink: 0,
              background: '#fff', border: `2px dashed ${C.gray200}`,
              cursor: 'pointer', fontSize: 24, color: C.gray400,
            }}
          >+</button>
        </div>

        {/* Subscription */}
        <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
          Mon abonnement Coopers
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {PLANS.map(plan => (
            <div key={plan.id} style={{
              background: '#fff', borderRadius: 16, padding: '14px',
              border: plan.current ? `2px solid ${plan.color}` : `1px solid ${C.gray200}`,
              position: 'relative',
            }}>
              {plan.current && (
                <div style={{
                  position: 'absolute', top: -1, right: 12,
                  padding: '2px 10px', borderRadius: '0 0 8px 8px',
                  background: plan.color, color: '#fff',
                  fontSize: 9, fontWeight: 800, letterSpacing: 0.5,
                }}>ACTUEL</div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: plan.color }}>{plan.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{plan.price}</div>
              </div>
              {plan.benefits.map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: i > 0 ? 4 : 0 }}>
                  <span style={{ fontSize: 11, color: plan.color }}>✓</span>
                  <span style={{ fontSize: 12, color: C.gray500 }}>{b}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: C.gray400, marginBottom: 8 }}>
          Renouvellement le <strong style={{ color: C.ink }}>1er juin 2026</strong>
        </div>
        <button
          onClick={() => navigate('partnerrequest')}
          style={{
            width: '100%', padding: '13px', borderRadius: 14,
            background: '#fff', border: `1.5px solid ${AB}40`,
            color: AB, fontSize: 14, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit', marginBottom: 20,
          }}
        >
          Gérer mon abonnement
        </button>

        {/* Save */}
        <button
          onClick={save}
          style={{
            width: '100%', padding: '16px', borderRadius: 16,
            background: AB, color: '#fff', border: 'none', cursor: 'pointer',
            fontSize: 15, fontWeight: 800, fontFamily: 'inherit',
            boxShadow: `0 6px 20px rgba(37,99,235,0.35)`,
          }}
        >
          Enregistrer les modifications
        </button>

        <button
          onClick={handleLogout}
          style={{
            marginTop: 12, width: '100%', padding: '15px', borderRadius: 16,
            background: C.coral, border: 'none',
            color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
            cursor: 'pointer', boxShadow: '0 4px 14px rgba(255,90,95,0.3)',
          }}
        >
          🚪 Se déconnecter
        </button>
      </div>

      <AdminTabBar active="admincommerce" onTab={handleAdminTab} />
      <HomeIndicator />
    </div>
  )
}
