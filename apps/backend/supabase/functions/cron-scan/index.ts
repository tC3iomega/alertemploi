import { Link, SiteProvider } from '@alertemploi/core';
import { getExceptionMessage } from '@alertemploi/core';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

import { CORS_HEADERS } from '../_shared/cors.ts';
import { parseEnv } from '../_shared/env.ts';
import { fetchLinkContent } from '../_shared/fetchLinkContent.ts';
import { parseJobsListUrl } from '../_shared/jobListParser.ts';
import { createLoggerWithMeta } from '../_shared/logger.ts';
import { checkUserSubscription } from '../_shared/subscription.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  const logger = createLoggerWithMeta({ function: 'cron-scan' });

  // Vérifier le webhook secret pour sécuriser le cron
  const authHeader = req.headers.get('Authorization');
  const env = parseEnv();
  if (authHeader !== `Bearer ${env.f2aWebhookSecret}`) {
    logger.error('Unauthorized cron-scan call');
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const supabaseAdmin = createClient(env.supabaseUrl, env.supabaseServiceRoleKey);
try {
    logger.info('cron-scan: starting...');

    // Récupérer tous les liens actifs avec leurs users
    //
    // Note: cannot embed `user:user_id(id, email)` here — user_id references
    // auth.users, which isn't part of the exposed API schema, so PostgREST can never
    // resolve that relationship ("Could not find a relationship between 'links' and
    // 'user_id' in the schema cache"). The embedded email was unused anyway (only
    // context.user.id matters downstream), so just drop it instead of joining separately.
    const { data: links, error: linksError } = await supabaseAdmin.from('links').select('*');
    if (linksError) throw new Error(linksError.message);

    logger.info(`cron-scan: found ${links.length} links to scan`);

    // Récupérer tous les sites
    const { data: sitesData, error: sitesError } = await supabaseAdmin.from('sites').select('*');
    if (sitesError) throw new Error(sitesError.message);
    const allJobSites = sitesData ?? [];

    let totalNewJobs = 0;
    // Caches the trial/subscription check per user for this run, since several links can
    // belong to the same account and checkUserSubscription hits the database each time.
    const subscriptionExpiredByUser = new Map<string, boolean>();

    // Scanner chaque lien
    for (const link of links) {
      try {
        let subscriptionHasExpired = subscriptionExpiredByUser.get(link.user_id);
        if (subscriptionHasExpired === undefined) {
          const result = await checkUserSubscription({ supabaseAdminClient: supabaseAdmin, userId: link.user_id });
          subscriptionHasExpired = result.subscriptionHasExpired;
          subscriptionExpiredByUser.set(link.user_id, subscriptionHasExpired);
        }
        if (subscriptionHasExpired) {
          logger.info(`cron-scan: skipping link ${link.id}, subscription expired for user ${link.user_id}`);
          continue;
        }

        logger.info(`cron-scan: scanning link ${link.id} (${link.url})`);

        // Créer un client Supabase au nom de l'utilisateur
        const userSupabase = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
          global: {
            headers: { 'x-user-id': link.user_id },
          },
        });

        const context = {
          logger,
          supabaseClient: userSupabase,
          supabaseAdminClient: supabaseAdmin,
          user: { id: link.user_id, email: '' },
          env,
        };

        const targetSite = allJobSites.find((s) => s.id === link.site_id);
        if (!targetSite) {
          logger.error(`cron-scan: site not found for link ${link.id}`);
          continue;
        }

        // LinkedIn/Indeed go through the JobSpy worker (returns jobs directly);
        // HelloWork/WTTJ/Cadremploi need Browserless/a direct fetch first — cron-scan has
        // no client-supplied html, unlike scan-urls, so it must always fetch it itself.
        const fetched = await fetchLinkContent({
          link: link as Link,
          site: targetSite,
          env,
          logger,
        });

        const { jobs, parseFailed } = fetched.jobs
          ? { jobs: fetched.jobs, parseFailed: false }
          : await parseJobsListUrl({
              allJobSites,
              link: link as Link,
              html: fetched.html,
              webPageRuntimeData: {},
              context,
            });
if (parseFailed) {
          logger.error(`cron-scan: parse failed for link ${link.id}`);
          await supabaseAdmin
            .from('links')
            .update({ scrape_failure_count: (link.scrape_failure_count ?? 0) + 1 })
            .eq('id', link.id);
          continue;
        }

        if (jobs.length === 0) {
          logger.info(`cron-scan: no new jobs for link ${link.id}`);
          continue;
        }

        // Insérer les jobs
        jobs.forEach((job) => { job.link_id = link.id; });

        const { data: upsertedJobs, error: insertError } = await supabaseAdmin
          .from('jobs')
          .upsert(
            jobs.map((job) => ({
              ...job,
              status: 'new' as const,
              tags: job.tags || [],
            })),
            { onConflict: 'user_id, externalId', ignoreDuplicates: true },
          )
          .select('*');

        if (insertError) throw new Error(insertError.message);

        const newCount = upsertedJobs?.length ?? 0;
        totalNewJobs += newCount;
        logger.info(`cron-scan: inserted ${newCount} new jobs for link ${link.id}`);

        // Mettre à jour last_scraped_at
        await supabaseAdmin
          .from('links')
          .update({ last_scraped_at: new Date().toISOString(), scrape_failure_count: 0 })
          .eq('id', link.id);

      } catch (linkError) {
        logger.error(`cron-scan: error scanning link ${link.id}: ${getExceptionMessage(linkError)}`);
      }
    }

    logger.info(`cron-scan: done. Total new jobs: ${totalNewJobs}`);
    return new Response(JSON.stringify({ totalNewJobs }), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });

  } catch (error) {
    logger.error(`cron-scan error: ${getExceptionMessage(error)}`);
    return new Response(JSON.stringify({ errorMessage: getExceptionMessage(error, true) }), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }
});
