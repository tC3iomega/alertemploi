export const REVIEW_REQUEST_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Votre avis sur Alertemploi</title>
<style>
  body { margin: 0; padding: 0; background: #F1EFE8; font-family: Arial, Helvetica, sans-serif; }
  .wrapper { max-width: 600px; margin: 0 auto; padding: 32px 16px; }
  .card { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
  .header { background: #1E293B; padding: 28px 32px; }
  .header h1 { margin: 0; color: #ffffff; font-size: 18px; font-weight: 700; }
  .header p { margin: 4px 0 0; color: #94A3B8; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; }
  .hero { background: #EFF6FF; padding: 32px 32px 28px; text-align: center; border-bottom: 1px solid #BFDBFE; }
  .hero .stars { font-size: 28px; margin-bottom: 14px; }
  .hero h2 { margin: 0 0 8px; color: #1E293B; font-size: 21px; font-weight: 700; }
  .hero p { margin: 0; color: #1E40AF; font-size: 14px; }
  .body { padding: 32px; }
  .intro { font-size: 15px; color: #374151; line-height: 1.7; margin: 0 0 24px; }
  .cta { text-align: center; margin: 28px 0 8px; }
  .cta a { display: inline-block; background: #2563EB; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 36px; border-radius: 9px; }
  .footer { background: #F8FAFC; padding: 20px 32px; border-top: 1px solid #E2E8F0; }
  .footer p { margin: 0; font-size: 12px; color: #94A3B8; text-align: center; line-height: 1.6; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="card">
    <div class="header">
      <h1>alert<span style="color:#2563EB">emploi</span></h1>
      <p>TROUVEZ EN PREMIER</p>
    </div>
    <div class="hero">
      <div class="stars">⭐⭐⭐⭐⭐</div>
      <h2>Votre avis nous aide</h2>
      <p>2 minutes pour améliorer Alertemploi</p>
    </div>
    <div class="body">
      <p class="intro">
        Votre essai Alertemploi est terminé. Que vous ayez trouvé ce que vous cherchiez ou non, votre retour nous aide à améliorer le service pour tous les candidats.
      </p>
      <p class="intro">
        Ça prend moins de 2 minutes — et c'est précieux pour un service qui se lance.
      </p>
      <div class="cta">
        <a href="{{ review_url }}">Laisser mon avis</a>
      </div>
      <p style="text-align:center; font-size:12px; color:#94A3B8; margin-top:12px;">
        Lien valide à tout moment · Aucune obligation
      </p>
    </div>
    <div class="footer">
      <p>
        Alertemploi · <a href="{{ unsubscribe_url }}" style="color:#94A3B8;">Se désabonner</a>
      </p>
    </div>
  </div>
</div>
</body>
</html>`;
