import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'

const SECTIONS = [
  {
    title: '1. Objet et description du service',
    content: `Coopers est une application mobile et web de bons plans et de fidélité à destination des résidents et visiteurs de Guadeloupe. Elle met en relation des utilisateurs (les « Membres ») avec des commerces partenaires locaux (les « Partenaires ») proposant des offres promotionnelles appelées « Coops ».

L'application est éditée par Coopers SAS, société par actions simplifiée au capital de 10 000 €, immatriculée au RCS de Pointe-à-Pitre sous le numéro 987 654 321, dont le siège social est situé au 12 rue de la République, 97100 Basse-Terre, Guadeloupe (France).`,
  },
  {
    title: '2. Acceptation des conditions',
    content: `L'utilisation de l'application Coopers implique l'acceptation pleine et entière des présentes Conditions Générales d'Utilisation (CGU). Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser l'application.

Ces CGU peuvent être modifiées à tout moment par Coopers SAS. Les modifications entrent en vigueur dès leur publication dans l'application. Il appartient à l'utilisateur de consulter régulièrement les CGU en vigueur.`,
  },
  {
    title: '3. Inscription et compte utilisateur',
    content: `Pour accéder aux fonctionnalités de l'application, le Membre doit créer un compte en fournissant des informations exactes, complètes et à jour : prénom, nom, adresse e-mail, zone géographique et catégories d'intérêt.

Le Membre est responsable de la confidentialité de ses identifiants de connexion. Tout accès à l'application via son compte est réputé effectué par le Membre. En cas de perte ou de vol, le Membre doit notifier immédiatement Coopers à l'adresse contact@coopers.gp.

Coopers SAS se réserve le droit de suspendre ou supprimer tout compte en cas d'utilisation abusive, frauduleuse ou contraire aux présentes CGU.`,
  },
  {
    title: '4. Utilisation des Coops',
    content: `Les Coops sont des bons de réduction ou avantages exclusifs proposés par les Partenaires. Chaque Coop est soumis à des conditions particulières (durée de validité, nombre d'utilisations, restrictions) précisées sur sa fiche descriptive.

L'activation d'un Coop génère un QR code personnel et non cessible. Le Membre s'engage à :
• N'utiliser les Coops que pour son usage personnel
• Ne pas revendre, céder ou partager ses Coops
• Respecter les conditions d'utilisation de chaque Coop
• Présenter le QR code valide lors du passage en caisse

Les Coops non utilisés dans le délai imparti sont automatiquement invalidés sans compensation.`,
  },
  {
    title: '5. Programme de points Coopers',
    content: `Chaque Coop activé ou validé génère des points Coopers crédités sur le compte du Membre. Les points peuvent être obtenus par : activation de Coops, validation par un Partenaire, rédaction d'avis, parrainage de nouveaux membres, réalisation de défis.

Les points Coopers n'ont pas de valeur monétaire et ne sont pas échangeables contre de l'argent. Ils permettent d'accéder à des avantages au sein du programme de fidélité Coopers. Les points expirent 12 mois après leur dernière activité.`,
  },
  {
    title: '6. Propriété intellectuelle',
    content: `L'ensemble des éléments composant l'application Coopers (marque, logo, interface, textes, images, algorithmes) est protégé par le droit de la propriété intellectuelle et appartient à Coopers SAS ou ses concédants.

Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments de l'application, quel que soit le moyen ou le procédé utilisé, est interdite sans autorisation écrite préalable de Coopers SAS.`,
  },
  {
    title: '7. Responsabilité',
    content: `Coopers SAS est un intermédiaire entre les Membres et les Partenaires. Elle ne peut être tenue responsable :
• De la qualité des produits ou services offerts par les Partenaires
• Des inexactitudes dans les offres communiquées par les Partenaires
• De l'indisponibilité temporaire de l'application pour maintenance
• Des pertes de données causées par des événements hors de son contrôle

Les Partenaires sont seuls responsables de l'exécution des offres qu'ils proposent.`,
  },
  {
    title: '8. Données personnelles',
    content: `Coopers SAS collecte et traite des données personnelles dans le cadre de l'utilisation de l'application. Ces traitements sont effectués conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.

Pour en savoir plus sur la collecte, l'utilisation et la protection de vos données personnelles, veuillez consulter notre Politique de Confidentialité accessible depuis l'application.`,
  },
  {
    title: '9. Suppression du compte',
    content: `Le Membre peut supprimer son compte à tout moment depuis les paramètres de l'application (Menu > Paramètres > Supprimer mon compte) ou en contactant contact@coopers.gp.

La suppression du compte entraîne la perte définitive de tous les Coops actifs, du solde de points Coopers et de l'historique des activités. Les données sont supprimées conformément à notre Politique de Confidentialité dans un délai de 30 jours.`,
  },
  {
    title: '10. Droit applicable et juridiction',
    content: `Les présentes CGU sont régies par le droit français. En cas de litige relatif à l'interprétation ou à l'exécution des présentes CGU, les parties s'efforceront de trouver une solution amiable. À défaut, les tribunaux compétents de Pointe-à-Pitre, Guadeloupe, seront seuls compétents.

Date de dernière mise à jour : 1er mai 2026
Contact : contact@coopers.gp`,
  },
]

export default function CGU({ goBack }) {
  return (
    <div style={{ width: '100%', height: '100%', background: C.cream, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 60 }}>
        {/* Header */}
        <div style={{ padding: '0 20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={goBack} style={{
            width: 38, height: 38, borderRadius: 19, background: '#fff',
            border: `1px solid ${C.gray200}`, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon d={ICONS.chevL} size={18} stroke={C.ink} sw={2} />
          </button>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>Conditions Générales d'Utilisation</div>
            <div style={{ fontSize: 11, color: C.gray500, marginTop: 1 }}>Version du 1er mai 2026</div>
          </div>
        </div>

        <div style={{ padding: '0 20px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Intro */}
          <div style={{
            padding: '14px 16px', borderRadius: 14,
            background: 'rgba(14,140,126,0.06)', border: '1px solid rgba(14,140,126,0.15)',
            fontSize: 13, color: C.ocean, fontWeight: 600, lineHeight: 1.5,
          }}>
            Coopers · Application de bons plans et fidélité en Guadeloupe<br />
            Coopers SAS — 12 rue de la République, 97100 Basse-Terre
          </div>

          {SECTIONS.map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.ink, marginBottom: 10, letterSpacing: -0.2 }}>
                {s.title}
              </div>
              <div style={{
                fontSize: 13, color: C.gray500, lineHeight: 1.65,
                background: '#fff', borderRadius: 14, padding: '14px 16px',
                border: `1px solid ${C.gray200}`,
                whiteSpace: 'pre-line',
              }}>
                {s.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      <HomeIndicator />
    </div>
  )
}
