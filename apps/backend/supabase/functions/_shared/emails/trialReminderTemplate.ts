// Exported from the MailerSend template of the same name before the free-plan
// downgrade deleted it (the free plan keeps a single template, kept for job alerts).
// Rendered by renderMailerSendTemplate().
export const TRIAL_REMINDER_HTML = `<!DOCTYPE html>
<html>
<head><!--{{head_top}}-->
<meta>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Rappel essai gratuit</title>
<style>
  body { margin: 0; padding: 0; background: #F1EFE8; font-family: Arial, Helvetica, sans-serif; }
  .wrapper { max-width: 600px; margin: 0 auto; padding: 32px 16px; }
  .card { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
  .header { background: #1E293B; padding: 28px 32px; display: flex; align-items: center; gap: 16px; }
  .header-text h1 { margin: 0; color: #ffffff; font-size: 18px; font-weight: 700; }
  .header-text p { margin: 4px 0 0; color: #94A3B8; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; }
  .hero { background: {{ hero_bg }}; padding: 32px 32px 28px; text-align: center; border-bottom: 1px solid {{ hero_border }}; }
  .hero .badge { display: inline-block; background: {{ badge_bg }}; color: {{ badge_color }}; font-size: 13px; font-weight: 600; padding: 6px 16px; border-radius: 20px; margin-bottom: 14px; }
  .hero h2 { margin: 0 0 8px; color: #1E293B; font-size: 21px; font-weight: 700; }
  .hero p { margin: 0; color: {{ badge_color }}; font-size: 14px; }
  .body { padding: 32px; }
  .intro { font-size: 15px; color: #374151; line-height: 1.7; margin: 0 0 24px; }
  .benefits { margin: 0 0 28px; }
  .benefit { display: flex; gap: 10px; align-items: flex-start; margin-bottom: 14px; font-size: 14px; color: #374151; }
  .benefit .check { color: #2563EB; font-weight: 700; flex-shrink: 0; }
  .warning-box { background: #FFFBEB; border: 1px solid #FCD34D; border-radius: 10px; padding: 16px 18px; margin-bottom: 24px; }
  .warning-box p { margin: 0; font-size: 13px; color: #92400E; line-height: 1.6; }
  .cta { text-align: center; margin: 28px 0 8px; }
  .cta a { display: inline-block; background: #2563EB; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 36px; border-radius: 9px; }
  .price-note { text-align: center; font-size: 12px; color: #94A3B8; margin-top: 12px; }
  .footer { background: #F8FAFC; padding: 20px 32px; border-top: 1px solid #F1F5F9; }
  .footer p { font-size: 11px; color: #94A3B8; margin: 0; line-height: 1.7; }
  .footer a { color: #64748B; text-decoration: none; }
</style>
<!--{{head_bottom}}--></head>
<body class="" style=""><!--{{body_top}}-->
    




    
        
    
    
        
            
        

        
            
        

        
            
        
    
    
        
    

    
<div class="wrapper">
  <div class="card">

    <div class="header">
      
        
        
        
        
      
      <div class="header-text">
        <h1>alert<span style="color:#2563EB">emploi</span></h1>
        <p>Trouvez en premier</p>
      </div>
    </div>

    <div class="hero">
      <span class="badge">{{ badge_text }}</span>
      <h2>{{ title }}</h2>
      <p>{{ subtitle }}</p>
    </div>

    <div class="body">
      <p class="intro">{{ intro_text }}</p>

      {% if show_benefits %}
      <div class="benefits">
        <div class="benefit"><span class="check">✓</span> Alertes illimitées sur tous les job boards</div>
        <div class="benefit"><span class="check">✓</span> Scan toutes les 30 minutes</div>
        <div class="benefit"><span class="check">✓</span> Notifications email instantanées</div>
        <div class="benefit"><span class="check">✓</span> Accès à LinkedIn, Indeed, France Travail, APEC et plus</div>
      </div>
      {% endif %}

      {% if show_warning %}
      <div class="warning-box">
        <p><strong>Sans abonnement Pro</strong>, vous perdrez l'accès aux alertes illimitées, à LinkedIn, Indeed et au scan toutes les 30 minutes.</p>
      </div>
      {% endif %}

      <div class="cta">
        <a href="https://alertemploi.com/upgrade">{{ cta_text }}</a>
      </div>
      <p class="price-note">À partir de 9,99€/mois — annulable à tout moment</p>
    </div>

    <div class="footer">
      <p>
        Vous recevez cet email concernant votre essai gratuit Alertemploi.<br>
        Des questions ? <a href="mailto:contact@alertemploi.com">contact@alertemploi.com</a>
      </p>
    </div>

  </div>
</div>


    

<style type="text/css">

    @media only screen and (max-width: 640px) {
        .mlContentTable {
            width: 100% !important;
            min-width: 10% !important;
            margin: 0 !important;
            float: none !important;
        }
    }
</style>


<!--{{body_bottom}}--></body>
</html>
`;
