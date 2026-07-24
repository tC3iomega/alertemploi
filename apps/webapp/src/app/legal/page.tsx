export default function MentionsLegalesPage() {
  return (
    <main style={{
      minHeight: '100vh', background: '#F1EFE8',
      fontFamily: 'Arial, Helvetica, sans-serif', color: '#1E293B',
      padding: '48px 24px',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <a href="/" style={{ fontSize: 13, color: '#2563EB', textDecoration: 'none' }}>← Retour</a>
        
        <h1 style={{ fontSize: 28, fontWeight: 700, marginTop: 24, marginBottom: 8, letterSpacing: -0.5 }}>
          Mentions légales
        </h1>
        <p style={{ fontSize: 13, color: '#64748B', marginBottom: 40 }}>Dernière mise à jour : juillet 2026</p>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Éditeur du site</h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151' }}>
            Le site <strong>alertemploi.com</strong> est édité par :<br />
            <strong>Quentin Brugeille</strong><br />
            Entrepreneur individuel<br />
            France<br />
            Contact : <a href="mailto:contact@alertemploi.com" style={{ color: '#2563EB' }}>contact@alertemploi.com</a>
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Hébergement</h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151' }}>
            Le site est hébergé par :<br />
            <strong>Vercel Inc.</strong><br />
            440 N Barranca Ave #4133, Covina, CA 91723, États-Unis<br />
            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={{ color: '#2563EB' }}>vercel.com</a>
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Propriété intellectuelle</h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151' }}>
            L'ensemble du contenu de ce site (textes, images, logos, code source) est la propriété exclusive d'Alertemploi, sauf mention contraire. Toute reproduction, distribution ou utilisation sans autorisation préalable est interdite.
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Limitation de responsabilité</h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151' }}>
            Alertemploi agrège des offres d'emploi provenant de sites tiers. Nous ne sommes pas responsables de l'exactitude, de la disponibilité ou du contenu des offres affichées. Les offres sont fournies à titre informatif uniquement.
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Droit applicable</h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151' }}>
            Les présentes mentions légales sont soumises au droit français. Tout litige relatif à leur interprétation ou exécution relève des tribunaux compétents de France.
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Contact</h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151' }}>
            Pour toute question concernant ce site, contactez-nous à :<br />
            <a href="mailto:contact@alertemploi.com" style={{ color: '#2563EB' }}>contact@alertemploi.com</a>
          </p>
        </section>
      </div>
    </main>
  );
}

