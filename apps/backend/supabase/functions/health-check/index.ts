/**
 * Daily health check (pg_cron, 05:00 UTC).
 *
 * Answers one question: "are the job alert emails actually going out?". That pipeline broke
 * silently twice — once because nothing ever called the sending code, once because MailerSend
 * paused the account after the trial ended — and in both cases the product looked fine from
 * the outside while no user received anything.
 *
 * Self-contained on purpose (no ../_shared imports) so it can be deployed on its own.
 */

type Verdict = 'ok' | 'warn' | 'alert';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const MAILERSEND_KEY = Deno.env.get('MAILERSEND_API_KEY') ?? '';
const WEBHOOK_SECRET = Deno.env.get('F2A_WEBHOOK_SECRET') ?? '';
const REPORT_TO = 'brugeillequentin@gmail.com';

async function db(path: string): Promise<unknown[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, Prefer: 'count=exact' },
  });
  if (!res.ok) throw new Error(`db ${path}: ${res.status}`);
  return await res.json();
}

async function mailerSend(path: string): Promise<Record<string, unknown>> {
  const res = await fetch(`https://api.mailersend.com/v1/${path}`, {
    headers: { Authorization: `Bearer ${MAILERSEND_KEY}`, 'Content-Type': 'application/json' },
  });
  return { status: res.status, body: await res.json() };
}

Deno.serve(async (req) => {
  if (req.headers.get('Authorization') !== `Bearer ${WEBHOOK_SECRET}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const problems: string[] = [];
  const facts: string[] = [];
  let verdict: Verdict = 'ok';

  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // --- what the product did in the last 24h -------------------------------------------
    const activeProfiles = (await db(
      `profiles?select=user_id&or=(trial_ends_at.gt.${new Date().toISOString()},subscription_ends_at.gt.${new Date().toISOString()})`,
    )) as { user_id: string }[];
    const activeIds = activeProfiles.map((p) => p.user_id);

    const links = (await db('links?select=user_id')) as { user_id: string }[];
    const activeLinks = links.filter((l) => activeIds.includes(l.user_id));

    const recentJobs = (await db(`jobs?select=id&created_at=gte.${since}`)) as unknown[];

    facts.push(`${activeIds.length} compte(s) actif(s), ${activeLinks.length} alerte(s) scannée(s)`);
    facts.push(`${recentJobs.length} offre(s) trouvée(s) en 24h`);

    // --- what MailerSend actually did -----------------------------------------------------
    const domains = (await mailerSend('domains')) as { status: number; body: Record<string, unknown> };
    const domain = ((domains.body?.data ?? []) as Record<string, unknown>[])[0];
    const paused = (domain?.domain_settings as Record<string, unknown> | undefined)?.send_paused === true;
    if (!domain) {
      problems.push("MailerSend ne renvoie aucun domaine (clé API invalide ?)");
    } else if (paused || domain.is_verified !== true) {
      problems.push(`Domaine MailerSend bloqué : send_paused=${paused}, is_verified=${domain.is_verified}`);
    }

    const msgs = (await mailerSend('messages?limit=25')) as { status: number; body: Record<string, unknown> };
    const recentMessages = ((msgs.body?.data ?? []) as Record<string, unknown>[]).filter(
      (m) => String(m.created_at) >= since,
    );

    // A message with an empty `emails` array is accepted by the API but never actually sent —
    // exactly what happened while the account was paused.
    let delivered = 0;
    let empty = 0;
    for (const m of recentMessages.slice(0, 10)) {
      const detail = (await mailerSend(`messages/${m.id}`)) as { body: Record<string, unknown> };
      const emails = ((detail.body?.data as Record<string, unknown> | undefined)?.emails ?? []) as unknown[];
      if (emails.length === 0) empty++;
      else delivered++;
    }
    facts.push(`${recentMessages.length} email(s) envoyé(s) en 24h (${delivered} traité(s), ${empty} sans destinataire)`);

    if (empty > 0) problems.push(`${empty} email(s) accepté(s) par MailerSend mais jamais expédié(s)`);
    if (recentJobs.length > 0 && recentMessages.length === 0) {
      problems.push(`${recentJobs.length} offres trouvées mais aucun email envoyé`);
    }
    if (activeLinks.length > 0 && recentJobs.length === 0) {
      problems.push('Aucune offre trouvée en 24h alors que des alertes sont actives (scan en panne ?)');
    }

    verdict = problems.length === 0 ? 'ok' : 'alert';
  } catch (error) {
    verdict = 'alert';
    problems.push(`Contrôle en échec : ${error instanceof Error ? error.message : String(error)}`);
  }

  // --- keep a trace, so a missing report is itself visible --------------------------------
  const payload = { verdict, problems, facts, checked_at: new Date().toISOString() };
  await fetch(`${SUPABASE_URL}/rest/v1/health_checks`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ verdict, details: payload }),
  }).catch(() => {});

  // --- report by email --------------------------------------------------------------------
  const subject = verdict === 'ok' ? '[alertemploi] Tout va bien' : '[alertemploi] ⚠️ Les alertes ne partent pas';
  const lines = [
    verdict === 'ok' ? 'Les emails d\'alerte partent normalement.' : 'PROBLÈME DÉTECTÉ :',
    ...problems.map((p) => `- ${p}`),
    '',
    'Constats des dernières 24 h :',
    ...facts.map((f) => `- ${f}`),
  ];
  const text = lines.join('\n');

  await fetch('https://api.mailersend.com/v1/email', {
    method: 'POST',
    headers: { Authorization: `Bearer ${MAILERSEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: { email: 'contact@alertemploi.com', name: 'Alertemploi' },
      to: [{ email: REPORT_TO }],
      subject,
      text,
      html: `<pre style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap;">${text.replace(/</g, '&lt;')}</pre>`,
    }),
  }).catch(() => {});

  return new Response(JSON.stringify(payload, null, 2), { headers: { 'Content-Type': 'application/json' } });
});
