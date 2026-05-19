import { useState } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import AdminTabBar, { AB, ABKG } from '../components/AdminTabBar.jsx'
import { C } from '../tokens.js'
import { useApp } from '../context/AppContext.jsx'

function ScanResult({ result, onConfirmValidate, onReset }) {
  const [done, setDone] = useState(false)
  const [validating, setValidating] = useState(false)
  const [doneData, setDoneData] = useState(null)

  if (done && doneData) {
    return (
      <div style={{
        position: 'absolute', inset: 0, zIndex: 20,
        background: '#fff', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '0 28px',
      }}>
        <div style={{
          width: 88, height: 88, borderRadius: 44, background: 'rgba(14,140,126,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40,
          marginBottom: 20,
        }}>✅</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, textAlign: 'center', marginBottom: 8 }}>
          Coops validé !
        </div>
        <div style={{ fontSize: 14, color: C.gray500, textAlign: 'center', lineHeight: 1.6, marginBottom: 16 }}>
          <strong>{doneData.client}</strong> a bénéficié de<br />
          <strong>{result.offer}</strong>
        </div>
        <div style={{
          padding: '14px 20px', borderRadius: 16, background: 'rgba(14,140,126,0.08)',
          border: '1px solid rgba(14,140,126,0.2)', marginBottom: 8, textAlign: 'center', width: '100%',
        }}>
          <div style={{ fontSize: 13, color: C.ocean, fontWeight: 700 }}>⭐ +10 points crédités à {doneData.client}</div>
          <div style={{ fontSize: 12, color: C.gray500, marginTop: 4 }}>
            Économie estimée : ~{doneData.savings}€ · {doneData.timeStr}
          </div>
        </div>
        <div style={{ fontSize: 11, color: C.gray400, marginBottom: 24 }}>Réf : {result.coopId}</div>
        <button
          onClick={onReset}
          style={{
            width: '100%', padding: '16px', borderRadius: 16,
            background: AB, color: '#fff', border: 'none', cursor: 'pointer',
            fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
            boxShadow: `0 6px 20px rgba(37,99,235,0.3)`,
          }}
        >
          📷 Scanner un autre Coops
        </button>
      </div>
    )
  }

  const isValid = result.type === 'valid'
  const errorMap = {
    used:    { emoji: '🔄', title: 'Coops déjà utilisé', color: '#D97706', bg: '#FEF3C7' },
    expired: { emoji: '📅', title: 'Coops expiré', color: C.coral, bg: 'rgba(255,90,95,0.08)' },
    wrong:   { emoji: '🏪', title: 'Mauvais commerce', color: C.coral, bg: 'rgba(255,90,95,0.08)' },
    invalid: { emoji: '❌', title: 'Code non reconnu', color: C.coral, bg: 'rgba(255,90,95,0.08)' },
  }
  const err = errorMap[result.type]

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 20, background: '#fff',
      overflowY: 'auto',
    }}>
      <StatusBar />
      <div style={{ padding: '16px 20px 40px' }}>
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 18, color: C.ink }}>
          Résultat du scan
        </div>

        {isValid ? (
          <div>
            <div style={{
              padding: '16px', borderRadius: 18,
              background: 'rgba(14,140,126,0.08)', border: '1.5px solid rgba(14,140,126,0.25)',
              marginBottom: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ fontSize: 28 }}>✅</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: C.ocean }}>Coops valide</div>
              </div>
              {[
                { label: 'Client',     val: result.client },
                { label: 'Offre',      val: result.offer },
                { label: 'Réduction',  val: result.reduction },
                { label: 'Conditions', val: result.conditions },
                { label: 'Expire le',  val: result.expiry },
                { label: 'Référence',  val: result.coopId },
              ].map((r, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                  paddingTop: i > 0 ? 8 : 0, borderTop: i > 0 ? '1px solid rgba(14,140,126,0.15)' : 'none',
                  marginTop: i > 0 ? 8 : 0,
                }}>
                  <span style={{ fontSize: 12, color: C.gray500, fontWeight: 600 }}>{r.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.ink, textAlign: 'right', maxWidth: '55%' }}>{r.val}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={async () => {
                  setValidating(true)
                  const res = await onConfirmValidate(result)
                  setDoneData(res)
                  setDone(true)
                }}
                disabled={validating}
                style={{
                  flex: 2, padding: '16px', borderRadius: 16,
                  background: C.ocean, color: '#fff', border: 'none', cursor: 'pointer',
                  fontSize: 16, fontWeight: 800, fontFamily: 'inherit',
                  boxShadow: '0 6px 20px rgba(14,140,126,0.35)',
                }}
              >
                {validating ? '⏳ Validation…' : '✓ Valider ce Coops'}
              </button>
              <button
                onClick={onReset}
                style={{
                  flex: 1, padding: '16px', borderRadius: 16,
                  background: 'rgba(255,90,95,0.08)', color: C.coral,
                  border: `1.5px solid rgba(255,90,95,0.25)`, cursor: 'pointer',
                  fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
                }}
              >✕ Refuser</button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{
              padding: '16px', borderRadius: 18, background: err.bg,
              border: `1.5px solid ${err.color}40`, marginBottom: 20,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ fontSize: 28 }}>{err.emoji}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: err.color }}>{err.title}</div>
              </div>
              {result.type === 'used' && (
                <div style={{ fontSize: 13, color: C.gray500 }}>
                  Ce Coops a déjà été utilisé <strong>{result.usedAt}</strong>.
                </div>
              )}
              {result.type === 'expired' && (
                <div style={{ fontSize: 13, color: C.gray500 }}>
                  L'offre « {result.offer} » a expiré le <strong>{result.expiredAt}</strong>.
                </div>
              )}
              {result.type === 'wrong' && (
                <div style={{ fontSize: 13, color: C.gray500 }}>
                  Ce Coops n'appartient pas à votre établissement ❌<br />
                  Il est valable chez <strong>{result.correctCommerce}</strong>.
                </div>
              )}
              {result.type === 'invalid' && (
                <div style={{ fontSize: 13, color: C.gray500 }}>
                  Ce code n'est pas reconnu. Vérifiez la saisie ou demandez au client d'afficher son QR code.
                </div>
              )}
              <div style={{ fontSize: 11, color: C.gray400, marginTop: 10 }}>Réf : {result.coopId}</div>
            </div>
            <button
              onClick={onReset}
              style={{
                width: '100%', padding: '16px', borderRadius: 16,
                background: AB, color: '#fff', border: 'none', cursor: 'pointer',
                fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
                boxShadow: `0 6px 20px rgba(37,99,235,0.3)`,
              }}
            >
              📷 Scanner un autre Coops
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const DEMO_MOCK = {
  valid:   { type: 'valid',   client: 'Sophie', offer: '-20% sur le plat du jour', reduction: '-20%', conditions: 'Non cumulable · 1 utilisation / semaine', expiry: '31 mai 2026', coopId: 'CP-DEMO-4821', _coop: null },
  used:    { type: 'used',    client: 'Marc',   offer: '-20% sur le plat du jour', usedAt: 'le 3 mai 2026 à 12:45', coopId: 'CP-DEMO-3301' },
  expired: { type: 'expired', offer: 'Happy Hour -30%', expiredAt: '30 avril 2026', coopId: 'CP-DEMO-1190' },
  wrong:   { type: 'wrong',   offer: 'Cocktail offert', correctCommerce: 'Le Lagon Bleu — Sainte-Anne', coopId: 'CP-DEMO-7755' },
  invalid: { type: 'invalid', coopId: 'XXXXX' },
}

const DEMO_SCENARIOS = [
  { label: '✅ Valide',        key: 'valid'   },
  { label: '🔄 Utilisé',      key: 'used'    },
  { label: '📅 Expiré',       key: 'expired' },
  { label: '🏪 Mauvais',      key: 'wrong'   },
  { label: '❌ Invalide',     key: 'invalid' },
]

export default function AdminScanner({ handleAdminTab }) {
  const { adminScanCoop, adminValidateCoop } = useApp()
  const [state,        setState]        = useState('idle')
  const [scanResult,   setScanResult]   = useState(null)
  const [manualCode,   setManualCode]   = useState('')
  const [scanningAnim, setScanningAnim] = useState(false)
  const [manualError,  setManualError]  = useState('')

  const showResult = (result) => {
    setScanResult(result)
    setState('result')
    setScanningAnim(false)
  }

  const simulateScan = (key) => {
    setScanningAnim(true)
    setManualError('')
    setTimeout(() => showResult(DEMO_MOCK[key]), 900)
  }

  // BUG 2: adminScanCoop is now async (Firestore collection-group query)
  const handleManualValidate = async () => {
    if (!manualCode.trim()) return
    setManualError('')
    setScanningAnim(true)
    try {
      const result = await adminScanCoop(manualCode.trim())
      if (result.type === 'invalid') {
        setManualError('Code non reconnu. Vérifiez la saisie.')
        setScanningAnim(false)
      } else {
        setManualCode('')
        showResult(result)
      }
    } catch (e) {
      setManualError('Erreur réseau. Réessayez.')
      setScanningAnim(false)
    }
  }

  // BUG 3: adminValidateCoop is now async — returns promise with full chain result
  const handleConfirmValidate = (result) => adminValidateCoop(result)

  const reset = () => { setState('idle'); setScanResult(null); setScanningAnim(false); setManualError('') }

  return (
    <div style={{ width: '100%', height: '100%', background: '#0A0A0F', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      {/* Camera area — top ~45% */}
      <div style={{ flexShrink: 0, height: '44%', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #0F1923 0%, #0A1628 50%, #060D18 100%)' }}>
          {/* Grain */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.04,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          }} />
        </div>

        {/* Status pill */}
        <div style={{
          position: 'absolute', top: 10, left: 0, right: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
            padding: '6px 16px', borderRadius: 999,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: 3,
              background: scanningAnim ? '#22C55E' : AB,
              boxShadow: scanningAnim ? '0 0 6px #22C55E' : `0 0 6px ${AB}`,
              display: 'inline-block',
            }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: 0.5 }}>
              {scanningAnim ? 'Recherche en cours…' : 'Prêt à scanner'}
            </span>
          </div>
        </div>

        {/* Scan frame — centered */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 160, height: 160,
        }}>
          {[
            { top: 0,    left: 0,    borderTop: 3, borderLeft: 3 },
            { top: 0,    right: 0,   borderTop: 3, borderRight: 3 },
            { bottom: 0, left: 0,    borderBottom: 3, borderLeft: 3 },
            { bottom: 0, right: 0,   borderBottom: 3, borderRight: 3 },
          ].map((corner, i) => (
            <div key={i} style={{
              position: 'absolute', width: 24, height: 24,
              borderColor: scanningAnim ? '#22C55E' : '#38BDF8',
              borderStyle: 'solid',
              borderTopWidth: corner.borderTop || 0,
              borderLeftWidth: corner.borderLeft || 0,
              borderRightWidth: corner.borderRight || 0,
              borderBottomWidth: corner.borderBottom || 0,
              borderRadius: 2,
              ...corner, transition: 'border-color 0.3s',
            }} />
          ))}
          <div style={{
            position: 'absolute', inset: 14,
            background: 'rgba(255,255,255,0.04)', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 32, opacity: 0.3 }}>⬛</span>
          </div>
        </div>
      </div>

      {/* Controls card — bottom portion */}
      <div style={{ flex: 1, background: '#F7F4EE', borderRadius: '20px 20px 0 0', padding: '18px 16px 0', overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 130 }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: C.gray500, fontWeight: 500 }}>
            Pointez la caméra vers le QR code du client
          </div>
        </div>

        {/* Manual code section */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 }}>
            Saisir le code manuellement
          </div>
          <input
            value={manualCode}
            onChange={e => { setManualCode(e.target.value.toUpperCase()); setManualError('') }}
            placeholder="CP-2026-XXXX"
            onKeyDown={e => e.key === 'Enter' && handleManualValidate()}
            style={{
              width: '100%', padding: '13px 14px', borderRadius: 12,
              background: '#fff',
              border: `1.5px solid ${manualError ? C.coral : C.gray200}`,
              color: C.ink, fontSize: 14, fontFamily: '"JetBrains Mono", monospace',
              outline: 'none', letterSpacing: 1.5, boxSizing: 'border-box',
            }}
          />
          {manualError && (
            <div style={{ marginTop: 6, fontSize: 12, color: C.coral, fontWeight: 600 }}>
              {manualError}
            </div>
          )}
        </div>

        {/* Big validate button */}
        <button
          onClick={handleManualValidate}
          disabled={!manualCode.trim() || scanningAnim}
          style={{
            width: '100%', padding: '15px', borderRadius: 14,
            background: manualCode.trim() && !scanningAnim ? AB : C.gray200,
            color: manualCode.trim() && !scanningAnim ? '#fff' : C.gray400,
            border: 'none',
            cursor: manualCode.trim() && !scanningAnim ? 'pointer' : 'not-allowed',
            fontSize: 15, fontWeight: 800, fontFamily: 'inherit',
            boxShadow: manualCode.trim() ? `0 6px 20px rgba(37,99,235,0.3)` : 'none',
            marginBottom: 16,
          }}
        >
          {scanningAnim ? '⏳ Recherche…' : '✓ Valider ce code'}
        </button>

        {/* Demo buttons */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.gray400, letterSpacing: 0.8, textTransform: 'uppercase', textAlign: 'center', marginBottom: 8 }}>
            Simuler un scan (démo)
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
            {DEMO_SCENARIOS.map(s => (
              <button
                key={s.key}
                onClick={() => simulateScan(s.key)}
                style={{
                  padding: '6px 10px', borderRadius: 999,
                  background: '#fff', border: `1px solid ${C.gray200}`,
                  color: C.ink, fontSize: 10, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scan result overlay */}
      {state === 'result' && scanResult && (
        <ScanResult
          result={scanResult}
          onConfirmValidate={handleConfirmValidate}
          onReset={reset}
        />
      )}

      <AdminTabBar active="adminscanner" onTab={handleAdminTab} />
      <HomeIndicator />
    </div>
  )
}
