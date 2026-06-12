'use client';

import { useState } from 'react';
import Link from 'next/link';

const JOB_BOARDS = ['France Travail', 'APEC', 'Cadremploi', 'HelloWork', 'Welcome to the Jungle'];

const FEATURES = [
  {
    title: 'Scan toutes les heures',
    desc: 'Vos alertes sont analysées 24h/24, 7j/7. Les nouvelles offres sont détectées dès leur publication.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="#2563EB" strokeWidth="1.5" />
        <circle cx="10" cy="10" r="3" fill="#2563EB" />
        <line x1="15.5" y1="4.5" x2="19" y2="1.5" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="19.5" cy="1" r="1.5" fill="#F59E0B" />
      </svg>
    ),
  },
  {
    title: 'Alertes par email',
    desc: 'Recevez un récapitulatif des nouvelles offres directement dans votre boîte mail, sans vous connecter.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="4" width="16" height="12" rx="2" stroke="#2563EB" strokeWidth="1.5" />
        <polyline points="2,4 10,11 18,4" stroke="#2563EB" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: '5 job boards français',
    desc: `France Travail, APEC, Cadremploi, HelloWork et Welcome to the Jungle. D'autres arrivent bientôt.`,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="16" height="16" rx="3" stroke="#2563EB" strokeWidth="1.5" />
        <line x1="6" y1="7" x2="14" y2="7" stroke="#2563EB" strokeWidth="1.5" />
        <line x1="6" y1="10" x2="11" y2="10" stroke="#2563EB" strokeWidth="1.5" />
        <line x1="6" y1="13" x2="9" y2="13" stroke="#2563EB" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: 'Vos critères exacts',
    desc: `Collez l'URL de votre recherche sur chaque site. Alertemploi surveille exactement ce que vous cherchez.`,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="9" cy="9" r="6" stroke="#2563EB" strokeWidth="1.5" />
        <line x1="13.5" y1="13.5" x2="18" y2="18" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Aucune offre manquée',
    desc: 'Les offres publiées tôt le matin sont détectées avant même votre réveil. Postulez en premier.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="#2563EB" strokeWidth="1.5" />
        <polyline points="7,10 9,12 13,8" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Tableau de bord complet',
    desc: 'Consultez, annotez et gérez toutes vos offres depuis un espace centralisé, à tout moment.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="2" width="14" height="16" rx="2" stroke="#2563EB" strokeWidth="1.5" />
        <line x1="6" y1="7" x2="14" y2="7" stroke="#2563EB" strokeWidth="1.5" />
        <line x1="6" y1="10" x2="14" y2="10" stroke="#2563EB" strokeWidth="1.5" />
        <line x1="6" y1="13" x2="10" y2="13" stroke="#2563EB" strokeWidth="1.5" />
      </svg>
    ),
  },
];

const FAQS = [
  {
    q: "Comment fonctionne Alertemploi ?",
    a: "Vous ajoutez l'URL de votre recherche sur un job board. Alertemploi la scanne toutes les heures et vous envoie un email dès qu'une nouvelle offre apparaît.",
  },
  {
    q: "Faut-il une carte bancaire pour l'essai gratuit ?",
    a: "Une carte bancaire est demandée à l'inscription au plan Pro. Vous ne serez pas débité pendant les 14 jours d'essai, et vous pouvez annuler à tout moment.",
  },
  {
    q: "Quels job boards sont supportés ?",
    a: "France Travail, APEC, Cadremploi, HelloWork et Welcome to the Jungle. D'autres sont en cours d'intégration.",
  },
  {
    q: "Puis-je annuler à tout moment ?",
    a: "Oui, sans engagement. Vous pouvez annuler votre abonnement depuis votre espace personnel à tout moment.",
  },
  {
    q: "Quelle est la différence entre le plan gratuit et Pro ?",
    a: "Le plan gratuit permet de créer 2 alertes sur 3 job boards. Le plan Pro donne accès aux alertes illimitées, tous les job boards et les notifications email.",
  },
];

function Logo({ size = 'md', theme = 'light' }: { size?: 'sm' | 'md'; theme?: 'light' | 'dark' }) {
  const s = size === 'sm' ? 0.75 : 1;
  const textColor = theme === 'dark' ? '#94A3B8' : '#1E293B';
  const blueColor = theme === 'dark' ? '#60A5FA' : '#2563EB';
  const strokeColor = theme === 'dark' ? '#60A5FA' : '#2563EB';
  return (
    <svg width={160 * s} height={36 * s} viewBox="0 0 160 36" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="18" r="13" fill="none" stroke={strokeColor} strokeWidth="2.5" />
      <circle cx="16" cy="18" r="4.5" fill={strokeColor} />
      <line x1="25" y1="9" x2="31" y2="4" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32.5" cy="3" r="4" fill="#F59E0B" />
      <text x="44" y="23" fontFamily="Arial, sans-serif" fontSize="19" fontWeight="700" fill={textColor} letterSpacing="-0.5">
        alert<tspan fill={blueColor}>emploi</tspan>
      </text>
      <text x="45" y="33" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="400" fill={theme === 'dark' ? '#475569' : '#94A3B8'} letterSpacing="1.2">
        TROUVEZ EN PREMIER
      </text>
    </svg>
  );
}

export default function LandingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: 'Arial, Helvetica, sans-serif', color: '#1E293B', background: '#F1EFE8' }}>

      {/* NAV */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 48px', borderBottom: '0.5px solid #E2E8F0',
        background: '#F1EFE8', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link href="/" style={{ textDecoration: "none" }}><Logo /></Link>
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          <a href="#features" style={{ fontSize: 14, color: '#64748B', textDecoration: 'none' }}>Fonctionnalités</a>
          <a href="#pricing" style={{ fontSize: 14, color: '#64748B', textDecoration: 'none' }}>Tarifs</a>
          <a href="#faq" style={{ fontSize: 14, color: '#64748B', textDecoration: 'none' }}>FAQ</a>
          <Link href="/auth/login" style={{
            fontSize: 14, fontWeight: 500, color: '#2563EB',
            padding: '8px 18px', borderRadius: 8, border: '1.5px solid #2563EB',
            textDecoration: 'none', background: 'transparent',
          }}>Se connecter</Link>
          <Link href="/auth/login" style={{
            fontSize: 14, fontWeight: 500, color: 'white',
            padding: '8px 18px', borderRadius: 8, background: '#2563EB',
            textDecoration: 'none',
          }}>Commencer</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: '#F1EFE8', padding: '80px 48px 64px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block', background: '#FFFBEB', color: '#B45309',
          fontSize: 12, fontWeight: 500, padding: '5px 16px', borderRadius: 20,
          border: '1px solid #FCD34D', marginBottom: 28,
        }}>
          Essai gratuit 14 jours
        </div>

        <h1 style={{
          fontSize: 52, fontWeight: 700, color: '#1E293B',
          lineHeight: 1.1, letterSpacing: -1.5, marginBottom: 20,
          maxWidth: 700, margin: '0 auto 20px',
        }}>
          Soyez alerté en premier<br />
          <span style={{ color: '#2563EB' }}>dès qu'une offre apparaît</span>
        </h1>

        <p style={{
          fontSize: 18, color: '#64748B', lineHeight: 1.65,
          maxWidth: 540, margin: '0 auto 36px',
        }}>
          Alertemploi surveille France Travail, APEC, Cadremploi et d'autres en continu.
          Recevez un email dès qu'une offre correspond à vos critères.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 52 }}>
          <Link href="/auth/login" style={{
            fontSize: 16, fontWeight: 600, color: 'white',
            padding: '14px 32px', borderRadius: 10, background: '#2563EB',
            textDecoration: 'none',
          }}>Créer mon alerte gratuite</Link>
          <a href="#features" style={{
            fontSize: 16, fontWeight: 500, color: '#2563EB',
            padding: '14px 32px', borderRadius: 10, background: 'white',
            border: '1.5px solid #2563EB', textDecoration: 'none',
          }}>Voir comment ça marche</a>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: '#94A3B8', marginRight: 4 }}>Surveille</span>
          {JOB_BOARDS.map((board) => (
            <span key={board} style={{
              background: 'white', border: '0.5px solid #E2E8F0',
              borderRadius: 20, padding: '5px 14px', fontSize: 12,
              color: '#475569', fontWeight: 500,
            }}>{board}</span>
          ))}
        </div>
      </section>

      {/* APP PREVIEW */}
      <section style={{ background: '#F1EFE8', padding: '0 48px 72px', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: '100%', maxWidth: 780, background: 'white',
          borderRadius: 14, border: '0.5px solid #E2E8F0',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)', overflow: 'hidden',
        }}>
          <div style={{ background: '#1E293B', padding: '12px 18px', display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#FF5F57' }} />
            <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#FEBC2E' }} />
            <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#28C840' }} />
            <div style={{
              flex: 1, background: '#334155', borderRadius: 6,
              padding: '4px 14px', fontSize: 11, color: '#94A3B8',
              maxWidth: 280, margin: '0 auto', textAlign: 'center',
            }}>alertemploi.com/jobs/list/new</div>
          </div>
          <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[
              { title: 'Développeur React — Paris', company: 'Société Générale', type: 'CDI' },
              { title: 'Product Manager Senior', company: 'BNP Paribas', type: 'CDI' },
              { title: 'UX Designer — Lyon', company: 'Capgemini', type: 'CDI' },
            ].map((job, i) => (
              <div key={i} style={{
                background: '#F8FAFC', border: '0.5px solid #E2E8F0',
                borderRadius: 10, padding: 14,
              }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#1E293B', marginBottom: 4 }}>{job.title}</div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 8 }}>{job.company} · {job.type}</div>
                <span style={{
                  background: '#DBEAFE', color: '#1E40AF',
                  fontSize: 10, fontWeight: 500, padding: '2px 9px', borderRadius: 10,
                }}>Nouveau</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '80px 48px', background: 'white' }}>
        <h2 style={{ fontSize: 30, fontWeight: 700, textAlign: 'center', marginBottom: 10, letterSpacing: -0.5 }}>
          Pourquoi Alertemploi ?
        </h2>
        <p style={{ fontSize: 16, color: '#64748B', textAlign: 'center', marginBottom: 48, maxWidth: 480, margin: '0 auto 48px' }}>
          Arrêtez de vérifier manuellement les sites d'emploi. On s'en occupe.
        </p>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20, maxWidth: 960, margin: '0 auto',
        }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              background: '#F8FAFC', borderRadius: 12, padding: 24,
              border: '0.5px solid #F1F5F9',
            }}>
              <div style={{
                width: 40, height: 40, background: '#DBEAFE',
                borderRadius: 10, display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginBottom: 14,
              }}>{f.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* JOB BOARDS */}
      <section style={{ padding: '64px 48px', background: '#F1EFE8', textAlign: 'center' }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 10, letterSpacing: -0.3 }}>
          Les sites surveillés
        </h2>
        <p style={{ fontSize: 15, color: '#64748B', marginBottom: 32 }}>
          5 job boards français — d'autres arrivent bientôt.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {JOB_BOARDS.map((board) => (
            <div key={board} style={{
              background: 'white', border: '0.5px solid #E2E8F0',
              borderRadius: 10, padding: '12px 24px',
              fontSize: 14, fontWeight: 500, color: '#475569',
            }}>{board}</div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '80px 48px', background: 'white' }}>
        <h2 style={{ fontSize: 30, fontWeight: 700, textAlign: 'center', marginBottom: 10, letterSpacing: -0.5 }}>
          Tarifs simples
        </h2>
        <p style={{ fontSize: 16, color: '#64748B', textAlign: 'center', marginBottom: 36 }}>
          Commencez gratuitement, passez Pro quand vous êtes prêt.
        </p>

        {/* Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 44 }}>
          <span style={{ fontSize: 14, fontWeight: isAnnual ? 400 : 500, color: isAnnual ? '#64748B' : '#1E293B' }}>
            Mensuel
          </span>
          <div
            onClick={() => setIsAnnual(!isAnnual)}
            style={{
              width: 48, height: 26, background: '#2563EB',
              borderRadius: 13, position: 'relative', cursor: 'pointer', flexShrink: 0,
            }}
          >
            <div style={{
              width: 20, height: 20, background: 'white',
              borderRadius: '50%', position: 'absolute', top: 3,
              left: isAnnual ? 25 : 3, transition: 'left 0.2s',
            }} />
          </div>
          <span style={{ fontSize: 14, fontWeight: isAnnual ? 500 : 400, color: isAnnual ? '#1E293B' : '#64748B' }}>
            Annuel
          </span>
          <span style={{
            background: '#DCFCE7', color: '#166534',
            fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 10,
          }}>-34%</span>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 24, maxWidth: 580, margin: '0 auto',
        }}>
          {/* Free */}
          <div style={{ border: '0.5px solid #E2E8F0', borderRadius: 14, padding: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#64748B', marginBottom: 10 }}>Gratuit</div>
            <div style={{ fontSize: 36, fontWeight: 700, marginBottom: 6 }}>
              0€ <span style={{ fontSize: 14, fontWeight: 400, color: '#64748B' }}>/&nbsp;mois</span>
            </div>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 20, lineHeight: 1.5 }}>
              Pour tester et commencer votre recherche.
            </div>
            {['2 alertes', 'Scan toutes les heures', '3 job boards'].map((f) => (
              <div key={f} style={{ fontSize: 13, color: '#64748B', padding: '6px 0', borderBottom: '0.5px solid #F1F5F9', display: 'flex', gap: 8 }}>
                <span style={{ color: '#2563EB', fontWeight: 700 }}>✓</span> {f}
              </div>
            ))}
            <Link href="/auth/login" style={{
              display: 'block', textAlign: 'center', marginTop: 22,
              padding: '11px 0', borderRadius: 9, fontSize: 13, fontWeight: 500,
              border: '1px solid #E2E8F0', color: '#475569', textDecoration: 'none',
            }}>Commencer gratuitement</Link>
          </div>

          {/* Pro */}
          <div style={{ border: '2px solid #2563EB', borderRadius: 14, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#64748B' }}>Pro</div>
              <span style={{
                background: '#DBEAFE', color: '#1E40AF',
                fontSize: 10, fontWeight: 500, padding: '3px 9px', borderRadius: 10,
              }}>Populaire</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 700, marginBottom: 6 }}>
              {isAnnual ? '79€' : '9,99€'}{' '}
              <span style={{ fontSize: 14, fontWeight: 400, color: '#64748B' }}>
                /{isAnnual ? ' an' : ' mois'}
              </span>
            </div>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 20, lineHeight: 1.5 }}>
              {isAnnual ? 'Soit 6,58€/mois — 2 mois offerts.' : 'Essai gratuit 14 jours inclus.'}
            </div>
            {['Alertes illimitées', 'Tous les job boards', 'Alertes email', 'Essai 14 jours gratuit'].map((f) => (
              <div key={f} style={{ fontSize: 13, color: '#64748B', padding: '6px 0', borderBottom: '0.5px solid #F1F5F9', display: 'flex', gap: 8 }}>
                <span style={{ color: '#2563EB', fontWeight: 700 }}>✓</span> {f}
              </div>
            ))}
            <Link href="/upgrade" style={{
              display: 'block', textAlign: 'center', marginTop: 22,
              padding: '11px 0', borderRadius: 9, fontSize: 13, fontWeight: 600,
              background: '#2563EB', color: 'white', textDecoration: 'none',
            }}>Démarrer l'essai gratuit</Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '80px 48px', background: '#F1EFE8' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontSize: 30, fontWeight: 700, marginBottom: 36, letterSpacing: -0.5 }}>
            Questions fréquentes
          </h2>
          {FAQS.map((item, i) => (
            <div
              key={i}
              style={{ borderBottom: '0.5px solid #CBD5E1', paddingBottom: 4 }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', padding: '18px 0', background: 'none',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 500, color: '#1E293B' }}>{item.q}</span>
                <span style={{
                  fontSize: 20, color: '#2563EB', fontWeight: 300,
                  transform: openFaq === i ? 'rotate(45deg)' : 'none',
                  transition: 'transform 0.2s', flexShrink: 0, marginLeft: 16,
                }}>+</span>
              </button>
              {openFaq === i && (
                <div style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7, paddingBottom: 18 }}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ background: '#2563EB', padding: '80px 48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, color: 'white', marginBottom: 14, letterSpacing: -0.5 }}>
          Commencez votre recherche maintenant
        </h2>
        <p style={{ fontSize: 16, color: '#BFDBFE', marginBottom: 32 }}>
          Rejoignez les candidats qui reçoivent les offres en premier.
        </p>
        <Link href="/auth/login" style={{
          display: 'inline-block', background: 'white', color: '#2563EB',
          fontSize: 16, fontWeight: 600, padding: '14px 36px',
          borderRadius: 10, textDecoration: 'none',
        }}>Créer mon compte gratuit</Link>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: '#1E293B', padding: '28px 48px',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: 12,
      }}>
        <Logo theme="dark" size="sm" />
        <div style={{ fontSize: 12, color: '#475569' }}>
          © 2025 Alertemploi —{' '}
          <a href="/legal" style={{ color: '#475569', textDecoration: 'none' }}>Mentions légales</a>
          {' · '}
          <a href="/privacy" style={{ color: '#475569', textDecoration: 'none' }}>Confidentialité</a>
        </div>
      </footer>

    </div>
  );
}
