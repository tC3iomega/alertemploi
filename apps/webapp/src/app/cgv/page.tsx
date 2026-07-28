export default function CGVPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#F1EFE8',
        fontFamily: 'Arial, Helvetica, sans-serif',
        color: '#1E293B',
        padding: '48px 24px',
      }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <a href="/" style={{ fontSize: 13, color: '#2563EB', textDecoration: 'none' }}>
          ← Retour
        </a>

        <h1 style={{ fontSize: 28, fontWeight: 700, marginTop: 24, marginBottom: 8, letterSpacing: -0.5 }}>
          Conditions générales de vente
        </h1>
        <p style={{ fontSize: 13, color: '#64748B', marginBottom: 40 }}>Dernière mise à jour : juillet 2026</p>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>1. Objet</h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151' }}>
            Les présentes conditions générales de vente (CGV) régissent l'abonnement au service{' '}
            <strong>alertemploi.com</strong>, édité par Quentin Brugeille, entrepreneur individuel (SIREN : 984 862 417). Le service consiste
            à agréger des offres d'emploi provenant de plusieurs sites tiers et à notifier l'utilisateur par email
            lorsqu'une nouvelle offre correspond à ses critères de recherche.
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>2. Tarifs</h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151', marginBottom: 12 }}>
            Le service est proposé sous forme d'abonnement, sans engagement, selon les formules suivantes (prix TTC) :
          </p>
          <ul style={{ fontSize: 14, lineHeight: 1.8, color: '#374151', paddingLeft: 20 }}>
            <li>
              <strong>Basic</strong> — 4,99€ / mois ou 41,90€ / an
            </li>
            <li>
              <strong>Pro</strong> — 14,99€ / mois ou 125,90€ / an
            </li>
          </ul>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151', marginTop: 12 }}>
            Les tarifs affichés sur la page{' '}
            <a href="/upgrade" style={{ color: '#2563EB' }}>
              Abonnement
            </a>{' '}
            font foi et peuvent être modifiés à tout moment ; toute modification tarifaire ne s'applique qu'aux nouveaux
            abonnements ou au renouvellement suivant d'un abonnement en cours, jamais rétroactivement.
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>3. Essai gratuit</h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151' }}>
            Chaque nouvel abonnement (formule Basic ou Pro, mensuelle ou annuelle) donne droit à une période d'essai
            gratuite de <strong>7 jours</strong>, sans carte bancaire requise pour démarrer. Aucun prélèvement n'est
            effectué pendant cette période.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151', marginTop: 12 }}>
            Si l'utilisateur associe un moyen de paiement et ne résilie pas avant la fin des 7 jours, l'abonnement
            choisi démarre automatiquement à l'issue de la période d'essai et le premier prélèvement est effectué à
            cette date, au tarif en vigueur pour la formule sélectionnée. L'utilisateur peut annuler à tout moment
            pendant l'essai depuis son tableau de bord, sans frais.
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>4. Paiement et renouvellement</h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151' }}>
            Les paiements sont traités par notre prestataire <strong>Stripe</strong>. Alertemploi ne stocke aucune
            donnée bancaire. L'abonnement est reconduit automatiquement à chaque échéance (mensuelle ou annuelle selon
            la formule choisie), sauf résiliation préalable par l'utilisateur.
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>5. Résiliation</h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151' }}>
            L'utilisateur peut résilier son abonnement à tout moment, sans justification ni frais, depuis le portail de
            gestion d'abonnement accessible dans son tableau de bord. La résiliation prend effet à la{' '}
            <strong>fin de la période de facturation en cours</strong> (mensuelle ou annuelle) : l'accès au service
            reste actif jusqu'à cette date, et aucun remboursement au prorata n'est effectué pour la période déjà payée.
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>6. Droit de rétractation</h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151' }}>
            Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne peut être exercé
            pour les contrats de fourniture de contenu numérique ou de services pleinement exécutés avant la fin du
            délai de rétractation, lorsque l'exécution a commencé avec l'accord préalable exprès du consommateur. En
            souscrivant un abonnement, l'utilisateur reconnaît demander l'accès immédiat au service dès la fin de la
            période d'essai et renonce à son droit de rétractation à compter du premier prélèvement.
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>7. Responsabilité</h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151' }}>
            Alertemploi agrège des offres d'emploi provenant de sites tiers et ne garantit ni l'exactitude, ni la
            disponibilité, ni l'exhaustivité des offres affichées. Le service est fourni à titre informatif et ne
            constitue en rien un engagement de résultat quant à l'obtention d'un emploi.
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>8. Droit applicable</h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151' }}>
            Les présentes CGV sont soumises au droit français. Tout litige relatif à leur interprétation ou à leur
            exécution relève des tribunaux compétents de France.
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Contact</h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151' }}>
            Pour toute question relative à ces conditions générales de vente, contactez-nous à :<br />
            <a href="mailto:contact@alertemploi.com" style={{ color: '#2563EB' }}>
              contact@alertemploi.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
