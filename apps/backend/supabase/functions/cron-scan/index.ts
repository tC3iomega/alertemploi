import { Link, SiteProvider } from '@alertemploi/core';
import { getExceptionMessage } from '@alertemploi/core';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

import { CORS_HEADERS } from '../_shared/cors.ts';
import { parseEnv } from '../_shared/env.ts';
import { parseJobsListUrl } from '../_shared/jobListParser.ts';
import { createLoggerWithMeta } from '../_shared/logger.ts';

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
    const { data: links, error: linksError } = await supabaseAdmin
      .from('links')
      .select('*, user:user_id(id, email)');
    if (linksError) throw new Error(linksError.message);

    logger.info(`cron-scan: found ${links.length} links to scan`);

    // Récupérer tous les sites
    const { data: sitesData, error: sitesError } = await supabaseAdmin.from('sites').select('*');
    if (sitesError) throw new Error(sitesError.message);
    const allJobSites = sitesData ?? [];

    let totalNewJobs = 0;

    // Scanner chaque lien
    for (const link of links) {
      try {
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
          user: { id: link.user_id, email: link.user?.email ?? '' },
          env,
        };

        const { jobs, parseFailed } = await parseJobsListUrl({
          allJobSites,
          link: link as Link,
          html: '',
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
