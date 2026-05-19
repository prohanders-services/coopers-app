import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'

const SECTIONS = [
  {
    title: '1. Responsable du traitement',
    content: `Coopers SAS (ci-après « Coopers »), société par actions simplifiée, dont le siège social est situé au 12 rue de la République, 97100 Basse-Terre, Guadeloupe, est responsable du traitement de vos données personnelles.

Délégué à la Protection des Données (DPO) : Mme Sophie Laurent
Contact DPO : dpo@coopers.gp | +590 590 XX XX XX`,
  },
  {
    title: '2. Données collectées',
    content: `Lors de votre inscription et de l'utilisation de l'application Coopers, nous collectons les données suivantes :

Données d'identification :
• Prénom, nom de famille
• Adresse e-mail
• Numéro de téléphone (optionnel)
• Date de naissance (optionnel)

Données de localisation et préférences :
• Zone géographique (Grande-Terre, Basse-Terre, etc.)
• Catégories d'intérêt sélectionnées

Données d'utilisation :
• Historique des Coops activés et utilisés
• Avis et notations déposés
• Solde et historique des points Coopers
• Code de parrainage et liste des filleuls

Données techniques :
• Adresse IP, type d'appareil, système d'exploitation
• Journaux de connexion et d'utilisation
• Données de cookies et traceurs (voir section 8)`,
  },
  {
    title: '3. Finalités et bases légales',
    content: `Vos données sont utilisées aux fins suivantes :

• Création et gestion de votre compte (base légale : exécution du contrat)
• Affichage des offres Coops adaptées à votre zone et vos intérêts (base légale : exécution du contrat)
• Gestion du programme de fidélité et des points (base légale : exécution du contrat)
• Envoi de notifications relatives à vos Coops (base légale : exécution du contrat)
• Envoi d'offres promotionnelles personnalisées par e-mail ou notification push (base légale : consentement — révocable à tout moment)
• Amélioration de l'application par analyses statistiques anonymisées (base légale : intérêt légitime)
• Respect des obligations légales et comptables (base légale : obligation légale)`,
  },
  {
    title: '4. Destinataires des données',
    content: `Vos données personnelles peuvent être partagées avec :

• Les commerces partenaires Coopers : uniquement lors de la validation d'un Coop (prénom et informations de l'offre uniquement)
• Nos prestataires techniques : hébergement (Firebase/Google Cloud), analytics (anonymisés), envoi d'e-mails
• Les autorités compétentes : uniquement sur réquisition judiciaire ou légale

Coopers ne vend jamais vos données personnelles à des tiers. Aucun transfert de données hors Union Européenne n'est effectué sans garanties appropriées (clauses contractuelles types).`,
  },
  {
    title: '5. Durée de conservation',
    content: `Vos données sont conservées selon les durées suivantes :

• Données de compte actif : pendant toute la durée de votre utilisation de l'application + 3 ans après la dernière connexion
• Historique des transactions : 5 ans (obligation comptable et fiscale)
• Données de cookies : 13 mois maximum
• Journaux techniques : 12 mois

En cas de suppression de votre compte, vos données sont effacées dans un délai de 30 jours, à l'exception des données devant être conservées pour des obligations légales.`,
  },
  {
    title: '6. Vos droits (RGPD)',
    content: `Conformément au Règlement Général sur la Protection des Données (UE 2016/679) et à la loi Informatique et Libertés, vous disposez des droits suivants :

• Droit d'accès : obtenir une copie de vos données personnelles
• Droit de rectification : corriger des données inexactes ou incomplètes
• Droit à l'effacement (« droit à l'oubli ») : demander la suppression de vos données
• Droit à la limitation du traitement : restreindre l'utilisation de vos données
• Droit à la portabilité : recevoir vos données dans un format structuré et lisible
• Droit d'opposition : vous opposer à certains traitements, notamment à des fins de prospection commerciale
• Droit de retirer votre consentement à tout moment pour les traitements fondés sur celui-ci

Pour exercer vos droits : dpo@coopers.gp ou par courrier à Coopers SAS — DPO, 12 rue de la République, 97100 Basse-Terre.

Délai de réponse : 1 mois (pouvant être prolongé de 2 mois en cas de complexité).

Vous avez également le droit d'introduire une réclamation auprès de la CNIL (www.cnil.fr) si vous estimez que vos droits ne sont pas respectés.`,
  },
  {
    title: '7. Sécurité des données',
    content: `Coopers met en œuvre les mesures techniques et organisationnelles appropriées pour assurer la sécurité de vos données :

• Chiffrement des données en transit (HTTPS/TLS 1.3)
• Chiffrement des mots de passe (bcrypt)
• Contrôle d'accès strict aux bases de données
• Authentification à deux facteurs pour les accès administrateurs
• Audits de sécurité réguliers

En cas de violation de données susceptible d'engendrer un risque élevé pour vos droits et libertés, vous en serez informé dans les meilleurs délais conformément à l'article 34 du RGPD.`,
  },
  {
    title: '8. Cookies et traceurs',
    content: `L'application Coopers utilise des cookies et technologies similaires pour :

Cookies strictement nécessaires (pas de consentement requis) :
• Maintien de votre session de connexion
• Mémorisation de vos préférences de langue

Cookies fonctionnels (soumis à consentement) :
• Mémorisation de vos paramètres (zone, catégories)
• Personnalisation de l'expérience

Cookies analytiques (soumis à consentement) :
• Mesure d'audience anonymisée (nombre de visites, pages consultées)
• Amélioration de l'application

Vous pouvez gérer vos préférences cookies depuis les paramètres de l'application (Menu > Paramètres > Cookies et vie privée).`,
  },
  {
    title: '9. Modification de la politique',
    content: `Coopers se réserve le droit de modifier la présente Politique de Confidentialité à tout moment pour refléter les évolutions légales, réglementaires ou techniques.

En cas de modification substantielle, vous en serez informé par notification dans l'application ou par e-mail. La date de dernière mise à jour est indiquée en bas de ce document.

Contact : dpo@coopers.gp
Date de dernière mise à jour : 1er mai 2026`,
  },
]

export default function PrivacyPolicy({ goBack }) {
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
            <div style={{ fontSize: 17, fontWeight: 700 }}>Politique de Confidentialité</div>
            <div style={{ fontSize: 11, color: C.gray500, marginTop: 1 }}>Version du 1er mai 2026 · Conforme RGPD</div>
          </div>
        </div>

        <div style={{ padding: '0 20px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Intro */}
          <div style={{
            padding: '14px 16px', borderRadius: 14,
            background: 'rgba(14,140,126,0.06)', border: '1px solid rgba(14,140,126,0.15)',
            fontSize: 13, color: C.ocean, fontWeight: 600, lineHeight: 1.5,
          }}>
            🔒 Vos données personnelles sont traitées conformément au RGPD (UE 2016/679) et à la loi Informatique et Libertés. Coopers s'engage à protéger votre vie privée.
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
