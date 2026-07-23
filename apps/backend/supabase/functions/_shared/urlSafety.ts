/**
 * Blocks the Pro "custom job site" feature from being used to make the server fetch
 * internal/private network targets (SSRF) — e.g. cloud metadata endpoints
 * (169.254.169.254), localhost, or RFC1918 ranges. Known job boards aren't affected:
 * they're matched against a fixed, curated list of external domains (see getJobSite in
 * jobListParser.ts), so only user-supplied "custom" URLs ever reach this check.
 *
 * This blocks the obvious cases (a literal private IP/hostname, or a hostname that
 * currently resolves to one) but does not fully defend against DNS rebinding — a
 * hostname could pass this check at link-creation time and later be repointed at a
 * private IP before a subsequent scheduled scan. Full protection would need to
 * re-validate immediately before every fetch, not just at creation time.
 */

const PRIVATE_IPV4_RANGES: Array<[string, number]> = [
  ['0.0.0.0', 8],
  ['10.0.0.0', 8],
  ['100.64.0.0', 10], // carrier-grade NAT
  ['127.0.0.0', 8],
  ['169.254.0.0', 16], // link-local, incl. cloud metadata (169.254.169.254)
  ['172.16.0.0', 12],
  ['192.0.0.0', 24],
  ['192.168.0.0', 16],
  ['198.18.0.0', 15],
  ['224.0.0.0', 4], // multicast and above
];

function ipv4ToInt(ip: string): number | null {
  const parts = ip.split('.');
  if (parts.length !== 4) return null;
  let n = 0;
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return null;
    const v = Number(part);
    if (v > 255) return null;
    n = (n << 8) | v;
  }
  return n >>> 0;
}

function isPrivateIpv4(ip: string): boolean {
  const n = ipv4ToInt(ip);
  if (n === null) return false;
  return PRIVATE_IPV4_RANGES.some(([base, bits]) => {
    const baseN = ipv4ToInt(base) as number;
    const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
    return (n & mask) === (baseN & mask);
  });
}

function isPrivateIpv6(ip: string): boolean {
  const lower = ip.toLowerCase();
  return (
    lower === '::1' ||
    lower === '::' ||
    /^fe[89ab][0-9a-f]:/.test(lower) || // link-local fe80::/10
    /^f[cd][0-9a-f]{2}:/.test(lower) || // unique local fc00::/7
    lower.startsWith('::ffff:127.') ||
    lower.startsWith('::ffff:10.') ||
    lower.startsWith('::ffff:192.168.') ||
    lower.startsWith('::ffff:169.254.')
  );
}

function isPrivateHost(host: string): boolean {
  return isPrivateIpv4(host) || isPrivateIpv6(host);
}

/**
 * Throws if the given URL points at an internal/private network target, either
 * directly (a literal private IP or localhost) or via DNS resolution.
 */
export async function assertUrlIsPubliclyReachable(url: string): Promise<void> {
  const parsed = new URL(url);
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Only http and https URLs can be scanned.');
  }

  const hostname = parsed.hostname;
  if (hostname === 'localhost' || hostname.endsWith('.localhost') || isPrivateHost(hostname)) {
    throw new Error('This URL points to a local or private network address and cannot be scanned.');
  }

  const resolvedIps: string[] = [];
  const [aResult, aaaaResult] = await Promise.allSettled([
    Deno.resolveDns(hostname, 'A'),
    Deno.resolveDns(hostname, 'AAAA'),
  ]);
  if (aResult.status === 'fulfilled') resolvedIps.push(...aResult.value);
  if (aaaaResult.status === 'fulfilled') resolvedIps.push(...aaaaResult.value);

  if (resolvedIps.length === 0) {
    throw new Error('Could not resolve this URL — please check it is correct.');
  }
  if (resolvedIps.some(isPrivateHost)) {
    throw new Error('This URL resolves to a local or private network address and cannot be scanned.');
  }
}
