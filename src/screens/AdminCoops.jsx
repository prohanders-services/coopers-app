import { useState } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import AdminTabBar, { AB, ABKG } from '../components/AdminTabBar.jsx'
import { C } from '../tokens.js'
import { useApp } from '../context/AppContext.jsx'

const TABS = ['Actifs', 'Brouillons', 'Expirés', 'Suspendus']
const TAB_STATUS = { Actifs: 'Actif', Brouillons: 'Brouillon', Expirés: 'Expiré', Suspendus: 'Suspendu' }

function DeleteModal({ offer, onConfirm, onCancel }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 100 }}>
      <div style={{ width: '100%', background: '#fff', borderRadius: '24px 24px 0 0', padding: '24px 20px 40px' }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: C.gray200, margin: '0 auto 20px' }} />
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Supprimer cette offre ?</div>
        <div style={{ fontSize: 14, color: C.gray500, marginBottom: 24, lineHeight: 1.5 }}>
          <strong style={{ color: C.ink }}>{offer.title}</strong><br />Cette action est irréversible.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: 14, borderRadius: 14, background: '#fff', border: `1px solid ${C.gray200}`, color: C.ink, fontSize: 15, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' }}>
            Annuler
          </button>
          <button onClick={onConfirm} style={{ flex: 1, padding: 14, borderRadius: 14, background: '#EF4444', border: 'none', color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer' }}>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}

function Toast({ msg, onDone }) {
  return (
    <div style={{
      position: 'absolute', bottom: 100, left: 16, right: 16, zIndex: 200,
      background: C.ink, color: '#fff', borderRadius: 14, padding: '14px 18px',
      fontSize: 14, fontWeight: 600, textAlign: 'center',
      boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
    }}>
      {msg}
    </div>
  )
}

function OfferCard({ offer, navigate, onSuspend, onDelete, onEdit }) {
  const isSuspended = offer.status === 'Suspendu'
  const isExpired   = offer.status === 'Expiré'

  return (
    <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: `1px solid ${C.gray200}`, marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 14px 10px' }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, flexShrink: 0, background: `${AB}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
          {offer.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, lineHeight: 1.3, marginBottom: 5 }}>{offer.title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700, color: offer.statusColor, background: offer.statusBg }}>● {offer.status}</span>
            <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700, color: AB, background: `${AB}12` }}>{offer.reduction}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', borderTop: `1px solid ${C.gray100}`, background: '#fff' }}>
        {[
          { label: 'Utilisés', val: offer.used },
          { label: 'Restants', val: offer.remaining },
          { label: 'Expire', val: offer.expiry, small: true },
        ].map((s, i) => (
          <div key={i} style={{ flex: i === 2 ? 2 : 1, padding: '8px 10px', textAlign: 'center', borderRight: i < 2 ? `1px solid ${C.gray100}` : 'none' }}>
            <div style={{ fontSize: s.small ? 10 : 15, fontWeight: 700, color: C.ink }}>{s.val}</div>
            <div style={{ fontSize: 9, color: C.gray400, marginTop: 1 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {!isExpired && (
        <div style={{ display: 'flex', gap: 8, padding: '10px 14px' }}>
          <button
            onClick={() => onEdit && onEdit(offer)}
            style={{ flex: 1, padding: '7px 4px', borderRadius: 10, border: `1px solid ${AB}`, background: AB, color: '#fff', fontSize: 11, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer' }}
          >
            ✏️ Modifier
          </button>
          {!isExpired && (
            <button
              onClick={() => onSuspend(offer.id)}
              style={{ flex: 1, padding: '7px 4px', borderRadius: 10, border: `1px solid ${C.gray200}`, background: '#fff', color: isSuspended ? '#16A34A' : '#D97706', fontSize: 11, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer' }}
            >
              {isSuspended ? '▶️ Réactiver' : '⏸️ Suspendre'}
            </button>
          )}
          <button
            onClick={() => onDelete(offer)}
            style={{ padding: '7px 10px', borderRadius: 10, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)', color: '#EF4444', fontSize: 11, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer' }}
          >
            🗑️
          </button>
        </div>
      )}
      {isExpired && (
        <div style={{ padding: '10px 14px' }}>
          <button
            onClick={() => onDelete(offer)}
            style={{ width: '100%', padding: '7px', borderRadius: 10, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)', color: '#EF4444', fontSize: 11, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer' }}
          >
            🗑️ Supprimer
          </button>
        </div>
      )}
    </div>
  )
}

export default function AdminCoops({ navigate, handleAdminTab }) {
  const { adminOffers, suspendAdminOffer, deleteAdminOffer, setCurrentEditOffer } = useApp()
  const [activeTab, setActiveTab] = useState('Actifs')
  const [toDelete,  setToDelete]  = useState(null)
  const [toast,     setToast]     = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleSuspend = (id) => {
    suspendAdminOffer(id)
    const offer = adminOffers.find(o => o.id === id)
    if (offer) showToast(offer.status === 'Suspendu' ? '✅ Offre réactivée' : '⏸️ Offre suspendue')
  }

  const handleDelete = (offer) => setToDelete(offer)

  const confirmDelete = () => {
    if (toDelete) {
      deleteAdminOffer(toDelete.id)
      setToDelete(null)
      showToast('🗑️ Offre supprimée')
    }
  }

  const offers = adminOffers.filter(o => o.status === TAB_STATUS[activeTab])
  const counts = TABS.reduce((acc, tab) => ({ ...acc, [tab]: adminOffers.filter(o => o.status === TAB_STATUS[tab]).length }), {})

  return (
    <div style={{ width: '100%', height: '100%', background: ABKG, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '0 16px', paddingBottom: 120 }}>
        {/* Header */}
        <div style={{ paddingBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
              <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.3 }}>Mes Coops</div>
              <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 9, fontWeight: 800, background: AB, color: '#fff', letterSpacing: 1, textTransform: 'uppercase' }}>Espace Pro</span>
            </div>
            <div style={{ fontSize: 12, color: C.gray500 }}>{adminOffers.filter(o => o.status === 'Actif').length} offres actives</div>
          </div>
          <button
            onClick={() => navigate('createoffer')}
            style={{ width: 40, height: 40, borderRadius: 20, background: AB, border: 'none', cursor: 'pointer', color: '#fff', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 14px rgba(37,99,235,0.4)` }}
          >+</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 18, overflowX: 'auto', paddingBottom: 4 }}>
          {TABS.map(tab => {
            const count = counts[tab]
            const active = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ padding: '8px 14px', borderRadius: 999, cursor: 'pointer', background: active ? AB : '#fff', fontFamily: 'inherit', color: active ? '#fff' : C.gray500, fontSize: 13, fontWeight: active ? 700 : 500, flexShrink: 0, border: active ? 'none' : `1px solid ${C.gray200}` }}
              >
                {tab} {count > 0 && <span style={{ marginLeft: 4, padding: '0 5px', borderRadius: 999, background: active ? 'rgba(255,255,255,0.25)' : C.gray100, fontSize: 10, fontWeight: 700 }}>{count}</span>}
              </button>
            )
          })}
        </div>

        {offers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: C.gray400 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Aucune offre dans cette catégorie</div>
            {activeTab === 'Actifs' && (
              <button
                onClick={() => navigate('createoffer')}
                style={{ marginTop: 16, padding: '12px 24px', borderRadius: 14, background: AB, color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 700 }}
              >Créer une offre</button>
            )}
          </div>
        ) : (
          offers.map(o => (
            <OfferCard key={o.id} offer={o} navigate={navigate} onSuspend={handleSuspend} onDelete={handleDelete} onEdit={(offer) => { setCurrentEditOffer(offer); navigate('editoffer') }} />
          ))
        )}
      </div>

      {toDelete && <DeleteModal offer={toDelete} onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />}
      {toast && <Toast msg={toast} />}

      <AdminTabBar active="admincoops" onTab={handleAdminTab} />
      <HomeIndicator />
    </div>
  )
}
