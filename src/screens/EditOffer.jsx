import { useState } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { AB, ABKG } from '../components/AdminTabBar.jsx'
import { C } from '../tokens.js'
import { useApp } from '../context/AppContext.jsx'

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const REDUCTION_TYPES = ['Pourcentage', 'Montant fixe', 'Offre spéciale']
const CATEGORIES = ['🍽️ Restaurants', '🌊 Nautique', '🌿 Nature & Parcs', '🎉 Bars & Sorties', '✂️ Beauté', '🛍️ Shopping local']

const inp = {
  width: '100%', padding: '12px 14px', borderRadius: 12,
  border: `1px solid ${C.gray200}`, background: '#fff',
  fontSize: 14, fontFamily: 'inherit', outline: 'none',
  boxSizing: 'border-box', color: C.ink,
}

function SectionTitle({ children }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 800, color: AB, letterSpacing: 1.2,
      textTransform: 'uppercase', marginBottom: 12, marginTop: 4,
      display: 'flex', alignItems: 'center', gap: 6,
    }}>
      <div style={{ flex: 1, height: 1, background: `${AB}25` }} />
      {children}
      <div style={{ flex: 1, height: 1, background: `${AB}25` }} />
    </div>
  )
}

function Field({ label, required, children, hint }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, marginBottom: 5 }}>
        {label}{required && <span style={{ color: C.coral, marginLeft: 2 }}>*</span>}
      </div>
      {children}
      {hint && <div style={{ fontSize: 11, color: C.gray400, marginTop: 4 }}>{hint}</div>}
    </div>
  )
}

function Toggle({ on, onChange, small }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: small ? 38 : 46, height: small ? 22 : 26, borderRadius: 13, flexShrink: 0,
        background: on ? AB : C.gray200, border: 'none', cursor: 'pointer',
        position: 'relative', padding: 0, transition: 'background 0.2s',
      }}
    >
      <div style={{
        position: 'absolute', top: small ? 2 : 3,
        width: small ? 18 : 20, height: small ? 18 : 20,
        borderRadius: 999, background: '#fff',
        left: on ? (small ? 17 : 23) : 3,
        transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
      }} />
    </button>
  )
}

export default function EditOffer({ goBack }) {
  const { currentEditOffer, editAdminOffer } = useApp()
  const offer = currentEditOffer || {}

  const parseValue = (reduction) => {
    if (!reduction) return ''
    const num = reduction.replace(/[^0-9.]/g, '')
    return num
  }
  const parseType = (reduction) => {
    if (!reduction) return 'Pourcentage'
    if (reduction.includes('%')) return 'Pourcentage'
    if (reduction.includes('€')) return 'Montant fixe'
    return 'Offre spéciale'
  }

  const [title,         setTitle]         = useState(offer.title || '')
  const [desc,          setDesc]          = useState(offer.desc || '')
  const [category,      setCategory]      = useState(offer.category || CATEGORIES[0])
  const [reductionType, setReductionType] = useState(parseType(offer.reduction))
  const [value,         setValue]         = useState(parseValue(offer.reduction))
  const [originalPrice, setOriginalPrice] = useState(offer.originalPrice || '')
  const [startDate,     setStartDate]     = useState(offer.startDate || '')
  const [endDate,       setEndDate]       = useState(offer.endDate || '')
  const [activeDays,    setActiveDays]    = useState(new Set([0,1,2,3,4,5,6]))
  const [minOrder,      setMinOrder]      = useState(offer.minOrder || '')
  const [maxTotal,      setMaxTotal]      = useState(offer.maxTotal ? String(offer.maxTotal) : '')
  const [maxPerPerson,  setMaxPerPerson]  = useState('1')
  const [conditions,    setConditions]    = useState(offer.conditions || '')
  const [isLoyalty,     setIsLoyalty]     = useState(false)
  const [pointsReq,     setPointsReq]     = useState('')
  const [featured,      setFeatured]      = useState(false)
  const [saved,         setSaved]         = useState(false)

  const toggleDay = d => setActiveDays(prev => {
    const next = new Set(prev)
    next.has(d) ? next.delete(d) : next.add(d)
    return next
  })

  const canSave = title.trim() && value.trim()

  const save = () => {
    if (!canSave || !offer.id) return
    const newReduction = reductionType === 'Pourcentage' ? `-${value}%`
      : reductionType === 'Montant fixe' ? `-${value}€`
      : value || 'Spéciale'
    editAdminOffer(offer.id, {
      title,
      reduction: newReduction,
      remaining: parseInt(maxTotal) || offer.remaining || 100,
      expiry: endDate || offer.expiry || 'Non définie',
    })
    setSaved(true)
    setTimeout(() => { setSaved(false); goBack() }, 1800)
  }

  const reductionLabel = reductionType === 'Pourcentage' ? `${value || '0'}%`
    : reductionType === 'Montant fixe' ? `-${value || '0'}€`
    : value || 'Spéciale'

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
          <div style={{ marginTop: 16, fontSize: 20, fontWeight: 800 }}>Offre mise à jour !</div>
          <div style={{ marginTop: 8, fontSize: 14, opacity: 0.8 }}>Modifications enregistrées</div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '0 16px 40px', paddingBottom: 80 }}>
        {/* Header */}
        <div style={{ paddingBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={goBack} style={{
            width: 38, height: 38, borderRadius: 19, background: '#fff',
            border: `1px solid ${C.gray200}`, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon d={ICONS.chevL} size={18} stroke={C.ink} sw={2} />
          </button>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.3 }}>Modifier l'offre</div>
            <div style={{ fontSize: 11, color: AB, fontWeight: 600 }}>ESPACE PRO</div>
          </div>
        </div>

        {/* Live preview */}
        <div style={{
          background: `linear-gradient(135deg, ${AB}15, ${AB}05)`,
          border: `1px solid ${AB}30`, borderRadius: 16,
          padding: '12px 14px', marginBottom: 20,
        }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: AB, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 }}>
            Aperçu client
          </div>
          <div style={{
            background: '#fff', borderRadius: 14, padding: '12px',
            display: 'flex', gap: 12, alignItems: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12, background: `${AB}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0,
            }}>
              {offer.emoji || '🍽️'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 3 }}>
                {title || 'Titre de l\'offre'}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <span style={{
                  padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 800,
                  background: C.coral, color: '#fff',
                }}>
                  {reductionLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Informations */}
          <SectionTitle>Informations</SectionTitle>
          <Field label="Catégorie" required>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...inp, appearance: 'none', cursor: 'pointer' }}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Titre de l'offre" required>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Ex : -20% sur le plat du jour" style={inp} />
          </Field>
          <Field label="Description">
            <textarea value={desc} onChange={e => setDesc(e.target.value)}
              placeholder="Décrivez l'offre en quelques mots…" rows={3}
              style={{ ...inp, resize: 'none', lineHeight: 1.5 }} />
          </Field>
          <Field label="Type de réduction" required>
            <div style={{ display: 'flex', gap: 6 }}>
              {REDUCTION_TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setReductionType(t)}
                  style={{
                    flex: 1, padding: '9px 4px', borderRadius: 10, border: 'none',
                    background: reductionType === t ? AB : C.gray100,
                    color: reductionType === t ? '#fff' : C.ink,
                    fontSize: 11, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </Field>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <Field label="Valeur" required>
                <input value={value} onChange={e => setValue(e.target.value)}
                  placeholder={reductionType === 'Pourcentage' ? '20' : reductionType === 'Montant fixe' ? '5.00' : 'Description'}
                  style={inp} />
              </Field>
            </div>
            <div style={{ flex: 1 }}>
              <Field label="Prix original (optionnel)">
                <input value={originalPrice} onChange={e => setOriginalPrice(e.target.value)}
                  placeholder="Ex : 25.00 €" style={inp} />
              </Field>
            </div>
          </div>

          {/* Conditions */}
          <SectionTitle>Conditions</SectionTitle>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <Field label="Date début">
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={inp} />
              </Field>
            </div>
            <div style={{ flex: 1 }}>
              <Field label="Date fin">
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={inp} />
              </Field>
            </div>
          </div>
          <Field label="Jours valides">
            <div style={{ display: 'flex', gap: 6 }}>
              {DAYS.map((d, i) => (
                <button
                  key={i}
                  onClick={() => toggleDay(i)}
                  style={{
                    flex: 1, padding: '8px 2px', borderRadius: 8, border: 'none',
                    background: activeDays.has(i) ? AB : C.gray100,
                    color: activeDays.has(i) ? '#fff' : C.gray500,
                    fontSize: 10, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </Field>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <Field label="Commande minimum">
                <input value={minOrder} onChange={e => setMinOrder(e.target.value)}
                  placeholder="Ex : 15 €" style={inp} />
              </Field>
            </div>
            <div style={{ flex: 1 }}>
              <Field label="Max utilisations total">
                <input value={maxTotal} onChange={e => setMaxTotal(e.target.value)}
                  placeholder="Ex : 100" style={inp} />
              </Field>
            </div>
          </div>
          <Field label="Max par personne / semaine">
            <input value={maxPerPerson} onChange={e => setMaxPerPerson(e.target.value)}
              placeholder="Ex : 1" style={inp} />
          </Field>
          <Field label="Conditions particulières">
            <textarea value={conditions} onChange={e => setConditions(e.target.value)}
              placeholder="Ex : Non cumulable avec d'autres offres…" rows={2}
              style={{ ...inp, resize: 'none', lineHeight: 1.5 }} />
          </Field>

          {/* Type */}
          <SectionTitle>Type d'offre</SectionTitle>
          <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${C.gray200}` }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '13px 14px', borderBottom: isLoyalty ? `1px solid ${C.gray100}` : 'none' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Offre fidélité exclusive</div>
                <div style={{ fontSize: 12, color: C.gray500, marginTop: 2 }}>Réservée aux clients avec un palier minimum</div>
              </div>
              <Toggle on={isLoyalty} onChange={setIsLoyalty} />
            </div>
            {isLoyalty && (
              <div style={{ padding: '12px 14px' }}>
                <Field label="Points minimum requis">
                  <input value={pointsReq} onChange={e => setPointsReq(e.target.value)}
                    placeholder="Ex : 500 points" style={inp} />
                </Field>
              </div>
            )}
          </div>

          {/* Mise en avant */}
          <SectionTitle>Mise en avant</SectionTitle>
          <div style={{
            background: '#fff', borderRadius: 14, border: `1px solid ${featured ? AB : C.gray200}`,
            padding: '13px 14px', display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, background: featured ? '#FEF3C7' : C.gray100,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0,
            }}>⭐</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Mettre en avant</div>
              <div style={{ fontSize: 12, color: C.gray500, marginTop: 2 }}>Affichée en priorité dans les résultats</div>
            </div>
            <Toggle on={featured} onChange={setFeatured} />
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={save}
            style={{
              width: '100%', padding: '16px', borderRadius: 16,
              background: canSave ? AB : C.gray200,
              color: canSave ? '#fff' : C.gray400,
              border: 'none', cursor: canSave ? 'pointer' : 'not-allowed',
              fontSize: 15, fontWeight: 800, fontFamily: 'inherit',
              boxShadow: canSave ? `0 6px 20px rgba(37,99,235,0.35)` : 'none',
            }}
          >
            ✅ Enregistrer les modifications
          </button>
          <button
            onClick={goBack}
            style={{
              width: '100%', padding: '12px', borderRadius: 16,
              background: 'none', color: C.gray500,
              border: `1px solid ${C.gray200}`, cursor: 'pointer',
              fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
            }}
          >
            Annuler
          </button>
        </div>
      </div>

      <HomeIndicator />
    </div>
  )
}
