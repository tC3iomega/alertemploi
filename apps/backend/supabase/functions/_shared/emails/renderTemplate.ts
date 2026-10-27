/**
 * Minimal renderer for the MailerSend template syntax, so the designs can live in the repo
 * instead of the provider.
 *
 * The free MailerSend plan keeps a single template, and the extra ones are deleted for good.
 * The HTML of each template was exported to `mailersend-templates/` and is rendered here with
 * the same payloads the templates expected: `{{ var }}` substitution and `{% if var %}…{% endif %}`
 * blocks. Loops (`{% for %}`) are not supported — the job alert keeps the real template.
 */
export type TemplateValues = Record<string, string | number | boolean | undefined>;

export function renderMailerSendTemplate(html: string, values: TemplateValues): string {
  let out = html;

  // {% if name %} ... {% endif %} — non nested, which is all these templates use.
  out = out.replace(/\{%\s*if\s+([\w.]+)\s*%\}([\s\S]*?)\{%\s*endif\s*%\}/g, (_match, name: string, body: string) =>
    values[name] ? body : '',
  );

  // {{ name }}
  out = out.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (match, name: string) => {
    const value = values[name];
    if (value === undefined) {
      // MailerSend injects its own tracking/footer markers (head_top, body_bottom, ...);
      // they have no meaning outside their renderer, so drop them.
      return /^(head|body)_(top|bottom)$/.test(name) ? '' : match;
    }
    return String(value);
  });

  return out;
}
