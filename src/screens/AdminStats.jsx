import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { AB, ABKG } from '../components/AdminTabBar.jsx'
import { C } from '../tokens.js'
import { useApp } from '../context/AppContext.jsx'

const TOP_OFFERS = [
  { rank: 1, title: '-20% Plat du jour',      uses: 94, color: '#F59E0B' },
  { rank: 2, title: 'Cocktail offert',         uses: 67, color: C.gray400 },
  { rank: 3, title: '-15% Menu dégustation',   uses: 43, color: '#CD7C2F' },
]

const HOURS = [
  { h: '10h', val: 12 },
  { h: '11h', val: 18 },
  { h: '12h', val: 34 },
  { h: '13h', val: 41 },
  { h: '14h', val: 22 },
  { h: '15h', val: 14 },
  { h: '16h', val: 9  },
  { h: '17h', val: 11 },
  { h: '18h', val: 19 },
  { h: '19h', val: 38 },
  { h: '20h', val: 45 },
  { h: '21h', val: 29 },
]

const DAYS_PERF = [
  { day: 'Lun', val: 28 },
  { day: 'Mar', val: 32 },
  { day: 'Mer', val: 25 },
  { day: 'Jeu', val: 41 },
  { day: 'Ven', val: 67 },
  { day: 'Sam', val: 84 },
  { day: 'Dim', val: 38 },
]

function MetricCard({ emoji, label, value, sub, trend, trendVal, wide }) {
  const up = trend === 'up'
  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: '14px',
      border: `1px solid ${C.gray200}`,
      gridColumn: wide ? 'span 2' : 'span 1',
    }}>
      <div style={{ fontSize: 22, marginBottom: 6 }}>{emoji}</div>
      <div style={{ fontSize: wide ? 26 : 22, fontWeight: 800, color: C.ink, letterSpacing: -0.5, lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 12, color: C.gray500, marginTop: 3, lineHeight: 1.3 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: C.gray400, marginTop: 4 }}>{sub}</div>}
      {trendVal && (
        <div style={{
          marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 3,
          padding: '3px 8px', borderRadius: 999,
          background: up ? 'rgba(14,140,126,0.1)' : 'rgba(255,90,95,0.1)',
          fontSize: 11, fontWeight: 700, color: up ? C.ocean : C.coral,
        }}>
          {up ? '↑' : '↓'} {trendVal}
        </div>
      )}
    </div>
  )
}

function UpgradePrompt({ goBack, navigate }) {
  return (
    <div style={{ width: '100%', height: '100%', background: ABKG, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '0 16px 48px' }}>
        <div style={{ paddingBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={goBack} style={{ width: 38, height: 38, borderRadius: 19, background: '#fff', border: `1px solid ${C.gray200}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon d={ICONS.chevL} size={18} stroke={C.ink} sw={2} />
          </button>
          <div style={{ fontSize: 18, fontWeight: 800 }}>Statistiques avancées</div>
        </div>
        <div style={{ background: `linear-gradient(135deg, #8B5CF6, #6D28D9)`, borderRadius: 20, padding: 24, color: '#fff', marginBottom: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📈</div>
          <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 8 }}>Fonctionnalité Premium</div>
          <div style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.5 }}>
            Les statistiques avancées sont réservées aux partenaires Premium. Passez à l'offre supérieure pour débloquer cette fonctionnalité.
          </div>
        </div>
        {[
          { emoji: '📊', label: 'Analytics temps réel', desc: 'Visualisez vos données au fil de la journée' },
          { emoji: '🕐', label: 'Heures de pointe', desc: 'Identifiez vos meilleures plages horaires' },
          { emoji: '🏆', label: 'Top offres', desc: 'Vos offres les plus performantes' },
          { emoji: '💡', label: 'Insights automatiques', desc: 'Recommandations personnalisées par IA' },
        ].map((f, i) => (
          <div key={i} style={{ display: 'flex', gap: 14, padding: '12px 16px', background: '#fff', borderRadius: 14, marginBottom: 10, border: `1px solid ${C.gray200}` }}>
            <span style={{ fontSize: 24 }}>{f.emoji}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{f.label}</div>
              <div style={{ fontSize: 12, color: C.gray500, marginTop: 2 }}>{f.desc}</div>
            </div>
          </div>
        ))}
        <button
          onClick={() => navigate('admincommerce')}
          style={{ width: '100%', padding: 16, borderRadius: 16, background: '#8B5CF6', border: 'none', color: '#fff', fontSize: 15, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer', marginTop: 8, boxShadow: '0 6px 20px rgba(139,92,246,0.4)' }}
        >
          Passer à Premium — 39€/mois
        </button>
      </div>
      <HomeIndicator />
    </div>
  )
}

export default function AdminStats({ goBack, navigate }) {
  const { adminCommerce, adminStats } = useApp()
  const maxHour = Math.max(...HOURS.map(h => h.val))
  const maxDay  = Math.max(...DAYS_PERF.map(d => d.val))

  if (adminCommerce.subscriptionPlan !== 'premium') {
    return <UpgradePrompt goBack={goBack} navigate={navigate} />
  }

  return (
    <div style={{ width: '100%', height: '100%', background: ABKG, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '0 16px 48px', paddingBottom: 120 }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.3 }}>Statistiques</div>
              <span style={{
                padding: '2px 8px', borderRadius: 999, fontSize: 9, fontWeight: 800,
                background: AB, color: '#fff', letterSpacing: 1, textTransform: 'uppercase',
              }}>Espace Pro</span>
            </div>
            <div style={{ fontSize: 12, color: C.gray500 }}>Performance & Analyse</div>
          </div>
        </div>

        {/* Key metrics grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          <MetricCard emoji="🔄" label="Taux de retour clients" value="62%" trendVal="+5% vs mois dernier" trend="up" />
          <MetricCard emoji="🆕" label="Nouveaux clients ce mois" value={String(42 + adminStats.clientsUniques.length)} sub="via Coopers" trendVal="+12 vs mois dernier" trend="up" />
          <MetricCard emoji="💰" label="Économies totales générées" value={`${(8420 + adminStats.economies).toLocaleString('fr-FR')} €`} sub="depuis votre inscription" wide />
          <MetricCard emoji="⭐" label="Note moyenne Coopers" value="4,7 / 5" sub="Basée sur 89 avis" />
          <MetricCard emoji="✅" label="Validations ce mois" value={String(284 + adminStats.validations)} trendVal="+18% vs mois précédent" trend="up" />
        </div>

        {/* Top 3 offers */}
        <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
          Top 3 offres les plus utilisées
        </div>
        <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: `1px solid ${C.gray200}`, marginBottom: 16 }}>
          {TOP_OFFERS.map((o, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px',
              borderBottom: i < TOP_OFFERS.length - 1 ? `1px solid ${C.gray100}` : 'none',
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 15, flexShrink: 0,
                background: `${o.color}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 800, color: o.color,
              }}>
                {o.rank}
              </div>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: C.ink }}>{o.title}</div>
              <div style={{
                padding: '4px 10px', borderRadius: 999,
                background: `${o.color}18`, fontSize: 12, fontWeight: 800, color: o.color,
              }}>
                {o.uses}×
              </div>
            </div>
          ))}
        </div>

        {/* Peak hours chart */}
        <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
          Heures de pointe
        </div>
        <div style={{ background: '#fff', borderRadius: 18, padding: '14px', border: `1px solid ${C.gray200}`, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 60, overflowX: 'auto' }}>
            {HOURS.map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 24 }}>
                <div style={{
                  width: '80%', borderRadius: '3px 3px 0 0',
                  height: `${(h.val / maxHour) * 46}px`,
                  background: h.val >= 38 ? AB : `${AB}50`,
                  minHeight: 2,
                }} />
                <div style={{ fontSize: 8, color: C.gray400 }}>{h.h}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: C.gray400, marginTop: 8, textAlign: 'center' }}>
            Pic d'activité : <strong style={{ color: C.ink }}>19h – 21h</strong>
          </div>
        </div>

        {/* Day of week */}
        <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
          Jour le plus actif
        </div>
        <div style={{ background: '#fff', borderRadius: 18, padding: '14px', border: `1px solid ${C.gray200}`, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 64 }}>
            {DAYS_PERF.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: i === 5 ? AB : 'transparent' }}>{d.val}</div>
                <div style={{
                  width: '100%', borderRadius: '4px 4px 0 0',
                  height: `${(d.val / maxDay) * 44}px`,
                  background: i === 5 ? AB : `${AB}40`,
                  minHeight: 3,
                }} />
                <div style={{ fontSize: 9, color: i === 5 ? AB : C.gray400, fontWeight: i === 5 ? 700 : 500 }}>{d.day}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: C.gray400, marginTop: 8, textAlign: 'center' }}>
            Meilleur jour : <strong style={{ color: C.ink }}>Samedi</strong> · 84 validations en moyenne
          </div>
        </div>

        {/* Auto-insight */}
        <div style={{
          background: `linear-gradient(135deg, ${AB}12, ${AB}04)`,
          border: `1.5px solid ${AB}30`,
          borderRadius: 18, padding: '16px',
          marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, background: `${AB}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0,
            }}>💡</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: AB, marginBottom: 6 }}>
                Insight automatique
              </div>
              <div style={{ fontSize: 13, color: C.ink, lineHeight: 1.6 }}>
                Vos Coops du <strong>vendredi soir</strong> génèrent <strong>3× plus</strong> d'utilisations que la moyenne.
                Pensez à créer une offre spéciale vendredi pour maximiser votre impact !
              </div>
            </div>
          </div>
        </div>

        <div style={{
          padding: '12px 14px', borderRadius: 14,
          background: 'rgba(14,140,126,0.06)', border: '1px solid rgba(14,140,126,0.18)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 18 }}>🏆</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.ocean }}>Parmi le top 15% des partenaires Coopers</div>
            <div style={{ fontSize: 11, color: C.gray500, marginTop: 2 }}>en termes d'utilisations ce mois-ci</div>
          </div>
        </div>
      </div>

      <HomeIndicator />
    </div>
  )
}
