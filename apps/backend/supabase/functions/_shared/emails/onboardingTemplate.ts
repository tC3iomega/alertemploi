export const ONBOARDING_HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Créez votre première alerte emploi</title>
</head>
<body style="margin:0;padding:0;background:#F1EFE8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#F1EFE8;">
  <tr><td align="center" style="padding:40px 16px;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:580px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

      <!-- Header -->
      <tr><td style="background:#1E293B;padding:28px 36px 24px;">
        <div style="font-size:22px;font-weight:700;letter-spacing:-0.5px;">
          <span style="color:#ffffff;">alert</span><span style="color:#2563EB;">emploi</span>
        </div>
        <div style="color:#94A3B8;font-size:12px;margin-top:4px;letter-spacing:1px;text-transform:uppercase;">TROUVEZ EN PREMIER</div>
      </td></tr>

      <!-- Badge -->
      <tr><td style="padding:28px 36px 0;">
        <span style="display:inline-block;background:#DBEAFE;color:#1D4ED8;font-size:12px;font-weight:600;padding:5px 12px;border-radius:20px;letter-spacing:0.3px;">💡 Votre compte est prêt — une étape reste</span>
      </td></tr>

      <!-- Title -->
      <tr><td style="padding:16px 36px 0;">
        <h1 style="margin:0;font-size:24px;font-weight:700;color:#1E293B;line-height:1.3;">
          Créez votre première alerte
        </h1>
        <p style="margin:12px 0 0;font-size:15px;color:#475569;line-height:1.6;">
          Votre essai de 7 jours tourne, mais vous n'avez pas encore créé d'alerte.
          Sans alerte, aucune offre ne vous sera envoyée.
        </p>
      </td></tr>

      <!-- Steps -->
      <tr><td style="padding:24px 36px 0;">
        <div style="background:#F8FAFC;border-radius:8px;padding:20px 24px;border-left:3px solid #2563EB;">
          <p style="margin:0 0 14px;font-size:13px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.5px;">Comment ça marche — 2 minutes</p>

          <div style="display:flex;align-items:flex-start;margin-bottom:12px;">
            <span style="display:inline-block;background:#2563EB;color:#fff;font-size:11px;font-weight:700;width:20px;height:20px;border-radius:50%;text-align:center;line-height:20px;flex-shrink:0;margin-right:12px;">1</span>
            <span style="font-size:14px;color:#334155;line-height:1.5;">Allez sur France Travail, LinkedIn ou WTTJ. Faites votre recherche habituelle (métier + ville).</span>
          </div>

          <div style="display:flex;align-items:flex-start;margin-bottom:12px;">
            <span style="display:inline-block;background:#2563EB;color:#fff;font-size:11px;font-weight:700;width:20px;height:20px;border-radius:50%;text-align:center;line-height:20px;flex-shrink:0;margin-right:12px;">2</span>
            <span style="font-size:14px;color:#334155;line-height:1.5;">Copiez l'adresse de la page de résultats (URL dans la barre de votre navigateur).</span>
          </div>

          <div style="display:flex;align-items:flex-start;">
            <span style="display:inline-block;background:#2563EB;color:#fff;font-size:11px;font-weight:700;width:20px;height:20px;border-radius:50%;text-align:center;line-height:20px;flex-shrink:0;margin-right:12px;">3</span>
            <span style="font-size:14px;color:#334155;line-height:1.5;">Collez cette URL dans Alertemploi. C'est tout — le scan démarre immédiatement.</span>
          </div>
        </div>
      </td></tr>

      <!-- CTA -->
      <tr><td style="padding:28px 36px 0;text-align:center;">
        <a href="https://alertemploi.com/links/new"
           style="display:inline-block;background:#2563EB;color:#ffffff;font-size:15px;font-weight:600;padding:14px 32px;border-radius:8px;text-decoration:none;letter-spacing:0.2px;">
          Créer ma première alerte →
        </a>
        <p style="margin:12px 0 0;font-size:13px;color:#94A3B8;">Scan toutes les 30 min · 7 job boards · sans CB</p>
      </td></tr>

      <!-- Divider + reassurance -->
      <tr><td style="padding:28px 36px 24px;">
        <hr style="border:none;border-top:1px solid #E2E8F0;margin:0 0 20px;" />
        <p style="margin:0;font-size:13px;color:#64748B;line-height:1.6;">
          Alertemploi surveille France Travail, LinkedIn, Indeed, WTTJ, HelloWork, Cadremploi et l'APEC.
          Chaque nouvelle offre correspondant à votre recherche vous est envoyée par email dès sa publication.
        </p>
      </td></tr>

      <!-- Footer -->
      <tr><td style="background:#F8FAFC;padding:16px 36px;border-top:1px solid #E2E8F0;">
        <p style="margin:0;font-size:12px;color:#94A3B8;line-height:1.5;">
          Alertemploi · contact@alertemploi.com<br />
          Vous recevez cet email car vous avez créé un compte sur alertemploi.com.
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

export const ONBOARDING_TEXT = `Créez votre première alerte emploi

Votre essai de 7 jours tourne, mais vous n'avez pas encore créé d'alerte.
Sans alerte, aucune offre ne vous sera envoyée.

Comment faire en 2 minutes :
1. Allez sur France Travail, LinkedIn ou WTTJ. Faites votre recherche habituelle.
2. Copiez l'adresse de la page de résultats (URL dans votre navigateur).
3. Collez cette URL dans Alertemploi : https://alertemploi.com/links/new

Alertemploi surveille 7 job boards toutes les 30 minutes et vous envoie les nouvelles offres par email.

—
Alertemploi · contact@alertemploi.com
`;
