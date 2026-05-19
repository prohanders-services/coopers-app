import { useState } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import IOSGlassPill from '../components/IOSGlassPill.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'
import { useApp } from '../context/AppContext.jsx'

const COMMERCE_DATA = {
  'Le Lagon Bleu': {
    category: 'Restaurant créole',
    rating: 4.7, totalReviews: 124,
    address: 'Plage du Gosier, 97190 Le Gosier',
    phone: '+590 590 84 12 34',
    hours: 'Mer–Dim 12h–22h',
    dist: { 5: 62, 4: 27, 3: 7, 2: 3, 1: 1 },
    reviews: [
      { id: 1, name: 'Joséphine M.', rating: 5, comment: 'Vue époustouflante sur le lagon, cuisine créole raffinée. Le vivaneau au court-bouillon était fondant ! Service impeccable malgré le monde du week-end.', date: 'il y a 2 semaines' },
      { id: 2, name: 'Théo R.',      rating: 4, comment: 'Bonne table locale, produits frais et bien préparés. L\'ambiance est détendue et le cadre enchanteur. Réservation recommandée le soir.', date: 'il y a 1 mois' },
      { id: 3, name: 'Nadine C.',    rating: 5, comment: 'Le meilleur restaurant de bord de mer du Gosier. La langouste grillée est un délice absolu. On y retourne dès que possible !', date: 'il y a 2 mois' },
    ],
  },
  'Karacoli Beach': {
    category: 'Brunch & Restaurant',
    rating: 4.8, totalReviews: 156,
    address: 'Grande Anse, 97190 Le Gosier',
    phone: '+590 590 85 22 11',
    hours: 'Sam–Dim 8h–16h',
    dist: { 5: 70, 4: 20, 3: 6, 2: 3, 1: 1 },
    reviews: [
      { id: 1, name: 'Chrislène T.', rating: 5, comment: 'Le brunch dominical est une institution ! Les viennoiseries sont fraîches, le jus de goyave maison est incroyable. Vue sur la plage parfaite.', date: 'il y a 1 semaine' },
      { id: 2, name: 'Éric B.',      rating: 4, comment: 'Très bonne qualité pour un prix raisonnable. Le brunch est généreux et les produits locaux. Venez tôt, c\'est souvent complet le dimanche.', date: 'il y a 3 semaines' },
      { id: 3, name: 'Sandrine M.', rating: 5, comment: 'Ambiance magnifique directement sur la plage. Le personnel est aux petits soins et la carte change chaque semaine. Incontournable !', date: 'il y a 2 mois' },
    ],
  },
  'Aqua Plongée': {
    category: 'Sports nautiques',
    rating: 4.9, totalReviews: 203,
    address: 'Port de plaisance, 97180 Sainte-Anne',
    phone: '+590 590 88 45 67',
    hours: 'Tlj 8h–17h',
    dist: { 5: 80, 4: 14, 3: 4, 2: 1, 1: 1 },
    reviews: [
      { id: 1, name: 'Franck D.',   rating: 5, comment: 'Moniteur exceptionnel, patient et pédagogue. Première plongée de ma vie et je n\'oublierai jamais les fonds marins de Sainte-Anne. Merci !', date: 'il y a 5 jours' },
      { id: 2, name: 'Lucie V.',    rating: 5, comment: 'Matériel impeccable, briefing très professionnel. Les coraux sont magnifiques, on a vu des tortues ! Reviendrions les yeux fermés.', date: 'il y a 2 semaines' },
      { id: 3, name: 'Mathieu C.', rating: 4, comment: 'Excellente organisation, départ à l\'heure. Les fonds marins sont splendides. Petit bémol sur la taille du groupe mais ça reste une expérience top.', date: 'il y a 1 mois' },
    ],
  },
  'Catamaran Évasion': {
    category: 'Croisière & Nautique',
    rating: 4.8, totalReviews: 98,
    address: 'Marina de Saint-François, 97118 Saint-François',
    phone: '+590 590 88 71 23',
    hours: 'Mar–Dim, départ 9h',
    dist: { 5: 68, 4: 22, 3: 7, 2: 2, 1: 1 },
    reviews: [
      { id: 1, name: 'Isabelle P.', rating: 5, comment: 'Journée de rêve en catamaran ! Le repas à bord était délicieux, le snorkeling fantastique. L\'équipage est aux petits soins. Meilleure journée de nos vacances !', date: 'il y a 1 semaine' },
      { id: 2, name: 'Kevin A.',    rating: 4, comment: 'Superbe balade, cadre idyllique. Le coucher de soleil depuis le catamaran est inoubliable. Repas simple mais bon.', date: 'il y a 3 semaines' },
      { id: 3, name: 'Céline R.',  rating: 5, comment: 'Parfait pour un anniversaire en famille ! Capitaine sympathique, eaux cristallines, poissons multicolores. On recommande à 100% !', date: 'il y a 2 mois' },
    ],
  },
  'Studio Glam': {
    category: 'Coiffure & Beauté',
    rating: 4.6, totalReviews: 87,
    address: 'Centre Commercial Milénis, 97122 Baie-Mahault',
    phone: '+590 590 26 88 34',
    hours: 'Lun–Sam 9h–19h',
    dist: { 5: 55, 4: 32, 3: 9, 2: 3, 1: 1 },
    reviews: [
      { id: 1, name: 'Maëva L.',  rating: 5, comment: 'La meilleure coiffeuse de la Grande-Terre ! Elle a sublimé mes cheveux crépus en respectant leur texture naturelle. Je ne vais plus nulle part ailleurs.', date: 'il y a 4 jours' },
      { id: 2, name: 'Audrey P.', rating: 4, comment: 'Salon moderne et propre, styliste à l\'écoute. Mon balayage est parfait. Petite attente mais l\'équipe est souriante et professionnelle.', date: 'il y a 2 semaines' },
      { id: 3, name: 'Sophie T.', rating: 5, comment: 'Accueil chaleureux, produits de qualité. La coupe + soin m\'a laissé les cheveux soyeux pendant des semaines. Prix tout à fait raisonnables.', date: 'il y a 1 mois' },
    ],
  },
  'Spa Karukera': {
    category: 'Spa & Bien-être',
    rating: 4.8, totalReviews: 201,
    address: '12 Rue Frébault, 97110 Pointe-à-Pitre',
    phone: '+590 590 82 34 56',
    hours: 'Lun–Sam 9h–20h',
    dist: { 5: 68, 4: 22, 3: 7, 2: 2, 1: 1 },
    reviews: [
      { id: 1, name: 'Valérie N.',   rating: 5, comment: 'Une heure de pur bonheur ! Le massage aux huiles essentielles créoles est une merveille. Ambiance zen, personnel aux petits soins. Je repars comme neuve !', date: 'il y a 3 jours' },
      { id: 2, name: 'Stéphanie B.', rating: 5, comment: 'Meilleur spa de Guadeloupe sans hésiter. La salle est magnifique, les huiles sentent divinement bon. Réservation indispensable tellement c\'est populaire.', date: 'il y a 2 semaines' },
      { id: 3, name: 'Patrick G.',  rating: 4, comment: 'Super cadeau pour ma femme, elle est ressortie radieuse ! Massage très professionnel. Le seul bémol est le parking un peu compliqué.', date: 'il y a 5 semaines' },
    ],
  },
  'Ti Punch Bar': {
    category: 'Bar & Cocktails',
    rating: 4.6, totalReviews: 143,
    address: 'Place de la Victoire, 97110 Pointe-à-Pitre',
    phone: '+590 590 83 21 00',
    hours: 'Tlj 16h–01h',
    dist: { 5: 58, 4: 28, 3: 10, 2: 3, 1: 1 },
    reviews: [
      { id: 1, name: 'Dylan A.', rating: 5, comment: 'Happy hour exceptionnel, cocktails créoles au top ! Le ti-punch maison est le meilleur de Pointe-à-Pitre. Ambiance musicale parfaite pour commencer la soirée.', date: 'il y a 1 semaine' },
      { id: 2, name: 'Cindy V.', rating: 4, comment: 'Superbe endroit pour l\'apéro. Les tapas sont délicieuses et les cocktails bien dosés. Musique parfois un peu forte mais l\'ambiance est là !', date: 'il y a 3 semaines' },
      { id: 3, name: 'Remy C.',  rating: 5, comment: 'Incontournable avant une soirée en Guadeloupe. L\'équipe est accueillante, les rhums arrangés sont fantastiques. Happy hour vraiment généreux avec le Coops !', date: 'il y a 2 mois' },
    ],
  },
  'Parc des Mamelles': {
    category: 'Nature & Parc animalier',
    rating: 4.7, totalReviews: 315,
    address: 'Route de la Traversée, 97125 Bouillante',
    phone: '+590 590 98 83 52',
    hours: 'Mer–Lun 9h–18h',
    dist: { 5: 60, 4: 30, 3: 7, 2: 2, 1: 1 },
    reviews: [
      { id: 1, name: 'Christine F.',  rating: 5, comment: 'Magique pour les enfants ! Les paresseux, perroquets et ratons laveurs nous ont émerveillés. La tyrolienne est géniale. Prévoyez la journée entière !', date: 'il y a 6 jours' },
      { id: 2, name: 'Sébastien M.', rating: 4, comment: 'Superbe parc animalier, immersion dans la nature guadeloupéenne. Les animaux sont bien soignés. Il fait chaud, prévoyez eau et chapeau.', date: 'il y a 1 mois' },
      { id: 3, name: 'Anita R.',     rating: 5, comment: 'Vue panoramique époustouflante depuis les passerelles ! Les enfants ont adoré nourrir les animaux. Personnel passionné et pédagogue.', date: 'il y a 2 mois' },
    ],
  },
  'Jardin Botanique Deshaies': {
    category: 'Jardin tropical',
    rating: 4.8, totalReviews: 428,
    address: 'Route de Pointe-Noire, 97119 Deshaies',
    phone: '+590 590 28 43 02',
    hours: 'Tlj 9h–18h (sf lundi)',
    dist: { 5: 70, 4: 20, 3: 7, 2: 2, 1: 1 },
    reviews: [
      { id: 1, name: 'Muriel T.',            rating: 5, comment: 'Un paradis tropical ! Les flamants roses, les perroquets en liberté, les fleurs aux mille couleurs... Un émerveillement constant. L\'un des plus beaux jardins des Caraïbes.', date: 'il y a 2 semaines' },
      { id: 2, name: 'Pierre-Emmanuel L.', rating: 5, comment: 'Visité avec ma famille, tout le monde est resté bouche bée. Le soin apporté aux plantes est remarquable. Prévoir minimum 2h pour tout voir.', date: 'il y a 1 mois' },
      { id: 3, name: 'Roseline C.',         rating: 4, comment: 'Magnifique endroit mais mieux vaut y aller le matin (moins chaud). Les enfants ont adoré les macaques et les perroquets. Boutique sympa à la sortie.', date: 'il y a 3 mois' },
    ],
  },
  'Boutique Madras': {
    category: 'Mode & Artisanat local',
    rating: 4.4, totalReviews: 71,
    address: 'Rue Schoelcher, 97110 Pointe-à-Pitre',
    phone: '+590 590 83 10 45',
    hours: 'Lun–Sam 9h–18h',
    dist: { 5: 48, 4: 32, 3: 12, 2: 5, 1: 3 },
    reviews: [
      { id: 1, name: 'Christiane B.',    rating: 5, comment: 'Enfin une vraie boutique de créations locales ! Les robes madras sont magnifiques et les prix sont honnêtes. La propriétaire est passionnée et de bon conseil.', date: 'il y a 1 semaine' },
      { id: 2, name: 'Marc-Antoine V.', rating: 4, comment: 'J\'ai trouvé des cadeaux authentiques pour ma famille. Les bijoux créoles sont splendides. Livraison disponible, c\'est pratique.', date: 'il y a 3 semaines' },
      { id: 3, name: 'Bernadette H.',   rating: 5, comment: 'Coup de cœur pour cette boutique ! Les tissus madras sont de qualité, la collection est variée. On sent que c\'est fait avec amour.', date: 'il y a 2 mois' },
    ],
  },
}

function Stars({ v, size = 13 }) {
  const full  = Math.floor(v)
  const half  = v - full >= 0.5
  return (
    <span style={{ color: '#F4C24A', fontSize: size, letterSpacing: 1 }}>
      {'★'.repeat(full)}{half ? '½' : ''}
    </span>
  )
}

function RatingBar({ label, pct }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
      <div style={{ fontSize: 11, color: C.gray500, width: 10, textAlign: 'right' }}>{label}</div>
      <div style={{ flex: 1, height: 5, borderRadius: 3, background: C.gray100, overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 3, background: '#F4C24A', width: `${pct}%`, transition: 'width 0.4s' }} />
      </div>
      <div style={{ fontSize: 10, color: C.gray400, width: 28, textAlign: 'right' }}>{pct}%</div>
    </div>
  )
}

export default function CommercePage({ navigate, goBack }) {
  const { currentOffer, setCurrentOffer, userReviews, activateCoops, offers: OFFERS } = useApp()
  const [activatingId, setActivatingId] = useState(null)
  const [successOffer, setSuccessOffer] = useState(null)

  const o = currentOffer || {}
  const commerce = o.commerce || ''
  const data = COMMERCE_DATA[commerce] || {}

  const newReviews = userReviews?.[commerce] || []
  const allReviews = [...newReviews, ...(data.reviews || [])]
  const totalReviews = (data.totalReviews || allReviews.length) + newReviews.length
  const avgRating = allReviews.length > 0
    ? (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1)
    : (data.rating || 4.5).toFixed(1)

  const commerceOffers = OFFERS.filter(oc => oc.commerce === commerce)

  const goToOffer = (offer) => {
    setCurrentOffer(offer)
    navigate('offer')
  }

  const handleGetCoops = async (offer) => {
    setActivatingId(offer.id)
    const result = await activateCoops(offer)
    setActivatingId(null)
    if (!result.isDuplicate) setSuccessOffer(offer)
  }

  if (successOffer) {
    return (
      <div style={{ width: '100%', height: '100%', background: C.cream, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', color: C.ink }}>
        <div style={{ fontSize: 72 }}>🎟️</div>
        <div style={{ fontSize: 24, fontWeight: 800, marginTop: 16, letterSpacing: -0.4, textAlign: 'center' }}>Coops activé !</div>
        <div style={{ marginTop: 6, fontSize: 15, color: C.ocean, fontWeight: 600 }}>{successOffer.commerce}</div>
        <div style={{ marginTop: 4, fontSize: 13, color: C.gray500, textAlign: 'center' }}>{successOffer.title}</div>
        <button onClick={() => navigate('mycoops')} style={{
          marginTop: 28, width: '100%', padding: '16px', borderRadius: 16,
          background: C.ocean, border: 'none', cursor: 'pointer',
          color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
        }}>Voir mon Coops</button>
        <button onClick={() => setSuccessOffer(null)} style={{
          marginTop: 10, width: '100%', padding: '13px', borderRadius: 16,
          background: '#fff', border: `1px solid ${C.gray200}`, cursor: 'pointer',
          color: C.ink, fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
        }}>Continuer à explorer</button>
        <HomeIndicator />
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%', background: '#fff', position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar dark />

      {/* Hero */}
      <div style={{ position: 'relative', height: 230, flexShrink: 0 }}>
        <div style={{ position: 'absolute', inset: 0, background: o.gradient || 'linear-gradient(160deg,#FFB39A,#FF5A5F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>
          {o.emoji || '🏪'}
        </div>
        {o.imageUrl && (
          <img src={o.imageUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,0.3) 0%,rgba(0,0,0,0.1) 50%,rgba(0,0,0,0.4) 100%)' }} />

        {/* Controls */}
        <div style={{ position: 'absolute', top: 52, left: 16, right: 16, display: 'flex', justifyContent: 'space-between' }}>
          <IOSGlassPill>
            <button onClick={goBack} style={{ width: 40, height: 40, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon d={ICONS.chevL} size={18} stroke="#fff" sw={2} />
            </button>
          </IOSGlassPill>
          <IOSGlassPill>
            <button style={{ width: 40, height: 40, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon d={ICONS.share} size={16} stroke="#fff" sw={1.8} />
            </button>
          </IOSGlassPill>
        </div>

        {/* Logo medallion */}
        <div style={{
          position: 'absolute', bottom: -26, left: 20,
          width: 52, height: 52, borderRadius: 26,
          background: '#fff', border: '3px solid #fff',
          boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
        }}>
          {o.emoji || '🏪'}
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', background: C.cream, paddingBottom: 40 }}>
        {/* Commerce info */}
        <div style={{ background: '#fff', padding: '38px 20px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4, lineHeight: 1.15 }}>{commerce || 'Établissement'}</div>
              <div style={{ marginTop: 3, fontSize: 13, color: C.ocean, fontWeight: 600 }}>{data.category || o.category}</div>
            </div>
            <div style={{ padding: '5px 11px', borderRadius: 999, background: 'rgba(14,140,126,0.1)', color: C.ocean, fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>
              ● Ouvert
            </div>
          </div>

          {/* Rating row */}
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Stars v={parseFloat(avgRating)} size={15} />
            <span style={{ fontSize: 14, fontWeight: 800 }}>{avgRating}</span>
            <span style={{ fontSize: 13, color: C.gray500 }}>({totalReviews} avis)</span>
          </div>

          {/* Quick chips */}
          <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              data.address ? `📍 ${data.address.split(',')[0]}` : null,
              data.phone   ? `📞 ${data.phone}` : null,
              data.hours   ? `⏰ ${data.hours}` : null,
            ].filter(Boolean).map(chip => (
              <div key={chip} style={{ padding: '6px 12px', borderRadius: 999, background: C.gray100, fontSize: 11, fontWeight: 500, color: C.ink }}>
                {chip}
              </div>
            ))}
          </div>
        </div>

        {/* Coops disponibles */}
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 12 }}>
            Coops disponibles
          </div>
          {commerceOffers.length === 0 ? (
            <div style={{ padding: '20px', background: '#fff', borderRadius: 16, textAlign: 'center', color: C.gray400, fontSize: 13 }}>
              Aucun Coops disponible pour l'instant
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {commerceOffers.map(offer => (
                <div key={offer.id} style={{ background: '#fff', borderRadius: 16, padding: 14, border: `1px solid ${C.gray200}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                      <div style={{ width: '100%', height: '100%', background: offer.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{offer.emoji}</div>
                      {offer.imageUrl && (
                        <img src={offer.imageUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={e => { e.currentTarget.style.display = 'none' }}
                        />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, lineHeight: 1.3 }}>{offer.title}</div>
                      <div style={{ fontSize: 11, color: C.gray500, marginTop: 2 }}>Expire le {offer.expiry}</div>
                    </div>
                    <div style={{ padding: '4px 10px', borderRadius: 999, background: C.coral, color: '#fff', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>
                      -{offer.discount}%
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => goToOffer(offer)}
                      style={{
                        flex: 1, padding: '10px', borderRadius: 12,
                        background: C.gray100, border: 'none', cursor: 'pointer',
                        color: C.ink, fontSize: 12, fontWeight: 700, fontFamily: 'inherit',
                      }}
                    >
                      Voir les détails
                    </button>
                    <button
                      onClick={() => handleGetCoops(offer)}
                      disabled={activatingId === offer.id}
                      style={{
                        flex: 2, padding: '10px', borderRadius: 12,
                        background: activatingId === offer.id ? C.gray200 : C.coral,
                        border: 'none', cursor: activatingId === offer.id ? 'not-allowed' : 'pointer',
                        color: activatingId === offer.id ? C.gray400 : '#fff',
                        fontSize: 12, fontWeight: 700, fontFamily: 'inherit',
                        boxShadow: activatingId === offer.id ? 'none' : '0 3px 10px rgba(255,90,95,0.25)',
                      }}
                    >
                      {activatingId === offer.id ? 'Activation…' : 'Obtenir ce Coops'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avis clients */}
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 12 }}>
            Avis clients
          </div>

          {/* Rating summary */}
          <div style={{
            background: '#fff', borderRadius: 18, padding: 16, border: `1px solid ${C.gray200}`,
            display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14,
          }}>
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: -2, lineHeight: 1 }}>{avgRating}</div>
              <Stars v={parseFloat(avgRating)} size={16} />
              <div style={{ fontSize: 11, color: C.gray400, marginTop: 4 }}>{totalReviews} avis</div>
            </div>
            <div style={{ flex: 1 }}>
              {[5, 4, 3, 2, 1].map(n => (
                <RatingBar key={n} label={n} pct={data.dist?.[n] ?? (n === 5 ? 60 : n === 4 ? 25 : n === 3 ? 10 : n === 2 ? 3 : 2)} />
              ))}
            </div>
          </div>

          {/* Reviews list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {allReviews.map((r, i) => (
              <div key={r.id ?? i} style={{
                background: '#fff', borderRadius: 16, padding: 14, border: `1px solid ${C.gray200}`,
                ...(r.isNew ? { border: `1px solid rgba(14,140,126,0.3)`, background: 'rgba(14,140,126,0.03)' } : {}),
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 17,
                      background: 'linear-gradient(135deg,#FFB39A,#FF5A5F)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0,
                    }}>
                      {r.name?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: C.gray400, marginTop: 1 }}>{r.date}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <Stars v={r.rating} size={12} />
                    <div style={{ padding: '2px 7px', borderRadius: 999, background: 'rgba(14,140,126,0.1)', color: C.ocean, fontSize: 9, fontWeight: 700 }}>
                      Via Coopers
                    </div>
                  </div>
                </div>
                {r.comment ? (
                  <div style={{ fontSize: 13, color: C.ink, lineHeight: 1.55 }}>{r.comment}</div>
                ) : null}
              </div>
            ))}
          </div>

          {/* Leave a review button */}
          <button
            onClick={() => navigate('review')}
            style={{
              marginTop: 16, width: '100%', padding: '15px', borderRadius: 16,
              background: C.coral, border: 'none', cursor: 'pointer',
              color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
              boxShadow: '0 6px 20px rgba(255,90,95,0.25)',
            }}
          >
            ✍️ Laisser un avis
          </button>
        </div>

        <div style={{ height: 32 }} />
      </div>

      <HomeIndicator />
    </div>
  )
}
