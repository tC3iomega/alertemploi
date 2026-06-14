export default function ConfidentialitePage() {
  return (
    <main style={{
      minHeight: '100vh', background: '#F1EFE8',
      fontFamily: 'Arial, Helvetica, sans-serif', color: '#1E293B',
      padding: '48px 24px',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <a href="/" style={{ fontSize: 13, color: '#2563EB', textDecoration: 'none' }}>← Retour</a>
        
        <h1 style={{ fontSize: 28, fontWeight: 700, marginTop: 24, marginBottom: 8, letterSpacing: -0.5 }}>
          Politique de confidentialité
        </h1>
        <p style={{ fontSize: 13, color: '#64748B', marginBottom: 40 }}>Dernière mise à jour : juin 2025</p>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>1. Responsable du traitement</h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151' }}>
            Le responsable du traitement des données personnelles est :<br />
            <strong>Quentin Brugeille</strong> — <a href="mailto:contact@alertemploi.com" style={{ color: '#2563EB' }}>contact@alertemploi.com</a>
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>2. Données collectées</h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151' }}>
            Nous collectons les données suivantes :
          </p>
          <ul style={{ fontSize: 14, lineHeight: 1.8, color: '#374151', paddingLeft: 20, marginTop: 8 }}>
            <li><strong>Adresse email</strong> — pour créer votre compte et vous envoyer des alertes</li>
            <li><strong>URLs de recherche</strong> — pour configurer vos alertes emploi</li>
            <li><strong>Données de paiement</strong> — traitées par Stripe, nous ne stockons pas vos coordonnées bancaires</li>
            <li><strong>Données de navigation</strong> — logs techniques pour le bon fonctionnement du service</li>
          </ul>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>3. Finalités du traitement</h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151' }}>
            Vos données sont utilisées pour :
          </p>
          <ul style={{ fontSize: 14, lineHeight: 1.8, color: '#374151', paddingLeft: 20, marginTop: 8 }}>
            <li>Créer et gérer votre compte utilisateur</li>
            <li>Vous envoyer des alertes emploi par email</li>
            <li>Gérer votre abonnement et les paiements</li>
            <li>Améliorer le service</li>
          </ul>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>4. Base légale</h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151' }}>
            Le traitement est fondé sur l'exécution du contrat (service d'alertes emploi) et votre consentement pour les communications marketing.
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>5. Conservation des données</h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151' }}>
            Vos données sont conservées pendant toute la durée de votre compte, puis supprimées dans un délai de 30 jours après la clôture de votre compte, sauf obligations légales contraires.
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>6. Sous-traitants</h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151' }}>
            Nous utilisons les services tiers suivants :
          </p>
          <ul style={{ fontSize: 14, lineHeight: 1.8, color: '#374151', paddingLeft: 20, marginTop: 8 }}>
            <li><strong>Supabase</strong> — hébergement base de données (UE)</li>
            <li><strong>Vercel</strong> — hébergement application</li>
            <li><strong>Stripe</strong> — paiements en ligne</li>
            <li><strong>MailerSend</strong> — envoi d'emails</li>
          </ul>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>7. Vos droits</h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151' }}>
            Conformément au RGPD, vous disposez des droits suivants :
          </p>
          <ul style={{ fontSize: 14, lineHeight: 1.8, color: '#374151', paddingLeft: 20, marginTop: 8 }}>
            <li><strong>Droit d'accès</strong> — obtenir une copie de vos données</li>
            <li><strong>Droit de rectification</strong> — corriger vos données inexactes</li>
            <li><strong>Droit à l'effacement</strong> — demander la suppression de vos données</li>
            <li><strong>Droit à la portabilité</strong> — recevoir vos données dans un format structuré</li>
            <li><strong>Droit d'opposition</strong> — vous opposer à certains traitements</li>
          </ul>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151', marginTop: 12 }}>
            Pour exercer ces droits, contactez-nous à <a href="mailto:contact@alertemploi.com" style={{ color: '#2563EB' }}>contact@alertemploi.com</a>. Vous pouvez également introduire une réclamation auprès de la <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={{ color: '#2563EB' }}>CNIL</a>.
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>8. Cookies</h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151' }}>
            Nous utilisons uniquement des cookies techniques nécessaires au fonctionnement du service (session, authentification). Aucun cookie publicitaire ou de tracking n'est utilisé.
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>9. Contact</h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151' }}>
            Pour toute question relative à la protection de vos données :<br />
            <a href="mailto:contact@alertemploi.com" style={{ color: '#2563EB' }}>contact@alertemploi.com</a>
          </p>
        </section>
      </div>
    </main>
  );
}

